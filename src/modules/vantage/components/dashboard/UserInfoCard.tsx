import { X, MessageCircle, User, DollarSign, Calendar, Phone, Mail, Globe, TrendingUp, TrendingDown } from "lucide-react";
import type { RetailClient, Account } from "../../types";
import { format } from "date-fns";
import { formatPhoneNumber, getWhatsAppUrl } from "../../utils/phoneFormatter";
import { useUserTabsSafe } from "../../hooks/useUserTabsSafe";

interface UserInfoCardProps {
  user: RetailClient;
  account?: Account;
  onClose?: () => void;
}

export default function UserInfoCard({ user, account, onClose }: UserInfoCardProps) {
  const userTabs = useUserTabsSafe();
  
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

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (userTabs) {
      const tabId = `user-${user.userId}`;
      userTabs.removeTab(tabId);
    }
  };

  // Get country from currency (simplified mapping)
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
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shrink-0">
            <User className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {user.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              ID: {user.userId}
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors shrink-0"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Contact Information */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Contact Information
          </h4>
          <div className="space-y-2 text-sm">
            {user.phone && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 dark:text-white font-medium">
                    {formatPhoneNumber(user.phone, user.baseCurrency)?.display || user.phone}
                  </span>
                  {whatsappUrl && (
                    <button
                      onClick={handleContact}
                      className="p-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
                      title="Contact via WhatsApp"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
            {user.email && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Email:
                </span>
                <span className="text-gray-900 dark:text-white font-medium">{user.email}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Globe className="h-3 w-3" />
                Country:
              </span>
              <span className="text-gray-900 dark:text-white font-medium">
                {getCountryFromCurrency(user.baseCurrency)}
              </span>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Financial Data
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">Equity</p>
              <p className="text-base font-bold text-gray-900 dark:text-white">
                {formatCurrency(user.equity)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">Balance</p>
              <p className="text-base font-bold text-gray-900 dark:text-white">
                {formatCurrency(user.accountBalance)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">Credit</p>
              <p className="text-base font-bold text-gray-900 dark:text-white">
                {formatCurrency(user.credit)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">Currency</p>
              <p className="text-base font-bold text-gray-900 dark:text-white">
                {user.baseCurrency}
              </p>
            </div>
          </div>
          {user.equity < user.accountBalance && (
            <div className="mt-2 flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
              <TrendingDown className="h-4 w-4" />
              <span>
                Loss: {formatCurrency(user.accountBalance - user.equity)}
              </span>
            </div>
          )}
        </div>

        {/* Rebates Data */}
        {account && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Rebates Data
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
                <p className="text-xs text-blue-600 dark:text-blue-400">Commission</p>
                <p className="text-base font-bold text-blue-900 dark:text-blue-100">
                  {formatCurrency(account.commission)}
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
                <p className="text-xs text-blue-600 dark:text-blue-400">Profit</p>
                <p className="text-base font-bold text-blue-900 dark:text-blue-100">
                  {formatCurrency(account.profit)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dates */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Important Dates
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Registration:</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {formatDate(user.registerDate)}
              </span>
            </div>
            {user.firstDepositDate && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">First Deposit:</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {formatDate(user.firstDepositDate)}
                </span>
              </div>
            )}
            {user.lastDepositTime && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Last Deposit:</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {formatDate(user.lastDepositTime)}
                </span>
                {user.lastDepositAmount && (
                  <span className="text-green-600 dark:text-green-400 font-semibold ml-2">
                    {formatCurrency(user.lastDepositAmount)} {user.lastDepositCurrency}
                  </span>
                )}
              </div>
            )}
            {user.lastTradeTime && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Last Trade:</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {formatDate(user.lastTradeTime)}
                </span>
                {user.lastTradeSymbol && (
                  <span className="text-purple-600 dark:text-purple-400 font-semibold ml-2">
                    {user.lastTradeSymbol} ({user.lastTradeVolume?.toFixed(2)})
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Account Status */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Account Status
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
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
  );
}

