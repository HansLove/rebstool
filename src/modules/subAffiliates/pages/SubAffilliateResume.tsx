/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { useOutletContext } from "react-router-dom";
import MiniTutorial from '@/components/MiniTutorial';
import PaymentsRegistersTable from '@/modules/subAffiliates/pages/PaymentsRegistersTable';
import { usePayouts } from '@/core/hooks/usePayouts';
import SubsResumeHeader from "../components/SubsResumeHeader";

const COLORS = ["#10B981", "#EF4444"];

const SubAffilliateResume: FC = () => {
  const { registrationsReport = [], deal } = useOutletContext<any>();
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const { filteredData, payments } = usePayouts(registrationsReport);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        setFetchError(null);
        // Simulación de carga si fuese necesario
      } catch (err: any) {
        console.error("Payment fetch error:", err);
        setFetchError("Failed to fetch payments. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const enrichedRegistrations = useMemo(() => {
    return registrationsReport.map((reg: any) => {
      const payment = payments.find((p) => p.ce_user_id === reg.ce_user_id);
      return { ...reg, paid: !!payment, paymentDetails: payment || null };
    });
  }, [registrationsReport, payments]);

  const paidCount = enrichedRegistrations.filter((r) => r.paid).length;
  const unpaidCount = enrichedRegistrations.length - paidCount;

  const chartData = [
    { name: "Paid", value: paidCount },
    { name: "Unpaid", value: unpaidCount },
  ];

  const earningsByDate = useMemo(() => {
    const dateMap: Record<string, number> = {};
    payments.forEach((p) => {
      if (!p.amount || !p.createdAt) return;
      const date = new Date(p.createdAt).toLocaleDateString();
      dateMap[date] = (dateMap[date] || 0) + Number(p.amount);
    });
    return Object.entries(dateMap)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [payments]);

  const newUsersThisWeek = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return enrichedRegistrations.filter((r) => new Date(r.registration_date) >= oneWeekAgo).length;
  }, [enrichedRegistrations]);

  const noData = enrichedRegistrations.length === 0;

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 mx-auto max-w-screen-xl py-8 space-y-10 text-gray-800 dark:text-white">
      {/* ==== HEADER ==== */}
      <SubsResumeHeader
        deal={deal}
        // payments={payments}
        enrichedRegistrations={enrichedRegistrations}
      />

      {/* ==== ESTADOS (LOADING/ERROR/NO DATA) ==== */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[280px]">
          <svg className="animate-spin h-8 w-8 text-blue-500 mr-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="text-lg text-blue-500">Loading data...</span>
        </div>
      ) : fetchError ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center shadow">
          {fetchError}
        </div>
      ) : noData ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">No Activity Yet</h2>
          <p className="text-gray-500 text-sm">
            Once you start referring users, their registrations and earnings will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* ==== TABLA (AHORA DEBAJO DEL HEADER) ==== */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 overflow-x-auto">
            <PaymentsRegistersTable registrationReports={filteredData} />
          </div>

          {/* ==== GRAFICAS ==== */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
            {/* Pie chart */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 col-span-1 flex flex-col items-center">
              <h4 className="text-sm font-semibold mb-4 text-center">Users Paid vs Unpaid</h4>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label
                  >
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 flex gap-2 justify-center text-xs">
                <span className="text-green-500">● Paid</span>
                <span className="text-red-500">● Unpaid</span>
              </div>
            </div>

            {/* Line chart de ganancias */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 col-span-2 flex flex-col">
              <h4 className="text-sm font-semibold mb-4 text-center">Total Earnings Over Time</h4>
              {earningsByDate.length === 0 ? (
                <div className="text-gray-500 text-center py-8">No earnings yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={earningsByDate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#6366F1"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="USDT Earned"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ==== WEEKLY PROGRESS ==== */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mt-6">
            <h4 className="text-sm font-semibold mb-3">Weekly Progress</h4>
            <p className="text-4xl font-bold text-blue-600">{newUsersThisWeek}</p>
            <p className="text-gray-500 mt-2 text-sm">Sub-affiliates registered in the last 7 days</p>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs text-gray-500 px-1">
                <span>{new Date(new Date().setDate(new Date().getDate() - 7)).toLocaleDateString()}</span>
                <span>Next Bonus</span>
                <span>{new Date(new Date().setDate(new Date().getDate() + 4)).toLocaleDateString()}</span>
              </div>
              <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-3 transition-all duration-700"
                  style={{ width: `${Math.min((paidCount / 10) * 100, 100)}%` }}
                />
              </div>
              <div className="text-sm text-center mt-1">
                <span className="font-semibold text-green-600">{paidCount}</span> / 10 sub-affiliates paid
                <span className="font-semibold text-green-600"> → +${300}</span> USDT
              </div>
            </div>
          </div>
        </>
      )}

      {/* ==== MINI TUTORIAL ==== */}
      <div className="max-w-md mx-auto mt-10">
        <MiniTutorial />
      </div>
    </div>
  );
};

export default SubAffilliateResume;