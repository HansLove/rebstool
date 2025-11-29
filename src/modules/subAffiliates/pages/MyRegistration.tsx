/* eslint-disable @typescript-eslint/no-explicit-any */
import SubAffilliateSingleRegister from "@/modules/subAffiliates/components/SubAffilliateSingleRegister";

export default function SubAffiliatePage({
  registrationReports,
}:any) {

   return (
    <div className="mmx-auto">
      {/* <ConnectCellxpertForm
            onSuccess={() => setRequestSent(true)}
            onError={(msg) => setError(msg)}
          /> */}

      {registrationReports?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full dark:bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Deposit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Volume
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Registration Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  State
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {registrationReports.map((record:any, idx:number) => (
                <SubAffilliateSingleRegister key={idx} record={record} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No registration reports found.
        </p>
      )}
    </div>
  );
}