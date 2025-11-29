/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { AlertTriangle, TrendingDown, MessageCircle, UserX, DollarSign, Calendar, MapPin, Clock, Search, ChevronDown, ChevronUp, X } from "lucide-react";
import type { ComparisonResult } from "../types";
import { format } from "date-fns";
import { formatPhoneNumber, getWhatsAppUrl } from "../utils/phoneFormatter";

interface AlertActionsProps {
  comparisonResult: ComparisonResult | null;
}

interface AlertItem {
  type: "abandonment" | "withdrawal" | "high_value_lost" | "potential_risk";
  priority: "high" | "medium" | "low";
  userId: number;
  name: string;
  message: string;
  action: string;
  phone?: string;
  equity?: number;
  equityChange?: number;
  // Additional context
  baseCurrency?: string;
  accountNumber?: number;
  registerDate?: number;
  lastDepositTime?: number | null;
  lastDepositAmount?: number | null;
  lastDepositCurrency?: string | null;
  lastTradeTime?: number | null;
  lastTradeSymbol?: string | null;
  ownerName?: string;
  activityDate?: number; // When the change/activity occurred
}

interface AccountAlert {
  accountNumber: number;
  equity: number;
  equityChange: number;
  message: string;
  type: string;
}

interface ConsolidatedAlertItem extends Omit<AlertItem, "accountNumber" | "equity" | "equityChange" | "message"> {
  accounts: AccountAlert[];
  totalEquity: number;
  totalEquityChange: number;
  accountCount: number;
  // Grouped messages for cleaner display
  messageGroups: Array<{
    message: string;
    count: number;
    accounts: number[];
  }>;
}

export default function AlertActions({ comparisonResult }: AlertActionsProps) {
  const alerts = useMemo(() => {
    if (!comparisonResult) return [];

    const alertList: AlertItem[] = [];

    // High-value clients lost (abandonment)
    comparisonResult.removedUsers.forEach((user) => {
      if (user.equity > 1000) {
        alertList.push({
          type: "high_value_lost",
          priority: "high",
          userId: user.userId,
          name: user.name,
          message: `High-value client ($${user.equity.toLocaleString("en-US", { minimumFractionDigits: 2 })} equity) has left`,
          action: "Immediate outreach required",
          phone: user.phone || undefined,
          equity: user.equity,
          baseCurrency: user.baseCurrency,
          accountNumber: user.accountNmber,
          registerDate: user.registerDate,
          lastDepositTime: user.lastDepositTime,
          lastDepositAmount: user.lastDepositAmount,
          lastDepositCurrency: user.lastDepositCurrency,
          lastTradeTime: user.lastTradeTime,
          lastTradeSymbol: user.lastTradeSymbol,
          ownerName: user.ownerName,
          activityDate: user.lastDepositTime || user.lastTradeTime || user.registerDate,
        });
      } else if (user.equity > 100) {
        alertList.push({
          type: "abandonment",
          priority: "medium",
          userId: user.userId,
          name: user.name,
          message: `Client ($${user.equity.toLocaleString("en-US", { minimumFractionDigits: 2 })} equity) has left`,
          action: "Follow up recommended",
          phone: user.phone || undefined,
          equity: user.equity,
          baseCurrency: user.baseCurrency,
          accountNumber: user.accountNmber,
          registerDate: user.registerDate,
          lastDepositTime: user.lastDepositTime,
          lastDepositAmount: user.lastDepositAmount,
          lastDepositCurrency: user.lastDepositCurrency,
          lastTradeTime: user.lastTradeTime,
          lastTradeSymbol: user.lastTradeSymbol,
          ownerName: user.ownerName,
          activityDate: user.lastDepositTime || user.lastTradeTime || user.registerDate,
        });
      }
    });

    // Significant withdrawals from changed users
    comparisonResult.changedUsers.forEach((changedUser) => {
      const equityChange = changedUser.changes.find((c) => c.field === "equity");
      if (equityChange) {
        const oldEquity = equityChange.oldValue as number;
        const newEquity = equityChange.newValue as number;
        const change = newEquity - oldEquity;

        if (change < -500 && oldEquity > 100) {
          // Find when the withdrawal likely occurred (check lastDepositTime change)
          const depositChange = changedUser.changes.find((c) => c.field === "lastDepositTime");
          const activityDate = depositChange 
            ? (depositChange.newValue as number | null) 
            : changedUser.user.lastDepositTime || changedUser.user.lastTradeTime || Date.now();

          alertList.push({
            type: "withdrawal",
            priority: oldEquity > 1000 ? "high" : "medium",
            userId: changedUser.user.userId,
            name: changedUser.user.name,
            message: `Significant withdrawal: $${Math.abs(change).toLocaleString("en-US", { minimumFractionDigits: 2 })} (from $${oldEquity.toLocaleString("en-US", { minimumFractionDigits: 2 })} to $${newEquity.toLocaleString("en-US", { minimumFractionDigits: 2 })})`,
            action: "Check account status",
            phone: changedUser.user.phone || undefined,
            equity: newEquity,
            equityChange: change,
            baseCurrency: changedUser.user.baseCurrency,
            accountNumber: changedUser.user.accountNmber,
            registerDate: changedUser.user.registerDate,
            lastDepositTime: changedUser.user.lastDepositTime,
            lastDepositAmount: changedUser.user.lastDepositAmount,
            lastDepositCurrency: changedUser.user.lastDepositCurrency,
            lastTradeTime: changedUser.user.lastTradeTime,
            lastTradeSymbol: changedUser.user.lastTradeSymbol,
            ownerName: changedUser.user.ownerName,
            activityDate: activityDate as number,
          });
        }

        // Potential risk: equity dropping significantly but still active
        if (oldEquity > 500 && newEquity < 100 && newEquity > 0) {
          const depositChange = changedUser.changes.find((c) => c.field === "lastDepositTime");
          const activityDate = depositChange 
            ? (depositChange.newValue as number | null) 
            : changedUser.user.lastDepositTime || changedUser.user.lastTradeTime || Date.now();

          alertList.push({
            type: "potential_risk",
            priority: "medium",
            userId: changedUser.user.userId,
            name: changedUser.user.name,
            message: `Account equity dropped from $${oldEquity.toLocaleString("en-US", { minimumFractionDigits: 2 })} to $${newEquity.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            action: "Proactive contact recommended",
            phone: changedUser.user.phone || undefined,
            equity: newEquity,
            equityChange: change,
            baseCurrency: changedUser.user.baseCurrency,
            accountNumber: changedUser.user.accountNmber,
            registerDate: changedUser.user.registerDate,
            lastDepositTime: changedUser.user.lastDepositTime,
            lastDepositAmount: changedUser.user.lastDepositAmount,
            lastDepositCurrency: changedUser.user.lastDepositCurrency,
            lastTradeTime: changedUser.user.lastTradeTime,
            lastTradeSymbol: changedUser.user.lastTradeSymbol,
            ownerName: changedUser.user.ownerName,
            activityDate: activityDate as number,
          });
        }
      }
    });

    // Sort by priority: high first, then by equity (descending)
    const sortedAlerts = alertList.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return (b.equity || 0) - (a.equity || 0);
    });

    // Consolidate alerts by userId
    const consolidatedMap = new Map<number, ConsolidatedAlertItem>();

    sortedAlerts.forEach((alert) => {
      const existing = consolidatedMap.get(alert.userId);
      const accountNumber = alert.accountNumber || 0;

      if (existing) {
        // Check if this account already exists (avoid duplicates)
        const accountExists = existing.accounts.some(
          (acc) => acc.accountNumber === accountNumber
        );

        if (!accountExists) {
          // Add account to existing alert
          existing.accounts.push({
            accountNumber,
            equity: alert.equity || 0,
            equityChange: alert.equityChange || 0,
            message: alert.message,
            type: alert.type,
          });
          existing.totalEquity += alert.equity || 0;
          existing.totalEquityChange += alert.equityChange || 0;
          existing.accountCount += 1;
        } else {
          // Account already exists - update if this alert has higher priority or more significant change
          const existingAccount = existing.accounts.find(
            (acc) => acc.accountNumber === accountNumber
          );
          if (existingAccount) {
            // Keep the alert with more significant equity change or higher priority
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            const currentPriority = priorityOrder[alert.priority];
            const existingPriority = priorityOrder[
              existing.accounts.find((acc) => acc.accountNumber === accountNumber)?.type === "high_value_lost"
                ? "high"
                : existing.accounts.find((acc) => acc.accountNumber === accountNumber)?.type === "withdrawal"
                ? "medium"
                : "low"
            ] || 2;

            if (
              currentPriority < existingPriority ||
              Math.abs(alert.equityChange || 0) > Math.abs(existingAccount.equityChange)
            ) {
              // Update with more significant alert
              existing.totalEquity -= existingAccount.equity;
              existing.totalEquityChange -= existingAccount.equityChange;
              existing.totalEquity += alert.equity || 0;
              existing.totalEquityChange += alert.equityChange || 0;

              existingAccount.equity = alert.equity || 0;
              existingAccount.equityChange = alert.equityChange || 0;
              existingAccount.message = alert.message;
              existingAccount.type = alert.type;
            }
          }
        }

        // Keep highest priority
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (priorityOrder[alert.priority] < priorityOrder[existing.priority]) {
          existing.priority = alert.priority;
          existing.type = alert.type;
          existing.action = alert.action;
        }
      } else {
        // Create new consolidated alert
        consolidatedMap.set(alert.userId, {
          type: alert.type,
          priority: alert.priority,
          userId: alert.userId,
          name: alert.name,
          // message: alert.message,
          action: alert.action,
          phone: alert.phone,
          baseCurrency: alert.baseCurrency,
          registerDate: alert.registerDate,
          lastDepositTime: alert.lastDepositTime,
          lastDepositAmount: alert.lastDepositAmount,
          lastDepositCurrency: alert.lastDepositCurrency,
          lastTradeTime: alert.lastTradeTime,
          lastTradeSymbol: alert.lastTradeSymbol,
          ownerName: alert.ownerName,
          activityDate: alert.activityDate,
          accounts: [
            {
              accountNumber,
              equity: alert.equity || 0,
              equityChange: alert.equityChange || 0,
              message: alert.message,
              type: alert.type,
            },
          ],
          totalEquity: alert.equity || 0,
          totalEquityChange: alert.equityChange || 0,
          accountCount: 1,
          messageGroups: [],
        });
      }
    });

    // Group messages for cleaner display
    consolidatedMap.forEach((alert) => {
      const messageMap = new Map<string, number[]>();

      alert.accounts.forEach((account) => {
        const existing = messageMap.get(account.message);
        if (existing) {
          existing.push(account.accountNumber);
        } else {
          messageMap.set(account.message, [account.accountNumber]);
        }
      });

      alert.messageGroups = Array.from(messageMap.entries()).map(
        ([message, accounts]) => ({
          message,
          count: accounts.length,
          accounts,
        })
      );
    });

    // Convert map to array and sort
    return Array.from(consolidatedMap.values()).sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.totalEquity - a.totalEquity;
    });
  }, [comparisonResult]);

  const handleContact = (phone: string, baseCurrency?: string) => {
    const whatsappUrl = getWhatsAppUrl(phone, baseCurrency);
    if (whatsappUrl) {
      window.open(whatsappUrl, "_blank");
    }
  };

  if (!comparisonResult || alerts.length === 0) {
    return null;
  }

  const highPriorityAlerts = alerts.filter((a) => a.priority === "high") as ConsolidatedAlertItem[];
  const mediumPriorityAlerts = alerts.filter((a) => a.priority === "medium") as ConsolidatedAlertItem[];

  return (
    <div className="space-y-4">
      {/* High Priority Alerts - Compact View */}
      {highPriorityAlerts.length > 0 && (
        <HighPriorityAlertsSection
          alerts={highPriorityAlerts}
          onContact={handleContact}
        />
      )}

      {/* Medium Priority Alerts - Compact View */}
      {mediumPriorityAlerts.length > 0 && (
        <MediumPriorityAlertsSection
          alerts={mediumPriorityAlerts}
          onContact={handleContact}
        />
      )}
    </div>
  );
}

// High Priority Alerts Section with Mini View
function HighPriorityAlertsSection({
  alerts,
  onContact,
}: {
  alerts: ConsolidatedAlertItem[];
  onContact: (phone: string, baseCurrency?: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAlertId, setExpandedAlertId] = useState<number | null>(null);

  const filteredAlerts = useMemo(() => {
    if (!searchQuery.trim()) return alerts;
    const query = searchQuery.toLowerCase();
    return alerts.filter(
      (alert) =>
        alert.name.toLowerCase().includes(query) ||
        alert.userId.toString().includes(query) ||
        alert.accounts.some((acc) => acc.accountNumber.toString().includes(query)) ||
        (alert.phone && alert.phone.includes(query))
    );
  }, [alerts, searchQuery]);

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-red-200 dark:border-red-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <h2 className="text-lg font-bold text-red-900 dark:text-red-100">
              High Priority Alerts ({alerts.length})
            </h2>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Expand All
              </>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, account, or phone..."
            className="w-full pl-10 pr-10 py-2 text-sm border border-red-200 dark:border-red-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mini Cards View - Horizontal Scroll */}
      {!isExpanded && (
        <div className="p-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-red-300 dark:scrollbar-thumb-red-700 scrollbar-track-transparent">
            {filteredAlerts.map((alert) => (
              <MiniAlertCard
                key={alert.userId}
                alert={alert}
                onContact={onContact}
                isExpanded={expandedAlertId === alert.userId}
                onToggleExpand={() =>
                  setExpandedAlertId(expandedAlertId === alert.userId ? null : alert.userId)
                }
              />
            ))}
          </div>
          {filteredAlerts.length === 0 && (
            <p className="text-center text-sm text-red-700 dark:text-red-300 py-4">
              No alerts match your search
            </p>
          )}
        </div>
      )}

      {/* Expanded View */}
      {isExpanded && (
        <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.userId}
              alert={alert}
              onContact={onContact}
            />
          ))}
          {filteredAlerts.length === 0 && (
            <p className="text-center text-sm text-red-700 dark:text-red-300 py-4">
              No alerts match your search
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Medium Priority Alerts Section
function MediumPriorityAlertsSection({
  alerts,
  onContact,
}: {
  alerts: ConsolidatedAlertItem[];
  onContact: (phone: string, baseCurrency?: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAlerts = useMemo(() => {
    if (!searchQuery.trim()) return alerts.slice(0, 5); // Show only 5 by default
    const query = searchQuery.toLowerCase();
    return alerts.filter(
      (alert) =>
        alert.name.toLowerCase().includes(query) ||
        alert.userId.toString().includes(query) ||
        alert.accounts.some((acc) => acc.accountNumber.toString().includes(query))
    );
  }, [alerts, searchQuery]);

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <TrendingDown className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <h2 className="text-lg font-bold text-yellow-900 dark:text-yellow-100">
              Medium Priority ({alerts.length})
            </h2>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                View All
              </>
            )}
          </button>
        </div>
        {isExpanded && (
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medium priority alerts..."
              className="w-full pl-10 pr-10 py-2 text-sm border border-yellow-200 dark:border-yellow-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
      {isExpanded && (
        <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
          {filteredAlerts.map((alert) => (
            <AlertCard key={alert.userId} alert={alert} onContact={onContact} />
          ))}
        </div>
      )}
    </div>
  );
}

// Mini Alert Card for Horizontal Scroll
function MiniAlertCard({
  alert,
  onContact,
  isExpanded,
  onToggleExpand,
}: {
  alert: ConsolidatedAlertItem;
  onContact: (phone: string, baseCurrency?: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  const formattedPhone = useMemo(() => {
    if (!alert.phone) return null;
    return formatPhoneNumber(alert.phone, alert.baseCurrency);
  }, [alert.phone, alert.baseCurrency]);

  const getTypeIcon = () => {
    switch (alert.type) {
      case "high_value_lost":
      case "abandonment":
        return <UserX className="h-4 w-4" />;
      case "withdrawal":
        return <DollarSign className="h-4 w-4" />;
      case "potential_risk":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getTypeColor = () => {
    switch (alert.type) {
      case "high_value_lost":
        return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
      case "abandonment":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400";
      case "withdrawal":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400";
      case "potential_risk":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="min-w-[320px] max-w-[320px] bg-white dark:bg-gray-800 rounded-lg border-2 border-red-200 dark:border-red-700 shadow-sm hover:shadow-md transition-all">
      {/* Compact Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className={`${getTypeColor()} rounded p-1.5 shrink-0`}>
              {getTypeIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                {alert.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ID: {alert.userId}
                {alert.accountCount === 1 && alert.accounts[0]?.accountNumber && (
                  <> • Acc: {alert.accounts[0].accountNumber}</>
                )}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-base font-bold text-gray-900 dark:text-white">
              ${alert.totalEquity.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
            {alert.totalEquityChange < 0 && (
              <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                {alert.totalEquityChange.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
            )}
          </div>
        </div>

        {/* Alert Message */}
        <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 mb-2">
          {alert.accountCount === 1 ? alert.accounts[0].message : `${alert.accountCount} accounts affected`}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="p-3 flex items-center gap-2">
        {alert.phone && formattedPhone ? (
          <button
            onClick={() => onContact(alert.phone!, alert.baseCurrency)}
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors text-xs font-medium"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </button>
        ) : (
          <div className="flex-1 text-xs text-gray-500 dark:text-gray-400 text-center py-2">
            No phone
          </div>
        )}
        <button
          onClick={onToggleExpand}
          className="px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
        >
          {isExpanded ? "Less" : "Details"}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 space-y-2">
          <div className="text-xs space-y-1">
            {alert.baseCurrency && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">{alert.baseCurrency}</span>
              </div>
            )}
            {alert.lastDepositAmount && alert.lastDepositTime && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-3 w-3 text-green-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  Last: ${alert.lastDepositAmount.toFixed(0)} {format(new Date(alert.lastDepositTime), "MMM dd")}
                </span>
              </div>
            )}
            {formattedPhone && (
              <div className="flex items-center gap-2">
                <MessageCircle className="h-3 w-3 text-green-500" />
                <span className="font-mono text-gray-900 dark:text-white">{formattedPhone.display}</span>
              </div>
            )}
          </div>
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded">
              {alert.action}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function AlertCard({
  alert,
  onContact,
}: {
  alert: ConsolidatedAlertItem;
  onContact: (phone: string, baseCurrency?: string) => void;
}) {
  const formattedPhone = useMemo(() => {
    if (!alert.phone) return null;
    return formatPhoneNumber(alert.phone, alert.baseCurrency);
  }, [alert.phone, alert.baseCurrency]);
  const getTypeIcon = () => {
    switch (alert.type) {
      case "high_value_lost":
      case "abandonment":
        return <UserX className="h-5 w-5" />;
      case "withdrawal":
        return <DollarSign className="h-5 w-5" />;
      case "potential_risk":
        return <TrendingDown className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getTypeColor = () => {
    switch (alert.type) {
      case "high_value_lost":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
      case "abandonment":
        return "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30";
      case "withdrawal":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30";
      case "potential_risk":
        return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800";
    }
  };

  const getLocationInfo = () => {
    if (alert.baseCurrency) {
      const currencyMap: Record<string, string> = {
        USD: "United States",
        GBP: "United Kingdom",
        EUR: "Europe",
        AUD: "Australia",
        CAD: "Canada",
        JPY: "Japan",
        CHF: "Switzerland",
        NZD: "New Zealand",
      };
      return currencyMap[alert.baseCurrency] || alert.baseCurrency;
    }
    return null;
  };

  const formatActivityDate = () => {
    if (alert.activityDate) {
      return format(new Date(alert.activityDate), "MMM dd, yyyy 'at' HH:mm");
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Header with Icon, Name, and Equity */}
          <div className="flex items-start gap-3 mb-3">
            <div className={`${getTypeColor()} rounded-lg p-2 shrink-0`}>
              {getTypeIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                {alert.name}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span>User ID: <span className="font-mono font-medium">{alert.userId}</span></span>
                {alert.accountCount === 1 && alert.accounts[0]?.accountNumber && (
                  <span>Account: <span className="font-mono font-medium">{alert.accounts[0].accountNumber}</span></span>
                )}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                ${alert.totalEquity.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              {alert.totalEquityChange < 0 && (
                <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                  {alert.totalEquityChange.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              )}
              {alert.accountCount > 1 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {alert.accountCount} accounts
                </p>
              )}
            </div>
          </div>

          {/* Alert Message */}
          {alert.accountCount === 1 ? (
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
              {alert.accounts[0].message}
            </p>
          ) : (
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Multiple accounts affected ({alert.accountCount} accounts)
              </p>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 space-y-2">
                {alert.messageGroups.map((group, idx) => (
                  <div key={idx} className="text-xs">
                    {group.count === 1 ? (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Account {group.accounts[0]}:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {group.message}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">
                            {group.count} accounts:
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {group.message}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 ml-2">
                          {group.accounts.map((accNum) => (
                            <span
                              key={accNum}
                              className="text-xs font-mono bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                            >
                              {accNum}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Context Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            {/* Account Numbers */}
            {alert.accountCount > 1 && (
              <div className="flex items-start gap-2 text-sm col-span-full">
                <UserX className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="text-gray-600 dark:text-gray-400 block mb-1">Accounts ({alert.accountCount}):</span>
                  <div className="flex flex-wrap gap-2">
                    {alert.accounts.map((acc, idx) => (
                      <span
                        key={idx}
                        className="font-mono text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                      >
                        {acc.accountNumber}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Location */}
            {getLocationInfo() && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">Location:</span>
                <span className="font-medium text-gray-900 dark:text-white">{getLocationInfo()}</span>
                {alert.baseCurrency && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">({alert.baseCurrency})</span>
                )}
              </div>
            )}

            {/* Activity Date */}
            {formatActivityDate() && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">Activity:</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatActivityDate()}</span>
              </div>
            )}

            {/* Registration Date */}
            {alert.registerDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">Registered:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {format(new Date(alert.registerDate), "MMM dd, yyyy")}
                </span>
              </div>
            )}

            {/* Last Deposit */}
            {alert.lastDepositAmount && alert.lastDepositTime && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-green-500 shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">Last Deposit:</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  ${alert.lastDepositAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} {alert.lastDepositCurrency || ""}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({format(new Date(alert.lastDepositTime), "MMM dd")})
                </span>
              </div>
            )}

            {/* Last Trade */}
            {alert.lastTradeSymbol && alert.lastTradeTime && (
              <div className="flex items-center gap-2 text-sm">
                <TrendingDown className="h-4 w-4 text-purple-500 shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">Last Trade:</span>
                <span className="font-mono font-medium text-purple-600 dark:text-purple-400">{alert.lastTradeSymbol}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({format(new Date(alert.lastTradeTime), "MMM dd")})
                </span>
              </div>
            )}

            {/* Owner/IB */}
            {alert.ownerName && (
              <div className="flex items-center gap-2 text-sm">
                <UserX className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">IB:</span>
                <span className="font-medium text-gray-900 dark:text-white">{alert.ownerName}</span>
              </div>
            )}

            {/* Phone Number */}
            {formattedPhone && (
              <div className="flex items-center gap-2 text-sm">
                <MessageCircle className="h-4 w-4 text-green-500 shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                <span className="font-mono font-medium text-gray-900 dark:text-white">{formattedPhone.display}</span>
                {formattedPhone.country && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">({formattedPhone.country})</span>
                )}
                {!formattedPhone.country && formattedPhone.whatsapp.length >= 10 && (
                  <span className="text-xs text-yellow-600 dark:text-yellow-400">(May need country code)</span>
                )}
              </div>
            )}
          </div>

          {/* Action Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-3 py-1.5 rounded-full border border-red-200 dark:border-red-800">
              {alert.action}
            </span>
          </div>
        </div>

        {/* Contact Action */}
        {alert.phone && formattedPhone && (
          <div className="shrink-0">
            <button
              onClick={() => onContact(alert.phone!, alert.baseCurrency)}
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors text-sm font-medium shadow-sm w-full"
              title="Contact via WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
              <span>WhatsApp</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

