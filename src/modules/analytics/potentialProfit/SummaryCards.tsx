// src/pages/potentialProfit/SummaryCards.tsx
import { GiCash } from "react-icons/gi";
import { FaUser, FaArrowDown } from "react-icons/fa6";
import { FiArrowDownCircle, FiTrendingUp } from "react-icons/fi";
import { LuTrendingUp } from "react-icons/lu";
import { splitDecimals } from "@/core/utils/splitDecimals";
import { COMMISION_BASE } from "@/core/utils/GlobalVars";

interface SummaryCardsProps {
  count: number;
  totalMissingDeposit: number;
  totalMissingVolume: number;
  averageMissingDeposit: number;
  averageMissingVolume: number;
}

export function SummaryCards({
  count,
  totalMissingDeposit,
  totalMissingVolume,
  averageMissingDeposit,
  averageMissingVolume,
}: SummaryCardsProps) {
  return (
    <div className="grid md:grid-cols-6 gap-4 mb-6">
      <Card>
        <GiCash className="w-6 h-6 text-blue-500" />
        <p className="text-xs">Potential Profit</p>
        <strong className="text-2xl text-blue-500">
          ${splitDecimals(count * COMMISION_BASE)}
        </strong>
      </Card>
      <Card>
        <FaUser className="w-6 h-6 text-green-500" />
        <p className="text-xs">Total Users</p>
        <strong className="text-2xl text-green-500">{count}</strong>
      </Card>
      <Card>
        <FaArrowDown className="w-6 h-6 text-amber-500" />
        <p className="text-xs">Missing Total Deposits</p>
        <strong className="text-2xl text-amber-500">
          ${splitDecimals(totalMissingDeposit.toFixed(2))}
        </strong>
      </Card>
      <Card>
        <FiArrowDownCircle className="w-6 h-6 text-violet-500" />
        <p className="text-xs">Missing Total Volume</p>
        <strong className="text-2xl text-violet-500">
          {totalMissingVolume.toFixed(2)} lots
        </strong>
      </Card>
      <Card>
        <FiTrendingUp className="w-6 h-6 text-teal-500" />
        <p className="text-xs">Avg. Deposit Needed per User</p>
        <strong className="text-2xl text-teal-500">
          ${averageMissingDeposit.toFixed(2)}
        </strong>
      </Card>
      <Card>
        <LuTrendingUp className="w-6 h-6 text-cyan-500" />
        <p className="text-xs">Avg. Volume Needed per User</p>
        <strong className="text-2xl text-cyan-500">
          {averageMissingVolume.toFixed(2)} lots
        </strong>
      </Card>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark:bg-slate-800 bg-slate-50 border border-slate-300 dark:border-slate-700 dark:text-white text-slate-700 rounded-xl p-4 flex flex-col items-start gap-2">
      {children}
    </div>
  );
}
