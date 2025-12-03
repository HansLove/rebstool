import { useMemo } from "react";
import { BarChart3 } from "lucide-react";
import type { VantageSnapshot } from "../../types";
import { analyzeLots } from "../../utils/lotsAnalyzer";

interface LotsAnalyzerProps {
  currentSnapshot: VantageSnapshot | null;
  snapshots24h: VantageSnapshot[];
  snapshots7d: VantageSnapshot[];
  snapshots30d: VantageSnapshot[];
  allSnapshots: VantageSnapshot[];
  onUserClick?: (userId: number) => void;
}

export default function LotsAnalyzer({
  currentSnapshot,
  snapshots24h,
  snapshots7d,
  snapshots30d,
  allSnapshots,
  onUserClick,
}: LotsAnalyzerProps) {
  const analysis = useMemo(() => {
    if (!currentSnapshot) return null;
    return analyzeLots(
      currentSnapshot,
      snapshots24h,
      snapshots7d,
      snapshots30d,
      allSnapshots
    );
  }, [currentSnapshot, snapshots24h, snapshots7d, snapshots30d, allSnapshots]);

  if (!analysis) {
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
        <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Lots Analyzer
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Lots 24h */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Top Lots Traded (24h)
          </h3>
          <div className="space-y-2">
            {analysis.topLots24h.length > 0 ? (
              analysis.topLots24h.map((trader, index) => (
                <LotsRow
                  key={trader.userId}
                  trader={trader}
                  rank={index + 1}
                  lots={trader.lots24h}
                  formatLots={formatLots}
                  onUserClick={onUserClick}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No lots data for 24h
              </p>
            )}
          </div>
        </div>

        {/* Top Lots 7d */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Top Lots Traded (7d)
          </h3>
          <div className="space-y-2">
            {analysis.topLots7d.length > 0 ? (
              analysis.topLots7d.map((trader, index) => (
                <LotsRow
                  key={trader.userId}
                  trader={trader}
                  rank={index + 1}
                  lots={trader.lots7d}
                  formatLots={formatLots}
                  onUserClick={onUserClick}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No lots data for 7d
              </p>
            )}
          </div>
        </div>

        {/* Top Lots 30d */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Top Lots Traded (30d)
          </h3>
          <div className="space-y-2">
            {analysis.topLots30d.length > 0 ? (
              analysis.topLots30d.map((trader, index) => (
                <LotsRow
                  key={trader.userId}
                  trader={trader}
                  rank={index + 1}
                  lots={trader.lots30d}
                  formatLots={formatLots}
                  onUserClick={onUserClick}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No lots data for 30d
              </p>
            )}
          </div>
        </div>

        {/* Top Lots Lifetime */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Top Lots Traded (Lifetime)
          </h3>
          <div className="space-y-2">
            {analysis.topLotsLifetime.length > 0 ? (
              analysis.topLotsLifetime.map((trader, index) => (
                <LotsRow
                  key={trader.userId}
                  trader={trader}
                  rank={index + 1}
                  lots={trader.lotsLifetime}
                  formatLots={formatLots}
                  onUserClick={onUserClick}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No lifetime lots data
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface LotsRowProps {
  trader: {
    userId: number;
    name: string;
    tradingAccountLogin: number;
    lastTradeSymbol: string | null;
    commission: number;
  };
  rank: number;
  lots: number;
  formatLots: (lots: number) => string;
  onUserClick?: (userId: number) => void;
}

function LotsRow({ trader, rank, lots, formatLots, onUserClick }: LotsRowProps) {
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
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
            {formatLots(lots)} lots
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Comm: ${trader.commission.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}

