import type { VantageSnapshot } from "../types";

const STORAGE_KEY = "vantage_snapshots";
const MAX_SNAPSHOTS = 2; // Always keep only 2 snapshots: previous and current

/**
 * Saves a snapshot to localStorage, maintaining only the 2 most recent snapshots
 * This ensures we always have the previous and current snapshot for comparison
 */
export function saveSnapshot(snapshot: VantageSnapshot): void {
  try {
    const snapshots = getSnapshots();
    
    // Remove duplicate by ID if it already exists
    const filtered = snapshots.filter(s => s.id !== snapshot.id);
    
    // Add new snapshot
    filtered.push(snapshot);

    // Sort by timestamp descending (newest first)
    const sorted = filtered.sort((a, b) => b.timestamp - a.timestamp);
    
    // Keep only the 2 most recent snapshots
    // [0] = current (newest)
    // [1] = previous (second newest)
    const trimmed = sorted.slice(0, MAX_SNAPSHOTS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error("Failed to save Vantage snapshot:", error);
    throw new Error("Failed to save snapshot to storage");
  }
}

/**
 * Saves multiple snapshots at once, maintaining only the 2 most recent
 * Useful when importing a new Excel to ensure both current and previous are saved correctly
 */
export function saveSnapshots(snapshotsToSave: VantageSnapshot[]): void {
  try {
    const existingSnapshots = getSnapshots();
    
    // Create a map to avoid duplicates by ID
    const snapshotMap = new Map<string, VantageSnapshot>();
    
    // Add existing snapshots
    existingSnapshots.forEach(s => snapshotMap.set(s.id, s));
    
    // Add/update with new snapshots (will overwrite if same ID)
    snapshotsToSave.forEach(s => snapshotMap.set(s.id, s));
    
    // Convert to array and sort by timestamp descending
    const allSnapshots = Array.from(snapshotMap.values());
    const sorted = allSnapshots.sort((a, b) => b.timestamp - a.timestamp);
    
    // Keep only the 2 most recent snapshots
    const trimmed = sorted.slice(0, MAX_SNAPSHOTS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error("Failed to save Vantage snapshots:", error);
    throw new Error("Failed to save snapshots to storage");
  }
}

/**
 * Retrieves all stored snapshots
 */
export function getSnapshots(): VantageSnapshot[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to retrieve Vantage snapshots:", error);
    return [];
  }
}

/**
 * Gets the most recent snapshot (current)
 */
export function getLatestSnapshot(): VantageSnapshot | null {
  const snapshots = getSnapshots();
  if (snapshots.length === 0) return null;
  
  // Sort by timestamp descending and return the newest
  const sorted = snapshots.sort((a, b) => b.timestamp - a.timestamp);
  return sorted[0];
}

/**
 * Gets the previous snapshot (second most recent)
 * This is the snapshot that will be compared with the new one
 */
export function getPreviousSnapshot(): VantageSnapshot | null {
  const snapshots = getSnapshots();
  if (snapshots.length < 2) return null;
  
  // Sort by timestamp descending and return the second newest
  const sorted = snapshots.sort((a, b) => b.timestamp - a.timestamp);
  return sorted[1];
}

/**
 * Gets a specific snapshot by ID
 */
export function getSnapshotById(id: string): VantageSnapshot | null {
  const snapshots = getSnapshots();
  return snapshots.find((s) => s.id === id) || null;
}

/**
 * Clears all stored snapshots
 */
export function clearSnapshots(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Gets snapshots within a date range
 */
export function getSnapshotsInRange(
  startTimestamp: number,
  endTimestamp: number
): VantageSnapshot[] {
  const snapshots = getSnapshots();
  return snapshots.filter(
    (s) => s.timestamp >= startTimestamp && s.timestamp <= endTimestamp
  );
}

