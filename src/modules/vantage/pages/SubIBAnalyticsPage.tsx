import { useState, useMemo } from "react";
import { useVantageScraper } from "../hooks/useVantageScraper";
import useAuth from "@/core/hooks/useAuth";
import { AlertCircle, BarChart3, Building2 } from "lucide-react";
import SubIBPerformanceCharts from "../components/subib/SubIBPerformanceCharts";
import SubIBComparisonTable from "../components/subib/SubIBComparisonTable";

export default function SubIBAnalyticsPage() {
  const { getUser } = useAuth();
  const user = getUser();
  const isAdmin = user?.rol === 1;

  const {
    currentSnapshot,
    snapshots,
    isLoading,
  } = useVantageScraper();

  const [selectedSubIB, setSelectedSubIB] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Get available Sub-IBs from current snapshot
  const availableSubIBs = useMemo(() => {
    if (!currentSnapshot?.subIBs) return [];
    return currentSnapshot.subIBs
      .map(subIB => subIB.ownerName)
      .filter((name): name is string => !!name)
      .sort();
  }, [currentSnapshot]);

  // Filter snapshots by time range
  const filteredSnapshots = useMemo(() => {
    if (!snapshots.length) return [];
    
    const now = Date.now();
    const daysAgo = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
    }[timeRange];
    
    const cutoffTime = now - (daysAgo * 24 * 60 * 60 * 1000);
    return snapshots.filter(s => s.timestamp >= cutoffTime);
  }, [snapshots, timeRange]);

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

  if (!currentSnapshot) {
    return (
      <div className="w-full max-w-[1800px] mx-auto px-2 lg:px-3 py-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <BarChart3 className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
          <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
            No Snapshots Available
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Capture a snapshot to start analyzing Sub-IB performance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1800px] mx-auto px-2 lg:px-3 py-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Sub-IB Performance Analytics
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Analyze performance and behavior of Sub-IBs over time
              </p>
            </div>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`rounded px-4 py-2 text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-IB Selector */}
        {availableSubIBs.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Building2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Sub-IB:</span>
            <button
              onClick={() => setSelectedSubIB(null)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedSubIB === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All Sub-IBs
            </button>
            {availableSubIBs.map(subIB => (
              <button
                key={subIB}
                onClick={() => setSelectedSubIB(subIB)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  selectedSubIB === subIB
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {subIB}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Performance Chart - Top Sub-IBs Comparison */}
      <div className="mb-6">
        <SubIBPerformanceCharts
          snapshots={filteredSnapshots}
          selectedSubIB={selectedSubIB}
          isLoading={isLoading}
        />
      </div>

      {/* Comparison Table */}
      <div className="mb-6">
        <SubIBComparisonTable
          currentSnapshot={currentSnapshot}
          snapshots={filteredSnapshots}
          selectedSubIB={selectedSubIB}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

