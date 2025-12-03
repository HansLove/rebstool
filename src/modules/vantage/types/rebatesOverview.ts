/**
 * Types for Rebates Overview Dashboard
 */

export type TraderStatusFlag = "ok" | "high_withdrawal_risk" | "critical_withdrawal" | "emptied_account";

export interface TraderKPI {
  userId: number;
  tradingAccountLogin: number;
  name: string;
  email: string | null;
  phone: string;
  
  // Lots traded
  lots7d: number;
  lots30d: number;
  
  // Deposits
  numberOfDeposits: number;
  totalDeposits: number;
  
  // Withdrawals (30 days)
  withdrawalAmount30d: number;
  withdrawalPct30d: number;
  
  // Status
  statusFlag: TraderStatusFlag;
  
  // Additional info
  currentEquity: number;
  currentBalance: number;
  commission: number;
}

export interface RankingItem {
  userId: number;
  name: string;
  tradingAccountLogin: number;
  value: number;
  statusFlag?: TraderStatusFlag;
  // Additional context for withdrawals
  withdrawalAmount30d?: number;
}

export interface RebatesRankings {
  topVolume7d: RankingItem[];
  topVolume30d: RankingItem[];
  topDeposits: RankingItem[];
  topWithdrawalPct: RankingItem[];
}

export interface RebatesOverviewResponse {
  traders: TraderKPI[];
  rankings: RebatesRankings;
}

