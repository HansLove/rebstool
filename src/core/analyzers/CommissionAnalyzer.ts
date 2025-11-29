/* eslint-disable @typescript-eslint/no-explicit-any */
import { format, isSameMonth, isSameWeek, isAfter, subDays } from "date-fns";

export class CommissionAnalyzer {
  private rawData: any[];
  private sortBy = '';
  private sortOrder: 'asc' | 'desc' = 'asc';

  constructor(data: any[] = []) {
    this.rawData = data;
  }

  withSort(by: string, order: 'asc' | 'desc') {
    this.sortBy = by;
    this.sortOrder = order;
    return this;
  }

  getSummaryAndTableData() {
    const now = new Date();
    const last7Days = subDays(now, 7);

    let total = 0;
    let thisMonth = 0;
    let last7 = 0;
    let thisWeek = 0;
    const chartMap: Record<string, any> = [];

    const tableData = this.rawData
      .filter((entry: any) => {
        const dateStr = entry?.qualification_date || entry.createdAt;
        const amount = entry?.commission || 0;
        return dateStr && amount > 0;
      })
      .map((entry: any) => {
        const amount = entry.commission || 0;
        const dateStr = entry?.qualification_date || entry.createdAt;
        const date = new Date(dateStr);
        const formatted = format(date, "yyyy-MM-dd");

        total += amount;
        if (isSameMonth(date, now)) thisMonth += amount;
        if (isAfter(date, last7Days)) last7 += amount;
        if (isSameWeek(date, now, { weekStartsOn: 1 })) thisWeek += amount;

        chartMap[formatted] = (chartMap[formatted] || 0) + amount;

        return {
          ...entry,
          date: formatted,
          commission: amount,
        };
      });

    if (this.sortBy) {
      tableData.sort((a: any, b: any) => {
        const valA = a[this.sortBy];
        const valB = b[this.sortBy];

        if (typeof valA === 'string' && typeof valB === 'string') {
          return this.sortOrder === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        const aNum = Number(valA);
        const bNum = Number(valB);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return this.sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
        }

        return 0;
      });
    }

    const chartData = Object.entries(chartMap)
      .map(([date, value]) => ({ date, commission: value }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      tableData,
      chartData,
      total,
      thisMonth,
      last7,
      thisWeek,
    };
  }
}
