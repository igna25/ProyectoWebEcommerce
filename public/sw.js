const CACHE_VERSION = "v4";
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
const OPTIONAL_ROUTES = [
  "/login",
  "/register",
  "/dashboard",
  "/cart",
  "/buyProduct",
];

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
        await Promise.allSettled(
          OPTIONAL_ROUTES.map((route) => cache.add(route)),
        );
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

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (isNavigationRequest(request)) {
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
          const cached = await caches.match(request);
          if (cached) return cached;
          return caches.match(OFFLINE_URL);
        }),
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
      // Para POST, PATCH, PUT - requiere conexión
      event.respondWith(
        fetch(request).catch(
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
