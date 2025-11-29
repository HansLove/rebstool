/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "@/core/utils/http_request";

interface DepositRequest {
  amount: number;
  price_currency: string;
  pay_currency: string;
  order_description: string;
}

interface DepositApiResponse {
  success: boolean;
  message: string;
  data: {
    deposit: {
      id: number;
      orderId: string;
      amount: number;
      currency: string;
      cryptoCurrency: string;
      status: string;
      payAddress: string;
      payAmount: number;
      network: string;
      expiresAt: string;
      createdAt: string;
    };
    payment: {
      paymentId: string;
      status: string;
      payAddress: string;
      payAmount: number;
      payCurrency: string;
      network: string;
      expiresAt: string;
    };
  };
}

export async function createDepositService(depositData: DepositRequest): Promise<DepositApiResponse> {
  const res = await http.post("crypto-payments/deposits", depositData);
  return res.data;
}