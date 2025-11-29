/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { splitDecimals } from "@/core/utils/splitDecimals";
import { IProps } from "./types/IProps";
import { differenceInDays, format } from "date-fns";
import emojiFlags from "emoji-flags";
import { getCountryName } from "@/core/utils/getCountryName";
import { Link } from "react-router-dom";
import { FaCoins, FaExpand, FaUserCheck, FaClock } from "react-icons/fa6";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { MdAirplanemodeInactive, MdTimeline, MdInsights } from "react-icons/md";
import { HiOutlineClock } from "react-icons/hi2";

export default function ActiveInactiveUsers({ registrationsReport }: IProps) {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"active" | "inactive" | "insights" | null>(
    null
  );

  const activeThreshold = 1;

  const getFlag = (countryCode: string) => {
    const country = emojiFlags.countryCode(countryCode.toUpperCase());
    return country ? country.emoji : "🌐";
  };

  const getTimeBasedInsights = useMemo(() => {
    const dataArray = Array.isArray(registrationsReport)
      ? registrationsReport
      : [registrationsReport];
    
    const now = new Date();

    let activeCount = 0;
    let inactiveCount = 0;
    let totalActiveVolume = 0;
    let recentlyActive = 0;
    let dormantUsers = 0;
    let newUsers = 0;
    let atRiskUsers = 0;

    // Time-based categorization
    const inactiveByTime = {
      recent: [] as any[], // 0-7 days
      moderate: [] as any[], // 8-30 days  
      longTerm: [] as any[], // 31-90 days
      dormant: [] as any[] // 90+ days
    };

    dataArray?.forEach((user: any) => {
      const vol = parseFloat(user?.volume) || 0;
      const regDate = user?.qualification_date ? new Date(user?.qualification_date) : null;
      const daysSinceReg = regDate ? differenceInDays(now, regDate) : 0;
      
      if (vol >= activeThreshold) {
        activeCount++;
        totalActiveVolume += vol;
        
        // Recently active (last 7 days)
        if (daysSinceReg <= 7) {
          recentlyActive++;
        }
      } else {
        inactiveCount++;
        
        // Categorize inactive users by time
        if (daysSinceReg <= 7) {
          inactiveByTime.recent.push(user);
          newUsers++;
        } else if (daysSinceReg <= 30) {
          inactiveByTime.moderate.push(user);
          atRiskUsers++;
        } else if (daysSinceReg <= 90) {
          inactiveByTime.longTerm.push(user);
        } else {
          inactiveByTime.dormant.push(user);
          dormantUsers++;
        }
      }
    });

    // Calculate engagement trends
    const totalUsers = dataArray.length;
    const activeRate = totalUsers > 0 ? (activeCount / totalUsers) * 100 : 0;
    const newUserRate = totalUsers > 0 ? (newUsers / totalUsers) * 100 : 0;
    const atRiskRate = totalUsers > 0 ? (atRiskUsers / totalUsers) * 100 : 0;

    return {
      activeCount,
      inactiveCount,
      totalActiveVolume,
      recentlyActive,
      dormantUsers,
      newUsers,
      atRiskUsers,
      inactiveByTime,
      totalUsers,
      activeRate,
      newUserRate,
      atRiskRate
    };
  }, [registrationsReport]);

  const { topUsers, noVolumeUsers } = useMemo(() => {
    const sorted = [...registrationsReport].sort(
      (a: any, b: any) => (b.volume || 0) - (a.volume || 0)
    );
    const top = sorted.filter((u: any) => u.volume > 0);
    const noVol = sorted.filter((u) => !u.volume || u.volume === 0);
    return { topUsers: top, noVolumeUsers: noVol };
  }, [registrationsReport]);

  const handleShowModal = (type: "active" | "inactive" | "insights") => {
    setModalType(type);
    setShowModal(true);
  };

  const tableRows = [
    {
      label: "Active Users",
      value: getTimeBasedInsights.activeCount,
      colorClass: "bg-green-500",
      onClick: () => handleShowModal("active"),
      icon: FaUserCheck,
      trend: getTimeBasedInsights.activeRate.toFixed(1) + "%"
    },
    {
      label: "Inactive Users", 
      value: getTimeBasedInsights.inactiveCount,
      colorClass: "bg-red-500",
      onClick: () => handleShowModal("inactive"),
      icon: MdAirplanemodeInactive,
      trend: (100 - getTimeBasedInsights.activeRate).toFixed(1) + "%"
    },
    {
      label: "Time Insights",
      value: "View",
      colorClass: "bg-blue-500",
      onClick: () => handleShowModal("insights"),
      icon: MdInsights,
      trend: "Analysis"
    },
  ];

  return (
    <div className="sm:col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-1 h-full ">
      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border text-white w-full border-slate-400 dark:border-slate-600 relative overflow-hidden   h-full">
        <div className="flex card-header justify-between items-center p-2 bg-slate-50 dark:bg-slate-800">
          <h4 className="font-medium text-slate-800 dark:text-slate-200">Active vs. Inactive Users</h4>
          <Link
            to="/activyAnalysis"
          className="block ml-auto py-1 text-sm  text-slate-800 dark:text-slate-50"
          >
            <FaExpand />
          </Link>
        </div>
        <div className="card-body  bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
          <div className="mb-4 space-y-3">
            {/* Main Stats */}
            <div className="flex justify-center gap-6 items-center">
              <div className="flex items-center gap-2">
                <FaUserCheck className="text-green-400" size={24} />
                <span className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                  Active: {getTimeBasedInsights.activeCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MdAirplanemodeInactive className="text-red-400" size={24} />
                <span className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                  Inactive: {getTimeBasedInsights.inactiveCount}
                </span>
              </div>
            </div>

            {/* Time-based Insights */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-200 dark:bg-slate-700 p-2 rounded-lg text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <FaClock className="text-blue-400" size={12} />
                  <span className="font-semibold">New Users</span>
                </div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {getTimeBasedInsights.newUsers}
                </div>
                <div className="text-xs text-slate-500">
                  Last 7 days
                </div>
              </div>
              <div className="bg-slate-200 dark:bg-slate-700 p-2 rounded-lg text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <FiTrendingDown className="text-orange-400" size={12} />
                  <span className="font-semibold">At Risk</span>
                </div>
                <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {getTimeBasedInsights.atRiskUsers}
                </div>
                <div className="text-xs text-slate-500">
                  8-30 days
                </div>
              </div>
            </div>

            {/* Volume and Engagement */}
            <div className="flex justify-center items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
              <FaCoins size={18} className="text-yellow-400" />
              <span>
                Total Active Volume: $
                {splitDecimals(getTimeBasedInsights.totalActiveVolume.toFixed(2))}
              </span>
            </div>
            
            <div className="flex justify-center items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <FiTrendingUp className="text-green-400" size={12} />
                <span>Engagement: {getTimeBasedInsights.activeRate.toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-1">
                <HiOutlineClock className="text-slate-400" size={12} />
                <span>Dormant: {getTimeBasedInsights.dormantUsers}</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto text-slate-800 dark:text-slate-200">
            <table className="min-w-full text-sm">
              <thead className="">
                <tr>
                  <th className="p-3 text-xs font-medium text-left">Metric</th>
                  <th className="p-3 text-xs font-medium text-left">Value</th>
                  <th className="p-3 text-xs font-medium text-left">Trend</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, idx) => {
                  const IconComponent = row.icon;
                  return (
                    <tr
                      key={idx}
                      className=" border-b border-dashed  cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      onClick={row.onClick}
                    >
                      <td className="p-3 text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center">
                        <span
                          className={`w-2 h-2 rounded-full ${row.colorClass} inline-block mr-2`}
                        />
                        <IconComponent className="mr-2" size={14} />
                        {row.label}
                      </td>
                      <td className="p-3 text-sm text-slate-800 dark:text-slate-200 font-semibold">{row.value}</td>
                      <td className="p-3 text-xs text-slate-600 dark:text-slate-400">{row.trend}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 mt-2 ">
            * A user is considered active if their volume is at least{" "}
            {activeThreshold}.
          </p>
        </div>
      </div>

      {showModal && (
  <div
    onClick={() => setShowModal(false)}
    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-300"
  >
    <div 
      onClick={(e) => e.stopPropagation()} 
      className="[background:linear-gradient(45deg,#172033,theme(colors.slate.800)_50%,#172033)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.600/.48)_80%,_theme(colors.indigo.500)_86%,_theme(colors.indigo.300)_90%,_theme(colors.indigo.500)_94%,_theme(colors.slate.600/.48))_border-box] rounded-2xl border border-transparent animate-border w-full max-w-4xl h-[85vh] overflow-hidden shadow-2xl relative"
    >
      <div className="flex flex-col h-full">
        <div className="p-5 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/50">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            {modalType === "active" ? (
              <>
                <span className="bg-green-500/20 text-green-400 p-1.5 rounded-lg">🔥</span>
                Active Users Analysis
              </>
            ) : modalType === "inactive" ? (
              <>
                <span className="bg-red-500/20 text-red-400 p-1.5 rounded-lg">⚠️</span>
                Inactive Users Analysis
              </>
            ) : modalType === "insights" ? (
              <>
                <span className="bg-blue-500/20 text-blue-400 p-1.5 rounded-lg">📊</span>
                Time-Based User Insights
              </>
            ) : (
              <>
                <span className="bg-blue-500/20 text-blue-400 p-1.5 rounded-lg">🔍</span>
                User Analysis
              </>
            )}
          </h2>
          <button
            className="text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-600 rounded-full p-2 transition-colors duration-200"
            onClick={() => setShowModal(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18"></path>
              <path d="M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5">
          {modalType === "insights" ? (
            <div className="space-y-6">
              {/* Time-based User Distribution */}
              <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                <h4 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <MdTimeline className="text-blue-400" size={20} />
                  User Activity Timeline
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-400">{getTimeBasedInsights.newUsers}</div>
                    <div className="text-sm text-slate-300">New Users</div>
                    <div className="text-xs text-slate-400">0-7 days</div>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-400">{getTimeBasedInsights.atRiskUsers}</div>
                    <div className="text-sm text-slate-300">At Risk</div>
                    <div className="text-xs text-slate-400">8-30 days</div>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-400">{getTimeBasedInsights.inactiveByTime.longTerm.length}</div>
                    <div className="text-sm text-slate-300">Long Term</div>
                    <div className="text-xs text-slate-400">31-90 days</div>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-400">{getTimeBasedInsights.dormantUsers}</div>
                    <div className="text-sm text-slate-300">Dormant</div>
                    <div className="text-xs text-slate-400">90+ days</div>
                  </div>
                </div>
              </div>

              {/* Engagement Metrics */}
              <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                <h4 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <FiTrendingUp className="text-green-400" size={20} />
                  Engagement Metrics
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">{getTimeBasedInsights.activeRate.toFixed(1)}%</div>
                    <div className="text-sm text-slate-300">Active Rate</div>
                    <div className="text-xs text-slate-400">Users with volume ≥ $1</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">{getTimeBasedInsights.newUserRate.toFixed(1)}%</div>
                    <div className="text-sm text-slate-300">New User Rate</div>
                    <div className="text-xs text-slate-400">Registered in last 7 days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400">{getTimeBasedInsights.atRiskRate.toFixed(1)}%</div>
                    <div className="text-sm text-slate-300">At Risk Rate</div>
                    <div className="text-xs text-slate-400">8-30 days inactive</div>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown by Time Periods */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(getTimeBasedInsights.inactiveByTime).map(([period, users]) => {
                  const periodLabels = {
                    recent: "Recent (0-7 days)",
                    moderate: "Moderate (8-30 days)", 
                    longTerm: "Long Term (31-90 days)",
                    dormant: "Dormant (90+ days)"
                  };
                  const periodColors = {
                    recent: "blue",
                    moderate: "orange",
                    longTerm: "yellow", 
                    dormant: "red"
                  };
                  const color = periodColors[period as keyof typeof periodColors];
                  
                  return (
                    <div key={period} className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                      <h5 className="text-md font-semibold mb-3 text-white flex items-center gap-2">
                        <span className={`bg-${color}-500/20 text-${color}-400 p-1 rounded-lg`}>
                          {period === 'recent' ? '🆕' : period === 'moderate' ? '⚠️' : period === 'longTerm' ? '⏰' : '💤'}
                        </span>
                        {periodLabels[period as keyof typeof periodLabels]}
                      </h5>
                      <div className="text-2xl font-bold text-white mb-2">{users.length}</div>
                      <div className="text-sm text-slate-400 mb-3">users</div>
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {users.slice(0, 5).map((user: any, i: number) => {
                          const daysSince = user?.qualification_date
                            ? differenceInDays(new Date(), new Date(user?.qualification_date))
                            : 0;
                          return (
                            <div key={i} className="flex justify-between items-center text-xs bg-slate-700/30 p-2 rounded">
                              <span className="text-white truncate">{user?.customer_name || user?.ce_user_id}</span>
                              <span className="text-slate-400">{daysSince}d</span>
                            </div>
                          );
                        })}
                        {users.length > 5 && (
                          <div className="text-xs text-slate-500 text-center">
                            +{users.length - 5} more users
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              {modalType !== "inactive" && (
                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                  <h4 className="text-md font-semibold mb-3 text-white flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 p-1 rounded-lg">🔥</span>
                    Top Users by Volume
                  </h4>
                  <ul className="text-sm divide-y divide-slate-700/50 max-h-[60vh] overflow-y-auto pr-2 space-y-1">
                    {topUsers.map((u: any, i: number) => {
                      const registrationDate = u?.qualification_date
                        ? format(new Date(u?.qualification_date), "MMM dd yyyy")
                        : "N/A";
                      const daysSinceReg = u?.qualification_date
                        ? differenceInDays(
                            new Date(),
                            new Date(u?.qualification_date)
                          )
                        : "-";
                      return (
                        <li key={i} className="py-3 px-2 hover:bg-slate-700/20 rounded-lg transition-colors duration-150">
                          <div className="flex justify-between items-start">
                            <p className="text-white font-medium flex items-center">
                              <strong>{u?.customer_name || u?.ce_user_id}</strong>
                              {u?.country && (
                                <span className="text-lg ml-2 mr-1">
                                  {getFlag(u?.country.toUpperCase())}
                                </span>
                              )}
                            </p>
                            <span className="boton-user text-xs py-0.5 px-2">
                              ${u.volume.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex mt-1 text-xs text-slate-400 gap-2">
                            {u?.country && (
                              <span className="bg-slate-700/30 px-2 py-0.5 rounded-full">
                                {getCountryName(u?.country.toUpperCase())}
                              </span>
                            )}
                            <span className="bg-slate-700/30 px-2 py-0.5 rounded-full">
                              Registered: {registrationDate}
                            </span>
                            <span className="bg-slate-700/30 px-2 py-0.5 rounded-full">
                              {daysSinceReg} days ago
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {modalType !== "active" && (
                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                  <h4 className="text-md font-semibold mb-3 text-white flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 p-1 rounded-lg">⚠️</span>
                    Users with No Volume
                  </h4>
                  <ul className="text-sm divide-y divide-slate-700/50 max-h-[60vh] overflow-y-auto pr-2 space-y-1">
                    {noVolumeUsers.map((u: any, i: number) => {
                      const regDate = u?.qualification_date
                        ? format(new Date(u?.qualification_date), "MMM dd yyyy")
                        : "N/A";
                      const inactivity = u?.qualification_date
                        ? differenceInDays(
                            new Date(),
                            new Date(u?.qualification_date)
                          )
                        : "-";
                      return (
                        <li key={i} className="py-3 px-2 hover:bg-slate-700/20 rounded-lg transition-colors duration-150">
                          <p className="text-white font-medium">
                            <strong>{u?.customer_name || u?.ce_user_id}</strong>
                          </p>
                          <div className="flex mt-1 text-xs text-slate-400 gap-2">
                            <span className="bg-slate-700/30 px-2 py-0.5 rounded-full">
                              Registered: {regDate}
                            </span>
                            <span className="boton text-xs py-0.5 px-2">
                              Inactive: {inactivity} days
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
