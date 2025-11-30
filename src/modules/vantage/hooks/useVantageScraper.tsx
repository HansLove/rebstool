/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  fetchVantageData,
  fetchSnapshots,
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

  // Fetch snapshots list from API
  const {
    data: snapshotsData,
    isLoading: isLoadingSnapshots,
    error: snapshotsError,
  } = useQuery({
    queryKey: SNAPSHOTS_QUERY_KEY,
    queryFn: () => fetchSnapshots(1, 2), // Fetch first page with 10 items
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
  });

  // Load latest and previous snapshots from API data
  useEffect(() => {
    if (snapshotsData?.snapshots && snapshotsData.snapshots.length > 0) {
      const latest = snapshotsData.snapshots[0]; // First item is latest (sorted by timestamp desc)
      const previous = snapshotsData.snapshots[1] || null; // Second item is previous

      setCurrentSnapshot(latest);

      if (previous) {
        setPreviousSnapshot(previous);
        const comparison = compareSnapshots(previous, latest);
        setComparisonResult(comparison);
      } else {
        setPreviousSnapshot(null);
        setComparisonResult(null);
      }
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
    lastExecutionTime,
    hasChanges,
  };
}

