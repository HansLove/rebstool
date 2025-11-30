import { X, MessageCircle, User, DollarSign, Calendar, Phone, Mail, Globe, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { useEffect } from "react";
import type { RetailClient, Account } from "../../types";
import { format } from "date-fns";
import { formatPhoneNumber, getWhatsAppUrl } from "../../utils/phoneFormatter";

interface UserInfoModalProps {
  user: RetailClient;
  account?: Account;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserInfoModal({ user, account, isOpen, onClose }: UserInfoModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "N/A";
    return format(new Date(timestamp), "PPpp");
  };

  const whatsappUrl = user.phone ? getWhatsAppUrl(user.phone, user.baseCurrency) : null;

  const handleContact = () => {
    if (whatsappUrl) {
      window.open(whatsappUrl, "_blank");
    }
  };

  const getCountryFromCurrency = (currency: string) => {
    const currencyMap: Record<string, string> = {
      USD: "United States",
      MXN: "Mexico",
      EUR: "Europe",
      GBP: "United Kingdom",
      CAD: "Canada",
      AUD: "Australia",
      BRL: "Brazil",
      ARS: "Argentina",
      CLP: "Chile",
      COP: "Colombia",
    };
    return currencyMap[currency] || currency;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Modal */}
      <div
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Prominent */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 px-6 py-5 border-b border-blue-800 dark:border-blue-700">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white shrink-0 ring-2 ring-white/30">
                <User className="h-7 w-7" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-white truncate mb-1">
                  {user.name}
                </h2>
                <div className="flex items-center gap-3 text-sm text-blue-100">
                  <span className="font-mono">ID: {user.userId}</span>
                  {user.equity < user.accountBalance && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500/30 rounded-full">
                      <AlertCircle className="h-3 w-3" />
                      At Risk
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/20 text-white transition-colors shrink-0"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Contact Information - Priority */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  {user.phone && (
                    <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Phone:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatPhoneNumber(user.phone, user.baseCurrency)?.display || user.phone}
                        </span>
                        {whatsappUrl && (
                          <button
                            onClick={handleContact}
                            className="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors shadow-md hover:shadow-lg"
                            title="Contact via WhatsApp"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  {user.email && (
                    <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        Email:
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{user.email}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      Country:
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {getCountryFromCurrency(user.baseCurrency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Important Dates */}
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  Important Dates
                </h3>
                <div className="space-y-2 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Registration:</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {formatDate(user.registerDate)}
                    </span>
                  </div>
                  {user.firstDepositDate && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">First Deposit:</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formatDate(user.firstDepositDate)}
                      </span>
                    </div>
                  )}
                  {user.lastDepositTime && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Last Deposit:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 dark:text-white font-medium">
                          {formatDate(user.lastDepositTime)}
                        </span>
                        {user.lastDepositAmount && (
                          <span className="text-green-600 dark:text-green-400 font-semibold text-xs">
                            {formatCurrency(user.lastDepositAmount)} {user.lastDepositCurrency}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {user.lastTradeTime && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Last Trade:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 dark:text-white font-medium">
                          {formatDate(user.lastTradeTime)}
                        </span>
                        {user.lastTradeSymbol && (
                          <span className="text-purple-600 dark:text-purple-400 font-semibold text-xs">
                            {user.lastTradeSymbol} ({user.lastTradeVolume?.toFixed(2)})
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Financial Information - Secondary */}
              <div className="opacity-70">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  Financial Data
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Equity</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(user.equity)}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Balance</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(user.accountBalance)}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Credit</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(user.credit)}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Currency</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {user.baseCurrency}
                    </p>
                  </div>
                </div>
                {user.equity < user.accountBalance && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2">
                    <TrendingDown className="h-4 w-4" />
                    <span>
                      Loss: {formatCurrency(user.accountBalance - user.equity)}
                    </span>
                  </div>
                )}
              </div>

              {/* Rebates Data - Secondary */}
              {account && (
                <div className="opacity-70">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    Rebates Data
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                      <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Commission</p>
                      <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                        {formatCurrency(account.commission)}
                      </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                      <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Profit</p>
                      <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                        {formatCurrency(account.profit)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Status */}
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">
                  Account Status
                </h3>
                <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Account Number:</span>
                    <span className="text-gray-900 dark:text-white font-mono">{user.accountNmber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Platform:</span>
                    <span className="text-gray-900 dark:text-white">{user.platform}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Account Type:</span>
                    <span className="text-gray-900 dark:text-white">{user.accountType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Journey:</span>
                    <span className="text-gray-900 dark:text-white">{user.accountJourney}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Funding Status:</span>
                    <span className={`font-semibold ${
                      user.fundingStatus === 1 ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"
                    }`}>
                      {user.fundingStatus === 1 ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Archive Status:</span>
                    <span className={`font-semibold ${
                      user.archiveStatus === 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}>
                      {user.archiveStatus === 0 ? "Active" : "Archived"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

