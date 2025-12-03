import type { VantageSnapshot, RetailClient, Account } from "../types";

export interface VolumeMetrics {
  userId: number;
  name: string;
  tradingAccountLogin: number;
  
  // Volume by period (in lots - assuming 1 lot = standard contract size)
  volume24h: number;
  volume7d: number;
  volume30d: number;
  
  // Volume spikes (significant increases)
  hasVolumeSpike24h: boolean;
  hasVolumeSpike7d: boolean;
  
  // Additional context
  lastTradeTime: number | null;
  lastTradeSymbol: string | null;
  commission: number; // Can be used as proxy for volume
}

export interface VolumeLeaderboardResult {
  leaderboard24h: VolumeMetrics[];
  leaderboard7d: VolumeMetrics[];
  leaderboard30d: VolumeMetrics[];
  volumeSpikes: VolumeMetrics[];
}

/**
 * Calculate volume leaderboard from snapshots
 * Note: Since we only have lastTradeVolume per snapshot, we aggregate across snapshots
 */
export function calculateVolumeLeaderboard(
  currentSnapshot: VantageSnapshot,
  snapshots24h: VantageSnapshot[] = [],
  snapshots7d: VantageSnapshot[] = [],
  snapshots30d: VantageSnapshot[] = []
): VolumeLeaderboardResult {
  const now = Date.now();
  const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  // Get all current clients
  const currentClients = currentSnapshot.retailResults.flatMap(
    (result) => result.retail?.data || []
  );

  // Create accounts map
  const accountsMap = new Map<number, Account>();
  currentSnapshot.accounts.forEach((acc) => {
    accountsMap.set(acc.userId, acc);
  });

  // Build volume history map
  const volumeHistory = new Map<number, Array<{ volume: number; timestamp: number }>>();

  // Process all snapshots to collect volume data
  const allSnapshots = [
    { snapshot: currentSnapshot, period: "current" },
    ...(snapshots24h || []).map((s) => ({ snapshot: s, period: "24h" })),
    ...(snapshots7d || []).map((s) => ({ snapshot: s, period: "7d" })),
    ...(snapshots30d || []).map((s) => ({ snapshot: s, period: "30d" })),
  ];

  allSnapshots.forEach(({ snapshot }) => {
    const clients = snapshot.retailResults.flatMap((result) => result.retail?.data || []);
    clients.forEach((client) => {
      if (!volumeHistory.has(client.userId)) {
        volumeHistory.set(client.userId, []);
      }
      
      // Only count volume if trade was recent (within the snapshot's timeframe)
      if (client.lastTradeVolume && client.lastTradeTime) {
        volumeHistory.get(client.userId)!.push({
          volume: client.lastTradeVolume,
          timestamp: client.lastTradeTime,
        });
      }
    });
  });

  // Calculate volume metrics for each user
  const volumeMetrics: VolumeMetrics[] = currentClients.map((client) => {
    const history = volumeHistory.get(client.userId) || [];
    const account = accountsMap.get(client.userId);
    
    // Calculate volume for each period
    const volume24h = history
      .filter((h) => h.timestamp >= twentyFourHoursAgo)
      .reduce((sum, h) => sum + h.volume, 0);
    
    const volume7d = history
      .filter((h) => h.timestamp >= sevenDaysAgo)
      .reduce((sum, h) => sum + h.volume, 0);
    
    const volume30d = history
      .filter((h) => h.timestamp >= thirtyDaysAgo)
      .reduce((sum, h) => sum + h.volume, 0);

    // Detect volume spikes (volume significantly higher than average)
    const avgVolume7d = volume7d / 7; // Average daily volume
    const avgVolume30d = volume30d / 30;
    const hasVolumeSpike24h = volume24h > avgVolume7d * 2 && volume24h > 1;
    const hasVolumeSpike7d = volume7d > avgVolume30d * 2 && volume7d > 5;

    return {
      userId: client.userId,
      name: client.name || `User ${client.userId}`,
      tradingAccountLogin: account?.login || client.accountNmber || 0,
      volume24h,
      volume7d,
      volume30d,
      hasVolumeSpike24h,
      hasVolumeSpike7d,
      lastTradeTime: client.lastTradeTime,
      lastTradeSymbol: client.lastTradeSymbol,
      commission: account?.commission || 0,
    };
  });

  // Create leaderboards (top 10 for each period)
  const leaderboard24h = volumeMetrics
    .filter((v) => v.volume24h > 0)
    .sort((a, b) => b.volume24h - a.volume24h)
    .slice(0, 10);

  const leaderboard7d = volumeMetrics
    .filter((v) => v.volume7d > 0)
    .sort((a, b) => b.volume7d - a.volume7d)
    .slice(0, 10);

  const leaderboard30d = volumeMetrics
    .filter((v) => v.volume30d > 0)
    .sort((a, b) => b.volume30d - a.volume30d)
    .slice(0, 10);

  // Get volume spikes
  const volumeSpikes = volumeMetrics.filter(
    (v) => v.hasVolumeSpike24h || v.hasVolumeSpike7d
  );

  return {
    leaderboard24h,
    leaderboard7d,
    leaderboard30d,
    volumeSpikes,
  };
}

