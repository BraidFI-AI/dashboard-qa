"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// braid-ui
import { TransactionHistoryView } from "braid-ui";

// Feature hooks
import {
  useTransactions,
  useTransactionFilters,
  type TransactionHistoryFilters,
} from "@/features/transaction_history";

// Core components
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import { TransactionTable } from "@/core/components/TransactionTable";

// Core hooks
import { usePagination } from "@/core/hooks";

// Core types
import type { Transaction, TransactionSearchParams } from "@/core/types";

// ═══════════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════════

const Transactions = () => {
  const router = useRouter();

  // Pagination (universal hook with URL sync)
  const pagination = usePagination({ syncToUrl: true });

  // Filters (universal hook with URL sync)
  const { filters, apiFilters, setFilter, resetFilters, applyFilters } =
    useTransactionFilters({ onReset: pagination.reset });

  // Table expand state
  const [expanded, setExpanded] = useState(false);

  // Track when we're applying filters to prevent multiple API calls
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);
  const searchParams = useSearchParams();
  const prevApiFiltersRef = useRef(apiFilters);

  // Clear the flag when both pagination and filters have synced
  useEffect(() => {
    if (isApplyingFilters) {
      // Wait until pagination has reset to 0 and filters have updated
      // This ensures both hooks have synced before re-enabling the query
      const filtersChanged =
        JSON.stringify(apiFilters) !==
        JSON.stringify(prevApiFiltersRef.current);
      if (pagination.page === 0 && filtersChanged) {
        prevApiFiltersRef.current = apiFilters;
        setIsApplyingFilters(false);
      }
    } else {
      // Update ref when not applying filters
      prevApiFiltersRef.current = apiFilters;
    }
  }, [searchParams, isApplyingFilters, pagination.page, apiFilters]);

  // React Query hook for fetching transactions
  const { data, isLoading, isError, error, isFetching, refetch } =
    useTransactions(
      apiFilters as TransactionSearchParams,
      pagination.page,
      pagination.pageSize,
      { enabled: !isApplyingFilters }
    );

  // ─────────────────────────────────────────────────────────────────────────
  // Filter handlers (adapted for braid-ui interface)
  // ─────────────────────────────────────────────────────────────────────────

  const handleFilterChange = useCallback(
    (
      field: keyof TransactionHistoryFilters,
      value: string | string[] | boolean | undefined
    ) => {
      setFilter(field, value as never);
    },
    [setFilter]
  );

  const handleResetFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  const handleApplyFilters = useCallback(() => {
    // Set flag to prevent query from running during filter application
    // This prevents multiple API calls (one for page change, one for filter change)
    setIsApplyingFilters(true);
    // applyFilters now handles resetting pagination to page 0 in a single URL update
    applyFilters();
    // Flag will be cleared by useEffect when searchParams changes
  }, [applyFilters]);

  const handleRowClick = useCallback(
    (transaction: Transaction) => {
      router.push(`/transactions/transactionHistory/${transaction.paymentId}`);
    },
    [router]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div>
      <TransactionHistoryView
        table={
          <TransactionTable
            transactions={data?.content ?? []}
            pagination={pagination.getTablePaginationProps(
              data?.totalElements ?? 0,
              isFetching
            )}
            onRowClick={handleRowClick}
            expandable
            expanded={expanded}
            onToggleExpand={() => setExpanded(!expanded)}
          />
        }
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        onApplyFilters={handleApplyFilters}
        isLoading={isFetching}
        error={isError ? error.message : null}
        onRetry={refetch}
      />
    </div>
  );
};

export default Transactions;
