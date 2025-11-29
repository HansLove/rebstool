/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useMemo, useState } from "react";
import { FaDollarSign, FaEthereum, FaFileContract, FaWallet } from "react-icons/fa6";
import { SiBnbchain } from "react-icons/si";
import { splitDecimals } from "@/core/utils/splitDecimals";
import useAuth from "@/core/hooks/useAuth";
import { http } from "@/core/utils/http_request";
import MiniTutorial from "@/components/MiniTutorial";
import SubAffiliatesTable from "@/modules/subAffiliates/components/PartnersTable";
import { Clock } from "lucide-react";

const payoutData = {
  // totalEarned: 2689.62,
  totalEarned: 200,
  pendingPayout: 100,
  readyToPay: 100,
};

const PayoutsPage: FC = () => {
  const { getUser } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    if (getUser().rol==2) {
        (async () => {
      try {

        const res = await http.get("subaffiliate/byUser/"+getUser().id);
        console.log("Payments data:", res.data.data);
        setPayments(res.data.data || []);
      } catch (err: any) {
        console.error("Payment fetch error:", err);
      }
    })();
    }

  }, []);

 const totalEarned = useMemo(() => {
    return payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  }, [payments]);
  const percentPending = Math.min(100, (payoutData.pendingPayout / totalEarned) * 100);

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-2xl p-6 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Payout Overview</h1>
        <p className="text-indigo-100">Track your earnings and available withdrawals</p>
      </div>

      {/* Sub-Affiliate Payout Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {/* Total Earned */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between p-4 sm:p-6">
            <div className="flex-1">
              <h3 className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                Total Earned
              </h3>
              <div className="space-y-1">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">
                  ${splitDecimals(totalEarned.toFixed(2))}
                </span>
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-2 gap-2">
                  <span className="text-yellow-500 font-semibold">USDT</span>
                  <span className="flex items-center gap-1">
                    <SiBnbchain className="w-3 h-3" />
                    BSC
                  </span>
                </div>
              </div>
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
              <FaWallet className="text-white w-6 h-6 sm:w-8 sm:h-8" />
            </div>
          </div>
        </div>

        {/* Pending Payout */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between p-4 sm:p-6">
            <div className="flex-1">
              <h3 className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                Pending Payout
              </h3>
              <div className="space-y-1">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">
                  ${payoutData.pendingPayout.toFixed(2)}
                </span>
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                  <span className="text-blue-500 font-semibold">Awaiting conditions</span>
                </div>
                <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentPending}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center relative">
              <Clock className="text-white w-6 h-6 sm:w-8 sm:h-8" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Available for Withdrawal */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between p-4 sm:p-6">
            <div className="flex-1">
              <h3 className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                Available for Withdrawal
              </h3>
              <div className="space-y-1">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">
                  ${splitDecimals(payoutData.readyToPay.toFixed(2))}
                </span>
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-2 gap-2">
                  <span className="text-green-500 font-semibold">Ready</span>
                  <span className="flex items-center gap-1">
                    <FaFileContract className="w-3 h-3" />
                    <FaEthereum className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <FaDollarSign className="text-white w-6 h-6 sm:w-8 sm:h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Sub-affiliate registration table */}
      <SubAffiliatesTable data={payments} />
      <br/>
      <MiniTutorial />
    </div>
  );
};

export default PayoutsPage;
