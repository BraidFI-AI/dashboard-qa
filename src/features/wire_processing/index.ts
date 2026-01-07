/**
 * Wire Processing feature - Public API
 *
 * Import from this file, not from internal modules:
 * ✅ import { useWireTransactionStatus } from '@/features/wire_processing';
 * ❌ import { useWireTransactionStatus } from '@/features/wire_processing/hooks/useWireTransactionStatus';
 */

// ═══════════════════════════════════════════════════════════════════════════
// Query Hooks
// ═══════════════════════════════════════════════════════════════════════════

export {
  useWireTransactionStatus,
  wireTransactionStatusKeys,
} from "./hooks/useWireTransactionStatus";

// ═══════════════════════════════════════════════════════════════════════════
// API (for advanced use cases)
// ═══════════════════════════════════════════════════════════════════════════

export { wireProcessingApi } from "./api";

