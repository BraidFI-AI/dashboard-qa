/**
 * React Query hooks for transaction queries
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { transactionsApi } from '../api';
import type { TransactionSearchParams } from '@/core/types';

// ═══════════════════════════════════════════════════════════════════════════
// Query Key Factory
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Query keys for transaction queries
 * Used for cache management and invalidation
 */
export const transactionKeys = {
  all: ['transactions'] as const,
  
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (params: TransactionSearchParams, page: number, pageSize: number) =>
    [...transactionKeys.lists(), { params, page, pageSize }] as const,
  
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (paymentId: string) => [...transactionKeys.details(), paymentId] as const,
  
  forReview: (page: number, filters?: { wireFileHandle?: string }) =>
    [...transactionKeys.all, 'review', { page, filters }] as const,
  
  breachedLimits: (paymentId: string) =>
    [...transactionKeys.all, 'breachedLimits', paymentId] as const,
  
  ruleChecks: (paymentId: string) =>
    [...transactionKeys.all, 'ruleChecks', paymentId] as const,
};

// ═══════════════════════════════════════════════════════════════════════════
// Query Hooks
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fetch paginated list of transactions with filters
 */
export function useTransactions(
  params: TransactionSearchParams,
  page: number = 0,
  pageSize: number = 100,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: transactionKeys.list(params, page, pageSize),
    queryFn: () => transactionsApi.search(params, page, pageSize),
    // Keep showing previous data while fetching new page (prevents flash)
    placeholderData: keepPreviousData,
    // Cache for 30 seconds
    staleTime: 30_000,
    // Allow disabling the query (e.g., during filter application)
    enabled: options?.enabled !== false,
  });
}

/**
 * Fetch a single transaction by payment ID
 */
export function useTransaction(paymentId: string | null) {
  return useQuery({
    queryKey: transactionKeys.detail(paymentId!),
    queryFn: () => transactionsApi.getByPaymentId(paymentId!),
    enabled: !!paymentId,
    staleTime: 60_000,
  });
}

/**
 * Fetch transactions pending manual review
 */
export function useTransactionsForReview(
  page: number = 0,
  pageSize: number = 100,
  filters?: { wireFileHandle?: string }
) {
  return useQuery({
    queryKey: transactionKeys.forReview(page, filters),
    queryFn: () => transactionsApi.getForReview(page, pageSize, filters),
    placeholderData: keepPreviousData,
    // Review queue changes frequently
    staleTime: 10_000,
  });
}

/**
 * Fetch breached/flagged limits for a transaction
 */
export function useBreachedLimits(paymentId: string | null) {
  return useQuery({
    queryKey: transactionKeys.breachedLimits(paymentId!),
    queryFn: () => transactionsApi.getBreachedLimits(paymentId!),
    enabled: !!paymentId,
    staleTime: 60_000,
  });
}

/**
 * Fetch all rule checks for a transaction
 */
export function useRuleChecks(paymentId: string | null) {
  return useQuery({
    queryKey: transactionKeys.ruleChecks(paymentId!),
    queryFn: () => transactionsApi.getRuleChecks(paymentId!),
    enabled: !!paymentId,
    staleTime: 60_000,
  });
}

