"use client";

import { useMemo } from "react";
import { useUrlFilters } from "@/core/hooks";
import { toBankTimezoneString } from "@/core/utils/date_time_util";

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

/** Date filter keys that represent start-of-day (bank timezone) */
const START_OF_DAY_DATE_KEYS: (keyof TransactionHistoryFilters)[] = [
  "beginDate",
  "postDateStart",
];
/** Date filter keys that represent end-of-day (bank timezone) */
const END_OF_DAY_DATE_KEYS: (keyof TransactionHistoryFilters)[] = [
  "endDate",
  "postDateEnd",
];

/**
 * Transaction history filters hook - thin wrapper around useUrlFilters
 * with transaction-specific configuration. Date filters are converted to
 * bank timezone (moment + start/end of day) before being sent to the API.
 *
 * @example
 * const { filters, apiFilters, setFilter, resetFilters, applyFilters } =
 *   useTransactionFilters({ onReset: pagination.reset });
 *
 * const { data } = useTransactions(apiFilters, pagination.page, pagination.pageSize);
 */
export function useTransactionFilters(options?: UseTransactionFiltersOptions) {
  const result = useUrlFilters<TransactionHistoryFilters>({
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

  // Convert date filter strings to bank-timezone start/end of day for API
  const apiFilters = useMemo(() => {
    const base = result.apiFilters as Record<string, unknown>;
    const out = { ...base };
    for (const key of START_OF_DAY_DATE_KEYS) {
      const value = base[key];
      if (value != null && value !== "") {
        const converted = toBankTimezoneString(
          value as string | Date,
          true /* startOfDay */
        );
        if (converted != null) out[key] = converted;
      }
    }
    for (const key of END_OF_DAY_DATE_KEYS) {
      const value = base[key];
      if (value != null && value !== "") {
        const converted = toBankTimezoneString(
          value as string | Date,
          false /* endOfDay */
        );
        if (converted != null) out[key] = converted;
      }
    }
    return out;
  }, [result.apiFilters]);

  return useMemo(
    () => ({ ...result, apiFilters }),
    [result, apiFilters]
  );
}
