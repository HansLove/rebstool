/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { splitDecimals } from "@/core/utils/splitDecimals";
import ActivityBarChart from "@/components/charts/ActivityBarChart";
import { FaInfoCircle } from "react-icons/fa";

export default function GeneralStats({ 
  totalRegisters,
  // avgCommissionPerUser,
  registrationData,
  
 }:any) {
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
 
  const registrations = useMemo(() => {
    if (!registrationData) {
      return [];
    }
    if (Array.isArray(registrationData)) {
      return registrationData;
    }
    // Otherwise, wrap the object in an array
    return [registrationData];
  }, [registrationData]);

  /**
   * We'll compute all stats in a useMemo for clarity & efficiency
   */
  const {
    conversionRate,
    avgDepositValue,
    activeTradersRate,
  } = useMemo(() => {
    const todayISO = new Date().toISOString().split("T")[0]; // e.g. "2025-04-01"
    let todaysCount = 0;
    let totalDepositors = 0; // Number of users with net_deposits > 0
    let totalDepositSum = 0; // Sum of all net_deposits
    let activeTraders = 0; // Number of users with volume > 0
    const totalUsers = registrations.length;

    registrations.forEach((user) => {
      // 1) Check if registration occurred "today"
      if (user.registration_date) {
        const regDate = new Date(user.registration_date);
        if (regDate.toISOString().split("T")[0] === todayISO) {
          todaysCount += 1;
        }
      }

      // 2) Count depositors & sum their deposits
      const netDeposits = user.net_deposits || 0;
      if (netDeposits > 0) {
        totalDepositors += 1;
        totalDepositSum += netDeposits;
      }

      // 3) Count active traders (users with trading volume > 0)
      const volume = user.volume || 0;
      if (volume > 0) {
        activeTraders += 1;
      }
    });

    // 4) Calculate metrics
    const convRate = totalUsers > 0
      ? (totalDepositors / totalUsers) * 100
      : 0;
    const averageValue = totalDepositors > 0
      ? totalDepositSum / totalDepositors
      : 0;
    const activeTradersPercentage = totalUsers > 0
      ? (activeTraders / totalUsers) * 100
      : 0;
    const gross = totalDepositSum; // you can rename or redefine as needed

    return {
      todaysOrdersCount: todaysCount,
      conversionRate: convRate,
      avgDepositValue: averageValue,
      activeTradersRate: activeTradersPercentage,
      grossSale: gross,
    };
  }, [registrations]);

  // Tooltip component
  const Tooltip = ({ children, content, id }: { children: React.ReactNode; content: string; id: string }) => (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setHoveredTooltip(id)}
        onMouseLeave={() => setHoveredTooltip(null)}
        className="cursor-help"
      >
        {children}
      </div>
      {hoveredTooltip === id && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded-lg shadow-lg max-w-xs w-64">
          <div className="text-center">{content}</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900 dark:border-t-slate-100"></div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 sm:px-6 py-3 sm:py-4">
        <h3 className="text-sm sm:text-base font-semibold text-white">Performance Overview</h3>
      </div>

      {/* Stats Grid */}
      <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Total Registers */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 sm:p-6 border border-blue-200 dark:border-blue-700/50">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {totalRegisters}
                </span>
                <Tooltip 
                  id="total-registers"
                  content="Total number of users who have registered through your affiliate link. This shows your network size and reach."
                >
                  <FaInfoCircle className="text-blue-500 dark:text-blue-400 text-sm" />
                </Tooltip>
              </div>
              <h6 className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">
                Total Registers
              </h6>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl p-4 sm:p-6 border border-emerald-200 dark:border-emerald-700/50">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {conversionRate.toFixed(1)}%
                </span>
                <Tooltip 
                  id="conversion-rate"
                  content="Percentage of registered users who made their first deposit. Higher rates indicate better quality leads and effective marketing."
                >
                  <FaInfoCircle className="text-emerald-500 dark:text-emerald-400 text-sm" />
                </Tooltip>
              </div>
              <h6 className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Conversion Rate
              </h6>
            </div>
          </div>

          {/* Avg. Deposit Value */}
          <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20 rounded-xl p-4 sm:p-6 border border-purple-200 dark:border-purple-700/50">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-400">
                  ${splitDecimals(avgDepositValue.toFixed(0))}
                </span>
                <Tooltip 
                  id="avg-deposit-value"
                  content="Average deposit amount per user who made a deposit. Higher values indicate more valuable customers and better targeting."
                >
                  <FaInfoCircle className="text-purple-500 dark:text-purple-400 text-sm" />
                </Tooltip>
              </div>
              <h6 className="text-xs sm:text-sm font-medium text-purple-700 dark:text-purple-300">
                Avg. Value
              </h6>
            </div>
          </div>

          {/* Active Traders Rate */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-4 sm:p-6 border border-orange-200 dark:border-orange-700/50">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {activeTradersRate.toFixed(1)}%
                </span>
                <Tooltip 
                  id="active-traders"
                  content="Percentage of users who are actively trading (have trading volume > 0). This shows network engagement and potential for ongoing commissions."
                >
                  <FaInfoCircle className="text-orange-500 dark:text-orange-400 text-sm" />
                </Tooltip>
              </div>
              <h6 className="text-xs sm:text-sm font-medium text-orange-700 dark:text-orange-300">
                Active Traders
              </h6>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-0">
        <ActivityBarChart registrationData={registrationData} />
      </div>
    </div>
  );
}
