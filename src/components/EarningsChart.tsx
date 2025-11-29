/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, parseISO, startOfWeek, startOfMonth, startOfQuarter } from "date-fns";

export default function EarningsChart({ registrations }) {
  const [view, setView] = useState("week"); // week, month, quarter
  const [mode, setMode] = useState("all"); // all, default, custom

  const filteredData = useMemo(() => {
    let filtered = registrations;
    if (mode === "default") {
      filtered = filtered.filter((reg) => reg.tracking_code.toLowerCase() === "default");
    } else if (mode === "custom") {
      filtered = filtered.filter((reg) => reg.tracking_code.toLowerCase() !== "default");
    }
    return filtered;
  }, [registrations, mode]);

  const groupedData = useMemo(() => {
    const groupByMap = {
      week: (date) => format(startOfWeek(parseISO(date)), "yyyy-MM-dd"),
      month: (date) => format(startOfMonth(parseISO(date)), "yyyy-MM"),
      quarter: (date) => format(startOfQuarter(parseISO(date)), "yyyy-'Q'q"),
    };

    const groupByFn = groupByMap[view];
    if (!groupByFn) return [];

    const map = {};
    for (const reg of filteredData) {
      if (!reg.first_deposit_date) continue;
      const key = groupByFn(reg.first_deposit_date);
      if (!map[key]) map[key] = 0;
      map[key] += reg.first_deposit || 0;
    }
    return Object.entries(map).map(([key, value]:any) => ({
      period: key,
      earnings: parseFloat(value.toFixed(2)),
    }));
  }, [filteredData, view]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl p-6 space-y-4 shadow">
      <div className="flex justify-between items-center gap-2">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300 mr-2">Timeframe:</label>
          <select
            value={view}
            onChange={(e) => setView(e.target.value)}
            className="bg-gray-100 dark:bg-gray-800 text-sm rounded px-2 py-1"
          >
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="quarter">Quarterly</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300 mr-2">Tracking:</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="bg-gray-100 dark:bg-gray-800 text-sm rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="default">Default</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={groupedData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <XAxis dataKey="period" stroke="#8884d8" />
          <YAxis stroke="#8884d8" />
          <Tooltip formatter={(value) => `$${value}`} />
          <Legend />
          <Bar dataKey="earnings" fill="#6366f1" name="Earnings" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
