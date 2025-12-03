import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, isToday, isSameMonth, subMonths, addMonths } from "date-fns";
import { useNavigate } from "react-router-dom";
import { MdChevronLeft, MdChevronRight, MdExpandMore, MdExpandLess } from "react-icons/md";
import { useJournalData } from "@/pages/journal/hooks/useJournalData";
import { splitDecimals } from "@/core/utils/splitDecimals";

export default function MiniJournal() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);
  const { dailyData, monthlyTotals, isLoading } = useJournalData(currentMonth);

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

  const dayHeaders = ["S", "M", "T", "W", "T", "F", "S"];

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleViewFull = () => {
    navigate("/journal");
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Journal
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {format(currentMonth, "MMM yyyy")}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleExpand}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <MdExpandLess className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <MdExpandMore className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Monthly Summary - Compact */}
      {!isExpanded && (
        <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
          <div className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">Equity:</span>{" "}
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              ${splitDecimals(monthlyTotals.totalEquity.toFixed(0))}
            </span>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">Deposits:</span>{" "}
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              ${splitDecimals(monthlyTotals.totalDeposits.toFixed(0))}
            </span>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">New Users:</span>{" "}
            <span className="text-purple-600 dark:text-purple-400 font-semibold">
              {monthlyTotals.newUsers}
            </span>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">Volume:</span>{" "}
            <span className="text-orange-600 dark:text-orange-400 font-semibold">
              {splitDecimals(monthlyTotals.totalVolume.toFixed(1))}
            </span>
          </div>
        </div>
      )}

      {/* Expanded View */}
      {isExpanded && (
        <>
          {/* Monthly Summary Cards */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-2 border border-emerald-200 dark:border-emerald-800">
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1">
                Total Equity
              </p>
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                ${splitDecimals(monthlyTotals.totalEquity.toFixed(2))}
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                Total Deposits
              </p>
              <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
                ${splitDecimals(monthlyTotals.totalDeposits.toFixed(2))}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2 border border-purple-200 dark:border-purple-800">
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">
                New Users
              </p>
              <p className="text-sm font-bold text-purple-700 dark:text-purple-300">
                {monthlyTotals.newUsers}
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 border border-orange-200 dark:border-orange-800">
              <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-1">
                Trading Volume
              </p>
              <p className="text-sm font-bold text-orange-700 dark:text-orange-300">
                {splitDecimals(monthlyTotals.totalVolume.toFixed(2))}
              </p>
            </div>
          </div>

          {/* Calendar Navigation */}
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            >
              <MdChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {format(currentMonth, "MMMM yyyy")}
            </h4>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              disabled={isSameMonth(currentMonth, new Date())}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </>
      )}

      {/* Calendar Grid */}
      {!isLoading ? (
        <div>
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {dayHeaders.map((day) => (
              <div
                key={day}
                className="text-center text-[10px] font-semibold text-gray-500 dark:text-gray-500 py-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-0.5">
            {days.map((day: Date) => {
              const dayData = getDayData(day);
              const hasData = !!dayData;
              const isCurrentDay = isToday(day);
              const isCurrentMonthDay = isSameMonth(day, currentMonth);

              const dayEquity = dayData?.totalEquity || 0;
              const dayNewUsers = dayData?.newUsers.length || 0;

              return (
                <div
                  key={day.toISOString()}
                  className={`
                    relative rounded p-1 min-h-[28px] sm:min-h-[32px]
                    transition-all duration-200
                    ${
                      hasData
                        ? "bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700"
                        : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    }
                    ${isCurrentDay ? "ring-1 ring-yellow-400 dark:ring-yellow-500" : ""}
                    ${!isCurrentMonthDay ? "opacity-30" : ""}
                  `}
                >
                  {/* Date */}
                  <div
                    className={`text-[10px] font-semibold mb-0.5 ${
                      isCurrentDay
                        ? "text-yellow-600 dark:text-yellow-400"
                        : hasData
                          ? "text-indigo-700 dark:text-indigo-300"
                          : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {format(day, "d")}
                  </div>

                  {/* Data Content - Only show equity and new users in mini view */}
                  {hasData && (
                    <div className="space-y-0.5">
                      {dayEquity > 0 && (
                        <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold leading-tight">
                          ${splitDecimals(dayEquity.toFixed(0))}
                        </div>
                      )}
                      {dayNewUsers > 0 && (
                        <div className="text-[9px] font-semibold text-purple-600 dark:text-purple-400 leading-tight">
                          +{dayNewUsers}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Activity Indicator */}
                  {hasData && (
                    <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* View Full Button */}
      {isExpanded && (
        <button
          onClick={handleViewFull}
          className="w-full mt-3 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors border border-indigo-200 dark:border-indigo-800"
        >
          View Full Journal →
        </button>
      )}
    </div>
  );
}

