import { useMemo } from "react";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import type { VantageSnapshot } from "../../types";

interface RebatesKPIsProps {
  currentSnapshot: VantageSnapshot | null;
  previousSnapshot: VantageSnapshot | null;
  snapshots24h: VantageSnapshot[];
  snapshots7d: VantageSnapshot[];
}

export default function RebatesKPIs({
  currentSnapshot,
  previousSnapshot,
  snapshots24h,
  snapshots7d,
}: RebatesKPIsProps) {
  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Calculate rebates for current snapshot
  const currentRebates = useMemo(() => {
    if (!currentSnapshot) return 0;
    return currentSnapshot.accounts.reduce((sum, acc) => sum + acc.commission, 0);
  }, [currentSnapshot]);

  // Calculate rebates for previous snapshot
  const previousRebates = useMemo(() => {
    if (!previousSnapshot) return 0;
    return previousSnapshot.accounts.reduce((sum, acc) => sum + acc.commission, 0);
  }, [previousSnapshot]);

  // Calculate rebates change percentage
  const rebatesChangePercent = useMemo(() => {
    if (!previousRebates || previousRebates === 0) return 0;
    return ((currentRebates - previousRebates) / previousRebates) * 100;
  }, [currentRebates, previousRebates]);

  // Calculate rebates in last 24h (change from oldest snapshot in range to current)
  const rebates24h = useMemo(() => {
    if (snapshots24h.length === 0 || !currentSnapshot) return 0;
    
    // Get the oldest snapshot in 24h range
    const oldestSnapshot = snapshots24h[snapshots24h.length - 1];
    const oldestRebates = oldestSnapshot.accounts.reduce((sum, acc) => sum + acc.commission, 0);
    
    // Current rebates minus oldest rebates = change in 24h
    return currentRebates - oldestRebates;
  }, [snapshots24h, currentRebates, currentSnapshot]);

  // Calculate rebates in last 7 days (change from oldest snapshot in range to current)
  const rebates7d = useMemo(() => {
    if (snapshots7d.length === 0 || !currentSnapshot) return 0;
    
    // Get the oldest snapshot in 7d range
    const oldestSnapshot = snapshots7d[snapshots7d.length - 1];
    const oldestRebates = oldestSnapshot.accounts.reduce((sum, acc) => sum + acc.commission, 0);
    
    // Current rebates minus oldest rebates = change in 7d
    return currentRebates - oldestRebates;
  }, [snapshots7d, currentRebates, currentSnapshot]);

  const KPICard = ({
    title,
    value,
    change,
    changePercent,
    icon,
    color,
    period,
  }: {
    title: string;
    value: string | number;
    change?: number;
    changePercent?: number;
    icon: React.ReactNode;
    color: "blue" | "green" | "purple" | "orange";
    period?: string;
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
      <div className={`${colors.bg} ${colors.border} border rounded-lg p-4 transition-all hover:shadow-md`}>
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
        {period && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide opacity-60">
            {period}
          </p>
        )}
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 opacity-70">{title}</p>
        <p className={`text-xl font-bold ${colors.text} opacity-80`}>{value}</p>
        {hasChange && change !== 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 opacity-60">
            {change > 0 ? "+" : ""}
            {typeof change === "number" && change.toString().includes(".")
              ? formatCurrency(change)
              : change}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 opacity-60">
      {/* KPI Cards Row - Secondary Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <KPICard
          title="Current Rebates"
          value={formatCurrency(currentRebates)}
          change={currentRebates - previousRebates}
          changePercent={rebatesChangePercent}
          icon={<DollarSign className="h-5 w-5" />}
          color="green"
        />
        <KPICard
          title="Rebates Change 24h"
          value={formatCurrency(Math.abs(rebates24h))}
          change={rebates24h}
          changePercent={snapshots24h.length > 0 && snapshots24h[snapshots24h.length - 1] 
            ? ((rebates24h / snapshots24h[snapshots24h.length - 1].accounts.reduce((sum, acc) => sum + acc.commission, 0)) * 100) || 0
            : 0}
          icon={<DollarSign className="h-5 w-5" />}
          color="blue"
          period="24h"
        />
        <KPICard
          title="Rebates Change 7d"
          value={formatCurrency(Math.abs(rebates7d))}
          change={rebates7d}
          changePercent={snapshots7d.length > 0 && snapshots7d[snapshots7d.length - 1]
            ? ((rebates7d / snapshots7d[snapshots7d.length - 1].accounts.reduce((sum, acc) => sum + acc.commission, 0)) * 100) || 0
            : 0}
          icon={<DollarSign className="h-5 w-5" />}
          color="purple"
          period="7d"
        />
      </div>
    </div>
  );
}

