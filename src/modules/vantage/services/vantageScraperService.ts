/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "@/core/utils/http_request";
import type {
  VantageApiResponse,
  VantageSnapshot,
  VantageCredentials,
  SnapshotsListResponse,
  SnapshotByIdResponse,
  PaginationInfo,
} from "../types";
import { transformApiSnapshotToSnapshot } from "../utils/vantageTransformer";

/**
 * Fetches Vantage scraper data from the backend API
 * 
 * Endpoint: POST /api/vantage-scraper
 * 
 * @param credentials Optional username and password. If not provided, backend uses env variables
 * @returns Promise<VantageSnapshot> A snapshot with timestamp and metadata
 * 
 * @throws Error if the API request fails or returns an error response
 * 
 * Note: The scraping process can take 30-60 seconds. Ensure HTTP client timeout is set appropriately (recommended: 120 seconds).
 */
export async function fetchVantageData(
  credentials?: VantageCredentials
): Promise<VantageSnapshot> {
  try {
    // Prepare request body - only include credentials if provided
    const requestBody: VantageCredentials = {};
    if (credentials?.username) {
      requestBody.username = credentials.username;
    }
    if (credentials?.password) {
      requestBody.password = credentials.password;
    }

    const response = await http.post<VantageApiResponse>(
      "vantage-scraper",
      Object.keys(requestBody).length > 0 ? requestBody : {}
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Vantage scraping failed");
    }

    // Use snapshotId from API response, or generate one if not provided
    const snapshotId = response.data.snapshotId || `snapshot_${Date.now()}`;
    const timestamp = Date.now();

    // Create snapshot with data from API response
    const snapshot: VantageSnapshot = {
      id: snapshotId,
      timestamp,
      scrapedAt: new Date().toISOString(),
      accounts: response.data.data.accounts || [],
      retailResults: response.data.data.retailResults || [],
      metadata: {
        totalAccounts: response.data.data.accounts?.length || 0,
        totalRetailClients: response.data.data.retailResults?.reduce(
          (sum, r) => sum + (r.retail?.data?.length || 0),
          0
        ) || 0,
      },
    };

    return snapshot;
  } catch (error: any) {
    // Handle different error scenarios
    if (error.response) {
      // API returned an error response
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `API Error: ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      // Request was made but no response received (network/timeout)
      throw new Error(
        "Network error: Unable to reach the server. Please check your connection and try again."
      );
    } else {
      // Something else happened
      throw new Error(error.message || "Failed to fetch Vantage data");
    }
  }
}

/**
 * Fetches all snapshots with pagination support
 * 
 * Endpoint: GET /api/vantage-scraper
 * 
 * @param page Page number (default: 1)
 * @param limit Number of items per page (default: 10)
 * @returns Promise with snapshots list and pagination info
 * 
 * @throws Error if the API request fails
 */
export async function fetchSnapshots(
  page: number = 1,
  limit: number = 10
): Promise<{
  snapshots: VantageSnapshot[];
  pagination: PaginationInfo;
}> {
  try {
    const response = await http.get<SnapshotsListResponse>(
      "vantage-scraper",
      {
        params: { page, limit },
      }
    );

    if (!response.data.success) {
      throw new Error("Failed to fetch snapshots");
    }

    // Transform API snapshots to internal format
    const snapshots = response.data.data.snapshots.map(
      transformApiSnapshotToSnapshot
    );

    return {
      snapshots,
      pagination: response.data.data.pagination,
    };
  } catch (error: any) {
    if (error.response) {
      const errorMessage =
        error.response.data?.message ||
        `API Error: ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error(
        "Network error: Unable to reach the server. Please check your connection and try again."
      );
    } else {
      throw new Error(error.message || "Failed to fetch snapshots");
    }
  }
}

/**
 * Fetches a specific snapshot by ID
 * 
 * Endpoint: GET /api/vantage-scraper/:snapshotId
 * 
 * @param snapshotId The snapshot ID (e.g., "snapshot_1234567890")
 * @returns Promise<VantageSnapshot> The snapshot with all related data
 * 
 * @throws Error if the snapshot is not found or the API request fails
 */
export async function fetchSnapshotById(
  snapshotId: string
): Promise<VantageSnapshot> {
  try {
    const response = await http.get<SnapshotByIdResponse>(
      `vantage-scraper/${snapshotId}`
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Snapshot not found");
    }

    // Transform API snapshot to internal format
    return transformApiSnapshotToSnapshot(response.data.data);
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error("Snapshot not found");
      }
      const errorMessage =
        error.response.data?.message ||
        `API Error: ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error(
        "Network error: Unable to reach the server. Please check your connection and try again."
      );
    } else {
      throw new Error(error.message || "Failed to fetch snapshot");
    }
  }
}

