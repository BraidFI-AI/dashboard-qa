"use client";

import { useUrlFilters } from "@/core/hooks";

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

/**
 * UI filter type matching braid-ui TransactionHistoryFilters
 */
export interface TransactionHistoryFilters {
  accountNumber: string;
  product: string;
  customerId: string;
  counterpartyId: string;
  settlementFileName: string;
  originalFileName: string;
  requesterIpAddress: string;
  requesterUsername: string;
  wireFileHandle: string;
  paymentId: string;
  transactionType: string;
  transactionStatus: string;
  processingStatus: string;
  direction: string;
  minAmount: string;
  maxAmount: string;
  creationDateStart?: Date;
  creationDateEnd?: Date;
  postDateStart?: Date;
  postDateEnd?: Date;
}

/**
 * Empty/default filter values
 */
export const emptyTransactionFilters: TransactionHistoryFilters = {
  accountNumber: "",
  product: "",
  customerId: "",
  counterpartyId: "",
  settlementFileName: "",
  originalFileName: "",
  requesterIpAddress: "",
  requesterUsername: "",
  wireFileHandle: "",
  paymentId: "",
  transactionType: "",
  transactionStatus: "",
  processingStatus: "",
  direction: "",
  minAmount: "",
  maxAmount: "",
  creationDateStart: undefined,
  creationDateEnd: undefined,
  postDateStart: undefined,
  postDateEnd: undefined,
};

// ═══════════════════════════════════════════════════════════════════════════
// Hook
// ═══════════════════════════════════════════════════════════════════════════

export interface UseTransactionFiltersOptions {
  /** Callback when filters are reset (e.g., to reset pagination) */
  onReset?: () => void;
}

/**
 * Transaction history filters hook - thin wrapper around useUrlFilters
 * with transaction-specific configuration.
 *
 * @example
 * const { filters, apiFilters, setFilter, resetFilters, applyFilters } =
 *   useTransactionFilters({ onReset: pagination.reset });
 *
 * const { data } = useTransactions(apiFilters, pagination.page, pagination.pageSize);
 */
export function useTransactionFilters(options?: UseTransactionFiltersOptions) {
  return useUrlFilters<TransactionHistoryFilters>({
    defaults: emptyTransactionFilters,
    fieldMappings: {
      creationDateStart: "beginDate",
      creationDateEnd: "endDate",
      product: "productId",
    },
    dateFields: [
      "creationDateStart",
      "creationDateEnd",
      "postDateStart",
      "postDateEnd",
    ],
    onReset: options?.onReset,
  });
}

