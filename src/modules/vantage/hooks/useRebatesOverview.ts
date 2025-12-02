import { useMemo } from "react";
import type { VantageSnapshot } from "../types";
import type {
  TraderKPI,
  RebatesOverviewResponse,
  RebatesRankings,
  RankingItem,
  TraderStatusFlag,
} from "../types/rebatesOverview";

interface UseRebatesOverviewProps {
  currentSnapshot: VantageSnapshot | null;
  previousSnapshot: VantageSnapshot | null;
  snapshots7d: VantageSnapshot[];
  snapshots30d: VantageSnapshot[];
}

/**
 * Hook to calculate rebates overview KPIs from snapshots
 */
export function useRebatesOverview({
  currentSnapshot,
  previousSnapshot,
  snapshots7d,
  snapshots30d,
}: UseRebatesOverviewProps): RebatesOverviewResponse | null {
  return useMemo(() => {
    if (!currentSnapshot) return null;

    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    // Get all retail clients from current snapshot
    const allCurrentClients = currentSnapshot.retailResults.flatMap(
      (result) => result.retail?.data || []
    );

    // Create maps for quick lookup
    const currentAccountsMap = new Map(
      currentSnapshot.accounts.map((acc) => [acc.userId, acc])
    );

    const currentClientsMap = new Map(
      allCurrentClients.map((client) => [client.userId, client])
    );

    // Get previous clients for comparison
    const previousClientsMap = new Map<number, any>();
    if (previousSnapshot) {
      previousSnapshot.retailResults.forEach((result) => {
        (result.retail?.data || []).forEach((client) => {
          previousClientsMap.set(client.userId, client);
        });
      });
    }

    // Create snapshots map for 30d calculations
    const snapshots30dMap = new Map<number, VantageSnapshot>();
    snapshots30d.forEach((snapshot) => {
      const snapshotClients = snapshot.retailResults.flatMap(
        (result) => result.retail?.data || []
      );
      snapshotClients.forEach((client) => {
        if (!snapshots30dMap.has(client.userId)) {
          snapshots30dMap.set(client.userId, snapshot);
        }
      });
    });

    // Build historical data maps for better calculations
    const historicalClients7d = new Map<number, any[]>();
    const historicalClients30d = new Map<number, any[]>();

    snapshots7d.forEach((snapshot) => {
      const clients = snapshot.retailResults.flatMap((result) => result.retail?.data || []);
      clients.forEach((c) => {
        if (!historicalClients7d.has(c.userId)) {
          historicalClients7d.set(c.userId, []);
        }
        historicalClients7d.get(c.userId)!.push(c);
      });
    });

    snapshots30d.forEach((snapshot) => {
      const clients = snapshot.retailResults.flatMap((result) => result.retail?.data || []);
      clients.forEach((c) => {
        if (!historicalClients30d.has(c.userId)) {
          historicalClients30d.set(c.userId, []);
        }
        historicalClients30d.get(c.userId)!.push(c);
      });
    });

    // Calculate KPIs for each trader
    const traders: TraderKPI[] = allCurrentClients.map((client) => {
      const account = currentAccountsMap.get(client.userId);
      const previousClient = previousClientsMap.get(client.userId);

      // Calculate lots traded
      // For 7d: sum up lastTradeVolume from clients in 7d range
      let lots7d = 0;
      const clients7d = historicalClients7d.get(client.userId) || [];
      clients7d.forEach((c) => {
        if (c.lastTradeTime && c.lastTradeTime >= sevenDaysAgo && c.lastTradeVolume) {
          lots7d += c.lastTradeVolume;
        }
      });
      // Also include current if within range
      if (client.lastTradeTime && client.lastTradeTime >= sevenDaysAgo && client.lastTradeVolume) {
        lots7d += client.lastTradeVolume;
      }

      // For 30d: sum up lastTradeVolume from clients in 30d range
      let lots30d = 0;
      const clients30d = historicalClients30d.get(client.userId) || [];
      clients30d.forEach((c) => {
        if (c.lastTradeTime && c.lastTradeTime >= thirtyDaysAgo && c.lastTradeVolume) {
          lots30d += c.lastTradeVolume;
        }
      });
      // Also include current if within range
      if (client.lastTradeTime && client.lastTradeTime >= thirtyDaysAgo && client.lastTradeVolume) {
        lots30d += client.lastTradeVolume;
      }

      // Calculate deposits - count deposits from historical snapshots
      let numberOfDeposits = 0;
      let totalDeposits = 0;
      
      // Count deposits in 30d range
      const depositSet = new Set<number>(); // Track unique deposit timestamps
      clients30d.forEach((c) => {
        if (c.lastDepositTime && c.lastDepositTime >= thirtyDaysAgo && c.lastDepositAmount) {
          const depositKey = Math.floor(c.lastDepositTime / (24 * 60 * 60 * 1000)); // Group by day
          if (!depositSet.has(depositKey)) {
            depositSet.add(depositKey);
            numberOfDeposits++;
            totalDeposits += c.lastDepositAmount;
          }
        }
      });
      
      // Include current deposit if within range
      if (client.lastDepositTime && client.lastDepositTime >= thirtyDaysAgo && client.lastDepositAmount) {
        const depositKey = Math.floor(client.lastDepositTime / (24 * 60 * 60 * 1000));
        if (!depositSet.has(depositKey)) {
          numberOfDeposits++;
          totalDeposits += client.lastDepositAmount;
        }
      }

      // Calculate withdrawals in last 30 days
      // Compare equity from 30 days ago to current
      let withdrawalAmount30d = 0;
      let withdrawalPct30d = 0;

      if (previousClient) {
        const previousEquity = previousClient.equity || 0;
        const currentEquity = client.equity || 0;
        const equityChange = previousEquity - currentEquity;

        // Only count as withdrawal if equity decreased significantly
        if (equityChange > 0 && previousEquity > 0) {
          withdrawalAmount30d = equityChange;
          withdrawalPct30d = (equityChange / previousEquity) * 100;
        }
      }

      // Determine status flag
      let statusFlag: TraderStatusFlag = "ok";

      if (previousClient) {
        const previousEquity = previousClient.equity || 0;
        const currentEquity = client.equity || 0;

        // Emptied account: had significant equity, now almost nothing
        if (previousEquity > 100 && currentEquity < 10) {
          statusFlag = "emptied_account";
        }
        // Critical withdrawal: withdrew > 70% of equity
        else if (withdrawalPct30d > 70 && withdrawalAmount30d > 1000) {
          statusFlag = "critical_withdrawal";
        }
        // High withdrawal risk: withdrew > 40% of equity
        else if (withdrawalPct30d > 40 && withdrawalAmount30d > 500) {
          statusFlag = "high_withdrawal_risk";
        }
      }

      return {
        userId: client.userId,
        tradingAccountLogin: account?.login || client.accountNmber || 0,
        name: client.name || client.ownerName || `User ${client.userId}`,
        email: client.email,
        phone: client.phone,
        lots7d,
        lots30d,
        numberOfDeposits,
        totalDeposits,
        withdrawalAmount30d,
        withdrawalPct30d,
        statusFlag,
        currentEquity: client.equity || 0,
        currentBalance: client.accountBalance || 0,
        commission: account?.commission || 0,
      };
    });

    // Calculate rankings
    const rankings: RebatesRankings = {
      topVolume7d: traders
        .filter((t) => t.lots7d > 0)
        .sort((a, b) => b.lots7d - a.lots7d)
        .slice(0, 10)
        .map((t) => ({
          userId: t.userId,
          name: t.name,
          tradingAccountLogin: t.tradingAccountLogin,
          value: t.lots7d,
          statusFlag: t.statusFlag,
        })),

      topVolume30d: traders
        .filter((t) => t.lots30d > 0)
        .sort((a, b) => b.lots30d - a.lots30d)
        .slice(0, 10)
        .map((t) => ({
          userId: t.userId,
          name: t.name,
          tradingAccountLogin: t.tradingAccountLogin,
          value: t.lots30d,
          statusFlag: t.statusFlag,
        })),

      topDeposits: traders
        .filter((t) => t.totalDeposits > 0)
        .sort((a, b) => b.totalDeposits - a.totalDeposits)
        .slice(0, 10)
        .map((t) => ({
          userId: t.userId,
          name: t.name,
          tradingAccountLogin: t.tradingAccountLogin,
          value: t.totalDeposits,
          statusFlag: t.statusFlag,
        })),

      topWithdrawalPct: traders
        .filter((t) => t.withdrawalPct30d > 0)
        .sort((a, b) => b.withdrawalPct30d - a.withdrawalPct30d)
        .slice(0, 10)
        .map((t) => ({
          userId: t.userId,
          name: t.name,
          tradingAccountLogin: t.tradingAccountLogin,
          value: t.withdrawalPct30d,
          statusFlag: t.statusFlag,
          withdrawalAmount30d: t.withdrawalAmount30d,
        })),
    };

    return {
      traders,
      rankings,
    };
  }, [currentSnapshot, previousSnapshot, snapshots7d, snapshots30d]);
}

