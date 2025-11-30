import { AlertTriangle, TrendingDown, UserX } from "lucide-react";
import type { RetailClient } from "../../types";

interface TopAtRiskUsersProps {
  usersWhoLostMoney: Array<RetailClient & { loss: number; oldEquity: number; newEquity: number }>;
  criticalWithdrawals: Array<RetailClient & { withdrawal: number; oldEquity: number; newEquity: number }>;
  disappearedUsers: RetailClient[];
  onUserClick?: (user: RetailClient) => void;
}

export default function TopAtRiskUsers({
  usersWhoLostMoney,
  criticalWithdrawals,
  disappearedUsers,
  onUserClick,
}: TopAtRiskUsersProps) {
  // Combine all at-risk users and sort by priority
  const topAtRiskUsers = [
    // Disappeared users (highest priority)
    ...disappearedUsers.slice(0, 3).map((user) => ({
      user,
      priority: 3,
      type: "disappeared" as const,
      riskLevel: "critical" as const,
    })),
    // Critical withdrawals
    ...criticalWithdrawals.slice(0, 3).map((user) => ({
      user,
      priority: 2,
      type: "withdrawal" as const,
      riskLevel: "high" as const,
      withdrawal: user.withdrawal,
    })),
    // Significant losses
    ...usersWhoLostMoney.slice(0, 3).map((user) => ({
      user,
      priority: 1,
      type: "loss" as const,
      riskLevel: "medium" as const,
      loss: user.loss,
    })),
  ]
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3);

  if (topAtRiskUsers.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No users at risk detected
          </p>
        </div>
      </div>
    );
  }

  const getRiskIcon = (type: string) => {
    switch (type) {
      case "disappeared":
        return <UserX className="h-5 w-5" />;
      case "withdrawal":
        return <TrendingDown className="h-5 w-5" />;
      case "loss":
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical":
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-800",
          text: "text-red-600 dark:text-red-400",
          badge: "bg-red-500",
        };
      case "high":
        return {
          bg: "bg-orange-50 dark:bg-orange-900/20",
          border: "border-orange-200 dark:border-orange-800",
          text: "text-orange-600 dark:text-orange-400",
          badge: "bg-orange-500",
        };
      case "medium":
        return {
          bg: "bg-amber-50 dark:bg-amber-900/20",
          border: "border-amber-200 dark:border-amber-800",
          text: "text-amber-600 dark:text-amber-400",
          badge: "bg-amber-500",
        };
      default:
        return {
          bg: "bg-gray-50 dark:bg-gray-900/20",
          border: "border-gray-200 dark:border-gray-800",
          text: "text-gray-600 dark:text-gray-400",
          badge: "bg-gray-500",
        };
    }
  };

  const getRiskLabel = (type: string) => {
    switch (type) {
      case "disappeared":
        return "Disappeared";
      case "withdrawal":
        return "Critical Withdrawal";
      case "loss":
        return "Significant Loss";
      default:
        return "At Risk";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Top 3 Users at Risk
        </h3>
      </div>

      <div className="space-y-3">
        {topAtRiskUsers.map((item, index) => {
          const colors = getRiskColor(item.riskLevel);
          return (
            <div
              key={`${item.user.userId}-${index}`}
              onClick={() => onUserClick?.(item.user)}
              className={`${colors.bg} ${colors.border} border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  {/* Priority Badge */}
                  <div
                    className={`${colors.badge} text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shrink-0`}
                  >
                    {index + 1}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getRiskIcon(item.type)}
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.text} ${colors.bg}`}
                      >
                        {getRiskLabel(item.type)}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {item.user.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1">
                      User ID: {item.user.userId}
                    </p>
                    {item.user.phone && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {item.user.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Risk Indicator */}
                <div className="text-right shrink-0">
                  {item.type === "disappeared" && (
                    <div className={`${colors.text} text-xs font-medium`}>
                      <p>Last Equity</p>
                      <p className="font-bold">${item.user.equity.toLocaleString()}</p>
                    </div>
                  )}
                  {item.type === "withdrawal" && "withdrawal" in item && (
                    <div className={`${colors.text} text-xs font-medium`}>
                      <p>Withdrawn</p>
                      <p className="font-bold">${item.withdrawal.toLocaleString()}</p>
                    </div>
                  )}
                  {item.type === "loss" && "loss" in item && (
                    <div className={`${colors.text} text-xs font-medium`}>
                      <p>Loss</p>
                      <p className="font-bold">${item.loss.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

