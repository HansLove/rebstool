import type { VantageSnapshot } from "../types";
import { extractAllRetailClients } from "./snapshotHelpers";

export interface FinancialMetrics {
  // Totales
  totalCommission: number;
  totalEquity: number;
  totalBalance: number;
  totalProfit: number;
  
  // Retail Clients
  totalRetailEquity: number;
  totalRetailBalance: number;
  totalDeposits: number;
  averageDeposit: number;
  averageEquity: number;
  
  // Volumen de Trading
  totalTradingVolume: number;
  averageTradingVolume: number;
  clientsWithTradingActivity: number;
  
  // Actividad
  activeClients: number; // Con equity > 0
  inactiveClients: number; // Con equity = 0
  clientsWithRecentDeposits: number; // Últimos 30 días
  clientsWithRecentTrades: number; // Últimos 7 días
  
  // Distribución por país (si está disponible)
  countries: Record<string, number>;
  
  // Top items
  topDeposits: Array<{ userId: number; name: string; amount: number; date: number; currency: string }>;
  topEquity: Array<{ userId: number; name: string; equity: number }>;
  topTradingVolume: Array<{ userId: number; name: string; volume: number; symbol: string | null }>;
  recentDeposits: Array<{ userId: number; name: string; amount: number; date: number; currency: string }>;
  recentTrades: Array<{ userId: number; name: string; volume: number; symbol: string | null; date: number }>;
}

export interface SnapshotComparison {
  // Cambios financieros
  commissionChange: number;
  commissionChangePercent: number;
  equityChange: number;
  equityChangePercent: number;
  balanceChange: number;
  balanceChangePercent: number;
  
  // Cambios en volumen de trading
  tradingVolumeChange: number;
  tradingVolumeChangePercent: number;
  activeTradersChange: number;
  
  // Cambios en clientes
  clientsChange: number;
  clientsChangePercent: number;
  activeClientsChange: number;
  depositsChange: number;
  depositsChangePercent: number;
  averageDepositChange: number;
  
  // Alertas críticas
  clientsLost: number; // Clientes que abandonaron (removidos)
  clientsGained: number; // Nuevos clientes
  highValueClientsLost: Array<{ userId: number; name: string; lastEquity: number }>;
  significantWithdrawals: Array<{ userId: number; name: string; equityChange: number }>;
  emptiedAccounts: Array<{ userId: number; name: string; previousEquity: number; currentEquity: number }>; // Cuentas vaciadas
}

/**
 * Calcula métricas financieras de un snapshot
 */
export function calculateMetrics(snapshot: VantageSnapshot): FinancialMetrics {
  // Métricas de Accounts (Rebates)
  const totalCommission = snapshot.accounts.reduce((sum, acc) => sum + acc.commission, 0);
  const totalEquity = snapshot.accounts.reduce((sum, acc) => sum + acc.equity, 0);
  const totalBalance = snapshot.accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalProfit = snapshot.accounts.reduce((sum, acc) => sum + acc.profit, 0);

  // Extraer todos los retail clients (supports new and legacy structure)
  const allClients = extractAllRetailClients(snapshot);

  // Métricas de Retail Clients
  const totalRetailEquity = allClients.reduce((sum, client) => sum + (client.equity || 0), 0);
  const totalRetailBalance = allClients.reduce((sum, client) => sum + (client.accountBalance || 0), 0);

  // Depósitos
  const deposits = allClients
    .filter((c) => c.lastDepositAmount && c.lastDepositAmount > 0)
    .map((c) => ({
      userId: c.userId,
      name: c.name,
      amount: c.lastDepositAmount!,
      date: c.lastDepositTime!,
      currency: c.lastDepositCurrency || "USD",
    }));

  const totalDeposits = deposits.reduce((sum, d) => sum + d.amount, 0);
  const averageDeposit = deposits.length > 0 ? totalDeposits / deposits.length : 0;
  const averageEquity = allClients.length > 0 ? totalRetailEquity / allClients.length : 0;

  // Actividad
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  const activeClients = allClients.filter((c) => c.equity > 0).length;
  const inactiveClients = allClients.length - activeClients;
  const clientsWithRecentDeposits = allClients.filter(
    (c) => c.lastDepositTime && c.lastDepositTime >= thirtyDaysAgo
  ).length;
  const clientsWithRecentTrades = allClients.filter(
    (c) => c.lastTradeTime && c.lastTradeTime >= sevenDaysAgo
  ).length;

  // Volumen de Trading
  const tradingVolumes = allClients
    .filter((c) => c.lastTradeVolume && c.lastTradeVolume > 0)
    .map((c) => ({
      userId: c.userId,
      name: c.name,
      volume: c.lastTradeVolume!,
      symbol: c.lastTradeSymbol,
      date: c.lastTradeTime!,
    }));

  const totalTradingVolume = tradingVolumes.reduce((sum, t) => sum + t.volume, 0);
  const averageTradingVolume = tradingVolumes.length > 0 ? totalTradingVolume / tradingVolumes.length : 0;
  const clientsWithTradingActivity = tradingVolumes.length;

  // Top items
  const topDeposits = [...deposits]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);

  const topEquity = allClients
    .map((c) => ({
      userId: c.userId,
      name: c.name,
      equity: c.equity,
    }))
    .sort((a, b) => b.equity - a.equity)
    .slice(0, 10);

  const topTradingVolume = [...tradingVolumes]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 10);

  const recentDeposits = [...deposits]
    .filter((d) => d.date >= thirtyDaysAgo)
    .sort((a, b) => b.date - a.date)
    .slice(0, 20);

  const recentTrades = [...tradingVolumes]
    .filter((t) => t.date >= sevenDaysAgo)
    .sort((a, b) => b.date - a.date)
    .slice(0, 20);

  return {
    totalCommission,
    totalEquity,
    totalBalance,
    totalProfit,
    totalRetailEquity,
    totalRetailBalance,
    totalDeposits,
    averageDeposit,
    averageEquity,
    totalTradingVolume,
    averageTradingVolume,
    clientsWithTradingActivity,
    activeClients,
    inactiveClients,
    clientsWithRecentDeposits,
    clientsWithRecentTrades,
    countries: {}, // Se puede implementar si hay datos de país
    topDeposits,
    topEquity,
    topTradingVolume,
    recentDeposits,
    recentTrades,
  };
}

/**
 * Compara dos snapshots y calcula cambios
 */
export function compareSnapshots(
  previous: VantageSnapshot,
  current: VantageSnapshot
): SnapshotComparison {
  const prevMetrics = calculateMetrics(previous);
  const currMetrics = calculateMetrics(current);

  // Cambios financieros
  const commissionChange = currMetrics.totalCommission - prevMetrics.totalCommission;
  const commissionChangePercent =
    prevMetrics.totalCommission > 0
      ? (commissionChange / prevMetrics.totalCommission) * 100
      : 0;

  const equityChange = currMetrics.totalRetailEquity - prevMetrics.totalRetailEquity;
  const equityChangePercent =
    prevMetrics.totalRetailEquity > 0
      ? (equityChange / prevMetrics.totalRetailEquity) * 100
      : 0;

  const balanceChange = currMetrics.totalRetailBalance - prevMetrics.totalRetailBalance;
  const balanceChangePercent =
    prevMetrics.totalRetailBalance > 0
      ? (balanceChange / prevMetrics.totalRetailBalance) * 100
      : 0;

  // Cambios en clientes
  const clientsChange = currMetrics.activeClients - prevMetrics.activeClients;
  const clientsChangePercent =
    prevMetrics.activeClients > 0
      ? (clientsChange / prevMetrics.activeClients) * 100
      : 0;

  const activeClientsChange = clientsChange;
  const depositsChange = currMetrics.totalDeposits - prevMetrics.totalDeposits;
  const depositsChangePercent =
    prevMetrics.totalDeposits > 0
      ? (depositsChange / prevMetrics.totalDeposits) * 100
      : 0;

  const averageDepositChange = currMetrics.averageDeposit - prevMetrics.averageDeposit;

  // Cambios en volumen de trading
  const tradingVolumeChange = currMetrics.totalTradingVolume - prevMetrics.totalTradingVolume;
  const tradingVolumeChangePercent =
    prevMetrics.totalTradingVolume > 0
      ? (tradingVolumeChange / prevMetrics.totalTradingVolume) * 100
      : 0;
  const activeTradersChange = currMetrics.clientsWithTradingActivity - prevMetrics.clientsWithTradingActivity;

  // Clientes perdidos y ganados (usando comparison result)
  const prevClients = extractAllRetailClients(previous);
  const currClients = extractAllRetailClients(current);
  const prevClientIds = new Set(prevClients.map((c) => c.userId));
  const currClientIds = new Set(currClients.map((c) => c.userId));

  const clientsLost = [...prevClientIds].filter((id) => !currClientIds.has(id)).length;
  const clientsGained = [...currClientIds].filter((id) => !prevClientIds.has(id)).length;

  // Clientes de alto valor perdidos
  const prevClientsMap = new Map(prevClients.map((c) => [c.userId, c]));

  const highValueClientsLost = [...prevClientIds]
    .filter((id) => !currClientIds.has(id))
    .map((id) => {
      const client = prevClientsMap.get(id);
      return {
        userId: id,
        name: client?.name || "Unknown",
        lastEquity: client?.equity || 0,
      };
    })
    .filter((c) => c.lastEquity > 1000) // Solo clientes con equity > $1000
    .sort((a, b) => b.lastEquity - a.lastEquity);

  // Retiros significativos (clientes que aún existen pero con equity reducido)
  const currClientsMap = new Map(currClients.map((c) => [c.userId, c]));

  const significantWithdrawals = [...currClientIds]
    .filter((id) => prevClientIds.has(id))
    .map((id) => {
      const prevClient = prevClientsMap.get(id);
      const currClient = currClientsMap.get(id);
      if (!prevClient || !currClient) return null;

      const equityChange = currClient.equity - prevClient.equity;
      return {
        userId: id,
        name: currClient.name,
        equityChange,
      };
    })
    .filter(
      (item): item is { userId: number; name: string; equityChange: number } =>
        item !== null && item.equityChange < -500 // Retiros > $500
    )
    .sort((a, b) => a.equityChange - b.equityChange); // Más negativos primero

  // Cuentas vaciadas: clientes que tenían equity significativo y ahora tienen casi nada
  const emptiedAccounts = [...currClientIds]
    .filter((id) => prevClientIds.has(id))
    .map((id) => {
      const prevClient = prevClientsMap.get(id);
      const currClient = currClientsMap.get(id);
      if (!prevClient || !currClient) return null;

      const previousEquity = prevClient.equity || 0;
      const currentEquity = currClient.equity || 0;
      
      // Considerar cuenta vaciada si tenía > $100 y ahora tiene < $10
      if (previousEquity > 100 && currentEquity < 10) {
        return {
          userId: id,
          name: currClient.name,
          previousEquity,
          currentEquity,
        };
      }
      return null;
    })
    .filter(
      (item): item is { userId: number; name: string; previousEquity: number; currentEquity: number } =>
        item !== null
    )
    .sort((a, b) => b.previousEquity - a.previousEquity); // Ordenar por equity anterior (mayor primero)

  return {
    commissionChange,
    commissionChangePercent,
    equityChange,
    equityChangePercent,
    balanceChange,
    balanceChangePercent,
    tradingVolumeChange,
    tradingVolumeChangePercent,
    activeTradersChange,
    clientsChange,
    clientsChangePercent,
    activeClientsChange,
    depositsChange,
    depositsChangePercent,
    averageDepositChange,
    clientsLost,
    clientsGained,
    highValueClientsLost,
    significantWithdrawals,
    emptiedAccounts,
  };
}
