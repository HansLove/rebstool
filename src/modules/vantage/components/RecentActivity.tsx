
import { useMemo } from "react";
import { Clock, TrendingUp, BarChart3 } from "lucide-react";
import type { VantageSnapshot } from "../types";
import { calculateMetrics } from "../utils/vantageAnalytics";
import { format } from "date-fns";

interface RecentActivityProps {
  snapshot: VantageSnapshot | null;
}

export default function RecentActivity({ snapshot }: RecentActivityProps) {
  const metrics = useMemo(() => {
    if (!snapshot) return null;
    return calculateMetrics(snapshot);
  }, [snapshot]);

  if (!metrics) return null;

  const formatCurrency = (amount: number) => `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // const handleContact = (phone: string) => {
  //   // Crear enlace para WhatsApp o teléfono
  //   const cleanPhone = phone.replace(/\D/g, "");
  //   const whatsappUrl = `https://wa.me/${cleanPhone}`;
  //   window.open(whatsappUrl, "_blank");
  // };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recent Deposits */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Deposits (30d)
          </h3>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {metrics.recentDeposits.length > 0 ? (
            metrics.recentDeposits.map((deposit, idx) => (
              <div
                key={`${deposit.userId}-${idx}`}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {deposit.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {format(new Date(deposit.date), "MMM dd, HH:mm")}
                  </p>
                </div>
                <div className="text-right ml-2">
                  <p className="text-sm font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(deposit.amount)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {deposit.currency}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No recent deposits
            </p>
          )}
        </div>
      </div>

      {/* Recent Trading Activity */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Trades (7d)
          </h3>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {metrics.recentTrades.length > 0 ? (
            metrics.recentTrades.map((trade, idx) => (
              <div
                key={`${trade.userId}-${idx}`}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {trade.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {trade.symbol && (
                      <span className="text-xs font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded">
                        {trade.symbol}
                      </span>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(trade.date), "MMM dd, HH:mm")}
                    </span>
                  </div>
                </div>
                <div className="text-right ml-2">
                  <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
                    {trade.volume.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">lots</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No recent trades
            </p>
          )}
        </div>
      </div>

      {/* Top Trading Volume */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Traders
          </h3>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {metrics.topTradingVolume.length > 0 ? (
            metrics.topTradingVolume.map((trader, idx) => (
              <div
                key={trader.userId}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {trader.name}
                    </p>
                    {trader.symbol && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {trader.symbol}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right ml-2 shrink-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {trader.volume.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">lots</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No trading data
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

