import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";
import type { VantageSnapshot } from "../../types";

interface SubIBPerformanceChartsProps {
  snapshots: VantageSnapshot[];
  selectedSubIB: string | null;
  isLoading: boolean;
}

export default function SubIBPerformanceCharts({
  snapshots,
  selectedSubIB,
  isLoading,
}: SubIBPerformanceChartsProps) {
  // Prepare comparison data for top Sub-IBs (only useful chart - comparison between Sub-IBs)
  const topSubIBsData = useMemo(() => {
    if (!snapshots.length) return [];
    
    const latestSnapshot = snapshots[snapshots.length - 1];
    if (!latestSnapshot?.subIBs) return [];

    const subIBs = selectedSubIB
      ? latestSnapshot.subIBs.filter(sib => sib.ownerName === selectedSubIB)
      : latestSnapshot.subIBs;

    return subIBs
      .sort((a, b) => b.totalDeposits - a.totalDeposits)
      .slice(0, 15) // Show top 15 instead of 10 for better overview
      .map((sib) => ({
        name: sib.ownerName.length > 25 ? sib.ownerName.substring(0, 25) + '...' : sib.ownerName,
        fullName: sib.ownerName,
        clients: sib.clientCount,
        balance: sib.totalBalance,
        equity: sib.totalEquity,
        deposits: sib.totalDeposits,
        depositCount: sib.depositCount,
        averageDeposit: sib.averageDeposit,
      }));
  }, [snapshots, selectedSubIB]);

  const formatCurrency = (value: number) =>
    `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const formatNumber = (value: number) => value.toLocaleString('en-US');

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

  if (!topSubIBsData.length) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <p className="text-center text-gray-500 dark:text-gray-400">
          No Sub-IB data available
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Top Sub-IBs Performance Comparison
        </h3>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={topSubIBsData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            type="number"
            stroke="#6b7280"
            fontSize={12}
            tick={{ fill: '#6b7280' }}
            tickFormatter={formatCurrency}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#6b7280"
            fontSize={12}
            tick={{ fill: '#6b7280' }}
            width={180}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value: number, name: string) => {
              if (name === 'deposits') return formatCurrency(value);
              if (name === 'clients') return formatNumber(value);
              if (name === 'balance') return formatCurrency(value);
              if (name === 'equity') return formatCurrency(value);
              return value;
            }}
            labelFormatter={(label) => `Sub-IB: ${label}`}
          />
          <Legend />
          <Bar dataKey="deposits" fill="#6366f1" name="Total Deposits" />
          <Bar dataKey="clients" fill="#8b5cf6" name="Clients" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

