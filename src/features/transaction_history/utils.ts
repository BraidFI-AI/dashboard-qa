import type { TransactionDetailViewProps } from "braid-ui";
import type { Transaction } from "@/core/types";
import { isArray } from "lodash";
import moment from "moment";
import { timestampToDate } from "@/core/utils/date_time_util";

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
export type UITimelineEvent =
  TransactionDetailViewProps["timelineEvents"][number];

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
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format timestamp to "DD MMM, YYYY HH:mm:ss" format (e.g., "21 Sept, 2025 14:30:45")
 */
function formatTimelineDateTime(timestamp: number): string {
  return moment.unix(timestamp).format("D MMM, YYYY HH:mm:ss");
}

/**
 * Map ACH details to braid-ui format
 */
function mapAchDetails(
  ach: any,
  transaction: Transaction,
): NonNullable<UITransactionData>["achDetails"] {
  if (!ach) return undefined;

  return {
    originatorName: ach.originatorName ?? "",
    originatorRtn: ach.odfi ?? "",
    originatorId: ach.originatorId ?? "",
    receiverName: ach.receiverName ?? "",
    receiverRtn: ach.rdfi ?? "",
    receiverAccount: ach.receivingAccount ?? "",
    secCode: ach.secCode ?? "",
    accountType: ach.accountType ?? "",
    effectiveDate:
      ach.effectiveDate != null && isArray(ach.effectiveDate)
        ? ach.effectiveDate.join("-")
        : "",
    service: ach.service ?? "",
    traceNumber: ach.traceNumber ?? "",
    addenda:
      ach.addenda != null && isArray(ach.addenda) ? ach.addenda.join(", ") : "",
    returnCode: ach.returnCode ?? "",
    changeCode: ach.changeCode ?? "",
    returnReason: ach.returnReason ?? "",
    changeReason: ach.changeReason ?? "",
    returnedAt: ach.returnedAt != null ? timestampToDate(ach.returnedAt) : "",
    nocReceivedAt:
      ach.nocReceivedAt != null ? timestampToDate(ach.nocReceivedAt) : "",
    iatAddenda: ach.iatAddenda?.toString() ?? "",
  };
}

/**
 * Map Wire details to braid-ui format
 */
function mapWireDetails(
  wire: any,
  transaction: Transaction,
): NonNullable<UITransactionData>["wireDetails"] {
  if (!wire) return undefined;

  const isInbound = transaction.operationType === "CREDIT";

  // Extract routing numbers and bank names
  const originatorRoutingNumber = wire.originatorRoutingNumber ?? "";
  const beneficiaryRoutingNumber = wire.beneficiaryRoutingNumber ?? "";
  const intermediaryRoutingNumber = wire.intermediaryRoutingNumber ?? "";

  return {
    type: wire.type ?? "",
    imad: wire.imad ?? "",
    omad: wire.omad ?? "",
    originatorName: wire.originatorName ?? "",
    originatorAccountNumber: wire.originatorAccountNumber ?? "",
    originatorFIName: wire.originatorBankName ?? "",
    originatorFIId: wire.originatorRoutingNumber ?? "",
    beneficiaryName: wire.beneficiaryName ?? "",
    beneficiaryAccountNumber: wire.beneficiaryAccountNumber ?? "",
    beneficiaryFIName: wire.beneficiaryBankName ?? "",
    beneficiaryFIId: wire.beneficiaryRoutingNumber ?? "",
    originatorToBeneficiaryInfo: wire.originatorToBeneficiaryInfo ?? "",
    returnCode: wire.returnCode ?? "",
    returnReason: wire.returnReason ?? "",
    raw: (() => {
      if (wire.rawData == null) return undefined;
      if (typeof wire.rawData === "string") {
        try {
          return JSON.parse(wire.rawData);
        } catch {
          return wire.rawData;
        }
      }
      return wire.rawData;
    })(),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// API → UI Mappers
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map API Transaction to braid-ui TransactionData format
 */
export function toUITransaction(
  apiTransaction: Transaction,
): UITransactionData & { updated?: string } {
  // Get timestamps
  const createdTimestamp = apiTransaction.createdAt ?? apiTransaction.created;
  const updatedTimestamp = apiTransaction.updatedAt ?? createdTimestamp;

  // Cast to any to access dynamic fields from API
  const achData = (apiTransaction as any).ach;
  const wireData = (apiTransaction as any).wire;
  const txAny = apiTransaction as any;

  return {
    id: apiTransaction.paymentId ?? apiTransaction.customUUID,
    created: timestampToDate(createdTimestamp, false, true),
    ofacId: apiTransaction.ofacId ?? "",
    productId: apiTransaction.productId ?? "",
    accountNumber: apiTransaction.accountNumber ?? "",
    amount: parseFloat(apiTransaction.amount) || 0,
    customer: apiTransaction.customerName ?? "",
    counterparty: apiTransaction.counterpartyName ?? "",
    description: apiTransaction.description ?? apiTransaction.senderNote ?? "",
    transactionType: apiTransaction.transactionType ?? "UNKNOWN",
    status: (apiTransaction.status ?? "UNKNOWN") as
      | "PENDING"
      | "POSTED"
      | "CANCELLED"
      | "RETURNED",
    processingStatus: (apiTransaction.processingStatus ?? "UNKNOWN") as string,
    updated: timestampToDate(updatedTimestamp, false, true),
    isInbound: apiTransaction.isInbound ?? false,
    achDetails: achData ? mapAchDetails(achData, apiTransaction) : undefined,
    wireDetails: wireData
      ? mapWireDetails(wireData, apiTransaction)
      : undefined,
    originalFilename: txAny.originalFileName ?? undefined,
    loadedFromFile: txAny.loadedFromFile ?? undefined,
    linkedPaymentId: txAny.linkedPaymentId ?? undefined,
    pendingUntilDate: txAny.pendingUntilDate
      ? timestampToDate(txAny.pendingUntilDate, true)
      : undefined,
    furtherCreditTo: txAny.furtherCreditToCustomerName ?? undefined,
    balanceAvailableDate: txAny.availableDate
      ? timestampToDate(txAny.availableDate)
      : undefined,
    requesterUsername: txAny.requesterUsername ?? undefined,
    requesterIpAddress: txAny.requesterIpAddress ?? undefined,
    settlementFilename: txAny.settlementFileName ?? undefined,
    alerts: txAny.alertIds ?? undefined,
  };
}

/**
 * Format camelCase to Title Case (e.g., "initiatedAt" -> "Initiated At")
 */
function formatTitle(key: string): string {
  return key
    .split(/(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Build timeline events from transaction data in braid-ui format
 */
export function buildTimelineEvents(
  transaction: Transaction,
): UITimelineEvent[] {
  const events: InternalTimelineEvent[] = [];
  const txAny = transaction as any;

  // Map all timestamp fields to their event titles and statuses
  const dateMapping: Record<
    string,
    {
      timestamp: number | null | undefined;
      status: "completed" | "pending" | "failed";
    }
  > = {
    createdAt: {
      timestamp: txAny.createdAt ?? transaction.created,
      status: "completed",
    },
    postedAt: {
      timestamp: txAny.postDate,
      status: "completed",
    },
    submittedAt: {
      timestamp: txAny.submittedAt,
      status: "completed",
    },
    manuallyReviewedAt: {
      timestamp: txAny.manuallyReviewedAt,
      status: "completed",
    },
    sentAt: {
      timestamp: txAny.sentAt,
      status: "completed",
    },
    cancelledAt: {
      timestamp: txAny.cancelledAt,
      status: "failed",
    },
    returnedAt: {
      timestamp: txAny.returnedAt,
      status: "failed",
    },
  };

  // Build events from all available timestamps (with numeric timestamp for sorting)
  const eventsWithNumericTimestamp: Array<{
    id: string;
    timestamp: number;
    formattedTimestamp: string;
    title: string;
    status: "completed" | "pending" | "failed";
  }> = [];

  Object.entries(dateMapping).forEach(([key, { timestamp, status }]) => {
    if (
      timestamp != null &&
      timestamp !== undefined &&
      typeof timestamp === "number"
    ) {
      eventsWithNumericTimestamp.push({
        id: key,
        timestamp,
        formattedTimestamp: formatTimelineDateTime(timestamp),
        title: formatTitle(key),
        status,
      });
    }
  });

  // Sort events by timestamp (oldest first)
  eventsWithNumericTimestamp.sort((a, b) => a.timestamp - b.timestamp);

  // Convert to InternalTimelineEvent format
  eventsWithNumericTimestamp.forEach((event) => {
    events.push({
      id: event.id,
      timestamp: event.formattedTimestamp,
      title: event.title,
      status: event.status,
    });
  });

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
