/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { format, isSameMonth, isSameWeek, isAfter, subDays } from "date-fns";
import { createHandleSort, universalSort } from "@/core/utils/sorting";

export function useCommissionAnalyzer(data: any[]) {
  const [sortBy, setSortBy] = useState<any>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const now = new Date();
  const last7Days = subDays(now, 7);

  const {
    tableData,
    chartData,
    total,
    thisMonth,
    thisWeek,
    last7,
  } = useMemo(() => {
    let total = 0;
    let thisMonth = 0;
    let last7 = 0;
    let thisWeek = 0;
    // const chartMap: Record<string, number> = [];
    const chartMap: Record<string, any> = [];
    const rows: any[] = [];

    data?.forEach((entry: any) => {
      const dateStr = entry?.qualification_date || entry.createdAt;
      const amount = entry?.commission || 0;
      if (!dateStr || amount === 0) return;

      const date = new Date(dateStr);
      const formatted = format(date, "yyyy-MM-dd");

      chartMap[formatted] = (chartMap[formatted] || 0) + amount;
      total += amount;

      if (isSameMonth(date, now)) thisMonth += amount;
      if (isAfter(date, last7Days)) last7 += amount;
      if (isSameWeek(date, now, { weekStartsOn: 1 })) thisWeek += amount;

      rows.push({
        customer_name: entry?.customer_name || "N/A",
        ce_user_id: entry?.ce_user_id,
        date: formatted,
        commission: amount,
      });
    });

    const chartData = Object.entries(chartMap).map(([date, commission]) => ({ date, commission }));

    // const sortedTable = [...rows].sort((a, b):any => universalSort(a, b, sortBy, sortOrder));
    const sortedTable = [...rows].sort((a, b):any => universalSort(a, b, sortBy));

    return {
      total,
      thisMonth,
      thisWeek,
      last7,
      chartData,
      tableData: sortedTable,
    };
  }, [data, sortBy, sortOrder]);

  const handleSort = createHandleSort(sortBy, setSortBy, sortOrder, setSortOrder);

  return {
    chartData,
    tableData,
    total,
    thisMonth,
    last7,
    thisWeek,
    handleSort,
    sortBy,
    sortOrder,
  };
}
