import type { Account, VantageSnapshot } from "../types";

export type RebateStatus = "hot" | "cooling" | "at_risk";

export interface RebateWithStatus extends Account {
  status: RebateStatus;
  commissionChange: number;
  commissionChangePercent: number;
  equityChange: number;
  equityChangePercent: number;
  trend: "up" | "down" | "stable";
}

/**
 * Calculate rebate status based on commission and equity changes
 */
export function calculateRebateStatus(
  account: Account,
  previousAccount: Account | undefined): RebateStatus {
  if (!previousAccount) {
    // New account - default to hot if commission > 0
    return account.commission > 0 ? "hot" : "cooling";
  }

  const commissionChange = account.commission - previousAccount.commission;
  const commissionChangePercent =
    previousAccount.commission > 0
      ? (commissionChange / previousAccount.commission) * 100
      : 0;

  const equityChange = account.equity - previousAccount.equity;
  const equityChangePercent =
    previousAccount.equity > 0 ? (equityChange / previousAccount.equity) * 100 : 0;

  // At risk: significant negative changes
  if (
    commissionChangePercent < -20 ||
    equityChangePercent < -30 ||
    (account.equity < 100 && previousAccount.equity > 500)
  ) {
    return "at_risk";
  }

  // Cooling: small negative or stagnant
  if (
    commissionChangePercent < -5 ||
    (commissionChangePercent === 0 && account.commission < previousAccount.commission * 0.8) ||
    equityChangePercent < -10
  ) {
    return "cooling";
  }

  // Hot: positive or stable growth
  return "hot";
}

/**
 * Get all rebates with status from current and previous snapshots
 * Now handles multiple accounts per userId (sub-ids)
 */
export function getRebatesWithStatus(
  currentSnapshot: VantageSnapshot | null,
  previousSnapshot: VantageSnapshot | null,
  // comparisonResult: ComparisonResult | null
): RebateWithStatus[] {
  if (!currentSnapshot) return [];

  // Map by login (unique identifier) for exact matching
  const previousAccountsByLogin = new Map<number, Account>();
  // Also map by userId for fallback when login doesn't match
  const previousAccountsByUserId = new Map<number, Account[]>();
  
  if (previousSnapshot) {
    previousSnapshot.accounts.forEach((acc) => {
      // Map by login for exact matching
      previousAccountsByLogin.set(acc.login, acc);
      
      // Map by userId for fallback (multiple accounts per userId)
      if (!previousAccountsByUserId.has(acc.userId)) {
        previousAccountsByUserId.set(acc.userId, []);
      }
      previousAccountsByUserId.get(acc.userId)!.push(acc);
    });
  }

  return currentSnapshot.accounts.map((account) => {
    // Try to find previous account by login first (exact match)
    let previousAccount = previousAccountsByLogin.get(account.login);
    
    // If no exact match, try to find by userId (for new accounts or when login changed)
    // Use the first account with same userId, or aggregate if needed
    if (!previousAccount && previousAccountsByUserId.has(account.userId)) {
      const previousAccountsForUserId = previousAccountsByUserId.get(account.userId)!;
      // If only one account for this userId, use it
      if (previousAccountsForUserId.length === 1) {
        previousAccount = previousAccountsForUserId[0];
      } else {
        // Multiple accounts for same userId - use the one with closest login or first one
        // For now, use first one (can be enhanced to match by login proximity)
        previousAccount = previousAccountsForUserId[0];
      }
    }
    
    const status = calculateRebateStatus(account, previousAccount);

    const commissionChange = previousAccount
      ? account.commission - previousAccount.commission
      : account.commission;
    const commissionChangePercent = previousAccount
      ? previousAccount.commission > 0
        ? (commissionChange / previousAccount.commission) * 100
        : 0
      : 0;

    const equityChange = previousAccount
      ? account.equity - previousAccount.equity
      : account.equity;
    const equityChangePercent = previousAccount
      ? previousAccount.equity > 0
        ? (equityChange / previousAccount.equity) * 100
        : 0
      : 0;

    let trend: "up" | "down" | "stable" = "stable";
    if (commissionChangePercent > 5) trend = "up";
    else if (commissionChangePercent < -5) trend = "down";

    return {
      ...account,
      status,
      commissionChange,
      commissionChangePercent,
      equityChange,
      equityChangePercent,
      trend,
    };
  });
}

