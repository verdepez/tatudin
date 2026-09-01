/**
 * Tatudin Offline Store & Background Sync Engine
 * Uses IndexedDB for resilient offline operations and automatic replay when online.
 */

const DB_NAME = 'tatudin_offline_db';
const DB_VERSION = 1;

let dbPromise = null;

export function getOfflineDb() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      console.warn('[OFFLINE STORE] IndexedDB not supported in this browser.');
      return resolve(null);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('sync_queue')) {
        db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('cache_store')) {
        db.createObjectStore('cache_store', { keyPath: 'key' });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      console.error('[OFFLINE STORE] Failed opening IndexedDB:', event.target.error);
      resolve(null);
    };
  });

  return dbPromise;
}

/**
 * Enqueue a mutating request (POST, PUT, PATCH, DELETE) when offline
 */
export async function enqueueOfflineRequest({ url, method, body, title = '' }) {
  const db = await getOfflineDb();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction('sync_queue', 'readwrite');
      const store = tx.objectStore('sync_queue');
      const item = {
        url,
        method,
        body,
        title: title || `${method} ${url}`,
        createdAt: new Date().toISOString()
      };
      store.add(item);
      tx.oncomplete = () => {
        console.log(`[OFFLINE STORE] Queued mutation: ${item.title}`);
        updateOfflineBannerUI();
        resolve(true);
      };
      tx.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

/**
 * Get count of pending offline requests
 */
export async function getPendingOfflineCount() {
  const db = await getOfflineDb();
  if (!db) return 0;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction('sync_queue', 'readonly');
      const store = tx.objectStore('sync_queue');
      const countReq = store.count();
      countReq.onsuccess = () => resolve(countReq.result);
      countReq.onerror = () => resolve(0);
    } catch {
      resolve(0);
    }
  });
}

/**
 * Synchronize all pending offline requests with the server
 */
export async function syncPendingOfflineRequests(apiCaller) {
  const db = await getOfflineDb();
  if (!db || !navigator.onLine) return { synced: 0, failed: 0 };

  return new Promise((resolve) => {
    try {
      const tx = db.transaction('sync_queue', 'readonly');
      const store = tx.objectStore('sync_queue');
      const getReq = store.getAll();

      getReq.onsuccess = async () => {
        const items = getReq.result || [];
        if (!items.length) return resolve({ synced: 0, failed: 0 });

        let synced = 0;
        let failed = 0;

        for (const item of items) {
          try {
            const res = await fetch(item.url, {
              method: item.method,
              headers: { 'Content-Type': 'application/json' },
              body: item.body ? JSON.stringify(item.body) : undefined
            });

            if (res.ok || res.status === 409) {
              // Successfully processed or conflict safely handled
              const deleteTx = db.transaction('sync_queue', 'readwrite');
              deleteTx.objectStore('sync_queue').delete(item.id);
              synced++;
            } else {
              failed++;
            }
          } catch (err) {
            console.warn('[OFFLINE SYNC] Retry error for item:', item, err.message);
            failed++;
          }
        }

        console.log(`[OFFLINE SYNC] Completed: ${synced} synced, ${failed} failed.`);
        updateOfflineBannerUI();
        resolve({ synced, failed });
      };

      getReq.onerror = () => resolve({ synced: 0, failed: 0 });
    } catch {
      resolve({ synced: 0, failed: 0 });
    }
  });
}

/**
 * Cache key-value dataset for offline viewing
 */
export async function cacheOfflineData(key, data) {
  const db = await getOfflineDb();
  if (!db) return;
  try {
    const tx = db.transaction('cache_store', 'readwrite');
    tx.objectStore('cache_store').put({ key, data, updatedAt: Date.now() });
  } catch {}
}

/**
 * Retrieve cached dataset when offline
 */
export async function getOfflineCachedData(key) {
  const db = await getOfflineDb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction('cache_store', 'readonly');
      const req = tx.objectStore('cache_store').get(key);
      req.onsuccess = () => resolve(req.result?.data || null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Updates or renders the offline status banner in the UI
 */
export async function updateOfflineBannerUI() {
  let banner = document.getElementById('tatudin-offline-banner');
  const isOnline = navigator.onLine;
  const count = await getPendingOfflineCount();

  if (!isOnline || count > 0) {
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'tatudin-offline-banner';
      banner.style.cssText = `
        position: fixed;
        bottom: 74px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(23, 16, 51, 0.95);
        border: 1px solid rgba(139, 92, 246, 0.4);
        backdrop-filter: blur(12px);
        color: #f3f0ff;
        padding: 10px 18px;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.6);
        z-index: 99999;
        transition: all 0.3s ease;
      `;
      document.body.appendChild(banner);
    }

    banner.innerHTML = `
      <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${isOnline ? '#10b981' : '#f59e0b'};"></span>
      <span>${!isOnline ? 'Modo sin conexión' : 'Conexión restablecida'} ${count > 0 ? `· (${count} pendientes de sincronizar)` : ''}</span>
      ${isOnline && count > 0 ? `<button type="button" id="btn-sync-now" style="background:#7c3aed; color:white; border:none; padding:4px 10px; border-radius:12px; font-size:11px; cursor:pointer; font-weight:600;">Sincronizar</button>` : ''}
    `;

    const syncBtn = banner.querySelector('#btn-sync-now');
    if (syncBtn) {
      syncBtn.onclick = async () => {
        syncBtn.textContent = 'Sincronizando...';
        await syncPendingOfflineRequests();
      };
    }
  } else if (banner) {
    banner.remove();
  }
}

// Global network listener hooks
if (typeof window !== 'undefined') {
  window.addEventListener('online', async () => {
    console.log('[NETWORK] Connection restored. Synchronizing pending operations...');
    await syncPendingOfflineRequests();
    updateOfflineBannerUI();
  });

  window.addEventListener('offline', () => {
    console.log('[NETWORK] Connection lost. Operating in resilient offline mode.');
    updateOfflineBannerUI();
  });
}

