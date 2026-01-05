/**
 * Transaction domain types and utility functions
 */

// ═══════════════════════════════════════════════════════════════════════════
// Type Aliases (Unions)
// ═══════════════════════════════════════════════════════════════════════════

export type TransactionStatus = 'PENDING' | 'POSTED' | 'CANCELLED' | 'RETURNED';

export type ProcessingStatus = 
  | 'PENDING' 
  | 'MANUAL_REVIEW' 
  | 'APPROVED' 
  | 'REJECTED'
  | 'PROCESSING'
  | 'COMPLETED';

export type CustomerType = 'BUSINESS' | 'INDIVIDUAL';

export type Direction = 'INBOUND' | 'OUTBOUND';

// ═══════════════════════════════════════════════════════════════════════════
// Interfaces
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Transaction entity from backend API
 * Note: Maintains compatibility with existing ApiTypes.Transaction
 */
export interface Transaction {
  // Core identifiers
  paymentId: string | null;
  accountId: string;
  accountNumber: string;
  txId: string;
  
  // Amount and currency
  amount: string;
  currency: string;
  feeAmount: string | null;
  
  // Status
  status?: TransactionStatus;
  transactionType: string;
  operationType: string | null;
  processingStatus?: ProcessingStatus;
  
  // Timestamps
  created: number;
  createdAt?: number;
  updatedAt?: number;
  
  // Customer info
  customerId?: number | null;
  customerName: string | null;
  customerType?: CustomerType | string | null;
  
  // Counterparty info
  counterpartyId?: string | null;
  counterpartyName?: string | null;
  counterpartyAssociatedEntityId?: string | null;
  counterpartyAssociatedEntityType?: string | null;
  counterAccountId: string | null;
  
  // Notes and references
  reference: string;
  senderNote: string;
  recipientNote: string;
  description?: string;
  
  // Additional fields
  transactionCode: string | null;
  attr: string | null;
  address: string | null;
  location: string;
  anonymous: string | null;
  customUUID: string;
  
  // Market value
  marketValue: TransactionMarketValue;
  
  // Type-specific details (populated based on transaction type)
  ach?: AchDetails | null;
  wire?: WireDetails | null;
  transfer?: TransferDetails | null;
}

export interface TransactionMarketValue {
  amount: string;
  currency: string;
  sourceDate: number;
  source: string | null;
}

export interface AchDetails {
  traceNumber?: string | null;
  companyName?: string | null;
  effectiveDate?: string | null;
  returnCode?: string | null;
  returnReason?: string | null;
  nocCode?: string | null;
  nocReason?: string | null;
  settlementFileName?: string | null;
  originalFileName?: string | null;
  direction?: Direction;
}

export interface WireDetails {
  imad?: string | null;
  omad?: string | null;
  wireFileHandle?: string | null;
  beneficiaryName?: string | null;
  beneficiaryBank?: string | null;
  originatorName?: string | null;
  originatorBank?: string | null;
}

export interface TransferDetails {
  recipientAccountNumber?: string | null;
  senderAccountNumber?: string | null;
}

/**
 * Search/filter parameters for transactions API
 */
export interface TransactionSearchParams {
  // Text filters
  accountNumber?: string;
  paymentId?: string;
  productId?: string;
  customerId?: string;
  counterpartyId?: string;
  
  // File filters
  settlementFileName?: string;
  originalFileName?: string;
  wireFileHandle?: string;
  
  // User filters
  requesterIpAddress?: string;
  requesterUsername?: string;
  
  // Type filters
  transactionType?: string[];
  transactionStatus?: string[];
  processingStatus?: string[];
  direction?: Direction;
  
  // Date filters
  beginDate?: string;
  endDate?: string;
  postDateStart?: string;
  postDateEnd?: string;
  
  // Amount filters
  minAmount?: string;
  maxAmount?: string;
  
  // Boolean filters
  showAchNoc?: boolean;
  excludeWire?: boolean;
  excludeAch?: boolean;
  isInbound?: boolean;
  
  // Include raw data in response
  includeRawData?: boolean;
}

/**
 * Breached velocity limit
 */
export interface BreachedLimit {
  id: number;
  result: 'PASS' | 'FLAGGED' | 'FAIL';
  velocityLimit?: {
    id: number;
    name: string;
    description?: string;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// Utility Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format transaction amount as currency
 */
export function formatAmount(tx: Transaction): string {
  const amount = parseFloat(tx.amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: tx.currency || 'USD',
  }).format(amount);
}

/**
 * Format amount from string value
 */
export function formatAmountValue(amount: string, currency = 'USD'): string {
  const numAmount = parseFloat(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(numAmount);
}

/**
 * Check if transaction is posted
 */
export function isPosted(tx: Transaction): boolean {
  return tx.status === 'POSTED';
}

/**
 * Check if transaction is pending
 */
export function isPending(tx: Transaction): boolean {
  return tx.status === 'PENDING';
}

/**
 * Check if transaction needs manual review
 */
export function needsReview(tx: Transaction): boolean {
  return tx.processingStatus === 'MANUAL_REVIEW';
}

/**
 * Check if transaction is an ACH transaction
 */
export function isAchTransaction(tx: Transaction): boolean {
  return tx.ach != null || tx.transactionType?.includes('ACH');
}

/**
 * Check if transaction is a wire transaction
 */
export function isWireTransaction(tx: Transaction): boolean {
  return tx.wire != null || tx.transactionType?.includes('WIRE');
}

/**
 * Check if transaction is an internal transfer
 */
export function isTransferTransaction(tx: Transaction): boolean {
  return tx.transfer != null || tx.transactionType?.includes('TRANSFER');
}

/**
 * Get link to customer detail page
 */
export function getCustomerLink(tx: Transaction): string | null {
  if (!tx.customerId) return null;
  return tx.customerType === 'BUSINESS'
    ? `/businesses/${tx.customerId}`
    : `/individuals/${tx.customerId}`;
}

/**
 * Get link to counterparty based on association type
 */
export function getCounterpartyLink(tx: Transaction): string | null {
  if (!tx.counterpartyId || !tx.counterpartyAssociatedEntityType || !tx.counterpartyAssociatedEntityId) {
    return null;
  }
  
  const association = tx.counterpartyAssociatedEntityType === 'BUSINESS'
    ? 'businesses'
    : tx.counterpartyAssociatedEntityType === 'INDIVIDUAL'
    ? 'individuals'
    : tx.counterpartyAssociatedEntityType === 'ACCOUNT'
    ? 'accounts'
    : 'configuration/products';
    
  return `/${association}/${tx.counterpartyAssociatedEntityId}/counterparties/${tx.counterpartyId}`;
}

/**
 * Get status badge color
 */
export function getStatusColor(tx: Transaction): 'green' | 'orange' | 'gray' | 'red' {
  switch (tx.status) {
    case 'POSTED':
      return 'green';
    case 'PENDING':
      return 'orange';
    case 'CANCELLED':
      return 'gray';
    case 'RETURNED':
      return 'red';
    default:
      return 'gray';
  }
}

/**
 * Get processing status badge color
 */
export function getProcessingStatusColor(status?: ProcessingStatus): 'green' | 'orange' | 'gray' | 'red' | 'blue' {
  switch (status) {
    case 'COMPLETED':
    case 'APPROVED':
      return 'green';
    case 'PENDING':
    case 'PROCESSING':
      return 'orange';
    case 'MANUAL_REVIEW':
      return 'blue';
    case 'REJECTED':
      return 'red';
    default:
      return 'gray';
  }
}

/**
 * Format transaction type for display
 */
export function formatTransactionType(type: string): string {
  return type
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Get timestamp from transaction (handles both created and createdAt)
 */
export function getCreatedTimestamp(tx: Transaction): number {
  return tx.createdAt ?? tx.created;
}

