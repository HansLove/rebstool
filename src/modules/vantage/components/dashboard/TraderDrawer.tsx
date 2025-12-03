import { X } from "lucide-react";
import type { TraderKPI, TraderStatusFlag } from "../../types/rebatesOverview";

interface TraderDrawerProps {
  trader: TraderKPI | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TraderDrawer({ trader, isOpen, onClose }: TraderDrawerProps) {
  if (!isOpen || !trader) return null;

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

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
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text} ${config.border} border`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Trader Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="mb-6">
            {getStatusBadge(trader.statusFlag)}
          </div>

          {/* Basic Info */}
          <div className="space-y-4 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Basic Information
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {trader.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Trading Account Login</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">
                    {trader.tradingAccountLogin}
                  </p>
                </div>
                {trader.email && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {trader.email}
                    </p>
                  </div>
                )}
                {trader.phone && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {trader.phone}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Key Metrics
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Lots Traded */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Lots (7d)</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {trader.lots7d.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Lots (30d)</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {trader.lots30d.toFixed(2)}
                </p>
              </div>

              {/* Deposits */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Number of Deposits</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {trader.numberOfDeposits}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Deposits</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(trader.totalDeposits)}
                </p>
              </div>

              {/* Withdrawals */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Withdrawal Amount (30d)</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(trader.withdrawalAmount30d)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Withdrawal % (30d)</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatPercent(trader.withdrawalPct30d)}
                </p>
              </div>

              {/* Current Status */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Equity</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(trader.currentEquity)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Commission</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(trader.commission)}
                </p>
              </div>
            </div>
          </div>

          {/* Warning for critical status */}
          {(trader.statusFlag === "critical_withdrawal" ||
            trader.statusFlag === "emptied_account" ||
            trader.statusFlag === "high_withdrawal_risk") && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">
                ⚠️ Account Alert
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                {trader.statusFlag === "emptied_account"
                  ? "This account has been emptied. Previous equity was significantly higher than current."
                  : trader.statusFlag === "critical_withdrawal"
                  ? "Critical withdrawal detected. This account has withdrawn more than 70% of its equity."
                  : "High withdrawal risk detected. Monitor this account closely."}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

