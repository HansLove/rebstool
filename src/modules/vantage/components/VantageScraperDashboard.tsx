import { useState, useMemo } from "react";
import { useVantageScraper } from "../hooks/useVantageScraper";
import useAuth from "@/core/hooks/useAuth";
import {
  RefreshCw,
  AlertCircle,
  Users,
  TrendingDown,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import type { VantageCredentials } from "../types";
import { format } from "date-fns";
import RebateUserSearch from "./RebateUserSearch";

export default function VantageScraperDashboard() {
  const { getUser } = useAuth();
  const user = getUser();
  const isAdmin = user?.rol === 1;

  const {
    currentSnapshot,
    comparisonResult,
    isLoading,
    error,
    runScraper,
    lastExecutionTime,
  } = useVantageScraper();

  const [credentials] = useState<VantageCredentials>({
    username: "",
    password: "",
  });

  const [expandedSections, setExpandedSections] = useState<{
    disappeared: boolean;
    lostMoney: boolean;
    withdrawals: boolean;
  }>({
    disappeared: false,
    lostMoney: false,
    withdrawals: false,
  });

  // Calculate users who lost significant money (>$500 loss)
  const usersWhoLostMoney = useMemo(() => {
    if (!comparisonResult) return [];
    return comparisonResult.changedUsers
      .filter((changedUser) => {
        const equityChange = changedUser.changes.find((c) => c.field === "equity");
        if (!equityChange) return false;
        const oldEquity = equityChange.oldValue as number;
        const newEquity = equityChange.newValue as number;
        const loss = oldEquity - newEquity;
        return loss > 500 && oldEquity > 100; // Lost more than $500 and had at least $100
      })
      .map((changedUser) => {
        const equityChange = changedUser.changes.find((c) => c.field === "equity")!;
        const oldEquity = equityChange.oldValue as number;
        const newEquity = equityChange.newValue as number;
        return {
          ...changedUser.user,
          loss: oldEquity - newEquity,
          oldEquity,
          newEquity,
        };
      })
      .sort((a, b) => b.loss - a.loss); // Sort by biggest loss first
  }, [comparisonResult]);

  // Calculate critical withdrawals (>$1000 withdrawn)
  const criticalWithdrawals = useMemo(() => {
    if (!comparisonResult) return [];
    return comparisonResult.changedUsers
      .filter((changedUser) => {
        const equityChange = changedUser.changes.find((c) => c.field === "equity");
        if (!equityChange) return false;
        const oldEquity = equityChange.oldValue as number;
        const newEquity = equityChange.newValue as number;
        const withdrawal = oldEquity - newEquity;
        return withdrawal > 1000 && oldEquity > 1000; // Withdrew more than $1000 and had at least $1000
      })
      .map((changedUser) => {
        const equityChange = changedUser.changes.find((c) => c.field === "equity")!;
        const oldEquity = equityChange.oldValue as number;
        const newEquity = equityChange.newValue as number;
        return {
          ...changedUser.user,
          withdrawal: oldEquity - newEquity,
          oldEquity,
          newEquity,
        };
      })
      .sort((a, b) => b.withdrawal - a.withdrawal); // Sort by biggest withdrawal first
  }, [comparisonResult]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (!isAdmin) {
    return (
      <div className="w-full max-w-9xl mx-auto py-8 px-4 lg:px-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            <div>
              <h2 className="text-lg font-semibold text-red-900 dark:text-red-100">
                Access Denied
              </h2>
              <p className="text-red-700 dark:text-red-300">
                This feature is only available for administrators.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleRunScraper = async () => {
    const creds =
      credentials.username && credentials.password ? credentials : undefined;
    await runScraper(creds);
  };

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "N/A";
    return format(new Date(timestamp), "PPpp");
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-3 lg:px-4">
      {/* Header Actions */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm mb-4 -mx-3 lg:-mx-4 px-3 lg:px-4 py-3">
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Vantage Dashboard
            </h1>
            {lastExecutionTime && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Last capture: {formatDate(lastExecutionTime)}
              </p>
            )}
          </div>
          <button
            onClick={handleRunScraper}
            disabled={isLoading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors text-sm font-medium"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Capturing..." : "Capture Snapshot"}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="font-semibold text-red-900 dark:text-red-100">Error</p>
              <p className="text-sm text-red-700 dark:text-red-300">{error.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main 4 Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* 1. Disappeared Users */}
        <MetricCard
          title="Disappeared Users"
          count={comparisonResult?.removedUsers?.length || 0}
          icon={<Users className="h-5 w-5" />}
          color="red"
          isExpanded={expandedSections.disappeared}
          onToggle={() => toggleSection("disappeared")}
        >
          {comparisonResult && comparisonResult.removedUsers.length > 0 ? (
            <div className="space-y-2">
              {comparisonResult.removedUsers.map((user) => (
                <UserRow
                  key={user.userId}
                  name={user.name}
                  userId={user.userId}
                  metric={`Equity: ${formatCurrency(user.equity)}`}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No users disappeared
            </p>
          )}
        </MetricCard>

        {/* 2. Users Who Lost Money */}
        <MetricCard
          title="Significant Losses"
          count={usersWhoLostMoney.length}
          icon={<TrendingDown className="h-5 w-5" />}
          color="orange"
          isExpanded={expandedSections.lostMoney}
          onToggle={() => toggleSection("lostMoney")}
        >
          {usersWhoLostMoney.length > 0 ? (
            <div className="space-y-2">
              {usersWhoLostMoney.map((user) => (
                <UserRow
                  key={user.userId}
                  name={user.name}
                  userId={user.userId}
                  metric={`Loss: ${formatCurrency(user.loss)}`}
                  subMetric={`${formatCurrency(user.oldEquity)} → ${formatCurrency(user.newEquity)}`}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No significant losses detected
            </p>
          )}
        </MetricCard>

        {/* 3. Critical Withdrawals */}
        <MetricCard
          title="Critical Withdrawals"
          count={criticalWithdrawals.length}
          icon={<DollarSign className="h-5 w-5" />}
          color="purple"
          isExpanded={expandedSections.withdrawals}
          onToggle={() => toggleSection("withdrawals")}
        >
          {criticalWithdrawals.length > 0 ? (
            <div className="space-y-2">
              {criticalWithdrawals.map((user) => (
                <UserRow
                  key={user.userId}
                  name={user.name}
                  userId={user.userId}
                  metric={`Withdrawn: ${formatCurrency(user.withdrawal)}`}
                  subMetric={`${formatCurrency(user.oldEquity)} → ${formatCurrency(user.newEquity)}`}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No critical withdrawals detected
            </p>
          )}
        </MetricCard>

        {/* 4. Search Bar */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Search className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              User Search
            </h3>
          </div>
          <RebateUserSearch currentSnapshot={currentSnapshot} />
        </div>
      </div>

      {/* No Data State */}
      {!currentSnapshot && !isLoading && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <Users className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No Snapshots Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Capture your first snapshot to start tracking changes.
          </p>
        </div>
      )}
    </div>
  );
}

// Metric Card Component
interface MetricCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: "red" | "orange" | "purple" | "blue";
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function MetricCard({
  title,
  count,
  icon,
  color,
  isExpanded,
  onToggle,
  children,
}: MetricCardProps) {
  const colorClasses = {
    red: {
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-600 dark:text-red-400",
      number: "text-red-600 dark:text-red-400",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      border: "border-orange-200 dark:border-orange-800",
      text: "text-orange-600 dark:text-orange-400",
      number: "text-orange-600 dark:text-orange-400",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      border: "border-purple-200 dark:border-purple-800",
      text: "text-purple-600 dark:text-purple-400",
      number: "text-purple-600 dark:text-purple-400",
    },
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-600 dark:text-blue-400",
      number: "text-blue-600 dark:text-blue-400",
    },
  };

  const colors = colorClasses[color];

  return (
    <div
      className={`${colors.bg} ${colors.border} border rounded-xl overflow-hidden transition-all cursor-pointer hover:shadow-md`}
      onClick={onToggle}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className={colors.text}>{icon}</div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className={`text-3xl font-bold mt-1 ${colors.number}`}>{count}</p>
          </div>
        </div>
        <button
          className={`p-1 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors ${colors.text}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4 max-h-96 overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  );
}

// User Row Component
interface UserRowProps {
  name: string;
  userId: number;
  metric: string;
  subMetric?: string;
}

function UserRow({ name, userId, metric, subMetric }: UserRowProps) {
  return (
    <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
          ID: {userId}
        </p>
        {subMetric && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subMetric}</p>
        )}
      </div>
      <div className="text-right ml-2 shrink-0">
        <p className="text-sm font-bold text-gray-900 dark:text-white">{metric}</p>
      </div>
    </div>
  );
}
