/* eslint-disable @typescript-eslint/no-explicit-any */
import { useOutletContext } from "react-router-dom";
import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { MdCenterFocusStrong } from "react-icons/md";
import { TrendingUp, BarChart3, DollarSign } from "lucide-react";

import EarningsReports from "@/components/dashboard/EarningsReports";
import EarningSummary from "./components/EarningSummary";
import { useCommissionAnalyzer } from "@/core/hooks/useCommissionAnalyzer";
import TrackingTables from "@/components/TrackingTables";

// Types
interface CommissionSummary {
  total: number;
  thisMonth: number;
  last7: number;
  thisWeek: number;
}

// Enhanced Commission Trend Chart with Dark Mode Support
const CommissionTrendChart = ({ chartData }: { chartData: any[] }) => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
              Commission Trend
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Track your commission growth over time
            </p>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <XAxis 
            dataKey="date" 
            tick={{ 
              fontSize: 12, 
              fill: isDarkMode ? '#94a3b8' : '#64748b',
              fontFamily: 'Inter, system-ui, sans-serif'
            }} 
            stroke={isDarkMode ? '#475569' : '#e2e8f0'}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tickFormatter={(val) => `$${val.toLocaleString()}`} 
            tick={{ 
              fontSize: 12, 
              fill: isDarkMode ? '#94a3b8' : '#64748b',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
            stroke={isDarkMode ? '#475569' : '#e2e8f0'}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: any) => [`$${value.toLocaleString()}`, 'Commission']}
            labelFormatter={(label) => `Date: ${label}`}
            contentStyle={{
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
              borderRadius: '12px',
              color: isDarkMode ? '#f1f5f9' : '#1e293b',
              boxShadow: isDarkMode 
                ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
                : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
            itemStyle={{
              color: isDarkMode ? '#f1f5f9' : '#1e293b',
              fontSize: '14px',
              fontWeight: '500'
            }}
            labelStyle={{
              color: isDarkMode ? '#f1f5f9' : '#1e293b',
              fontWeight: '600',
              fontSize: '14px',
              marginBottom: '8px',
              borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
              paddingBottom: '8px'
            }}
          />
          <Line
            type="monotone"
            dataKey="commission"
            stroke="url(#commissionGradient)"
            strokeWidth={3}
            dot={{ r: 4, fill: '#3b82f6', stroke: '#1d4ed8', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#1d4ed8', stroke: '#dbeafe', strokeWidth: 2 }}
          />
          <defs>
            <linearGradient id="commissionGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};


// Enhanced Earnings Bar Chart with Dark Mode Support
const EnhancedEarningsChart = ({ registrationsReport }: { registrationsReport: any[] }) => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  // Process data for the chart
  const chartData = useMemo(() => {
    const weeklyData: Record<string, number> = {};
    
    registrationsReport?.forEach((reg: any) => {
      if (!reg.first_deposit_date) return;
      const date = new Date(reg.first_deposit_date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyData[weekKey]) weeklyData[weekKey] = 0;
      weeklyData[weekKey] += reg.first_deposit || 0;
    });
    
    return Object.entries(weeklyData)
      .map(([week, earnings]) => ({
        period: new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        earnings: parseFloat(earnings.toFixed(2)),
        fullDate: week
      }))
      .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime())
      .slice(-12); // Last 12 weeks
  }, [registrationsReport]);

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-xl">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
              Weekly Earnings
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Track your weekly earnings performance
            </p>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <XAxis 
            dataKey="period" 
            tick={{ 
              fontSize: 12, 
              fill: isDarkMode ? '#94a3b8' : '#64748b',
              fontFamily: 'Inter, system-ui, sans-serif'
            }} 
            stroke={isDarkMode ? '#475569' : '#e2e8f0'}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tickFormatter={(val) => `$${val.toLocaleString()}`} 
            tick={{ 
              fontSize: 12, 
              fill: isDarkMode ? '#94a3b8' : '#64748b',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
            stroke={isDarkMode ? '#475569' : '#e2e8f0'}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: any) => [`$${value.toLocaleString()}`, 'Earnings']}
            labelFormatter={(label) => `Week: ${label}`}
            contentStyle={{
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
              borderRadius: '12px',
              color: isDarkMode ? '#f1f5f9' : '#1e293b',
              boxShadow: isDarkMode 
                ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
                : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
            itemStyle={{
              color: isDarkMode ? '#f1f5f9' : '#1e293b',
              fontSize: '14px',
              fontWeight: '500'
            }}
            labelStyle={{
              color: isDarkMode ? '#f1f5f9' : '#1e293b',
              fontWeight: '600',
              fontSize: '14px',
              marginBottom: '8px',
              borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
              paddingBottom: '8px'
            }}
          />
          <Bar 
            dataKey="earnings" 
            fill="url(#earningsGradient)"
            radius={[4, 4, 0, 0]}
          />
          <defs>
            <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};


export default function EarningsTable() {
  const { registrationsReport } = useOutletContext<any>();

  const {
    chartData,
    total,
    thisMonth,
    last7,
    thisWeek,
    handleSort,
    sortBy,
    sortOrder,
  } = useCommissionAnalyzer(registrationsReport);

  const commissionSummary: CommissionSummary = {
    total,
    thisMonth,
    last7,
    thisWeek,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header Section */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  Earnings Report
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg text-sm font-medium">
                    <MdCenterFocusStrong className="w-4 h-4 inline mr-1" />
                    Analytics
                  </span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Track your commission performance and earnings analytics
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Summary Cards */}
          <EarningSummary commissionSummary={commissionSummary} />
          
          {/* Charts Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <CommissionTrendChart chartData={chartData} />
            <EnhancedEarningsChart registrationsReport={registrationsReport} />
          </div>
          
          {/* Data Tables */}
          <div className="space-y-8">
            <EarningsReports
              registrationsReport={registrationsReport}
              sortBy={sortBy}
              sortOrder={sortOrder}
              handleSort={handleSort}
            />
            
            <TrackingTables registrations={registrationsReport} />
          </div>
        </div>
      </div>
    </div>
  );
}