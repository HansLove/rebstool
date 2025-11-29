/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

interface SubAffiliateSingleRegisterProps {
  record: any;
}

export default function SubAffiliateSingleRegister({ record }: SubAffiliateSingleRegisterProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (record.qualification_date) {
      const qualificationDate = new Date(record.qualification_date).getTime();
      const sevenDaysLater = qualificationDate + 30 * 24 * 60 * 60 * 1000; // 7 días en ms
      const now = Date.now();
      const secondsLeft = Math.max(Math.floor((sevenDaysLater - now) / 1000), 0);
      setTimeLeft(secondsLeft);
    }
  }, [record.qualification_date]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (totalSeconds: number) => {
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <tr className="hover:bg-gray-50 transition">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.customer_name || "Unknown"}</td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
        ${record.first_deposit?.toFixed(2) || "0.00"}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
        {record.volume?.toFixed(2) || "0.00"}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {record.country || "N/A"}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            record.status === "New"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {record.status}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(record.registration_date).toLocaleDateString()}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-purple-600">
        {record.qualification_date
          ? (timeLeft > 0 ? `⏳ ${formatTime(timeLeft)}` : "💸 Ready to Pay")
          : "No trigger"}
      </td>
    </tr>
  );
}
