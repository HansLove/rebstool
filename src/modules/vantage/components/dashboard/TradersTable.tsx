import { useState, useMemo } from "react";
import { Search, Filter, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import type { TraderKPI, TraderStatusFlag } from "../../types/rebatesOverview";

interface TradersTableProps {
  traders: TraderKPI[];
  onTraderClick?: (trader: TraderKPI) => void;
  isLoading?: boolean;
}

type SortField = "name" | "lots7d" | "totalDeposits" | "withdrawalPct30d" | "statusFlag";
type SortDirection = "asc" | "desc";

export default function TradersTable({ traders, onTraderClick, isLoading }: TradersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TraderStatusFlag | "all">("all");
  const [sortField, setSortField] = useState<SortField>("lots7d");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  // Filter traders
  const filteredTraders = useMemo(() => {
    let filtered = traders;

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(term) ||
          t.tradingAccountLogin.toString().includes(term) ||
          t.userId.toString().includes(term) ||
          (t.email && t.email.toLowerCase().includes(term))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.statusFlag === statusFilter);
    }

    return filtered;
  }, [traders, searchTerm, statusFilter]);

  // Sort traders
  const sortedTraders = useMemo(() => {
    const sorted = [...filteredTraders];
    sorted.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "lots7d":
          aValue = a.lots7d;
          bValue = b.lots7d;
          break;
        case "totalDeposits":
          aValue = a.totalDeposits;
          bValue = b.totalDeposits;
          break;
        case "withdrawalPct30d":
          aValue = a.withdrawalPct30d;
          bValue = b.withdrawalPct30d;
          break;
        case "statusFlag":
          aValue = a.statusFlag;
          bValue = b.statusFlag;
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return sorted;
  }, [filteredTraders, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedTraders.length / itemsPerPage);
  const paginatedTraders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedTraders.slice(start, start + itemsPerPage);
  }, [sortedTraders, currentPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

  const getStatusBadge = (status: TraderStatusFlag) => {
    const configs = {
      ok: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-300",
        border: "border-green-300 dark:border-green-700",
        label: "OK",
      },
      high_withdrawal_risk: {
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-700 dark:text-amber-300",
        border: "border-amber-300 dark:border-amber-700",
        label: "High withdrawal",
      },
      critical_withdrawal: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-300",
        border: "border-red-300 dark:border-red-700",
        label: "Critical",
      },
      emptied_account: {
        bg: "bg-red-200 dark:bg-red-900/50",
        text: "text-red-800 dark:text-red-200",
        border: "border-red-400 dark:border-red-600",
        label: "Emptied",
      },
    };

    const config = configs[status];
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} ${config.border} border`}
      >
        {config.label}
      </span>
    );
  };

  const statusCounts = useMemo(() => {
    const counts = {
      ok: 0,
      high_withdrawal_risk: 0,
      critical_withdrawal: 0,
      emptied_account: 0,
    };
    traders.forEach((t) => {
      counts[t.statusFlag]++;
    });
    return counts;
  }, [traders]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Traders Overview
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 flex-wrap">
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
              OK: {statusCounts.ok}
            </span>
            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">
              High Risk: {statusCounts.high_withdrawal_risk}
            </span>
            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
              Critical: {statusCounts.critical_withdrawal}
            </span>
            <span className="px-2 py-1 bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded">
              Emptied: {statusCounts.emptied_account}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, login, or email..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 mt-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="ok">OK</option>
            <option value="high_withdrawal_risk">High Withdrawal Risk</option>
            <option value="critical_withdrawal">Critical Withdrawal</option>
            <option value="emptied_account">Emptied Account</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Trader
                  {sortField === "name" && (
                    sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                  )}
                </button>
              </th>
              <th className="text-right py-3 px-4">
                <button
                  onClick={() => handleSort("lots7d")}
                  className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white ml-auto"
                >
                  Lots (7d)
                  {sortField === "lots7d" && (
                    sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                  )}
                </button>
              </th>
              <th className="text-right py-3 px-4">
                <button
                  onClick={() => handleSort("totalDeposits")}
                  className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white ml-auto"
                >
                  Deposits
                  {sortField === "totalDeposits" && (
                    sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                  )}
                </button>
              </th>
              <th className="text-right py-3 px-4">
                <button
                  onClick={() => handleSort("withdrawalPct30d")}
                  className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white ml-auto"
                >
                  Withdrawals 30d
                  {sortField === "withdrawalPct30d" && (
                    sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                  )}
                </button>
              </th>
              <th className="text-center py-3 px-4">
                <button
                  onClick={() => handleSort("statusFlag")}
                  className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mx-auto"
                >
                  Status
                  {sortField === "statusFlag" && (
                    sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                  )}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedTraders.length > 0 ? (
              paginatedTraders.map((trader) => (
                <tr
                  key={trader.userId}
                  onClick={() => onTraderClick?.(trader)}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {trader.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {trader.tradingAccountLogin}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {trader.lots7d.toFixed(2)}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {trader.numberOfDeposits} deposits
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ({formatCurrency(trader.totalDeposits)})
                    </p>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(trader.withdrawalAmount30d)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatPercent(trader.withdrawalPct30d)}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {getStatusBadge(trader.statusFlag)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-500 dark:text-gray-400">
                  No traders found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {paginatedTraders.length > 0 ? (
          paginatedTraders.map((trader) => (
            <div
              key={trader.userId}
              onClick={() => onTraderClick?.(trader)}
              className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {trader.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    {trader.tradingAccountLogin}
                  </p>
                </div>
                {getStatusBadge(trader.statusFlag)}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Lots (7d)</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {trader.lots7d.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Withdrawal %</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatPercent(trader.withdrawalPct30d)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>No traders found matching your filters</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Showing {paginatedTraders.length} of {sortedTraders.length} traders
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Previous
            </button>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

