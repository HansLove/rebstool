import { useMemo } from "react";
import { Building2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { VantageSnapshot, SubIB } from "../../types";

interface SubIBComparisonTableProps {
  currentSnapshot: VantageSnapshot | null;
  snapshots: VantageSnapshot[];
  selectedSubIB: string | null;
  isLoading: boolean;
}

export default function SubIBComparisonTable({
  currentSnapshot,
  snapshots,
  selectedSubIB,
  isLoading,
}: SubIBComparisonTableProps) {
  // Calculate comparison data
  const comparisonData = useMemo(() => {
    if (!currentSnapshot?.subIBs || !snapshots.length) return [];

    const currentSubIBs = selectedSubIB
      ? currentSnapshot.subIBs.filter(sib => sib.ownerName === selectedSubIB)
      : currentSnapshot.subIBs;

    // Get the oldest snapshot for comparison
    const oldestSnapshot = snapshots[0];
    const oldestSubIBs = oldestSnapshot?.subIBs || [];

    return currentSubIBs.map((currentSubIB) => {
      const oldSubIB = oldestSubIBs.find(
        sib => sib.ownerName === currentSubIB.ownerName
      );

      if (!oldSubIB) {
        return {
          ...currentSubIB,
          clientCountChange: currentSubIB.clientCount,
          balanceChange: currentSubIB.totalBalance,
          equityChange: currentSubIB.totalEquity,
          depositsChange: currentSubIB.totalDeposits,
          depositCountChange: currentSubIB.depositCount,
          averageDepositChange: currentSubIB.averageDeposit,
        };
      }

      return {
        ...currentSubIB,
        clientCountChange: currentSubIB.clientCount - oldSubIB.clientCount,
        balanceChange: currentSubIB.totalBalance - oldSubIB.totalBalance,
        equityChange: currentSubIB.totalEquity - oldSubIB.totalEquity,
        depositsChange: currentSubIB.totalDeposits - oldSubIB.totalDeposits,
        depositCountChange: currentSubIB.depositCount - oldSubIB.depositCount,
        averageDepositChange: currentSubIB.averageDeposit - oldSubIB.averageDeposit,
      };
    }).sort((a, b) => b.totalDeposits - a.totalDeposits);
  }, [currentSnapshot, snapshots, selectedSubIB]);

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatNumber = (num: number) => num.toLocaleString('en-US');

  const ChangeIndicator = ({ value }: { value: number }) => {
    if (value > 0) {
      return (
        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
          <TrendingUp className="h-4 w-4" />
          <span className="font-medium">+{formatCurrency(Math.abs(value))}</span>
        </div>
      );
    } else if (value < 0) {
      return (
        <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
          <TrendingDown className="h-4 w-4" />
          <span className="font-medium">{formatCurrency(value)}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
        <Minus className="h-4 w-4" />
        <span>No change</span>
      </div>
    );
  };

  const NumberChangeIndicator = ({ value }: { value: number }) => {
    if (value > 0) {
      return (
        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
          <TrendingUp className="h-4 w-4" />
          <span className="font-medium">+{formatNumber(Math.abs(value))}</span>
        </div>
      );
    } else if (value < 0) {
      return (
        <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
          <TrendingDown className="h-4 w-4" />
          <span className="font-medium">{formatNumber(value)}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
        <Minus className="h-4 w-4" />
        <span>No change</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!comparisonData.length) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <p className="text-center text-gray-500 dark:text-gray-400">
          No Sub-IB data available for comparison
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Sub-IB Performance Comparison
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Sub-IB
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Clients
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Total Balance
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Total Equity
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Total Deposits
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                # Deposits
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Avg Deposit
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((subIB) => (
              <tr
                key={subIB.ownerName}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {subIB.ownerName}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatNumber(subIB.clientCount)}
                    </div>
                    <div className="text-xs">
                      <NumberChangeIndicator value={subIB.clientCountChange} />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(subIB.totalBalance)}
                    </div>
                    <div className="text-xs">
                      <ChangeIndicator value={subIB.balanceChange} />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(subIB.totalEquity)}
                    </div>
                    <div className="text-xs">
                      <ChangeIndicator value={subIB.equityChange} />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(subIB.totalDeposits)}
                    </div>
                    <div className="text-xs">
                      <ChangeIndicator value={subIB.depositsChange} />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatNumber(subIB.depositCount)}
                    </div>
                    <div className="text-xs">
                      <NumberChangeIndicator value={subIB.depositCountChange} />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(subIB.averageDeposit)}
                    </div>
                    <div className="text-xs">
                      <ChangeIndicator value={subIB.averageDepositChange} />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

