import { useState, useMemo } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { splitDecimals } from "@/core/utils/splitDecimals";
import { UserDataType } from "@/core/types/userData";
import { countryToFlag } from "@/core/utils/countryToFlag";
import { FaChevronUp, FaSearch, FaFilter, FaArrowLeft } from "react-icons/fa";


export default function TopDepositsPage() {
  const { registrationsReport }: { registrationsReport: UserDataType[] } = useOutletContext();
  const navigate = useNavigate();

  const [displayCount, setDisplayCount] = useState(20);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sortBy, setSortBy] = useState<'deposits' | 'volume'>('deposits');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const sortedData = useMemo(() => {
    return [...registrationsReport].sort((a, b) => {
      if (sortBy === 'deposits') {
        return (b.net_deposits || 0) - (a.net_deposits || 0);
      } else {
        return (b.volume || 0) - (a.volume || 0);
      }
    });
  }, [registrationsReport, sortBy]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedData;
    return sortedData.filter(item => 
      item.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.country?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedData, searchTerm]);

  const topAffiliates = useMemo(() => filteredData.slice(0, displayCount), [filteredData, displayCount]);

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 20);
  };

  const toggleCollapse = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
    } else {
      // Navigate back to dashboard when collapsing
      navigate('/dashboard');
    }
  };

  const goBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={goBackToDashboard}
                  className="flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  <FaArrowLeft />
                  Back to Dashboard
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                    Top Deposits & Volume
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    Track the highest performing affiliates by deposits and trading volume
                  </p>
                </div>
              </div>
              <button
                onClick={toggleCollapse}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <FaChevronUp />
                Collapse
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'deposits' | 'volume')}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="deposits">Sort by Deposits</option>
                  <option value="volume">Sort by Volume</option>
                </select>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600"
                >
                  <FaFilter />
                  Filters
                </button>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {filteredData.length}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Total Affiliates</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${splitDecimals(filteredData.reduce((sum, item) => sum + (item.net_deposits || 0), 0).toFixed(2))}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">Total Deposits</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {splitDecimals(filteredData.reduce((sum, item) => sum + (item.volume || 0), 0).toFixed(2))}
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-400">Total Volume</div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        {!isCollapsed && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Deposits
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Volume
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Commission
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {topAffiliates.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                        {item.customer_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                        <div className="flex items-center">
                          <span className="mr-2 text-lg">{countryToFlag(item.country)}</span>
                          {item.country?.trim() || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">
                        ${splitDecimals((item.net_deposits || 0).toFixed(2))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {splitDecimals((item.volume || 0).toFixed(2))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-purple-600 dark:text-purple-400">
                        ${splitDecimals((item.commission || 0).toFixed(2))}
                      </td>
                    </tr>
                  ))}

                  {topAffiliates.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                        <div className="flex flex-col items-center">
                          <div className="text-4xl mb-2">📊</div>
                          <div className="text-lg font-medium">No data available</div>
                          <div className="text-sm">Try adjusting your search or filters</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Load More Button */}
            {displayCount < filteredData.length && (
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-700 border-t border-slate-200 dark:border-slate-600">
                <div className="flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    Load More ({filteredData.length - displayCount} remaining)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
