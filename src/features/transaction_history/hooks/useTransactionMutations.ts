/**
 * React Query mutation hooks for transaction operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '../api';
import { transactionKeys } from './useTransactions';

// ═══════════════════════════════════════════════════════════════════════════
// Cancel / Return Mutations
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Cancel a pending transaction
 */
export function useCancelTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, reason }: { paymentId: string; reason: string }) =>
      transactionsApi.cancel(paymentId, reason),
    onSuccess: () => {
      // Invalidate all transaction queries to refresh data
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}

/**
 * Return an ACH transaction
 */
export function useReturnAchTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      paymentId,
      returnCode,
    }: {
      paymentId: string;
      returnCode: string;
    }) => transactionsApi.returnAch(paymentId, returnCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}

/**
 * Return a wire transaction
 */
export function useReturnWireTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      paymentId,
      returnCode,
    }: {
      paymentId: string;
      returnCode: string;
    }) => transactionsApi.returnWire(paymentId, returnCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}

/**
 * Return a transaction (auto-detects ACH vs Wire)
 */
export function useReturnTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      paymentId,
      returnCode,
      type,
    }: {
      paymentId: string;
      returnCode: string;
      type: 'ach' | 'wire';
    }) =>
      type === 'ach'
        ? transactionsApi.returnAch(paymentId, returnCode)
        : transactionsApi.returnWire(paymentId, returnCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}

/**
 * Update wire IMAD
 */
export function useUpdateImad() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, imad }: { paymentId: string; imad: string }) =>
      transactionsApi.updateImad(paymentId, imad),
    onSuccess: (_, { paymentId }) => {
      // Invalidate specific transaction
      queryClient.invalidateQueries({
        queryKey: transactionKeys.detail(paymentId),
      });
    },
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// Create Transaction Mutations
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create adjustment transaction
 */
export function useCreateAdjustment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      accountNumber: string;
      amount: number;
      direction: 'CREDIT' | 'DEBIT';
      subType: string;
      description: string;
    }) => transactionsApi.createAdjustment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
}

/**
 * Create wire transaction
 */
export function useCreateWire() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      amount: number;
      description: string;
      accountNumber: string;
      counterpartyId: string;
      counterpartyType: string;
    }) => transactionsApi.createWire(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
}

/**
 * Create internal transfer
 */
export function useCreateTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      amount: number;
      description: string;
      senderAccountNumber: string;
      recipientAccountNumber: string;
    }) => transactionsApi.createTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
}

