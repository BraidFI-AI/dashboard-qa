/**
 * Common types used across all features
 */

// ═══════════════════════════════════════════════════════════════════════════
// API Response Types
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Standard paginated response from backend APIs
 * @template T - The type of items in the content array
 */
export interface PaginatedResponse<T> {
  /** Array of items for current page */
  content: T[];
  /** Total count across all pages */
  totalElements: number;
  /** Current page number (0-indexed) */
  number: number;
  /** Items per page */
  size: number;
}

/**
 * Standard API error response
 */
export interface ApiError {
  error: string;
  message: string;
  status: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// Pagination Types
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Pagination state for components
 */
export interface PaginationState {
  /** Current page (0-indexed) */
  page: number;
  /** Items per page */
  pageSize: number;
  /** Total items (from API) */
  totalCount: number;
}

/**
 * Standard page size options
 */
export const PAGE_SIZE_OPTIONS = [50, 100, 200, 500] as const;
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

/**
 * Default pagination values
 */
export const DEFAULT_PAGE_SIZE = 100;
export const DEFAULT_PAGE = 0;

