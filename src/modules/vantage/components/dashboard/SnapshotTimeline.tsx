import { useMemo } from "react";
import { Calendar, Clock, TrendingUp, TrendingDown, Users, RotateCcw, GitCompare } from "lucide-react";
import type { VantageSnapshot } from "../../types";
import { extractAllRetailClients } from "../../utils/snapshotHelpers";

interface SnapshotTimelineProps {
  snapshots: VantageSnapshot[];
  currentSnapshot: VantageSnapshot | null;
  previousSnapshot: VantageSnapshot | null;
  onSnapshotSelect?: (snapshotId: string) => void;
  onResetToLatest?: () => void;
}

export default function SnapshotTimeline({
  snapshots,
  currentSnapshot,
  previousSnapshot,
  onSnapshotSelect,
  onResetToLatest,
}: SnapshotTimelineProps) {
  // Group snapshots by date
  const groupedSnapshots = useMemo(() => {
    const groups = new Map<string, VantageSnapshot[]>();
    
    snapshots.forEach((snapshot) => {
      const date = new Date(snapshot.timestamp);
      const dateKey = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)!.push(snapshot);
    });

    // Sort by date (newest first)
    return Array.from(groups.entries()).sort((a, b) => {
      const dateA = new Date(a[1][0].timestamp);
      const dateB = new Date(b[1][0].timestamp);
      return dateB.getTime() - dateA.getTime();
    });
  }, [snapshots]);

  // Calculate metrics for a snapshot
  const getSnapshotMetrics = (snapshot: VantageSnapshot) => {
    const allClients = extractAllRetailClients(snapshot);
    
    const totalEquity = allClients.reduce((sum, c) => sum + (c.equity || 0), 0);
    const totalBalance = allClients.reduce((sum, c) => sum + (c.accountBalance || 0), 0);
    const totalCommission = snapshot.accounts.reduce((sum, acc) => sum + acc.commission, 0);
    const activeClients = allClients.filter((c) => (c.equity || 0) > 0).length;
    
    return {
      totalEquity,
      totalBalance,
      totalCommission,
      activeClients,
      totalClients: allClients.length,
    };
  };

  // Calculate change between two snapshots
  const calculateChange = (prev: VantageSnapshot, curr: VantageSnapshot) => {
    const prevMetrics = getSnapshotMetrics(prev);
    const currMetrics = getSnapshotMetrics(curr);
    
    return {
      equityChange: currMetrics.totalEquity - prevMetrics.totalEquity,
      equityChangePercent:
        prevMetrics.totalEquity > 0
          ? ((currMetrics.totalEquity - prevMetrics.totalEquity) / prevMetrics.totalEquity) * 100
          : 0,
      clientsChange: currMetrics.totalClients - prevMetrics.totalClients,
      commissionChange: currMetrics.totalCommission - prevMetrics.totalCommission,
    };
  };

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  if (snapshots.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Snapshot Timeline
          </h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No snapshots available yet. Capture your first snapshot to see the timeline.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Snapshot Timeline
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({snapshots.length} total)
          </span>
        </div>
        {previousSnapshot && previousSnapshot.id !== snapshots[1]?.id && onResetToLatest && (
          <button
            onClick={onResetToLatest}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Reset to latest comparison"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Latest
          </button>
        )}
      </div>

      <div className="space-y-6">
        {groupedSnapshots.map(([dateKey, daySnapshots]) => {
          // Sort snapshots within the day (newest first)
          const sortedSnapshots = [...daySnapshots].sort(
            (a, b) => b.timestamp - a.timestamp
          );

          return (
            <div key={dateKey} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
              {/* Date Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-blue-500 -ml-[18px] border-2 border-white dark:border-gray-900" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {dateKey}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({sortedSnapshots.length} snapshot{sortedSnapshots.length > 1 ? "s" : ""})
                </span>
              </div>

              {/* Snapshots for this day */}
              <div className="space-y-4 ml-4">
                {sortedSnapshots.map((snapshot, idx) => {
                  const metrics = getSnapshotMetrics(snapshot);
                  const isCurrent = currentSnapshot?.id === snapshot.id;
                  const prevSnapshot = idx < sortedSnapshots.length - 1 
                    ? sortedSnapshots[idx + 1] 
                    : null;
                  const change = prevSnapshot ? calculateChange(prevSnapshot, snapshot) : null;

                  const isSelected = previousSnapshot?.id === snapshot.id;
                  const canSelect = !isCurrent && onSnapshotSelect;

                  return (
                    <div
                      key={snapshot.id}
                      className={`rounded-lg border p-4 transition-all ${
                        isCurrent
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : isSelected
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50"
                      } ${
                        canSelect
                          ? "cursor-pointer hover:border-blue-400 hover:shadow-md"
                          : ""
                      }`}
                      onClick={() => canSelect && onSnapshotSelect?.(snapshot.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {formatTime(snapshot.timestamp)}
                          </span>
                          {isCurrent && (
                            <span className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded">
                              Current
                            </span>
                          )}
                          {isSelected && (
                            <span className="text-xs px-2 py-0.5 bg-purple-500 text-white rounded flex items-center gap-1">
                              <GitCompare className="h-3 w-3" />
                              Comparing
                            </span>
                          )}
                          {canSelect && !isCurrent && !isSelected && (
                            <span className="text-xs px-2 py-0.5 bg-gray-400 dark:bg-gray-600 text-white rounded">
                              Click to compare
                            </span>
                          )}
                        </div>
                        {change && (
                          <div className="flex items-center gap-4 text-xs">
                            {change.equityChange !== 0 && (
                              <div
                                className={`flex items-center gap-1 ${
                                  change.equityChange > 0
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                {change.equityChange > 0 ? (
                                  <TrendingUp className="h-3 w-3" />
                                ) : (
                                  <TrendingDown className="h-3 w-3" />
                                )}
                                <span>
                                  {change.equityChange > 0 ? "+" : ""}
                                  {formatCurrency(change.equityChange)} (
                                  {change.equityChangePercent > 0 ? "+" : ""}
                                  {change.equityChangePercent.toFixed(1)}%)
                                </span>
                              </div>
                            )}
                            {change.clientsChange !== 0 && (
                              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                <Users className="h-3 w-3" />
                                <span>
                                  {change.clientsChange > 0 ? "+" : ""}
                                  {change.clientsChange} clients
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Metrics Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <MetricCard
                          label="Total Equity"
                          value={formatCurrency(metrics.totalEquity)}
                          icon={<TrendingUp className="h-4 w-4" />}
                        />
                        <MetricCard
                          label="Total Balance"
                          value={formatCurrency(metrics.totalBalance)}
                          icon={<TrendingUp className="h-4 w-4" />}
                        />
                        <MetricCard
                          label="Commission"
                          value={formatCurrency(metrics.totalCommission)}
                          icon={<TrendingUp className="h-4 w-4" />}
                        />
                        <MetricCard
                          label="Active Clients"
                          value={`${metrics.activeClients} / ${metrics.totalClients}`}
                          icon={<Users className="h-4 w-4" />}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function MetricCard({ label, value, icon }: MetricCardProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
      <div className="text-gray-500 dark:text-gray-400">{icon}</div>
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
        <div className="text-sm font-semibold text-gray-900 dark:text-white">{value}</div>
      </div>
    </div>
  );
}

