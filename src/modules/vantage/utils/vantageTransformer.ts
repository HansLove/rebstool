/**
 * Transformer utilities to convert API response format to internal VantageSnapshot format
 */

import type {
  VantageSnapshot,
  VantageSnapshotApi,
  Account,
  RetailClient,
  RetailResult,
  VantageAccountApi,
  VantageRetailClientApi,
} from "../types";

/**
 * Transforms API account format to internal Account format
 */
function transformAccount(apiAccount: VantageAccountApi): Account {
  return {
    id: apiAccount.vantage_id,
    userId: apiAccount.userId,
    accountDealType: apiAccount.accountDealType || null,
    login: apiAccount.login,
    currency: apiAccount.currency,
    commission: apiAccount.commission,
    dataSourceId: apiAccount.dataSourceId,
    balance: apiAccount.balance,
    mtAccountType: apiAccount.mtAccountType,
    marginLevel: apiAccount.marginLevel,
    profit: apiAccount.profit,
    equity: apiAccount.equity,
    credit: apiAccount.credit,
    approvedTime: apiAccount.approvedTime,
    hasNegativeBalanceNoPosition: apiAccount.hasNegativeBalanceNoPosition || false,
  };
}

/**
 * Transforms API retail client format to internal RetailClient format
 */
function transformRetailClient(apiClient: VantageRetailClientApi): RetailClient {
  return {
    registerDate: apiClient.registerDate,
    firstDepositDate: apiClient.firstDepositDate || null,
    name: apiClient.name,
    accountNmber: apiClient.accountNmber,
    email: apiClient.email || null,
    platform: apiClient.platform,
    accountType: apiClient.accountType,
    baseCurrency: apiClient.baseCurrency,
    accountBalance: apiClient.accountBalance,
    userId: apiClient.userId,
    equity: apiClient.equity,
    credit: apiClient.credit,
    phone: apiClient.phone,
    poiStatus: apiClient.poiStatus ?? null,
    poaStatus: apiClient.poaStatus ?? null,
    fundingStatus: apiClient.fundingStatus,
    archiveStatus: apiClient.archiveStatus,
    accountJourney: apiClient.accountJourney,
    lastTradeTime: apiClient.lastTradeTime || null,
    lastTradeSymbol: apiClient.lastTradeSymbol || null,
    lastTradeVolume: apiClient.lastTradeVolume || null,
    lastDepositTime: apiClient.lastDepositTime || null,
    lastDepositAmount: apiClient.lastDepositAmount || null,
    lastDepositCurrency: apiClient.lastDepositCurrency || null,
    ownerName: apiClient.ownerName,
  };
}

/**
 * Transforms API snapshot format to internal VantageSnapshot format
 */
export function transformApiSnapshotToSnapshot(
  apiSnapshot: VantageSnapshotApi
): VantageSnapshot {
  // Transform accounts
  const accounts: Account[] = (apiSnapshot.VantageAccounts || []).map(
    transformAccount
  );

  // Transform retail results - group by account_login
  const retailResultsMap = new Map<number, RetailResult>();

  (apiSnapshot.VantageRetailHeaders || []).forEach((header) => {
    const login = header.account_login;
    const retailClients = (header.VantageRetailClients || []).map(
      transformRetailClient
    );

    if (!retailResultsMap.has(login)) {
      retailResultsMap.set(login, {
        login,
        retail: {
          code: header.code,
          msg: header.msg || null,
          errmsg: header.errmsg || null,
          data: retailClients,
        },
      });
    } else {
      // If multiple headers for same login, merge clients
      const existing = retailResultsMap.get(login)!;
      existing.retail.data.push(...retailClients);
    }
  });

  const retailResults: RetailResult[] = Array.from(retailResultsMap.values());

  // Calculate metadata
  const totalRetailClients = retailResults.reduce(
    (sum, r) => sum + (r.retail?.data?.length || 0),
    0
  );

  return {
    id: apiSnapshot.id,
    timestamp: apiSnapshot.timestamp,
    scrapedAt: apiSnapshot.scraped_at || new Date(apiSnapshot.timestamp).toISOString(),
    accounts,
    retailResults,
    metadata: {
      totalAccounts: apiSnapshot.total_accounts || accounts.length,
      totalRetailClients: apiSnapshot.total_retail_clients || totalRetailClients,
    },
  };
}

