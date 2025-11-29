import { UserDataType } from "@/core/types/userData";
import { splitDecimals } from "@/core/utils/splitDecimals";
import { Link } from "react-router-dom";
import { FaExpand } from "react-icons/fa6";
import { useState } from "react";

/**
 * Map a 2-letter country code to a Unicode emoji flag.
 * If the code is invalid or empty, show a placeholder.
 */
function countryToFlag(countryCode?: string): string {
  if (!countryCode) return "🏳️"; // fallback
  const trimmedCode = countryCode.trim().toUpperCase();

  // Quick validity check: if not exactly 2 letters, fallback
  if (trimmedCode.length !== 2) return trimmedCode || "🏳️";

  // Convert each character to regional indicator code
  // 'A'.charCodeAt(0) -> 65. Regional indicator offset starts at 127397
  // So 'A' becomes 127462
  return trimmedCode
    .split("")
    .map((char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    .join("");
}

interface Props {
  data: UserDataType[];
}

export default function TopDepositsComponent({ data=[] }: Props) {
  const [sortBy, setSortBy] = useState<'deposits' | 'volume'>('deposits');

  // Sort by selected criteria
  const sortedData = [...data].sort((a, b) => {
    if (sortBy === 'deposits') {
      return (b.net_deposits || 0) - (a.net_deposits || 0);
    } else {
      return (b.volume || 0) - (a.volume || 0);
    }
  });

  // Slice top rows
  const topAffiliates = sortedData.slice(0, 20);


  return (
    <div className="sm:col-span-1 overflow-hidden md:col-span-1  dark:border-slate-600 lg:col-span-1 xl:col-span-1 order-1 lg:order-1 xl:order-1 h-full dark:text-slate-50 text-slate-800 w-full bg-slate-50 dark:bg-slate-600 rounded-2xl border ">
    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border  w-full border-slate-400 dark:border-slate-600 relative overflow-hidden text-slate-800 dark:text-white  h-full">
    <div className="flex card-header justify-between items-center p-2 bg-slate-50 dark:bg-slate-800">
        <h4 className="font-medium ">Top Deposits & Volume</h4>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'deposits' | 'volume')}
            className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
          >
            <option value="deposits">Sort by Deposits</option>
            <option value="volume">Sort by Volume</option>
          </select>
          <Link
            to="/topDeposits"
            className="block py-1 text-sm text-slate-800 dark:text-slate-50"
          >
            <FaExpand/>
          </Link>
        </div>
        </div>

        <div className="overflow-auto h-96 bg-slate-50  dark:bg-slate-800  ">
          <table className="w-full text-sm text-left border-collapse bg-slate-50  dark:bg-slate-800 h-full">
            <thead className="border-b border-slate-300 dark:border-slate-700 sticky top-0 dark:text-white bg-slate-100  dark:bg-slate-800">
              <tr className="py-2">
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Country</th>
                <th className="px-2 py-2">Deposits</th>
                <th className="px-2 py-2">Volume</th>
                <th className="px-2 py-2">Withdrawals</th>
              </tr>
            </thead>
            <tbody>
              {topAffiliates.length > 0 ? (
                topAffiliates.map((item, index) => {
                  const depositStr = item.net_deposits?.toFixed(2) || "0";
                  const volumeStr = item.volume?.toFixed(2) || "0";
                  const commStr = (item.first_deposit-item.net_deposits)?.toFixed(2) || "0";
                  return (
                    <tr key={index} className="border-b border-slate-300 dark:text-slate-300  dark:border-slate-700 hover:bg-gray-300 cursor-pointer">
                      <td className="px-2 py-2">{item.customer_name}</td>
                      
                      {/* Flag + trimmed country code */}
                      <td className="px-2 py-2">
                        <span className="mr-1">
                          {countryToFlag(item.country)}
                        </span>
                        {item.country?.trim()}
                      </td>

                      <td className="px-2 py-2">
                        ${splitDecimals(depositStr)}
                      </td>
                      <td className="px-2 py-2">
                        {splitDecimals(volumeStr)}
                      </td>
                      <td className="px-2 py-2">
                        ${splitDecimals(commStr)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="px-2 py-4 text-center" colSpan={5}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
