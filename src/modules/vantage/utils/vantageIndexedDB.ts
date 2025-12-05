/**
 * IndexedDB Storage Utility for Vantage Snapshots
 * Handles storage of large snapshots that exceed localStorage quota
 */

import type { VantageSnapshot } from '../types';

const DB_NAME = 'VantageSnapshotsDB';
const DB_VERSION = 1;
const STORE_NAME = 'snapshots';
const MAX_SNAPSHOTS = 2; // Always keep only 2 snapshots: previous and current

let dbInstance: IDBDatabase | null = null;

/**
 * Initialize or open the IndexedDB database
 */
export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    // Return existing instance if already open
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error(`Failed to open IndexedDB: ${request.error?.message}`));
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        
        // Create indexes for efficient queries
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
        objectStore.createIndex('id', 'id', { unique: true });
      }
    };
  });
}

/**
 * Convert Maps to serializable objects for IndexedDB storage
 */
function serializeSnapshot(snapshot: VantageSnapshot): any {
  return {
    ...snapshot,
    metadata: {
      ...snapshot.metadata,
      // Convert Maps to arrays of [key, value] pairs
      accountsByUserId: Array.from(snapshot.metadata.accountsByUserId.entries()),
      clientsByOwner: Array.from(snapshot.metadata.clientsByOwner.entries()),
    },
  };
}

/**
 * Restore Maps from serialized data
 */
function deserializeSnapshot(serialized: any): VantageSnapshot {
  return {
    ...serialized,
    metadata: {
      ...serialized.metadata,
      // Restore Maps from arrays
      accountsByUserId: new Map(serialized.metadata.accountsByUserId || []),
      clientsByOwner: new Map(serialized.metadata.clientsByOwner || []),
    },
  };
}

/**
 * Save a snapshot to IndexedDB
 */
export async function saveSnapshot(snapshot: VantageSnapshot): Promise<void> {
  const db = await initDB();
  const serialized = serializeSnapshot(snapshot);

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const request = store.put(serialized);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error(`Failed to save snapshot: ${request.error?.message}`));
    };
  });
}

/**
 * Save multiple snapshots at once, maintaining only the 2 most recent
 */
export async function saveSnapshots(snapshots: VantageSnapshot[]): Promise<void> {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Get all existing snapshots
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = () => {
      const existingSnapshots = getAllRequest.result.map(deserializeSnapshot);
      
      // Combine with new snapshots
      const allSnapshots = [...existingSnapshots, ...snapshots];
      
      // Remove duplicates by ID
      const uniqueMap = new Map<string, VantageSnapshot>();
      allSnapshots.forEach(s => uniqueMap.set(s.id, s));
      
      // Sort by timestamp descending and keep only 2 most recent
      const sorted = Array.from(uniqueMap.values()).sort((a, b) => b.timestamp - a.timestamp);
      const trimmed = sorted.slice(0, MAX_SNAPSHOTS);

      // Clear all and save trimmed list
      const clearRequest = store.clear();

      clearRequest.onsuccess = () => {
        // Save all trimmed snapshots
        const savePromises = trimmed.map(snapshot => {
          const serialized = serializeSnapshot(snapshot);
          return new Promise<void>((resolveSave, rejectSave) => {
            const putRequest = store.put(serialized);
            putRequest.onsuccess = () => resolveSave();
            putRequest.onerror = () => rejectSave(new Error(`Failed to save snapshot: ${putRequest.error?.message}`));
          });
        });

        Promise.all(savePromises)
          .then(() => resolve())
          .catch(reject);
      };

      clearRequest.onerror = () => {
        reject(new Error(`Failed to clear snapshots: ${clearRequest.error?.message}`));
      };
    };

    getAllRequest.onerror = () => {
      reject(new Error(`Failed to get snapshots: ${getAllRequest.error?.message}`));
    };
  });
}

/**
 * Get all snapshots from IndexedDB
 */
export async function getSnapshots(): Promise<VantageSnapshot[]> {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    const request = store.getAll();

    request.onsuccess = () => {
      const snapshots = request.result.map(deserializeSnapshot);
      // Sort by timestamp descending
      snapshots.sort((a, b) => b.timestamp - a.timestamp);
      resolve(snapshots);
    };

    request.onerror = () => {
      reject(new Error(`Failed to get snapshots: ${request.error?.message}`));
    };
  });
}

/**
 * Get the most recent snapshot
 */
export async function getLatestSnapshot(): Promise<VantageSnapshot | null> {
  const snapshots = await getSnapshots();
  return snapshots.length > 0 ? snapshots[0] : null;
}

/**
 * Get the previous snapshot (second most recent)
 */
export async function getPreviousSnapshot(): Promise<VantageSnapshot | null> {
  const snapshots = await getSnapshots();
  return snapshots.length >= 2 ? snapshots[1] : null;
}

/**
 * Get a snapshot by ID
 */
export async function getSnapshotById(id: string): Promise<VantageSnapshot | null> {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    const request = store.get(id);

    request.onsuccess = () => {
      const result = request.result;
      resolve(result ? deserializeSnapshot(result) : null);
    };

    request.onerror = () => {
      reject(new Error(`Failed to get snapshot: ${request.error?.message}`));
    };
  });
}

/**
 * Clear all snapshots from IndexedDB
 */
export async function clearSnapshots(): Promise<void> {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const request = store.clear();

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error(`Failed to clear snapshots: ${request.error?.message}`));
    };
  });
}

/**
 * Get snapshots within a date range
 */
export async function getSnapshotsInRange(
  startTimestamp: number,
  endTimestamp: number
): Promise<VantageSnapshot[]> {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('timestamp');

    // Use IDBKeyRange to filter by timestamp range
    const range = IDBKeyRange.bound(startTimestamp, endTimestamp);
    const request = index.getAll(range);

    request.onsuccess = () => {
      const snapshots = request.result.map(deserializeSnapshot);
      snapshots.sort((a, b) => b.timestamp - a.timestamp);
      resolve(snapshots);
    };

    request.onerror = () => {
      reject(new Error(`Failed to get snapshots in range: ${request.error?.message}`));
    };
  });
}

/**
 * Check if IndexedDB is available
 */
export function isIndexedDBAvailable(): boolean {
  return typeof indexedDB !== 'undefined' && indexedDB !== null;
}

