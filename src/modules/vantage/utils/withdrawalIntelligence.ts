import type { VantageSnapshot, RetailClient } from "../types";
import { extractAllRetailClients } from "./snapshotHelpers";

export type WithdrawalAlertLevel = "none" | "warning" | "critical" | "emptied";

export interface WithdrawalIntelligence {
  userId: number;
  name: string;
  tradingAccountLogin: number;
  
  // Current state
  currentEquity: number;
  previousEquity: number;
  
  // Withdrawal metrics
  withdrawalAmount7d: number;
  withdrawalAmount30d: number;
  withdrawalPct7d: number;
  withdrawalPct30d: number;
  
  // Alert level
  alertLevel: WithdrawalAlertLevel;
  alertLevel7d: WithdrawalAlertLevel;
  alertLevel30d: WithdrawalAlertLevel;
  
  // Additional context
  lastWithdrawalDate: number | null;
  peakEquity: number; // Highest equity seen in period
  peakEquityDate: number | null;
}

export interface WithdrawalIntelligenceResult {
  withdrawals: WithdrawalIntelligence[];
  summary: {
    totalEmptied: number;
    totalCritical: number;
    totalWarning: number;
    totalWithdrawals7d: number;
    totalWithdrawals30d: number;
  };
}

/**
 * Calculate withdrawal intelligence for all users across snapshots
 */
export function calculateWithdrawalIntelligence(
  currentSnapshot: VantageSnapshot,
  snapshots7d: VantageSnapshot[] = [],
  snapshots30d: VantageSnapshot[] = [],
  previousSnapshot: VantageSnapshot | null = null
): WithdrawalIntelligenceResult {
  // Ensure arrays are defined
  const safeSnapshots7d = snapshots7d || [];
  const safeSnapshots30d = snapshots30d || [];

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  // Get all current clients (supports new and legacy structure)
  const currentClients = extractAllRetailClients(currentSnapshot);

  // Build historical equity map for each user
  const equityHistory = new Map<number, Array<{ equity: number; timestamp: number }>>();

  // Add current equity
  currentClients.forEach((client) => {
    if (!equityHistory.has(client.userId)) {
      equityHistory.set(client.userId, []);
    }
    equityHistory.get(client.userId)!.push({
      equity: client.equity || 0,
      timestamp: currentSnapshot.timestamp,
    });
  });

  // Add previous snapshot equity if available (most recent comparison point)
  if (previousSnapshot) {
    const previousClients = extractAllRetailClients(previousSnapshot);
    previousClients.forEach((client) => {
      if (!equityHistory.has(client.userId)) {
        equityHistory.set(client.userId, []);
      }
      equityHistory.get(client.userId)!.push({
        equity: client.equity || 0,
        timestamp: previousSnapshot.timestamp,
      });
    });
  }

  // Add historical equity from snapshots (avoid duplicates with previousSnapshot)
  const allHistoricalSnapshots = [...safeSnapshots7d, ...safeSnapshots30d].filter(
    (snapshot) => !previousSnapshot || snapshot.id !== previousSnapshot.id
  );
  
  allHistoricalSnapshots.forEach((snapshot) => {
    const clients = extractAllRetailClients(snapshot);
    clients.forEach((client) => {
      if (!equityHistory.has(client.userId)) {
        equityHistory.set(client.userId, []);
      }
      equityHistory.get(client.userId)!.push({
        equity: client.equity || 0,
        timestamp: snapshot.timestamp,
      });
    });
  });

  // Calculate withdrawal intelligence for each user
  const withdrawals: WithdrawalIntelligence[] = currentClients.map((client) => {
    const history = equityHistory.get(client.userId) || [];
    
    // Sort by timestamp (oldest first)
    history.sort((a, b) => a.timestamp - b.timestamp);

    // Find equity at different time points
    const currentEquity = client.equity || 0;
    
    // Use previous snapshot equity if available (most accurate comparison)
    let previousEquity = currentEquity;
    if (previousSnapshot) {
      const previousClients = extractAllRetailClients(previousSnapshot);
      const previousClient = previousClients.find((c) => c.userId === client.userId);
      if (previousClient) {
        previousEquity = previousClient.equity || 0;
      }
    }
    
    // Find equity 7 days ago (closest snapshot before 7 days ago)
    const equity7dAgo = history
      .filter((h) => h.timestamp <= sevenDaysAgo && h.timestamp < currentSnapshot.timestamp)
      .sort((a, b) => b.timestamp - a.timestamp)[0]?.equity || previousEquity;
    
    // Find equity 30 days ago
    const equity30dAgo = history
      .filter((h) => h.timestamp <= thirtyDaysAgo && h.timestamp < currentSnapshot.timestamp)
      .sort((a, b) => b.timestamp - a.timestamp)[0]?.equity || previousEquity;

    // Find peak equity in the period
    const peakEquityEntry = history.reduce(
      (max, entry) => (entry.equity > max.equity ? entry : max),
      history[0] || { equity: currentEquity, timestamp: currentSnapshot.timestamp }
    );
    const peakEquity = peakEquityEntry.equity;
    const peakEquityDate = peakEquityEntry.timestamp;

    // Calculate withdrawals (only if equity decreased)
    // Use previousEquity for most recent comparison if available
    const withdrawalAmount7d = Math.max(0, equity7dAgo - currentEquity);
    const withdrawalAmount30d = Math.max(0, equity30dAgo - currentEquity);
    
    // Also calculate withdrawal from previous snapshot if available (most accurate)
    const withdrawalFromPrevious = previousEquity > currentEquity 
      ? previousEquity - currentEquity 
      : 0;
    const withdrawalPctFromPrevious = previousEquity > 0 
      ? (withdrawalFromPrevious / previousEquity) * 100 
      : 0;
    
    const withdrawalPct7d = equity7dAgo > 0 ? (withdrawalAmount7d / equity7dAgo) * 100 : 0;
    const withdrawalPct30d = equity30dAgo > 0 ? (withdrawalAmount30d / equity30dAgo) * 100 : 0;

    // Determine alert levels - use previous snapshot if available, otherwise use 30d
    const alertLevel7d = getAlertLevel(withdrawalPct7d, currentEquity, equity7dAgo);
    const alertLevel30d = getAlertLevel(withdrawalPct30d, currentEquity, equity30dAgo);
    
    // Use previous snapshot alert level if available and significant, otherwise use 30d
    const alertLevelFromPrevious = previousSnapshot 
      ? getAlertLevel(withdrawalPctFromPrevious, currentEquity, previousEquity)
      : "none";
    
    // Primary alert: use previous snapshot if it's critical/warning/emptied, otherwise use 30d
    const alertLevel = (alertLevelFromPrevious !== "none" && previousSnapshot)
      ? alertLevelFromPrevious
      : alertLevel30d;

    // Find last withdrawal date (when equity decreased significantly)
    let lastWithdrawalDate: number | null = null;
    for (let i = history.length - 1; i > 0; i--) {
      const prev = history[i - 1];
      const curr = history[i];
      if (prev.equity > curr.equity && prev.equity - curr.equity > 10) {
        lastWithdrawalDate = curr.timestamp;
        break;
      }
    }

    // Find account login
    const account = currentSnapshot.accounts.find((acc) => acc.userId === client.userId);
    const tradingAccountLogin = account?.login || client.accountNmber || 0;

    return {
      userId: client.userId,
      name: client.name || `User ${client.userId}`,
      tradingAccountLogin,
      currentEquity,
      previousEquity: previousEquity, // Use most recent previous equity
      withdrawalAmount7d,
      withdrawalAmount30d,
      withdrawalPct7d,
      withdrawalPct30d,
      alertLevel,
      alertLevel7d,
      alertLevel30d,
      lastWithdrawalDate,
      peakEquity,
      peakEquityDate,
    };
  });

  // Calculate summary
  const summary = {
    totalEmptied: withdrawals.filter((w) => w.alertLevel === "emptied").length,
    totalCritical: withdrawals.filter((w) => w.alertLevel === "critical").length,
    totalWarning: withdrawals.filter((w) => w.alertLevel === "warning").length,
    totalWithdrawals7d: withdrawals.reduce((sum, w) => sum + w.withdrawalAmount7d, 0),
    totalWithdrawals30d: withdrawals.reduce((sum, w) => sum + w.withdrawalAmount30d, 0),
  };

  return {
    withdrawals,
    summary,
  };
}

/**
 * Determine alert level based on withdrawal percentage
 */
function getAlertLevel(
  withdrawalPct: number,
  currentEquity: number,
  previousEquity: number
): WithdrawalAlertLevel {
  // Account emptied: 100% withdrawn or equity went from significant to near zero
  if (
    withdrawalPct >= 100 ||
    (previousEquity > 100 && currentEquity < 10)
  ) {
    return "emptied";
  }
  
  // Critical: 85%+ withdrawn
  if (withdrawalPct >= 85) {
    return "critical";
  }
  
  // Warning: 70%+ withdrawn
  if (withdrawalPct >= 70) {
    return "warning";
  }
  
  return "none";
}

/**
 * Get alert color for UI
 */
export function getAlertColor(level: WithdrawalAlertLevel): string {
  switch (level) {
    case "emptied":
      return "red";
    case "critical":
      return "orange";
    case "warning":
      return "yellow";
    default:
      return "gray";
  }
}

/**
 * Get alert emoji for UI
 */
export function getAlertEmoji(level: WithdrawalAlertLevel): string {
  switch (level) {
    case "emptied":
      return "🔴";
    case "critical":
      return "🟠";
    case "warning":
      return "🟡";
    default:
      return "";
  }
}

