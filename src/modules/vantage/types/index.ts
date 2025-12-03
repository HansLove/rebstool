// Vantage Scraper API Types

export interface Account {
  id: number;
  userId: number;
  accountDealType: number | null;
  login: number;
  currency: string;
  commission: number;
  dataSourceId: number;
  balance: number;
  mtAccountType: number;
  marginLevel: number;
  profit: number;
  equity: number;
  credit: number;
  approvedTime: number;
  hasNegativeBalanceNoPosition: boolean;
}

export interface RetailClient {
  registerDate: number;
  firstDepositDate: number | null;
  name: string;
  accountNmber: number;
  email: string | null;
  platform: number;
  accountType: number;
  baseCurrency: string;
  accountBalance: number;
  userId: number;
  equity: number;
  credit: number;
  phone: string;
  poiStatus: number | null;
  poaStatus: number | null;
  fundingStatus: number;
  archiveStatus: number;
  accountJourney: number;
  lastTradeTime: number | null;
  lastTradeSymbol: string | null;
  lastTradeVolume: number | null;
  lastDepositTime: number | null;
  lastDepositAmount: number | null;
  lastDepositCurrency: string | null;
  ownerName: string;
}

export interface RetailResult {
  login: number;
  ownerName: string | null; // Owners/sub-id name from extendString or ownerName
  retail: {
    code: number;
    msg: string | null;
    errmsg: string | null;
    data: RetailClient[];
  };
}

export interface VantageApiResponse {
  success: boolean;
  message: string;
  snapshotId?: string; // Snapshot ID returned from the API
  data: {
    success: boolean;
    accounts?: Account[];
    retailResults?: RetailResult[]; // Legacy structure
    sub_ibs?: SubIB[]; // New unified structure - clients are in sub_ibs[].clients when include_clients=true
    // Note: all_clients does NOT exist in the new API structure
    // Keeping as optional for backward compatibility only
    all_clients?: RetailClient[]; // Deprecated - should not be used, kept for legacy compatibility
  };
  error?: string;
}

export interface VantageSnapshot {
  id: string; // UUID o timestamp único
  timestamp: number; // Unix timestamp
  scrapedAt: string; // ISO date string
  accounts: Account[];
  retailResults: RetailResult[]; // Legacy structure, kept for backward compatibility
  subIBs?: SubIB[]; // New unified structure
  allClients?: RetailClient[]; // All clients if include_clients=true
  metadata: {
    totalAccounts: number;
    totalRetailClients: number;
    // Group accounts by userId to show all sub-ids
    accountsByUserId: Map<number, Account[]>;
    // Group retail clients by ownerName to show all sub-ids
    clientsByOwner: Map<string, RetailClient[]>;
  };
}

export interface FieldChange {
  field: string;
  oldValue: unknown;
  newValue: unknown;
}

export interface ChangedUser {
  user: RetailClient;
  changes: FieldChange[];
}

export interface ComparisonResult {
  newUsers: RetailClient[];
  removedUsers: RetailClient[];
  changedUsers: ChangedUser[];
  summary: {
    totalNew: number;
    totalRemoved: number;
    totalChanged: number;
  };
}

export interface VantageCredentials {
  username?: string;
  password?: string;
}

// New Sub-IB structure (unified structure)
export interface SubIB {
  ownerName: string;
  clientCount: number;
  totalBalance: number;
  totalEquity: number;
  totalDeposits: number;
  depositCount: number;
  averageBalance: number;
  averageEquity: number;
  averageDeposit: number;
  clients?: RetailClient[]; // Only present if include_clients=true
}

// API Response Types for GET endpoints

export interface VantageAccountApi {
  pk: number;
  vantage_id: number;
  snapshot_id: string;
  login: number;
  userId: number;
  accountDealType: number | null;
  currency: string;
  commission: number;
  dataSourceId: number;
  balance: number;
  mtAccountType: number;
  mtCategory: string | null;
  accountDisplayType: string | null;
  mtAccountTypeDisplay: string | null;
  accountMt4TypeDisplay: string | null;
  isCredit: boolean | null;
  isCommissionProhibit: boolean;
  marginLevel: number;
  profit: number;
  equity: number;
  credit: number;
  approvedTime: number;
  lbtCCAdjustedBalance: number | null;
  hasNegativeBalanceNoPosition: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VantageRetailClientApi {
  id: number;
  retail_header_id: number;
  registerDate: number;
  firstDepositDate: number | null;
  firstTransferInDate: number | null;
  date: number;
  name: string;
  accountNmber: number;
  email: string | null;
  platform: number;
  accountType: number;
  baseCurrency: string;
  accountBalance: number;
  userId: number;
  bPayNumber: string | null;
  profit: number | null;
  marginLevel: number | null;
  equity: number;
  credit: number;
  phone: string;
  poiStatus: number | null;
  poaStatus: number | null;
  fundingStatus: number;
  campaignSource: string | null;
  campaignTitle: string | null;
  participatedCampaigns: string | null;
  archiveStatus: number;
  accountJourney: number;
  tagList: string | null;
  lastTradeTime: number | null;
  lastTradeSymbol: string | null;
  lastTradeVolume: number | null;
  lastDepositTime: number | null;
  lastDepositAmount: number | null;
  lastDepositCurrency: string | null;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface VantageRetailHeaderApi {
  id: number;
  snapshot_id: string;
  account_login: number;
  code: number;
  msg: string | null;
  errmsg: string | null;
  extendString: string | null;
  extendInteger: number | null;
  createdAt: string;
  updatedAt: string;
  VantageRetailClients: VantageRetailClientApi[];
}

// Legacy API structure (for backward compatibility during migration)
export interface VantageSnapshotApiLegacy {
  id: string;
  timestamp: number;
  scraped_at: string;
  total_accounts: number;
  total_retail_clients: number;
  createdAt: string;
  updatedAt: string;
  VantageAccounts: VantageAccountApi[];
  VantageRetailHeaders: VantageRetailHeaderApi[];
}

// New unified API structure
// According to API documentation: clients are ONLY in sub_ibs[].clients when include_clients=true
// There is NO separate all_clients array to avoid data duplication
export interface VantageSnapshotApi {
  id: string;
  timestamp: number;
  scraped_at: string;
  total_accounts: number;
  total_retail_clients: number;
  createdAt: string;
  updatedAt: string;
  accounts: VantageAccountApi[];
  sub_ibs: SubIB[]; // Clients are in sub_ibs[].clients when include_clients=true
  // Note: all_clients does NOT exist in the new API structure
  // Keeping as optional for backward compatibility only
  all_clients?: RetailClient[]; // Deprecated - should not be used, kept for legacy compatibility
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SnapshotsListResponse {
  success: boolean;
  data: {
    snapshots: VantageSnapshotApi[];
    pagination: PaginationInfo;
  };
}

export interface SnapshotByIdResponse {
  success: boolean;
  data: VantageSnapshotApi;
  message?: string;
}

// Clients pagination response
export interface SnapshotClientsResponse {
  success: boolean;
  data: {
    snapshot_id: string;
    clients: VantageRetailClientApi[];
    sub_ibs_summary?: SubIB[]; // Summary of Sub-IBs
    pagination: PaginationInfo;
  };
  message?: string;
}

// Analytics response
export interface SnapshotAnalyticsResponse {
  success: boolean;
  data: {
    snapshot_id: string;
    snapshot: {
      id: string;
      timestamp: number;
      scraped_at: string;
      total_accounts: number;
      total_retail_clients: number;
    };
    analytics: {
      total_clients: number;
      total_balance: number;
      total_profit: number;
      average_balance: number;
      average_profit: number;
      clients_by_platform: Record<string, number>;
      clients_by_account_type: Record<string, number>;
      clients_by_currency: Record<string, number>;
      deposit_stats: {
        total_deposits: number;
        average_deposit: number;
        deposit_count: number;
      };
      top_clients_by_balance: Array<{
        id: number;
        name: string;
        accountNmber: number;
        accountBalance: number;
      }>;
      top_clients_by_profit: Array<{
        id: number;
        name: string;
        accountNmber: number;
        profit: number;
      }>;
      sub_ibs?: {
        total_clients: number;
        total_balance: number;
        total_equity: number;
        total_deposits: number;
        average_balance: number;
        average_equity: number;
        average_deposit: number;
        // In analytics endpoint, Sub-IBs use totalClients instead of clientCount
        sub_ibs: Array<SubIB | (Omit<SubIB, 'clientCount'> & { totalClients: number })>;
        sub_ibs_by_clients?: Array<SubIB | (Omit<SubIB, 'clientCount'> & { totalClients: number })>;
        sub_ibs_by_balance?: Array<SubIB | (Omit<SubIB, 'clientCount'> & { totalClients: number })>;
      };
    };
  };
  message?: string;
}

