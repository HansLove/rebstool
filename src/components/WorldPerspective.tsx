import { Link } from "react-router-dom";
import { GoogleGeoChart } from "./GoogleGeoChart"; // wherever you placed it
import { FaExpand } from "react-icons/fa6";

interface WorldPerspectiveProps {
  // domesticRevenue: number;
  // internationalRevenue: number;
  registrationsData?: Array<{
    country?: string;
    net_deposits?: number;
    // ...
  }>;
}

export default function WorldPerspective({
  registrationsData = [],
}: WorldPerspectiveProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-400 dark:border-slate-600 animate-border overflow-hidden">
      <div className="w-full relative  ">
        <div className=" text-center ">
      <Link
          to="/worldMap"
          className="block ml-auto top-2 absolute right-2  z-10 text-sm  text-slate-300"
        >
          <FaExpand/>
        </Link>
          {/* 1) Insert our GoogleGeoChart */}
          <div id="map_1" className="w-full ">
            <GoogleGeoChart 
            data={registrationsData}
            showConversionLeaders={false} />
          </div>

         
        </div>
      </div>
    </div>
  );
}
