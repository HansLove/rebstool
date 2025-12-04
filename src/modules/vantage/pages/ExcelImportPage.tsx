import { useState, useCallback } from 'react';
import { useVantageScraper } from '../hooks/useVantageScraper';
import useAuth from '@/core/hooks/useAuth';
import { AlertCircle, CheckCircle2, Loader2, FileSpreadsheet, Users, Building2 } from 'lucide-react';
import ExcelDropZone from '../components/excel/ExcelDropZone';
import { parseExcelToSubIBs } from '../utils/excelParser';
import { excelDataToSnapshot } from '../utils/excelToSnapshot';
import type { SubIB } from '../types';
import { toast } from 'react-hot-toast';

export default function ExcelImportPage() {
  const { getUser } = useAuth();
  const user = getUser();
  const isAdmin = user?.rol === 1;

  const { importFromExcel, isLoading } = useVantageScraper();

  const DEFAULT_SUB_IB_KEY = "vantage_default_subib";
  const [parsedData, setParsedData] = useState<SubIB[] | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [defaultSubIB, setDefaultSubIB] = useState<string>(() => {
    return localStorage.getItem(DEFAULT_SUB_IB_KEY) || 'Kseinja Gorodnicka';
  });

  const handleFileSelect = useCallback(async (file: File) => {
    setParseError(null);
    setIsParsing(true);

    try {
      const subIBs = await parseExcelToSubIBs(file);
      setParsedData(subIBs);
      
      // Auto-select 'Kseinja Gorodnicka' if it exists in the parsed data
      const kseinjaExists = subIBs.some(sib => sib.ownerName === 'Kseinja Gorodnicka');
      if (kseinjaExists && !localStorage.getItem(DEFAULT_SUB_IB_KEY)) {
        setDefaultSubIB('Kseinja Gorodnicka');
      }
      
      toast.success(`Successfully parsed ${subIBs.length} Sub-IB(s) with ${subIBs.reduce((sum, sib) => sum + sib.clientCount, 0)} total clients`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to parse Excel file';
      setParseError(errorMessage);
      setParsedData(null);
      toast.error(errorMessage);
    } finally {
      setIsParsing(false);
    }
  }, []);

  const handleImport = useCallback(async () => {
    if (!parsedData) return;

    setIsImporting(true);
    try {
      const snapshot = excelDataToSnapshot(parsedData);
      await importFromExcel(snapshot);
      toast.success('Excel data imported successfully!');
      
      // Reset state
      setParsedData(null);
      setParseError(null);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to import Excel data';
      toast.error(errorMessage);
    } finally {
      setIsImporting(false);
    }
  }, [parsedData, importFromExcel]);

  const handleClear = useCallback(() => {
    setParsedData(null);
    setParseError(null);
  }, []);

  if (!isAdmin) {
    return (
      <div className="w-full max-w-9xl mx-auto py-8 px-4 lg:px-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            <div>
              <h2 className="text-lg font-semibold text-red-900 dark:text-red-100">
                Access Denied
              </h2>
              <p className="text-red-700 dark:text-red-300">
                This feature is only available for administrators.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalClients = parsedData?.reduce((sum, sib) => sum + sib.clientCount, 0) || 0;
  const totalBalance = parsedData?.reduce((sum, sib) => sum + sib.totalBalance, 0) || 0;

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 lg:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Import Excel Data
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload your <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">ib-accounts.xlsx</code> file to import Sub-IB data
        </p>
      </div>

      {/* File Drop Zone */}
      <div className="mb-6">
        <ExcelDropZone
          onFileSelect={handleFileSelect}
          onError={(error) => {
            setParseError(error);
            toast.error(error);
          }}
        />
      </div>

      {/* Parsing Status */}
      {isParsing && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <Loader2 className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin" />
          <p className="text-blue-900 dark:text-blue-100">Parsing Excel file...</p>
        </div>
      )}

      {/* Parse Error */}
      {parseError && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
          <div>
            <p className="font-medium text-red-900 dark:text-red-100">Parse Error</p>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">{parseError}</p>
          </div>
        </div>
      )}

      {/* Preview Data */}
      {parsedData && parsedData.length > 0 && (
        <div className="mb-6 space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sub-IBs</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {parsedData.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Clients</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {totalClients.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Balance</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-IBs Table Preview */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Sub-IBs Preview
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Owner Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Clients
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total Equity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total Deposits
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {parsedData.slice(0, 10).map((subIB, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {subIB.ownerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {subIB.clientCount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        ${subIB.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        ${subIB.totalEquity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        ${subIB.totalDeposits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsedData.length > 10 && (
              <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-400 text-center">
                Showing first 10 of {parsedData.length} Sub-IBs
              </div>
            )}
          </div>

          {/* Default Sub-IB Selection */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Sub-IB (will be auto-selected in Dashboard)
            </label>
            <select
              value={defaultSubIB}
              onChange={(e) => setDefaultSubIB(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">None (no default)</option>
              {parsedData.map((subIB) => (
                <option key={subIB.ownerName} value={subIB.ownerName}>
                  {subIB.ownerName} ({subIB.clientCount} clients)
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              This Sub-IB will be automatically selected when you navigate to the Dashboard
            </p>
          </div>

          {/* Default Sub-IB Selection */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Sub-IB (will be auto-selected in Dashboard)
            </label>
            <select
              value={defaultSubIB}
              onChange={(e) => setDefaultSubIB(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">None (no default)</option>
              {parsedData.map((subIB) => (
                <option key={subIB.ownerName} value={subIB.ownerName}>
                  {subIB.ownerName} ({subIB.clientCount} clients)
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              This Sub-IB will be automatically selected when you navigate to the Dashboard
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={handleClear}
              disabled={isImporting}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleImport}
              disabled={isImporting || isLoading}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Import Data
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

