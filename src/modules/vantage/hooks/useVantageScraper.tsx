/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  fetchVantageData,
  fetchSnapshots,
  fetchSnapshotById,
} from "../services/vantageScraperService";
import { compareSnapshots } from "../utils/vantageComparison";
import type {
  VantageSnapshot,
  ComparisonResult,
  VantageCredentials,
} from "../types";

interface UseVantageScraperReturn {
  // Data
  currentSnapshot: VantageSnapshot | null;
  previousSnapshot: VantageSnapshot | null;
  comparisonResult: ComparisonResult | null;
  snapshots: VantageSnapshot[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;

  // Actions
  runScraper: (credentials?: VantageCredentials) => Promise<void>;
  clearSnapshots: () => void;
  selectSnapshotForComparison: (snapshotId: string) => Promise<void>;
  resetToLatest: () => void;

  // Status
  lastExecutionTime: number | null;
  hasChanges: boolean;
}

const STORAGE_LAST_EXECUTION_KEY = "vantage_last_execution";
const SNAPSHOTS_QUERY_KEY = ["vantage-snapshots"];

export function useVantageScraper(): UseVantageScraperReturn {
  const queryClient = useQueryClient();
  const [currentSnapshot, setCurrentSnapshot] = useState<VantageSnapshot | null>(null);
  const [previousSnapshot, setPreviousSnapshot] = useState<VantageSnapshot | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Fetch snapshots list from API - get more snapshots for 24h/7d calculations (summary mode)
  const {
    data: snapshotsData,
    isLoading: isLoadingSnapshots,
    error: snapshotsError,
  } = useQuery({
    queryKey: SNAPSHOTS_QUERY_KEY,
    queryFn: () => fetchSnapshots(1, 50, true), // Fetch summary snapshots (optimized)
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
  });

  // Load latest and previous snapshots from API data
  // For comparison, we need full snapshots with clients, so fetch them separately
  useEffect(() => {
    if (snapshotsData?.snapshots && snapshotsData.snapshots.length > 0) {
      const latestSummary = snapshotsData.snapshots[0]; // First item is latest (sorted by timestamp desc)
      const previousSummary = snapshotsData.snapshots[1] || null; // Second item is previous

      // Fetch full snapshots with clients for comparison
      const loadFullSnapshots = async () => {
        try {
          // Fetch latest snapshot with clients (needed for comparison and display)
          const latestFull = await fetchSnapshotById(latestSummary.id, true, 10000); // Include clients, high limit
          setCurrentSnapshot(latestFull);

          if (previousSummary) {
            // Fetch previous snapshot with clients for comparison
            const previousFull = await fetchSnapshotById(previousSummary.id, true, 10000);
            setPreviousSnapshot(previousFull);
            const comparison = compareSnapshots(previousFull, latestFull);
            setComparisonResult(comparison);
          } else {
            setPreviousSnapshot(null);
            setComparisonResult(null);
          }
        } catch (err) {
          console.error("Error loading full snapshots:", err);
          // Fallback to summary snapshots if full fetch fails
          setCurrentSnapshot(latestSummary);
          if (previousSummary) {
            setPreviousSnapshot(previousSummary);
            // Can't compare without full client data, so set comparison to null
            setComparisonResult(null);
          }
        }
      };

      loadFullSnapshots();
    } else if (snapshotsError) {
      setError(snapshotsError as Error);
    }
  }, [snapshotsData, snapshotsError]);

  // Mutation for running the scraper
  const mutation = useMutation({
    mutationFn: (credentials?: VantageCredentials) => fetchVantageData(credentials),
    onSuccess: (newSnapshot) => {
      // Get the current snapshot before updating (becomes previous)
      const currentBeforeSave = currentSnapshot;

      // Update state: new snapshot becomes current, old current becomes previous
      setCurrentSnapshot(newSnapshot);
      setPreviousSnapshot(currentBeforeSave || null);

      // Compare with previous snapshot (the one that was current before saving)
      if (currentBeforeSave) {
        const comparison = compareSnapshots(currentBeforeSave, newSnapshot);
        setComparisonResult(comparison);

        // Show notifications for changes
        if (comparison.summary.totalNew > 0) {
          toast.success(
            `${comparison.summary.totalNew} new user(s) detected`,
            { duration: 5000 }
          );
        }
        if (comparison.summary.totalRemoved > 0) {
          toast.error(
            `${comparison.summary.totalRemoved} user(s) removed`,
            { duration: 6000 }
          );
        }
        if (comparison.summary.totalChanged > 0) {
          toast(
            `${comparison.summary.totalChanged} user(s) with changes`,
            { duration: 4000 }
          );
        }
      } else {
        // First snapshot, no comparison
        setComparisonResult(null);
        toast.success("First snapshot saved successfully. Run again to start comparing.", {
          duration: 4000,
        });
      }

      // Invalidate and refetch snapshots list to get updated data from API
      queryClient.invalidateQueries({ queryKey: SNAPSHOTS_QUERY_KEY });

      // Save execution time
      localStorage.setItem(STORAGE_LAST_EXECUTION_KEY, Date.now().toString());
      setError(null);
    },
    onError: (err: Error) => {
      setError(err);
      toast.error(err.message || "Failed to fetch Vantage data", {
        duration: 6000,
      });
    },
  });

  const runScraper = useCallback(
    async (credentials?: VantageCredentials) => {
      setError(null);
      await mutation.mutateAsync(credentials);
    },
    [mutation]
  );

  const clearSnapshots = useCallback(() => {
    // Note: This clears local state only. To delete from server, you'd need a DELETE endpoint.
    setCurrentSnapshot(null);
    setPreviousSnapshot(null);
    setComparisonResult(null);
    localStorage.removeItem(STORAGE_LAST_EXECUTION_KEY);
    queryClient.invalidateQueries({ queryKey: SNAPSHOTS_QUERY_KEY });
    toast.success("Snapshots cleared from view", { duration: 3000 });
  }, [queryClient]);

  // Select a snapshot for comparison with the latest
  const selectSnapshotForComparison = useCallback(async (snapshotId: string) => {
    if (!snapshotsData?.snapshots) return;
    
    const latestSummary = snapshotsData.snapshots[0];
    const selectedSummary = snapshotsData.snapshots.find((s) => s.id === snapshotId);
    
    if (!selectedSummary || !latestSummary) {
      toast.error("Snapshot not found", { duration: 3000 });
      return;
    }

    if (selectedSummary.id === latestSummary.id) {
      toast.error("Cannot compare snapshot with itself", { duration: 3000 });
      return;
    }

    try {
      setError(null);
      
      // Fetch full snapshots with clients
      const [latestFull, selectedFull] = await Promise.all([
        fetchSnapshotById(latestSummary.id, true, 10000),
        fetchSnapshotById(selectedSummary.id, true, 10000),
      ]);

      setCurrentSnapshot(latestFull);
      setPreviousSnapshot(selectedFull);
      
      // Compare: selected snapshot (older) vs latest (newer)
      const comparison = compareSnapshots(selectedFull, latestFull);
      setComparisonResult(comparison);
      
      toast.success(`Comparing with snapshot from ${new Date(selectedFull.timestamp).toLocaleString()}`, {
        duration: 4000,
      });
    } catch (err) {
      console.error("Error loading snapshots for comparison:", err);
      setError(err as Error);
      toast.error("Failed to load snapshot for comparison", { duration: 4000 });
    }
  }, [snapshotsData]);

  // Reset to latest comparison (automatic)
  const resetToLatest = useCallback(async () => {
    if (snapshotsData?.snapshots && snapshotsData.snapshots.length > 0) {
      const latestSummary = snapshotsData.snapshots[0];
      const previousSummary = snapshotsData.snapshots[1] || null;

      try {
        const latestFull = await fetchSnapshotById(latestSummary.id, true, 10000);
        setCurrentSnapshot(latestFull);

        if (previousSummary) {
          const previousFull = await fetchSnapshotById(previousSummary.id, true, 10000);
          setPreviousSnapshot(previousFull);
          const comparison = compareSnapshots(previousFull, latestFull);
          setComparisonResult(comparison);
        } else {
          setPreviousSnapshot(null);
          setComparisonResult(null);
        }
      } catch (err) {
        console.error("Error resetting to latest:", err);
        setError(err as Error);
      }
    }
  }, [snapshotsData]);

  // Get snapshots list from API data
  const snapshots = useMemo(() => {
    return snapshotsData?.snapshots || [];
  }, [snapshotsData]);

  // Get last execution time
  const lastExecutionTime = localStorage.getItem(STORAGE_LAST_EXECUTION_KEY)
    ? parseInt(localStorage.getItem(STORAGE_LAST_EXECUTION_KEY) || "0", 10)
    : null;

  const hasChanges =
    comparisonResult !== null &&
    (comparisonResult.summary.totalNew > 0 ||
      comparisonResult.summary.totalRemoved > 0 ||
      comparisonResult.summary.totalChanged > 0);

  // Combine loading states
  const isLoading = mutation.isPending || isLoadingSnapshots;
  const isFetching = mutation.isPending || isLoadingSnapshots;

  // Use API error if available, otherwise use mutation error
  const displayError = error || (snapshotsError as Error) || null;

  return {
    currentSnapshot,
    previousSnapshot,
    comparisonResult,
    snapshots,
    isLoading,
    isFetching,
    error: displayError,
    runScraper,
    clearSnapshots,
    selectSnapshotForComparison,
    resetToLatest,
    lastExecutionTime,
    hasChanges,
  };
}

