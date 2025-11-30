import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchSnapshots } from "@/modules/vantage/services/vantageScraperService";
import type { RetailClient } from "@/modules/vantage/types";
import { startOfMonth, endOfMonth } from "date-fns";

export interface DayData {
  date: Date;
  newUsers: RetailClient[];
  firstDeposits: RetailClient[];
  deposits: { client: RetailClient; amount: number; currency: string }[];
  tradingActivity: { client: RetailClient; volume: number; symbol: string }[];
  totalEquity: number;
  totalDeposits: number;
  totalVolume: number;
}

export interface MonthlyTotals {
  totalEquity: number;
  totalDeposits: number;
  totalVolume: number;
  newUsers: number;
  activeDays: number;
  totalClients: number;
}

/**
 * Hook to fetch and process journal data from Vantage snapshots
 */
export function useJournalData(selectedMonth: Date) {
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);

  // Fetch all snapshots - we'll need to fetch multiple pages to cover the month
  // For now, fetch a reasonable number of snapshots (adjust limit as needed)
  const {
    data: snapshotsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["journal-snapshots", monthStart.getTime(), monthEnd.getTime()],
    queryFn: async () => {
      // Fetch multiple pages to get all snapshots for the month
      // Note: This is a simplified approach. In production, you might want
      // to fetch snapshots filtered by date range on the backend
      const allSnapshots = [];
      let page = 1;
      let hasMore = true;
      const limit = 50; // Fetch 50 snapshots per page

      while (hasMore && page <= 10) {
        // Limit to 10 pages to avoid infinite loops
        const response = await fetchSnapshots(page, limit);
        allSnapshots.push(...response.snapshots);

        // Check if we have snapshots within the month range
        const snapshotsInRange = response.snapshots.filter(
          (snapshot) =>
            snapshot.timestamp >= monthStart.getTime() &&
            snapshot.timestamp <= monthEnd.getTime()
        );

        // If we got fewer than limit, we're done
        if (response.snapshots.length < limit) {
          hasMore = false;
        }

        // If we've gone past the month, we can stop
        const oldestSnapshot = response.snapshots[response.snapshots.length - 1];
        if (oldestSnapshot && oldestSnapshot.timestamp < monthStart.getTime()) {
          hasMore = false;
        }

        page++;
      }

      return allSnapshots.filter(
        (snapshot) =>
          snapshot.timestamp >= monthStart.getTime() &&
          snapshot.timestamp <= monthEnd.getTime()
      );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Process snapshots into daily data
  const dailyData = useMemo(() => {
    if (!snapshotsData || snapshotsData.length === 0) {
      return [];
    }

    // Get all retail clients from all snapshots
    const allClients: RetailClient[] = [];
    snapshotsData.forEach((snapshot) => {
      snapshot.retailResults.forEach((result) => {
        allClients.push(...result.retail.data);
      });
    });

    // Group data by day
    const daysMap = new Map<string, DayData>();

    // Process each client
    allClients.forEach((client) => {
      // New user registration
      if (client.registerDate) {
        const registerDate = new Date(client.registerDate);
        if (registerDate >= monthStart && registerDate <= monthEnd) {
          const dayKey = registerDate.toISOString().split("T")[0];
          if (!daysMap.has(dayKey)) {
            daysMap.set(dayKey, {
              date: new Date(registerDate),
              newUsers: [],
              firstDeposits: [],
              deposits: [],
              tradingActivity: [],
              totalEquity: 0,
              totalDeposits: 0,
              totalVolume: 0,
            });
          }
          const dayData = daysMap.get(dayKey)!;
          dayData.newUsers.push(client);
        }
      }

      // First deposit
      if (client.firstDepositDate) {
        const depositDate = new Date(client.firstDepositDate);
        if (depositDate >= monthStart && depositDate <= monthEnd) {
          const dayKey = depositDate.toISOString().split("T")[0];
          if (!daysMap.has(dayKey)) {
            daysMap.set(dayKey, {
              date: new Date(depositDate),
              newUsers: [],
              firstDeposits: [],
              deposits: [],
              tradingActivity: [],
              totalEquity: 0,
              totalDeposits: 0,
              totalVolume: 0,
            });
          }
          const dayData = daysMap.get(dayKey)!;
          dayData.firstDeposits.push(client);
        }
      }

      // Last deposit
      if (client.lastDepositTime && client.lastDepositAmount) {
        const depositDate = new Date(client.lastDepositTime);
        if (depositDate >= monthStart && depositDate <= monthEnd) {
          const dayKey = depositDate.toISOString().split("T")[0];
          if (!daysMap.has(dayKey)) {
            daysMap.set(dayKey, {
              date: new Date(depositDate),
              newUsers: [],
              firstDeposits: [],
              deposits: [],
              tradingActivity: [],
              totalEquity: 0,
              totalDeposits: 0,
              totalVolume: 0,
            });
          }
          const dayData = daysMap.get(dayKey)!;
          dayData.deposits.push({
            client,
            amount: client.lastDepositAmount,
            currency: client.lastDepositCurrency || "USD",
          });
          dayData.totalDeposits += client.lastDepositAmount || 0;
        }
      }

      // Trading activity
      if (client.lastTradeTime && client.lastTradeVolume) {
        const tradeDate = new Date(client.lastTradeTime);
        if (tradeDate >= monthStart && tradeDate <= monthEnd) {
          const dayKey = tradeDate.toISOString().split("T")[0];
          if (!daysMap.has(dayKey)) {
            daysMap.set(dayKey, {
              date: new Date(tradeDate),
              newUsers: [],
              firstDeposits: [],
              deposits: [],
              tradingActivity: [],
              totalEquity: 0,
              totalDeposits: 0,
              totalVolume: 0,
            });
          }
          const dayData = daysMap.get(dayKey)!;
          dayData.tradingActivity.push({
            client,
            volume: client.lastTradeVolume,
            symbol: client.lastTradeSymbol || "N/A",
          });
          dayData.totalVolume += client.lastTradeVolume || 0;
        }
      }

      // Equity - add equity to the day of registration or first activity
      // We'll use the client's equity from the snapshot where it appears
      const activityDate =
        client.registerDate ||
        client.firstDepositDate ||
        client.lastDepositTime ||
        client.lastTradeTime;

      if (activityDate) {
        const activityDay = new Date(activityDate);
        if (activityDay >= monthStart && activityDay <= monthEnd) {
          const dayKey = activityDay.toISOString().split("T")[0];
          if (!daysMap.has(dayKey)) {
            daysMap.set(dayKey, {
              date: new Date(activityDay),
              newUsers: [],
              firstDeposits: [],
              deposits: [],
              tradingActivity: [],
              totalEquity: 0,
              totalDeposits: 0,
              totalVolume: 0,
            });
          }
          const dayData = daysMap.get(dayKey)!;
          // Add equity from the client (from the snapshot where it was captured)
          dayData.totalEquity += client.equity || 0;
        }
      }
    });

    // Convert map to array and sort by date
    return Array.from(daysMap.values()).sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
  }, [snapshotsData, monthStart, monthEnd]);

  // Calculate monthly totals
  const monthlyTotals: MonthlyTotals = useMemo(() => {
    return dailyData.reduce(
      (totals, day) => {
        totals.totalEquity += day.totalEquity;
        totals.totalDeposits += day.totalDeposits;
        totals.totalVolume += day.totalVolume;
        totals.newUsers += day.newUsers.length;
        if (
          day.newUsers.length > 0 ||
          day.deposits.length > 0 ||
          day.tradingActivity.length > 0
        ) {
          totals.activeDays += 1;
        }
        return totals;
      },
      {
        totalEquity: 0,
        totalDeposits: 0,
        totalVolume: 0,
        newUsers: 0,
        activeDays: 0,
        totalClients: snapshotsData
          ? snapshotsData.reduce(
              (sum, s) => sum + s.metadata.totalRetailClients,
              0
            )
          : 0,
      }
    );
  }, [dailyData, snapshotsData]);

  return {
    dailyData,
    monthlyTotals,
    isLoading,
    error,
  };
}

