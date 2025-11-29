/* eslint-disable @typescript-eslint/no-explicit-any */
import { splitDecimals } from "@/core/utils/splitDecimals";
import { FaCreditCard, FaDollarSign, FaWallet } from "react-icons/fa6";

export default function DashboardHeaderSummary({ summary }: any) {
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 px-4 md:px-0">
      {/* Net Deposits Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between p-5 sm:p-6">
          <div className="flex-1">
            <h3 className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Net Deposits
            </h3>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">
                ${splitDecimals(summary.totalDeposits.toFixed(0))}
              </span>
              <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                <span className="text-green-500 font-semibold">+12.5%</span>
                <span className="ml-2">from last period</span>
              </div>
            </div>
          </div>
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
            <FaWallet className="text-white w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </div>
      </div>

      {/* Net Commissions Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between p-5 sm:p-6">
          <div className="flex-1">
            <h3 className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Net Commissions
            </h3>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">
                ${splitDecimals(summary.totalCommission.toFixed(0))}
              </span>
              <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                <span className="text-blue-500 font-semibold">+8.3%</span>
                <span className="ml-2">from last period</span>
              </div>
            </div>
          </div>
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-700 to-slate-700 rounded-xl flex items-center justify-center">
            <FaDollarSign className="text-white w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </div>
      </div>

      {/* ROI Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between p-5 sm:p-6">
          <div className="flex-1">
            <h3 className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              ROI (Net / Commissions)
            </h3>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">
                {splitDecimals(summary.roi.toFixed(2))}x
              </span>
              <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                <span className="text-blue-600 font-semibold">+15.2%</span>
                <span className="ml-2">from last period</span>
              </div>
            </div>
          </div>
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-700 to-slate-700 rounded-xl flex items-center justify-center">
            <FaCreditCard className="text-white w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
