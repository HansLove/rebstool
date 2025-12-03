import { useMemo } from "react";
import { TrendingUp, DollarSign, BarChart3 } from "lucide-react";
import type { VantageSnapshot } from "../../types";
import { calculateVolumeLeaderboard } from "../../utils/volumeLeaderboard";
import { analyzeDeposits } from "../../utils/depositIntelligence";

interface CommunityMetricsProps {
  currentSnapshot: VantageSnapshot | null;
  snapshots24h: VantageSnapshot[];
  snapshots7d: VantageSnapshot[];
  snapshots30d: VantageSnapshot[];
  onUserClick?: (userId: number) => void;
}

export default function CommunityMetrics({
  currentSnapshot,
  snapshots24h,
  snapshots7d,
  snapshots30d,
  onUserClick,
}: CommunityMetricsProps) {
  // Calculate total community volume
  const volumeData = useMemo(() => {
    if (!currentSnapshot) return null;
    return calculateVolumeLeaderboard(
      currentSnapshot,
      snapshots24h,
      snapshots7d,
      snapshots30d
    );
  }, [currentSnapshot, snapshots24h, snapshots7d, snapshots30d]);

  // Calculate top 5 deposits
  const depositData = useMemo(() => {
    if (!currentSnapshot) return null;
    return analyzeDeposits(currentSnapshot, snapshots30d);
  }, [currentSnapshot, snapshots30d]);

  // Calculate total community volume (30d period - most comprehensive)
  const totalCommunityVolume = useMemo(() => {
    if (!volumeData) return 0;
    // Use 30d volume as it's the most comprehensive period
    return volumeData.leaderboard30d.reduce((sum, v) => sum + v.volume30d, 0);
  }, [volumeData]);

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatLots = (lots: number) => {
    if (lots >= 1000000) {
      return `${(lots / 1000000).toFixed(2)}M`;
    }
    if (lots >= 1000) {
      return `${(lots / 1000).toFixed(2)}K`;
    }
    return lots.toFixed(2);
  };

  if (!currentSnapshot || !volumeData || !depositData) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <p className="text-gray-500 dark:text-gray-400 text-center">No data available</p>
      </div>
    );
  }

  const top5Deposits = depositData.topDepositors.slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Community Metrics
        </h2>
      </div>

      {/* Total Community Volume */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Total Community Volume (30d)
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Combined trading volume across all users
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {formatLots(totalCommunityVolume)} lots
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Target to achieve
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 Deposits */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top 5 Deposits (Big Fish)
          </h3>
        </div>
        <div className="space-y-2">
          {top5Deposits.length > 0 ? (
            top5Deposits.map((deposit, index) => (
              <div
                key={deposit.userId}
                className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                onClick={() => onUserClick?.(deposit.userId)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-yellow-600 dark:text-yellow-400">
                      #{index + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {deposit.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Login: {deposit.tradingAccountLogin}
                        {deposit.depositVelocity && (
                          <span> • Every {deposit.depositVelocity.toFixed(1)} days</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(deposit.totalDeposits)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {deposit.numberOfDeposits} deposit{deposit.numberOfDeposits !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No deposit data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

