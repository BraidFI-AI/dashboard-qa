/**
 * Wire Processing API layer
 * Typed functions for wire processing-related API calls
 */

import ApiClient, { Method } from "@/core/api/ApiClient";
import type { WireTransactionStatus } from "@/core/api/ApiTypes";
import type { PaginatedResponse } from "@/core/types";

const client = ApiClient.getInstance();

export const wireProcessingApi = {
  // ═══════════════════════════════════════════════════════════════════════
  // QUERIES (Read operations)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Get wire transaction status with pagination
   */
  getTransactionStatus: async (
    page: number = 0,
    pageSize: number = 100,
    filename?: string
  ): Promise<PaginatedResponse<WireTransactionStatus>> => {
    const url = `/wire/load/inbound/status?pageNumber=${page}&pageSize=${pageSize}${
      filename != null && filename !== "" ? `&filename=${filename}` : ""
    }`;
    return client.http<PaginatedResponse<WireTransactionStatus>>(
      Method.GET,
      url
    );
  },
};
