import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, subMonths, addMonths, isToday, isSameMonth } from "date-fns";
import { MdChevronLeft, MdChevronRight, MdAttachMoney, MdAccountBalance, MdPeople, MdTrendingUp } from "react-icons/md";
import { useJournalData } from "@/pages/journal/hooks/useJournalData";
import { splitDecimals } from "@/core/utils/splitDecimals";

export default function JournalPanel() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
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

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Journal</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <MdChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[100px] text-center">
            {format(currentMonth, "MMM yyyy")}
          </span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            disabled={isSameMonth(currentMonth, new Date())}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            <MdChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-2">
          <p className="text-xs text-emerald-700 dark:text-emerald-300">Equity</p>
          <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
            ${splitDecimals(monthlyTotals.totalEquity.toFixed(0))}
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
          <p className="text-xs text-blue-700 dark:text-blue-300">Deposits</p>
          <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
            ${splitDecimals(monthlyTotals.totalDeposits.toFixed(0))}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2">
          <p className="text-xs text-purple-700 dark:text-purple-300">New Users</p>
          <p className="text-sm font-bold text-purple-900 dark:text-purple-100">
            {monthlyTotals.newUsers}
          </p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2">
          <p className="text-xs text-orange-700 dark:text-orange-300">Volume</p>
          <p className="text-sm font-bold text-orange-900 dark:text-orange-100">
            {splitDecimals(monthlyTotals.totalVolume.toFixed(1))}
          </p>
        </div>
      </div>

      {/* Calendar */}
      {!isLoading && (
        <div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayHeaders.map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 py-1">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day: Date) => {
              const dayData = getDayData(day);
              const hasData = !!dayData;
              const isCurrentDay = isToday(day);
              const isCurrentMonthDay = isSameMonth(day, currentMonth);

              const dayEquity = dayData?.totalEquity || 0;
              const dayDeposits = dayData?.totalDeposits || 0;
              const dayNewUsers = dayData?.newUsers.length || 0;

              return (
                <div
                  key={day.toISOString()}
                  className={`
                    relative rounded p-1 min-h-[60px] text-xs
                    ${hasData ? "bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700" : "bg-gray-50 dark:bg-gray-800"}
                    ${isCurrentDay ? "ring-2 ring-yellow-400" : ""}
                    ${!isCurrentMonthDay ? "opacity-40" : ""}
                  `}
                >
                  <div className={`font-semibold mb-1 ${isCurrentDay ? "text-yellow-600" : hasData ? "text-indigo-700 dark:text-indigo-300" : "text-gray-500"}`}>
                    {format(day, "d")}
                  </div>
                  {hasData && (
                    <div className="space-y-0.5">
                      {dayEquity > 0 && (
                        <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                          ${splitDecimals(dayEquity.toFixed(0))}
                        </div>
                      )}
                      {dayDeposits > 0 && (
                        <div className="text-blue-600 dark:text-blue-400">
                          ${splitDecimals(dayDeposits.toFixed(0))}
                        </div>
                      )}
                      {dayNewUsers > 0 && (
                        <div className="text-purple-600 dark:text-purple-400 font-semibold">
                          +{dayNewUsers}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

