/**
 * Transactions feature - Public API
 *
 * Import from this file, not from internal modules:
 * ✅ import { useTransactions, transactionKeys } from '@/features/transactions';
 * ❌ import { useTransactions } from '@/features/transactions/hooks/useTransactions';
 */

// ═══════════════════════════════════════════════════════════════════════════
// Query Hooks
// ═══════════════════════════════════════════════════════════════════════════

export {
  useTransactions,
  useTransaction,
  useTransactionsForReview,
  useBreachedLimits,
  useRuleChecks,
  transactionKeys,
} from "./hooks/useTransactions";

// ═══════════════════════════════════════════════════════════════════════════
// Mutation Hooks
// ═══════════════════════════════════════════════════════════════════════════

export {
  useCancelTransaction,
  useReturnAchTransaction,
  useReturnWireTransaction,
  useReturnTransaction,
  useUpdateImad,
  useCreateAdjustment,
  useCreateWire,
  useCreateTransfer,
} from "./hooks/useTransactionMutations";

// ═══════════════════════════════════════════════════════════════════════════
// Filter Hooks
// ═══════════════════════════════════════════════════════════════════════════

export {
  useTransactionFilters,
  emptyTransactionFilters,
} from "./hooks/useTransactionFilters";
export type { TransactionHistoryFilters } from "./hooks/useTransactionFilters";

// ═══════════════════════════════════════════════════════════════════════════
// Utilities & Mappers
// ═══════════════════════════════════════════════════════════════════════════

export {
  // API → UI mappers
  toUITransaction,
  buildTimelineEvents,
  // Action helpers
  canCancel,
  canReturn,
} from "./utils";
export type { UITransactionData, UITimelineEvent } from "./utils";

// ═══════════════════════════════════════════════════════════════════════════
// API (for advanced use cases)
// ═══════════════════════════════════════════════════════════════════════════

export { transactionsApi } from "./api";
