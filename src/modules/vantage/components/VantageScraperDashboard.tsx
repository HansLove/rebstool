import { useState } from "react";
import { useVantageScraper } from "../hooks/useVantageScraper";
import useAuth from "@/core/hooks/useAuth";
import {
  RefreshCw,
  AlertCircle,
  Users,
  TrendingUp,
  TrendingDown,
  Trash2,
  // Eye,
  // EyeOff,
} from "lucide-react";
import type { VantageCredentials, RetailClient } from "../types";
import { format } from "date-fns";
import FinancialMetrics from "./FinancialMetrics";
import SnapshotComparison from "./SnapshotComparison";
import RecentActivity from "./RecentActivity";
import RebateUserSearch from "./RebateUserSearch";
import SnapshotTimeline from "./SnapshotTimeline";
import AlertActions from "./AlertActions";

export default function VantageScraperDashboard() {
  const { getUser } = useAuth();
  const user = getUser();
  const isAdmin = user?.rol === 1; // Admin role check

  const {
    currentSnapshot,
    previousSnapshot,
    comparisonResult,
    snapshots,
    isLoading,
    error,
    runScraper,
    clearSnapshots,
    lastExecutionTime,
  } = useVantageScraper();

  const [credentials, setCredentials] = useState<VantageCredentials>({
    username: "",
    password: "",
  });
  const [showCredentials, ] = useState(false);

  // Check if user is admin
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
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-6">
      {/* Actions Panel - Fixed at top */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm mb-6 -mx-4 lg:-mx-6 px-4 lg:px-6 py-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Snapshot Management
            </h2>
            {lastExecutionTime && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last capture: {formatDate(lastExecutionTime)}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            {/* <button
              onClick={() => setShowCredentials(!showCredentials)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {showCredentials ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showCredentials ? "Hide" : "Show"} Credentials
            </button> */}

            <button
              onClick={handleRunScraper}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              {isLoading ? "Capturing..." : "Capture Snapshot"}
            </button>

            {snapshots.length > 0 && (
              <button
                onClick={() => {
                  if (
                    confirm(
                      "Are you sure you want to clear all snapshots? This action cannot be undone."
                    )
                  ) {
                    clearSnapshots();
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear Snapshots
              </button>
            )}
          </div>
        </div>

        {/* Credentials Form */}
        {showCredentials && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Optional: Provide credentials to override environment variables
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={credentials.username || ""}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="Leave empty to use env vars"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={credentials.password || ""}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="Leave empty to use env vars"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6 pt-2">
      {/* Snapshot Timeline */}
      <SnapshotTimeline
        currentSnapshot={currentSnapshot}
        previousSnapshot={previousSnapshot}
      />
 {/* Financial Metrics */}
 {currentSnapshot && <FinancialMetrics snapshot={currentSnapshot} />}
      {/* Search Bar */}
      <RebateUserSearch currentSnapshot={currentSnapshot} />

 {/* Alert Actions - Focused on Communication and Immediate Action */}
 {comparisonResult && (
        <AlertActions comparisonResult={comparisonResult} />
      )}


      {/* Snapshot Comparison */}
      {previousSnapshot && currentSnapshot && (
        <SnapshotComparison previous={previousSnapshot} current={currentSnapshot} />
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="font-semibold text-red-900 dark:text-red-100">
                Error
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                {error.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Results */}
      {comparisonResult && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Changes Detected
          </h2>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6  ">
            {comparisonResult.summary.totalNew > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      New Users
                    </p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {comparisonResult.summary.totalNew}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {comparisonResult.summary.totalRemoved > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Removed Users
                    </p>
                    <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                      {comparisonResult.summary.totalRemoved}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {comparisonResult.summary.totalChanged > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Changed Users
                    </p>
                    <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                      {comparisonResult.summary.totalChanged}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* New Users */}
          {comparisonResult.newUsers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-3">
                New Users ({comparisonResult.newUsers.length})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {comparisonResult.newUsers.map((user) => (
                  <UserCard key={user.userId} user={user} type="new" />
                ))}
              </div>
            </div>
          )}

          {/* Removed Users */}
          {comparisonResult.removedUsers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-3">
                Removed Users ({comparisonResult.removedUsers.length})
              </h3>
              <div className="space-y-2">
                {comparisonResult.removedUsers.map((user) => (
                  <UserCard key={user.userId} user={user} type="removed" />
                ))}
              </div>
            </div>
          )}

        </div>
      )}

     

      {/* Recent Activity - Top Deposits and Top Equity */}
      {currentSnapshot && <RecentActivity snapshot={currentSnapshot} />}

      {/* Current Snapshot Info */}
      {currentSnapshot && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Latest Snapshot
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Timestamp:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {formatDate(currentSnapshot.timestamp)}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Snapshot ID:</span>
              <span className="ml-2 font-mono text-xs text-gray-900 dark:text-white">
                {currentSnapshot.id}
              </span>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}

// User Card Component
function UserCard({
  user,
  type,
}: {
  user: RetailClient;
  type: "new" | "removed";
}) {
  const bgColor =
    type === "new"
      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
      : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";

  return (
    <div
      className={`${bgColor} border rounded-lg p-4 text-sm`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <span className="text-gray-600 dark:text-gray-400">Name:</span>
          <span className="ml-2 font-medium text-gray-900 dark:text-white">
            {user.name}
          </span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">User ID:</span>
          <span className="ml-2 font-mono text-gray-900 dark:text-white">
            {user.userId}
          </span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Equity:</span>
          <span className="ml-2 font-medium text-gray-900 dark:text-white">
            ${user.equity.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

