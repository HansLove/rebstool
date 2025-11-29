import { CgInfo, CgUser } from "react-icons/cg";
import { FiBarChart2, FiZap } from "react-icons/fi";

const PerformancePage = () => {
  // Add missing data definitions
  const payoutData = {
    totalEarned: 100,
    pendingPayout: 1000.0,
    readyToPay: 0,
  };

  return (
    <div>
      {/* Stats Cards - Stack on mobile, grid on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 relative">
          <h3 className="text-gray-300 text-sm font-medium">
            Total Registrations
          </h3>
          <p className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mt-2">
            9
          </p>
          <p className="text-green-400 text-xs sm:text-sm mt-2">+4 this week</p>
          <CgUser className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 absolute top-4 sm:top-6 right-4 sm:right-6" />
        </div>

        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 relative">
          <h3 className="text-gray-300 text-sm font-medium">Conversion Rate</h3>
          <p className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mt-2">
            8.4%
          </p>
          <p className="text-green-400 text-xs sm:text-sm mt-2">
            +1.2% from last month
          </p>
          <FiZap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 absolute top-4 sm:top-6 right-4 sm:right-6" />
        </div>

        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 relative sm:col-span-2 ">
          <h3 className="text-gray-300 text-sm font-medium">
            Total Commissions
          </h3>
          <p className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mt-2">
            900
          </p>
          <p className="text-green-400 text-xs sm:text-sm mt-2">
            +85 this week
          </p>
          <FiBarChart2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400 absolute top-4 sm:top-6 right-4 sm:right-6" />
        </div>
      </div>

      {/* Payout Progress Tracker */}
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h2 className="text-white text-base sm:text-lg font-semibold">
            Payout Progress
          </h2>
          <button className="flex items-center text-xs sm:text-sm text-white">
            <CgInfo className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> How payouts work
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <div>
            <div className="flex justify-between text-xs sm:text-sm mb-1">
              <span className="text-gray-300">Total Earned</span>
              <span className="text-white font-medium">
                ${payoutData.totalEarned.toFixed(2)}
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full">
              <div
                className="h-2 bg-green-500 rounded-full"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs sm:text-sm mb-1">
              <span className="text-gray-300">Pending Conditions</span>
              <span className="text-white font-medium">
                ${payoutData.pendingPayout.toFixed(2)}
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full">
              <div
                className="h-2 bg-yellow-500 rounded-full"
                style={{ width: "0%" }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs sm:text-sm mb-1">
              <span className="text-gray-300">Ready to Pay</span>
              <span className="text-green-400 font-medium">
                ${payoutData.readyToPay.toFixed(2)}
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full">
              <div
                className="h-2 bg-blue-500 rounded-full"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;
