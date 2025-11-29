/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';
import { createDepositService } from '@/services/depositService';

interface DepositFormData {
  selectedCurrency: string;
  amount: number;
  customerEmail?: string;
}

interface DepositModalResponse {
  payAddress: string;
  payAmount: number;
  payCurrency: string;
  paymentId: string;
  network: string;
  expiresAt: string;
  status: string;
}

export default function useDepositModal() {
  const handleDepositSubmit = useCallback(async (formData: DepositFormData): Promise<any> => {
    const requestData = {
      amount: formData.amount,
      price_currency: 'usd',
      pay_currency: formData.selectedCurrency.toUpperCase(),
      order_description: `Deposit of ${formData.amount} USD in ${formData.selectedCurrency.toUpperCase()}`,
      order_id: `deposit_${Date.now()}`,
      email: formData.customerEmail || undefined,
    };

    const response = await createDepositService(requestData);
    return response;
  }, []);

  const handleDepositSuccess = useCallback((backendResponse: any): DepositModalResponse => {
    return {
      payAddress: backendResponse.data.deposit.payAddress,
      payAmount: backendResponse.data.deposit.payAmount,
      payCurrency: backendResponse.data.deposit.cryptoCurrency,
      paymentId: backendResponse.data.payment.paymentId,
      network: backendResponse.data.deposit.network,
      expiresAt: backendResponse.data.deposit.expiresAt,
      status: backendResponse.data.deposit.status,
    };
  }, []);

  const handleDepositError = useCallback((error: any): string => {
    if (error?.response?.data?.error?.message) {
      return error.response.data.error.message;
    }

    if (error?.message) {
      return error.message;
    }

    return 'Error al crear el depósito. Por favor intenta nuevamente.';
  }, []);

  return {
    handleDepositSubmit,
    handleDepositSuccess,
    handleDepositError,
  };
}
