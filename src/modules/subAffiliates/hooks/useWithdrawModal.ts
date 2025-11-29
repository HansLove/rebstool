/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';
import { createWithdrawalService } from '@/services/withdrawalService';

interface WithdrawFormData {
  currency: string;
  amount: number;
  destinationAddress: string;
}

interface WithdrawalDetails {
  transactionId: string;
}

export default function useWithdrawModal() {
  const handleWithdrawSubmit = useCallback(async (formData: WithdrawFormData): Promise<any> => {
    const requestData = {
      currency: formData.currency,
      amount: formData.amount,
      network: formData.currency.toLowerCase() === 'usdttrc20' ? 'tron' : 'polygon',
      user_destination_address: formData.destinationAddress,
    };

    const response = await createWithdrawalService(requestData);
    return response;
  }, []);

  const handleWithdrawSuccess = useCallback((backendResponse: any): WithdrawalDetails => {
    return {
      transactionId: backendResponse.data.withdrawal.nowpaymentsId,
    };
  }, []);

  const handleWithdrawError = useCallback((error: any): string => {
    if (error?.response?.data?.error?.message) {
      return error.response.data.error.message;
    }

    if (error?.message) {
      return error.message;
    }

    return 'Error al procesar el retiro. Por favor intenta nuevamente.';
  }, []);

  return {
    handleWithdrawSubmit,
    handleWithdrawSuccess,
    handleWithdrawError,
  };
}
