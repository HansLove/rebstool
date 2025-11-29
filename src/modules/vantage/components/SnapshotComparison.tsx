/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { AlertTriangle, TrendingUp, TrendingDown, Users } from "lucide-react";
import type { VantageSnapshot } from "../types";
import { compareSnapshots as compareSnapshotsUtil } from "../utils/vantageAnalytics";

interface SnapshotComparisonProps {
  previous: VantageSnapshot | null;
  current: VantageSnapshot | null;
}

export default function SnapshotComparison({
  previous,
  current,
}: SnapshotComparisonProps) {
  const comparison = useMemo(() => {
    if (!previous || !current) return null;
    return compareSnapshotsUtil(previous, current);
  }, [previous, current]);

  if (!comparison) return null;

  const formatCurrency = (amount: number) => {
    const sign = amount >= 0 ? "+" : "";
    return `${sign}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? "+" : "";
    return `${sign}${percent.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Financial Changes */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Financial Changes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Commission Change */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Commission</span>
              {comparison.commissionChange >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
            </div>
            <p
              className={`text-2xl font-bold ${
                comparison.commissionChange >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {formatCurrency(comparison.commissionChange)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formatPercent(comparison.commissionChangePercent)}
            </p>
          </div>

          {/* Equity Change */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Equity</span>
              {comparison.equityChange >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
            </div>
            <p
              className={`text-2xl font-bold ${
                comparison.equityChange >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {formatCurrency(comparison.equityChange)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formatPercent(comparison.equityChangePercent)}
            </p>
          </div>

          {/* Deposits Change */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Deposits</span>
              {comparison.depositsChange >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
            </div>
            <p
              className={`text-2xl font-bold ${
                comparison.depositsChange >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {formatCurrency(comparison.depositsChange)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formatPercent(comparison.depositsChangePercent)}
            </p>
          </div>

          {/* Trading Volume Change */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Trading Volume</span>
              {comparison.tradingVolumeChange >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
            </div>
            <p
              className={`text-2xl font-bold ${
                comparison.tradingVolumeChange >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {comparison.tradingVolumeChange >= 0 ? "+" : ""}
              {comparison.tradingVolumeChange.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formatPercent(comparison.tradingVolumeChangePercent)} | Active:{" "}
              {comparison.activeTradersChange >= 0 ? "+" : ""}
              {comparison.activeTradersChange}
            </p>
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      {(comparison.clientsLost > 0 ||
        comparison.highValueClientsLost.length > 0 ||
        comparison.significantWithdrawals.length > 0 ||
        comparison.emptiedAccounts.length > 0) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            <h2 className="text-xl font-semibold text-red-900 dark:text-red-100">
              Critical Alerts
            </h2>
          </div>

          {/* Clients Lost */}
          {comparison.clientsLost > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                Clients Lost: {comparison.clientsLost}
              </p>
              {comparison.highValueClientsLost.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mt-2">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    High-Value Clients Lost:
                  </p>
                  <div className="space-y-1">
                    {comparison.highValueClientsLost.slice(0, 5).map((client) => (
                      <div
                        key={client.userId}
                        className="flex justify-between text-sm text-gray-900 dark:text-white"
                      >
                        <span>{client.name}</span>
                        <span className="font-medium">
                          ${client.lastEquity.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Significant Withdrawals */}
          {comparison.significantWithdrawals.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                Significant Withdrawals: {comparison.significantWithdrawals.length}
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <div className="space-y-1">
                  {comparison.significantWithdrawals.slice(0, 5).map((withdrawal) => (
                    <div
                      key={withdrawal.userId}
                      className="flex justify-between text-sm text-gray-900 dark:text-white"
                    >
                      <span>{withdrawal.name}</span>
                      <span className="font-medium text-red-600 dark:text-red-400">
                        {formatCurrency(withdrawal.equityChange)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Emptied Accounts */}
          {comparison.emptiedAccounts.length > 0 && (
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                Emptied Accounts: {comparison.emptiedAccounts.length}
              </p>
              <p className="text-xs text-red-700 dark:text-red-300 mb-2">
                Accounts that had significant equity and are now nearly empty
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <div className="space-y-2">
                  {comparison.emptiedAccounts.slice(0, 5).map((account) => (
                    <div
                      key={account.userId}
                      className="flex justify-between items-center text-sm"
                    >
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {account.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {account.userId}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-through">
                          {formatCurrency(account.previousEquity)}
                        </p>
                        <p className="text-sm font-bold text-red-600 dark:text-red-400">
                          {formatCurrency(account.currentEquity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Positive Changes */}
      {comparison.clientsGained > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            <h2 className="text-xl font-semibold text-green-900 dark:text-green-100">
              New Clients: {comparison.clientsGained}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}

