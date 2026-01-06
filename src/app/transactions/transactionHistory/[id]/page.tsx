"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// braid-ui components
import { TransactionDetailView } from "braid-ui";

// Feature hooks & utils
import {
  useTransaction,
  useBreachedLimits,
  useCancelTransaction,
  useReturnTransaction,
  toUITransaction,
  buildTimelineEvents,
  canCancel,
  canReturn,
} from "@/features/transaction_history";

// Core components
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";

// Redux - still needed for title (will be migrated later)
import { setTitle } from "@/redux/slices/AppSlice";
import { useAppDispatch } from "@/redux/store/store";

// Core types & utils
import type { Transaction } from "@/core/types";
import { isAchTransaction, isWireTransaction } from "@/core/types";

// ═══════════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════════

export default function TransactionHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const paymentId = params.id as string;

  // Dialog state
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);

  // React Query hooks
  const {
    data: transaction,
    isLoading,
    isError,
    error,
    refetch,
  } = useTransaction(paymentId);

  const { data: breachedLimits } = useBreachedLimits(
    transaction?.paymentId ?? null
  );

  // Mutations
  const cancelMutation = useCancelTransaction();
  const returnMutation = useReturnTransaction();

  // Set page title
  useEffect(() => {
      dispatch(setTitle("Transaction Details"));
  }, [dispatch]);

  // Computed values - map API data to UI format
  const uiTransaction = useMemo(
    () => (transaction ? toUITransaction(transaction) : null),
    [transaction]
  );

  const timelineEvents = useMemo(
    () => (transaction ? buildTimelineEvents(transaction) : []),
    [transaction]
  );

  const isWire = useMemo(
    () => (transaction ? isWireTransaction(transaction) : false),
    [transaction]
  );

  const isAch = useMemo(
    () => (transaction ? isAchTransaction(transaction) : false),
    [transaction]
  );

  const showCancelButton = useMemo(
    () => (transaction ? canCancel(transaction) : false),
    [transaction]
  );

  const showReturnButton = useMemo(
    () => (transaction ? canReturn(transaction) : false),
    [transaction]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Callbacks
  // ─────────────────────────────────────────────────────────────────────────

  const handleOpenReturnDialog = useCallback(() => {
    setReturnDialogOpen(true);
  }, []);

  const handleOpenCancelDialog = useCallback(() => {
    setCancelDialogOpen(true);
  }, []);

  const handleAccountClick = useCallback(
    (accountNumber: string) => {
      // Find account by number - for now navigate to accounts list with filter
      router.push(`/accounts?accountNumber=${accountNumber}`);
    },
    [router]
  );

  const handleCustomerClick = useCallback(
    (customer: string) => {
      if (!transaction) return;
      const path =
        transaction.customerType === "BUSINESS"
          ? `/businesses/${transaction.customerId}`
          : `/individuals/${transaction.customerId}`;
      router.push(path);
    },
    [router, transaction]
  );

  const handleCounterpartyClick = useCallback(
    (counterparty: string) => {
      if (
        !transaction?.counterpartyId ||
        !transaction?.counterpartyAssociatedEntityType ||
        !transaction?.counterpartyAssociatedEntityId
      ) {
        return;
      }

      const association =
        transaction.counterpartyAssociatedEntityType === "BUSINESS"
          ? "businesses"
          : transaction.counterpartyAssociatedEntityType === "INDIVIDUAL"
          ? "individuals"
          : transaction.counterpartyAssociatedEntityType === "ACCOUNT"
          ? "accounts"
          : "configuration/products";

      router.push(
        `/${association}/${transaction.counterpartyAssociatedEntityId}/counterparties/${transaction.counterpartyId}`
      );
    },
    [router, transaction]
  );

  const handleOFACClick = useCallback(
    (ofacId: string) => {
      router.push(`/compliance/ofac/${ofacId}`);
    },
    [router]
  );

  const handleProductClick = useCallback(
    (productId: string) => {
      router.push(`/configuration/products/${productId}`);
    },
    [router]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  if (isLoading) {
    return <MyCircularProgressIndicator />;
  }

  if (isError) {
    return (
      <ErrorPage
        error={
          error instanceof Error ? error.message : "Failed to load transaction"
        }
        recoveryButtonTitle="Retry"
        recoveryButtonOnClick={() => refetch()}
      />
    );
    }

  if (!transaction || !uiTransaction) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Transaction Not Found</h2>
          <p className="text-gray-500 mb-4">
            The transaction with ID {paymentId} could not be found.
          </p>
          <button
            onClick={() => router.push("/transactions/transactionHistory")}
            className="text-blue-600 hover:underline"
          >
            Back to Transaction History
          </button>
        </div>
      </div>
    );
  }

  return (
          <TransactionDetailView
      transaction={uiTransaction}
            timelineEvents={timelineEvents}
      isWireTransfer={isWire}
      isACHTransfer={isAch}
            showCancelButton={showCancelButton}
            showReturnButton={showReturnButton}
            onReturnClick={handleOpenReturnDialog}
            onCancelClick={handleOpenCancelDialog}
            onAccountClick={handleAccountClick}
            onCustomerClick={handleCustomerClick}
            onCounterpartyClick={handleCounterpartyClick}
            onOFACClick={handleOFACClick}
            onProductClick={handleProductClick}
          />
  );
}
