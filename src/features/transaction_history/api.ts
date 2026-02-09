/**
 * Transactions API layer
 * Typed functions for transaction-related API calls
 */

import ApiClient, { Method } from "@/core/api/ApiClient";
import type {
  Transaction,
  TransactionSearchParams,
  PaginatedResponse,
  BreachedLimit,
} from "@/core/types";

const client = ApiClient.getInstance();

export const transactionsApi = {
  // ═══════════════════════════════════════════════════════════════════════
  // QUERIES (Read operations)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Search transactions with filters and pagination
   */
  search: async (
    params: TransactionSearchParams,
    page: number = 0,
    pageSize: number = 100
  ): Promise<PaginatedResponse<Transaction>> => {
    const response = await client.http<PaginatedResponse<Transaction>>(
      Method.POST,
      `/transaction/search?pageSize=${pageSize}&pageNumber=${page}`,
      { ...params, includeRawData: true }
    );
    return response;
  },

  /**
   * Get a single transaction by payment ID
   */
  getByPaymentId: async (paymentId: string): Promise<Transaction | null> => {
    const response = await client.http<PaginatedResponse<Transaction>>(
      Method.POST,
      "/transaction/search",
      { paymentId, includeRawData: true }
    );
    return response.content[0] ?? null;
  },

  /**
   * Get transactions pending manual review
   */
  getForReview: async (
    page: number = 0,
    pageSize: number = 100,
    filters?: { wireFileHandle?: string }
  ): Promise<PaginatedResponse<Transaction>> => {
    return client.http<PaginatedResponse<Transaction>>(
      Method.POST,
      `/transaction/search?pageSize=${pageSize}&pageNumber=${page}`,
      { ...filters, processingStatus: ["MANUAL_REVIEW"] }
    );
  },

  /**
   * Get breached/flagged limits for a transaction
   */
  getBreachedLimits: async (paymentId: string): Promise<BreachedLimit[]> => {
    const limits = await client.http<BreachedLimit[]>(
      Method.GET,
      `/rule/checks/${paymentId}`
    );
    return limits.filter((limit) => limit.result !== "PASS");
  },

  /**
   * Get all rule checks for a transaction (including passed)
   */
  getRuleChecks: async (paymentId: string): Promise<BreachedLimit[]> => {
    return client.http<BreachedLimit[]>(
      Method.GET,
      `/rule/checks/${paymentId}`
    );
  },

  /**
   * Get transaction types for dropdowns
   */
  getTransactionTypes: async (): Promise<string[]> => {
    return client.http<string[]>(Method.GET, "/transaction/transactionTypes");
  },

  /**
   * Get ACH return codes for dropdowns
   */
  getAchReturnCodes: async (): Promise<string[]> => {
    const codes = await client.http<Array<{ name: string }>>(
      Method.GET,
      "/transaction/ach/returnCodes"
    );
    return codes.map((code) => code.name ?? "");
  },

  // ═══════════════════════════════════════════════════════════════════════
  // MUTATIONS (Write operations)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Cancel a pending transaction
   */
  cancel: async (paymentId: string, reason: string): Promise<Transaction> => {
    return client.http<Transaction>(Method.PUT, "/transaction/pending/cancel", {
      paymentId,
      reason,
    });
  },

  /**
   * Return an ACH transaction
   */
  returnAch: async (
    paymentId: string,
    returnCode: string
  ): Promise<Transaction> => {
    return client.http<Transaction>(Method.POST, "/transaction/ach/return", {
      paymentId,
      returnCode,
      sendReturnFile: true,
    });
  },

  /**
   * Return a wire transaction
   */
  returnWire: async (
    paymentId: string,
    returnCode: string
  ): Promise<Transaction> => {
    return client.http<Transaction>(Method.POST, "/transaction/wire/return", {
      paymentId,
      returnCode,
    });
  },

  /**
   * Update wire IMAD
   */
  updateImad: async (paymentId: string, imad: string): Promise<void> => {
    return client.http<void>(Method.PUT, "/wire/imad", { paymentId, imad });
  },

  // ═══════════════════════════════════════════════════════════════════════
  // CREATE TRANSACTIONS
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Create adjustment transaction
   */
  createAdjustment: async (data: {
    accountNumber: string;
    amount: number;
    direction: "CREDIT" | "DEBIT";
    subType: string;
    description: string;
  }): Promise<Transaction> => {
    return client.http<Transaction>(
      Method.POST,
      "/transaction/adjustment",
      data
    );
  },

  /**
   * Create wire transaction
   */
  createWire: async (data: {
    amount: number;
    description: string;
    accountNumber: string;
    counterpartyId: string;
    counterpartyType: string;
  }): Promise<Transaction> => {
    return client.http<Transaction>(Method.POST, "/transaction/wire", data);
  },

  /**
   * Create internal transfer
   */
  createTransfer: async (data: {
    amount: number;
    description: string;
    senderAccountNumber: string;
    recipientAccountNumber: string;
  }): Promise<Transaction> => {
    return client.http<Transaction>(Method.POST, "/transaction/transfer", data);
  },
};
