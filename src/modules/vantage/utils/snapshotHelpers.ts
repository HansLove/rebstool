/**
 * Helper functions for working with VantageSnapshot data
 * Supports both new unified structure (subIBs/allClients) and legacy structure (retailResults)
 */

import type { VantageSnapshot, RetailClient } from "../types";

/**
 * Extracts all retail clients from a snapshot
 * Prioritizes new unified structure (subIBs.clients) over allClients and legacy structure (retailResults)
 * According to the new API structure, clients are ONLY in sub_ibs[].clients when include_clients=true
 * Ensures all clients have ownerName assigned
 * 
 * @param snapshot The snapshot to extract clients from
 * @returns Array of all retail clients with ownerName assigned
 */
export function extractAllRetailClients(snapshot: VantageSnapshot): RetailClient[] {
  let clients: RetailClient[] = [];

  // Priority 1: Extract from subIBs.clients (new unified structure - PRIMARY source)
  // According to the new API structure, clients are ONLY in sub_ibs[].clients when include_clients=true
  if (snapshot.subIBs && snapshot.subIBs.length > 0) {
    snapshot.subIBs.forEach((subIB) => {
      if (subIB.clients && Array.isArray(subIB.clients) && subIB.clients.length > 0) {
        // Ensure each client has ownerName from parent Sub-IB
        const clientsWithOwner = subIB.clients.map(client => ({
          ...client,
          ownerName: client.ownerName || subIB.ownerName,
        }));
        clients.push(...clientsWithOwner);
      }
    });
    
    // If we found clients in subIBs, return them (this is the primary source)
    if (clients.length > 0) {
      // Final safety check: ensure all clients have ownerName
      clients = clients.map(client => {
        if (!client.ownerName) {
          // Try to find ownerName from subIBs
          const subIB = snapshot.subIBs?.find(sib => 
            sib.clients?.some(c => c.userId === client.userId)
          );
          return {
            ...client,
            ownerName: subIB?.ownerName || "Unknown",
          };
        }
        return client;
      });
      
      return clients;
    }
    
    // Debug: Log if subIBs exist but have no clients
    console.log('[extractAllRetailClients] Snapshot has subIBs but no clients:', {
      snapshotId: snapshot.id,
      subIBsCount: snapshot.subIBs.length,
      subIBsWithClients: snapshot.subIBs.filter(sib => sib.clients && sib.clients.length > 0).length,
      totalClientCount: snapshot.subIBs.reduce((sum, sib) => sum + (sib.clientCount || 0), 0)
    });
  }
  
  // Priority 2: Use allClients if available (fallback for backward compatibility)
  // Note: According to new API structure, all_clients should not exist separately
  // but we keep this as fallback for edge cases or legacy data
  if (snapshot.allClients && snapshot.allClients.length > 0) {
    clients = snapshot.allClients.map(client => ({
      ...client,
      ownerName: client.ownerName || "Unknown",
    }));
  }
  // Priority 3: Fallback to legacy structure (retailResults)
  else if (snapshot.retailResults && snapshot.retailResults.length > 0) {
    snapshot.retailResults.forEach((result) => {
      if (result.retail?.data && Array.isArray(result.retail.data)) {
        // Ensure each client has ownerName from retail result
        const clientsWithOwner = result.retail.data.map(client => ({
          ...client,
          ownerName: client.ownerName || result.ownerName || "Unknown",
        }));
        clients.push(...clientsWithOwner);
      }
    });
  }

  // Final safety check: if any client is missing ownerName, try to assign from metadata
  if (clients.length > 0 && snapshot.metadata?.clientsByOwner && snapshot.metadata.clientsByOwner.size > 0) {
    // Create reverse map: userId -> ownerName
    const userIdToOwnerMap = new Map<number, string>();
    snapshot.metadata.clientsByOwner.forEach((clientList, ownerName) => {
      clientList.forEach(client => {
        if (client.userId && !userIdToOwnerMap.has(client.userId)) {
          userIdToOwnerMap.set(client.userId, ownerName);
        }
      });
    });

    // Assign missing ownerNames
    clients = clients.map(client => {
      if (!client.ownerName || client.ownerName === "Unknown") {
        if (userIdToOwnerMap.has(client.userId)) {
          return {
            ...client,
            ownerName: userIdToOwnerMap.get(client.userId)!,
          };
        }
      }
      return client;
    });
  }

  // Deduplicate clients by userId to prevent duplicate keys in React
  // If a client appears multiple times, keep the first occurrence
  const seenUserIds = new Set<number>();
  const uniqueClients: RetailClient[] = [];
  for (const client of clients) {
    if (!seenUserIds.has(client.userId)) {
      seenUserIds.add(client.userId);
      uniqueClients.push(client);
    }
  }

  return uniqueClients;
}

/**
 * Gets clients grouped by ownerName (Sub-IB)
 * Uses new unified structure (subIBs) as primary source, falls back to grouping clients manually
 * According to the new API structure, clients are grouped by Sub-IB in sub_ibs[].clients
 * 
 * @param snapshot The snapshot to extract clients from
 * @returns Map of ownerName to clients array
 */
export function getClientsByOwner(snapshot: VantageSnapshot): Map<string, RetailClient[]> {
  const clientsByOwner = new Map<string, RetailClient[]>();

  // Priority 1: Use metadata.clientsByOwner if available (pre-computed)
  if (snapshot.metadata?.clientsByOwner && snapshot.metadata.clientsByOwner.size > 0) {
    return snapshot.metadata.clientsByOwner;
  }

  // Priority 2: Use subIBs structure (PRIMARY source for new unified structure)
  // According to the new API structure, clients are grouped by Sub-IB in sub_ibs[].clients
  if (snapshot.subIBs && snapshot.subIBs.length > 0) {
    snapshot.subIBs.forEach((subIB) => {
      if (subIB.clients && Array.isArray(subIB.clients) && subIB.clients.length > 0) {
        // Ensure all clients have ownerName from parent Sub-IB
        const clientsWithOwner = subIB.clients.map(client => ({
          ...client,
          ownerName: client.ownerName || subIB.ownerName,
        }));
        clientsByOwner.set(subIB.ownerName, clientsWithOwner);
      }
    });
    
    // If we found clients in subIBs, return them (this is the primary source)
    if (clientsByOwner.size > 0) {
      return clientsByOwner;
    }
  }

  // Priority 3: Group from allClients (fallback for backward compatibility)
  // Note: According to new API structure, all_clients should not exist separately
  // but we keep this as fallback for edge cases or legacy data
  if (snapshot.allClients && snapshot.allClients.length > 0) {
    snapshot.allClients.forEach((client) => {
      const ownerName = client.ownerName || "Unknown";
      if (!clientsByOwner.has(ownerName)) {
        clientsByOwner.set(ownerName, []);
      }
      clientsByOwner.get(ownerName)!.push(client);
    });
    return clientsByOwner;
  }

  // Priority 4: Fallback to legacy structure (retailResults)
  if (snapshot.retailResults && snapshot.retailResults.length > 0) {
    snapshot.retailResults.forEach((result) => {
      if (result.retail?.data && Array.isArray(result.retail.data)) {
        const ownerName = result.ownerName || "Unknown";
        if (!clientsByOwner.has(ownerName)) {
          clientsByOwner.set(ownerName, []);
        }
        clientsByOwner.get(ownerName)!.push(...result.retail.data);
      }
    });
  }

  return clientsByOwner;
}

/**
 * Finds a client by userId
 * 
 * @param snapshot The snapshot to search in
 * @param userId The userId to search for
 * @returns The client if found, undefined otherwise
 */
export function findClientByUserId(snapshot: VantageSnapshot, userId: number): RetailClient | undefined {
  const allClients = extractAllRetailClients(snapshot);
  return allClients.find((client) => client.userId === userId);
}

/**
 * Checks if snapshot uses new unified structure
 * 
 * @param snapshot The snapshot to check
 * @returns true if snapshot uses new structure (has subIBs or allClients)
 */
export function usesNewStructure(snapshot: VantageSnapshot): boolean {
  return !!(snapshot.subIBs || snapshot.allClients);
}

