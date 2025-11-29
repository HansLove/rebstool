/* eslint-disable @typescript-eslint/no-explicit-any */

import SinglePaymentRegister from "@/modules/subAffiliates/components/SinglePaymentRegister";
import { Users } from "lucide-react";


export default function SubAffiliatePage({
  registrationReports,
}:any) {

   return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 sm:px-6 py-3 sm:py-4">
        <h3 className="text-sm sm:text-base font-semibold text-white">Registration Reports</h3>
      </div>

      {registrationReports?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Deposit
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Volume
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Registration Date
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  State
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
              {registrationReports.map((record:any, idx:number) => (
                <SinglePaymentRegister key={idx} record={record} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 px-4">
          <Users className="h-16 w-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
            No Registration Reports
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Registration reports will appear here once your referrals start signing up.
          </p>
        </div>
      )}
    </div>
  );
}