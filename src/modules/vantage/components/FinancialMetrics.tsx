/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { DollarSign, TrendingUp, Users, Activity } from "lucide-react";
import type { VantageSnapshot } from "../types";
import { calculateMetrics } from "../utils/vantageAnalytics";

interface FinancialMetricsProps {
  snapshot: VantageSnapshot | null;
}

export default function FinancialMetrics({ snapshot }: FinancialMetricsProps) {
  const metrics = useMemo(() => {
    if (!snapshot) return null;
    return calculateMetrics(snapshot);
  }, [snapshot]);

  if (!metrics) return null;

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(2)}K`;
    }
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          {/* Total Commission - Most Important for Rebates */}
          <div className="flex items-center gap-3 min-w-[180px]">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Commission</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(metrics.totalCommission)}
              </p>
            </div>
          </div>

          {/* Total Retail Equity */}
          <div className="flex items-center gap-3 min-w-[180px]">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Retail Equity</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(metrics.totalRetailEquity)}
              </p>
            </div>
          </div>

          {/* Active Clients */}
          <div className="flex items-center gap-3 min-w-[150px]">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Active Clients</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {metrics.activeClients}
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">
                  / {metrics.activeClients + metrics.inactiveClients}
                </span>
              </p>
            </div>
          </div>

          {/* Total Deposits */}
          <div className="flex items-center gap-3 min-w-[180px]">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Deposits</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(metrics.totalDeposits)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Avg: {formatCurrency(metrics.averageDeposit)}
              </p>
            </div>
          </div>

          {/* Trading Activity */}
          <div className="flex items-center gap-3 min-w-[150px]">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Trading Volume</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {metrics.totalTradingVolume >= 1000000
                  ? `${(metrics.totalTradingVolume / 1000000).toFixed(2)}M`
                  : metrics.totalTradingVolume >= 1000
                  ? `${(metrics.totalTradingVolume / 1000).toFixed(2)}K`
                  : metrics.totalTradingVolume.toFixed(0)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {metrics.clientsWithRecentTrades} active traders
              </p>
            </div>
          </div>

          {/* Recent Activity Indicator */}
          <div className="flex items-center gap-3 ml-auto min-w-[120px]">
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">Recent Activity</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {metrics.clientsWithRecentDeposits} deposits
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                (last 30 days)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

