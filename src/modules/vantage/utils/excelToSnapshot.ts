/**
 * Excel to Snapshot Transformer
 * Converts parsed Excel data to VantageSnapshot format
 */

import type { VantageSnapshot, SubIB, Account, RetailClient, RetailResult } from '../types';

/**
 * Converts Excel data to VantageSnapshot format
 * @param excelData Array of SubIBs parsed from Excel
 * @param accounts Optional accounts array (if available from Excel)
 * @returns VantageSnapshot compatible with the rest of the system
 */
export function excelDataToSnapshot(
  excelData: SubIB[],
  accounts: Account[] = []
): VantageSnapshot {
  const timestamp = Date.now();
  const snapshotId = `excel_${timestamp}`;

  // Extract all clients from Sub-IBs
  const allClients: RetailClient[] = [];
  excelData.forEach(subIB => {
    if (subIB.clients && subIB.clients.length > 0) {
      allClients.push(...subIB.clients);
    }
  });

  // Build retailResults from subIBs for backward compatibility
  const retailResults: RetailResult[] = excelData.map((subIB) => ({
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
  const totalAccounts = accounts.length;
  const totalRetailClients = allClients.length;

  // Group accounts by userId
  const accountsByUserId = new Map<number, Account[]>();
  accounts.forEach((account) => {
    if (!accountsByUserId.has(account.userId)) {
      accountsByUserId.set(account.userId, []);
    }
    accountsByUserId.get(account.userId)!.push(account);
  });

  // Group retail clients by ownerName
  const clientsByOwner = new Map<string, RetailClient[]>();
  excelData.forEach((subIB) => {
    if (subIB.clients && subIB.clients.length > 0) {
      clientsByOwner.set(subIB.ownerName, subIB.clients);
    }
  });

  return {
    id: snapshotId,
    timestamp,
    scrapedAt: new Date(timestamp).toISOString(),
    accounts,
    retailResults,
    subIBs: excelData,
    allClients: allClients.length > 0 ? allClients : undefined,
    metadata: {
      totalAccounts,
      totalRetailClients,
      accountsByUserId,
      clientsByOwner,
    },
  };
}

