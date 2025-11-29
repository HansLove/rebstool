/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "@/core/utils/http_request";

/**
 * Service for creating a new affiliate account
 * @param formData - The affiliate registration data
 * @returns Promise with the API response data
 */
export const createAffiliateService = async (formData: any) => {
  try {
    const res = await http.post("accounts/create", formData);
    return res.data;
  } catch (err: any) {
    throw err.response?.data?.message || "Error creating Affilliate";
  }
};
