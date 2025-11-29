import { http } from '@/core/utils/http_request';

interface WithdrawalRequest {
  currency: string;
  amount: number;
  network: string;
  user_destination_address: string;
}

interface NowPaymentsPayout {
  payoutId: string;
  withdrawals: Array<{
    id: string;
    status: string;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

interface WithdrawalApiResponse {
  success: boolean;
  message: string;
  data: {
    withdrawal: {
      id: number;
      amount: number;
      currency: string;
      network: string;
      address: string;
      user_destination_address: string;
      intermediate_address: string;
      status: string;
      dispersion_status: string;
      payoutId: string;
      withdrawalId: string;
      requestedAt: string;
      createdAt: string;
    };
    payout: NowPaymentsPayout;
  };
}

export async function createWithdrawalService(withdrawalData: WithdrawalRequest): Promise<WithdrawalApiResponse> {
  const res = await http.post('crypto-payments/withdrawals', withdrawalData);
  return res.data;
}
