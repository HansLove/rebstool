import { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { TrendingUp, Users, DollarSign, BarChart3 } from "lucide-react";
import type { VantageSnapshot, SubIB } from "../../types";

interface SubIBPerformanceChartsProps {
  snapshots: VantageSnapshot[];
  selectedSubIB: string | null;
  timeRange: '7d' | '30d' | '90d';
  isLoading: boolean;
}

export default function SubIBPerformanceCharts({
  snapshots,
  selectedSubIB,
  timeRange,
  isLoading,
}: SubIBPerformanceChartsProps) {
  // Prepare chart data from snapshots
  const chartData = useMemo(() => {
    if (!snapshots.length) return [];

    return snapshots
      .map((snapshot) => {
        const subIBs = snapshot.subIBs || [];
        
        // Filter by selected Sub-IB if specified
        const relevantSubIBs = selectedSubIB
          ? subIBs.filter(sib => sib.ownerName === selectedSubIB)
          : subIBs;

        // Aggregate metrics
        const totalClients = relevantSubIBs.reduce((sum, sib) => sum + sib.clientCount, 0);
        const totalBalance = relevantSubIBs.reduce((sum, sib) => sum + sib.totalBalance, 0);
        const totalEquity = relevantSubIBs.reduce((sum, sib) => sum + sib.totalEquity, 0);
        const totalDeposits = relevantSubIBs.reduce((sum, sib) => sum + sib.totalDeposits, 0);
        const totalDepositCount = relevantSubIBs.reduce((sum, sib) => sum + sib.depositCount, 0);

        return {
          date: new Date(snapshot.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          timestamp: snapshot.timestamp,
          clients: totalClients,
          balance: totalBalance,
          equity: totalEquity,
          deposits: totalDeposits,
          depositCount: totalDepositCount,
          averageDeposit: totalDepositCount > 0 ? totalDeposits / totalDepositCount : 0,
        };
      })
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [snapshots, selectedSubIB]);

  // Prepare comparison data for top Sub-IBs
  const topSubIBsData = useMemo(() => {
    if (!snapshots.length) return [];
    
    const latestSnapshot = snapshots[snapshots.length - 1];
    if (!latestSnapshot?.subIBs) return [];

    const subIBs = selectedSubIB
      ? latestSnapshot.subIBs.filter(sib => sib.ownerName === selectedSubIB)
      : latestSnapshot.subIBs;

    return subIBs
      .sort((a, b) => b.totalDeposits - a.totalDeposits)
      .slice(0, 10)
      .map((sib) => ({
        name: sib.ownerName.length > 20 ? sib.ownerName.substring(0, 20) + '...' : sib.ownerName,
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

  if (!chartData.length) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <p className="text-center text-gray-500 dark:text-gray-400">
          No data available for the selected time range
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Series Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clients Over Time */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Clients Over Time ({timeRange})
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
                tickFormatter={formatNumber}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => formatNumber(value)}
              />
              <Area
                type="monotone"
                dataKey="clients"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                name="Clients"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Deposits Over Time */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Total Deposits Over Time ({timeRange})
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
                tickFormatter={formatCurrency}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="deposits"
                stroke="#10b981"
                strokeWidth={2}
                name="Total Deposits"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Balance and Equity Over Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Balance & Equity Over Time ({timeRange})
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
                tickFormatter={formatCurrency}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Total Balance"
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="equity"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Total Equity"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Average Deposit Over Time */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Average Deposit Over Time ({timeRange})
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
                tickFormatter={formatCurrency}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Bar dataKey="averageDeposit" fill="#f97316" name="Avg Deposit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Sub-IBs Comparison */}
      {topSubIBsData.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Sub-IBs by Total Deposits (Latest Snapshot)
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
                width={150}
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
      )}
    </div>
  );
}

