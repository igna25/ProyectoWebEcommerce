const DB_NAME = "pwa-offline-queue";
const STORE_NAME = "pendingOps";
const SYNC_TAG = "pending-ops";

function getFullUrl(url: string): string {
  if (typeof window === "undefined") return url;
  if (url.startsWith("http")) return url;
  return `${window.location.origin}${url.startsWith("/") ? url : `/${url}`}`;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };
  });
}

export interface QueuedOp {
  url: string;
  method: string;
  body?: string;
  headers?: Record<string, string>;
}

export function queueOfflineOp(op: QueuedOp): Promise<void> {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return Promise.resolve();
  }
  const fullUrl = getFullUrl(op.url);
  const record = {
    url: fullUrl,
    method: op.method,
    body: op.body,
    headers: op.headers ?? {},
  };
  return openDb()
    .then((db) => {
      return new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.add(record);
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onerror = () => {
          db.close();
          reject(tx.error);
        };
      });
    })
    .then(() => {
      if ("serviceWorker" in navigator && "sync" in ServiceWorkerRegistration.prototype) {
        return navigator.serviceWorker.ready.then((reg) =>
          (reg as ServiceWorkerRegistration & { sync: { register: (tag: string) => Promise<void> } }).sync.register(SYNC_TAG),
        );
      }
    })
    .then(() => {})
    .catch(() => {});
}

export function isOfflineSyncSupported(): boolean {
  if (typeof window === "undefined") return false;
  return !!(
    "serviceWorker" in navigator &&
    "sync" in ServiceWorkerRegistration.prototype &&
    "indexedDB" in window
  );
}
