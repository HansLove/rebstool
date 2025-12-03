import { useMemo } from "react";
import { TrendingDown } from "lucide-react";
import type { VantageSnapshot } from "../../types";
import {
  calculateWithdrawalIntelligence,
  getAlertColor,
  getAlertEmoji,
  type WithdrawalIntelligence as WithdrawalIntel,
} from "../../utils/withdrawalIntelligence";

interface WithdrawalIntelligenceProps {
  currentSnapshot: VantageSnapshot | null;
  previousSnapshot: VantageSnapshot | null;
  snapshots7d: VantageSnapshot[];
  snapshots30d: VantageSnapshot[];
  onUserClick?: (userId: number) => void;
}

export default function WithdrawalIntelligence({
  currentSnapshot,
  previousSnapshot,
  snapshots7d,
  snapshots30d,
  onUserClick,
}: WithdrawalIntelligenceProps) {
  const intelligence = useMemo(() => {
    if (!currentSnapshot) return null;
    return calculateWithdrawalIntelligence(
      currentSnapshot,
      snapshots7d || [],
      snapshots30d || [],
      previousSnapshot || null
    );
  }, [currentSnapshot, previousSnapshot, snapshots7d, snapshots30d]);

  if (!intelligence) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <p className="text-gray-500 dark:text-gray-400 text-center">No data available</p>
      </div>
    );
  }

  const { withdrawals, summary } = intelligence;

  // Filter withdrawals by alert level
  const emptiedAccounts = withdrawals.filter((w) => w.alertLevel === "emptied");
  const criticalWithdrawals = withdrawals.filter((w) => w.alertLevel === "critical");
  const warningWithdrawals = withdrawals.filter((w) => w.alertLevel === "warning");

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatPercent = (pct: number) => `${pct.toFixed(1)}%`;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Withdrawal Intelligence
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          title="Emptied Accounts"
          count={summary.totalEmptied}
          color="red"
          emoji="🔴"
        />
        <SummaryCard
          title="Critical (85%+)"
          count={summary.totalCritical}
          color="orange"
          emoji="🟠"
        />
        <SummaryCard
          title="Warning (70%+)"
          count={summary.totalWarning}
          color="yellow"
          emoji="🟡"
        />
        <SummaryCard
          title="Total Withdrawn (30d)"
          value={formatCurrency(summary.totalWithdrawals30d)}
          color="blue"
        />
      </div>

      {/* Emptied Accounts */}
      {emptiedAccounts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span>🔴</span> Emptied Accounts ({emptiedAccounts.length})
          </h3>
          <div className="space-y-2">
            {emptiedAccounts.slice(0, 10).map((w) => (
              <WithdrawalRow
                key={w.userId}
                withdrawal={w}
                formatCurrency={formatCurrency}
                formatPercent={formatPercent}
                onUserClick={onUserClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Critical Withdrawals */}
      {criticalWithdrawals.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span>🟠</span> Critical Withdrawals (85%+) ({criticalWithdrawals.length})
          </h3>
          <div className="space-y-2">
            {criticalWithdrawals.slice(0, 10).map((w) => (
              <WithdrawalRow
                key={w.userId}
                withdrawal={w}
                formatCurrency={formatCurrency}
                formatPercent={formatPercent}
                onUserClick={onUserClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Warning Withdrawals */}
      {warningWithdrawals.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span>🟡</span> Warning Withdrawals (70%+) ({warningWithdrawals.length})
          </h3>
          <div className="space-y-2">
            {warningWithdrawals.slice(0, 10).map((w) => (
              <WithdrawalRow
                key={w.userId}
                withdrawal={w}
                formatCurrency={formatCurrency}
                formatPercent={formatPercent}
                onUserClick={onUserClick}
              />
            ))}
          </div>
        </div>
      )}

      {emptiedAccounts.length === 0 &&
        criticalWithdrawals.length === 0 &&
        warningWithdrawals.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No significant withdrawals detected
          </div>
        )}
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  count?: number;
  value?: string;
  color: string;
  emoji?: string;
}

function SummaryCard({ title, count, value, color, emoji }: SummaryCardProps) {
  const colorClasses = {
    red: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400",
    orange: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400",
    yellow: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400",
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400",
  };
  
  const borderClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;
  const [bgClass, textClass] = borderClass.split(" text-");
  
  return (
    <div className={`${bgClass} border rounded-lg p-4`}>
      <div className="flex items-center gap-2 mb-1">
        {emoji && <span>{emoji}</span>}
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h4>
      </div>
      <p className={`text-2xl font-bold ${textClass}`}>
        {value || count || 0}
      </p>
    </div>
  );
}

interface WithdrawalRowProps {
  withdrawal: WithdrawalIntel;
  formatCurrency: (amount: number) => string;
  formatPercent: (pct: number) => string;
  onUserClick?: (userId: number) => void;
}

function WithdrawalRow({
  withdrawal,
  formatCurrency,
  formatPercent,
  onUserClick,
}: WithdrawalRowProps) {
  const alertEmoji = getAlertEmoji(withdrawal.alertLevel);
  const alertColor = getAlertColor(withdrawal.alertLevel);
  
  const colorClasses = {
    red: "border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/10",
    orange: "border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/10",
    yellow: "border-yellow-200 dark:border-yellow-800 hover:bg-yellow-50 dark:hover:bg-yellow-900/10",
    gray: "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/10",
  };
  
  const borderClass = colorClasses[alertColor as keyof typeof colorClasses] || colorClasses.gray;

  return (
    <div
      className={`border ${borderClass} rounded-lg p-3 cursor-pointer transition-colors`}
      onClick={() => onUserClick?.(withdrawal.userId)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span>{alertEmoji}</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {withdrawal.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Login: {withdrawal.tradingAccountLogin}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Withdrawn (30d):</span>{" "}
              <span className="font-semibold text-red-600 dark:text-red-400">
                {formatCurrency(withdrawal.withdrawalAmount30d)}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Percentage:</span>{" "}
              <span className="font-semibold text-red-600 dark:text-red-400">
                {formatPercent(withdrawal.withdrawalPct30d)}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Previous Equity:</span>{" "}
              <span className="font-semibold">{formatCurrency(withdrawal.previousEquity)}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Current Equity:</span>{" "}
              <span className="font-semibold">{formatCurrency(withdrawal.currentEquity)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

