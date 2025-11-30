import type { Account, VantageSnapshot, ComparisonResult } from "../types";

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
  previousAccount: Account | undefined,
  comparisonResult: ComparisonResult | null
): RebateStatus {
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
 */
export function getRebatesWithStatus(
  currentSnapshot: VantageSnapshot | null,
  previousSnapshot: VantageSnapshot | null,
  comparisonResult: ComparisonResult | null
): RebateWithStatus[] {
  if (!currentSnapshot) return [];

  const previousAccountsMap = new Map<number, Account>();
  if (previousSnapshot) {
    previousSnapshot.accounts.forEach((acc) => {
      previousAccountsMap.set(acc.userId, acc);
    });
  }

  return currentSnapshot.accounts.map((account) => {
    const previousAccount = previousAccountsMap.get(account.userId);
    const status = calculateRebateStatus(account, previousAccount, comparisonResult);

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

