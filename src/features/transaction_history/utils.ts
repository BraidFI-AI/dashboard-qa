import type { TransactionDetailViewProps } from "braid-ui";
import type { Transaction } from "@/core/types";

// ═══════════════════════════════════════════════════════════════════════════
// Types - Extract from braid-ui props for type safety
// ═══════════════════════════════════════════════════════════════════════════

/**
 * UI Transaction type - extracted from braid-ui TransactionDetailViewProps
 */
export type UITransactionData = TransactionDetailViewProps["transaction"];

/**
 * UI Timeline event type - extracted from braid-ui TransactionDetailViewProps
 */
export type UITimelineEvent = TransactionDetailViewProps["timelineEvents"][number];

/**
 * Internal timeline event type used during construction
 */
interface InternalTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  status: "completed" | "pending" | "failed";
}

// ═══════════════════════════════════════════════════════════════════════════
// API → UI Mappers
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map API Transaction to braid-ui TransactionData format
 */
export function toUITransaction(apiTransaction: Transaction): UITransactionData {
  // Determine if inbound based on operationType or ACH direction
  const isInbound =
    apiTransaction.operationType === "CREDIT" ||
    apiTransaction.ach?.direction === "INBOUND";

  return {
    id: apiTransaction.paymentId ?? apiTransaction.customUUID,
    amount: parseFloat(apiTransaction.amount) || 0,
    transactionType: apiTransaction.transactionType ?? "UNKNOWN",
    isInbound,
    status: apiTransaction.status ?? "UNKNOWN",
    processingStatus: apiTransaction.processingStatus ?? "UNKNOWN",
    accountNumber: apiTransaction.accountNumber ?? "",
    customer: apiTransaction.customerName ?? "",
    description: apiTransaction.description ?? apiTransaction.senderNote ?? "",
    counterparty: apiTransaction.counterpartyName ?? "",
    created: apiTransaction.createdAt
      ? new Date(apiTransaction.createdAt * 1000).toISOString()
      : apiTransaction.created
      ? new Date(apiTransaction.created * 1000).toISOString()
      : new Date().toISOString(),
    achDetails: apiTransaction.ach ?? undefined,
    wireDetails: apiTransaction.wire ?? undefined,
  };
}

/**
 * Build timeline events from transaction data in braid-ui format
 */
export function buildTimelineEvents(
  transaction: Transaction
): UITimelineEvent[] {
  const events: InternalTimelineEvent[] = [];

  // Created event
  if (transaction.created || transaction.createdAt) {
    const timestamp = (transaction.createdAt ?? transaction.created) * 1000;
    events.push({
      id: "created",
      timestamp: new Date(timestamp).toISOString(),
      title: "Transaction Created",
      status: "completed",
    });
  }

  // Status-based events
  if (transaction.status === "POSTED") {
    events.push({
      id: "posted",
      timestamp: transaction.updatedAt
        ? new Date(transaction.updatedAt * 1000).toISOString()
        : new Date().toISOString(),
      title: "Transaction Posted",
      status: "completed",
    });
  } else if (transaction.status === "PENDING") {
    events.push({
      id: "pending",
      timestamp: new Date().toISOString(),
      title: "Awaiting Processing",
      status: "pending",
    });
  } else if (transaction.status === "CANCELLED") {
    events.push({
      id: "cancelled",
      timestamp: transaction.updatedAt
        ? new Date(transaction.updatedAt * 1000).toISOString()
        : new Date().toISOString(),
      title: "Transaction Cancelled",
      status: "failed",
    });
  } else if (transaction.status === "RETURNED") {
    events.push({
      id: "returned",
      timestamp: transaction.updatedAt
        ? new Date(transaction.updatedAt * 1000).toISOString()
        : new Date().toISOString(),
      title: "Transaction Returned",
      status: "failed",
    });
  }

  // Map internal events to braid-ui format
  return events.map((event) => ({
    id: event.id,
    timestamp: event.timestamp,
    user: "System",
    action: event.title,
    details: undefined,
    status: event.status,
  }));
}

// ═══════════════════════════════════════════════════════════════════════════
// Action Availability Helpers
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if transaction can be cancelled
 */
export function canCancel(transaction: Transaction): boolean {
  const cancelableStatuses = ["PENDING"];
  const cancelableProcessingStatuses = [
    "INITIATED",
    "SUBMITTED",
    "CUSTOMER_REVIEW",
    "MANUAL_REVIEW",
  ];
  return (
    cancelableStatuses.includes(transaction.status ?? "") &&
    cancelableProcessingStatuses.includes(transaction.processingStatus ?? "")
  );
}

/**
 * Check if transaction can be returned
 */
export function canReturn(transaction: Transaction): boolean {
  const returnableStatuses = ["POSTED"];
  return returnableStatuses.includes(transaction.status ?? "");
}
