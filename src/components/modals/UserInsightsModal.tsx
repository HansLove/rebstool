/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { splitDecimals } from "@/core/utils/splitDecimals";
import { countryToFlag } from "@/core/utils/countryToFlag";
import { getCountryName } from "@/core/utils/getCountryName";
import { FiX, FiUser, FiDollarSign, FiTrendingUp } from "react-icons/fi";

export default function UserInsightsModal({ user, onClose }: { user: any; onClose: () => void }) {
  const userData = user || {};

  const today = new Date();
  const registrationDate = new Date(userData.registration_date??today);
  const qualificationDate = new Date(userData.qualification_date??today);

  const daysToQualify = userData.qualification_date
    ? Math.ceil((qualificationDate.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const isToxic = user.volume && user.commission && user.volume > 3 && user.commission < 300;
  const qualityScore = (user.volume * 100 + user.commission * 1.5) - user.ActivityReport?.Withdrawals * 2;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl border border-gray-200 max-w-3xl w-full shadow-xl relative overflow-hidden">
        <div className="p-6">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors duration-200"
            onClick={onClose}
          >
            <FiX className="h-5 w-5" />
          </button>
          
          <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center justify-center gap-2">
            <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">📊</span>
            Insight Report: {userData.customer_name || user.userId}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h4 className="text-md font-semibold mb-3 text-gray-800 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">
                  <FiUser className="h-4 w-4" />
                </span>
                User Info
              </h4>
              <div className="space-y-2 text-gray-700">
                <p className="flex justify-between">
                  <span className="text-gray-500">Country:</span> 
                  <span>{countryToFlag(userData.country)} {getCountryName(userData.country)}</span>
                </p>
                {registrationDate!=null && (
                  <p className="flex justify-between">
                    <span className="text-gray-500">Registered:</span> 
                    <span>{format(registrationDate, "PPP")} ({formatDistanceToNow(registrationDate)} ago)</span>
                  </p>
                )}
                <p className="flex justify-between">
                  <span className="text-gray-500">Qualified:</span> 
                  <span>{userData.qualification_date ? format(qualificationDate, "PPP") : "Not Qualified"}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">Days to Qualify:</span> 
                  <span>{daysToQualify ?? "-"}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">Tracking Code:</span> 
                  <span className="font-mono">{userData.tracking_code || "-"}</span>
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h4 className="text-md font-semibold mb-3 text-gray-800 flex items-center gap-2">
                <span className="bg-green-100 text-green-600 p-1.5 rounded-lg">
                  <FiDollarSign className="h-4 w-4" />
                </span>
                Financials
              </h4>
              <div className="space-y-2 text-gray-700">
                <p className="flex justify-between">
                  <span className="text-gray-500">Deposits:</span> 
                  <span className="font-medium">${splitDecimals((user.net_deposits || 0).toFixed(2))}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">Withdrawals:</span> 
                  <span className="font-medium">{user.ActivityReport?.Withdrawals || 0}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">Volume:</span> 
                  <span className="font-medium">{user.volume?.toFixed(2) || "0.00"}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">Commissions:</span> 
                  <span className="font-medium">${splitDecimals((user.commission || 0).toFixed(2))}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">P&L:</span> 
                  <span className="font-medium">${user.ActivityReport?.PL || 0}</span>
                </p>
              </div>
            </div>

            <div className="bg-gray-100 col-span-1 md:col-span-2 p-4 rounded-xl border border-gray-200">
              <h4 className="text-md font-semibold mb-3 text-gray-800 flex items-center gap-2">
                <span className="bg-purple-100 text-purple-600 p-1.5 rounded-lg">
                  <FiTrendingUp className="h-4 w-4" />
                </span>
                Pattern Analysis
              </h4>
              <div className="space-y-2 text-gray-700">
                <p className="flex justify-between items-center">
                  <span className="text-gray-500">Quality Score:</span> 
                  <span className="boton-user px-3 py-1 text-xs">
                    {Math.abs(qualityScore).toFixed(1)} / 1000
                  </span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-gray-500">Toxicity Risk:</span> 
                  {isToxic ? (
                    <span className="boton px-3 py-1 text-xs">⚠️ High Risk</span>
                  ) : (
                    <span className="boton-user px-3 py-1 text-xs">✅ Healthy</span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-3">* Quality score is based on commission, volume, and withdrawal patterns.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}