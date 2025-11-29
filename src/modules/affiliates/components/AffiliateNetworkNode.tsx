import { useState } from "react";
import { calculateAffiliateMetrics } from "@/modules/affiliates/services/calculateAffiliateMetrics";
import { AffiliateNodeType } from "@/modules/subAffiliates/types";
import { 
    ChevronDown, 
    ChevronRight, 
    DollarSign, 
    TrendingUp, 
    Users, 
    Target,
    Award,
    Activity
  } from "lucide-react";
import { splitDecimals } from "@/core/utils/splitDecimals";

export function AffiliateNetworkNode({ node, level = 0 }: { node: AffiliateNodeType; level?: number }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const metrics = calculateAffiliateMetrics(node);
    const affiliateName = node.subAffiliate.subAffiliateUser?.name || "Unnamed Affiliate";
  
    return (
      <div className={`ml-${level * 4} mb-6`}>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
          {/* Header Section */}
          <div className="p-6 border-b border-gray-50 dark:border-gray-800">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {affiliateName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Investment: ${splitDecimals(node.subAffiliate.amount)} USDT
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                {isExpanded ? (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Hide Details
                  </>
                ) : (
                  <>
                    <ChevronRight className="h-4 w-4" />
                    View Details
                  </>
                )}
              </button>
            </div>
          </div>
  
          {/* Metrics Grid */}
          <div className="p-6">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {/* ROI Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-green-700 dark:text-green-300 uppercase tracking-wide">
                    ROI
                  </span>
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {metrics.roi}%
                </div>
              </div>
  
              {/* Gross Profit Card */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl p-4 border border-amber-100 dark:border-amber-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
                    Gross Profit
                  </span>
                </div>
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  ${splitDecimals(metrics.grossProfit)}
                </div>
              </div>
  
              {/* Net Profit Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                    Net Profit
                  </span>
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${splitDecimals(metrics.netProfit)}
                </div>
              </div>
  
              {/* Sub-Affiliate Payments Card */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                    Sub Payments
                  </span>
                </div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {splitDecimals(metrics.activeUsers * 250)} USDT
                </div>
              </div>
  
              {/* Conversion Rate Card */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                    Conversion
                  </span>
                </div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {metrics.conversionRate}%
                </div>
                <div className="text-xs text-emerald-500 dark:text-emerald-400 mt-1">
                  {metrics.activeUsers}/{metrics.totalRegistrations}
                </div>
              </div>
            </div>
          </div>
  
          {/* Detailed Records */}
          {isExpanded && (
            <div className="px-6 pb-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  User Registrations ({node.userData?.length || 0})
                </h4>
                <div className="space-y-3">
                  {node.userData?.length ? (
                    node.userData.map((registration, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              {registration.customer_name}
                            </h5>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {registration.country}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                              ${registration.commission}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Commission
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Deposit:</span>
                            <span className="ml-2 font-medium text-gray-900 dark:text-white">
                              ${registration.first_deposit}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Volume:</span>
                            <span className="ml-2 font-medium text-gray-900 dark:text-white">
                              {registration.volume}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No registrations found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
  
        {/* Nested Children */}
        {node.children?.length > 0 && (
          <div className="mt-6 ml-6 border-l-2 border-gray-200 dark:border-gray-700 pl-6">
            {node.children.map((child) => (
              <AffiliateNetworkNode key={child.subAffiliate.id} node={child} level={(level || 0) + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }