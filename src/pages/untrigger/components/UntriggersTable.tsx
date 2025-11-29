/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaCalendar, FaChartLine, FaDollarSign, FaSort, FaUser } from "react-icons/fa6";
import { splitDecimals } from "@/core/utils/splitDecimals";
import { FiSettings } from "react-icons/fi";
import { GoNote } from "react-icons/go";
import { LuCreditCard } from "react-icons/lu";

interface Props {
  untriggeredList: any[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  handleSort: (key: string) => void;
  setSelectedItem: (item: any) => void;
}

export default function UntriggersTable({
  untriggeredList,
  sortBy,
  sortOrder,
  handleSort,
  setSelectedItem,
}: Props) {
  const renderSortIcon = (key: string) => (
    <FaSort
      size={12}
      className={`transition-transform ${
        sortBy === key
          ? sortOrder === "asc"
            ? "rotate-180 text-indigo-600 dark:text-indigo-400"
            : "text-indigo-600 dark:text-indigo-400"
          : "opacity-40"
      }`}
    />
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-700 dark:text-slate-300">
          <tr>
            {[
              { 
                key: "ce_user_id", 
                label: "User ID", 
                icon: <LuCreditCard size={16} className="text-indigo-500 dark:text-indigo-400" />,
                width: "w-24"
              },
              {
                key: "customer_name",
                label: "Customer Name",
                icon: <FaUser size={16} className="text-blue-500 dark:text-blue-400" />,
                width: "w-48"
              },
              {
                key: "net_deposits",
                label: "Net Deposits ($)",
                icon: <FaDollarSign size={16} className="text-green-500 dark:text-green-400" />,
                width: "w-32"
              },
              {
                key: "volume",
                label: "Trading Volume (Lots)",
                icon: <FaChartLine size={16} className="text-amber-500 dark:text-amber-400" />,
                width: "w-40"
              },
              {
                key: "registration_date",
                label: "Registration Date",
                icon: <FaCalendar size={16} className="text-purple-500 dark:text-purple-400" />,
                width: "w-32"
              },
            ].map(({ key, label, icon, width }) => (
              <th
                key={key}
                className={`px-4 py-4 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-semibold ${width}`}
                onClick={() => handleSort(key)}
              >
                <span className="flex items-center gap-2">
                  {icon} {label} {renderSortIcon(key)}
                </span>
              </th>
            ))}
            <th className="px-4 py-4 w-32">
              <span className="flex items-center gap-2">
                <FiSettings size={16} className="text-cyan-500 dark:text-cyan-400" /> Status
              </span>
            </th>
            <th className="px-4 py-4 w-24">
              <span className="flex items-center gap-2">
                <GoNote size={16} className="text-emerald-500 dark:text-emerald-400" /> Note
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          {untriggeredList.map((item, idx) => {
            const net = item.net_deposits || 0;
            const vol = item.volume || 0;
            // const triggerLabel =
            //   net >= 300 && vol >= 1 ? "✅ Should Trigger" : "⚠️ Check Volume";
            const isReadyToTrigger = net >= 300 && vol >= 1;

            return (
              <tr
                key={idx}
                className={idx % 2 === 0 
                  ? "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50" 
                  : "bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600/50"
                }
              >
                <td className="px-4 py-4 font-bold text-indigo-600 dark:text-indigo-400 text-center">
                  {item.ce_user_id}
                </td>
                <td className="px-4 py-4 text-slate-800 dark:text-slate-200 font-medium">
                  {item.customer_name || "N/A"}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center">
                    <div className={`px-3 py-2 rounded-xl font-bold text-lg ${
                      isReadyToTrigger 
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-2 border-green-200 dark:border-green-700" 
                        : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-2 border-amber-200 dark:border-amber-700"
                    }`}>
                      $ {splitDecimals(net.toFixed(2))}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center">
                    <div className={`px-3 py-2 rounded-xl font-bold text-lg ${
                      isReadyToTrigger 
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-2 border-green-200 dark:border-green-700" 
                        : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-2 border-amber-200 dark:border-amber-700"
                    }`}>
                      {vol.toFixed(2)} lots
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-400 font-medium">
                  {item.registration_date
                    ? new Date(item.registration_date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="px-4 py-4 text-center">
                  {isReadyToTrigger ? (
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-xl text-sm font-bold border-2 border-green-200 dark:border-green-700">
                      ✅ READY TO TRIGGER
                    </span>
                  ) : (
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-4 py-2 rounded-xl text-sm font-bold border-2 border-yellow-200 dark:border-yellow-700">
                      ⚠️ NEEDS VOLUME
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 border-2 border-indigo-200 dark:border-indigo-700"
                    onClick={() => setSelectedItem(item)}
                  >
                    {item.Description ? "✏️ Edit Note" : "➕ Add Note"}
                  </button>
                </td>
              </tr>
            )}
          )}
          {untriggeredList.length === 0 && (
            <tr className="bg-slate-50 dark:bg-slate-800">
              <td colSpan={7} className="px-4 py-12 text-center text-slate-500 dark:text-slate-400">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <span className="text-4xl">✅</span>
                  <span className="text-lg font-medium">No untriggered users found.</span>
                  <span className="text-sm">All users have met the commission requirements.</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
