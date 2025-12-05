/**
 * Vantage Snapshot Storage
 * Uses IndexedDB for large snapshots with fallback to localStorage
 * Maintains compatibility with existing code
 */

import type { VantageSnapshot } from "../types";
import {
  initDB,
  saveSnapshot as saveSnapshotIDB,
  saveSnapshots as saveSnapshotsIDB,
  getSnapshots as getSnapshotsIDB,
  getLatestSnapshot as getLatestSnapshotIDB,
  getPreviousSnapshot as getPreviousSnapshotIDB,
  getSnapshotById as getSnapshotByIdIDB,
  clearSnapshots as clearSnapshotsIDB,
  getSnapshotsInRange as getSnapshotsInRangeIDB,
  isIndexedDBAvailable,
} from "./vantageIndexedDB";

const STORAGE_KEY = "vantage_snapshots";
const MAX_SNAPSHOTS = 2;
const MIGRATION_FLAG_KEY = "vantage_migrated_to_indexeddb";

// Initialize IndexedDB on module load
let indexedDBReady = false;
let migrationAttempted = false;

/**
 * Initialize IndexedDB and migrate data if needed
 */
async function ensureIndexedDBReady(): Promise<boolean> {
  if (indexedDBReady) return true;
  if (!isIndexedDBAvailable()) return false;

  try {
    await initDB();
    
    // Migrate from localStorage if not already migrated
    if (!migrationAttempted) {
      migrationAttempted = true;
      const alreadyMigrated = localStorage.getItem(MIGRATION_FLAG_KEY);
      
      if (!alreadyMigrated) {
        await migrateFromLocalStorage();
        localStorage.setItem(MIGRATION_FLAG_KEY, "true");
      }
    }
    
    indexedDBReady = true;
    return true;
  } catch (error) {
    console.warn("IndexedDB initialization failed, falling back to localStorage:", error);
    return false;
  }
}

/**
 * Migrate snapshots from localStorage to IndexedDB
 */
async function migrateFromLocalStorage(): Promise<void> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const snapshots: VantageSnapshot[] = JSON.parse(stored);
    if (snapshots.length === 0) return;

    // Restore Maps from serialized data
    const restoredSnapshots = snapshots.map(snapshot => ({
      ...snapshot,
      metadata: {
        ...snapshot.metadata,
        accountsByUserId: new Map(snapshot.metadata.accountsByUserId || []),
        clientsByOwner: new Map(snapshot.metadata.clientsByOwner || []),
      },
    }));

    // Save to IndexedDB
    await saveSnapshotsIDB(restoredSnapshots);
    
    console.log(`Migrated ${restoredSnapshots.length} snapshot(s) from localStorage to IndexedDB`);
  } catch (error) {
    console.error("Failed to migrate from localStorage:", error);
    // Don't throw - allow fallback to localStorage
  }
}

/**
 * Fallback: Save to localStorage (for when IndexedDB is not available)
 */
function saveSnapshotLocalStorage(snapshot: VantageSnapshot): void {
  try {
    const snapshots = getSnapshotsLocalStorage();
    const filtered = snapshots.filter(s => s.id !== snapshot.id);
    filtered.push(snapshot);
    const sorted = filtered.sort((a, b) => b.timestamp - a.timestamp);
    const trimmed = sorted.slice(0, MAX_SNAPSHOTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error("Failed to save snapshot to localStorage:", error);
    throw new Error("Failed to save snapshot to storage");
  }
}

/**
 * Fallback: Get snapshots from localStorage
 */
function getSnapshotsLocalStorage(): VantageSnapshot[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const snapshots = JSON.parse(stored);
    // Restore Maps
    return snapshots.map((snapshot: any) => ({
      ...snapshot,
      metadata: {
        ...snapshot.metadata,
        accountsByUserId: new Map(snapshot.metadata.accountsByUserId || []),
        clientsByOwner: new Map(snapshot.metadata.clientsByOwner || []),
      },
    }));
  } catch (error) {
    console.error("Failed to retrieve snapshots from localStorage:", error);
    return [];
  }
}

/**
 * Saves a snapshot to storage (IndexedDB preferred, localStorage fallback)
 * Now async to support IndexedDB
 */
export async function saveSnapshot(snapshot: VantageSnapshot): Promise<void> {
  const useIndexedDB = await ensureIndexedDBReady();
  
  if (useIndexedDB) {
    try {
      await saveSnapshotIDB(snapshot);
      return;
    } catch (error) {
      console.warn("IndexedDB save failed, falling back to localStorage:", error);
    }
  }
  
  // Fallback to localStorage
  saveSnapshotLocalStorage(snapshot);
}

/**
 * Saves multiple snapshots at once
 * Now async to support IndexedDB
 */
export async function saveSnapshots(snapshotsToSave: VantageSnapshot[]): Promise<void> {
  const useIndexedDB = await ensureIndexedDBReady();
  
  if (useIndexedDB) {
    try {
      await saveSnapshotsIDB(snapshotsToSave);
      return;
    } catch (error) {
      console.warn("IndexedDB save failed, falling back to localStorage:", error);
    }
  }
  
  // Fallback to localStorage
  try {
    const existingSnapshots = getSnapshotsLocalStorage();
    const snapshotMap = new Map<string, VantageSnapshot>();
    existingSnapshots.forEach(s => snapshotMap.set(s.id, s));
    snapshotsToSave.forEach(s => snapshotMap.set(s.id, s));
    const allSnapshots = Array.from(snapshotMap.values());
    const sorted = allSnapshots.sort((a, b) => b.timestamp - a.timestamp);
    const trimmed = sorted.slice(0, MAX_SNAPSHOTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error("Failed to save snapshots to localStorage:", error);
    throw new Error("Failed to save snapshots to storage");
  }
}

/**
 * Retrieves all stored snapshots
 * Now async to support IndexedDB
 */
export async function getSnapshots(): Promise<VantageSnapshot[]> {
  const useIndexedDB = await ensureIndexedDBReady();
  
  if (useIndexedDB) {
    try {
      return await getSnapshotsIDB();
    } catch (error) {
      console.warn("IndexedDB get failed, falling back to localStorage:", error);
    }
  }
  
  // Fallback to localStorage
  return getSnapshotsLocalStorage();
}

/**
 * Gets the most recent snapshot (current)
 * Now async to support IndexedDB
 */
export async function getLatestSnapshot(): Promise<VantageSnapshot | null> {
  const snapshots = await getSnapshots();
  return snapshots.length > 0 ? snapshots[0] : null;
}

/**
 * Gets the previous snapshot (second most recent)
 * Now async to support IndexedDB
 */
export async function getPreviousSnapshot(): Promise<VantageSnapshot | null> {
  const snapshots = await getSnapshots();
  return snapshots.length >= 2 ? snapshots[1] : null;
}

/**
 * Gets a specific snapshot by ID
 * Now async to support IndexedDB
 */
export async function getSnapshotById(id: string): Promise<VantageSnapshot | null> {
  const useIndexedDB = await ensureIndexedDBReady();
  
  if (useIndexedDB) {
    try {
      return await getSnapshotByIdIDB(id);
    } catch (error) {
      console.warn("IndexedDB getById failed, falling back to localStorage:", error);
    }
  }
  
  // Fallback to localStorage
  const snapshots = getSnapshotsLocalStorage();
  return snapshots.find((s) => s.id === id) || null;
}

/**
 * Clears all stored snapshots
 * Now async to support IndexedDB
 */
export async function clearSnapshots(): Promise<void> {
  const useIndexedDB = await ensureIndexedDBReady();
  
  if (useIndexedDB) {
    try {
      await clearSnapshotsIDB();
      return;
    } catch (error) {
      console.warn("IndexedDB clear failed, falling back to localStorage:", error);
    }
  }
  
  // Fallback to localStorage
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Gets snapshots within a date range
 * Now async to support IndexedDB
 */
export async function getSnapshotsInRange(
  startTimestamp: number,
  endTimestamp: number
): Promise<VantageSnapshot[]> {
  const useIndexedDB = await ensureIndexedDBReady();
  
  if (useIndexedDB) {
    try {
      return await getSnapshotsInRangeIDB(startTimestamp, endTimestamp);
    } catch (error) {
      console.warn("IndexedDB range query failed, falling back to localStorage:", error);
    }
  }
  
  // Fallback to localStorage
  const snapshots = getSnapshotsLocalStorage();
  return snapshots.filter(
    (s) => s.timestamp >= startTimestamp && s.timestamp <= endTimestamp
  );
}
