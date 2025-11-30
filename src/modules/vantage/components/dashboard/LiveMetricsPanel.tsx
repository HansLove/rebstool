import { useMemo } from "react";
import { DollarSign, TrendingUp, TrendingDown, Users, Activity, Zap } from "lucide-react";
import type { VantageSnapshot, ComparisonResult } from "../../types";
import type { RebateWithStatus } from "../../utils/rebateStatus";

interface LiveMetricsPanelProps {
  currentSnapshot: VantageSnapshot | null;
  comparisonResult: ComparisonResult | null;
  rebates: RebateWithStatus[];
}

export default function LiveMetricsPanel({
  currentSnapshot,
  comparisonResult,
  rebates,
}: LiveMetricsPanelProps) {
  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const metrics = useMemo(() => {
    if (!currentSnapshot) {
      return {
        totalCommission: 0,
        totalEquity: 0,
        totalBalance: 0,
        totalProfit: 0,
        hotCount: 0,
        coolingCount: 0,
        atRiskCount: 0,
        commissionChange: 0,
        commissionChangePercent: 0,
        equityChange: 0,
        equityChangePercent: 0,
      };
    }

    const totalCommission = currentSnapshot.accounts.reduce(
      (sum, acc) => sum + acc.commission,
      0
    );
    const totalEquity = currentSnapshot.accounts.reduce((sum, acc) => sum + acc.equity, 0);
    const totalBalance = currentSnapshot.accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const totalProfit = currentSnapshot.accounts.reduce((sum, acc) => sum + acc.profit, 0);

    const hotCount = rebates.filter((r) => r.status === "hot").length;
    const coolingCount = rebates.filter((r) => r.status === "cooling").length;
    const atRiskCount = rebates.filter((r) => r.status === "at_risk").length;

    // Calculate changes from comparison
    let commissionChange = 0;
    let commissionChangePercent = 0;
    let equityChange = 0;
    let equityChangePercent = 0;

    if (comparisonResult && currentSnapshot) {
      // We need to calculate from previous snapshot
      // For now, use rebate changes as proxy
      const avgCommissionChange = rebates.reduce((sum, r) => sum + r.commissionChange, 0) / rebates.length || 0;
      const avgEquityChange = rebates.reduce((sum, r) => sum + r.equityChange, 0) / rebates.length || 0;
      
      commissionChange = avgCommissionChange * rebates.length;
      equityChange = avgEquityChange * rebates.length;
      
      const prevTotalCommission = totalCommission - commissionChange;
      const prevTotalEquity = totalEquity - equityChange;
      
      commissionChangePercent = prevTotalCommission > 0 
        ? (commissionChange / prevTotalCommission) * 100 
        : 0;
      equityChangePercent = prevTotalEquity > 0 
        ? (equityChange / prevTotalEquity) * 100 
        : 0;
    }

    return {
      totalCommission,
      totalEquity,
      totalBalance,
      totalProfit,
      hotCount,
      coolingCount,
      atRiskCount,
      commissionChange,
      commissionChangePercent,
      equityChange,
      equityChangePercent,
    };
  }, [currentSnapshot, comparisonResult, rebates]);

  const MetricCard = ({
    title,
    value,
    change,
    changePercent,
    icon,
    color,
  }: {
    title: string;
    value: string | number;
    change?: number;
    changePercent?: number;
    icon: React.ReactNode;
    color: "blue" | "green" | "purple" | "orange";
  }) => {
    const colorClasses = {
      blue: {
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-blue-200 dark:border-blue-800",
        text: "text-blue-600 dark:text-blue-400",
      },
      green: {
        bg: "bg-green-50 dark:bg-green-900/20",
        border: "border-green-200 dark:border-green-800",
        text: "text-green-600 dark:text-green-400",
      },
      purple: {
        bg: "bg-purple-50 dark:bg-purple-900/20",
        border: "border-purple-200 dark:border-purple-800",
        text: "text-purple-600 dark:text-purple-400",
      },
      orange: {
        bg: "bg-orange-50 dark:bg-orange-900/20",
        border: "border-orange-200 dark:border-orange-800",
        text: "text-orange-600 dark:text-orange-400",
      },
    };

    const colors = colorClasses[color];
    const hasChange = change !== undefined && changePercent !== undefined;

    return (
      <div
        className={`${colors.bg} ${colors.border} border rounded-lg p-3 transition-all hover:shadow-md`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className={`${colors.text}`}>{icon}</div>
          {hasChange && (
            <div
              className={`flex items-center gap-1 text-xs font-medium ${
                changePercent > 0
                  ? "text-green-600 dark:text-green-400"
                  : changePercent < 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {changePercent > 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : changePercent < 0 ? (
                <TrendingDown className="h-3 w-3" />
              ) : null}
              {changePercent !== 0 && (
                <span>
                  {changePercent > 0 ? "+" : ""}
                  {changePercent.toFixed(1)}%
                </span>
              )}
            </div>
          )}
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{title}</p>
        <p className={`text-lg font-bold ${colors.text}`}>{value}</p>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-yellow-500 animate-pulse" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Live Metrics</h3>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <MetricCard
          title="Total Commission"
          value={formatCurrency(metrics.totalCommission)}
          change={metrics.commissionChange}
          changePercent={metrics.commissionChangePercent}
          icon={<DollarSign className="h-5 w-5" />}
          color="green"
        />
        <MetricCard
          title="Total Equity"
          value={formatCurrency(metrics.totalEquity)}
          change={metrics.equityChange}
          changePercent={metrics.equityChangePercent}
          icon={<TrendingUp className="h-5 w-5" />}
          color="blue"
        />
        <MetricCard
          title="Hot Rebates"
          value={metrics.hotCount}
          icon={<Activity className="h-5 w-5" />}
          color="green"
        />
        <MetricCard
          title="At Risk"
          value={metrics.atRiskCount}
          icon={<Users className="h-5 w-5" />}
          color="orange"
        />
      </div>

      {/* Status Distribution */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
          Status Distribution
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-green-500 h-full transition-all duration-500"
              style={{
                width: `${rebates.length > 0 ? (metrics.hotCount / rebates.length) * 100 : 0}%`,
              }}
            />
          </div>
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-500"
              style={{
                width: `${
                  rebates.length > 0 ? (metrics.coolingCount / rebates.length) * 100 : 0
                }%`,
              }}
            />
          </div>
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-red-500 h-full transition-all duration-500"
              style={{
                width: `${
                  rebates.length > 0 ? (metrics.atRiskCount / rebates.length) * 100 : 0
                }%`,
              }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
          <span>Hot: {metrics.hotCount}</span>
          <span>Cooling: {metrics.coolingCount}</span>
          <span>At Risk: {metrics.atRiskCount}</span>
        </div>
      </div>
    </div>
  );
}

