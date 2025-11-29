/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGeoChart } from "@/components/GoogleGeoChart";
import { useOutletContext, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

export default function WorldMap() {
  const { registrationsReport } = useOutletContext<any>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative">
      {/* Close button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 right-4 z-20 bg-white dark:bg-slate-800 rounded-full p-3 shadow-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        title="Close map"
      >
        <FaTimes className="text-slate-600 dark:text-slate-300 text-lg" />
      </button>

      <div id="map_1" className="w-full">
        <GoogleGeoChart 
          mapHeight="100vh"
          mapWidth="100%"
          data={registrationsReport}
          showConversionLeaders={true} />
      </div>
    </div>
  )
}
