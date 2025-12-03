import type { VantageSnapshot, RetailClient, Account } from "../types";
import { extractAllRetailClients } from "./snapshotHelpers";

export interface DepositMetrics {
  userId: number;
  name: string;
  tradingAccountLogin: number;
  
  // Deposit metrics
  totalDeposits: number;
  numberOfDeposits: number;
  lastDepositTime: number | null;
  lastDepositAmount: number | null;
  lastDepositCurrency: string | null;
  
  // Deposit velocity (days between deposits on average)
  depositVelocity: number | null; // Days between deposits, null if < 2 deposits
  
  // First deposit
  firstDepositTime: number | null;
  firstDepositAmount: number | null;
  
  // Additional context
  currentEquity: number;
  currentBalance: number;
}

export interface DepositIntelligenceResult {
  deposits: DepositMetrics[];
  topDepositors: DepositMetrics[];
  topDepositCounts: DepositMetrics[];
  recentDepositors: DepositMetrics[];
}

/**
 * Analyze deposit intelligence from snapshots
 */
export function analyzeDeposits(
  currentSnapshot: VantageSnapshot,
  snapshots30d: VantageSnapshot[] = []
): DepositIntelligenceResult {
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  // Get all current clients (supports new and legacy structure)
  const currentClients = extractAllRetailClients(currentSnapshot);

  // Create accounts map
  const accountsMap = new Map<number, Account>();
  currentSnapshot.accounts.forEach((acc) => {
    accountsMap.set(acc.userId, acc);
  });

  // Build deposit history map
  const depositHistory = new Map<
    number,
    Array<{ amount: number; timestamp: number; currency: string | null }>
  >();

  // Process all snapshots to collect deposit data
  const allSnapshots = [
    { snapshot: currentSnapshot, period: "current" },
    ...(snapshots30d || []).map((s) => ({ snapshot: s, period: "30d" })),
  ];

  allSnapshots.forEach(({ snapshot }) => {
    const clients = extractAllRetailClients(snapshot);
    clients.forEach((client) => {
      if (!depositHistory.has(client.userId)) {
        depositHistory.set(client.userId, []);
      }
      
      // Track deposits (use lastDepositTime/Amount as indicator)
      if (client.lastDepositTime && client.lastDepositAmount) {
        const deposits = depositHistory.get(client.userId)!;
        
        // Avoid duplicates - check if this deposit timestamp already exists
        const exists = deposits.some(
          (d) => Math.abs(d.timestamp - client.lastDepositTime!) < 24 * 60 * 60 * 1000
        );
        
        if (!exists) {
          deposits.push({
            amount: client.lastDepositAmount,
            timestamp: client.lastDepositTime,
            currency: client.lastDepositCurrency || null,
          });
        }
      }
    });
  });

  // Calculate deposit metrics for each user
  const depositsRaw: DepositMetrics[] = currentClients.map((client) => {
    const history = depositHistory.get(client.userId) || [];
    const account = accountsMap.get(client.userId);
    
    // Sort deposits by timestamp
    history.sort((a, b) => a.timestamp - b.timestamp);
    
    // Calculate totals
    const totalDeposits = history.reduce((sum, d) => sum + d.amount, 0);
    const numberOfDeposits = history.length;
    
    // Get last deposit
    const lastDeposit = history[history.length - 1] || null;
    const lastDepositTime = lastDeposit?.timestamp || client.lastDepositTime || null;
    const lastDepositAmount = lastDeposit?.amount || client.lastDepositAmount || null;
    const lastDepositCurrency = lastDeposit?.currency || client.lastDepositCurrency || null;
    
    // Get first deposit
    const firstDeposit = history[0] || null;
    const firstDepositTime = firstDeposit?.timestamp || client.firstDepositDate || null;
    const firstDepositAmount = firstDeposit?.amount || null;
    
    // Calculate deposit velocity (average days between deposits)
    let depositVelocity: number | null = null;
    if (history.length >= 2) {
      const timeSpan = history[history.length - 1].timestamp - history[0].timestamp;
      const daysSpan = timeSpan / (24 * 60 * 60 * 1000);
      depositVelocity = daysSpan / (history.length - 1);
    }

    return {
      userId: client.userId,
      name: client.name || `User ${client.userId}`,
      tradingAccountLogin: account?.login || client.accountNmber || 0,
      totalDeposits,
      numberOfDeposits,
      lastDepositTime,
      lastDepositAmount,
      lastDepositCurrency,
      depositVelocity,
      firstDepositTime,
      firstDepositAmount,
      currentEquity: client.equity || 0,
      currentBalance: client.accountBalance || 0,
    };
  });

  // Deduplicate by userId - if same user appears multiple times, keep the one with highest totalDeposits
  const userIdMap = new Map<number, DepositMetrics>();
  depositsRaw.forEach((deposit) => {
    const existing = userIdMap.get(deposit.userId);
    if (!existing || deposit.totalDeposits > existing.totalDeposits) {
      userIdMap.set(deposit.userId, deposit);
    }
  });
  const deposits = Array.from(userIdMap.values());

  // Create top lists
  const topDepositors = deposits
    .filter((d) => d.totalDeposits > 0)
    .sort((a, b) => b.totalDeposits - a.totalDeposits)
    .slice(0, 10);

  const topDepositCounts = deposits
    .filter((d) => d.numberOfDeposits > 0)
    .sort((a, b) => b.numberOfDeposits - a.numberOfDeposits)
    .slice(0, 10);

  // Recent depositors (deposited in last 7 days)
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const recentDepositors = deposits
    .filter((d) => d.lastDepositTime && d.lastDepositTime >= sevenDaysAgo)
    .sort((a, b) => (b.lastDepositTime || 0) - (a.lastDepositTime || 0))
    .slice(0, 20);

  return {
    deposits,
    topDepositors,
    topDepositCounts,
    recentDepositors,
  };
}

