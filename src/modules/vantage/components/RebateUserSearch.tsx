/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { Search, X, CheckCircle2, User, DollarSign, BarChart3, MessageCircle } from "lucide-react";
import type { VantageSnapshot, RetailClient } from "../types";
import { format } from "date-fns";
import { formatPhoneNumber, getWhatsAppUrl } from "../utils/phoneFormatter";

interface RebateUserSearchProps {
  currentSnapshot: VantageSnapshot | null;
}

export default function RebateUserSearch({ currentSnapshot }: RebateUserSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);

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

  // Normalize text: remove extra spaces, trim, lowercase
  const normalizeText = (text: string | null | undefined): string => {
    if (!text) return "";
    return text.toLowerCase().trim().replace(/\s+/g, " ");
  };

  // Normalize phone number for comparison
  const normalizePhone = (phone: string | null | undefined): string => {
    if (!phone) return "";
    return phone.replace(/\D/g, "");
  };

  // Check if search term looks like a full name (has multiple words)
  const isFullNameSearch = (term: string): boolean => {
    const words = term.trim().split(/\s+/).filter(w => w.length > 0);
    return words.length >= 2;
  };

  // Check if two normalized names match exactly (ignoring case and spacing)
  const namesMatchExactly = (name1: string, name2: string): boolean => {
    const normalized1 = normalizeText(name1);
    const normalized2 = normalizeText(name2);
    return normalized1 === normalized2;
  };

  // Check if all words in search term are present in the name (in any order)
  const allWordsMatch = (searchWords: string[], name: string): boolean => {
    const normalizedName = normalizeText(name);
    const nameWords = normalizedName.split(/\s+/);
    return searchWords.every(word => 
      nameWords.some(nameWord => nameWord === word || nameWord.startsWith(word))
    );
  };

  // Check if search term is primarily numeric (for ID/phone searches)
  const isNumericSearch = (term: string): boolean => {
    const numericOnly = term.replace(/\D/g, "");
    // If more than 50% of characters are digits, treat as numeric search
    return numericOnly.length >= 2 && numericOnly.length / term.length >= 0.5;
  };

  // Calculate match score for a client with intelligent prioritization
  const calculateMatchScore = (client: RetailClient, searchTerm: string): number => {
    const normalizedSearch = normalizeText(searchTerm);
    const searchWords = normalizedSearch.split(/\s+/).filter(w => w.length > 0);
    const isFullName = isFullNameSearch(searchTerm);
    const normalizedTerm = searchTerm.replace(/\D/g, "");
    const isNumeric = isNumericSearch(searchTerm);
    let score = 0;
    let isPerfectMatch = false;

    // Normalize client name
    const normalizedClientName = normalizeText(client.name);

    // PERFECT MATCHES - Highest priority (score > 10000)
    if (normalizedClientName && namesMatchExactly(client.name || "", searchTerm)) {
      score += 50000; // Perfect exact match
      isPerfectMatch = true;
    }
    // All words match exactly (for full names)
    else if (isFullName && normalizedClientName && allWordsMatch(searchWords, client.name || "")) {
      // Check if words are in same order
      const clientWords = normalizedClientName.split(/\s+/);
      const wordsInOrder = searchWords.every((word, idx) => 
        idx < clientWords.length && clientWords[idx] === word
      );
      if (wordsInOrder) {
        score += 30000; // All words match in order
        isPerfectMatch = true;
      } else {
        score += 20000; // All words match but different order
        isPerfectMatch = true;
      }
    }

    // EXCELLENT MATCHES - Very high priority (score 5000-9999)
    if (!isPerfectMatch) {
      // Name starts with search term (normalized)
      if (normalizedClientName && normalizedClientName.startsWith(normalizedSearch)) {
        score += isFullName ? 8000 : 5000;
      }
      // First word matches exactly and other words are present
      else if (isFullName && normalizedClientName) {
        const firstWord = searchWords[0];
        const clientWords = normalizedClientName.split(/\s+/);
        if (clientWords[0] === firstWord && allWordsMatch(searchWords.slice(1), client.name || "")) {
          score += 7000;
        }
      }
    }

    // VERY GOOD MATCHES - High priority (score 2000-4999)
    if (!isPerfectMatch && score < 5000) {
      // Name contains search term exactly
      if (normalizedClientName && normalizedClientName.includes(normalizedSearch)) {
        score += isFullName ? 4000 : 2000;
      }
      // At least 2 words match (for full name searches)
      else if (isFullName && normalizedClientName) {
        const matchingWords = searchWords.filter(word => 
          normalizedClientName.split(/\s+/).some(nameWord => 
            nameWord === word || nameWord.startsWith(word)
          )
        );
        if (matchingWords.length >= 2) {
          score += 3000;
        }
      }
    }

    // GOOD MATCHES - Medium priority (score 500-1999)
    if (!isPerfectMatch && score < 2000) {
      // Single word matches first name
      if (!isFullName && normalizedClientName) {
        const clientWords = normalizedClientName.split(/\s+/);
        if (clientWords[0] === normalizedSearch) {
          score += 1500;
        } else if (clientWords.some(word => word.startsWith(normalizedSearch))) {
          score += 1000;
        } else if (normalizedClientName.includes(normalizedSearch)) {
          score += 500;
        }
      }
      // Partial word matches
      else if (normalizedClientName) {
        const matchingWords = searchWords.filter(word => 
          normalizedClientName.split(/\s+/).some(nameWord => 
            nameWord.includes(word)
          )
        );
        if (matchingWords.length > 0) {
          score += 800 * matchingWords.length;
        }
      }
    }

    // NUMERIC SEARCHES - Prioritize ID and Phone matches when searching with numbers
    if (isNumeric && normalizedTerm.length >= 2) {
      // USER ID MATCHES - Highest priority for numeric searches
      if (client.userId) {
        const userIdStr = client.userId.toString();
        if (userIdStr === normalizedTerm) {
          score += 10000; // Exact userId match - highest priority
          isPerfectMatch = true;
        } else if (userIdStr.startsWith(normalizedTerm)) {
          score += 7000; // userId starts with search term
        } else if (userIdStr.includes(normalizedTerm)) {
          score += 5000; // userId contains search term
        }
      }

      // ACCOUNT NUMBER MATCHES - High priority for numeric searches
      if (client.accountNmber) {
        const accountStr = client.accountNmber.toString();
        if (accountStr === normalizedTerm) {
          score += 10000; // Exact account number match - highest priority
          isPerfectMatch = true;
        } else if (accountStr.startsWith(normalizedTerm)) {
          score += 7000; // Account starts with search term
        } else if (accountStr.includes(normalizedTerm)) {
          score += 5000; // Account contains search term
        }
      }

      // PHONE MATCHES - High priority for numeric searches
      if (client.phone) {
        const normalizedPhone = normalizePhone(client.phone);
        if (normalizedPhone === normalizedTerm) {
          score += 9000; // Exact phone match
          isPerfectMatch = true;
        } else if (normalizedPhone.startsWith(normalizedTerm) && normalizedTerm.length >= 3) {
          score += 6000; // Phone starts with (minimum 3 digits)
        } else if (normalizedPhone.includes(normalizedTerm) && normalizedTerm.length >= 3) {
          score += 4000; // Phone contains (minimum 3 digits)
        }
      }

      // If we found a perfect numeric match, don't add name scores
      if (isPerfectMatch) {
        return score;
      }
    }

    // PHONE MATCHES - For non-numeric searches or when no numeric match found
    if (!isNumeric && (!isFullName || score < 1000)) {
      const normalizedPhone = normalizePhone(client.phone);
      if (normalizedPhone === normalizedTerm && normalizedTerm.length >= 3) {
        score += 6000; // Exact phone match
      } else if (normalizedPhone.startsWith(normalizedTerm) && normalizedTerm.length >= 4) {
        score += 3000; // Phone starts with (minimum 4 digits)
      } else if (normalizedPhone.includes(normalizedTerm) && normalizedTerm.length >= 4) {
        score += 1500; // Phone contains (minimum 4 digits)
      }
    }

    // ID MATCHES - For exact numeric strings (fallback)
    if (/^\d+$/.test(searchTerm.trim()) && !isNumeric) {
      if (client.userId?.toString() === normalizedTerm) {
        score += 5000; // Exact userId match
      } else if (client.accountNmber?.toString() === normalizedTerm) {
        score += 5000; // Exact account number match
      } else if (client.userId?.toString().includes(normalizedTerm) && normalizedTerm.length >= 4) {
        score += 2000;
      } else if (client.accountNmber?.toString().includes(normalizedTerm) && normalizedTerm.length >= 4) {
        score += 2000;
      }
    }

    // EMAIL MATCHES - Only if not a name search
    if (!isFullName && client.email) {
      const normalizedEmail = normalizeText(client.email);
      if (normalizedEmail === normalizedSearch) {
        score += 4000; // Exact email match
      } else if (normalizedEmail.includes(normalizedSearch)) {
        score += 1500; // Email contains
      }
    }

    return score;
  };

  // Get match type for display
  const getMatchType = (client: RetailClient, searchTerm: string): string => {
    const normalizedSearch = normalizeText(searchTerm);
    const searchWords = normalizedSearch.split(/\s+/).filter(w => w.length > 0);
    const isFullName = isFullNameSearch(searchTerm);
    const normalizedTerm = searchTerm.replace(/\D/g, "");
    const isNumeric = isNumericSearch(searchTerm);
    const normalizedClientName = normalizeText(client.name);
    const normalizedPhone = normalizePhone(client.phone);

    // Prioritize numeric matches when searching with numbers
    if (isNumeric && normalizedTerm.length >= 2) {
      // User ID matches
      if (client.userId) {
        const userIdStr = client.userId.toString();
        if (userIdStr === normalizedTerm) {
          return "Exact User ID";
        }
        if (userIdStr.startsWith(normalizedTerm)) {
          return "User ID Starts With";
        }
        if (userIdStr.includes(normalizedTerm)) {
          return "User ID Contains";
        }
      }

      // Account Number matches
      if (client.accountNmber) {
        const accountStr = client.accountNmber.toString();
        if (accountStr === normalizedTerm) {
          return "Exact Account Number";
        }
        if (accountStr.startsWith(normalizedTerm)) {
          return "Account Starts With";
        }
        if (accountStr.includes(normalizedTerm)) {
          return "Account Contains";
        }
      }

      // Phone matches
      if (normalizedPhone === normalizedTerm) {
        return "Exact Phone";
      }
      if (normalizedPhone.startsWith(normalizedTerm) && normalizedTerm.length >= 3) {
        return "Phone Starts With";
      }
      if (normalizedPhone.includes(normalizedTerm) && normalizedTerm.length >= 3) {
        return "Phone Contains";
      }
    }

    // Perfect matches
    if (normalizedClientName && namesMatchExactly(client.name || "", searchTerm)) {
      return "Perfect Match";
    }
    if (isFullName && normalizedClientName && allWordsMatch(searchWords, client.name || "")) {
      return "Exact Name Match";
    }

    // Name matches
    if (normalizedClientName && normalizedClientName.startsWith(normalizedSearch)) {
      return "Name Starts With";
    }
    if (normalizedClientName && normalizedClientName.includes(normalizedSearch)) {
      return "Name Contains";
    }

    // Phone matches (for non-numeric searches)
    if (!isNumeric) {
      if (normalizedPhone === normalizedTerm && normalizedTerm.length >= 3) {
        return "Exact Phone";
      }
      if (normalizedPhone.startsWith(normalizedTerm) && normalizedTerm.length >= 4) {
        return "Phone Starts With";
      }
      if (normalizedPhone.includes(normalizedTerm) && normalizedTerm.length >= 4) {
        return "Phone Contains";
      }
    }

    // ID matches (fallback)
    if (/^\d+$/.test(searchTerm.trim())) {
      if (client.userId?.toString() === normalizedTerm) {
        return "User ID";
      }
      if (client.accountNmber?.toString() === normalizedTerm) {
        return "Account Number";
      }
    }

    // Email matches
    if (client.email && normalizeText(client.email) === normalizedSearch) {
      return "Exact Email";
    }
    if (client.email && normalizeText(client.email).includes(normalizedSearch)) {
      return "Email Contains";
    }

    return "Partial Match";
  };

  // Filter and rank clients by search term with intelligent filtering
  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.trim();
    if (term.length < 2) return []; // Require at least 2 characters

    // Calculate scores for all clients
    const clientsWithScores = allClients
      .map((client) => ({
        client,
        score: calculateMatchScore(client, term),
        matchType: getMatchType(client, term),
      }))
      .filter((item) => item.score > 0) // Only include clients with matches
      .sort((a, b) => b.score - a.score); // Sort by score descending

    // Intelligent filtering: if we have perfect matches, filter out low-scoring results
    if (clientsWithScores.length > 0) {
      const highestScore = clientsWithScores[0].score;
      const isFullName = isFullNameSearch(term);

      // If we have perfect matches (score > 10000), only show perfect and excellent matches
      if (highestScore >= 10000) {
        return clientsWithScores.filter(item => item.score >= 10000);
      }
      
      // If we have excellent matches (score >= 5000), filter out low scores
      if (highestScore >= 5000) {
        return clientsWithScores.filter(item => item.score >= 2000);
      }

      // For full name searches, be more strict
      if (isFullName && highestScore >= 2000) {
        return clientsWithScores.filter(item => item.score >= 1000);
      }

      // For other searches, limit to top 20 results
      return clientsWithScores.slice(0, 20);
    }

    return clientsWithScores;
  }, [allClients, searchTerm]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setShowResults(value.trim().length > 0);
  };

  const handleClear = () => {
    setSearchTerm("");
    setShowResults(false);
  };

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "N/A";
    return format(new Date(timestamp), "PP");
  };

  return (
    <div className="relative">
      {/* Search Bar */}
      <div className="bg-gradient-to-r from-blue-700 to-slate-700 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-4">Search Rebate User</h1>
        <p className="text-blue-100 mb-4">
          Verify if a user belongs to your rebate community
        </p>
        
        <div className="relative">
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <Search className="absolute left-4 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by name, phone, user ID, account number or email..."
              className="w-full pl-12 pr-12 py-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-lg"
            />
            {searchTerm && (
              <button
                onClick={handleClear}
                className="absolute right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        {showResults && (
          <div className="mt-3 text-blue-100 text-sm">
            {filteredClients.length > 0 ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {filteredClients.length} user{filteredClients.length !== 1 ? 's' : ''} found
                  {filteredClients.length > 1 && " (sorted by relevance)"}
              </span>
              </div>
            ) : searchTerm.trim().length >= 2 ? (
              <span>No users found</span>
            ) : (
              <span className="text-blue-200">Type at least 2 characters to search</span>
            )}
          </div>
        )}
      </div>

      {/* Results Panel */}
      {showResults && filteredClients.length > 0 && (
        <div className="mt-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg max-h-96 overflow-y-auto">
          <div className="p-4 space-y-3">
            {filteredClients.map(({ client, matchType }) => (
              <UserResultCard 
                key={client.userId} 
                client={client} 
                formatDate={formatDate}
                matchType={matchType}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Results Message */}
      {showResults && filteredClients.length === 0 && searchTerm.trim().length >= 2 && (
        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 text-center">
          <p className="text-yellow-800 dark:text-yellow-200 font-medium">
            No users found with "{searchTerm}"
          </p>
          <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-1">
            Try searching by name, phone, user ID, account number or email
          </p>
        </div>
      )}
    </div>
  );
}

// User Result Card Component
function UserResultCard({
  client,
  formatDate,
  matchType,
}: {
  client: RetailClient;
  formatDate: (timestamp: number | null) => string;
  matchType?: string;
}) {
  const formattedPhone = useMemo(() => {
    if (!client.phone) return null;
    return formatPhoneNumber(client.phone, client.baseCurrency);
  }, [client.phone, client.baseCurrency]);

  const handleContact = (phone: string, baseCurrency?: string) => {
    const whatsappUrl = getWhatsAppUrl(phone, baseCurrency);
    if (whatsappUrl) {
      window.open(whatsappUrl, "_blank");
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return "$0.00";
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2 shrink-0">
            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg truncate">
              {client.name || "N/A"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ID: {client.userId} | Account: {client.accountNmber}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
        <div className="bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
          <span className="text-green-700 dark:text-green-400 text-xs font-medium flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
              In Community
            </span>
          </div>
          {matchType && (
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded">
              {matchType}
          </span>
          )}
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white dark:bg-gray-900 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Equity</span>
          </div>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">
            {formatCurrency(client.equity)}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Balance</span>
          </div>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(client.accountBalance)}
          </p>
        </div>
      </div>

      {/* Trading Activity */}
      {client.lastTradeVolume && client.lastTradeVolume > 0 && (
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Last Trade</span>
            </div>
            <div className="text-right">
              {client.lastTradeSymbol && (
                <span className="text-xs font-mono text-purple-600 dark:text-purple-400 mr-2">
                  {client.lastTradeSymbol}
                </span>
              )}
              <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                {client.lastTradeVolume.toFixed(2)} lots
              </span>
            </div>
          </div>
          {client.lastTradeTime && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formatDate(client.lastTradeTime)}
            </p>
          )}
        </div>
      )}

      {/* Deposit Info */}
      {client.lastDepositAmount && client.lastDepositAmount > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Last Deposit</span>
            </div>
            <span className="text-sm font-bold text-green-700 dark:text-green-300">
              {formatCurrency(client.lastDepositAmount)} {client.lastDepositCurrency || ""}
          </span>
          </div>
          {client.lastDepositTime && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formatDate(client.lastDepositTime)}
            </p>
          )}
        </div>
      )}

      {/* Contact Actions */}
      {client.phone && formattedPhone && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">Phone:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-medium text-gray-900 dark:text-white text-sm">
                {formattedPhone.display}
              </span>
              {formattedPhone.country && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({formattedPhone.country})
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => handleContact(client.phone!, client.baseCurrency)}
            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <MessageCircle className="h-4 w-4" />
            Contact via WhatsApp
          </button>
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-gray-600 dark:text-gray-400">Registered:</span>
          <span className="ml-1 text-gray-900 dark:text-white">
            {formatDate(client.registerDate)}
          </span>
        </div>
        {client.firstDepositDate && (
          <div>
            <span className="text-gray-600 dark:text-gray-400">First Deposit:</span>
            <span className="ml-1 text-gray-900 dark:text-white">
              {formatDate(client.firstDepositDate)}
            </span>
          </div>
        )}
        {client.phone && formattedPhone && (
          <div className="col-span-2">
            <span className="text-gray-600 dark:text-gray-400">Phone:</span>
            <span className="ml-1 text-gray-900 dark:text-white font-mono">
              {formattedPhone.display}
            </span>
            {formattedPhone.country && (
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                ({formattedPhone.country})
              </span>
            )}
          </div>
        )}
        {client.email && (
          <div className="col-span-2">
            <span className="text-gray-600 dark:text-gray-400">Email:</span>
            <span className="ml-1 text-gray-900 dark:text-white">{client.email}</span>
          </div>
        )}
      </div>
    </div>
  );
}

