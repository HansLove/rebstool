import { useState } from "react";
import { useVantageScraper } from "../hooks/useVantageScraper";
import { useRebatesOverview } from "../hooks/useRebatesOverview";
import TradersTable from "../components/dashboard/TradersTable";
import RebatesQuickRankings from "../components/dashboard/RebatesQuickRankings";
import TraderDrawer from "../components/dashboard/TraderDrawer";
import useAuth from "@/core/hooks/useAuth";
import { AlertCircle } from "lucide-react";
import type { TraderKPI } from "../types/rebatesOverview";

export default function TradersOverviewPage() {
  const { getUser } = useAuth();
  const user = getUser();
  const isAdmin = user?.rol === 1;

  const {
    currentSnapshot,
    previousSnapshot,
    snapshots7d,
    snapshots30d,
    isLoading,
  } = useVantageScraper();

  const rebatesOverview = useRebatesOverview({
    currentSnapshot,
    previousSnapshot,
    snapshots7d: snapshots7d || [],
    snapshots30d: snapshots30d || [],
  });

  const [selectedTrader, setSelectedTrader] = useState<TraderKPI | null>(null);

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

  const handleTraderClick = (trader: TraderKPI) => {
    setSelectedTrader(trader);
  };

  const handleRankingTraderClick = (userId: number) => {
    if (!rebatesOverview) return;
    const trader = rebatesOverview.traders.find((t) => t.userId === userId);
    if (trader) {
      setSelectedTrader(trader);
    }
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto px-2 lg:px-3 py-4">
      {rebatesOverview && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Quick Rankings - Left Side */}
          <div className="lg:col-span-1">
            <RebatesQuickRankings
              rankings={rebatesOverview.rankings}
              isLoading={isLoading}
              onTraderClick={handleRankingTraderClick}
            />
          </div>

          {/* Traders Table - Right Side */}
          <div className="lg:col-span-2">
            <TradersTable
              traders={rebatesOverview.traders}
              onTraderClick={handleTraderClick}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}

      {/* Trader Drawer */}
      <TraderDrawer
        trader={selectedTrader}
        isOpen={!!selectedTrader}
        onClose={() => setSelectedTrader(null)}
      />
    </div>
  );
}

