/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { AffiliateNodeType } from "@/modules/subAffiliates/types";
// import MasterAffiliateSetup from "@/components/blockchain/components/MasterAffiliateSetup";
// import AffiliateActions from "@/components/InviteSubAffiliates/InviteSubAffiliates";
import { AffiliateNetworkNode } from "./components/AffiliateNetworkNode";
import { DollarSign, Users } from "lucide-react";
// import AffiliateActions from "@/components/InviteSubAffiliates/HowItWorksSubAffiliates";
import HowItWorksSubAffiliates from "@/modules/subAffiliates/components/HowItWorksSubAffiliates";



export default function MasterAffiliateDashboard() {
  const { subAffiliates, paymentsRegister } = useOutletContext<any>();
  // const { currentAccount } = useBlockchainContext();

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 lg:px-6 text-gray-900 dark:text-white space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Master Affiliate Dashboard</h1>
        <p className="text-blue-100">Monitor your network performance and earnings</p>
      </div>

      <HowItWorksSubAffiliates/>

      {/* Network Hierarchy */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Network Hierarchy
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your affiliate network structure and performance metrics
          </p>
        </div>
        <div className="p-6">
          {subAffiliates?.length ? (
            subAffiliates.map((affiliate: AffiliateNodeType) => (
              <AffiliateNetworkNode key={affiliate.subAffiliate.id} node={affiliate} />
            ))
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No Sub-Affiliates Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Share your invitation link to start building your affiliate network and earning commissions.
              </p>
            </div>
          )}
        </div>
      </div>



      {/* Recent Payments Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Payments
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Latest commission payments from your network
            </p>
          </div>
          <div className="p-6 max-h-96 overflow-y-auto">
            {paymentsRegister.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No Payments Yet
                </h4>
                <p className="text-gray-500 dark:text-gray-400">
                  Payments will appear here as your network grows
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentsRegister.map((payment: any) => {
                  const { id, amount, hash, createdAt, registration } = payment;
                  const country = registration?.country || "N/A";
                  const customerName = registration?.customer_name || "N/A";
                  const affiliateName = registration?.user?.name || "Unknown";

                  return (
                    <div
                      key={id}
                      className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">
                              ${amount} USDT
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Client:</span>
                          <span className="ml-2 font-medium text-gray-900 dark:text-white">
                            {customerName}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Sub-Affiliate:</span>
                          <span className="ml-2 font-medium text-gray-900 dark:text-white">
                            {affiliateName}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Country:</span>
                          <span className="ml-2 font-medium text-gray-900 dark:text-white">
                            {country}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <a
                          href={`https://etherscan.io/tx/${hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-mono break-all"
                        >
                          {hash.slice(0, 10)}...{hash.slice(-6)}
                        </a>
                      </div>
                    </div>
                   );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    // </div>
  );
}