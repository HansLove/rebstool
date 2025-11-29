import { useEffect, useMemo, useState } from "react";

interface RegisterRecord {
  customer_name: string | null;
  first_deposit: number;
  volume: number;
  country: string | null;
  status: string;
  registration_date: string;
  qualification_date?: string | null;
}

interface SubAffiliateSingleRegisterProps {
  record: RegisterRecord;
}

const getRemainingSeconds = (qualificationDate: string) => {
  const qualification = new Date(qualificationDate).getTime();
  const deadline = qualification + 30 * 24 * 60 * 60 * 1000; // 30 days
  return Math.max(Math.floor((deadline - Date.now()) / 1000), 0);
};

const formatTime = (seconds: number) => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${days}d ${hours}h ${minutes}m ${secs}s`;
};

export default function SubAffiliateSingleRegister({ record }: SubAffiliateSingleRegisterProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Initialize countdown
  useEffect(() => {
    if (record.qualification_date) {
      setTimeLeft(getRemainingSeconds(record.qualification_date));
    }
  }, [record.qualification_date]);

  // Countdown effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => Math.max(prev - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const statusColor = record.status === "New" ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300" : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300";

  const countdownLabel = useMemo(() => {
    if (!record.qualification_date) return "No trigger";
    return timeLeft > 0 ? formatTime(timeLeft) : "💸 Ready to Pay";
  }, [timeLeft, record.qualification_date]);

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
        {record.customer_name || <span className="text-slate-400 dark:text-slate-500 italic">Unknown</span>}
      </td>

      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">
        ${record.first_deposit?.toFixed(2) ?? "0.00"}
      </td>

      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">
        {record.volume?.toFixed(2) ?? "0.00"}
      </td>

      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
        {record.country || "N/A"}
      </td>

      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
          {record.status}
        </span>
      </td>

      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
        {new Date(record.registration_date).toLocaleDateString()}
      </td>

      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 dark:text-blue-400">
        {countdownLabel}
      </td>
    </tr>
  );
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useState } from "react";

// interface SubAffiliateSingleRegisterProps {
//   record: any;
// }

// export default function SubAffiliateSingleRegister({ record }: SubAffiliateSingleRegisterProps) {
//   const [timeLeft, setTimeLeft] = useState<number>(0);

//   useEffect(() => {
//     if (record.qualification_date) {
//       const qualificationDate = new Date(record.qualification_date).getTime();
//       const sevenDaysLater = qualificationDate + 30 * 24 * 60 * 60 * 1000; // 7 días en ms
//       const now = Date.now();
//       const secondsLeft = Math.max(Math.floor((sevenDaysLater - now) / 1000), 0);
//       setTimeLeft(secondsLeft);
//     }
//   }, [record.qualification_date]);

//   useEffect(() => {
//     if (timeLeft <= 0) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft]);

//   const formatTime = (totalSeconds: number) => {
//     const days = Math.floor(totalSeconds / (3600 * 24));
//     const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = totalSeconds % 60;
    
//     return `${days}d ${hours}h ${minutes}m ${seconds}s`;
//   };

//   return (
//     <tr className="hover:bg-gray-50/5 transition">
//       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-900">{record.customer_name || "Unknown"}</td>

//       <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
//         ${record.first_deposit?.toFixed(2) || "0.00"}
//       </td>

//       <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
//         {record.volume?.toFixed(2) || "0.00"}
//       </td>

//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-500">
//         {record.country || "N/A"}
//       </td>

//       <td className="px-6 py-4 whitespace-nowrap text-sm">
//         <span
//           className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//             record.status === "New"
//               ? "bg-green-100 text-green-800"
//               : "bg-gray-100 text-gray-800"
//           }`}
//         >
//           {record.status}
//         </span>
//       </td>

//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//         {new Date(record.registration_date).toLocaleDateString()}
//       </td>

//       <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-500">
//         {record.qualification_date
//           ? (timeLeft > 0 ? ` ${formatTime(timeLeft)} `: "💸 Ready to Pay")
//           : "No trigger"}
//       </td>
//     </tr>
//   );
// }