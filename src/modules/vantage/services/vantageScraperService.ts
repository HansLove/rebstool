/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "@/core/utils/http_request";
import type {
  VantageApiResponse,
  VantageSnapshot,
  VantageCredentials,
} from "../types";

/**
 * Fetches Vantage scraper data from the backend API
 * @param credentials Optional username and password. If not provided, backend uses env variables
 * @returns Promise<VantageSnapshot> A snapshot with timestamp and metadata
 */
export async function fetchVantageData(
  credentials?: VantageCredentials
): Promise<VantageSnapshot> {
  try {
    const response = await http.post<VantageApiResponse>(
      "vantage-scraper/",
      credentials || {}
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Vantage scraping failed");
    }

    // Create snapshot with timestamp
    const snapshot: VantageSnapshot = {
      id: `snapshot_${Date.now()}`,
      timestamp: Date.now(),
      scrapedAt: new Date().toISOString(),
      accounts: response.data.data.accounts,
      retailResults: response.data.data.retailResults,
      metadata: {
        totalAccounts: response.data.data.accounts.length,
        totalRetailClients: response.data.data.retailResults.reduce(
          (sum, r) => sum + (r.retail?.data?.length || 0),
          0
        ),
      },
    };

    return snapshot;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch Vantage data";
    throw new Error(errorMessage);
  }
}

