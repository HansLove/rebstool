/* src/components/dashboard/EarningsReports.tsx */
import { useState, useMemo } from "react";
import { splitDecimals } from "@/core/utils/splitDecimals";
import UserInsightsModal from "@/components/modals/UserInsightsModal";
import { FaSort } from "react-icons/fa6";
import { universalSort } from "@/core/utils/sorting";

const ITEMS_PER_PAGE = 29;

export default function EarningsReports({
  registrationsReport = [],
  sortBy,
  sortOrder,
  handleSort,
}: {
  registrationsReport: any[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  handleSort: (key: string) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 1) sort the raw data
  const sortedData = useMemo(
    () => universalSort(registrationsReport, sortBy, sortOrder),
    [registrationsReport, sortBy, sortOrder]
  );

  // 2) then filter by name:
  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedData;
    const lower = searchTerm.toLowerCase();
    return sortedData.filter((r) =>
      (r.customer_name || "").toLowerCase().includes(lower)
    );
  }, [sortedData, searchTerm]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // 3) finally paginate
  const displayedData = useMemo(() => {
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(from, from + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const getFormattedDate = (dateString: string) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderSortIcon = (key: string) => (
    <FaSort
      size={12}
      className={`ml-1 transition-transform ${
        sortBy === key ? (sortOrder === "asc" ? "rotate-180" : "") : "opacity-30"
      }`}
    />
  );

  return (
    <div className="rounded-2xl border border-slate-300 dark:border-slate-700 overflow-hidden">
      {/* ——— Search box */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800">
        <input
          type="text"
          placeholder="🔎 Search by name…"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full p-2 border rounded text-sm dark:bg-slate-900 dark:text-white focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      {/* ——— Pagination controls */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm rounded bg-blue-500 text-white disabled:bg-slate-400"
        >
          Previous
        </button>
        <span className="text-sm dark:text-slate-200">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1 text-sm rounded bg-blue-500 text-white disabled:bg-slate-400"
        >
          Next
        </button>
      </div>

      {/* ——— Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-200 dark:bg-gray-800 text-slate-700 dark:text-slate-200">
            <tr>
              {[
                { label: "Name", key: "customer_name" },
                { label: "Country", key: "country" },
                { label: "Reg. Date", key: "registration_date" },
                { label: "Qualification", key: "qualification_date" },
                { label: "Deposits", key: "net_deposits" },
                { label: "First Deposit", key: "first_deposit_date" },
                { label: "Withdrawals", key: "ActivityReport.Withdrawals" },
                { label: "Volume", key: "volume" },
                { label: "Commission", key: "commission" },
              ].map(({ label, key }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="p-3 text-left cursor-pointer"
                >
                  <div className="flex items-center">
                    {label} {renderSortIcon(key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedData.map((row, i) => (
              <tr
                key={i}
                onClick={() => setSelectedUser(row)}
                className="hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                <td className="p-3">{row.customer_name || row.ce_user_id}</td>
                <td className="p-3">{row.country || "-"}</td>
                <td className="p-3">{getFormattedDate(row.registration_date)}</td>
                <td className="p-3">{getFormattedDate(row.qualification_date)}</td>
                <td className="p-3 text-green-600">
                  ${splitDecimals((row.net_deposits || 0).toFixed(2))}
                </td>
                <td className="p-3">{getFormattedDate(row.first_deposit_date)}</td>
                <td className="p-3 text-red-500">
                  -${row.ActivityReport?.Withdrawals || 0}
                </td>
                <td className="p-3">{(row.volume || 0).toFixed(2)}</td>
                <td className="p-3 text-blue-600">
                  ${splitDecimals((row.commission || 0).toFixed(2))}
                </td>
              </tr>
            ))}
            {displayedData.length === 0 && (
              <tr>
                <td colSpan={9} className="p-3 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <UserInsightsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
