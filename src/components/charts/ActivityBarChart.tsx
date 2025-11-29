/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { splitDecimals } from "@/core/utils/splitDecimals";
import { format, startOfWeek } from "date-fns";

export default function ActivityBarChart({ registrationData = [] }) {
  const [grouping, setGrouping] = useState<"month" | "week">("month");
  const [chartHeight, setChartHeight] = useState(400);

  useEffect(() => {
    const updateChartHeight = () => {
      if (window.innerWidth < 640) {
        setChartHeight(300);
      } else if (window.innerWidth < 1024) {
        setChartHeight(350);
      } else {
        setChartHeight(400);
      }
    };

    updateChartHeight();
    window.addEventListener('resize', updateChartHeight);
    return () => window.removeEventListener('resize', updateChartHeight);
  }, []);

  const groupedData = useMemo(() => {
    const dataArray = Array.isArray(registrationData) ? registrationData : [registrationData];

    // Create a more robust data structure with proper date handling
    const map: Record<string, { netDeposits: number; commissions: number; withdrawals: number; date: Date }> = {};

    dataArray.forEach((entry: any) => {
      const dateStr = entry?.qualification_date || entry.registration_date;
      if (!dateStr) return;

      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return; // Skip invalid dates

      let key = "";
      let weekStart: Date;

      if (grouping === "month") {
        // Use first day of month for consistent sorting
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        key = format(monthStart, "MMM yyyy"); // e.g., Jan 2025
        map[key] = map[key] || { netDeposits: 0, commissions: 0, withdrawals: 0, date: monthStart };
      } else {
        // Use start of week for consistent sorting
        weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Monday start
        key = format(weekStart, "MMM d"); // e.g., Jan 1
        map[key] = map[key] || { netDeposits: 0, commissions: 0, withdrawals: 0, date: weekStart };
      }

      map[key].netDeposits += entry.net_deposits || 0;
      map[key].commissions += entry.commission || 0;
      map[key].withdrawals += (entry.ActivityReport?.Withdrawals) || 0;
    });

    // Sort by actual date objects for perfect chronological order
    const sortedEntries = Object.entries(map).sort((a, b) => a[1].date.getTime() - b[1].date.getTime());

    // Limit to last 12 periods to prevent overcrowding
    const limitedEntries = sortedEntries.slice(-12);

    const categories = limitedEntries.map(([key]) => key);
    const netDepositsData = limitedEntries.map(([, data]) => Number(data.netDeposits.toFixed(2)));
    const commissionsData = limitedEntries.map(([, data]) => Number(data.commissions.toFixed(2)));
    const withdrawalsData = limitedEntries.map(([, data]) => Number(data.withdrawals.toFixed(2)));

    return {
      categories,
      netDepositsData,
      commissionsData,
      withdrawalsData,
    };
  }, [grouping, registrationData]);

  const series = [
    { name: "Net Deposits", data: groupedData.netDepositsData || [] },
    { name: "Commissions", data: groupedData.commissionsData || [] },
    { name: "Withdrawals", data: groupedData.withdrawalsData || [] },
  ];

  const isDarkMode = document.documentElement.classList.contains('dark');
  
  const options: any = {
    chart: { 
      type: "bar", 
      toolbar: { show: false }, 
      stacked: false,
      background: 'transparent',
      foreColor: isDarkMode ? '#94a3b8' : '#64748b',
      fontFamily: 'Inter, system-ui, sans-serif',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    plotOptions: {
      bar: { 
        horizontal: false, 
        columnWidth: "60%", 
        borderRadius: 6,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last'
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: {
      categories: groupedData.categories || [],
      labels: { 
        rotate: grouping === "week" ? -45 : -30,
        style: {
          colors: isDarkMode ? '#94a3b8' : '#64748b',
          fontSize: '12px',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 500
        },
        trim: true,
        hideOverlappingLabels: true,
        maxHeight: 60
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `$${splitDecimals(val.toFixed(0))}`,
        style: {
          colors: isDarkMode ? '#94a3b8' : '#64748b',
          fontSize: '12px',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 500
        }
      },
      title: { 
        text: "Amount (USD)",
        style: {
          color: isDarkMode ? '#f1f5f9' : '#1e293b',
          fontSize: '14px',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 600
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      offsetY: -10,
      labels: {
        colors: isDarkMode ? '#f1f5f9' : '#1e293b',
        useSeriesColors: false,
        fontSize: '13px',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontWeight: 500
      },
      markers: {
        width: 8,
        height: 8,
        radius: 4
      }
    },
    fill: { 
      opacity: 0.9,
      type: 'solid'
    },
    tooltip: {
      theme: isDarkMode ? 'dark' : 'light',
      style: {
        fontSize: '13px',
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      custom: function({ seriesIndex, dataPointIndex, w }) {
        const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
        const category = w.globals.labels[dataPointIndex];
        const seriesName = w.globals.seriesNames[seriesIndex];
        
        const colors = ['#0ea5e9', '#10b981', '#f43f5e'];
        const color = colors[seriesIndex];
        
        return `
          <div style="
            background: ${isDarkMode ? '#1e293b' : '#ffffff'};
            border: 1px solid ${isDarkMode ? '#334155' : '#e2e8f0'};
            border-radius: 12px;
            padding: 12px 16px;
            box-shadow: ${isDarkMode 
              ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
              : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            };
            font-family: Inter, system-ui, sans-serif;
            min-width: 200px;
          ">
            <div style="
              color: ${isDarkMode ? '#f1f5f9' : '#1e293b'};
              font-weight: 600;
              font-size: 14px;
              margin-bottom: 8px;
              border-bottom: 1px solid ${isDarkMode ? '#334155' : '#e2e8f0'};
              padding-bottom: 8px;
            ">
              ${category}
            </div>
            <div style="
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 4px;
            ">
              <div style="
                width: 12px;
                height: 12px;
                background: ${color};
                border-radius: 3px;
              "></div>
              <span style="
                color: ${isDarkMode ? '#cbd5e1' : '#64748b'};
                font-size: 13px;
                font-weight: 500;
              ">${seriesName}:</span>
              <span style="
                color: ${isDarkMode ? '#f1f5f9' : '#1e293b'};
                font-weight: 600;
                font-size: 13px;
              ">$${splitDecimals(data.toFixed(2))}</span>
            </div>
          </div>
        `;
      }
    },
    colors: ["#0ea5e9", "#10b981", "#f43f5e"], // sky-500, emerald-500, rose-500
    grid: {
      borderColor: isDarkMode ? '#334155' : '#e2e8f0',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    responsive: [{
      breakpoint: 768,
      options: {
        xaxis: {
          labels: {
            rotate: -45,
            style: {
              fontSize: '10px'
            }
          }
        },
        legend: {
          position: 'bottom',
          offsetY: 0
        }
      }
    }]
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Activity Overview</h4>
              <p className="text-sm text-white/80">
                {grouping === "month" ? "Monthly" : "Weekly"} performance metrics
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Group by:</span>
            <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setGrouping("month")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  grouping === "month"
                    ? "bg-indigo-500 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-600"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setGrouping("week")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  grouping === "week"
                    ? "bg-indigo-500 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-600"
                }`}
              >
                Week
              </button>
            </div>
          </div>
          
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Showing last {groupedData.categories.length} {grouping === "month" ? "months" : "weeks"}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4 sm:p-6">
        {groupedData.categories.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-lg font-medium">No data available</p>
              <p className="text-sm">Try adjusting your date range or filters</p>
            </div>
          </div>
        ) : (
          <div
            id="activity_bar_chart"
            className="apex-charts"
          >
            <ReactApexChart 
              options={options} 
              series={series} 
              type="bar" 
              height={chartHeight} 
            />
          </div>
        )}
      </div>
    </div>
  );
}