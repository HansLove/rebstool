import type { VantageSnapshot, RetailClient, Account } from "../types";
import { extractAllRetailClients } from "./snapshotHelpers";

export interface LotsMetrics {
  userId: number;
  name: string;
  tradingAccountLogin: number;
  
  // Lots by period
  lots24h: number;
  lots7d: number;
  lots30d: number;
  lotsLifetime: number; // Estimated from all available snapshots
  
  // Additional context
  lastTradeTime: number | null;
  lastTradeSymbol: string | null;
  lastTradeVolume: number | null;
  commission: number;
}

export interface LotsAnalyzerResult {
  lotsByUser: LotsMetrics[];
  topLots24h: LotsMetrics[];
  topLots7d: LotsMetrics[];
  topLots30d: LotsMetrics[];
  topLotsLifetime: LotsMetrics[];
}

/**
 * Analyze lots traded per person across different time periods
 */
export function analyzeLots(
  currentSnapshot: VantageSnapshot,
  snapshots24h: VantageSnapshot[] = [],
  snapshots7d: VantageSnapshot[] = [],
  snapshots30d: VantageSnapshot[] = [],
  allSnapshots: VantageSnapshot[] = [] // For lifetime calculation
): LotsAnalyzerResult {
  const now = Date.now();
  const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  // Get all current clients (supports new and legacy structure)
  const currentClients = extractAllRetailClients(currentSnapshot);

  // Create accounts map
  const accountsMap = new Map<number, Account>();
  currentSnapshot.accounts.forEach((acc) => {
    accountsMap.set(acc.userId, acc);
  });

  // Build lots history map
  const lotsHistory = new Map<number, Array<{ lots: number; timestamp: number }>>();

  // Process all snapshots to collect lots data
  const allSnapshotsToProcess = [
    { snapshot: currentSnapshot, period: "current" },
    ...(snapshots24h || []).map((s) => ({ snapshot: s, period: "24h" })),
    ...(snapshots7d || []).map((s) => ({ snapshot: s, period: "7d" })),
    ...(snapshots30d || []).map((s) => ({ snapshot: s, period: "30d" })),
    ...(allSnapshots || []).map((s) => ({ snapshot: s, period: "lifetime" })),
  ];

  allSnapshotsToProcess.forEach(({ snapshot }) => {
    const clients = extractAllRetailClients(snapshot);
    clients.forEach((client) => {
      if (!lotsHistory.has(client.userId)) {
        lotsHistory.set(client.userId, []);
      }
      
      // Count lots if trade was recent
      if (client.lastTradeVolume && client.lastTradeTime) {
        lotsHistory.get(client.userId)!.push({
          lots: client.lastTradeVolume,
          timestamp: client.lastTradeTime,
        });
      }
    });
  });

  // Calculate lots metrics for each user
  const lotsByUser: LotsMetrics[] = currentClients.map((client) => {
    const history = lotsHistory.get(client.userId) || [];
    const account = accountsMap.get(client.userId);
    
    // Calculate lots for each period
    const lots24h = history
      .filter((h) => h.timestamp >= twentyFourHoursAgo)
      .reduce((sum, h) => sum + h.lots, 0);
    
    const lots7d = history
      .filter((h) => h.timestamp >= sevenDaysAgo)
      .reduce((sum, h) => sum + h.lots, 0);
    
    const lots30d = history
      .filter((h) => h.timestamp >= thirtyDaysAgo)
      .reduce((sum, h) => sum + h.lots, 0);
    
    // Lifetime lots (from all available snapshots)
    const lotsLifetime = history.reduce((sum, h) => sum + h.lots, 0);

    return {
      userId: client.userId,
      name: client.name || `User ${client.userId}`,
      tradingAccountLogin: account?.login || client.accountNmber || 0,
      lots24h,
      lots7d,
      lots30d,
      lotsLifetime,
      lastTradeTime: client.lastTradeTime,
      lastTradeSymbol: client.lastTradeSymbol,
      lastTradeVolume: client.lastTradeVolume,
      commission: account?.commission || 0,
    };
  });

  // Create top lists
  const topLots24h = lotsByUser
    .filter((l) => l.lots24h > 0)
    .sort((a, b) => b.lots24h - a.lots24h)
    .slice(0, 10);

  const topLots7d = lotsByUser
    .filter((l) => l.lots7d > 0)
    .sort((a, b) => b.lots7d - a.lots7d)
    .slice(0, 10);

  const topLots30d = lotsByUser
    .filter((l) => l.lots30d > 0)
    .sort((a, b) => b.lots30d - a.lots30d)
    .slice(0, 10);

  const topLotsLifetime = lotsByUser
    .filter((l) => l.lotsLifetime > 0)
    .sort((a, b) => b.lotsLifetime - a.lotsLifetime)
    .slice(0, 10);

  return {
    lotsByUser,
    topLots24h,
    topLots7d,
    topLots30d,
    topLotsLifetime,
  };
}

