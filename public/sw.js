const CACHE_VERSION = "v2";
const APP_SHELL_CACHE = `app-shell-${CACHE_VERSION}`;
const RUNTIME_API_CACHE = `api-${CACHE_VERSION}`;
const IMAGES_CACHE = `images-${CACHE_VERSION}`;

const OFFLINE_URL = "/offline";
const MAX_CACHE_SIZE = 50;

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
      .then((cache) =>
        cache.addAll(["/", OFFLINE_URL, "/manifest.webmanifest"]),
      )
      .then(() => self.skipWaiting()),
  );
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
                ![APP_SHELL_CACHE, RUNTIME_API_CACHE, IMAGES_CACHE].includes(
                  key,
                ),
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isNavigationRequest(request) {
  return request.mode === "navigate";
}

function isProductsApi(url) {
  return url.pathname.startsWith("/api/products");
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
