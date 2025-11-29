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
  poiStatus: number;
  poaStatus: number;
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
    errmsg: string | null;
    data: RetailClient[];
  };
}

export interface VantageApiResponse {
  success: boolean;
  message: string;
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

