import { useState, useMemo } from 'react';
import { Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import type { SubIB, VantageSnapshot } from '../../types';

interface SubIBsPanelProps {
  currentSnapshot: VantageSnapshot | null;
  previousSnapshot: VantageSnapshot | null;
  onSubIBClick?: (subIB: SubIB) => void;
}

type SortField = 'clients' | 'balance' | 'deposits' | 'equity';
type SortDirection = 'asc' | 'desc';

export default function SubIBsPanel({
  currentSnapshot,
  previousSnapshot,
  onSubIBClick,
}: SubIBsPanelProps) {
  const [sortField, setSortField] = useState<SortField>('clients');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedSubIB, setSelectedSubIB] = useState<SubIB | null>(null);

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Get Sub-IBs from current snapshot
  const subIBs = useMemo(() => {
    if (!currentSnapshot?.subIBs) return [];
    return currentSnapshot.subIBs;
  }, [currentSnapshot]);

  // Calculate changes from previous snapshot
  const subIBsWithChanges = useMemo(() => {
    if (!previousSnapshot?.subIBs) {
      return subIBs.map((subIB) => ({
        ...subIB,
        clientCountChange: 0,
        balanceChange: 0,
        depositsChange: 0,
        equityChange: 0,
      }));
    }

    const previousMap = new Map<string, SubIB>();
    previousSnapshot.subIBs.forEach((subIB) => {
      previousMap.set(subIB.ownerName, subIB);
    });

    return subIBs.map((subIB) => {
      const previous = previousMap.get(subIB.ownerName);
      return {
        ...subIB,
        clientCountChange: previous ? subIB.clientCount - previous.clientCount : subIB.clientCount,
        balanceChange: previous ? subIB.totalBalance - previous.totalBalance : subIB.totalBalance,
        depositsChange: previous ? subIB.totalDeposits - previous.totalDeposits : subIB.totalDeposits,
        equityChange: previous ? subIB.totalEquity - previous.totalEquity : subIB.totalEquity,
      };
    });
  }, [subIBs, previousSnapshot]);

  // Sort Sub-IBs
  const sortedSubIBs = useMemo(() => {
    const sorted = [...subIBsWithChanges];
    sorted.sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortField) {
        case 'clients':
          aValue = a.clientCount;
          bValue = b.clientCount;
          break;
        case 'balance':
          aValue = a.totalBalance;
          bValue = b.totalBalance;
          break;
        case 'deposits':
          aValue = a.totalDeposits;
          bValue = b.totalDeposits;
          break;
        case 'equity':
          aValue = a.totalEquity;
          bValue = b.totalEquity;
          break;
        default:
          return 0;
      }

      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return sorted;
  }, [subIBsWithChanges, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <TrendingUp className="h-3 w-3 ml-1" />
    ) : (
      <TrendingDown className="h-3 w-3 ml-1" />
    );
  };

  if (!currentSnapshot || subIBs.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <p className="text-center text-gray-500 dark:text-gray-400">No Sub-IBs data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Users className="h-5 w-5" />
          Sub-IBs Analysis ({subIBs.length})
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Click on a Sub-IB to view detailed information
        </p>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-4 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => handleSort('clients')}
          className={`flex items-center text-xs font-medium transition-colors ${
            sortField === 'clients'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Clients
          <SortIcon field="clients" />
        </button>
        <button
          onClick={() => handleSort('balance')}
          className={`flex items-center text-xs font-medium transition-colors ${
            sortField === 'balance'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Balance
          <SortIcon field="balance" />
        </button>
        <button
          onClick={() => handleSort('deposits')}
          className={`flex items-center text-xs font-medium transition-colors ${
            sortField === 'deposits'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Deposits
          <SortIcon field="deposits" />
        </button>
        <button
          onClick={() => handleSort('equity')}
          className={`flex items-center text-xs font-medium transition-colors ${
            sortField === 'equity'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Equity
          <SortIcon field="equity" />
        </button>
      </div>

      {/* Sub-IBs List */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {sortedSubIBs.map((subIB) => (
          <div
            key={subIB.ownerName}
            onClick={() => {
              setSelectedSubIB(subIB);
              onSubIBClick?.(subIB);
            }}
            className={`p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
              selectedSubIB?.ownerName === subIB.ownerName
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {subIB.ownerName}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-xs">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Clients:</span>{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {subIB.clientCount.toLocaleString()}
                    </span>
                    {subIB.clientCountChange !== 0 && (
                      <span
                        className={`ml-1 ${
                          subIB.clientCountChange > 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        ({subIB.clientCountChange > 0 ? '+' : ''}
                        {subIB.clientCountChange})
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Balance:</span>{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(subIB.totalBalance)}
                    </span>
                    {subIB.balanceChange !== 0 && (
                      <span
                        className={`ml-1 text-xs ${
                          subIB.balanceChange > 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        ({subIB.balanceChange > 0 ? '+' : ''}
                        {formatCurrency(subIB.balanceChange)})
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Deposits:</span>{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(subIB.totalDeposits)}
                    </span>
                    {subIB.depositsChange !== 0 && (
                      <span
                        className={`ml-1 text-xs ${
                          subIB.depositsChange > 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        ({subIB.depositsChange > 0 ? '+' : ''}
                        {formatCurrency(subIB.depositsChange)})
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Avg Deposit:</span>{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(subIB.averageDeposit)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="ml-4 shrink-0">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Sub-IB Detail Panel */}
      {selectedSubIB && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Details: {selectedSubIB.ownerName}
            </h4>
            <button
              onClick={() => setSelectedSubIB(null)}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Total Clients:</span>
              <p className="font-semibold text-gray-900 dark:text-white">
                {selectedSubIB.clientCount.toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Total Balance:</span>
              <p className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(selectedSubIB.totalBalance)}
              </p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Total Equity:</span>
              <p className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(selectedSubIB.totalEquity)}
              </p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Total Deposits:</span>
              <p className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(selectedSubIB.totalDeposits)}
              </p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Deposit Count:</span>
              <p className="font-semibold text-gray-900 dark:text-white">
                {selectedSubIB.depositCount.toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Average Balance:</span>
              <p className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(selectedSubIB.averageBalance)}
              </p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Average Equity:</span>
              <p className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(selectedSubIB.averageEquity)}
              </p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Average Deposit:</span>
              <p className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(selectedSubIB.averageDeposit)}
              </p>
            </div>
          </div>
          {selectedSubIB.clients && selectedSubIB.clients.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Clients: {selectedSubIB.clients.length}
              </p>
              <div className="max-h-[200px] overflow-y-auto">
                <div className="space-y-1">
                  {selectedSubIB.clients.slice(0, 10).map((client) => (
                    <div
                      key={client.userId}
                      className="text-xs p-1 bg-white dark:bg-gray-900 rounded"
                    >
                      {client.name} - {formatCurrency(client.accountBalance)}
                    </div>
                  ))}
                  {selectedSubIB.clients.length > 10 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ... and {selectedSubIB.clients.length - 10} more clients
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

