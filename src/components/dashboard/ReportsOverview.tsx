/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { splitDecimals } from "@/core/utils/splitDecimals";
import emojiFlags from "emoji-flags";
import { getCountryName } from "@/core/utils/getCountryName";

const getColor = (country: string) => {
  const palette = [
    "bg-blue-500",
    "bg-yellow-500",
    "bg-emerald-500",
    "bg-pink-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-indigo-500",
    "bg-rose-500",
    "bg-teal-500",
    "bg-orange-500"
  ];
  const hash = country.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return palette[hash % palette.length];
};

const getFlag = (countryCode: string) => {
  const country = emojiFlags.countryCode(countryCode.toUpperCase());
  return country ? country.emoji : "🌐";
};



export default function ReportsOverview({ registrationsData = [] }: any) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const dataArray = useMemo(() => 
    Array.isArray(registrationsData) ? registrationsData : [registrationsData], 
    [registrationsData]
  );

  const { byCountry, totalCommission, conversionLeaders } = useMemo(() => {
    const map: Record<string, { commission: number; registrations: number; cpas: number }> = {};
    let total = 0;
    const MIN_DEPOSIT = 300; // Minimum deposit to qualify as CPA

    dataArray.forEach((user) => {
      const country = user.country?.trim() || "Unknown";
      const commission = user.commission || 0;
      const isCPA = (user.net_deposits || 0) >= MIN_DEPOSIT;
      
      if (!map[country]) {
        map[country] = { commission: 0, registrations: 0, cpas: 0 };
      }
      
      map[country].commission += commission;
      map[country].registrations += 1;
      if (isCPA) {
        map[country].cpas += 1;
      }
      total += commission;
    });

    // Calculate conversion leaders
    const leaders = Object.entries(map)
      .map(([country, stats]) => ({
        country,
        commission: stats.commission,
        registrations: stats.registrations,
        cpas: stats.cpas,
        conversionRate: stats.registrations > 0 ? (stats.cpas / stats.registrations) * 100 : 0
      }))
      .filter(item => item.registrations >= 3) // Only show countries with at least 3 registrations
      .sort((a, b) => b.conversionRate - a.conversionRate)
      .slice(0, 5); // Top 5 conversion leaders

    return {
      byCountry: Object.fromEntries(Object.entries(map).map(([k, v]) => [k, v.commission])),
      totalCommission: total,
      conversionLeaders: leaders
    };
  }, [dataArray]);

  const countryData = Object.entries(byCountry)
    .map(([country, commission]) => ({
      country,
      commission,
      color: getColor(country),
      percent: totalCommission > 0 ? (commission / totalCommission) * 100 : 0
    }))
    .sort((a, b) => b.commission - a.commission);

  const selectedUsers = useMemo(() => {
    if (!selectedCountry) return [];
    return dataArray.filter((user: any) => user.country?.trim() === selectedCountry);
  }, [selectedCountry, dataArray]);

  return (
    <div className="sm:col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-1 h-full p-2">
      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border w-full border-slate-400 dark:border-slate-600 relative overflow-hidden text-slate-800 dark:text-white h-full">
        <div className="flex card-header justify-between items-center p-2 bg-slate-50 dark:bg-slate-800">
          <h4 className="font-medium">Commission Distribution by Country</h4>
        </div>

        <div className="card-body p-4">
          <h2 className="text-3xl font-medium mb-4 text-slate-800 dark:text-white">
            ${splitDecimals(totalCommission.toFixed(2))}
          </h2>

          <div className="w-full mx-auto mb-4 relative">
            <div className="flex items-center h-4 rounded overflow-hidden shadow-inner border dark:border-slate-600">
              {countryData.map((c, idx) => (
                <div
                  key={idx}
                  className={`${c.color} h-full cursor-pointer transition-all duration-200`}
                  style={{ width: `${c.percent}%` }}
                  title={`${getCountryName(c.country)} — $${c.commission.toFixed(2)} (${c.percent.toFixed(1)}%)`}
                  onMouseEnter={() => setHoveredCountry(c.country)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  onClick={() => setSelectedCountry(c.country)}
                ></div>
              ))}
            </div>
            {hoveredCountry && (
              <p className="absolute text-center text-sm">
                📍 {getCountryName(hoveredCountry)} — ${splitDecimals(byCountry[hoveredCountry].toFixed(2))}
              </p>
            )}
          </div>

          <div className="overflow-scroll mt-4 max-h-56">
            <table className="min-w-full text-sm">
              <thead className="border-b sticky top-0 bg-slate-200 dark:bg-slate-700">
                <tr>
                  <th className="p-3 text-xs font-medium text-left uppercase">
                    Country
                  </th>
                  <th className="p-3 text-xs font-medium text-left uppercase">
                    Commission
                  </th>
                  <th className="p-3 text-xs font-medium text-left uppercase">
                    % of Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {countryData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-dashed border-slate-700 cursor-pointer"
                    onClick={() => setSelectedCountry(row.country)}
                  >
                    <td className="p-3 text-sm font-medium whitespace-nowrap flex items-center">
                      <span className="text-lg mr-2">{getFlag(row.country)}</span>
                      {getCountryName(row.country)}
                    </td>
                    <td className="p-3 text-sm">
                      ${splitDecimals(row.commission.toFixed(2))}
                    </td>
                    <td className="p-3 text-sm">
                      {row.percent.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            * This report reflects total commissions earned per country across all users.
          </p>
        </div>

        {/* Geographic Conversion Leaders */}
        {conversionLeaders.length > 0 && (
          <div className="mt-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-1.5 rounded-lg">
                <span className="text-white text-sm">🎯</span>
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                Geographic Conversion Leaders
              </h4>
            </div>
            
            <div className="space-y-2">
              {conversionLeaders.map((leader) => (
                <div key={leader.country} className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getFlag(leader.country)}</span>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {getCountryName(leader.country)}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {leader.registrations} regs → {leader.cpas} CPAs
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {leader.conversionRate.toFixed(0)}%
                    </p>
                    <div className="w-16 bg-slate-200 dark:bg-slate-600 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(leader.conversionRate, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 italic">
              Helps target campaigns where quality is highest
            </p>
          </div>
        )}
      </div>

      {selectedCountry && (
        <div 
          onClick={() => setSelectedCountry(null)} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="[background:linear-gradient(45deg,#172033,theme(colors.slate.800)_50%,#172033)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.600/.48)_80%,_theme(colors.indigo.500)_86%,_theme(colors.indigo.300)_90%,_theme(colors.indigo.500)_94%,_theme(colors.slate.600/.48))_border-box] rounded-2xl border border-transparent animate-border max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-2xl relative"
          >
            <div className="p-6">
              <button
                className="absolute top-3 right-3 text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-600 rounded-full p-2 transition-colors duration-200"
                onClick={() => setSelectedCountry(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18"></path>
                  <path d="M6 6l12 12"></path>
                </svg>
              </button>
              
              <h2 className="text-xl font-bold mb-5 text-white flex items-center gap-2">
                <span className="text-2xl">{getFlag(selectedCountry)}</span> 
                <span>{getCountryName(selectedCountry)} — Users</span>
              </h2>
              
              <ul className="divide-y divide-slate-700/50 space-y-1">
                {selectedUsers.map((user: any, idx: number) => (
                  <li key={idx} className="py-3 px-2 hover:bg-slate-700/20 rounded-lg transition-colors duration-150">
                    <p className="font-medium text-white">{user.customer_name || user.user_id}</p>
                    <div className="flex justify-between mt-1">
                      <p className="text-sm text-slate-400 flex items-center gap-1">
                        <span className="bg-slate-700/30 px-2 py-0.5 rounded-full flex items-center">
                          Commission: <span className="text-green-400 ml-1">${splitDecimals((user.commission || 0).toFixed(2))}</span>
                        </span>
                      </p>
                      <p className="text-sm text-slate-400 flex items-center gap-1">
                        <span className="bg-slate-700/30 px-2 py-0.5 rounded-full flex items-center">
                          Volume: <span className="text-blue-400 ml-1">{(user.volume || 0).toFixed(2)}</span>
                        </span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
