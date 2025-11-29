/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { differenceInDays, format } from "date-fns";
import emojiFlags from "emoji-flags";
import { splitDecimals } from "@/core/utils/splitDecimals";
import { getCountryName } from "@/core/utils/getCountryName";
import { useOutletContext } from "react-router-dom";

export default function ActivyAnalysisPage() {
  const { registrationsReport } = useOutletContext<any>();
  const activeThreshold = 1;

  const getFlag = (countryCode: string) => {
    const country = emojiFlags.countryCode(countryCode.toUpperCase());
    return country ? country.emoji : "🌐";
  };

  const summary = useMemo(() => {
    const dataArray = Array.isArray(registrationsReport)
      ? registrationsReport
      : [registrationsReport];

    let activeCount = 0;
    let inactiveCount = 0;
    let totalActiveVolume = 0;

    dataArray.forEach((user: any) => {
      const vol = parseFloat(user.volume) || 0;
      if (vol >= activeThreshold) {
        activeCount++;
        totalActiveVolume += vol;
      } else {
        inactiveCount++;
      }
    });

    return { activeCount, inactiveCount, totalActiveVolume };
  }, [registrationsReport]);

  const { topUsers, noVolumeUsers } = useMemo(() => {
    const sorted = [...registrationsReport].sort(
      (a: any, b: any) => (b.volume || 0) - (a.volume || 0)
    );
    const top = sorted.filter((u: any) => u.volume > 0);
    const noVol = sorted.filter((u) => !u.volume || u.volume === 0);
    return { topUsers: top, noVolumeUsers: noVol };
  }, [registrationsReport]);

  return (
    <div className="max-w-9xl mx-auto px-4 py-6">
      <div className="text-center mb-6 text-white">
        <h2 className="text-2xl font-semibold">📊 Active vs Inactive Users</h2>
        <p className="text-gray-300">
          Users are considered <strong>active</strong> with at least {activeThreshold} lot traded.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-4">
          <h4 className="text-lg font-bold mb-3">🔥 Top Users by Volume</h4>
          <table className="w-full text-sm">
            <thead className="text-left border-b">
              <tr>
                <th className="py-1">Name</th>
                <th className="py-1">Country</th>
                <th className="py-1">Volume</th>
                <th className="py-1">Reg Date</th>
                <th className="py-1">Days Since</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((u: any, i: number) => {
                const regDate = u?.qualification_date
                  ? new Date(u?.qualification_date)
                  : null;
                const days = regDate ? differenceInDays(new Date(), regDate) : "-";

                return (
                  <tr key={i} className="border-b">
                    <td className="py-2">{u?.customer_name || u?.ce_user_id}</td>
                    <td className="py-2">
                      {getFlag(u?.country)} {getCountryName(u?.country)}
                    </td>
                    <td className="py-2 font-semibold">{splitDecimals(u.volume.toFixed(2))}</td>
                    <td className="py-2">{regDate ? format(regDate, "MMM dd yyyy") : "N/A"}</td>
                    <td className="py-2 text-center">{days}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h4 className="text-lg font-bold mb-3">⚠️ Users with No Volume</h4>
          <table className="w-full text-sm">
            <thead className="text-left border-b">
              <tr>
                <th className="py-1">Name</th>
                <th className="py-1">Country</th>
                <th className="py-1">Reg Date</th>
                <th className="py-1">Inactive Days</th>
              </tr>
            </thead>
            <tbody>
              {noVolumeUsers.map((u: any, i: number) => {
                const regDate = u?.registration_date
                  ? new Date(u?.registration_date)
                  : null;
                const inactivity = u?.registration_date
                  ? differenceInDays(new Date(), new Date(u?.registration_date))
                  : "-";

                return (
                  <tr key={i} className="border-b">
                    <td className="py-2">{u?.customer_name || u?.ce_user_id}</td>
                    <td className="py-2">
                      {getFlag(u?.country)} {getCountryName(u?.country)}
                    </td>
                    <td className="py-2">{regDate ? format(regDate, "MMM dd yyyy") : "N/A"}</td>
                    <td className="py-2">{inactivity}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          Total Active: <strong>{summary.activeCount}</strong> — Inactive: <strong>{summary.inactiveCount}</strong>
        </p>
        <p>
          📈 Total Active Volume: <strong>${splitDecimals(summary.totalActiveVolume.toFixed(2))}</strong>
        </p>
      </div>
    </div>
  );
}