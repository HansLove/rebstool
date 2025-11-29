import { splitDecimals } from "@/core/utils/splitDecimals";
import CheckAnimation from "@/components/animations/check/CheckAnimation";
import { calculateDaysUntilPayment } from "@/components/dashboard/table/utils/calculateDaysUntilPayment";
import { TiCancelOutline } from "react-icons/ti";

export default function SingleSubAffilliate({ toggleExpand, affiliate, expandedId }) {
  const isExpanded = expandedId === affiliate.id;

  const summary = affiliate.data.reduce(
    (acc, item) => {
      acc.netDeposits += item.net_deposits || 0;
      acc.totalCommissions += item.commission || 0;
      if (item.paid && item.paymentDetails) {
        acc.totalPaid += item.paymentDetails.amount || 0;
      } else {
        acc.pendingCount++;
      }
      acc.totalVolume += item.volume || 0;
      acc.totalWithdrawals += item.withdrawals || 0;
      return acc;
    },
    {
      netDeposits: 0,
      totalCommissions: 0,
      totalPaid: 0,
      totalVolume: 0,
      totalWithdrawals: 0,
      pendingCount: 0,
    }
  );

  // const payoutRatio = summary.netDeposits ? (summary.totalPaid / summary.netDeposits) * 100 : 0;
  // const payoutRatio = (summary.totalPaid*100 ) / summary.totalCommissions;
  // const payoutRatio = (summary.totalPaid*100 ) / summary.totalCommissions;
  const payoutRatio = (summary.totalCommissions ) / summary.totalPaid?summary.totalPaid:1;
  // const payoutRealization = summary.totalCommissions ? (summary.totalPaid / summary.totalCommissions) * 100 : 0;
  // const brokerROI = summary.totalPaid ? summary.netDeposits / summary.totalPaid : 0;
  const brokerROI = summary.totalPaid ? summary.netDeposits / summary.totalCommissions : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border p-6 hover:shadow-xl transition-all">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
        {/* Identity */}
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-gray-800">{affiliate.name}</h3>
          <p className="text-sm text-gray-500">{affiliate.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full text-sm text-gray-700">
          <Stat label="Net Deposits" value={`$${splitDecimals(summary.netDeposits.toFixed(2))}`} color="text-green-600" />
          <Stat label="Commissions" value={`$${splitDecimals(summary.totalCommissions.toFixed(2))}`} color="text-blue-600" />
          <Stat label="Paid" value={`$${summary.totalPaid.toFixed(2)}`} color="text-yellow-600" />
          <Stat label="Pending" value={summary.pendingCount} color="text-purple-600" />
        </div>
        {/* Stats part 2 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full text-sm text-gray-700">
          <StatBox title="Sub ROI" value={`${(payoutRatio?payoutRatio:0).toFixed(1)}X`} subtitle="vs Net Deposits" bg="bg-indigo-100" text="text-indigo-600" />
          {/* <StatBox title="ROI" value={`${brokerROI.toFixed(2)}X`} subtitle="Return per USDT paid" bg="bg-green-100" text="text-green-600" /> */}
          <StatBox title="ROI" value={`${brokerROI.toFixed(2)}X`} subtitle="Net Deposits/Total Commission" bg="bg-green-100" text="text-green-600" />
        </div>

        {/* Toggle */}
        <div className="md:self-center">
          <button
            onClick={() => toggleExpand(affiliate.id)}
            className="text-blue-500 underline hover:text-blue-700 text-sm"
          >
            {isExpanded ? "Hide" : "View Details"}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 bg-gray-50 rounded-md p-4 overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="p-2">Client</th>
                <th className="p-2">Register</th>
                <th className="p-2">Net</th>
                <th className="p-2">Volume</th>
                <th className="p-2">Commissions</th>
                <th className="p-2">Withdrawals</th>
                <th className="p-2">Payout</th>
                <th className="p-2">State</th>
              </tr>
            </thead>
            <tbody>
              {affiliate.data.map((item) => (
                <tr key={item.id} className="border-t border-gray-200 text-black">
                  <td className="p-2">{item.customer_name}</td>
                  <td className="p-2">{new Date(item.registration_date).toLocaleDateString()}</td>
                  <td className="p-2">${(item.net_deposits ?? 0).toFixed(2)}</td>
                  <td className="p-2">{(item.volume ?? 0).toFixed(2)}</td>
                  <td className="p-2">${(item.commission ?? 0).toFixed(2)}</td>
                  <td className="p-2">{item.withdrawals}</td>
                  <td className="p-2">
                    {item.qualification_date ? (
                      item.paid ? (
                        <CheckAnimation />
                      ) : (
                        <span className="text-blue-500">
                          {calculateDaysUntilPayment(item.qualification_date)}
                        </span>
                      )
                    ) : (
                      <span className="text-gray-400 italic">Unqualified</span>
                    )}
                  </td>
                  <td className="p-2">
                    {item.paid && item.paymentDetails ? (
                      <div className="text-green-600">
                        <div className="font-semibold">
                          ${item.paymentDetails.amount.toFixed(2)}
                        </div>
                        <div className="text-xs break-all">
                          <a
                            href={`https://etherscan.io/tx/${item.paymentDetails.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            {item.paymentDetails.hash.slice(0, 10)}...{item.paymentDetails.hash.slice(-6)}
                          </a>
                        </div>
                        <div className="text-xs text-gray-500 break-all">
                          to: {item.paymentDetails.mainAddress.slice(0, 6)}...{item.paymentDetails.mainAddress.slice(-4)}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-500 font-medium">
                        No <TiCancelOutline />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className={`font-medium text-center text-sm ${color}`}>
      <span className="block text-xs text-gray-400">{label}</span>
      {value}
    </div>
  );
}

function StatBox({ title, value, subtitle, bg, text }) {
  return (
    <div className={`text-center ${bg} border ${text.replace("text-", "border-")} rounded-xl px-2 py-1`}>
      <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide">{title}</div>
      <div className={`text-2xl font-bold ${text}`}>{value}</div>
      <div className="text-xs text-gray-400 mt-1">{subtitle}</div>
    </div>
  );
}
