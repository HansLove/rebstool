/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  AlertTriangle,
  BarChart3,
  Filter,
  Info
} from "lucide-react";
import { MdCenterFocusStrong } from "react-icons/md";

import WithdrawalsTable from "./components/WithdrawalsTable";
import { splitDecimals } from "@/core/utils/splitDecimals";
import { COMMISION_BASE } from "@/core/utils/GlobalVars";

// Types
interface WithdrawalMetrics {
  totalUsers: number;
  totalNetDeposits: number;
  totalWithdrawals: number;
  validTriggers: number;
  potentialCommission: number;
  withdrawalRate: number;
  averageWithdrawal: number;
  roiImpact: number;
  riskUsers: number;
  retentionRate: number;
}

interface FilterState {
  operator: ">=" | "<=";
  value: number;
}

  // Filter helper function
  const applyFilter = (field: number, filter: FilterState): boolean => {
    if (filter.operator === ">=") return field >= filter.value;
    if (filter.operator === "<=") return field <= filter.value;
    return true;
  };


// Extracted Performance Metrics Component
const PerformanceMetrics = ({ metrics }: { metrics: WithdrawalMetrics }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
    {/* Total Users */}
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700 p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
          <Users className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-medium text-blue-600 dark:text-blue-300 uppercase tracking-wide">
            Total Users
          </p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-200">
            {metrics.totalUsers}
          </p>
        </div>
      </div>
    </div>

    {/* Valid Triggers */}
    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700 p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
          <TrendingUp className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-medium text-green-600 dark:text-green-300 uppercase tracking-wide">
            Valid Triggers
          </p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-200">
            {metrics.validTriggers}
          </p>
        </div>
      </div>
    </div>

    {/* Potential Commission */}
    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl border border-yellow-200 dark:border-yellow-700 p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
          <DollarSign className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-medium text-yellow-600 dark:text-yellow-300 uppercase tracking-wide">
            Potential Commission
          </p>
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-200">
            ${splitDecimals(metrics.potentialCommission.toFixed(0))}
          </p>
        </div>
      </div>
    </div>

    {/* Withdrawal Rate */}
    <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl border border-red-200 dark:border-red-700 p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
          <TrendingDown className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-medium text-red-600 dark:text-red-300 uppercase tracking-wide">
            Withdrawal Rate
          </p>
          <p className="text-2xl font-bold text-red-700 dark:text-red-200">
            {metrics.withdrawalRate.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>

    {/* ROI Impact */}
    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-700 p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-medium text-purple-600 dark:text-purple-300 uppercase tracking-wide">
            ROI Impact
          </p>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-200">
            {metrics.roiImpact > 0 ? '+' : ''}{metrics.roiImpact.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Extracted Risk Analysis Component
const RiskAnalysis = ({ metrics }: { metrics: WithdrawalMetrics }) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-6">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
      <AlertTriangle className="w-5 h-5 text-orange-500" />
      Risk Analysis & ROI Impact
    </h3>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Risk Assessment */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700 dark:text-gray-300">Risk Assessment</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">High Risk Users:</span>
            <span className="font-medium text-red-600">{metrics.riskUsers}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Retention Rate:</span>
            <span className="font-medium text-green-600">{metrics.retentionRate.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Financial Impact */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700 dark:text-gray-300">Financial Impact</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Total Deposits:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              ${splitDecimals(metrics.totalNetDeposits.toFixed(2))}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Total Withdrawals:</span>
            <span className="font-medium text-red-600">
              ${splitDecimals(metrics.totalWithdrawals.toFixed(2))}
            </span>
          </div>
        </div>
      </div>

      {/* Commission Analysis */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700 dark:text-gray-300">Commission Analysis</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Valid Triggers:</span>
            <span className="font-medium text-green-600">{metrics.validTriggers}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Potential Earnings:</span>
            <span className="font-medium text-green-600">
              ${splitDecimals(metrics.potentialCommission.toFixed(0))}
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Warning Message */}
    {metrics.withdrawalRate > 50 && (
      <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-medium">
            High withdrawal rate detected! This significantly impacts your ROI and commission potential.
          </span>
        </div>
      </div>
    )}
  </div>
);

// Extracted Filters Component
const WithdrawalFilters = ({ 
  netDepositFilter, 
  withdrawalFilter, 
  onNetDepositChange, 
  onWithdrawalChange 
}: {
  netDepositFilter: FilterState;
  withdrawalFilter: FilterState;
  onNetDepositChange: (filter: FilterState) => void;
  onWithdrawalChange: (filter: FilterState) => void;
}) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 mb-6">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
      <Filter className="w-5 h-5 text-gray-500" />
      Advanced Filters
    </h3>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Withdrawal Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Withdrawal Amount
        </label>
        <div className="flex items-center gap-2">
          <select
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={withdrawalFilter.operator}
            onChange={(e) => onWithdrawalChange({
              ...withdrawalFilter,
              operator: e.target.value as ">=" | "<="
            })}
          >
            <option value=">=">≥ (Greater than or equal)</option>
            <option value="<=">≤ (Less than or equal)</option>
          </select>
          <input
            type="number"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Amount"
            value={withdrawalFilter.value || ""}
            onChange={(e) => onWithdrawalChange({
              ...withdrawalFilter,
              value: Number(e.target.value) || 0
            })}
          />
        </div>
      </div>

      {/* Net Deposit Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Net Deposit Amount
        </label>
        <div className="flex items-center gap-2">
          <select
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={netDepositFilter.operator}
            onChange={(e) => onNetDepositChange({
              ...netDepositFilter,
              operator: e.target.value as ">=" | "<="
            })}
          >
            <option value=">=">≥ (Greater than or equal)</option>
            <option value="<=">≤ (Less than or equal)</option>
          </select>
          <input
            type="number"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Amount"
            value={netDepositFilter.value || ""}
            onChange={(e) => onNetDepositChange({
              ...netDepositFilter,
              value: Number(e.target.value) || 0
            })}
          />
        </div>
      </div>
    </div>
  </div>
);

// Extracted Tabs Component
const ViewTabs = ({ activeTab, onTabChange }: { 
  activeTab: "all" | "valid"; 
  onTabChange: (tab: "all" | "valid") => void;
}) => (
  <div className="flex gap-2 mb-6">
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        activeTab === "all"
          ? "bg-blue-600 text-white shadow-md"
          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
      onClick={() => onTabChange("all")}
    >
      All Withdrawal Records
    </button>
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        activeTab === "valid"
          ? "bg-blue-600 text-white shadow-md"
          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
      onClick={() => onTabChange("valid")}
    >
      Valid Triggers Only
    </button>
  </div>
);

export default function Withdrawals() {
  const { registrationsReport } = useOutletContext<any>();
  
  const [netDepositFilter, setNetDepositFilter] = useState<FilterState>({
    operator: ">=",
    value: 0,
  });
  
  const [withdrawalFilter, setWithdrawalFilter] = useState<FilterState>({
    operator: ">=",
    value: 0,
  });
  
  const [activeTab, setActiveTab] = useState<"valid" | "all">("all");

  // Ensure registrationsReport is an array
  const dataArray = Array.isArray(registrationsReport) ? registrationsReport : [registrationsReport];

  // Apply filters to withdrawal records
  const withdrawalRecords = useMemo(() => {
    return dataArray?.filter((entry: any) => {
      const hasWithdrawals = (entry?.first_deposit || 0) - (entry?.net_deposits || 0) > 0;
      const meetsNetDepositFilter = applyFilter(entry.net_deposits || 0, netDepositFilter);
      const meetsWithdrawalFilter = applyFilter(
        (entry?.first_deposit || 0) - (entry?.net_deposits || 0),
        withdrawalFilter
      );
      
      return hasWithdrawals && meetsNetDepositFilter && meetsWithdrawalFilter;
    });
  }, [dataArray, netDepositFilter, withdrawalFilter]);

  // Calculate comprehensive metrics
  const metrics: WithdrawalMetrics = useMemo(() => {
    const summary = withdrawalRecords.reduce(
      (acc, record: any) => {
        const netDeposits = record.net_deposits || 0;
        const withdrawals = record?.Withdrawals || 0;
        const commission = record?.commission || 0;
        const balance = netDeposits - withdrawals;

        acc.totalUsers++;
        acc.totalNetDeposits += netDeposits;
        acc.totalWithdrawals += withdrawals;

        if (balance >= 300 && commission === 0) {
          acc.validTriggers++;
          acc.potentialCommission += COMMISION_BASE;
        }

        if (withdrawals > netDeposits * 0.5) {
          acc.riskUsers++;
        }

        return acc;
      },
      {
        totalUsers: 0,
        totalNetDeposits: 0,
        totalWithdrawals: 0,
        validTriggers: 0,
        potentialCommission: 0,
        riskUsers: 0,
      }
    );

    const withdrawalRate = summary.totalNetDeposits > 0 
      ? (summary.totalWithdrawals / summary.totalNetDeposits) * 100 
      : 0;
    
    const retentionRate = 100 - withdrawalRate;
    const roiImpact = withdrawalRate > 0 ? -((withdrawalRate - 30) * 0.5) : 0; // Base impact calculation
    const averageWithdrawal = summary.totalUsers > 0 
      ? summary.totalWithdrawals / summary.totalUsers 
      : 0;

    return {
      ...summary,
      withdrawalRate,
      retentionRate,
      roiImpact,
      averageWithdrawal,
    };
  }, [withdrawalRecords]);


  // Get valid balance users for commission triggers
  const validBalanceUsers = useMemo(() => {
    return withdrawalRecords.filter((record: any) => {
      const balance = (record.net_deposits || 0) - (record?.Withdrawals || 0);
      const commission = record?.commission || 0;
      return balance >= 300 && commission === 0;
    });
  }, [withdrawalRecords]);

  return (
    <div className="w-full py-8 px-4 mb-20">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Withdrawal Performance Analysis
          <span className="flex text-xs font-semibold me-2 rounded-sm text-blue-600 ms-2">
            <MdCenterFocusStrong className="w-4 h-4"/>
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Monitor withdrawal patterns and their impact on your affiliate ROI
        </p>
      </div>

      {/* Performance Metrics */}
      <PerformanceMetrics metrics={metrics} />

      {/* Risk Analysis */}
      <RiskAnalysis metrics={metrics} />

      {/* Filters */}
      <WithdrawalFilters
        netDepositFilter={netDepositFilter}
        withdrawalFilter={withdrawalFilter}
        onNetDepositChange={setNetDepositFilter}
        onWithdrawalChange={setWithdrawalFilter}
      />

      {/* View Tabs */}
      <ViewTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Data Table */}
      {metrics.totalUsers === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No users found with withdrawals matching your criteria
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
            Try adjusting your filters or check if there are users with withdrawal activity
          </p>
        </div>
      ) : (
        <WithdrawalsTable
          title={
            activeTab === "valid"
              ? "Valid Commission Triggers (Balance ≥ $300, No Commission)"
              : "All Withdrawal Records"
          }
          withdrawalRecords={
            activeTab === "valid" ? validBalanceUsers : withdrawalRecords
          }
        />
      )}

      {/* Insights Footer */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-1">💡 Key Insights for Affiliate Success:</p>
            <ul className="space-y-1 text-xs">
              <li>• <strong>High withdrawal rates</strong> directly reduce your commission potential</li>
              <li>• <strong>Valid triggers</strong> represent users who qualify for commission but haven't been paid</li>
              <li>• <strong>Monitor risk users</strong> who withdraw more than 50% of their deposits</li>
              <li>• <strong>Focus on retention</strong> - retained users generate ongoing commissions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
