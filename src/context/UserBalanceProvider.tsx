/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { getUserBalance, UserBalanceData, NetworkBalance } from '@/services/userActivityService';
import useAuth from '@/core/hooks/useAuth';
// import { useAuth } from '@/hooks/useAuth';

/**
 * Context type definition
 */
interface UserBalanceContextType {
  totalBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  networks: Record<string, NetworkBalance>;
  isLoadingBalance: boolean;
  balanceError: string | null;
  refreshBalance: () => Promise<void>;
}

/**
 * Context creation with undefined default
 */
export const UserBalanceContext = createContext<UserBalanceContextType | undefined>(undefined);

/**
 * Provider props interface
 */
interface UserBalanceProviderProps {
  children: ReactNode;
}

/**
 * User Balance Provider Component
 *
 * Fetches and manages user balance data from the API.
 * Call refreshBalance() to load/update balance data.
 * This provider is globally available and doesn't require accountId.
 */
export const UserBalanceProvider: React.FC<UserBalanceProviderProps> = ({ children }) => {
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [totalDeposits, setTotalDeposits] = useState<number>(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState<number>(0);
  const [networks, setNetworks] = useState<Record<string, NetworkBalance>>({});
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();

  /**
   * Fetches user balance data from API
   */
  const fetchBalance = useCallback(async () => {
    try {
      setIsLoadingBalance(true);
      setBalanceError(null);

      const response = await getUserBalance();

      if (response.success && response.data) {
        const data: UserBalanceData = response.data;

        setTotalBalance(data.total_balance);
        setTotalDeposits(data.total_deposits);
        setTotalWithdrawals(data.total_withdrawals);
        setNetworks(data.networks || {});
      } else {
        setBalanceError('No balance data found');
        setTotalBalance(0);
        setTotalDeposits(0);
        setTotalWithdrawals(0);
        setNetworks({});
      }
    } catch (error: any) {
      console.error('Error fetching user balance:', error);
      setBalanceError(error?.response?.data?.message || 'Failed to fetch balance');
      setTotalBalance(0);
      setTotalDeposits(0);
      setTotalWithdrawals(0);
      setNetworks({});
    } finally {
      setIsLoadingBalance(false);
    }
  }, []);

  /**
   * Public refresh function for manual updates
   */
  const refreshBalance = useCallback(async () => {
    await fetchBalance();
  }, [fetchBalance]);

  useEffect(() => {
    if (isLoggedIn()) {
      fetchBalance();
    }
  }, [fetchBalance]);

  return (
    <UserBalanceContext.Provider
      value={{
        totalBalance,
        totalDeposits,
        totalWithdrawals,
        networks,
        isLoadingBalance,
        balanceError,
        refreshBalance,
      }}
    >
      {children}
    </UserBalanceContext.Provider>
  );
};
