const CACHE_VERSION = "v15";
const APP_SHELL_CACHE = `app-shell-${CACHE_VERSION}`;
const RUNTIME_API_CACHE = `api-${CACHE_VERSION}`;
const ADMIN_API_CACHE = `admin-api-${CACHE_VERSION}`;
const IMAGES_CACHE = `images-${CACHE_VERSION}`;
const STATIC_CACHE = `static-${CACHE_VERSION}`;

const OFFLINE_URL = "/offline";
const MAX_CACHE_SIZE = 50;
const OFFLINE_QUEUE_DB = "pwa-offline-queue";
const OFFLINE_QUEUE_STORE = "pendingOps";
const SYNC_TAG = "pending-ops";

const CORE_ROUTES = ["/", OFFLINE_URL, "/manifest.webmanifest"];
const ADMIN_PAGES = ["/admin", "/admin/activos", "/admin/inactivos", "/admin/ventas"];

async function cleanOldCaches(cacheName) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > MAX_CACHE_SIZE) {
    await cache.delete(keys[0]);
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(APP_SHELL_CACHE)
      .then(async (cache) => {
        await cache.addAll(CORE_ROUTES);
      })
      .then(() => self.skipWaiting()),
  );
});

function openOfflineQueueDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(OFFLINE_QUEUE_DB, 1);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = function (e) {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(OFFLINE_QUEUE_STORE)) {
        db.createObjectStore(OFFLINE_QUEUE_STORE, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };
  });
}

function getAllPendingOps(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OFFLINE_QUEUE_STORE, "readonly");
    const store = tx.objectStore(OFFLINE_QUEUE_STORE);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function deletePendingOp(db, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OFFLINE_QUEUE_STORE, "readwrite");
    const store = tx.objectStore(OFFLINE_QUEUE_STORE);
    store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function replayPendingOps() {
  return openOfflineQueueDb().then((db) => {
    return getAllPendingOps(db).then((ops) => {
      return Promise.all(
        ops.map((op) => {
          const opts = {
            method: op.method,
            credentials: "include",
            headers: new Headers(op.headers || {}),
          };
          if (op.body) opts.body = op.body;
          return fetch(op.url, opts)
            .then((res) => {
              if (res.ok) return deletePendingOp(db, op.id);
            })
            .catch(() => {});
        }),
      ).then(() => {
        db.close();
      });
    });
  });
}

self.addEventListener("sync", (event) => {
  if (event.tag !== SYNC_TAG) return;
  event.waitUntil(replayPendingOps());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                ![
                  APP_SHELL_CACHE,
                  RUNTIME_API_CACHE,
                  ADMIN_API_CACHE,
                  IMAGES_CACHE,
                  STATIC_CACHE,
                ].includes(key),
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isNextStatic(url) {
  return url.pathname.startsWith("/_next/static/");
}

function isNavigationRequest(request) {
  return request.mode === "navigate";
}

function isDocumentPrefetchRequest(request, url) {
  if (request.method !== "GET") return false;
  if (url.origin !== self.location.origin) return false;
  const path = url.pathname;
  if (path.startsWith("/api") || path.startsWith("/_next/static")) return false;
  const accept = request.headers.get("Accept") || "";
  return accept.includes("text/html");
}

function isProductsApi(url) {
  return url.pathname.startsWith("/api/products");
}

function isAdminApi(url) {
  return url.pathname.startsWith("/api/admin");
}

function isSalesApi(url) {
  return url.pathname.startsWith("/api/sales");
}

function isNextImage(url) {
  return url.pathname.startsWith("/_next/image");
}

function isCartApi(url) {
  return url.pathname.startsWith("/api/cart");
}

function isSessionApi(url) {
  return url.pathname === "/api/auth/session";
}

let adminPagesPrecached = false;

async function precacheAdminPages(currentPath) {
  if (adminPagesPrecached) return;
  adminPagesPrecached = true;
  const cache = await caches.open(APP_SHELL_CACHE);
  await Promise.all(
    ADMIN_PAGES.filter((p) => p !== currentPath).map(async (page) => {
      try {
        const res = await fetch(page, { credentials: "include" });
        if (res.ok) await cache.put(page, res);
      } catch {}
    }),
  );
}


self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (isNavigationRequest(request)) {
    if (url.pathname.startsWith("/admin")) {
      event.waitUntil(precacheAdminPages(url.pathname));
    }
    event.respondWith(
      fetch(request)
        .then(async (res) => {
          if (res.ok) {
            const resClone = res.clone();
            const cache = await caches.open(APP_SHELL_CACHE);
            await cache.put(request, resClone);
          }
          return res;
        })
        .catch(async () => {
          const cache = await caches.open(APP_SHELL_CACHE);
          const cached = await cache.match(request);
          if (cached) return cached;
          if (url.pathname.startsWith("/admin")) {
            for (const page of ADMIN_PAGES) {
              const fallback = await cache.match(page);
              if (fallback) return fallback;
            }
          }
          const offlinePage = await caches.match(OFFLINE_URL);
          return offlinePage || new Response("Offline", { status: 503 });
        }),
    );
    return;
  }


  if (url.pathname === "/api/auth/csrf") {
    event.respondWith(
      fetch(request)
        .then(async (res) => {
          if (res.ok) {
            const cache = await caches.open(RUNTIME_API_CACHE);
            await cache.put(request, res.clone());
          }
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return new Response(JSON.stringify({ csrfToken: "" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }),
    );
    return;
  }

  if (url.pathname === "/api/auth/signout" && request.method === "POST") {
    const clearSessionCache = async () => {
      const cache = await caches.open(RUNTIME_API_CACHE);
      const keys = await cache.keys();
      await Promise.all(
        keys
          .filter((k) => new URL(k.url).pathname === "/api/auth/session")
          .map((k) => cache.delete(k)),
      );
    };
    event.respondWith(
      fetch(request)
        .then(async (res) => {
          await clearSessionCache();
          return res;
        })
        .catch(async () => {
          await clearSessionCache();
          return new Response(JSON.stringify({ url: "/login" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }),
    );
    return;
  }

  if (isSessionApi(url)) {
    event.respondWith(
      fetch(request)
        .then(async (res) => {
          if (res.ok) {
            const cache = await caches.open(RUNTIME_API_CACHE);
            await cache.put(request, res.clone());
          }
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return new Response(JSON.stringify({}), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }),
    );
    return;
  }

  if (isDocumentPrefetchRequest(request, url)) {
    event.respondWith(
      fetch(request)
        .then(async (res) => {
          if (res.ok && res.type !== "opaqueredirect") {
            const resClone = res.clone();
            const cache = await caches.open(APP_SHELL_CACHE);
            await cache.put(request, resClone);
            await cleanOldCaches(APP_SHELL_CACHE);
          }
          return res;
        })
        .catch(() => fetch(request)),
    );
    return;
  }

  if (isAdminApi(url)) {
    if (request.method === "GET") {
      event.respondWith(
        fetch(request)
          .then(async (res) => {
            if (res.ok) {
              const resClone = res.clone();
              const cache = await caches.open(ADMIN_API_CACHE);
              await cache.put(request, resClone);
              await cleanOldCaches(ADMIN_API_CACHE);
            }
            return res;
          })
          .catch(async () => {
            const cached = await caches.match(request);
            if (cached) {
              const headers = new Headers(cached.headers);
              headers.set("X-From-Cache", "true");
              return new Response(cached.body, {
                status: cached.status,
                statusText: cached.statusText,
                headers: headers,
              });
            }
            return new Response(
              JSON.stringify({ error: "No disponible offline" }),
              {
                status: 503,
                headers: { "Content-Type": "application/json" },
              },
            );
          }),
      );
    } else {
      event.respondWith(
        fetch(request)
          .then(async (res) => {
            if (res.ok && url.pathname === "/api/admin/products/status") {
              const cache = await caches.open(ADMIN_API_CACHE);
              const keys = await cache.keys();
              await Promise.all(
                keys
                  .filter((k) => new URL(k.url).pathname === "/api/admin/products")
                  .map((k) => cache.delete(k)),
              );
            }
            return res;
          })
          .catch(
            () =>
              new Response(
                JSON.stringify({
                  error: "Requiere conexión para actualizaciones",
                }),
                {
                  status: 503,
                  headers: { "Content-Type": "application/json" },
                },
              ),
          ),
      );
    }
    return;
  }

  if (isProductsApi(url) || isSalesApi(url) || isCartApi(url)) {
    if (request.method !== "GET") {
      return;
    }
    event.respondWith(
      fetch(request)
        .then(async (res) => {
          if (res.ok) {
            const resClone = res.clone();
            const cache = await caches.open(RUNTIME_API_CACHE);
            await cache.put(request, resClone);
            await cleanOldCaches(RUNTIME_API_CACHE);
          }
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) {
            const headers = new Headers(cached.headers);
            headers.set("X-From-Cache", "true");
            return new Response(cached.body, {
              status: cached.status,
              statusText: cached.statusText,
              headers: headers,
            });
          }
          return new Response(
            JSON.stringify({ error: "No disponible offline" }),
            {
              status: 503,
              headers: { "Content-Type": "application/json" },
            },
          );
        }),
    );
    return;
  }

  if (isNextStatic(url)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then(async (res) => {
            if (res.ok) {
              const resClone = res.clone();
              const cache = await caches.open(STATIC_CACHE);
              await cache.put(request, resClone);
            }
            return res;
          }),
      ),
    );
    return;
  }

  if (isNextImage(url) || request.destination === "image") {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then(async (res) => {
            if (res.ok) {
              const resClone = res.clone();
              const cache = await caches.open(IMAGES_CACHE);
              await cache.put(request, resClone);
              await cleanOldCaches(IMAGES_CACHE);
            }
            return res;
          }),
      ),
    );
    return;
  }
});
