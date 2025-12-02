import { useState } from "react";
import type { RebatesRankings } from "../../types/rebatesOverview";

interface RebatesQuickRankingsProps {
  rankings: RebatesRankings;
  isLoading?: boolean;
  onTraderClick?: (userId: number) => void;
}

type RankingTab = "topVolume7d" | "topVolume30d" | "topDeposits" | "topWithdrawalPct";

export default function RebatesQuickRankings({
  rankings,
  isLoading,
  onTraderClick,
}: RebatesQuickRankingsProps) {
  const [activeTab, setActiveTab] = useState<RankingTab>("topVolume7d");

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    const configs: Record<string, { bg: string; text: string; label: string }> = {
      ok: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-300",
        label: "OK",
      },
      high_withdrawal_risk: {
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-700 dark:text-amber-300",
        label: "High",
      },
      critical_withdrawal: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-300",
        label: "Critical",
      },
      emptied_account: {
        bg: "bg-red-200 dark:bg-red-900/50",
        text: "text-red-800 dark:text-red-200",
        label: "Emptied",
      },
    };

    const config = configs[status];
    if (!config) return null;

    return (
      <span
        className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const tabs: Array<{ id: RankingTab; label: string }> = [
    { id: "topVolume7d", label: "Top Volume 7d" },
    { id: "topVolume30d", label: "Top Volume 30d" },
    { id: "topDeposits", label: "Top Deposits" },
    { id: "topWithdrawalPct", label: "Top Withdrawals %" },
  ];

  const currentRankings = rankings[activeTab] || [];

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Quick Rankings
      </h3>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Rankings List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {currentRankings.length > 0 ? (
          currentRankings.map((item, index) => (
            <div
              key={item.userId}
              onClick={() => onTraderClick?.(item.userId)}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-6 shrink-0">
                  #{index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    {item.tradingAccountLogin}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  {activeTab === "topWithdrawalPct" ? (
                    <>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatPercent(item.value)}
                      </p>
                      {item.withdrawalAmount30d !== undefined && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatCurrency(item.withdrawalAmount30d)}
                        </p>
                      )}
                    </>
                  ) : activeTab === "topDeposits" ? (
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(item.value)}
                    </p>
                  ) : (
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.value.toFixed(2)} lots
                    </p>
                  )}
                </div>
                {item.statusFlag && getStatusBadge(item.statusFlag)}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-sm">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
}

