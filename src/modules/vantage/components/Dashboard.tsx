import { useState, useMemo } from "react";
import { useVantageScraper } from "../hooks/useVantageScraper";
import useAuth from "@/core/hooks/useAuth";
import { RefreshCw, AlertCircle, Users, TrendingDown, DollarSign, Clock } from "lucide-react";
import type { VantageCredentials, RetailClient, Account } from "../types";
import { format } from "date-fns";
import MetricCard from "./dashboard/MetricCard";
import UserRow from "./dashboard/UserRow";
import CentralSearch from "./dashboard/CentralSearch";
import JournalPanel from "./dashboard/JournalPanel";
import UserInfoCard from "./dashboard/UserInfoCard";
import { useUserTabs } from "../context/UserTabsContext";

export default function Dashboard() {
  const { getUser } = useAuth();
  const user = getUser();
  const isAdmin = user?.rol === 1;

  const {
    currentSnapshot,
    previousSnapshot,
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

  // User tabs from context
  const { addTab, getActiveTab } = useUserTabs();

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
        return loss > 500 && oldEquity > 100;
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
      .sort((a, b) => b.loss - a.loss);
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
        return withdrawal > 1000 && oldEquity > 1000;
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
      .sort((a, b) => b.withdrawal - a.withdrawal);
  }, [comparisonResult]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Calculate time difference between snapshots
  const timeDifference = useMemo(() => {
    if (!currentSnapshot || !previousSnapshot) return null;
    
    const diffMs = currentSnapshot.timestamp - previousSnapshot.timestamp;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      const remainingHours = diffHours % 24;
      if (remainingHours > 0) {
        return `${diffDays} day${diffDays > 1 ? "s" : ""} ${remainingHours} hour${remainingHours > 1 ? "s" : ""}`;
      }
      return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
    } else if (diffHours > 0) {
      const remainingMinutes = diffMinutes % 60;
      if (remainingMinutes > 0) {
        return `${diffHours} hour${diffHours > 1 ? "s" : ""} ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`;
      }
      return `${diffHours} hour${diffHours > 1 ? "s" : ""}`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;
    } else {
      return `${diffSeconds} second${diffSeconds > 1 ? "s" : ""}`;
    }
  }, [currentSnapshot, previousSnapshot]);

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

  // Find account for a user
  const findAccountForUser = (userId: number): Account | undefined => {
    if (!currentSnapshot) return undefined;
    return currentSnapshot.accounts.find((acc) => acc.userId === userId);
  };

  // Handle user click - open in tab
  const handleUserClick = (user: RetailClient) => {
    const account = findAccountForUser(user.userId);
    addTab(user, account);
  };

  // Get active tab
  const activeTab = getActiveTab();

  return (
    <div className="w-full max-w-[1800px] mx-auto px-2 lg:px-3">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm mb-3 -mx-2 lg:-mx-3 px-2 lg:px-3 py-2">
        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              {lastExecutionTime && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Last capture: {formatDate(lastExecutionTime)}
                </p>
              )}
              {timeDifference && (
                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    Time between snapshots: <span className="font-semibold text-gray-900 dark:text-white">{timeDifference}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleRunScraper}
            disabled={isLoading}
            className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors text-sm font-medium"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Capturing..." : "Capture Snapshot"}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-sm font-semibold text-red-900 dark:text-red-100">Error</p>
              <p className="text-xs text-red-700 dark:text-red-300">{error.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout: 3 Value Cards + Central Search + Journal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left Column: Value Pattern Cards */}
        <div className={`space-y-3 ${activeTab ? "lg:col-span-7" : "lg:col-span-8"}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                      user={user}
                      metric={`Equity: ${formatCurrency(user.equity)}`}
                      onClick={handleUserClick}
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
                      user={user}
                      metric={`Loss: ${formatCurrency(user.loss)}`}
                      subMetric={`${formatCurrency(user.oldEquity)} → ${formatCurrency(user.newEquity)}`}
                      onClick={handleUserClick}
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
                      user={user}
                      metric={`Withdrawn: ${formatCurrency(user.withdrawal)}`}
                      subMetric={`${formatCurrency(user.oldEquity)} → ${formatCurrency(user.newEquity)}`}
                      onClick={handleUserClick}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No critical withdrawals detected
                </p>
              )}
            </MetricCard>
          </div>

          {/* Central Search - Full Width Below Cards */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <CentralSearch currentSnapshot={currentSnapshot} onUserClick={handleUserClick} />
          </div>
        </div>

        {/* Right Column: Journal Panel or User Info */}
        <div className={`${activeTab ? "lg:col-span-5" : "lg:col-span-4"}`}>
          {activeTab ? (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
              <UserInfoCard
                user={activeTab.user}
                account={activeTab.account}
                onClose={() => {}}
              />
            </div>
          ) : (
            <JournalPanel />
          )}
        </div>
      </div>

      {/* No Data State */}
      {!currentSnapshot && !isLoading && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center mt-3">
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

