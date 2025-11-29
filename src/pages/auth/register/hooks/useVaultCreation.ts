import { useState, useCallback } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { ContractVaultFactory } from '@/components/blockchain/ContractVaultFactory';

interface UseVaultCreationResult {
  isCreatingVault: boolean;
  vaultAddress: string | null;
  error: string | null;
  createVault: () => Promise<void>;
  resetError: () => void;
}

export function useVaultCreation(): UseVaultCreationResult {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  
  const [isCreatingVault, setIsCreatingVault] = useState(false);
  const [vaultAddress, setVaultAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createVault = useCallback(async () => {
    if (!isConnected || !address) {
      setError('Wallet not connected');
      return;
    }

    if (!walletClient) {
      setError('Wallet client not available');
      return;
    }

    setIsCreatingVault(true);
    setError(null);

    try {
      const factory = new ContractVaultFactory();
      await factory.load();
      
      const newVaultAddress = await factory.createVaultIfNotExists();
      
      if (newVaultAddress) {
        setVaultAddress(newVaultAddress);
      } else {
        setError('Failed to create vault');
      }
    } catch (err) {
      console.error('Error creating vault:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsCreatingVault(false);
    }
  }, [isConnected, address, walletClient]);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isCreatingVault,
    vaultAddress,
    error,
    createVault,
    resetError,
  };
}