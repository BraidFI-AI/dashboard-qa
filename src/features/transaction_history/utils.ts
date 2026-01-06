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
 * Format timestamp to "YYYY-MM-DD HH:mm" format
 */
function formatDateTime(timestamp: number | undefined): string {
  if (!timestamp)
    return new Date().toISOString().slice(0, 16).replace("T", " ");
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * Map ACH details to braid-ui format
 */
function mapAchDetails(
  ach: any,
  transaction: Transaction
): NonNullable<UITransactionData>["achDetails"] {
  if (!ach) return undefined;

  const isInbound =
    ach.direction === "INBOUND" || transaction.operationType === "CREDIT";

  // Extract routing number from ODFI/RDFI (format: 021000021 -> 021000021)
  const odfi = ach.odfi ?? "";
  const rdfi = ach.rdfi ?? "";
  const receivingAccount = ach.receivingAccount ?? "";

  // Determine originator and receiver based on direction
  // For INBOUND: originator is counterparty (sending), receiver is customer (receiving)
  // For OUTBOUND: originator is customer (sending), receiver is counterparty (receiving)
  const originatorName = isInbound
    ? ach.originatorName ?? transaction.counterpartyName ?? ""
    : ach.originatorName ?? transaction.customerName ?? "";
  const originatorAccountNumber = isInbound
    ? ach.originatorAccountNumber ?? transaction.counterAccountId ?? ""
    : transaction.accountNumber ?? "";
  const receiverName = isInbound
    ? ach.receiverName ?? transaction.customerName ?? ""
    : ach.receiverName ?? transaction.counterpartyName ?? "";
  const receiverAccountNumber = isInbound
    ? transaction.accountNumber ?? ""
    : receivingAccount ?? transaction.counterAccountId ?? "";
  // Receiver routing number is always RDFI (the bank receiving the transaction)
  const receiverRoutingNumber = rdfi;

  return {
    type: isInbound ? "ACH Credit" : "ACH Debit",
    originatorName,
    originatorAccountNumber,
    receiverName,
    receiverAccountNumber,
    receiverRoutingNumber,
    amount: parseFloat(transaction.amount) || 0,
    secCode: ach.secCode ?? "",
    companyEntryDescription: ach.service ?? "",
    companyDiscretionaryData: ach.externalId ?? transaction.description ?? "",
    individualIdNumber: ach.receiverId ?? "",
    individualName: receiverName,
    traceNumber: ach.traceNumber ?? "",
    raw: ach.raw || {
      recordType: "6",
      transactionCode: isInbound ? "22" : "27",
      receivingDFIIdentification: receiverRoutingNumber.slice(0, 8) || "",
      checkDigit: receiverRoutingNumber.slice(8, 9) || "",
      DFIAccountNumber: receiverAccountNumber || "",
      amount: String(Math.round(parseFloat(transaction.amount) * 100)).padStart(
        10,
        "0"
      ),
      individualIdentificationNumber: ach.receiverId ?? "",
      individualName: (receiverName ?? "").slice(0, 22).padEnd(22, " "),
      discretionaryData: "  ",
      addendaRecordIndicator: "0",
      traceNumber: ach.traceNumber ?? "",
      batchHeader: {
        recordType: "5",
        serviceClassCode: "200",
        companyName: (originatorName ?? "")
          .slice(0, 16)
          .padEnd(16, " ")
          .toUpperCase(),
        companyDiscretionaryData: (ach.externalId ?? "")
          .slice(0, 20)
          .padEnd(20, " "),
        companyIdentification: ach.originatorId ?? "",
        standardEntryClassCode: ach.secCode ?? "CCD",
        companyEntryDescription: ach.service ?? "PAYROLL",
        companyDescriptiveDate: formatDateTime(
          ach.effective_date?.[0] || transaction.created
        )
          .replace(/-/g, "")
          .slice(2, 8),
        effectiveEntryDate: formatDateTime(
          ach.effective_date?.[0] || transaction.created
        )
          .replace(/-/g, "")
          .slice(2, 8),
        settlementDate: "   ",
        originatorStatusCode: "1",
        // ODFI is the bank of the originator (customer for outbound, counterparty for inbound)
        originatingDFIIdentification: odfi.slice(0, 8) || "",
        batchNumber: "0000001",
      },
    },
  };
}

/**
 * Map Wire details to braid-ui format
 */
function mapWireDetails(
  wire: any,
  transaction: Transaction
): NonNullable<UITransactionData>["wireDetails"] {
  if (!wire) return undefined;

  const isInbound = transaction.operationType === "CREDIT";

  // Extract routing numbers and bank names
  const originatorRoutingNumber = wire.originatorRoutingNumber ?? "";
  const beneficiaryRoutingNumber = wire.beneficiaryRoutingNumber ?? "";
  const intermediaryRoutingNumber = wire.intermediaryRoutingNumber ?? "";

  return {
    type:
      wire.type ??
      (transaction.transactionType?.includes("Domestic")
        ? "Domestic Wire"
        : "International Wire"),
    originatorName: wire.originatorName ?? transaction.customerName ?? "",
    originatorAccountNumber:
      wire.originatorAccountNumber ?? transaction.accountNumber ?? "",
    originatorAddress: wire.originatorAddress ?? transaction.address ?? "",
    beneficiaryName: wire.beneficiaryName ?? transaction.counterpartyName ?? "",
    beneficiaryAccountNumber:
      wire.beneficiaryAccountNumber ?? transaction.counterAccountId ?? "",
    beneficiaryAddress: wire.beneficiaryAddress ?? "",
    beneficiaryFIName: wire.beneficiaryBankName ?? "",
    beneficiaryFIRoutingNumber: beneficiaryRoutingNumber,
    beneficiaryFIAddress: wire.beneficiaryBankAddress ?? "",
    originatorFIName: wire.originatorBankName ?? "",
    originatorFIRoutingNumber: originatorRoutingNumber,
    originatorFIAddress: wire.originatorBankAddress ?? "",
    intermediaryFIName: wire.intermediaryBankName ?? "",
    intermediaryFIRoutingNumber: intermediaryRoutingNumber,
    intermediaryFIAddress: wire.intermediaryBankAddress ?? "",
    raw: wire.raw || {
      messageType: "MT103",
      sender: wire.sender ?? "",
      receiver: wire.receiver ?? "",
      transactionReference: transaction.paymentId ?? transaction.customUUID,
      relatedReference: transaction.reference ?? "",
      bankOperationCode: "CRED",
      instructionCode: "CHQB",
      valueDate: formatDateTime(transaction.created).split(" ")[0],
      currency: transaction.currency ?? "USD",
      amount: transaction.amount,
      orderingCustomer: {
        account:
          wire.originatorAccountNumber ?? transaction.accountNumber ?? "",
        name: wire.originatorName ?? transaction.customerName ?? "",
        address: [
          wire.originatorAddress ?? transaction.address ?? "",
          "",
          "United States",
        ],
      },
      orderingInstitution: {
        bic: wire.originatorBIC ?? "",
        name: wire.originatorBankName ?? "",
        address: [wire.originatorBankAddress ?? "", ""],
      },
      intermediaryInstitution: wire.intermediaryBankName
        ? {
            bic: wire.intermediaryBIC ?? "",
            name: wire.intermediaryBankName ?? "",
            clearingCode: intermediaryRoutingNumber,
            address: [wire.intermediaryBankAddress ?? "", ""],
          }
        : undefined,
      beneficiaryInstitution: {
        bic: wire.beneficiaryBIC ?? "",
        name: wire.beneficiaryBankName ?? "",
        clearingCode: beneficiaryRoutingNumber,
        address: [wire.beneficiaryBankAddress ?? "", ""],
      },
      beneficiaryCustomer: {
        account:
          wire.beneficiaryAccountNumber ?? transaction.counterAccountId ?? "",
        name: wire.beneficiaryName ?? transaction.counterpartyName ?? "",
        address: [wire.beneficiaryAddress ?? "", "", "United States"],
      },
      remittanceInformation:
        transaction.description ?? transaction.senderNote ?? "",
      regulatoryReporting: undefined,
      senderToReceiverInformation: wire.originatorToBeneficiaryInfo
        ? [wire.originatorToBeneficiaryInfo]
        : [],
      chargeDetails: "OUR",
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// API → UI Mappers
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map API Transaction to braid-ui TransactionData format
 */
export function toUITransaction(
  apiTransaction: Transaction
): UITransactionData & { updated?: string } {
  // Determine if inbound based on operationType or ACH direction
  const isInbound =
    apiTransaction.operationType === "CREDIT" ||
    apiTransaction.ach?.direction === "INBOUND";

  // Get timestamps
  const createdTimestamp = apiTransaction.createdAt ?? apiTransaction.created;
  const updatedTimestamp = apiTransaction.updatedAt ?? createdTimestamp;

  // Cast to any to access dynamic fields from API
  const achData = (apiTransaction as any).ach;
  const wireData = (apiTransaction as any).wire;

  return {
    id: apiTransaction.paymentId ?? apiTransaction.customUUID,
    created: formatDateTime(createdTimestamp),
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
    updated: formatDateTime(updatedTimestamp),
    isInbound,
    achDetails: achData ? mapAchDetails(achData, apiTransaction) : undefined,
    wireDetails: wireData
      ? mapWireDetails(wireData, apiTransaction)
      : undefined,
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
