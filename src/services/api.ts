/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "@/core/utils/http_request";

// Re-export affiliate services from modules for backward compatibility
export { createAffiliateService } from "@/modules/affiliates/services/affiliateService";
export { createSubAffiliateService, verifyMailCode } from "@/modules/subAffiliates/services/subAffiliateService";


export const saveVaultAddress = async ({
  contract_address,
  network = "localhost",
  currency = "USDT",
  payment_interval = "MANUAL", // puede ser 'DAILY' o 'WEEKLY'
  metadata = {},
}: {
  contract_address: string;
  network?: string;
  currency?: string;
  payment_interval?: "DAILY" | "WEEKLY" | "MANUAL";
  metadata?: any;
}) => {
  try {
    const res = await http.post("contracts/save", {
      contract_address,
      network,
      currency,
      payment_interval,
      metadata,
    });

    return res.data;
  } catch (err: any) {
    throw err.response?.data?.message || "Error saving Vault address";
  }
};




