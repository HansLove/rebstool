/* eslint-disable @typescript-eslint/no-explicit-any */

import { FaCalendar, FaChartBar, FaPiggyBank, FaRocket, FaUser, FaWallet } from "react-icons/fa6";
import { splitDecimals } from "@/core/utils/splitDecimals";
import { GiCash, GiTargetArrows } from "react-icons/gi";
import { MdPieChartOutlined } from "react-icons/md";

function getProportion(
  withdrawals: number,
  firstDeposit: number,
  netDeposits: number
) {
  const total = firstDeposit + netDeposits;
  return total > 0 ? (withdrawals / total) * 100 : 0;
}

function WithdrawalRatioBar({
  withdrawals,
  firstDeposit,
  netDeposits,
}: {
  withdrawals: number;
  firstDeposit: number;
  netDeposits: number;
}) {
  const percent = getProportion(withdrawals, firstDeposit, netDeposits);
  const barColor =
    percent < 50
      ? "bg-green-500 dark:bg-green-500"
      : percent < 90
      ? "bg-yellow-500 dark:bg-yellow-500"
      : "bg-red-500 dark:bg-red-500";

  return (
    <div className="w-full">
      <div className="w-full bg-gray-300 dark:bg-gray-700 rounded h-3 mb-1">
        <div
          className={`h-3 ${barColor} rounded`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <div className="text-xs text-gray-700 dark:text-gray-300 font-bold text-right">
        {percent.toFixed(2)}%
      </div>
    </div>
  );
}

export default function WithdrawalsTable({
  withdrawalRecords = [],
  title = "Withdrawal Records",
}: {
  withdrawalRecords: any[];
  title?: string;
}) {
  return (
    <div className="mb-8">
      <h3 className="text-xl flex font-semibold mb-4 text-slate-700 dark:text-gray-100">
        <FaChartBar className="text-violet-500 dark:text-violet-400 mr-3" /> {title}
      </h3>

      <div className="overflow-x-auto border border-slate-300 dark:border-slate-700 rounded-lg shadow-md dark:shadow-lg">
        <table className="min-w-full text-sm table-auto w-full text-left">
          <thead className="bg-slate-200 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
            <tr>
              <th className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <FaUser className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> User
                </div>
              </th>
              <th className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <GiCash className="w-4 h-4 text-red-500 dark:text-red-400" /> Withdrawals
                </div>
              </th>
              <th className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <FaPiggyBank className="w-4 h-4 text-green-500 dark:text-green-400" /> Net Deposits
                </div>
              </th>
              <th className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <FaWallet className="w-4 h-4 text-blue-500 dark:text-blue-400" /> Balance
                </div>
              </th>
              <th className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <GiTargetArrows className="w-4 h-4 text-purple-500 dark:text-purple-400" /> Commission
                </div>
              </th>
              <th className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <FaRocket className="w-4 h-4 text-amber-500 dark:text-amber-400" /> First Deposit
                </div>
              </th>
              <th className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <MdPieChartOutlined className="w-4 h-4 text-cyan-500 dark:text-cyan-400" /> Ratio
                </div>
              </th>
              <th className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <FaCalendar className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Registered
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {withdrawalRecords.map((record: any, idx: number) => {
              const userId = record.ce_user_id;
              const withdrawals = record.ActivityReport?.Withdrawals || 0;
              const netDep = record.net_deposits || 0;
              const commission = record?.commission || 0;
              const firstDeposit = record?.first_deposit || 0;
              const regDate = record?.registration_date || record.createdAt;

              const balance = netDep - withdrawals;
              const balanceColor =
                balance >= 300
                  ? "text-green-600 dark:text-green-400 font-semibold"
                  : "text-yellow-600 dark:text-yellow-400";

              return (
                <tr
                  key={idx}
                  className={idx % 2 === 0 
                    ? "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700" 
                    : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
                  }
                >
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-indigo-600 dark:text-indigo-400">
                    {userId}
                  </td>
                  <td className="px-4 py-3 text-red-600 dark:text-red-400 text-center">
                    <div className="flex items-center justify-center">
                      <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full w-5 h-5 flex items-center justify-center mr-2">$</span>
                      {splitDecimals(withdrawals.toFixed(2))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-green-600 dark:text-green-400 text-center">
                    <div className="flex items-center justify-center">
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full w-5 h-5 flex items-center justify-center mr-2">$</span>
                      {splitDecimals(netDep.toFixed(2))}
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-center ${balanceColor}`}>
                    <div className="flex items-center justify-center">
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-5 h-5 flex items-center justify-center mr-2">$</span>
                      {splitDecimals(balance.toFixed(2))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-purple-600 dark:text-purple-400 text-center font-semibold">
                    <div className="flex items-center justify-center">
                      <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full w-5 h-5 flex items-center justify-center mr-2">$</span>
                      {splitDecimals(commission.toFixed(2))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full w-5 h-5 flex items-center justify-center mr-2">$</span>
                      <strong>{splitDecimals(firstDeposit.toFixed(2))}</strong>
                    </div>
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {new Date(record?.first_deposit_date).toDateString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <WithdrawalRatioBar
                      withdrawals={withdrawals}
                      firstDeposit={firstDeposit}
                      netDeposits={netDep}
                    />
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 text-sm whitespace-nowrap font-semibold text-center">
                    {new Date(regDate).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
            {withdrawalRecords.length === 0 && (
              <tr className="bg-slate-100 dark:bg-slate-800">
                <td colSpan={8} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <span className="text-2xl">📊</span>
                    <span>No withdrawal records found.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
