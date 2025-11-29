/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaCoins, FaUsers, FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { useUserAnalyzer } from "@/core/hooks/useUserAnalyzer";
import { COMMISION_BASE } from "@/core/utils/GlobalVars";
import { splitDecimals } from "@/core/utils/splitDecimals";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

interface UntriggeredDepositsNavbarProps {
  registrationsReport: any[];
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  showFullDetails?: boolean;
}

export default function UntriggeredDepositsNavbar({ 
  registrationsReport, 
  isExpanded = false, 
  onToggleExpanded,
  showFullDetails = false 
}: UntriggeredDepositsNavbarProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const {
    getSummaryUntrigger,
    getUntriggerDeposits,
  } = useUserAnalyzer(registrationsReport, { commissionRequired: true });

  const summary = getSummaryUntrigger();
  const untriggerDeposits = getUntriggerDeposits();

  // Calculate key metrics
  const totalPotentialEarnings = (summary?.count * COMMISION_BASE) || 0;
  const readyToTrigger = untriggerDeposits.filter(item => 
    (item.net_deposits || 0) >= 300 && (item.volume || 0) >= 1
  ).length;
  const needsAttention = untriggerDeposits.length - readyToTrigger;

  const handleNavigateToDetails = () => {
    navigate('/untrigger');
  };

  // Minimalistic compact version
  if (!showFullDetails) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className="relative"
      >
        <div 
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-700 cursor-pointer transition-all duration-200 hover:shadow-md"
          onClick={handleNavigateToDetails}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-md flex items-center justify-center">
            <FaExclamationTriangle className="w-3 h-3 text-white" />
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="font-semibold text-orange-700 dark:text-orange-300">
              {untriggerDeposits.length}
            </span>
            <span className="text-orange-600 dark:text-orange-400">
              Untriggered
            </span>
          </div>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50"
            >
              Click to view details
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }

  // Expanded version with more details
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-700 rounded-xl p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <FaExclamationTriangle className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-200">
              Untriggered Deposits
            </h3>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              {untriggerDeposits.length} users need attention
            </p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggleExpanded}
          className="p-1 rounded-md hover:bg-orange-100 dark:hover:bg-orange-800/30 transition-colors"
        >
          {isExpanded ? (
            <FaChevronUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          ) : (
            <FaChevronDown className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          )}
        </motion.button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-2">
          <div className="flex items-center gap-2 mb-1">
            <FaCoins className="w-3 h-3 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
              Potential
            </span>
          </div>
          <div className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
            $ {splitDecimals(totalPotentialEarnings.toFixed(0))}
          </div>
        </div>

        <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-2">
          <div className="flex items-center gap-2 mb-1">
            <FaUsers className="w-3 h-3 text-green-600" />
            <span className="text-xs font-medium text-green-700 dark:text-green-300">
              Ready
            </span>
          </div>
          <div className="text-sm font-bold text-green-800 dark:text-green-200">
            {readyToTrigger}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-orange-700 dark:text-orange-300">
                  Need Attention: {needsAttention}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 dark:text-green-300">
                  Ready: {readyToTrigger}
                </span>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNavigateToDetails}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-medium py-2 px-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
            >
              View Full Report
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
