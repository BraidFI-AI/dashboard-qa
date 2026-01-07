/**
 * React Query hooks for wire transaction status queries
 */

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { wireProcessingApi } from "../api";

// ═══════════════════════════════════════════════════════════════════════════
// Query Key Factory
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Query keys for wire transaction status queries
 * Used for cache management and invalidation
 */
export const wireTransactionStatusKeys = {
  all: ["wireTransactionStatus"] as const,

  lists: () => [...wireTransactionStatusKeys.all, "list"] as const,
  list: (page: number, pageSize: number, filename?: string) =>
    [
      ...wireTransactionStatusKeys.lists(),
      { page, pageSize, filename },
    ] as const,
};

// ═══════════════════════════════════════════════════════════════════════════
// Query Hooks
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fetch paginated list of wire transaction statuses
 */
export function useWireTransactionStatus(
  page: number = 0,
  pageSize: number = 100,
  filename?: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: wireTransactionStatusKeys.list(page, pageSize, filename),
    queryFn: () => wireProcessingApi.getTransactionStatus(page, pageSize, filename),
    // Keep showing previous data while fetching new page (prevents flash)
    placeholderData: keepPreviousData,
    // Cache for 30 seconds
    staleTime: 30_000,
    // Allow disabling the query (e.g., during filter application)
    enabled: options?.enabled !== false,
  });
}

