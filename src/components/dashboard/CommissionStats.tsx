/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { splitDecimals } from "@/core/utils/splitDecimals";
import { FaUserCheck, FaUsers } from "react-icons/fa6";
import { GoAlertFill } from "react-icons/go";
import { IoIosTrendingUp } from "react-icons/io";


const MIN_DEPOSIT = 300;
const COMMISSION_HOLD_DAYS = 30;

export default function CommissionStats({ registrationsData = [] }: any) {
  const { totalUsers, eligibleUsers, usersBelowThreshold, totalNeeded } =
    useMemo(() => {
      const dataArray = Array.isArray(registrationsData)
        ? registrationsData
        : [registrationsData];

      let domestic = 0;
      let international = 0;
      let eligible = 0;
      let belowThreshold = 0;
      let totalProjected = 0;

      const total = dataArray.length;

      dataArray.forEach((user: any) => {
        const net = user.net_deposits || 0;
        const commission = user.commission || 0;
        const firstDepositDate = user.first_deposit_date
          ? new Date(user.first_deposit_date)
          : null;
        const registrationDate = user.registration_date
          ? new Date(user.registration_date)
          : null;
        const country = user.country || "N/A";

        let withdrewTooEarly = false;
        if (firstDepositDate && registrationDate) {
          const days =
            (firstDepositDate.getTime() - registrationDate.getTime()) /
            (1000 * 60 * 60 * 24);
          if (days <= COMMISSION_HOLD_DAYS) {
            withdrewTooEarly = true;
          }
        }

        const isEligible = net >= MIN_DEPOSIT && !withdrewTooEarly;

        if (isEligible) {
          eligible++;
          if (country === "GB") {
            domestic += commission;
          } else {
            international += commission;
          }
        } else {
          if (net < MIN_DEPOSIT) belowThreshold++;
          if (net < MIN_DEPOSIT && !withdrewTooEarly)
            totalProjected += MIN_DEPOSIT - net;
        }
      });

      return {
        totalUsers: total,
        eligibleUsers: eligible,
        usersBelowThreshold: belowThreshold,
        totalNeeded: totalProjected,
        domesticRevenue: domestic,
        internationalRevenue: international,
      };
    }, [registrationsData]);

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 sm:px-6 py-3 sm:py-4">
        <h3 className="text-sm sm:text-base font-semibold text-white">User Qualification Status</h3>
      </div>
      
      {/* Stats Grid */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {/* Eligible Users */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl p-4 sm:p-6 border border-emerald-200 dark:border-emerald-700/50">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                <FaUserCheck className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {eligibleUsers}
                </p>
                <p className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  Eligible
                </p>
              </div>
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Users qualified for commissions
            </p>
          </div>

          {/* Total Users */}
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-700/50 dark:to-gray-700/50 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-600">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-500 rounded-lg flex items-center justify-center">
                <FaUsers className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-bold text-slate-600 dark:text-slate-300">
                  {totalUsers}
                </p>
                <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-400">
                  Total
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              All registered users
            </p>
          </div>

          {/* Below Threshold */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl p-4 sm:p-6 border border-amber-200 dark:border-amber-700/50">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 rounded-lg flex items-center justify-center">
                <GoAlertFill className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {usersBelowThreshold}
                </p>
                <p className="text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-300">
                  Below Threshold
                </p>
              </div>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              Need more deposits
            </p>
          </div>

          {/* Amount Needed */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 sm:p-6 border border-blue-200 dark:border-blue-700/50">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <IoIosTrendingUp className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-right">
                <p className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                  ${splitDecimals(totalNeeded.toFixed(0))}
                </p>
                <p className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">
                  Needed
                </p>
              </div>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              To qualify users
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Qualification Progress
            </span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {totalUsers > 0 ? Math.round((eligibleUsers / totalUsers) * 100) : 0}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 sm:h-3">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 sm:h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${totalUsers > 0 ? (eligibleUsers / totalUsers) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
