import { TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react";
import type { RebateWithStatus } from "../../utils/rebateStatus";

interface RebateRowProps {
  rebate: RebateWithStatus;
  ownerName?: string | null;
  onClick?: (rebate: RebateWithStatus) => void;
}

export default function RebateRow({ rebate, ownerName, onClick }: RebateRowProps) {
  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const statusConfig = {
    hot: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-300",
      border: "border-green-300 dark:border-green-700",
      pill: "bg-green-500",
      label: "Hot",
    },
    cooling: {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-300",
      border: "border-amber-300 dark:border-amber-700",
      pill: "bg-amber-500",
      label: "Cooling",
    },
    at_risk: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-300",
      border: "border-red-300 dark:border-red-700",
      pill: "bg-red-500",
      label: "At Risk",
    },
  };

  const config = statusConfig[rebate.status];

  const TrendIcon =
    rebate.trend === "up"
      ? TrendingUp
      : rebate.trend === "down"
      ? TrendingDown
      : Minus;

  const trendColor =
    rebate.trend === "up"
      ? "text-green-600 dark:text-green-400"
      : rebate.trend === "down"
      ? "text-red-600 dark:text-red-400"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div
      onClick={() => onClick?.(rebate)}
      className={`
        group relative p-3 rounded-lg border transition-all duration-200 cursor-pointer
        ${config.bg} ${config.border}
        hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
        ${onClick ? "hover:ring-2 hover:ring-blue-400" : ""}
      `}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${config.text} ${config.pill} text-white ${
                rebate.status === "hot" ? "animate-pulse" : ""
              } ${
                rebate.status === "at_risk" ? "animate-pulse" : ""
              }`}
            >
              {config.label}
            </span>
            {rebate.status === "at_risk" && (
              <AlertCircle className={`h-3.5 w-3.5 ${config.text} shrink-0 animate-pulse`} />
            )}
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            User ID: {rebate.userId}
            {ownerName && (
              <span className="ml-2 text-xs font-normal text-blue-600 dark:text-blue-400">
                ({ownerName})
              </span>
            )}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
            Login: {rebate.login} | {rebate.currency}
          </p>
        </div>

        {/* Right: Metrics */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Commission */}
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              <TrendIcon className={`h-3.5 w-3.5 ${trendColor}`} />
              <p className="text-xs text-gray-600 dark:text-gray-400">Commission</p>
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {formatCurrency(rebate.commission)}
            </p>
            {rebate.commissionChangePercent !== 0 && (
              <p
                className={`text-xs font-medium ${
                  rebate.commissionChangePercent > 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {rebate.commissionChangePercent > 0 ? "+" : ""}
                {rebate.commissionChangePercent.toFixed(1)}%
              </p>
            )}
          </div>

          {/* Equity */}
          <div className="text-right">
            <p className="text-xs text-gray-600 dark:text-gray-400">Equity</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {formatCurrency(rebate.equity)}
            </p>
            {rebate.equityChangePercent !== 0 && (
              <p
                className={`text-xs font-medium ${
                  rebate.equityChangePercent > 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {rebate.equityChangePercent > 0 ? "+" : ""}
                {rebate.equityChangePercent.toFixed(1)}%
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

