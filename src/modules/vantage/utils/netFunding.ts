import type { VantageSnapshot, RetailClient, Account } from "../types";

export interface NetFundingMetrics {
  userId: number;
  name: string;
  tradingAccountLogin: number;
  totalDeposits: number;
  totalWithdrawals: number;
  netFunding: number; // deposits - withdrawals
  currentEquity: number;
  lastDepositTime: number | null;
  lastWithdrawalTime: number | null;
}

export interface NetFundingResult {
  netFundingByUser: NetFundingMetrics[];
  topNetFunders: NetFundingMetrics[]; // Positive net funding
  topNetWithdrawers: NetFundingMetrics[]; // Negative net funding
  totalCommunityNetFunding: number;
}

/**
 * Calculate net funding (deposits - withdrawals) per person
 */
export function calculateNetFunding(
  currentSnapshot: VantageSnapshot,
  snapshots30d: VantageSnapshot[] = [],
  previousSnapshot: VantageSnapshot | null = null
): NetFundingResult {
  const safeSnapshots30d = snapshots30d || [];
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  // Get all current clients
  const currentClients = currentSnapshot.retailResults.flatMap(
    (result) => result.retail?.data || []
  );

  // Create accounts map
  const accountsMap = new Map<number, Account>();
  currentSnapshot.accounts.forEach((acc) => {
    accountsMap.set(acc.userId, acc);
  });

  // Build deposit and withdrawal history
  const depositHistory = new Map<
    number,
    Array<{ amount: number; timestamp: number }>
  >();
  const withdrawalHistory = new Map<
    number,
    Array<{ amount: number; timestamp: number }>
  >();

  // Process all snapshots including previous snapshot
  const allSnapshots = previousSnapshot
    ? [previousSnapshot, ...safeSnapshots30d]
    : safeSnapshots30d;

  // Add current snapshot data
  currentClients.forEach((client) => {
    if (client.lastDepositTime && client.lastDepositAmount) {
      if (!depositHistory.has(client.userId)) {
        depositHistory.set(client.userId, []);
      }
      depositHistory.get(client.userId)!.push({
        amount: client.lastDepositAmount,
        timestamp: client.lastDepositTime,
      });
    }
  });

  // Process historical snapshots
  allSnapshots.forEach((snapshot) => {
    const clients = snapshot.retailResults.flatMap(
      (result) => result.retail?.data || []
    );
    clients.forEach((client) => {
      // Track deposits
      if (client.lastDepositTime && client.lastDepositAmount) {
        if (!depositHistory.has(client.userId)) {
          depositHistory.set(client.userId, []);
        }
        const deposits = depositHistory.get(client.userId)!;
        // Avoid duplicates - check if this deposit timestamp already exists
        const exists = deposits.some(
          (d) => Math.abs(d.timestamp - client.lastDepositTime!) < 24 * 60 * 60 * 1000
        );
        if (!exists) {
          deposits.push({
            amount: client.lastDepositAmount,
            timestamp: client.lastDepositTime,
          });
        }
      }

      // Track withdrawals (equity decreases)
      // We'll calculate withdrawals by comparing equity changes between snapshots
      // This is done in the main calculation loop below
    });
  });

  // Calculate net funding for each user
  const netFundingByUser: NetFundingMetrics[] = currentClients.map((client) => {
    const deposits = depositHistory.get(client.userId) || [];
    const account = accountsMap.get(client.userId);

    // Calculate total deposits (last 30 days)
    const totalDeposits = deposits
      .filter((d) => d.timestamp >= thirtyDaysAgo)
      .reduce((sum, d) => sum + d.amount, 0);

    // Calculate withdrawals from equity changes
    // Compare current equity with previous snapshot or historical equity
    let totalWithdrawals = 0;
    let lastWithdrawalTime: number | null = null;

    if (previousSnapshot) {
      const previousClients = previousSnapshot.retailResults.flatMap(
        (result) => result.retail?.data || []
      );
      const previousClient = previousClients.find((c) => c.userId === client.userId);
      
      if (previousClient) {
        const previousEquity = previousClient.equity || 0;
        const currentEquity = client.equity || 0;
        
        // If equity decreased significantly, it's likely a withdrawal
        if (previousEquity > currentEquity && previousEquity - currentEquity > 10) {
          totalWithdrawals = previousEquity - currentEquity;
          lastWithdrawalTime = currentSnapshot.timestamp;
        }
      }
    }

    // Also check historical snapshots for withdrawals
    const equityHistory: Array<{ equity: number; timestamp: number }> = [];
    allSnapshots.forEach((snapshot) => {
      const snapshotClients = snapshot.retailResults.flatMap(
        (result) => result.retail?.data || []
      );
      const snapshotClient = snapshotClients.find((c) => c.userId === client.userId);
      if (snapshotClient) {
        equityHistory.push({
          equity: snapshotClient.equity || 0,
          timestamp: snapshot.timestamp,
        });
      }
    });

    // Sort by timestamp and find significant equity decreases
    equityHistory.sort((a, b) => a.timestamp - b.timestamp);
    for (let i = equityHistory.length - 1; i > 0; i--) {
      const prev = equityHistory[i - 1];
      const curr = equityHistory[i];
      if (prev.equity > curr.equity && prev.equity - curr.equity > 10) {
        const withdrawal = prev.equity - curr.equity;
        if (curr.timestamp >= thirtyDaysAgo) {
          totalWithdrawals += withdrawal;
          if (!lastWithdrawalTime || curr.timestamp > lastWithdrawalTime) {
            lastWithdrawalTime = curr.timestamp;
          }
        }
      }
    }

    const netFunding = totalDeposits - totalWithdrawals;
    const lastDeposit = deposits
      .filter((d) => d.timestamp >= thirtyDaysAgo)
      .sort((a, b) => b.timestamp - a.timestamp)[0];

    return {
      userId: client.userId,
      name: client.name || `User ${client.userId}`,
      tradingAccountLogin: account?.login || client.accountNmber || 0,
      totalDeposits,
      totalWithdrawals,
      netFunding,
      currentEquity: client.equity || 0,
      lastDepositTime: lastDeposit?.timestamp || null,
      lastWithdrawalTime,
    };
  });

  // Calculate total community net funding
  const totalCommunityNetFunding = netFundingByUser.reduce(
    (sum, user) => sum + user.netFunding,
    0
  );

  // Create top lists
  const topNetFunders = netFundingByUser
    .filter((n) => n.netFunding > 0)
    .sort((a, b) => b.netFunding - a.netFunding)
    .slice(0, 10);

  const topNetWithdrawers = netFundingByUser
    .filter((n) => n.netFunding < 0)
    .sort((a, b) => a.netFunding - b.netFunding)
    .slice(0, 10);

  return {
    netFundingByUser,
    topNetFunders,
    topNetWithdrawers,
    totalCommunityNetFunding,
  };
}

