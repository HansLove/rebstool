/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { splitDecimals } from "@/core/utils/splitDecimals";
import GeneralStats from "@/components/dashboard/GeneralStats";
import Footer from "@/components/Footer";
import CommissionStats from "@/components/dashboard/CommissionStats";
import ReportsOverview from "@/components/dashboard/ReportsOverview";
import ActiveInactiveUsers from "@/components/dashboard/activeInactiveUsers/ActiveInactiveUsers";
import { useOutletContext } from "react-router-dom";
import WorldPerspective from "@/components/WorldPerspective";
import DashboardHeaderSummary from "@/components/dashboard/DashboardHeaderSummary";
import TopDepositsComponent from "@/components/TopDepositsComponent";
import { MdCenterFocusStrong } from "react-icons/md";
import Loading from "@/components/loaders/loading1/Loading";
import UntriggeredDepositsWidget from "@/components/dashboard/UntriggeredDepositsWidget";


export default function MasterDashboard() {
  const { registrationsReport, accounts,loading } = useOutletContext<any>();
  const [mapIsExtended, setMapIsExtended] = useState(false);
  // const [requestSent, setRequestSent] = useState(false);
  // const [error, setError] = useState<string>("");

  const summary = useMemo(() => {
    const totalRecords = registrationsReport?.length || 0;
    let totalDeposits = 0,
      totalVolume = 0,
      totalCommission = 0,
      depositUsers = 0,
      activeUsers = 0,
      inactiveUsers = 0,
      highValueUsers = 0;

    registrationsReport?.forEach((record: any) => {
      const netDeposit = record?.net_deposits || 0;
      const vol = record?.volume || 0;
      const commission = record?.commission || 0;

      if (netDeposit > 0) depositUsers++;
      if (netDeposit > 1000) highValueUsers++;
      if (vol >= 1) activeUsers++;
      if (vol === 0) inactiveUsers++;

      totalDeposits += netDeposit;
      totalVolume += vol;
      totalCommission += commission;
    });

    return {
      totalUsers: totalRecords,
      depositUsers,
      avgDeposit: depositUsers ? totalDeposits / depositUsers : 0,
      avgVolume: totalRecords ? totalVolume / totalRecords : 0,
      activeUsers,
      inactiveUsers,
      highValueUsers,
      conversionRate: totalRecords ? (depositUsers / totalRecords) * 100 : 0,
      avgCommissionPerUser: totalRecords ? totalCommission / totalRecords : 0,
      commissionToVolumeRatio: totalVolume ? totalCommission / totalVolume : 0,
      totalDeposits,
      totalVolume,
      totalCommission,
      roi: totalCommission ? totalDeposits / totalCommission : 0,
    };
  }, [registrationsReport]);


  if (loading)
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center text-center">
          <Loading />
          <p className="mt-4 text-slate-600 dark:text-slate-300">Loading account data...</p>
        </div>
      </main>
    );


  // 2) Si HAY cuenta pero aún no hay registros, mensaje de pendiente
  if (accounts[0]?.config_id == null) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/50 backdrop-blur p-6 shadow-lg">
            <p className="text-emerald-600 dark:text-emerald-400 text-lg">
              Your request has been submitted! We’ll get back to you within 48 hours.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // return (!summary?<Loading/>:
  return !summary.totalDeposits ? (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 dark:border-slate-700/60 p-8 sm:p-12 shadow-2xl">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-gradient-to-r from-blue-700 to-slate-700 rounded-2xl flex items-center justify-center">
              <MdCenterFocusStrong className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-700 to-slate-600 dark:from-blue-500 dark:to-slate-400 bg-clip-text text-transparent mb-4">
              No Data Available Yet
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              It seems there are no registrations or deposits yet. As soon as activity starts, your dashboard will come to life here.
            </p>
          </div>
        </div>
      </div>
    </main>
  ) : (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="mx-auto px-4 md:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl">
      

        {/* Summary Cards */}
        <div className="mb-6 sm:mb-8">
          <DashboardHeaderSummary summary={summary} />
        </div>

        {/* Untriggered Deposits Alert Widget */}
        <div className="mb-6 sm:mb-8">
          <UntriggeredDepositsWidget registrationsReport={registrationsReport} />
        </div>

        {/* Main Content Grid */}
        <div className="space-y-6 sm:space-y-8">
          {/* Top Section - Stats and Map */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
            {/* General Stats - Responsive width */}
            <div className={`${mapIsExtended ? "xl:col-span-5" : "xl:col-span-8"} order-1`}>
              <GeneralStats
                registrationData={registrationsReport}
                totalRegisters={summary.totalUsers}
                avgCommissionPerUser={splitDecimals(summary.avgCommissionPerUser.toFixed(2))}
              />
            </div>
            
            {/* Map and Commission Stats - Responsive width */}
            <div className={`${mapIsExtended ? "xl:col-span-7" : "xl:col-span-4"} order-2`}>
              <div className="space-y-4 sm:space-y-6">
                <WorldPerspective registrationsData={registrationsReport} />
                <CommissionStats
                  expandMap={() => setMapIsExtended(!mapIsExtended)}
                  registrationsData={registrationsReport}
                />
              </div>
            </div>
          </div>

          {/* Bottom Section - Additional Components */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            <ActiveInactiveUsers registrationsReport={registrationsReport} />
            <TopDepositsComponent data={registrationsReport} />
            <ReportsOverview registrationsData={registrationsReport} />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 sm:mt-12">
          <Footer />
        </div>
      </div>
    </main>
  );
}