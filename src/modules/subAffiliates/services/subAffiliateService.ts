/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "@/core/utils/http_request";

/**
 * Service for creating a new sub-affiliate account
 * @param formData - The sub-affiliate registration data
 * @returns Promise with the API response data
 */
export async function createSubAffiliateService(formData: any) {
  try {
    const res = await http.post("subaffiliate", formData);
    return res.data;
  } catch (error: any) {
    // Propagamos el error al caller para que lo maneje donde corresponda
    throw error.response?.data?.message || "Error creating Subaffiliate";
  }
}

/**
 * Service for verifying email code during sub-affiliate registration
 * @param code - The verification code
 * @param email - The email address to verify
 * @returns Promise with the API response data
 */
export const verifyMailCode = async ({ code, email }: any) => {
  try {
    const res = await http.post("subaffiliate/valid-code", { code, email });
    return res.data;
  } catch (err: any) {
    throw err.response?.data?.message || "Error verifying code";
  }
};
