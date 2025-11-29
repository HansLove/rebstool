import USDTSvg from "@/modules/subAffiliates/assets/usdt-svgrepo-com.svg";
import { splitDecimals } from "@/core/utils/splitDecimals";
import { useMemo } from "react";
import { FaDollarSign, FaFileContract, FaClock, FaHandshake } from "react-icons/fa6";

// export default function SubsResumeHeader({ enrichedRegistrations, payments, deal }) {
export default function SubsResumeHeader({ enrichedRegistrations, deal }) {
  // ---- Calculations ----
  // const totalPaid = useMemo(
  //   () => payments.reduce((sum, p) => sum + Number(p.amount || 0), 0),
  //   [payments]
  // );

  const unpaidRecords = useMemo(
    () => enrichedRegistrations.filter((r) => !r.paid || !r.paymentDetails),
    [enrichedRegistrations]
  );

  const qualifiedRecords = useMemo(
    () => enrichedRegistrations.filter((r) => (r.commission || 0) > 0),
    [enrichedRegistrations]
  );

  const totalRegistrations = enrichedRegistrations.length;
  const qualifiedCount = qualifiedRecords.length;

  // total earned so far from commissions (based on deal per qualified record)
  const totalCommissionValue = useMemo(
    () => qualifiedCount * (deal || 0),
    [qualifiedCount, deal]
  );

  const pendingCommissionValue = useMemo(
    () => unpaidRecords.length * (deal || 0),
    [unpaidRecords, deal]
  );

  const avgTimeToDeposit = useMemo(() => {
    const deltas = enrichedRegistrations
      .filter((r) => r.first_deposit_date)
      .map((r) => {
        const reg = new Date(r.registration_date).getTime();
        const dep = new Date(r.first_deposit_date).getTime();
        return (dep - reg) / (1000 * 60 * 60 * 24);
      });
    const sum = deltas.reduce((acc, d) => acc + d, 0);
    return deltas.length ? (sum / deltas.length).toFixed(1) : "--";
  }, [enrichedRegistrations]);

  // ---- Render ----
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
      {/* Current Deal */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <div className="flex-1">
            <h3 className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Current Deal
            </h3>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">
                ${splitDecimals((deal || 0).toFixed(2))}
              </span>
              <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-2 gap-1">
                <img src={USDTSvg} className="w-4 h-4" />
                <span className="text-green-600 dark:text-green-400 font-semibold">USDT</span>
              </div>
            </div>
          </div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-xl flex items-center justify-center">
            <FaHandshake className="text-white w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </div>
      </div>

      {/* Total Commission Earned */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <div className="flex-1">
            <h3 className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Total Earned (Qualified)
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">
                  ${splitDecimals(totalCommissionValue.toFixed(2))}
                </span>
                <img src={USDTSvg} className="w-5 h-5" />
              </div>
              <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                <span className="text-emerald-500 font-semibold">{qualifiedCount}</span>
                <span className="ml-1">of {totalRegistrations} qualified</span>
              </div>
            </div>
          </div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
            <FaDollarSign className="text-white w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </div>
      </div>

      {/* Pending Commission */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <div className="flex-1">
            <h3 className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Pending Commission
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">
                  ${splitDecimals(pendingCommissionValue.toFixed(2))}
                </span>
                <img src={USDTSvg} className="w-5 h-5" />
              </div>
              <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                <span className="text-blue-500 font-semibold">{unpaidRecords.length}</span>
                <span className="ml-1">unpaid referrals</span>
              </div>
            </div>
          </div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <FaFileContract className="text-white w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </div>
      </div>

      {/* Avg Time to First Deposit */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <div className="flex-1">
            <h3 className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Avg Time to Deposit
            </h3>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">
                {avgTimeToDeposit}
              </span>
              <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                <span className="text-orange-500 font-semibold">days average</span>
              </div>
            </div>
          </div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
            <FaClock className="text-white w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </div>
      </div>
    </div>
  );
}