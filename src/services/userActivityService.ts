/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "@/core/utils/http_request";

/**
 * User activity data structure from API
 * Combines broker activity data with internal Rebtools funds
 */
interface UserActivityData {
  // Broker activity fields (from ActivityReport)
  account_id?: number;
  Net_Deposits?: number;
  Withdrawals?: number;
  Commission?: number;
  Volume?: number;
  [key: string]: any; // Other fields from ActivityReport.toJSON()

  // Internal Rebtools funds (from UserBalanceView)
  internal_deposits: number;
  internal_withdrawals: number;
  internal_balance: number;
  transaction_count: number;
  last_transaction_date: string | null;

  // Consolidated totals
  total_available_funds: number;
  broker_funds: number;
}

/**
 * API response structure
 */
interface UserActivityApiResponse {
  success: boolean;
  message: string;
  data: UserActivityData[];
}

/**
 * Fetches user activity data including balances from the API
 * @param accountId - The account ID to fetch activity for
 * @returns Promise with user activity data array
 */
export async function getUserActivity(accountId: number): Promise<UserActivityApiResponse> {
  const res = await http.get(`users/activity?account_id=${accountId}`);
  return res.data;
}

/**
 * Network balance structure for each blockchain network
 */
interface NetworkBalance {
  deposits: number;
  withdrawals: number;
  balance: number;
}

/**
 * User balance data structure from the new API endpoint
 */
interface UserBalanceData {
  total_balance: number;
  total_deposits: number;
  total_withdrawals: number;
  networks: Record<string, NetworkBalance>;
}

/**
 * API response structure for user balance
 */
interface UserBalanceApiResponse {
  success: boolean;
  data: UserBalanceData;
}

/**
 * Fetches user balance data from the API (no account_id required)
 * @returns Promise with user balance data
 */
export async function getUserBalance(): Promise<UserBalanceApiResponse> {
  const res = await http.get('users/balance');
  return res.data;
}

/**
 * Type exports for external use
 */
export type { UserActivityData, UserActivityApiResponse, UserBalanceData, UserBalanceApiResponse, NetworkBalance };
