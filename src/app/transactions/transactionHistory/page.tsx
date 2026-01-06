"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

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

  // React Query hook for fetching transactions
  const { data, isLoading, isError, error, isFetching } = useTransactions(
    apiFilters as TransactionSearchParams,
    pagination.page,
    pagination.pageSize
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
    pagination.reset();
    applyFilters();
  }, [pagination, applyFilters]);

  const handleRowClick = useCallback(
    (transaction: Transaction) => {
      router.push(`/transactions/transactionHistory/${transaction.paymentId}`);
    },
    [router]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  if (isLoading) {
    return <MyCircularProgressIndicator />;
  }

  if (isError) {
  return (
        <ErrorPage
        error={
          error instanceof Error ? error.message : "Failed to load transactions"
        }
          recoveryButtonTitle="Retry"
          recoveryButtonOnClick={handleResetFilters}
        />
    );
  }

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
        />
    </div>
  );
};

export default Transactions;
