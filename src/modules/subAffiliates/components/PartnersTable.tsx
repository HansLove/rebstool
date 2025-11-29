// src/components/SubAffiliatesTable.tsx
import React, { FC, useState } from "react";
import { ChevronDown, ChevronRight, Users } from "lucide-react";

export interface User {
  id: number;
  name: string;
  email: string;
  rol: number;
  slug: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Registration {
  id: number;
  ce_user_id: string;
  account_id: number;
  registration_date: string;
  brand: string;
  tracking_code: string;
  afp: string;
  language: string;
  type: string;
  size: string;
  name: string;
  nci: number;
  status: string;
  qualification_date: string | null;
  country: string;
  volume: number;
  first_deposit: number;
  first_deposit_date: string | null;
  withdrawals: number;
  net_deposits: number;
  generic1: string;
  customer_name: string;
  commission: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubAffiliateResponse {
  subAffiliate: {
    id: number;
    admin_id: number;
    subaffiliate_id: number;
    mainAddress: string | null;
    amount: number;
  };
  user: User;
  userData: Registration[];
}

interface Props {
  data: SubAffiliateResponse[];
}

const PartnersTable: FC<Props> = ({ data }) => {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggle = (id: number) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 sm:px-6 py-3 sm:py-4">
        <h3 className="text-sm sm:text-base font-semibold text-white">Partners & Sub-Affiliates</h3>
      </div>

      {data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">User ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Address</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {data.map(item => {
                const { subAffiliate, user, userData } = item;
                const isOpen = expanded.has(subAffiliate?.id);
                return (
                  <React.Fragment key={subAffiliate?.id}>
                    <tr
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150"
                      onClick={() => toggle(subAffiliate?.id)}
                    >
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{user?.id}</td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-200">{user?.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{user?.email}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{user?.rol}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        ${subAffiliate?.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 font-mono text-xs">
                        {subAffiliate?.mainAddress ? `${subAffiliate.mainAddress.slice(0, 6)}...${subAffiliate.mainAddress.slice(-4)}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isOpen ? (
                          <ChevronDown className="h-5 w-5 mx-auto text-indigo-500" />
                        ) : (
                          <ChevronRight className="h-5 w-5 mx-auto text-slate-400" />
                        )}
                      </td>
                    </tr>
                    {isOpen && (
                      <tr>
                        <td colSpan={7} className="bg-slate-50 dark:bg-slate-900/30 p-0">
                          {userData?.length > 0 ? (
                            <div className="p-4">
                              <table className="w-full">
                                <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                  <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Reg. ID</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Customer</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Status</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Date</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                  {userData?.map(reg => (
                                    <tr key={reg.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                                      <td className="px-3 py-2 text-xs text-slate-700 dark:text-slate-300">{reg.id}</td>
                                      <td className="px-3 py-2 text-xs text-slate-700 dark:text-slate-300">{reg.customer_name}</td>
                                      <td className="px-3 py-2 text-xs">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                          {reg.status}
                                        </span>
                                      </td>
                                      <td className="px-3 py-2 text-xs text-slate-700 dark:text-slate-300">
                                        {new Date(reg.registration_date).toLocaleDateString()}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="p-6 text-center">
                              <Users className="h-10 w-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                No registration data
                              </p>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 px-4">
          <Users className="h-16 w-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
            No Partners Yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Your partner affiliates will appear here once they join your network.
          </p>
        </div>
      )}
    </div>
  );
};

export default PartnersTable;
