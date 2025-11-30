import { useState, useMemo } from "react";
import { Search, X, MessageCircle, User, DollarSign, TrendingDown } from "lucide-react";
import type { VantageSnapshot, RetailClient } from "../../types";
import { formatPhoneNumber, getWhatsAppUrl } from "../../utils/phoneFormatter";

interface CentralSearchProps {
  currentSnapshot: VantageSnapshot | null;
}

export default function CentralSearch({ currentSnapshot }: CentralSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<RetailClient | null>(null);

  // Extract all retail clients from snapshot
  const allClients = useMemo(() => {
    if (!currentSnapshot) return [];
    const clients: RetailClient[] = [];
    currentSnapshot.retailResults.forEach((result) => {
      if (result.retail?.data && Array.isArray(result.retail.data)) {
        clients.push(...result.retail.data);
      }
    });
    return clients;
  }, [currentSnapshot]);

  // Simple search - matches name, userId, or phone
  const searchResults = useMemo(() => {
    if (!searchTerm.trim() || !allClients.length) return [];
    
    const term = searchTerm.toLowerCase().trim();
    return allClients
      .filter((client) => {
        const nameMatch = client.name?.toLowerCase().includes(term);
        const userIdMatch = client.userId.toString().includes(term);
        const phoneMatch = client.phone?.replace(/\D/g, "").includes(term.replace(/\D/g, ""));
        return nameMatch || userIdMatch || phoneMatch;
      })
      .slice(0, 10); // Limit to 10 results
  }, [searchTerm, allClients]);

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleContact = (user: RetailClient) => {
    const whatsappUrl = user.phone ? getWhatsAppUrl(user.phone, user.baseCurrency) : null;
    if (whatsappUrl) {
      window.open(whatsappUrl, "_blank");
    }
  };

  const hasSearchResults = searchTerm.trim() && searchResults.length > 0;
  const showNoResults = searchTerm.trim() && searchResults.length === 0;

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, ID, or phone..."
          className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedUser(null);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {hasSearchResults && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {searchResults.map((user) => (
            <div
              key={user.userId}
              className={`p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all cursor-pointer ${
                selectedUser?.userId === user.userId ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-4 w-4 text-gray-400 shrink-0" />
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {user.name}
                    </p>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400 ml-6">
                    <p className="font-mono">ID: {user.userId}</p>
                    {user.phone && (
                      <p>{formatPhoneNumber(user.phone, user.baseCurrency)?.display || user.phone}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>Equity: {formatCurrency(user.equity)}</span>
                      </div>
                      {user.equity < user.accountBalance && (
                        <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                          <TrendingDown className="h-3 w-3" />
                          <span>Loss: {formatCurrency(user.accountBalance - user.equity)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {user.phone && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContact(user);
                    }}
                    className="ml-3 p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors shrink-0"
                    title="Contact via WhatsApp"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {showNoResults && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No users found matching "{searchTerm}"</p>
        </div>
      )}

      {/* Selected User Details */}
      {selectedUser && !hasSearchResults && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedUser.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                ID: {selectedUser.userId}
              </p>
            </div>
            {selectedUser.phone && (
              <button
                onClick={() => handleContact(selectedUser)}
                className="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
                title="Contact via WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Equity</p>
              <p className="font-bold text-gray-900 dark:text-white">
                {formatCurrency(selectedUser.equity)}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Balance</p>
              <p className="font-bold text-gray-900 dark:text-white">
                {formatCurrency(selectedUser.accountBalance)}
              </p>
            </div>
            {selectedUser.phone && (
              <div className="col-span-2">
                <p className="text-gray-600 dark:text-gray-400">Phone</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatPhoneNumber(selectedUser.phone, selectedUser.baseCurrency)?.display ||
                    selectedUser.phone}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

