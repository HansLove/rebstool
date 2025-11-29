/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaSort } from "react-icons/fa6";

interface ProfitTableProps {
  data: any[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (key: string) => void;
}

export function ProfitTable({
  data,
  sortBy,
  sortOrder,
  onSort,
}: ProfitTableProps) {
  const renderSortIcon = (key: string) => (
    <FaSort
      size={12}
      className={`transition-transform ${
        sortBy === key
          ? sortOrder === "asc"
            ? "rotate-180 text-indigo-600 dark:text-indigo-400"
            : "text-indigo-600 dark:text-indigo-400"
          : "opacity-40"
      }`}
    />
  );

  // Column configuration with icons and colors matching your screenshots
  const columns = [
    { 
      label: "User ID", 
      key: "ce_user_id",
      icon: "👤",
      lightClass: "text-indigo-700",
      darkClass: "text-indigo-400"
    },
    { 
      label: "Name", 
      key: "customer_name",
      icon: "👥",
      lightClass: "text-slate-700",
      darkClass: "text-slate-300"
    },
    { 
      label: "Reg Date", 
      key: "registration_date",
      icon: "📅",
      lightClass: "text-slate-600",
      darkClass: "text-slate-400"
    },
    { 
      label: "Net Deposits", 
      key: "net_deposits",
      icon: "💰",
      lightClass: "text-green-600",
      darkClass: "text-green-400"
    },
    { 
      label: "Volume", 
      key: "volume",
      icon: "📊",
      lightClass: "text-amber-600",
      darkClass: "text-amber-400"
    },
  ];

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-300 dark:border-slate-700 shadow-md dark:shadow-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-200 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className="px-4 py-3 font-semibold cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-800 transition-colors"
                onClick={() => onSort(col.key)}
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">{col.icon}</span>
                  {col.label} {renderSortIcon(col.key)}
                </span>
              </th>
            ))}
            <th className="px-4 py-3 font-semibold">
              <span className="flex items-center gap-2">
                <span className="text-lg">💵</span>
                Commission
              </span>
            </th>
            <th className="px-4 py-3 font-semibold text-center">
              <span className="flex items-center justify-center gap-2">
                <span className="text-lg">⚠️</span>
                Issues
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className={i % 2 === 0 
                ? "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700" 
                : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
              }
            >
              <td className={`px-4 py-3 ${columns[0].lightClass} dark:${columns[0].darkClass}`}>
                {row.ce_user_id}
              </td>
              <td className={`px-4 py-3 ${columns[1].lightClass} dark:${columns[1].darkClass}`}>
                {row.customer_name}
              </td>
              <td className={`px-4 py-3 ${columns[2].lightClass} dark:${columns[2].darkClass}`}>
                {new Date(row.registration_date).toDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full w-5 h-5 flex items-center justify-center mr-2">$</span>
                  <span className={row.net_deposits >= 300 
                    ? "text-green-600 dark:text-green-400 font-bold" 
                    : "text-slate-700 dark:text-slate-300"
                  }>
                    {row.net_deposits.toFixed(2)}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full w-5 h-5 flex items-center justify-center mr-2">📊</span>
                  <span className="text-amber-600 dark:text-amber-400">{row.volume.toFixed(2)}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full w-5 h-5 flex items-center justify-center mr-2">$</span>
                  <span className="text-purple-600 dark:text-purple-400">{row.commission.toFixed(2)}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <IssueBadges row={row} />
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-6 text-center text-slate-500">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <span className="text-2xl">✅</span>
                  <span>All users are currently eligible for commission.</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function IssueBadges({ row }: { row: any }) {
  return (
    <div className="flex justify-center items-center gap-2 flex-wrap">
      {row.missingDeposit > 0 && (
        <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 text-xs px-2 py-1 rounded-full">
          💸 ${row.missingDeposit.toFixed(2)}
        </span>
      )}
      {row.missingVolume > 0 && (
        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 text-xs px-2 py-1 rounded-full">
          📉 {row.missingVolume.toFixed(2)} lot
        </span>
      )}
      {!row.missingDeposit && !row.missingVolume && (
        <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/50 text-xs px-2 py-1 rounded-full">
          ✅ $300.00
        </span>
      )}
    </div>
  );
}
