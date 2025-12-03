/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "@/core/utils/http_request";
import type {
  VantageApiResponse,
  VantageSnapshot,
  VantageCredentials,
  SnapshotsListResponse,
  SnapshotByIdResponse,
  SnapshotClientsResponse,
  SnapshotAnalyticsResponse,
  PaginationInfo,
  RetailClient,
} from "../types";
import { transformApiSnapshotToSnapshot, transformRetailClient } from "../utils/vantageTransformer";

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

    // Transform API response to internal format
    // The API might return new structure (with sub_ibs) or legacy structure
    // Use transformer to handle both cases
    const apiData = response.data.data;
    const apiSnapshotData: any = {
      id: snapshotId,
      timestamp,
      scraped_at: new Date().toISOString(),
      total_accounts: apiData.accounts?.length || 0,
      total_retail_clients: apiData.retailResults?.reduce(
        (sum: number, r: any) => sum + (r.retail?.data?.length || 0),
        0
      ) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Check if new structure (with sub_ibs) or legacy structure
    if (apiData.sub_ibs) {
      // New unified structure
      apiSnapshotData.accounts = apiData.accounts || [];
      apiSnapshotData.sub_ibs = apiData.sub_ibs || [];
      if (apiData.all_clients) {
        apiSnapshotData.all_clients = apiData.all_clients;
      }
    } else {
      // Legacy structure
      apiSnapshotData.VantageAccounts = apiData.accounts || [];
      apiSnapshotData.VantageRetailHeaders = []; // Legacy structure not used in POST response
    }

    const snapshot = transformApiSnapshotToSnapshot(apiSnapshotData);

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
 * Fetches all snapshots with pagination support (optimized - summary mode by default)
 * 
 * Endpoint: GET /api/vantage-scraper
 * 
 * @param page Page number (default: 1)
 * @param limit Number of items per page (default: 10)
 * @param summaryOnly Return summary data only, excludes nested clients (default: true)
 * @returns Promise with snapshots list and pagination info
 * 
 * @throws Error if the API request fails
 * 
 * Note: Summary mode returns ~50 lines per snapshot vs 67,000+ lines in full mode (99.9% reduction)
 */
export async function fetchSnapshots(
  page: number = 1,
  limit: number = 10,
  summaryOnly: boolean = true
): Promise<{
  snapshots: VantageSnapshot[];
  pagination: PaginationInfo;
}> {
  try {
    const response = await http.get<SnapshotsListResponse>(
      "vantage-scraper",
      {
        params: { 
          page, 
          limit,
          summary_only: summaryOnly,
        },
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
 * Fetches a specific snapshot by ID (optimized - clients excluded by default)
 * 
 * Endpoint: GET /api/vantage-scraper/:snapshotId
 * 
 * @param snapshotId The snapshot ID (e.g., "snapshot_1234567890")
 * @param includeClients Include retail clients in response (default: false)
 * @param clientLimit Maximum number of clients to return when includeClients=true (default: 100)
 * @param fields Optional comma-separated list of fields to include (e.g., "email,phone,tagList")
 * @returns Promise<VantageSnapshot> The snapshot with related data
 * 
 * @throws Error if the snapshot is not found or the API request fails
 * 
 * Note: Without clients, response is ~100 lines vs 67,000+ lines with all clients (99.8% reduction)
 */
export async function fetchSnapshotById(
  snapshotId: string,
  includeClients: boolean = false,
  clientLimit: number = 100,
  fields?: string
): Promise<VantageSnapshot> {
  try {
    const params: Record<string, any> = {
      include_clients: includeClients,
    };
    
    if (includeClients) {
      params.client_limit = clientLimit;
    }
    
    if (fields) {
      params.fields = fields;
    }

    const response = await http.get<SnapshotByIdResponse>(
      `vantage-scraper/${snapshotId}`,
      { params }
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

/**
 * Fetches paginated retail clients for a specific snapshot
 * 
 * Endpoint: GET /api/vantage-scraper/:snapshotId/clients
 * 
 * @param snapshotId The snapshot ID (e.g., "snapshot_1234567890")
 * @param page Page number (default: 1)
 * @param limit Number of clients per page (default: 50)
 * @param fields Optional comma-separated list of optional fields (e.g., "email,phone,tagList,campaignSource")
 * @returns Promise with clients array and pagination info
 * 
 * @throws Error if the snapshot is not found or the API request fails
 * 
 * Note: Response size is ~2,500 lines per page (50 clients) vs 67,000+ lines for all clients
 */
export async function fetchSnapshotClients(
  snapshotId: string,
  page: number = 1,
  limit: number = 50,
  fields?: string
): Promise<{
  clients: RetailClient[];
  pagination: PaginationInfo;
}> {
  try {
    const params: Record<string, any> = {
      page,
      limit,
    };
    
    if (fields) {
      params.fields = fields;
    }

    const response = await http.get<SnapshotClientsResponse>(
      `vantage-scraper/${snapshotId}/clients`,
      { params }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch clients");
    }

    // Transform API clients to internal format
    const clients = response.data.data.clients.map(transformRetailClient);

    return {
      clients,
      pagination: response.data.data.pagination,
    };
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
      throw new Error(error.message || "Failed to fetch clients");
    }
  }
}

/**
 * Fetches aggregated analytics for a specific snapshot
 * 
 * Endpoint: GET /api/vantage-scraper/:snapshotId/analytics
 * 
 * @param snapshotId The snapshot ID (e.g., "snapshot_1234567890")
 * @returns Promise with analytics data
 * 
 * @throws Error if the snapshot is not found or the API request fails
 * 
 * Note: Response size is ~100 lines - lightweight aggregated data perfect for dashboards
 */
export async function fetchSnapshotAnalytics(
  snapshotId: string
): Promise<SnapshotAnalyticsResponse["data"]> {
  try {
    const response = await http.get<SnapshotAnalyticsResponse>(
      `vantage-scraper/${snapshotId}/analytics`
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch analytics");
    }

    return response.data.data;
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
      throw new Error(error.message || "Failed to fetch analytics");
    }
  }
}

