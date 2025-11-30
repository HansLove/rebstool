import { useState, useMemo } from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import type { RebateWithStatus } from "../../utils/rebateStatus";
import RebateRow from "./RebateRow";

interface RebatesTableProps {
  rebates: RebateWithStatus[];
  onRebateClick?: (rebate: RebateWithStatus) => void;
}

type SortField = "commission" | "equity" | "status" | "userId";
type SortDirection = "asc" | "desc";

export default function RebatesTable({ rebates, onRebateClick }: RebatesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<RebateWithStatus["status"] | "all">("all");
  const [sortField, setSortField] = useState<SortField>("commission");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Filter rebates
  const filteredRebates = useMemo(() => {
    let filtered = rebates;

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.userId.toString().includes(term) ||
          r.login.toString().includes(term) ||
          r.currency.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    return filtered;
  }, [rebates, searchTerm, statusFilter]);

  // Sort rebates
  const sortedRebates = useMemo(() => {
    const sorted = [...filteredRebates];
    sorted.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortField) {
        case "commission":
          aValue = a.commission;
          bValue = b.commission;
          break;
        case "equity":
          aValue = a.equity;
          bValue = b.equity;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "userId":
          aValue = a.userId;
          bValue = b.userId;
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
  }, [filteredRebates, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const statusCounts = useMemo(() => {
    const counts = { hot: 0, cooling: 0, at_risk: 0 };
    rebates.forEach((r) => {
      counts[r.status]++;
    });
    return counts;
  }, [rebates]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Live Rebates Control Panel
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
              Hot: {statusCounts.hot}
            </span>
            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">
              Cooling: {statusCounts.cooling}
            </span>
            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
              At Risk: {statusCounts.at_risk}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by User ID, Login, or Currency..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="hot">Hot</option>
              <option value="cooling">Cooling</option>
              <option value="at_risk">At Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-4 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => handleSort("commission")}
          className={`flex items-center gap-1 text-xs font-medium transition-colors ${
            sortField === "commission"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
          Commission
        </button>
        <button
          onClick={() => handleSort("equity")}
          className={`flex items-center gap-1 text-xs font-medium transition-colors ${
            sortField === "equity"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
          Equity
        </button>
        <button
          onClick={() => handleSort("status")}
          className={`flex items-center gap-1 text-xs font-medium transition-colors ${
            sortField === "status"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
          Status
        </button>
        <div className="flex-1" />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {sortedRebates.length} of {rebates.length} rebates
        </p>
      </div>

      {/* Rebates List */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {sortedRebates.length > 0 ? (
          sortedRebates.map((rebate) => (
            <RebateRow key={rebate.id} rebate={rebate} onClick={onRebateClick} />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>No rebates found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

