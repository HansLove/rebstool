/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

export default function CollapsibleSubAffiliatesTable({ affiliates }: { affiliates: any[] }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
          <tr>
            <th className="px-4 py-2 text-left font-semibold">Name</th>
            <th className="px-4 py-2 text-left font-semibold">Email</th>
            <th className="px-4 py-2 text-left font-semibold">Status</th>
            <th className="px-4 py-2 text-left font-semibold">Created At</th>
            <th className="px-4 py-2 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {affiliates.map((affiliate) => (
            <SubAffiliateRow key={affiliate.user.id} affiliate={affiliate} level={0} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SubAffiliateRow({ affiliate, level }: { affiliate: any; level: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const indent = `pl-${Math.min(level * 4, 12)}`;
  const bgColor = level % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-900";

  const user = affiliate.user || {};
  const reports = affiliate?.subAffiliate?.subAffiliateUser?.userRegistrationReports || [];

  return (
    <>
      <tr className={`${bgColor} text-gray-800 dark:text-white`}>
        <td className={`px-4 py-2 ${indent}`}>{user.name}</td>
        <td className="px-4 py-2">{user.email}</td>
        <td className="px-4 py-2">{user.status ? "Active" : "Inactive"}</td>
        <td className="px-4 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
        <td className="px-4 py-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-blue-600 hover:underline"
          >
            {isOpen ? "Hide" : "Show"} Details
          </button>
        </td>
      </tr>

      {isOpen && (
        <>
          <tr>
            <td colSpan={5} className={`px-6 pb-4 pt-2 ${indent}`}>
              {reports.length > 0 ? (
                <div className="overflow-x-auto border rounded bg-white dark:bg-gray-800 shadow-md mt-2">
                  <table className="min-w-full text-xs text-left text-gray-700 dark:text-gray-300">
                    <thead className="bg-gray-200 dark:bg-gray-700 text-xs text-gray-800 dark:text-white">
                      <tr>
                        <th className="px-2 py-1">Customer</th>
                        <th className="px-2 py-1">Country</th>
                        <th className="px-2 py-1">Status</th>
                        <th className="px-2 py-1">Volume</th>
                        <th className="px-2 py-1">Commission</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((report: any, idx: number) => (
                        <tr key={idx} className="border-t border-gray-300 dark:border-gray-600">
                          <td className="px-2 py-1">{report.customer_name}</td>
                          <td className="px-2 py-1">{report.country}</td>
                          <td className="px-2 py-1">{report.status}</td>
                          <td className="px-2 py-1">{report.volume}</td>
                          <td className="px-2 py-1">${report.commission}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No registration data</p>
              )}
            </td>
          </tr>

          {/* Renderizar hijos */}
          {affiliate.children &&
            affiliate.children.map((child: any) => (
              <SubAffiliateRow key={child.user?.id} affiliate={child} level={level + 1} />
            ))}
        </>
      )}
    </>
  );
}
