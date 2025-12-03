/**
 * Transformer utilities to convert API response format to internal VantageSnapshot format
 */

import type {
  VantageSnapshot,
  VantageSnapshotApi,
  VantageSnapshotApiLegacy,
  Account,
  RetailClient,
  RetailResult,
  VantageAccountApi,
  VantageRetailClientApi,
  SubIB,
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
export function transformRetailClient(apiClient: VantageRetailClientApi): RetailClient {
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
 * Extracts owner name from header extendString or msg field
 * Format: "all_clientsV2 - Owner: {name}" or just the name
 */
function extractOwnerName(header: { extendString: string | null; msg: string | null }): string | null {
  // Try extendString first (most reliable)
  if (header.extendString) {
    return header.extendString.trim();
  }
  
  // Try parsing from msg field
  if (header.msg) {
    // Format: "all_clientsV2 - Owner: {name}"
    const ownerMatch = header.msg.match(/Owner:\s*(.+)/i);
    if (ownerMatch && ownerMatch[1]) {
      return ownerMatch[1].trim();
    }
    // If no match, return null (will use first client's ownerName if available)
  }
  
  return null;
}

/**
 * Checks if snapshot uses new unified structure (with sub_ibs)
 */
function isNewStructure(apiSnapshot: VantageSnapshotApi | VantageSnapshotApiLegacy): apiSnapshot is VantageSnapshotApi {
  return 'sub_ibs' in apiSnapshot && Array.isArray((apiSnapshot as VantageSnapshotApi).sub_ibs);
}

/**
 * Transforms API snapshot format to internal VantageSnapshot format
 * Handles both new unified structure (with sub_ibs) and legacy structure (with VantageRetailHeaders)
 */
export function transformApiSnapshotToSnapshot(
  apiSnapshot: VantageSnapshotApi | VantageSnapshotApiLegacy
): VantageSnapshot {
  // Check if using new structure
  if (isNewStructure(apiSnapshot)) {
    return transformNewStructureSnapshot(apiSnapshot);
  }
  
  // Legacy structure
  return transformLegacyStructureSnapshot(apiSnapshot);
}

/**
 * Transforms new unified structure (with sub_ibs)
 */
function transformNewStructureSnapshot(apiSnapshot: VantageSnapshotApi): VantageSnapshot {
  // Transform accounts
  const accounts: Account[] = (apiSnapshot.accounts || []).map(
    transformAccount
  );

  // Transform Sub-IBs
  // Handle both clientCount (main endpoints) and totalClients (analytics endpoint)
  const subIBs: SubIB[] = (apiSnapshot.sub_ibs || []).map((subIB: any) => ({
    ownerName: subIB.ownerName,
    // Support both clientCount (main endpoints) and totalClients (analytics endpoint)
    clientCount: subIB.clientCount ?? subIB.totalClients ?? 0,
    totalBalance: subIB.totalBalance,
    totalEquity: subIB.totalEquity,
    totalDeposits: subIB.totalDeposits,
    depositCount: subIB.depositCount,
    averageBalance: subIB.averageBalance,
    averageEquity: subIB.averageEquity,
    averageDeposit: subIB.averageDeposit,
    clients: subIB.clients?.map(transformRetailClient),
  }));

  // According to API documentation: clients are ONLY in sub_ibs[].clients when include_clients=true
  // There is NO separate all_clients array. However, we keep this as fallback for legacy compatibility
  const allClients: RetailClient[] = [];
  
  // Note: The API should NOT send all_clients separately according to the new structure
  // But we handle it as a fallback for backward compatibility
  if (apiSnapshot.all_clients && apiSnapshot.all_clients.length > 0) {
    // Create a map of userId to ownerName from subIBs for assigning ownerName
    const userIdToOwnerMap = new Map<number, string>();
    subIBs.forEach((subIB) => {
      if (subIB.clients && subIB.clients.length > 0) {
        subIB.clients.forEach((client) => {
          if (client.userId) {
            userIdToOwnerMap.set(client.userId, subIB.ownerName);
          }
        });
      }
      // Also map from clientCount if clients array not available
      if (subIB.clientCount > 0 && (!subIB.clients || subIB.clients.length === 0)) {
        // We can't map individual clients, but this helps with metadata
      }
    });

    // Transform all_clients if present (legacy/fallback only)
    apiSnapshot.all_clients.forEach((apiClient) => {
      const transformedClient = transformRetailClient(apiClient);
      // If client doesn't have ownerName, try to assign from subIBs mapping
      if (!transformedClient.ownerName && userIdToOwnerMap.has(transformedClient.userId)) {
        transformedClient.ownerName = userIdToOwnerMap.get(transformedClient.userId)!;
      }
      allClients.push(transformedClient);
    });
  }

  // Build retailResults from subIBs for backward compatibility
  const retailResults: RetailResult[] = subIBs.map((subIB) => ({
    login: 0, // Sub-IBs don't have a specific login
    ownerName: subIB.ownerName,
    retail: {
      code: 0,
      msg: null,
      errmsg: null,
      data: subIB.clients || [],
    },
  }));

  // Calculate metadata
  // According to new structure, total clients should come from sub_ibs clientCount sum
  // or from counting clients in sub_ibs[].clients when available
  let totalRetailClients = apiSnapshot.total_retail_clients || 0;
  
  // If we have subIBs with clients, count them (more accurate than API total)
  if (subIBs.length > 0) {
    const clientsFromSubIBs = subIBs.reduce((sum, subIB) => {
      if (subIB.clients && subIB.clients.length > 0) {
        return sum + subIB.clients.length;
      }
      // If clients array not available, use clientCount from Sub-IB
      return sum + subIB.clientCount;
    }, 0);
    
    if (clientsFromSubIBs > 0) {
      totalRetailClients = clientsFromSubIBs;
    }
  }
  
  // Fallback to allClients length if no subIBs data
  if (totalRetailClients === 0 && allClients.length > 0) {
    totalRetailClients = allClients.length;
  }

  // Group accounts by userId
  const accountsByUserId = new Map<number, Account[]>();
  accounts.forEach((account) => {
    if (!accountsByUserId.has(account.userId)) {
      accountsByUserId.set(account.userId, []);
    }
    accountsByUserId.get(account.userId)!.push(account);
  });

  // Group retail clients by ownerName
  // According to new API structure: clients are ONLY in sub_ibs[].clients
  const clientsByOwner = new Map<string, RetailClient[]>();
  
  // Primary source: clients from subIBs (new unified structure)
  subIBs.forEach((subIB) => {
    if (subIB.clients && subIB.clients.length > 0) {
      clientsByOwner.set(subIB.ownerName, subIB.clients);
    }
  });
  
  // Fallback: add clients from all_clients if present (legacy/backward compatibility only)
  // Note: According to API documentation, all_clients should NOT exist in new structure
  if (allClients.length > 0) {
    allClients.forEach((client) => {
      if (client.ownerName) {
        if (!clientsByOwner.has(client.ownerName)) {
          clientsByOwner.set(client.ownerName, []);
        }
        // Avoid duplicates - check if client already exists
        const existingClients = clientsByOwner.get(client.ownerName)!;
        if (!existingClients.some(c => c.userId === client.userId && c.accountNmber === client.accountNmber)) {
          existingClients.push(client);
        }
      }
    });
  }

  return {
    id: apiSnapshot.id,
    timestamp: apiSnapshot.timestamp,
    scrapedAt: apiSnapshot.scraped_at || new Date(apiSnapshot.timestamp).toISOString(),
    accounts,
    retailResults,
    subIBs,
    allClients: allClients.length > 0 ? allClients : undefined,
    metadata: {
      totalAccounts: apiSnapshot.total_accounts || accounts.length,
      totalRetailClients,
      accountsByUserId,
      clientsByOwner,
    },
  };
}

/**
 * Transforms legacy structure (with VantageRetailHeaders)
 */
function transformLegacyStructureSnapshot(apiSnapshot: VantageSnapshotApiLegacy): VantageSnapshot {
  // Transform accounts
  const accounts: Account[] = (apiSnapshot.VantageAccounts || []).map(
    transformAccount
  );

  // Transform retail results - group by account_login AND ownerName
  // Handle both summary mode (no clients) and full mode (with clients)
  // Use a composite key to handle multiple owners per login
  const retailResultsMap = new Map<string, RetailResult>();

  (apiSnapshot.VantageRetailHeaders || []).forEach((header) => {
    const login = header.account_login;
    
    // Extract owner name from header
    const headerOwnerName = extractOwnerName(header);
    
    // Check if clients are included (full mode) or just summary (summary mode)
    const hasClients = header.VantageRetailClients && header.VantageRetailClients.length > 0;
    const retailClients = hasClients 
      ? header.VantageRetailClients.map(transformRetailClient)
      : []; // Empty array in summary mode

    // Determine owner name: use header owner, or first client's ownerName, or null
    let ownerName: string | null = headerOwnerName;
    if (!ownerName && retailClients.length > 0) {
      ownerName = retailClients[0].ownerName || null;
    }

    // Create composite key: login + ownerName (to handle multiple owners per login)
    const compositeKey = `${login}-${ownerName || 'unknown'}`;

    if (!retailResultsMap.has(compositeKey)) {
      retailResultsMap.set(compositeKey, {
        login,
        ownerName,
        retail: {
          code: header.code,
          msg: header.msg || null,
          errmsg: header.errmsg || null,
          data: retailClients,
        },
      });
    } else {
      // If multiple headers for same login+owner, merge clients
      const existing = retailResultsMap.get(compositeKey)!;
      existing.retail.data.push(...retailClients);
    }
  });

  const retailResults: RetailResult[] = Array.from(retailResultsMap.values());

  // Calculate metadata
  const totalRetailClients = retailResults.reduce(
    (sum, r) => sum + (r.retail?.data?.length || 0),
    0
  );

  // Group accounts by userId (to show all sub-ids)
  const accountsByUserId = new Map<number, Account[]>();
  accounts.forEach((account) => {
    if (!accountsByUserId.has(account.userId)) {
      accountsByUserId.set(account.userId, []);
    }
    accountsByUserId.get(account.userId)!.push(account);
  });

  // Group retail clients by ownerName (to show all sub-ids)
  const clientsByOwner = new Map<string, RetailClient[]>();
  retailResults.forEach((result) => {
    if (result.ownerName) {
      if (!clientsByOwner.has(result.ownerName)) {
        clientsByOwner.set(result.ownerName, []);
      }
      clientsByOwner.get(result.ownerName)!.push(...result.retail.data);
    }
    // Also handle clients without ownerName (group by login)
    if (!result.ownerName && result.retail.data.length > 0) {
      const fallbackKey = `Login ${result.login}`;
      if (!clientsByOwner.has(fallbackKey)) {
        clientsByOwner.set(fallbackKey, []);
      }
      clientsByOwner.get(fallbackKey)!.push(...result.retail.data);
    }
  });

  return {
    id: apiSnapshot.id,
    timestamp: apiSnapshot.timestamp,
    scrapedAt: apiSnapshot.scraped_at || new Date(apiSnapshot.timestamp).toISOString(),
    accounts,
    retailResults,
    metadata: {
      totalAccounts: apiSnapshot.total_accounts || accounts.length,
      totalRetailClients: apiSnapshot.total_retail_clients || totalRetailClients,
      accountsByUserId,
      clientsByOwner,
    },
  };
}

