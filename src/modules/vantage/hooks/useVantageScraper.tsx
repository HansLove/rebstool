/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { fetchVantageData } from "../services/vantageScraperService";
import {
  saveSnapshot,
  getLatestSnapshot,
  getPreviousSnapshot,
  getSnapshots,
} from "../utils/vantageStorage";
import { compareSnapshots } from "../utils/vantageComparison";
import type {
  VantageSnapshot,
  ComparisonResult,
  VantageCredentials,
} from "../types";
import { mockPreviousSnapshot, mockCurrentSnapshot } from "../data/mockSnapshots";

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
// const AUTO_RUN_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function useVantageScraper(): UseVantageScraperReturn {
  const [currentSnapshot, setCurrentSnapshot] = useState<VantageSnapshot | null>(null);
  const [previousSnapshot, setPreviousSnapshot] = useState<VantageSnapshot | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Load snapshots from storage on mount, or use mock data if none exist
  useEffect(() => {
    const latest = getLatestSnapshot();
    const previous = getPreviousSnapshot();
    
    // If no snapshots in storage, use mock data
    if (!latest) {
      // Save both mock snapshots directly to localStorage (bypassing saveSnapshot to avoid trimming)
      const mockSnapshots = [mockCurrentSnapshot, mockPreviousSnapshot];
      localStorage.setItem("vantage_snapshots", JSON.stringify(mockSnapshots));
      
      setCurrentSnapshot(mockCurrentSnapshot);
      setPreviousSnapshot(mockPreviousSnapshot);
      
      // Compare mock snapshots
      const comparison = compareSnapshots(mockPreviousSnapshot, mockCurrentSnapshot);
      setComparisonResult(comparison);
    } else {
      setCurrentSnapshot(latest);
      
      // If we have both snapshots, compare them
      if (previous) {
        setPreviousSnapshot(previous);
        const comparison = compareSnapshots(previous, latest);
        setComparisonResult(comparison);
      }
    }
  }, []);

  // Mutation for running the scraper
  const mutation = useMutation({
    mutationFn: (credentials?: VantageCredentials) => fetchVantageData(credentials),
    onSuccess: (newSnapshot) => {
      // IMPORTANT: Get the CURRENT snapshot BEFORE saving the new one
      // This becomes the PREVIOUS snapshot after we save the new one
      const currentBeforeSave = getLatestSnapshot();

      // Save new snapshot (this will automatically keep only the 2 most recent)
      // After this, the array will be: [newSnapshot, currentBeforeSave]
      saveSnapshot(newSnapshot);
      
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
        toast.success("First snapshot saved successfully. Run again to start comparing.", { duration: 4000 });
      }

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
    localStorage.removeItem("vantage_snapshots");
    localStorage.removeItem(STORAGE_LAST_EXECUTION_KEY);
    setCurrentSnapshot(null);
    setPreviousSnapshot(null);
    setComparisonResult(null);
    toast.success("Snapshots cleared", { duration: 3000 });
  }, []);

  // Get snapshots list
  const snapshots = getSnapshots().sort((a, b) => b.timestamp - a.timestamp);

  // Get last execution time
  const lastExecutionTime = localStorage.getItem(STORAGE_LAST_EXECUTION_KEY)
    ? parseInt(localStorage.getItem(STORAGE_LAST_EXECUTION_KEY) || "0", 10)
    : null;

  const hasChanges =
    comparisonResult !== null &&
    (comparisonResult.summary.totalNew > 0 ||
      comparisonResult.summary.totalRemoved > 0 ||
      comparisonResult.summary.totalChanged > 0);

  return {
    currentSnapshot,
    previousSnapshot,
    comparisonResult,
    snapshots,
    isLoading: mutation.isPending,
    isFetching: mutation.isPending,
    error,
    runScraper,
    clearSnapshots,
    lastExecutionTime,
    hasChanges,
  };
}

