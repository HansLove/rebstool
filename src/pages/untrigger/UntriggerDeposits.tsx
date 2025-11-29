/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/UntriggerDeposits.tsx
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { splitDecimals } from "@/core/utils/splitDecimals";
import { COMMISION_BASE } from "@/core/utils/GlobalVars";
import NotesModal from "@/components/modals/NotesModal";
import UntriggersTable from "./components/UntriggersTable";
import { useUserAnalyzer } from "@/core/hooks/useUserAnalyzer";
import { http } from "@/core/utils/http_request";
import { FaCoins, FaUsers, FaDollarSign, FaChartLine, FaUserCheck, FaDownload, FaFileCsv } from "react-icons/fa6";
import { MdCenterFocusStrong, MdWarning } from "react-icons/md";

export default function UntriggerDeposits() {
  const { registrationsReport } = useOutletContext<any>();
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const {
    getSummaryUntrigger,
    getUntriggerDeposits,
    sortBy,
    sortOrder,
    minDeposit,
    minVolume,
    setMinDeposit,
    setMinVolume,
    handleSort,
  } = useUserAnalyzer(registrationsReport, { commissionRequired: true });

  const summary = getSummaryUntrigger();
  const untriggerDeposits = getUntriggerDeposits();

  useEffect(() => {
    console.log("Untriggered Deposits", untriggerDeposits);
  }, [untriggerDeposits])
  
  const handleSaveNote = async (note: string, status?: string) => {
    if (!selectedItem) return;
    await http.post("users/addComment-tradingStats", {
      id: selectedItem.id,
      Description: note,
    });
    if (status) {
      await http.post("users/updateStatus-tradingStats", {
        id: selectedItem.id,
        status,
      });
    }
    setSelectedItem(null);
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
      [`Average Deposit,$${averageDeposit.toFixed(2)}`],
      [`Total Volume,${totalVolume.toFixed(2)} lots`],
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

  // Calculate key metrics
  const totalPotentialEarnings = (summary?.count * COMMISION_BASE) || 0;
  const averageDeposit = untriggerDeposits.length > 0 
    ? untriggerDeposits.reduce((sum, item) => sum + (item.net_deposits || 0), 0) / untriggerDeposits.length 
    : 0;
  const totalVolume = untriggerDeposits.reduce((sum, item) => sum + (item.volume || 0), 0);
  const readyToTrigger = untriggerDeposits.filter(item => 
    (item.net_deposits || 0) >= 300 && (item.volume || 0) >= 1
  ).length;
  const needsVolume = untriggerDeposits.filter(item => 
    (item.net_deposits || 0) >= 300 && (item.volume || 0) < 1
  ).length;
  const needsDeposits = untriggerDeposits.filter(item => 
    (item.net_deposits || 0) < 300
  ).length;

  return (
    <div className="w-full py-6 px-4 mb-20">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="flex items-center text-3xl font-bold text-slate-800 dark:text-white mb-2">
              Untriggered Deposits
              <span className="flex text-sm font-semibold rounded-sm text-slate-600 dark:text-indigo-600 ms-3">
                <MdCenterFocusStrong className="w-5 h-5"/>
              </span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Monitor users who haven't triggered commission requirements yet
            </p>
          </div>
          
          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="group relative inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-300 dark:focus:ring-emerald-800"
          >
            <div className="flex items-center gap-2">
              <FaDownload className="w-4 h-4 group-hover:animate-bounce" />
              <FaFileCsv className="w-4 h-4" />
              <span>Export CSV</span>
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
          </button>
        </div>
      </div>

      {/* Key Financial Metrics - Large & Prominent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {/* Users Count */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-3xl border-2 border-blue-200 dark:border-blue-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <FaUsers className="text-blue-600 dark:text-blue-400" size={28} />
            <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">Total Users</span>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-700 dark:text-blue-300 mb-1">
              {summary?.count || 0}
            </div>
            <p className="text-blue-600 dark:text-blue-400 text-sm">Users Detected</p>
          </div>
        </div>

        {/* Potential Earnings - MOST IMPORTANT */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-3xl border-2 border-emerald-200 dark:border-emerald-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <FaCoins className="text-emerald-600 dark:text-emerald-400" size={28} />
            <span className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold">💰 Money</span>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-700 dark:text-emerald-300 mb-1">
              $ {splitDecimals(totalPotentialEarnings.toFixed(0))}
            </div>
            <p className="text-emerald-600 dark:text-emerald-400 text-sm">Potential Earnings</p>
          </div>
        </div>

        {/* Ready to Trigger */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-3xl border-2 border-green-200 dark:border-green-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <FaUserCheck className="text-green-600 dark:text-green-400" size={28} />
            <span className="text-green-600 dark:text-green-400 text-sm font-semibold">Ready</span>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-700 dark:text-green-300 mb-1">
              {readyToTrigger}
            </div>
            <p className="text-green-600 dark:text-green-400 text-sm">Ready to Trigger</p>
          </div>
        </div>

        {/* Average Deposit */}
        <div className="bg-gradient-to-br from-blue-50 to-slate-100 dark:from-blue-900/20 dark:to-slate-800/20 rounded-3xl border-2 border-blue-200 dark:border-blue-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <FaDollarSign className="text-blue-600 dark:text-blue-400" size={28} />
            <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">Avg</span>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-700 dark:text-blue-300 mb-1">
              $ {splitDecimals(averageDeposit.toFixed(0))}
            </div>
            <p className="text-blue-600 dark:text-blue-400 text-sm">Avg. Deposit</p>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl border border-amber-200 dark:border-amber-700 p-4">
          <div className="flex items-center gap-3">
            <FaChartLine className="text-amber-600 dark:text-amber-400" size={24} />
            <div>
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                {totalVolume.toFixed(2)}
              </div>
              <p className="text-amber-600 dark:text-amber-400 text-sm">Total Volume (Lots)</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200 dark:border-orange-700 p-4">
          <div className="flex items-center gap-3">
            <MdWarning className="text-orange-600 dark:text-orange-400" size={24} />
            <div>
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {needsDeposits}
              </div>
              <p className="text-orange-600 dark:text-orange-400 text-sm">Need Deposits</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-slate-100 dark:from-blue-900/20 dark:to-slate-800/20 rounded-2xl border border-blue-200 dark:border-blue-700 p-4">
          <div className="flex items-center gap-3">
            <FaUsers className="text-blue-600 dark:text-blue-400" size={24} />
            <div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {needsVolume}
              </div>
              <p className="text-indigo-600 dark:text-indigo-400 text-sm">Need Volume</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters - Compact & Clean */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Filters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" htmlFor="minDeposit">
              Minimum Deposit ($)
            </label>
            <input
              id="minDeposit"
              type="number"
              value={minDeposit}
              onChange={(e) => setMinDeposit(Number(e.target.value))}
              placeholder="0"
              className="border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-700 bg-white p-3 rounded-xl dark:text-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" htmlFor="minVolume">
              Minimum Volume (Lots)
            </label>
            <input
              id="minVolume"
              type="number"
              value={minVolume}
              onChange={(e) => setMinVolume(Number(e.target.value))}
              placeholder="0"
              className="border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-700 bg-white p-3 rounded-xl dark:text-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
            User Details ({untriggerDeposits.length} users)
          </h3>
        </div>
        <UntriggersTable
          untriggeredList={untriggerDeposits}
          sortBy={sortBy}
          sortOrder={sortOrder}
          handleSort={handleSort}
          setSelectedItem={setSelectedItem}
        />
      </div>

      {selectedItem && (
        <NotesModal
          user={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSave={(note: string, status?: string) =>
            handleSaveNote(note, status)
          }
        />
      )}
    </div>
  );
}
