"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// braid-ui components
import {
  CancelTransactionDialog,
  ReturnTransactionDialog,
  TransactionDetailView,
} from "braid-ui";

// Feature hooks & utils
import {
  useTransaction,
  useBreachedLimits,
  useCancelTransaction,
  useReturnTransaction,
  useUpdateImad,
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
import { useSelector } from "react-redux";

// Notifications
import { enqueueSnackbar } from "notistack";

// Constants
import { wireReturnCodes } from "@/core/constants";

// Core types & utils
import type { Transaction } from "@/core/types";
import { isAchTransaction, isWireTransaction } from "@/core/types";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { AxiosError } from "axios";

// ═══════════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════════

export default function TransactionHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const paymentId = params.id as string;

  // Dialog state
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);

  // ACH return codes from Redux
  const achReturnCodes: "loading" | string | string[] = useSelector(
    (state: any) => state.app.achReturnCodes
  );

  // React Query hooks
  const {
    data: transaction,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useTransaction(paymentId);

  const { data: breachedLimits } = useBreachedLimits(
    transaction?.paymentId ?? null
  );

  // Mutations
  const cancelMutation = useCancelTransaction();
  const returnMutation = useReturnTransaction();
  const updateImadMutation = useUpdateImad();

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

  // Return reason codes based on transaction type
  // Format: Convert string arrays to objects with label/value for braid-ui
  const returnReasonCodes = useMemo(() => {
    if (!transaction) return [];

    let codes: string[] = [];

    if (isAch) {
      // Handle ACH return codes from Redux
      if (achReturnCodes === "loading") return [];
      if (typeof achReturnCodes === "string") return [];
      if (Array.isArray(achReturnCodes)) {
        codes = achReturnCodes;
      }
    } else if (isWire) {
      codes = wireReturnCodes;
    }

    // Convert string array to objects with label and value
    // braid-ui likely expects { label: string, value: string }[]
    return codes.map((code) => ({
      label: code,
      value: code,
    }));
  }, [transaction, isAch, isWire, achReturnCodes]);

  // ─────────────────────────────────────────────────────────────────────────
  // Callbacks
  // ─────────────────────────────────────────────────────────────────────────

  const handleOpenReturnDialog = useCallback(() => {
    setIsReturnDialogOpen(true);
  }, []);

  const handleOpenCancelDialog = useCallback(() => {
    setIsCancelDialogOpen(true);
  }, []);

  const handleReturnTransaction = useCallback(
    async (data: {
      reasonCode?: string | { label: string; value: string };
    }) => {
      if (!transaction || !uiTransaction) return;

      if (!data.reasonCode) {
        enqueueSnackbar("Return code is required", { variant: "error" });
        return;
      }

      // Extract value if it's an object, otherwise use the string directly
      const returnCode =
        typeof data.reasonCode === "string"
          ? data.reasonCode
          : data.reasonCode.value || data.reasonCode.label;

      if (!returnCode) {
        enqueueSnackbar("Return code is required", { variant: "error" });
        return;
      }

      const transactionType = isAch ? "ach" : isWire ? "wire" : null;
      if (!transactionType) {
        enqueueSnackbar("Unable to determine transaction type", {
          variant: "error",
        });
        return;
      }

      try {
        await returnMutation.mutateAsync({
          paymentId: uiTransaction.id,
          returnCode: returnCode,
          type: transactionType,
        });
        setIsReturnDialogOpen(false);
        enqueueSnackbar("Transaction returned successfully", {
          variant: "success",
        });
        // Refetch transaction to get updated state
        refetch();
      } catch (error) {
        const errorMessage =
          error instanceof AxiosError
            ? generateErrorMessage(error)
            : error instanceof Error
            ? error.message
            : "Failed to return transaction";
        enqueueSnackbar(errorMessage, { variant: "error", persist: true });
      }
    },
    [transaction, uiTransaction, isAch, isWire, returnMutation, refetch]
  );

  const handleCancelTransaction = useCallback(
    async (data: { reason?: string }) => {
      if (!uiTransaction) return;

      if (!data.reason) {
        enqueueSnackbar("Reason is required", { variant: "error" });
        return;
      }

      try {
        await cancelMutation.mutateAsync({
          paymentId: uiTransaction.id,
          reason: data.reason,
        });
        setIsCancelDialogOpen(false);
        enqueueSnackbar("Transaction cancelled successfully", {
          variant: "success",
        });
        // Refetch transaction to get updated state
        refetch();
      } catch (error) {
        const errorMessage =
          error instanceof AxiosError
            ? generateErrorMessage(error)
            : error instanceof Error
            ? error.message
            : "Failed to cancel transaction";
        enqueueSnackbar(errorMessage, { variant: "error", persist: true });
      }
    },
    [uiTransaction, cancelMutation, refetch]
  );

  const handleAccountClick = useCallback(
    (accountNumber: string) => {
      // Find account by number - for now navigate to accounts list with filter
      router.push(`/accounts/${accountNumber}`);
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

  const handleIMADChange = useCallback(
    async (imad: string) => {
      if (!transaction || !uiTransaction) return;

      if (!imad) {
        enqueueSnackbar("IMAD is required", { variant: "error" });
        return;
      }

      try {
        await updateImadMutation.mutateAsync({
          paymentId: uiTransaction.id,
          imad: imad,
        });
        enqueueSnackbar("IMAD updated successfully", {
          variant: "success",
        });
        // Refetch transaction to get updated state
        refetch();
      } catch (error) {
        const errorMessage =
          error instanceof AxiosError
            ? generateErrorMessage(error)
            : error instanceof Error
            ? error.message
            : "Failed to update IMAD";
        enqueueSnackbar(errorMessage, { variant: "error", persist: true });
      }
    },
    [transaction, uiTransaction, updateImadMutation, refetch]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  // Compute error message: check for query error or transaction not found
  const errorMessage = useMemo(() => {
    if (isError) {
      return error instanceof Error ? error.message : String(error);
    }
    // If query succeeded but transaction is null, it means transaction was not found
    if (!isLoading && !isFetching && !transaction) {
      return `Transaction with ID ${paymentId} not found`;
    }
    return null;
  }, [isError, error, isLoading, isFetching, transaction, paymentId]);

  return (
    <>
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
        isLoading={isFetching}
        error={errorMessage}
        onRetry={refetch}
        onIMADChange={handleIMADChange}
      />

      {uiTransaction && (
        <>
          <CancelTransactionDialog
            transactionId={uiTransaction.id}
            open={isCancelDialogOpen}
            onOpenChange={setIsCancelDialogOpen}
            onCancel={handleCancelTransaction}
          />

          <ReturnTransactionDialog
            transactionId={uiTransaction.id}
            open={isReturnDialogOpen}
            onOpenChange={setIsReturnDialogOpen}
            onReturn={handleReturnTransaction}
            reasonCodes={returnReasonCodes}
          />
        </>
      )}
    </>
  );
}
