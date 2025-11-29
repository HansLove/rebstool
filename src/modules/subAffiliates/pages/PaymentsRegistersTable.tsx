/* eslint-disable @typescript-eslint/no-explicit-any */
import SinglePaymentRegister from "@/modules/subAffiliates/components/SinglePaymentRegister";

export default function PaymentsRegistersTable({
  registrationReports,
}:any) {

  console.log("registration reports: ",registrationReports)
   return (
    <div className="mmx-auto">

      {registrationReports?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Deposits
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Volume
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Registration
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  State
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {registrationReports.map((record:any, idx:number) => (
                <SinglePaymentRegister key={idx} record={record} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-slate-500 dark:text-slate-400 py-8">
          No registration reports found.
        </p>
      )}
    </div>
  );
}
