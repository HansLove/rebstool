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
    accounts: Account[];
    retailResults: RetailResult[];
  };
  error?: string;
}

export interface VantageSnapshot {
  id: string; // UUID o timestamp único
  timestamp: number; // Unix timestamp
  scrapedAt: string; // ISO date string
  accounts: Account[];
  retailResults: RetailResult[];
  metadata: {
    totalAccounts: number;
    totalRetailClients: number;
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

export interface VantageSnapshotApi {
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

