import type {
  VantageSnapshot,
  RetailClient,
  ComparisonResult,
  ChangedUser,
  FieldChange,
} from "../types";
import { extractAllRetailClients } from "./snapshotHelpers";

/**
 * Detects changes between two retail client objects
 */
function detectChanges(
  previous: RetailClient,
  current: RetailClient
): FieldChange[] {
  const changes: FieldChange[] = [];
  const fieldsToMonitor: (keyof RetailClient)[] = [
    "equity",
    "lastTradeTime",
    "lastDepositTime",
    "lastDepositAmount",
    "accountBalance",
    "fundingStatus",
    "archiveStatus",
    "credit",
    "accountJourney",
  ];

  fieldsToMonitor.forEach((field) => {
    const oldValue = previous[field];
    const newValue = current[field];

    // Handle null/undefined comparisons
    if (oldValue !== newValue) {
      // For numbers, check if the difference is significant (avoid floating point issues)
      if (
        typeof oldValue === "number" &&
        typeof newValue === "number" &&
        Math.abs(oldValue - newValue) < 0.01
      ) {
        return; // Skip insignificant changes
      }

      changes.push({
        field: field as string,
        oldValue,
        newValue,
      });
    }
  });

  return changes;
}

/**
 * Compares two snapshots and detects new, removed, and changed users
 */
export function compareSnapshots(
  previous: VantageSnapshot,
  current: VantageSnapshot
): ComparisonResult {
  const previousUsers = extractAllRetailClients(previous);
  const currentUsers = extractAllRetailClients(current);

  // Debug: Log extraction results
  console.log('[compareSnapshots] Previous snapshot:', {
    id: previous.id,
    timestamp: new Date(previous.timestamp).toISOString(),
    subIBsCount: previous.subIBs?.length || 0,
    subIBsWithClients: previous.subIBs?.filter(sib => sib.clients && sib.clients.length > 0).length || 0,
    extractedClients: previousUsers.length,
    allClients: previous.allClients?.length || 0
  });
  console.log('[compareSnapshots] Current snapshot:', {
    id: current.id,
    timestamp: new Date(current.timestamp).toISOString(),
    subIBsCount: current.subIBs?.length || 0,
    subIBsWithClients: current.subIBs?.filter(sib => sib.clients && sib.clients.length > 0).length || 0,
    extractedClients: currentUsers.length,
    allClients: current.allClients?.length || 0
  });

  // Create maps for efficient lookup
  const previousMap = new Map<number, RetailClient>(
    previousUsers.map((u) => [u.userId, u])
  );
  const currentMap = new Map<number, RetailClient>(
    currentUsers.map((u) => [u.userId, u])
  );

  // Find new users (in current but not in previous)
  const newUsers = currentUsers.filter((u) => !previousMap.has(u.userId));

  // Find removed users (in previous but not in current)
  // Ensure removed users have ownerName assigned
  const removedUsers = previousUsers
    .filter((u) => !currentMap.has(u.userId))
    .map((u) => {
      // If removed user doesn't have ownerName, try to preserve it from previous snapshot metadata
      if (!u.ownerName && previous.metadata?.clientsByOwner) {
        // Search in metadata to find ownerName
        for (const [ownerName, clients] of previous.metadata.clientsByOwner.entries()) {
          if (clients.some(c => c.userId === u.userId)) {
            return { ...u, ownerName };
          }
        }
      }
      return u;
    });

  // Find changed users (in both but with modifications)
  const changedUsers: ChangedUser[] = currentUsers
    .filter((u) => previousMap.has(u.userId))
    .map((u) => {
      const prevUser = previousMap.get(u.userId)!;
      const changes = detectChanges(prevUser, u);
      return changes.length > 0 ? { user: u, changes } : null;
    })
    .filter((item): item is ChangedUser => item !== null);

  return {
    newUsers,
    removedUsers,
    changedUsers,
    summary: {
      totalNew: newUsers.length,
      totalRemoved: removedUsers.length,
      totalChanged: changedUsers.length,
    },
  };
}

/**
 * Gets comparison result between latest snapshot and a previous one
 */
export function compareWithLatest(
  previousSnapshot: VantageSnapshot,
  latestSnapshot: VantageSnapshot | null
): ComparisonResult | null {
  if (!latestSnapshot) {
    return null;
  }

  return compareSnapshots(previousSnapshot, latestSnapshot);
}

