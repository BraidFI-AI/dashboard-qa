"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  paginationPageSize,
  pageSizeOptions as defaultPageSizeOptions,
} from "@/core/constants";
import type { DataGridPaginationType } from "@/core/components/Table/MyTable";

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

export interface UsePaginationOptions {
  /** Default page size (default: 100) */
  defaultPageSize?: number;
  /** Available page size options (default: [100, 200, 500]) */
  pageSizeOptions?: number[];
  /** Sync pagination state to URL query params (default: false) */
  syncToUrl?: boolean;
  /** Custom URL parameter names */
  urlParamNames?: {
    page?: string;
    pageSize?: string;
  };
}

export interface UsePaginationReturn {
  /** Current page (0-indexed) */
  page: number;
  /** Current page size */
  pageSize: number;
  /** Set the current page */
  setPage: (page: number) => void;
  /** Set the page size (resets to page 0) */
  setPageSize: (size: number) => void;
  /** Reset pagination to initial state (page 0, default size) */
  reset: () => void;
  /** Get props ready for MyTable pagination */
  getTablePaginationProps: (
    totalCount: number,
    loading: boolean
  ) => DataGridPaginationType;
}

// ═══════════════════════════════════════════════════════════════════════════
// Hook
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Universal pagination hook for managing table pagination state.
 *
 * @example
 * // Basic usage
 * const pagination = usePagination();
 * const { data } = useQuery(filters, pagination.page, pagination.pageSize);
 * <MyTable pagination={pagination.getTablePaginationProps(data?.total ?? 0, isLoading)} />
 *
 * @example
 * // With URL sync
 * const pagination = usePagination({ syncToUrl: true });
 * // URL: /transactions?page=2&pageSize=100
 */
export function usePagination(
  options: UsePaginationOptions = {}
): UsePaginationReturn {
  const {
    defaultPageSize = paginationPageSize,
    pageSizeOptions = defaultPageSizeOptions,
    syncToUrl = false,
    urlParamNames = {},
  } = options;

  const pageParam = urlParamNames.page ?? "page";
  const pageSizeParam = urlParamNames.pageSize ?? "pageSize";

  const router = useRouter();
  const searchParams = useSearchParams();

  // ─────────────────────────────────────────────────────────────────────────
  // Parse initial values from URL (if syncToUrl is enabled)
  // ─────────────────────────────────────────────────────────────────────────

  const getInitialPage = useCallback(() => {
    if (syncToUrl) {
      const urlPage = searchParams.get(pageParam);
      if (urlPage) {
        const parsed = parseInt(urlPage, 10);
        if (!isNaN(parsed) && parsed >= 0) return parsed;
      }
    }
    return 0;
  }, [syncToUrl, searchParams, pageParam]);

  const getInitialPageSize = useCallback(() => {
    if (syncToUrl) {
      const urlSize = searchParams.get(pageSizeParam);
      if (urlSize) {
        const parsed = parseInt(urlSize, 10);
        if (!isNaN(parsed) && pageSizeOptions.includes(parsed)) return parsed;
      }
    }
    return defaultPageSize;
  }, [
    syncToUrl,
    searchParams,
    pageSizeParam,
    pageSizeOptions,
    defaultPageSize,
  ]);

  // ─────────────────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────────────────

  const [page, setPageState] = useState(getInitialPage);
  const [pageSize, setPageSizeState] = useState(getInitialPageSize);

  // ─────────────────────────────────────────────────────────────────────────
  // URL Sync
  // ─────────────────────────────────────────────────────────────────────────

  const updateUrl = useCallback(
    (newPage: number, newPageSize: number) => {
      if (!syncToUrl) return;

      const params = new URLSearchParams(searchParams.toString());

      // Only add to URL if not default values
      if (newPage > 0) {
        params.set(pageParam, String(newPage));
      } else {
        params.delete(pageParam);
      }

      if (newPageSize !== defaultPageSize) {
        params.set(pageSizeParam, String(newPageSize));
      } else {
        params.delete(pageSizeParam);
      }

      const queryString = params.toString();
      const newUrl = queryString
        ? `${window.location.pathname}?${queryString}`
        : window.location.pathname;

      router.replace(newUrl, { scroll: false });
    },
    [syncToUrl, searchParams, router, pageParam, pageSizeParam, defaultPageSize]
  );

  // Sync from URL on initial mount and URL changes (if syncToUrl is enabled)
  useEffect(() => {
    if (syncToUrl) {
      setPageState(getInitialPage());
      setPageSizeState(getInitialPageSize());
    }
  }, [syncToUrl, searchParams, getInitialPage, getInitialPageSize]);

  // ─────────────────────────────────────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────────────────────────────────────

  const setPage = useCallback(
    (newPage: number) => {
      setPageState(newPage);
      updateUrl(newPage, pageSize);
    },
    [pageSize, updateUrl]
  );

  const setPageSize = useCallback(
    (newSize: number) => {
      // Reset to page 0 when page size changes
      setPageSizeState(newSize);
      setPageState(0);
      updateUrl(0, newSize);
    },
    [updateUrl]
  );

  const reset = useCallback(() => {
    setPageState(0);
    setPageSizeState(defaultPageSize);
    updateUrl(0, defaultPageSize);
  }, [defaultPageSize, updateUrl]);

  // ─────────────────────────────────────────────────────────────────────────
  // MyTable Props Generator
  // ─────────────────────────────────────────────────────────────────────────

  const getTablePaginationProps = useCallback(
    (totalCount: number, loading: boolean): DataGridPaginationType => ({
      rowCount: totalCount,
      loading,
      paginationModel: {
        page,
        pageSize: pageSize as 100 | 200 | 500,
      },
      setPaginationModel: (newPage: number, newSize: number) => {
        if (newSize !== pageSize) {
          setPageSize(newSize);
        } else if (newPage !== page) {
          setPage(newPage);
        }
      },
    }),
    [page, pageSize, setPage, setPageSize]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Return
  // ─────────────────────────────────────────────────────────────────────────

  return useMemo(
    () => ({
      page,
      pageSize,
      setPage,
      setPageSize,
      reset,
      getTablePaginationProps,
    }),
    [page, pageSize, setPage, setPageSize, reset, getTablePaginationProps]
  );
}
