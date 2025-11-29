/* eslint-disable @typescript-eslint/no-explicit-any */
import { Users, RefreshCw, Gift, Link, UserPlus, Wallet } from "lucide-react";
import { motion } from "motion/react";
// import { useState } from "react";
import useUserBalance from "@/core/hooks/useUserBalance";
import useAuth from "@/core/hooks/useAuth";
import { QuickStats } from "@/components/menus/components/QuickStats";
import InviteSubAffiliateButton from "@/modules/affiliates/components/InviteSubAffiliateButton";
import { MobileActionsMenu } from "@/modules/affiliates/components/MobileActionsMenu";

interface AffiliateActionsProps {
  runScraper: () => void;
  isScrapping: boolean;
  scraperError: string | null;
  subAffiliates: any[];
  selectedSubId: string | null;
  onSelectSubAffiliate: (id: string | null) => void;
  openDepositModal: () => void;
  openWithdrawModal: () => void;
  registrationsReport?: any[];
}




export default function MasterAffiliateHeader({
  runScraper,
  isScrapping,
  scraperError,
  subAffiliates,
  openDepositModal,
  openWithdrawModal,
}: AffiliateActionsProps) {
  const { getUser } = useAuth();
  const { totalBalance, isLoadingBalance } = useUserBalance();

  // Early return for unauthorized users
  if (getUser().rol > 2) return null;

  // Calculate metrics
  const totalSubAffiliates = subAffiliates.length;
  const activeSubAffiliates = subAffiliates.filter(sub => sub.status !== false).length;
  const lastUpdated = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="w-full">
      {/* Compact Horizontal Navbar */}
      <div className="h-14 md:h-14 bg-slate-900/95 border-b border-slate-700/50 backdrop-blur-sm">
        <div className="h-full px-5 md:px-4 flex items-center justify-between gap-3">
          
          {/* Left: Brand/Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-700 to-slate-700 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white hidden sm:block">Master Affiliate</span>
          </div>

          {/* Center: Actions (Invite, New) */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openDepositModal}
              className="flex items-center gap-1.5 px-3 py-1.5 ml-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-md text-xs text-green-400 transition-colors"
            >
              <UserPlus className="w-3 h-3" />
              <span className="hidden sm:inline">New Sub Affiliate</span>
            </motion.button>
            
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-md text-xs text-blue-400 transition-colors"
            >
              <Link className="w-3 h-3" />
            </motion.button>
          </div>

          {/* Center: KPIs */}
          <div className="flex-1 flex justify-center">
            <QuickStats
              totalBalance={totalBalance}
              totalSubAffiliates={totalSubAffiliates}
              activeSubAffiliates={activeSubAffiliates}
              lastUpdated={lastUpdated}
              isLoadingBalance={isLoadingBalance}
              onClickBalance={openDepositModal}

            />
          </div>

          {/* Invite Button - Desktop Only */}
          <div className="hidden md:block">
            <InviteSubAffiliateButton/>
          </div>

          {/* Right: Quick Actions - Desktop Version */}
          <div className="hidden md:flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={runScraper}
              disabled={isScrapping}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 rounded-md text-xs text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <motion.div
                animate={{ rotate: isScrapping ? 360 : 0 }}
                transition={{ duration: 1, repeat: isScrapping ? Infinity : 0, ease: "linear" }}
              >
                <RefreshCw className="w-3 h-3" />
              </motion.div>
              <span className="hidden sm:inline">Re-sync</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-md text-xs text-orange-400 transition-colors"
            >
              <Gift className="w-3 h-3" />
              <span className="hidden sm:inline">Rebates</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openWithdrawModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-md text-xs text-blue-400 transition-colors"
            >
              <Wallet className="w-3 h-3" />
              <span className="hidden sm:inline">Withdraw</span>
            </motion.button>

            {/* Status Indicator */}
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${isScrapping ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
              <span className="text-xs text-slate-400 hidden sm:inline">{isScrapping ? 'Syncing' : 'Ready'}</span>
            </div>
          </div>

          {/* Right: Mobile Actions Menu */}
          <div className="md:hidden flex items-center gap-3">
            <MobileActionsMenu
              runScraper={runScraper}
              isScrapping={isScrapping}
              openDepositModal={openDepositModal}
              openWithdrawModal={openWithdrawModal}
            />

            {/* Mobile Status Indicator */}
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${isScrapping ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {scraperError && (
          <div className="px-4 py-2 bg-red-900/20 border-t border-red-500/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs text-red-400">{scraperError}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
