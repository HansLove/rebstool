import { useMemo } from "react";
import { TrendingUp, Zap } from "lucide-react";
import type { VantageSnapshot } from "../../types";
import { calculateVolumeLeaderboard } from "../../utils/volumeLeaderboard";

interface VolumeLeaderboardProps {
  currentSnapshot: VantageSnapshot | null;
  snapshots24h: VantageSnapshot[];
  snapshots7d: VantageSnapshot[];
  snapshots30d: VantageSnapshot[];
  onUserClick?: (userId: number) => void;
}

export default function VolumeLeaderboard({
  currentSnapshot,
  snapshots24h,
  snapshots7d,
  snapshots30d,
  onUserClick,
}: VolumeLeaderboardProps) {
  const leaderboard = useMemo(() => {
    if (!currentSnapshot) return null;
    return calculateVolumeLeaderboard(
      currentSnapshot,
      snapshots24h,
      snapshots7d,
      snapshots30d
    );
  }, [currentSnapshot, snapshots24h, snapshots7d, snapshots30d]);

  if (!leaderboard) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <p className="text-gray-500 dark:text-gray-400 text-center">No data available</p>
      </div>
    );
  }

  const formatLots = (lots: number) => lots.toFixed(2);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Volume Leaderboard
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 10 Volume 24h */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Top 10 Volume (24h)
          </h3>
          <div className="space-y-2">
            {leaderboard.leaderboard24h.length > 0 ? (
              leaderboard.leaderboard24h.map((trader, index) => (
                <VolumeRow
                  key={trader.userId}
                  trader={trader}
                  rank={index + 1}
                  volume={trader.volume24h}
                  formatLots={formatLots}
                  onUserClick={onUserClick}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No volume data for 24h
              </p>
            )}
          </div>
        </div>

        {/* Top 10 Volume 7d */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Top 10 Volume (7d)
          </h3>
          <div className="space-y-2">
            {leaderboard.leaderboard7d.length > 0 ? (
              leaderboard.leaderboard7d.map((trader, index) => (
                <VolumeRow
                  key={trader.userId}
                  trader={trader}
                  rank={index + 1}
                  volume={trader.volume7d}
                  formatLots={formatLots}
                  onUserClick={onUserClick}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No volume data for 7d
              </p>
            )}
          </div>
        </div>

        {/* Top 10 Volume 30d */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Top 10 Volume (30d)
          </h3>
          <div className="space-y-2">
            {leaderboard.leaderboard30d.length > 0 ? (
              leaderboard.leaderboard30d.map((trader, index) => (
                <VolumeRow
                  key={trader.userId}
                  trader={trader}
                  rank={index + 1}
                  volume={trader.volume30d}
                  formatLots={formatLots}
                  onUserClick={onUserClick}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No volume data for 30d
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Volume Spikes */}
      {leaderboard.volumeSpikes.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            Volume Spikes (Rapid Movements)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {leaderboard.volumeSpikes.slice(0, 10).map((trader) => (
              <div
                key={trader.userId}
                className="border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 bg-yellow-50 dark:bg-yellow-900/10 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 cursor-pointer transition-colors"
                onClick={() => onUserClick?.(trader.userId)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {trader.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      Login: {trader.tradingAccountLogin}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                      {formatLots(trader.volume24h)} lots (24h)
                    </div>
                    {trader.lastTradeSymbol && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {trader.lastTradeSymbol}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface VolumeRowProps {
  trader: {
    userId: number;
    name: string;
    tradingAccountLogin: number;
    lastTradeSymbol: string | null;
    commission: number;
  };
  rank: number;
  volume: number;
  formatLots: (lots: number) => string;
  onUserClick?: (userId: number) => void;
}

function VolumeRow({
  trader,
  rank,
  volume,
  formatLots,
  onUserClick,
}: VolumeRowProps) {
  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-600 dark:text-yellow-400";
    if (rank === 2) return "text-gray-500 dark:text-gray-400";
    if (rank === 3) return "text-orange-600 dark:text-orange-400";
    return "text-gray-400 dark:text-gray-500";
  };

  return (
    <div
      className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
      onClick={() => onUserClick?.(trader.userId)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`font-bold text-lg ${getRankColor(rank)}`}>#{rank}</span>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">{trader.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Login: {trader.tradingAccountLogin}
              {trader.lastTradeSymbol && ` • ${trader.lastTradeSymbol}`}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {formatLots(volume)} lots
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Comm: ${trader.commission.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}

