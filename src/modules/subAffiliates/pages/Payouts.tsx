/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useMemo, useState } from "react";
import { Wallet, TrendingUp, Clock, CheckCircle, Users, Target } from "lucide-react";

import PaymentsRegistersTable from "@/modules/subAffiliates/pages/PaymentsRegistersTable";
import { usePayouts } from "@/core/hooks/usePayouts";
import { useOutletContext } from "react-router-dom";
import PaymentHistoryTable from "@/modules/subAffiliates/components/PaymentHistoryTable";
import CircularProgress from "@/modules/subAffiliates/components/CircularProgress";
import SubsResumeHeader from "@/modules/subAffiliates/components/SubsResumeHeader";
import EarningsMotivator from "@/components/storytime/EarningsMotivator";
import { WithdrawModal, USDTNetwork } from '@taloon/nowpayments-components';
import useWithdrawModal from '@/modules/subAffiliates/hooks/useWithdrawModal';

import '@taloon/nowpayments-components/styles';

type TabType = 'available' | 'pending';

const PayoutsPage: FC = () => {
  const { registrationsReport, deal } = useOutletContext<any>();
  const { filteredData, payments } = usePayouts(registrationsReport);
  const [activeTab, setActiveTab] = useState<TabType>('available');
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const { handleWithdrawSubmit, handleWithdrawSuccess, handleWithdrawError } = useWithdrawModal();

  // Create enriched registrations for SubsResumeHeader
  const enrichedRegistrations = useMemo(() => {
    return filteredData.map((reg: any) => {
      const payment = payments.find((p) => p.ce_user_id === reg.ce_user_id);
      return { ...reg, paid: !!payment, paymentDetails: payment || null };
    });
  }, [filteredData, payments]);

  // Calculate earnings statistics
  const availableToWithdraw = useMemo(() => {
    return filteredData
      .filter((r: any) => {
        if (!r.qualification_date || r.paid) return false;
        const qualificationDate = new Date(r.qualification_date).getTime();
        const deadline = qualificationDate + 30 * 24 * 60 * 60 * 1000;
        return Date.now() >= deadline;
      })
      .reduce((sum: number, r: any) => sum + (r.commission || 0), 0);
  }, [filteredData]);

  const pendingQualification = useMemo(() => {
    return filteredData
      .filter((r: any) => {
        if (r.paid) return false;
        if (!r.qualification_date) return true;
        const qualificationDate = new Date(r.qualification_date).getTime();
        const deadline = qualificationDate + 30 * 24 * 60 * 60 * 1000;
        return Date.now() < deadline;
      })
      .reduce((sum: number, r: any) => sum + (r.commission || 0), 0);
  }, [filteredData]);

  const totalClaimed = useMemo(() => {
    return payments.reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);
  }, [payments]);

  const totalEarned = useMemo(() => {
    return availableToWithdraw + pendingQualification + totalClaimed;
  }, [availableToWithdraw, pendingQualification, totalClaimed]);

  // Calculate next payout countdown
  const nextPayoutInfo = useMemo(() => {
    const pendingRegistrations = filteredData.filter((r: any) => {
      if (!r.qualification_date || r.paid) return false;
      const qualificationDate = new Date(r.qualification_date).getTime();
      const deadline = qualificationDate + 30 * 24 * 60 * 60 * 1000;
      return Date.now() < deadline;
    });

    if (pendingRegistrations.length === 0) {
      return { days: 0, amount: 0 };
    }

    const nextDeadline = Math.min(
      ...pendingRegistrations.map((r: any) => {
        const qualificationDate = new Date(r.qualification_date).getTime();
        return qualificationDate + 30 * 24 * 60 * 60 * 1000;
      })
    );

    const daysRemaining = Math.ceil((nextDeadline - Date.now()) / (1000 * 60 * 60 * 24));
    return { days: daysRemaining, amount: pendingQualification };
  }, [filteredData, pendingQualification]);

  // Filter data based on active tab
  const tabFilteredData = useMemo(() => {
    if (activeTab === 'available') {
      return filteredData.filter((r: any) => {
        if (!r.qualification_date || r.paid) return false;
        const qualificationDate = new Date(r.qualification_date).getTime();
        const deadline = qualificationDate + 30 * 24 * 60 * 60 * 1000;
        return Date.now() >= deadline;
      });
    } else {
      return filteredData.filter((r: any) => {
        if (r.paid) return false;
        if (!r.qualification_date) return true;
        const qualificationDate = new Date(r.qualification_date).getTime();
        const deadline = qualificationDate + 30 * 24 * 60 * 60 * 1000;
        return Date.now() < deadline;
      });
    }
  }, [filteredData, activeTab]);

  const progressPercentage = totalEarned > 0 ? (availableToWithdraw / totalEarned) * 100 : 0;

  // Calculate weekly activity metrics
  const weeklyMetrics = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const newRegistrationsThisWeek = filteredData.filter(
      (r: any) => new Date(r.registration_date) >= oneWeekAgo
    ).length;

    const enrichedRegistrations = filteredData.map((reg: any) => {
      const payment = payments.find((p) => p.ce_user_id === reg.ce_user_id);
      return { ...reg, paid: !!payment, paymentDetails: payment || null };
    });

    const paidCount = enrichedRegistrations.filter((r) => r.paid).length;
    const unpaidCount = enrichedRegistrations.length - paidCount;
    const bonusThreshold = 10;
    const bonusAmount = 300;
    const progressPercentage = Math.min((paidCount / bonusThreshold) * 100, 100);

    return {
      newRegistrationsThisWeek,
      paidCount,
      unpaidCount,
      totalRegistrations: enrichedRegistrations.length,
      bonusThreshold,
      bonusAmount,
      progressPercentage,
    };
  }, [filteredData, payments]);

  return (
    // <div className="mx-auto max-w-[1400px] px-4 pb-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
    <div className="mx-auto px-4 pb-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        availableBalance={availableToWithdraw}
        balanceToUsdtConverter={async (amount: number) => {
          // Convert balance to USDT (1:1 conversion for now)
          return amount;
        }}
        showPoweredByNowpayments={false}
        onSubmit={handleWithdrawSubmit}
        supportedNetworks={[USDTNetwork.USDTMATIC]}
        onSuccess={response => {
          const withdrawalDetails = handleWithdrawSuccess(response);
          console.log('Withdrawal successful:', withdrawalDetails);
          return withdrawalDetails;
        }}
        onError={error => {
          const errorMessage = handleWithdrawError(error);
          console.error('Withdrawal failed:', errorMessage);
          return errorMessage;
        }}
      />

      {/* Page Header */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 p-6">
        <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">Claim Your Earnings</h1>
        <p className="text-indigo-100">Withdraw your available commissions to USDT-MATIC</p>
      </div>

      {/* Deal & Commission Summary Header */}
      <SubsResumeHeader
        deal={deal}
        enrichedRegistrations={enrichedRegistrations}
      />

      {/* Hero Section - Earnings Motivator & Stats */}
      <div className="mb-8">
        {/* Earnings Motivator - Main Focus */}
        <EarningsMotivator
          availableToWithdraw={availableToWithdraw}
          totalEarned={totalEarned}
          pendingAmount={pendingQualification}
          claimedAmount={totalClaimed}
          weeklyGoal={1000}
          monthlyGoal={5000}
        />
      </div>

      {/* Secondary Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Circular Progress - Claim Card */}
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-2xl lg:col-span-5 dark:border-slate-700 dark:from-slate-900 dark:to-black">
          <div className="flex flex-col items-center">
            <CircularProgress
              value={availableToWithdraw}
              percentage={progressPercentage}
              label="USDT"
              subLabel="Available to claim"
            />

            {/* Claim Button */}
            <button
              disabled={availableToWithdraw === 0}
              onClick={() => setIsWithdrawModalOpen(true)}
              className={`mt-8 flex w-full max-w-xs transform items-center justify-center gap-3 rounded-full px-12 py-4 text-lg font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
                availableToWithdraw > 0
                  ? 'bg-gradient-to-r from-lime-400 to-green-500 text-slate-900 shadow-lg shadow-lime-500/30 hover:shadow-lime-500/50'
                  : 'cursor-not-allowed bg-slate-700 text-slate-500'
              }`}
            >
              <Wallet size={24} />
              {availableToWithdraw > 0 ? 'Claim Now' : 'Nothing to Claim'}
            </button>

            {/* Next Payout Info */}
            {nextPayoutInfo.days > 0 && (
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Next payout in{' '}
                  <span className="font-semibold text-slate-800 dark:text-slate-300">{nextPayoutInfo.days} days</span>
                  {' • '}
                  <span className="font-semibold text-lime-600 dark:text-lime-400">
                    ${nextPayoutInfo.amount.toFixed(2)} pending
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Earnings Statistics Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-7">
          {/* Total Earned */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 transition-colors hover:border-indigo-500/50 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-lg bg-indigo-500/20 p-2">
                <TrendingUp className="text-indigo-400" size={24} />
              </div>
            </div>
            <div className="mb-1 text-3xl font-bold text-slate-800 dark:text-white">${totalEarned.toFixed(2)}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Earned</div>
          </div>

          {/* Qualified (Available) */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 transition-colors hover:border-lime-500/50 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-lg bg-lime-500/20 p-2">
                <CheckCircle className="text-lime-400" size={24} />
              </div>
            </div>
            <div className="mb-1 text-3xl font-bold text-lime-600 dark:text-lime-400">
              +${availableToWithdraw.toFixed(2)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Qualified</div>
          </div>

          {/* Pending */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 transition-colors hover:border-amber-500/50 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-lg bg-amber-500/20 p-2">
                <Clock className="text-amber-400" size={24} />
              </div>
            </div>
            <div className="mb-1 text-3xl font-bold text-amber-600 dark:text-amber-400">
              +${pendingQualification.toFixed(2)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Pending</div>
          </div>

          {/* Claimed */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 transition-colors hover:border-blue-500/50 sm:col-span-3 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/20 p-2">
                <Wallet className="text-blue-400" size={24} />
              </div>
            </div>
            <div className="mb-1 text-3xl font-bold text-blue-600 dark:text-blue-400">${totalClaimed.toFixed(2)}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Claimed</div>
          </div>
        </div>
      </div>

      {/* Weekly Activity & Qualification Progress Section */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* This Week's Activity */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 transition-colors hover:border-blue-500/50 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/20 p-2">
              <Users className="text-blue-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">This Week's Activity</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {weeklyMetrics.newRegistrationsThisWeek}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">New registrations in the last 7 days</p>
            </div>
            <div className="grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-700/30">
              <div>
                <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {weeklyMetrics.paidCount}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Users paid</p>
              </div>
              <div>
                <div className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                  {weeklyMetrics.unpaidCount}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Users unpaid</p>
              </div>
            </div>
          </div>
        </div>

        {/* Qualification Bonus Progress */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 transition-colors hover:border-purple-500/50 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-purple-500/20 p-2">
              <Target className="text-purple-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Qualification Bonus</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {weeklyMetrics.paidCount} / {weeklyMetrics.bonusThreshold} sub-affiliates paid
                </span>
                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                  +${weeklyMetrics.bonusAmount}
                </span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-3 bg-gradient-to-r from-purple-400 to-fuchsia-500 transition-all duration-500"
                  style={{ width: `${weeklyMetrics.progressPercentage}%` }}
                />
              </div>
            </div>
            {weeklyMetrics.paidCount < weeklyMetrics.bonusThreshold && (
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {weeklyMetrics.bonusThreshold - weeklyMetrics.paidCount} more
                </span>
                {' '}registrations needed to earn the bonus
              </p>
            )}
            {weeklyMetrics.paidCount >= weeklyMetrics.bonusThreshold && (
              <p className="text-xs font-semibold text-green-600 dark:text-green-400">
                Bonus threshold reached! You're eligible for the ${weeklyMetrics.bonusAmount} bonus.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Available / Pending Tabs */}
      <div className="mb-6">
        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 ${
              activeTab === 'available'
                ? 'bg-gradient-to-r from-lime-400 to-green-500 text-slate-900 shadow-lg'
                : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700/50 dark:hover:text-white'
            }`}
          >
            <CheckCircle size={18} />
            Available ({tabFilteredData.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 ${
              activeTab === 'pending'
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 shadow-lg'
                : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700/50 dark:hover:text-white'
            }`}
          >
            <Clock size={18} />
            Pending ({tabFilteredData.length})
          </button>
        </div>
      </div>

      {/* Registration Reports Section */}
      <div className="mb-6 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-4 py-4 sm:px-6">
          <h3 className="text-base font-semibold text-white">
            {activeTab === 'available' ? 'Available Registrations' : 'Pending Registrations'}
          </h3>
          <p className="mt-1 text-sm text-slate-300">
            {activeTab === 'available' ? 'Registrations ready for withdrawal' : 'Registrations waiting to qualify'}
          </p>
        </div>
        <PaymentsRegistersTable registrationReports={tabFilteredData} />
      </div>

      {/* Transaction History Section */}
      {payments.length > 0 && (
        <div className="mb-6 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-4 sm:px-6">
            <h3 className="text-base font-semibold text-white">Transaction History</h3>
            <p className="mt-1 text-sm text-blue-100">All your claimed withdrawals</p>
          </div>
          <PaymentHistoryTable data={payments} />
        </div>
      )}
    </div>
  );
};

export default PayoutsPage;
