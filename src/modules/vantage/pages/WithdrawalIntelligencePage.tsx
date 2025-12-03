import { useMemo } from "react";
import { useVantageScraper } from "../hooks/useVantageScraper";
import WithdrawalIntelligence from "../components/dashboard/WithdrawalIntelligence";
import useAuth from "@/core/hooks/useAuth";
import { AlertCircle } from "lucide-react";
import { useUserTabsSafe } from "../hooks/useUserTabsSafe";

export default function WithdrawalIntelligencePage() {
  const { getUser } = useAuth();
  const user = getUser();
  const isAdmin = user?.rol === 1;
  const userTabsContext = useUserTabsSafe();
  const addTab = userTabsContext?.addTab || (() => {});

  const {
    currentSnapshot,
    previousSnapshot,
    snapshots,
  } = useVantageScraper();

  // Calculate snapshots7d and snapshots30d from snapshots array
  const snapshots7d = useMemo(() => {
    if (!currentSnapshot) return [];
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    return snapshots.filter((s) => s.timestamp >= sevenDaysAgo && s.id !== currentSnapshot.id);
  }, [snapshots, currentSnapshot]);

  const snapshots30d = useMemo(() => {
    if (!currentSnapshot) return [];
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    return snapshots.filter((s) => s.timestamp >= thirtyDaysAgo && s.id !== currentSnapshot.id);
  }, [snapshots, currentSnapshot]);

  const handleUserClick = (userId: number) => {
    if (!currentSnapshot) return;
    const allClients = currentSnapshot.retailResults.flatMap(
      (result) => result.retail?.data || []
    );
    const user = allClients.find((c) => c.userId === userId);
    if (user) {
      const account = currentSnapshot.accounts.find((acc) => acc.userId === userId);
      addTab(user, account);
    }
  };

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

  return (
    <div className="w-full max-w-[1800px] mx-auto px-2 lg:px-3 py-4">
      <WithdrawalIntelligence
        currentSnapshot={currentSnapshot}
        previousSnapshot={previousSnapshot}
        snapshots7d={snapshots7d}
        snapshots30d={snapshots30d}
        onUserClick={handleUserClick}
      />
    </div>
  );
}

