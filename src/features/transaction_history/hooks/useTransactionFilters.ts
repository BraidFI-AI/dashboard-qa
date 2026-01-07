"use client";

import { useUrlFilters } from "@/core/hooks";

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

/**
 * UI filter type matching braid-ui TransactionHistoryFilters exactly
 * Note: braid-ui uses string dates and arrays, not Date objects
 */
export interface TransactionHistoryFilters {
  accountNumber?: string;
  productId?: string;
  customerId?: string;
  counterpartyId?: string;
  settlementFileName?: string;
  originalFileName?: string;
  requesterIpAddress?: string;
  requesterUsername?: string;
  wireFileHandle?: string;
  paymentId?: string;
  transactionType?: string[];
  transactionStatus?: string[];
  processingStatus?: string[];
  direction?: string;
  minAmount?: string;
  maxAmount?: string;
  beginDate?: string;
  endDate?: string;
  postDateStart?: string;
  postDateEnd?: string;
  // Boolean filters
  showAchNoc?: boolean;
  excludeWire?: boolean;
  excludeAch?: boolean;
  isInbound?: boolean;
}

/**
 * Empty/default filter values
 */
export const emptyTransactionFilters: TransactionHistoryFilters = {
  accountNumber: undefined,
  productId: undefined,
  customerId: undefined,
  counterpartyId: undefined,
  settlementFileName: undefined,
  originalFileName: undefined,
  requesterIpAddress: undefined,
  requesterUsername: undefined,
  wireFileHandle: undefined,
  paymentId: undefined,
  transactionType: undefined,
  transactionStatus: undefined,
  processingStatus: undefined,
  direction: undefined,
  minAmount: undefined,
  maxAmount: undefined,
  beginDate: undefined,
  endDate: undefined,
  postDateStart: undefined,
  postDateEnd: undefined,
  showAchNoc: undefined,
  excludeWire: undefined,
  excludeAch: undefined,
  isInbound: undefined,
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
    // No field mappings needed - braid-ui uses API field names directly
    // Arrays are handled automatically by useUrlFilters
    arrayFields: ["transactionType", "transactionStatus", "processingStatus"],
    // Boolean fields that need special parsing from URL
    booleanFields: ["showAchNoc", "excludeWire", "excludeAch", "isInbound"],
    // Note: braid-ui expects string dates, not Date objects
    // So we don't include dateFields - they'll be handled as strings
    onReset: options?.onReset,
  });
}
