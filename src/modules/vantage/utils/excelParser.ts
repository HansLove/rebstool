/**
 * Excel Parser Utility
 * Parses Excel files and converts them to SubIB structure
 */

import * as XLSX from 'xlsx';
import type { SubIB, RetailClient } from '../types';

/**
 * Column mapping configuration - matches exact Excel headers
 * Headers from ib-accounts.xlsx:
 * Date, User ID, Account, Name, Account owner, Campaign source, Account Type, Platform, 
 * Base Currency, Balance, Account Equity, Credit, Account Journey, Last Trade Time, 
 * Last Traded Instrument, Last Traded Lots, Last Deposit Time, Last Deposit Amount
 */
const COLUMN_MAPPINGS = {
  ownerName: ['Account owner', 'ownerName', 'owner name', 'owner', 'sub-ib', 'subib', 'sub ib', 'sub_ib', 'sub-ib name'],
  userId: ['User ID', 'userId', 'user id', 'userid', 'user_id', 'id'],
  name: ['Name', 'name', 'client name', 'clientname', 'full name', 'fullname'],
  accountNumber: ['Account', 'accountNumber', 'account number', 'accountnumber', 'account_number', 'accountnmber'],
  accountBalance: ['Balance', 'accountBalance', 'account balance', 'accountbalance', 'account_balance'],
  equity: ['Account Equity', 'equity', 'equity balance'],
  credit: ['Credit', 'credit', 'credit amount'],
  email: ['email', 'e-mail', 'email address'],
  phone: ['phone', 'phone number', 'phonenumber', 'telephone', 'tel'],
  platform: ['Platform', 'platform', 'mt platform', 'mtplatform'],
  accountType: ['Account Type', 'accountType', 'account type', 'accounttype', 'type'],
  baseCurrency: ['Base Currency', 'baseCurrency', 'base currency', 'basecurrency', 'currency'],
  registerDate: ['Date', 'registerDate', 'register date', 'registerdate', 'registration date', 'reg date'],
  firstDepositDate: ['firstDepositDate', 'first deposit date', 'firstdepositdate', 'first deposit'],
  totalDeposits: ['totalDeposits', 'total deposits', 'totaldeposits', 'deposits', 'total_deposits'],
  depositCount: ['depositCount', 'deposit count', 'depositcount', 'deposits count'],
  lastDepositTime: ['Last Deposit Time', 'lastDepositTime', 'last deposit time', 'lastdeposittime', 'last deposit'],
  lastDepositAmount: ['Last Deposit Amount', 'lastDepositAmount', 'last deposit amount', 'lastdepositamount'],
  lastDepositCurrency: ['lastDepositCurrency', 'last deposit currency', 'lastdepositcurrency'],
  poiStatus: ['poiStatus', 'poi status', 'poistatus', 'poi'],
  poaStatus: ['poaStatus', 'poa status', 'poastatus', 'poa'],
  fundingStatus: ['fundingStatus', 'funding status', 'fundingstatus'],
  archiveStatus: ['archiveStatus', 'archive status', 'archivestatus'],
  accountJourney: ['Account Journey', 'accountJourney', 'account journey', 'accountjourney'],
  lastTradeTime: ['Last Trade Time', 'lastTradeTime', 'last trade time', 'lasttradetime', 'last trade'],
  lastTradeSymbol: ['Last Traded Instrument', 'lastTradeSymbol', 'last trade symbol', 'lasttradesymbol'],
  lastTradeVolume: ['Last Traded Lots', 'lastTradeVolume', 'last trade volume', 'lasttradevolume'],
};

/**
 * Normalizes column name for matching
 */
function normalizeColumnName(name: string): string {
  return name.toLowerCase().trim().replace(/[\s_-]+/g, '');
}

/**
 * Finds column index by flexible name matching
 */
function findColumnIndex(headers: string[], possibleNames: string[]): number | null {
  const normalizedHeaders = headers.map(normalizeColumnName);
  for (const possibleName of possibleNames) {
    const normalized = normalizeColumnName(possibleName);
    const index = normalizedHeaders.indexOf(normalized);
    if (index !== -1) {
      return index;
    }
  }
  return null;
}

/**
 * Parses a value to number, handling various formats
 * Handles formats like "70(EUR)", "$1,234.56", etc.
 */
function parseNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // Handle format like "70(EUR)" - extract number before parenthesis
    const match = value.match(/^([\d.,]+)/);
    if (match) {
      const cleaned = match[1].replace(/[,]/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    // Remove currency symbols, commas, spaces
    const cleaned = value.replace(/[$,\s()]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

/**
 * Extracts currency from a value like "70(EUR)" or returns null
 */
function extractCurrency(value: unknown): string | null {
  if (typeof value === 'string') {
    const match = value.match(/\(([A-Z]{3})\)/);
    if (match) {
      return match[1];
    }
  }
  return null;
}

/**
 * Parses a date value to Unix timestamp
 */
function parseDate(value: unknown): number | null {
  if (!value) return null;
  if (typeof value === 'number') {
    // Excel date serial number
    if (value > 25569) {
      // Excel epoch (1900-01-01) to Unix epoch (1970-01-01)
      return Math.round((value - 25569) * 86400 * 1000);
    }
    return value;
  }
  if (typeof value === 'string') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date.getTime();
  }
  return null;
}

/**
 * Parses Excel file and converts to SubIB array
 */
export async function parseExcelToSubIBs(file: File): Promise<SubIB[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error('No data read from file'));
          return;
        }

        // Parse Excel file
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          reject(new Error('Excel file has no sheets'));
          return;
        }

        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          defval: null,
          raw: false 
        }) as unknown[][];

        if (jsonData.length < 2) {
          reject(new Error('Excel file must have at least a header row and one data row'));
          return;
        }

        // First row is headers
        const headers = jsonData[0].map((h: unknown) => String(h || '').trim());
        
        // Find column indices
        const columnIndices = {
          ownerName: findColumnIndex(headers, COLUMN_MAPPINGS.ownerName),
          userId: findColumnIndex(headers, COLUMN_MAPPINGS.userId),
          name: findColumnIndex(headers, COLUMN_MAPPINGS.name),
          accountNumber: findColumnIndex(headers, COLUMN_MAPPINGS.accountNumber),
          accountBalance: findColumnIndex(headers, COLUMN_MAPPINGS.accountBalance),
          equity: findColumnIndex(headers, COLUMN_MAPPINGS.equity),
          credit: findColumnIndex(headers, COLUMN_MAPPINGS.credit),
          email: findColumnIndex(headers, COLUMN_MAPPINGS.email),
          phone: findColumnIndex(headers, COLUMN_MAPPINGS.phone),
          platform: findColumnIndex(headers, COLUMN_MAPPINGS.platform),
          accountType: findColumnIndex(headers, COLUMN_MAPPINGS.accountType),
          baseCurrency: findColumnIndex(headers, COLUMN_MAPPINGS.baseCurrency),
          registerDate: findColumnIndex(headers, COLUMN_MAPPINGS.registerDate),
          firstDepositDate: findColumnIndex(headers, COLUMN_MAPPINGS.firstDepositDate),
          totalDeposits: findColumnIndex(headers, COLUMN_MAPPINGS.totalDeposits),
          depositCount: findColumnIndex(headers, COLUMN_MAPPINGS.depositCount),
          lastDepositTime: findColumnIndex(headers, COLUMN_MAPPINGS.lastDepositTime),
          lastDepositAmount: findColumnIndex(headers, COLUMN_MAPPINGS.lastDepositAmount),
          lastDepositCurrency: findColumnIndex(headers, COLUMN_MAPPINGS.lastDepositCurrency),
          poiStatus: findColumnIndex(headers, COLUMN_MAPPINGS.poiStatus),
          poaStatus: findColumnIndex(headers, COLUMN_MAPPINGS.poaStatus),
          fundingStatus: findColumnIndex(headers, COLUMN_MAPPINGS.fundingStatus),
          archiveStatus: findColumnIndex(headers, COLUMN_MAPPINGS.archiveStatus),
          accountJourney: findColumnIndex(headers, COLUMN_MAPPINGS.accountJourney),
          lastTradeTime: findColumnIndex(headers, COLUMN_MAPPINGS.lastTradeTime),
          lastTradeSymbol: findColumnIndex(headers, COLUMN_MAPPINGS.lastTradeSymbol),
          lastTradeVolume: findColumnIndex(headers, COLUMN_MAPPINGS.lastTradeVolume),
        };

        // Validate required columns
        if (columnIndices.ownerName === null) {
          reject(new Error('Required column "ownerName" (or similar) not found in Excel file'));
          return;
        }

        if (columnIndices.userId === null && columnIndices.accountNumber === null) {
          reject(new Error('Required column "userId" or "accountNumber" not found in Excel file'));
          return;
        }

        // Parse rows (skip header row)
        const clients: RetailClient[] = [];
        const rows = jsonData.slice(1);

        for (const row of rows) {
          // Skip empty rows
          if (!row || row.length === 0 || row.every((cell: unknown) => !cell || String(cell).trim() === '')) {
            continue;
          }

          const ownerName = columnIndices.ownerName !== null 
            ? String(row[columnIndices.ownerName] || '').trim() 
            : 'Unknown';
          
          if (!ownerName || ownerName === '') {
            continue; // Skip rows without owner name
          }

          const userId = columnIndices.userId !== null 
            ? parseNumber(row[columnIndices.userId]) 
            : (columnIndices.accountNumber !== null ? parseNumber(row[columnIndices.accountNumber]) : 0);

          const accountNumber = columnIndices.accountNumber !== null 
            ? parseNumber(row[columnIndices.accountNumber]) 
            : userId;

          const accountBalance = columnIndices.accountBalance !== null 
            ? parseNumber(row[columnIndices.accountBalance]) 
            : 0;

          const equity = columnIndices.equity !== null 
            ? parseNumber(row[columnIndices.equity]) 
            : accountBalance; // Fallback to balance if equity not available

          const credit = columnIndices.credit !== null 
            ? parseNumber(row[columnIndices.credit]) 
            : 0;

          // Build client object
          const client: RetailClient = {
            registerDate: columnIndices.registerDate !== null 
              ? (parseDate(row[columnIndices.registerDate]) || Date.now())
              : Date.now(),
            firstDepositDate: columnIndices.firstDepositDate !== null 
              ? parseDate(row[columnIndices.firstDepositDate])
              : null,
            name: columnIndices.name !== null 
              ? String(row[columnIndices.name] || '').trim() 
              : `User ${userId}`,
            accountNmber: accountNumber,
            email: columnIndices.email !== null 
              ? (row[columnIndices.email] ? String(row[columnIndices.email]).trim() : null)
              : null,
            platform: columnIndices.platform !== null 
              ? (() => {
                  const platformValue = row[columnIndices.platform];
                  if (typeof platformValue === 'number') return platformValue;
                  if (typeof platformValue === 'string') {
                    // Map platform strings to numbers if needed
                    const platformStr = platformValue.toLowerCase().trim();
                    if (platformStr.includes('mt4') || platformStr === 'mt4') return 0;
                    if (platformStr.includes('mt5') || platformStr === 'mt5') return 1;
                    return parseNumber(platformValue);
                  }
                  return 0;
                })()
              : 0,
            accountType: columnIndices.accountType !== null 
              ? (() => {
                  const accountTypeValue = row[columnIndices.accountType];
                  if (typeof accountTypeValue === 'number') return accountTypeValue;
                  if (typeof accountTypeValue === 'string') {
                    // Map account type strings to numbers if needed
                    const typeStr = accountTypeValue.toLowerCase().trim();
                    // Common account types mapping (adjust as needed)
                    if (typeStr.includes('raw') || typeStr.includes('ecn')) return 0;
                    if (typeStr.includes('standard')) return 1;
                    if (typeStr.includes('cent')) return 2;
                    return parseNumber(accountTypeValue);
                  }
                  return 0;
                })()
              : 0,
            baseCurrency: columnIndices.baseCurrency !== null 
              ? String(row[columnIndices.baseCurrency] || 'USD').trim().toUpperCase()
              : 'USD',
            accountBalance,
            userId,
            equity,
            credit,
            phone: columnIndices.phone !== null 
              ? String(row[columnIndices.phone] || '').trim() 
              : '',
            poiStatus: columnIndices.poiStatus !== null 
              ? (row[columnIndices.poiStatus] !== null ? parseNumber(row[columnIndices.poiStatus]) : null)
              : null,
            poaStatus: columnIndices.poaStatus !== null 
              ? (row[columnIndices.poaStatus] !== null ? parseNumber(row[columnIndices.poaStatus]) : null)
              : null,
            fundingStatus: columnIndices.fundingStatus !== null 
              ? parseNumber(row[columnIndices.fundingStatus]) 
              : 0,
            archiveStatus: columnIndices.archiveStatus !== null 
              ? parseNumber(row[columnIndices.archiveStatus]) 
              : 0,
            accountJourney: columnIndices.accountJourney !== null 
              ? parseNumber(row[columnIndices.accountJourney]) 
              : 0,
            lastTradeTime: columnIndices.lastTradeTime !== null 
              ? parseDate(row[columnIndices.lastTradeTime])
              : null,
            lastTradeSymbol: columnIndices.lastTradeSymbol !== null 
              ? (row[columnIndices.lastTradeSymbol] ? String(row[columnIndices.lastTradeSymbol]).trim() : null)
              : null,
            lastTradeVolume: columnIndices.lastTradeVolume !== null 
              ? (row[columnIndices.lastTradeVolume] !== null ? parseNumber(row[columnIndices.lastTradeVolume]) : null)
              : null,
            lastDepositTime: columnIndices.lastDepositTime !== null 
              ? parseDate(row[columnIndices.lastDepositTime])
              : null,
            lastDepositAmount: columnIndices.lastDepositAmount !== null 
              ? (row[columnIndices.lastDepositAmount] !== null ? parseNumber(row[columnIndices.lastDepositAmount]) : null)
              : null,
            lastDepositCurrency: columnIndices.lastDepositAmount !== null && row[columnIndices.lastDepositAmount]
              ? (extractCurrency(row[columnIndices.lastDepositAmount]) || 
                 (columnIndices.lastDepositCurrency !== null 
                   ? (row[columnIndices.lastDepositCurrency] ? String(row[columnIndices.lastDepositCurrency]).trim().toUpperCase() : null)
                   : null))
              : (columnIndices.lastDepositCurrency !== null 
                  ? (row[columnIndices.lastDepositCurrency] ? String(row[columnIndices.lastDepositCurrency]).trim().toUpperCase() : null)
                  : null),
            ownerName,
          };

          clients.push(client);
        }

        if (clients.length === 0) {
          reject(new Error('No valid client data found in Excel file'));
          return;
        }

        // Group clients by ownerName and calculate Sub-IB metrics
        const subIBsMap = new Map<string, RetailClient[]>();
        clients.forEach(client => {
          if (!subIBsMap.has(client.ownerName)) {
            subIBsMap.set(client.ownerName, []);
          }
          subIBsMap.get(client.ownerName)!.push(client);
        });

        // Convert to SubIB array
        const subIBs: SubIB[] = Array.from(subIBsMap.entries()).map(([ownerName, ownerClients]) => {
          const totalBalance = ownerClients.reduce((sum, c) => sum + c.accountBalance, 0);
          const totalEquity = ownerClients.reduce((sum, c) => sum + c.equity, 0);
          
          // Calculate deposits from clients
          const deposits = ownerClients
            .filter(c => c.lastDepositAmount !== null && c.lastDepositAmount > 0)
            .map(c => c.lastDepositAmount!);
          const totalDeposits = deposits.reduce((sum, d) => sum + d, 0);
          const depositCount = deposits.length;

          // Calculate averages
          const clientCount = ownerClients.length;
          const averageBalance = clientCount > 0 ? totalBalance / clientCount : 0;
          const averageEquity = clientCount > 0 ? totalEquity / clientCount : 0;
          const averageDeposit = depositCount > 0 ? totalDeposits / depositCount : 0;

          return {
            ownerName,
            clientCount,
            totalBalance,
            totalEquity,
            totalDeposits,
            depositCount,
            averageBalance,
            averageEquity,
            averageDeposit,
            clients: ownerClients,
          };
        });

        resolve(subIBs);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        reject(new Error(`Error parsing Excel file: ${errorMessage}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsBinaryString(file);
  });
}

