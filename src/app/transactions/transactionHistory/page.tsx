"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

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

// Redux
import {
  TransactionTypesType,
  fetchTransactionTypes,
} from "@/redux/slices/AppSlice";
import { fetchProductIdsList } from "@/redux/slices/ach_return_slice";
import { useAppDispatch } from "@/redux/store/store";

// ═══════════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════════

const Transactions = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

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

  // Track if initial load has completed
  const hasLoadedOnceRef = useRef(false);

  // Filter options from Redux
  const transactionTypes: TransactionTypesType = useSelector(
    (state: any) => state.app.transactionTypes
  );
  const [productIdsList, setProductIdsList] = useState<
    "loading" | string | { id: string; name: string }[]
  >("loading");

  // Fetch filter options on mount
  useEffect(() => {
    dispatch(fetchTransactionTypes());
    dispatch(fetchProductIdsList()).then((data: any) => {
      setProductIdsList(data.payload);
    });
  }, [dispatch]);

  // Prepare filter options
  const filterOptions = {
    transactionTypes:
      transactionTypes === "loading" || typeof transactionTypes === "string"
        ? []
        : transactionTypes.map((type: string) => ({
            value: type,
            label: type,
          })),
    products:
      productIdsList === "loading" || typeof productIdsList === "string"
        ? []
        : productIdsList?.map((prd: { id: string; name: string }) => ({
            value: prd.id,
            label: `${prd.id} - ${prd.name}`,
          })) ?? [],
    transactionStatuses: [
      "REJECTED_PAYMENT_INSTRUMENT",
      "REVERSED",
      "REJECTED_VELOCITY_EXCEPTION",
      "RETURNED",
      "CANCELLED",
      "REJECTED_INSUFFICIENT_FUNDS",
      "REJECTED_INVALID_TRANSACTION_DATA",
      "REJECTED_ACCESS_EXCEPTION",
      "REJECTED_GENERIC",
      "PENDING",
      "FAILED",
      "REJECTED_ACCOUNT_STATE",
      "POSTED",
      "REJECTED_CUSTOMER_STATE",
      "APPROVED",
      "REJECTED_CONTACT_STATE",
    ].map((status) => ({
      value: status,
      label: status,
    })),
    processingStatuses: [
      "INITIATED",
      "MANUAL_REVIEW",
      "CANCELED",
      "SUBMITTED",
      "SENT",
      "RETURNED",
      "REJECTED",
      "CONFIRMED",
    ].map((status) => ({
      value: status,
      label: status,
    })),
    directions: ["DEBIT", "CREDIT"].map((direction) => ({
      value: direction,
      label: direction,
    })),
  };

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

  // Track when initial load completes
  useEffect(() => {
    if (data && !hasLoadedOnceRef.current) {
      hasLoadedOnceRef.current = true;
    }
  }, [data]);

  // Only show loading on initial load, not on filter/pagination changes
  const showLoading = isLoading && !hasLoadedOnceRef.current;

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
        filterOptions={filterOptions}
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
        isLoading={showLoading}
        error={isError ? error.message : null}
        onRetry={refetch}
      />
    </div>
  );
};

export default Transactions;
