import { useMemo } from "react";
import { DollarSign, Clock, TrendingUp } from "lucide-react";
import type { VantageSnapshot } from "../../types";
import { analyzeDeposits } from "../../utils/depositIntelligence";

interface DepositIntelligenceProps {
  currentSnapshot: VantageSnapshot | null;
  snapshots30d: VantageSnapshot[];
  onUserClick?: (userId: number) => void;
}

export default function DepositIntelligence({
  currentSnapshot,
  snapshots30d,
  onUserClick,
}: DepositIntelligenceProps) {
  const intelligence = useMemo(() => {
    if (!currentSnapshot) return null;
    return analyzeDeposits(currentSnapshot, snapshots30d);
  }, [currentSnapshot, snapshots30d]);

  if (!intelligence) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <p className="text-gray-500 dark:text-gray-400 text-center">No data available</p>
      </div>
    );
  }

  const { topDepositors, topDepositCounts, recentDepositors } = intelligence;

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center gap-2 mb-6">
        <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Deposit Intelligence
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Depositors by Amount */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Top Depositors (Total Amount)
          </h3>
          <div className="space-y-2">
            {topDepositors.length > 0 ? (
              topDepositors.map((deposit, index) => (
                <DepositRow
                  key={deposit.userId}
                  deposit={deposit}
                  rank={index + 1}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                  onUserClick={onUserClick}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No deposit data
              </p>
            )}
          </div>
        </div>

        {/* Top Depositors by Count */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Top Depositors (Number of Deposits)
          </h3>
          <div className="space-y-2">
            {topDepositCounts.length > 0 ? (
              topDepositCounts.map((deposit, index) => (
                <DepositRow
                  key={deposit.userId}
                  deposit={deposit}
                  rank={index + 1}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                  onUserClick={onUserClick}
                  showCount={true}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No deposit data
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Depositors */}
      {recentDepositors.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Recent Depositors (Last 7 Days)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {recentDepositors.slice(0, 20).map((deposit) => (
              <div
                key={deposit.userId}
                className="border border-green-200 dark:border-green-800 rounded-lg p-3 bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20 cursor-pointer transition-colors"
                onClick={() => onUserClick?.(deposit.userId)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {deposit.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      Login: {deposit.tradingAccountLogin}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(deposit.lastDepositAmount || 0)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(deposit.lastDepositTime)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface DepositRowProps {
  deposit: {
    userId: number;
    name: string;
    tradingAccountLogin: number;
    totalDeposits: number;
    numberOfDeposits: number;
    lastDepositTime: number | null;
    lastDepositAmount: number | null;
    depositVelocity: number | null;
    currentEquity: number;
  };
  rank: number;
  formatCurrency: (amount: number) => string;
  formatDate: (timestamp: number | null) => string;
  onUserClick?: (userId: number) => void;
  showCount?: boolean;
}

function DepositRow({
  deposit,
  rank,
  formatCurrency,
  formatDate,
  onUserClick,
  showCount = false,
}: DepositRowProps) {
  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-600 dark:text-yellow-400";
    if (rank === 2) return "text-gray-500 dark:text-gray-400";
    if (rank === 3) return "text-orange-600 dark:text-orange-400";
    return "text-gray-400 dark:text-gray-500";
  };

  return (
    <div
      className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
      onClick={() => onUserClick?.(deposit.userId)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`font-bold text-lg ${getRankColor(rank)}`}>#{rank}</span>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">{deposit.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Login: {deposit.tradingAccountLogin}
              {deposit.depositVelocity && (
                <span> • Every {deposit.depositVelocity.toFixed(1)} days</span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          {showCount ? (
            <>
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {deposit.numberOfDeposits} deposits
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Total: {formatCurrency(deposit.totalDeposits)}
              </div>
            </>
          ) : (
            <>
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {formatCurrency(deposit.totalDeposits)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {deposit.numberOfDeposits} deposits
                {deposit.lastDepositTime && ` • ${formatDate(deposit.lastDepositTime)}`}
              </div>
            </>
          )}
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Equity: {formatCurrency(deposit.currentEquity)}
          </div>
        </div>
      </div>
    </div>
  );
}

