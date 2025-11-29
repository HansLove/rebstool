import React, { useState } from "react";
import { CgChevronDown, CgChevronRight, CgUser } from "react-icons/cg";
import { FiHelpCircle } from "react-icons/fi";

// Define TypeScript interfaces
interface NetworkNode {
  name: string;
  id: string;
  totalEarnings: string;
  referrals: number;
  volume: number;
  tier: number;
  children?: NetworkNode[];
}

const MynetworkPage: React.FC = () => {
  const [expandedTier, setExpandedTier] = useState<string | null>(null);

  const networkData: NetworkNode = {
    name: "You",
    id: "user-123",
    totalEarnings: "$2,689.62",
    referrals: 24,
    volume: 85.7,
    tier: 1,
    children: [
      {
        name: "Michael Chen",
        id: "user-456",
        totalEarnings: "$842.35",
        referrals: 12,
        volume: 42.6,
        tier: 2,
        children: [
          {
            name: "Lisa Wong",
            id: "user-789",
            totalEarnings: "$326.80",
            referrals: 5,
            volume: 18.2,
            tier: 3,
          },
          {
            name: "John Smith",
            id: "user-790",
            totalEarnings: "$185.50",
            referrals: 3,
            volume: 9.7,
            tier: 3,
          },
        ],
      },
      {
        name: "Emma Rodriguez",
        id: "user-457",
        totalEarnings: "$567.40",
        referrals: 8,
        volume: 25.3,
        tier: 2,
        children: [
          {
            name: "David Kim",
            id: "user-791",
            totalEarnings: "$125.90",
            referrals: 2,
            volume: 5.8,
            tier: 3,
          },
        ],
      },
      {
        name: "Carlos Mendez",
        id: "user-458",
        totalEarnings: "$458.75",
        referrals: 6,
        volume: 19.8,
        tier: 2,
      },
      {
        name: "Sarah Wilson",
        id: "user-459",
        totalEarnings: "$320.15",
        referrals: 4,
        volume: 14.2,
        tier: 2,
      },
    ],
  };

  // Get color for tier dot
  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1:
        return "bg-blue-500";
      case 2:
        return "bg-green-500";
      case 3:
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen text-white transition-colors duration-300 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Card */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-300">
          {/* Header */}
          <div className="p-4 sm:p-6 flex flex-wrap justify-between items-center border-b border-gray-700">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              My Affiliate Network
            </h1>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm text-gray-300">Tier 1 (You)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-300">Tier 2</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
              <span className="text-sm text-gray-300">Tier 3</span>
            </div>
          </div>

          {/* Summary box */}
          <div className="bg-gray-700 p-4 mx-4 sm:mx-6 rounded-lg mb-4 transition-colors duration-300">
            <p className="text-sm sm:text-base text-gray-200">
              Your network has{" "}
              <span className="font-bold text-white">
                {networkData.children?.length || 0} sub-affiliates
              </span>{" "}
              across <span className="font-bold text-white">3 tiers</span>,
              generating a total of{" "}
              <span className="font-bold text-white">
                {networkData.totalEarnings}
              </span>{" "}
              in commissions.
            </p>
          </div>

          {/* User stats card */}
          <div className="mx-4 sm:mx-6 mb-6">
            <div className="bg-blue-900 rounded-lg overflow-hidden transition-colors duration-300">
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <CgUser className="h-4 w-4 text-white" />
                  </div>
                  <span className="ml-3 font-semibold text-white">You</span>
                </div>
                <div className="flex gap-6 sm:gap-10 flex-wrap">
                  <div>
                    <p className="text-xs text-blue-200">Referrals</p>
                    <p className="text-lg font-bold text-white">
                      {networkData.referrals}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-200">Volume</p>
                    <p className="text-lg font-bold text-white">
                      {networkData.volume}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-200">Earnings</p>
                    <p className="text-lg font-bold text-white">
                      {networkData.totalEarnings}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setExpandedTier(
                      expandedTier === networkData.id ? null : networkData.id
                    )
                  }
                  className="ml-auto p-2 rounded-full hover:bg-blue-800 transition-colors duration-200"
                >
                  {expandedTier === networkData.id ? (
                    <CgChevronDown className="h-5 w-5 text-white" />
                  ) : (
                    <CgChevronRight className="h-5 w-5 text-white" />
                  )}
                </button>
              </div>

              {/* Expanded Network Tree */}
              {expandedTier === networkData.id && (
                <div className="border-t border-blue-700 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {networkData.children?.map((child) => (
                      <div
                        key={child.id}
                        className="bg-blue-950 rounded-lg p-4 transition-colors duration-300"
                      >
                        <div className="flex items-center mb-3">
                          <div
                            className={`w-3 h-3 ${getTierColor(
                              child.tier
                            )} rounded-full mr-2`}
                          ></div>
                          <span className="font-medium text-white">
                            {child.name}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-blue-200 text-xs">Referrals</p>
                            <p className="text-white">{child.referrals}</p>
                          </div>
                          <div>
                            <p className="text-blue-200 text-xs">Volume</p>
                            <p className="text-white">{child.volume}</p>
                          </div>
                          <div>
                            <p className="text-blue-200 text-xs">Earnings</p>
                            <p className="text-white">{child.totalEarnings}</p>
                          </div>
                        </div>
                        {child.children && child.children.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-blue-700">
                            <p className="text-blue-200 text-xs mb-2">
                              Sub-affiliates:
                            </p>
                            <div className="space-y-2">
                              {child.children.map((grandchild) => (
                                <div
                                  key={grandchild.id}
                                  className="flex items-center justify-between text-xs"
                                >
                                  <div className="flex items-center">
                                    <div
                                      className={`w-2 h-2 ${getTierColor(
                                        grandchild.tier
                                      )} rounded-full mr-2`}
                                    ></div>
                                    <span className="text-white">
                                      {grandchild.name}
                                    </span>
                                  </div>
                                  <span className="text-white">
                                    {grandchild.totalEarnings}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Grow network section */}
          <div className="mx-4 sm:mx-6 mb-6 rounded-lg p-4 sm:p-6 bg-gray-700 transition-colors duration-300">
            <h3 className="text-white text-lg font-semibold mb-2">
              Grow Your Network
            </h3>
            <p className="text-sm mb-4 text-gray-300">
              Expanding your network to 10 direct referrals will increase your
              commission rate by 0.5%!
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-center transition-colors duration-200">
                <CgUser className="h-4 w-4 mr-2" /> Invite New Affiliates
              </button>
              <button className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-center transition-colors duration-200">
                <FiHelpCircle className="h-4 w-4 mr-2" /> Network Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MynetworkPage;
