/* eslint-disable @typescript-eslint/no-explicit-any */
import { MdCalendarMonth } from "react-icons/md";
import { splitDecimals } from "@/core/utils/splitDecimals";
import { FaCalendarWeek, FaDollarSign, FaRegCalendarPlus } from "react-icons/fa6";

export default function EarningSummary({ commissionSummary }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6 text-sm">
    <div className="dark:text-slate-300 dark:bg-slate-800 bg-slate-50 rounded-2xl border dark:border-slate-700 border-slate-300 p-5 text-slate-600 shadow flex flex-col gap-2">
      <div className="flex items-center gap-3 ">
        <FaDollarSign className="text-blue-400" size={28} />
        <p className="font-medium ">Total Commissions</p>
      </div>
      <h2 className="text-4xl text-blue-400 font-bold">
        ${splitDecimals(commissionSummary.total.toFixed(2))}
      </h2>
    </div>
  
    <div className="text-slate-700 dark:bg-slate-800 bg-slate-50 rounded-2xl border dark:border-slate-700 border-slate-300 p-5 dark:text-slate-600 shadow flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <MdCalendarMonth className="text-green-500" size={28} />
        <p className="font-medium">This Month</p>
      </div>
      <h2 className="text-4xl text-green-500 font-bold">
        ${splitDecimals(commissionSummary.thisMonth.toFixed(2))}
      </h2>
    </div>
  
    <div className="dark:text-slate-300 dark:bg-slate-800 bg-slate-50 rounded-2xl border dark:border-slate-700 border-slate-300 p-5 text-slate-600 shadow flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <FaRegCalendarPlus className="text-yellow-500" size={28} />
        <p className="font-medium ">Last 7 Days</p>
      </div>
      <h2 className="text-4xl text-yellow-500 font-bold">
        ${splitDecimals(commissionSummary.last7.toFixed(2))}
      </h2>
    </div>
  
    <div className="dark:text-slate-300 dark:bg-slate-800 bg-slate-50 rounded-2xl border dark:border-slate-700 border-slate-300 p-5 text-slate-600 shadow flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <FaCalendarWeek className="text-purple-500" size={28} />
        <p className="font-medium ">This Week</p>
      </div>
      <h2 className="text-4xl text-purple-500 font-bold">
        ${splitDecimals(commissionSummary.thisWeek.toFixed(2))}
      </h2>
    </div>
  </div>
  );
}
