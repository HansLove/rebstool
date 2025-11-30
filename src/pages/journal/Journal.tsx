/* eslint-disable react-hooks/exhaustive-deps */
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  subMonths,
  addMonths,
  isToday,
  isSameMonth,
} from "date-fns";
import { useMemo, useState } from "react";
import { splitDecimals } from "@/core/utils/splitDecimals";
import {
  MdCenterFocusStrong,
  MdChevronLeft,
  MdChevronRight,
  MdTrendingUp,
  MdAccountBalance,
  MdAttachMoney,
  MdPeople,
} from "react-icons/md";
import { useJournalData } from "./hooks/useJournalData";

export default function Journal() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { dailyData, monthlyTotals, isLoading, error } = useJournalData(
    currentMonth
  );

  const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
  const end = endOfMonth(currentMonth);

  const days = useMemo(() => {
    const allDays: Date[] = [];
    let date = new Date(start);
    while (date <= end) {
      allDays.push(new Date(date));
      date = addDays(date, 1);
    }
    return allDays;
  }, [currentMonth]);

  // Create a map of daily data for quick lookup
  const dailyDataMap = useMemo(() => {
    const map = new Map<string, typeof dailyData[0]>();
    dailyData.forEach((day) => {
      const dayKey = day.date.toISOString().split("T")[0];
      map.set(dayKey, day);
    });
    return map;
  }, [dailyData]);

  const getDayData = (date: Date) => {
    const dayKey = date.toISOString().split("T")[0];
    return dailyDataMap.get(dayKey);
  };

  const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
            Error Loading Journal
          </h2>
          <p className="text-sm text-red-800 dark:text-red-300">
            {error instanceof Error ? error.message : "Unknown error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="flex items-center text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-700 dark:text-white mb-2">
            <MdCenterFocusStrong className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 dark:text-indigo-400 mr-3" />
            Rebates Journal
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Detailed view of daily activity, equity and deposits
          </p>
        </div>

        {/* Monthly Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Equity
                </p>
                <p className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  ${splitDecimals(monthlyTotals.totalEquity.toFixed(2))}
                </p>
              </div>
              <MdAttachMoney className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Deposits
                </p>
                <p className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                  ${splitDecimals(monthlyTotals.totalDeposits.toFixed(2))}
                </p>
              </div>
              <MdAccountBalance className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                  New Users
                </p>
                <p className="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-400">
                  {monthlyTotals.newUsers}
                </p>
              </div>
              <MdPeople className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                  Trading Volume
                </p>
                <p className="text-lg sm:text-xl font-bold text-orange-600 dark:text-orange-400">
                  {splitDecimals(monthlyTotals.totalVolume.toFixed(2))}
                </p>
              </div>
              <MdTrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="flex items-center px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white transition-colors duration-200"
            >
              <MdChevronLeft className="w-5 h-5 mr-1" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-700 dark:text-white text-center">
              {format(currentMonth, "MMMM yyyy")}
            </h2>

            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              disabled={isSameMonth(currentMonth, new Date())}
              className="flex items-center px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="hidden sm:inline">Next</span>
              <MdChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-12 shadow-lg border border-slate-200 dark:border-slate-700 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300">
              Loading journal data...
            </p>
          </div>
        )}

        {/* Calendar Grid */}
        {!isLoading && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4">
              {dayHeaders.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {days.map((day: Date) => {
                const dayData = getDayData(day);
                const hasData = !!dayData;
                const isCurrentDay = isToday(day);
                const isCurrentMonthDay = isSameMonth(day, currentMonth);

                // Calculate totals for the day
                const dayEquity = dayData?.totalEquity || 0;
                const dayDeposits = dayData?.totalDeposits || 0;
                const dayVolume = dayData?.totalVolume || 0;
                const dayNewUsers = dayData?.newUsers.length || 0;
                const dayDepositCount = dayData?.deposits.length || 0;
                const dayTradeCount = dayData?.tradingActivity.length || 0;

                return (
                  <div
                    key={day.toISOString()}
                    className={`
                    relative rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 min-h-[80px] sm:min-h-[100px] lg:min-h-[120px]
                    transition-all duration-200 hover:scale-105 hover:shadow-lg
                    ${
                      hasData
                        ? "bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 border-2 border-indigo-300 dark:border-indigo-500 shadow-md"
                        : "bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600"
                    }
                    ${isCurrentDay ? "ring-2 ring-yellow-400 dark:ring-yellow-500" : ""}
                    ${!isCurrentMonthDay ? "opacity-40" : ""}
                  `}
                  >
                    {/* Date */}
                    <div
                      className={`text-xs sm:text-sm font-semibold mb-1 sm:mb-2 ${
                        isCurrentDay
                          ? "text-yellow-600 dark:text-yellow-400"
                          : hasData
                            ? "text-indigo-700 dark:text-indigo-300"
                            : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {format(day, "d")}
                    </div>

                    {/* Data Content */}
                    {hasData ? (
                      <div className="space-y-1 sm:space-y-2">
                        {dayEquity > 0 && (
                          <div className="text-emerald-600 dark:text-emerald-400 font-bold text-xs sm:text-sm">
                            ${splitDecimals(dayEquity.toFixed(0))}
                          </div>
                        )}
                        {dayDeposits > 0 && (
                          <div className="text-xs text-blue-600 dark:text-blue-300">
                            Dep: ${splitDecimals(dayDeposits.toFixed(0))}
                          </div>
                        )}
                        {dayVolume > 0 && (
                          <div className="text-xs text-slate-600 dark:text-slate-300">
                            Vol: {splitDecimals(dayVolume.toFixed(1))}
                          </div>
                        )}
                        {dayNewUsers > 0 && (
                          <div className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                            +{dayNewUsers} new{dayNewUsers !== 1 ? "" : ""}
                          </div>
                        )}
                        {(dayDepositCount > 0 || dayTradeCount > 0) && (
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {dayDepositCount > 0 && `${dayDepositCount} dep`}
                            {dayDepositCount > 0 && dayTradeCount > 0 && " • "}
                            {dayTradeCount > 0 && `${dayTradeCount} trades`}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                        {isCurrentMonthDay ? "No data" : ""}
                      </div>
                    )}

                    {/* Activity Indicator */}
                    {hasData && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm sm:text-base font-semibold text-slate-700 dark:text-white mb-3">
            Legend
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs sm:text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-indigo-300 dark:bg-indigo-500 rounded mr-2"></div>
              <span className="text-slate-600 dark:text-slate-300">
                Day with activity
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded mr-2"></div>
              <span className="text-slate-600 dark:text-slate-300">
                No activity
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
              <span className="text-slate-600 dark:text-slate-300">Today</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-slate-600 dark:text-slate-300">
                Activity indicator
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
