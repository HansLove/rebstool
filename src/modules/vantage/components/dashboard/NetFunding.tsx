import { useMemo } from "react";
import { ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react";
import type { VantageSnapshot } from "../../types";
import { calculateNetFunding } from "../../utils/netFunding";

interface NetFundingProps {
  currentSnapshot: VantageSnapshot | null;
  previousSnapshot: VantageSnapshot | null;
  snapshots30d: VantageSnapshot[];
  onUserClick?: (userId: number) => void;
}

export default function NetFunding({
  currentSnapshot,
  previousSnapshot,
  snapshots30d,
  onUserClick,
}: NetFundingProps) {
  const netFundingData = useMemo(() => {
    if (!currentSnapshot) return null;
    return calculateNetFunding(
      currentSnapshot,
      snapshots30d || [],
      previousSnapshot || null
    );
  }, [currentSnapshot, previousSnapshot, snapshots30d]);

  if (!netFundingData) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <p className="text-gray-500 dark:text-gray-400 text-center">No data available</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) =>
    `$${Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const { topNetFunders, topNetWithdrawers, totalCommunityNetFunding } = netFundingData;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center gap-2 mb-6">
        <ArrowUpDown className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Net Funding Analysis
        </h2>
      </div>

      {/* Total Community Net Funding */}
      <div className="mb-6">
        <div
          className={`rounded-lg p-4 border ${
            totalCommunityNetFunding >= 0
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Community Net Funding (30d)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Deposits - Withdrawals
              </p>
            </div>
            <div className="text-right">
              <p
                className={`text-2xl font-bold ${
                  totalCommunityNetFunding >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {totalCommunityNetFunding >= 0 ? "+" : "-"}
                {formatCurrency(totalCommunityNetFunding)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Net Funders */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Net Funders
            </h3>
          </div>
          <div className="space-y-2">
            {topNetFunders.length > 0 ? (
              topNetFunders.slice(0, 10).map((user, index) => (
                <div
                  key={user.userId}
                  className="border border-green-200 dark:border-green-800 rounded-lg p-3 hover:bg-green-50 dark:hover:bg-green-900/10 cursor-pointer transition-colors"
                  onClick={() => onUserClick?.(user.userId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-green-600 dark:text-green-400">
                        #{index + 1}
                      </span>
                      <div>
                        <div className="font-semibold text-sm text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Login: {user.tradingAccountLogin}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-600 dark:text-green-400">
                        +{formatCurrency(user.netFunding)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        D: {formatCurrency(user.totalDeposits)} | W: {formatCurrency(user.totalWithdrawals)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No net funders
              </p>
            )}
          </div>
        </div>

        {/* Top Net Withdrawers */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Net Withdrawers
            </h3>
          </div>
          <div className="space-y-2">
            {topNetWithdrawers.length > 0 ? (
              topNetWithdrawers.slice(0, 10).map((user, index) => (
                <div
                  key={user.userId}
                  className="border border-red-200 dark:border-red-800 rounded-lg p-3 hover:bg-red-50 dark:hover:bg-red-900/10 cursor-pointer transition-colors"
                  onClick={() => onUserClick?.(user.userId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-red-600 dark:text-red-400">
                        #{index + 1}
                      </span>
                      <div>
                        <div className="font-semibold text-sm text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Login: {user.tradingAccountLogin}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-red-600 dark:text-red-400">
                        {formatCurrency(user.netFunding)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        D: {formatCurrency(user.totalDeposits)} | W: {formatCurrency(user.totalWithdrawals)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No net withdrawers
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

