/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaCoins, FaUsers, FaChevronDown, FaChevronUp, FaDownload, FaFileCsv } from "react-icons/fa6";
import { useUserAnalyzer } from "@/core/hooks/useUserAnalyzer";
import { COMMISION_BASE } from "@/core/utils/GlobalVars";
import { splitDecimals } from "@/core/utils/splitDecimals";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

interface UntriggeredDepositsWidgetProps {
  registrationsReport: any[];
}

export default function UntriggeredDepositsWidget({ registrationsReport }: UntriggeredDepositsWidgetProps) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

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
  const needsVolume = untriggerDeposits.filter(item => 
    (item.net_deposits || 0) >= 300 && (item.volume || 0) < 1
  ).length;
  const needsDeposits = untriggerDeposits.filter(item => 
    (item.net_deposits || 0) < 300
  ).length;

  const handleNavigateToDetails = () => {
    navigate('/untrigger');
  };

  // CSV Export Function
  const exportToCSV = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Summary section
    const summaryLines = [
      ['UNTRIGGERED DEPOSITS REPORT'],
      [`Generated on: ${currentDate}`],
      [''],
      ['SUMMARY STATISTICS'],
      [`Total Users,${untriggerDeposits.length}`],
      [`Ready to Trigger,${readyToTrigger}`],
      [`Need Volume,${needsVolume}`],
      [`Need Deposits,${needsDeposits}`],
      [`Total Potential Earnings,$${totalPotentialEarnings.toFixed(2)}`],
      [''],
      ['USER DETAILS']
    ];

    const headers = [
      'User ID',
      'Email',
      'Name',
      'Net Deposits ($)',
      'Volume (Lots)',
      'Status',
      'Registration Date',
      'Last Activity',
      'Ready to Trigger',
      'Potential Commission ($)'
    ];

    const csvData = untriggerDeposits.map(user => [
      user.id || 'N/A',
      user.email || 'N/A',
      user.name || 'N/A',
      user.net_deposits || 0,
      user.volume || 0,
      user.status || 'Untriggered',
      user.registration_date || 'N/A',
      user.last_activity || 'N/A',
      (user.net_deposits >= 300 && user.volume >= 1) ? 'Yes' : 'No',
      ((user.net_deposits >= 300 && user.volume >= 1) ? COMMISION_BASE : 0)
    ]);

    const csvContent = [
      ...summaryLines.map(line => line.join(',')),
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `untriggered-deposits-report-${currentDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Don't render if no untriggered deposits
  if (untriggerDeposits.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
            <FaExclamationTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-orange-800 dark:text-orange-200">
              Untriggered Deposits Alert
            </h3>
            <p className="text-sm text-orange-600 dark:text-orange-400">
              {untriggerDeposits.length} users need attention • ${splitDecimals(totalPotentialEarnings.toFixed(0))} potential earnings
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Export Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportToCSV}
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            <FaDownload className="w-3 h-3" />
            <FaFileCsv className="w-3 h-3" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-800/30 transition-colors"
          >
            {isExpanded ? (
              <FaChevronUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            ) : (
              <FaChevronDown className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <FaCoins className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              Potential Earnings
            </span>
          </div>
          <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
            $ {splitDecimals(totalPotentialEarnings.toFixed(0))}
          </div>
        </div>

        <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <FaUsers className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-300">
              Ready to Trigger
            </span>
          </div>
          <div className="text-2xl font-bold text-green-800 dark:text-green-200">
            {readyToTrigger}
          </div>
        </div>

        <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <FaExclamationTriangle className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
              Need Attention
            </span>
          </div>
          <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">
            {needsVolume + needsDeposits}
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
            className="space-y-4"
          >
            {/* Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/40 dark:bg-slate-800/40 rounded-lg p-3">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Need Volume</div>
                <div className="text-lg font-semibold text-slate-800 dark:text-slate-200">{needsVolume}</div>
              </div>
              <div className="bg-white/40 dark:bg-slate-800/40 rounded-lg p-3">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Need Deposits</div>
                <div className="text-lg font-semibold text-slate-800 dark:text-slate-200">{needsDeposits}</div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNavigateToDetails}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium py-3 px-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200"
              >
                View Full Report
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={exportToCSV}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200"
              >
                Export CSV
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
