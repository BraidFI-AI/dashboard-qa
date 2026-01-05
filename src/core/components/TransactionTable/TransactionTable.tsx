"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { GridCellParams, MuiEvent } from "@mui/x-data-grid";
import moment from "moment";

// Core components
import MyText from "@/core/components/Text/Text";
import LabelBox from "@/core/components/label_box";
import MyLinkText from "@/core/components/Text/LinkText";
import MyTable, { DataGridPaginationType } from "@/core/components/Table/MyTable";

// Core utils & types
import { enumTextToReadableText } from "@/core/utils/formatting_util";
import toDollarFormat from "@/core/utils/toDollarFormat";
import { pageSizeOptions } from "@/core/constants";
import type { Transaction } from "@/core/types";

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

export interface TransactionTableProps {
  /** Transaction data to display */
  transactions: Transaction[];
  /** Pagination props (from usePagination.getTablePaginationProps) */
  pagination: DataGridPaginationType;
  /** Called when a row is clicked */
  onRowClick?: (transaction: Transaction) => void;
  /** Columns to hide (e.g., ['customerId'] when on customer detail page) */
  hideColumns?: string[];
  /** Show expand/collapse button */
  expandable?: boolean;
  /** Current expanded state */
  expanded?: boolean;
  /** Toggle expand callback */
  onToggleExpand?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format timestamp to readable date string
 */
function formatTimestamp(timestamp: number): string {
  const m = moment(timestamp * 1000);
  return `${m.year()}-${String(m.month() + 1).padStart(2, "0")}-${String(
    m.date()
  ).padStart(2, "0")} ${String(m.hour()).padStart(2, "0")}:${String(
    m.minute()
  ).padStart(2, "0")}`;
}

/**
 * Get customer link based on customer type
 */
function getCustomerLink(transaction: Transaction): string {
  return transaction.customerType === "BUSINESS"
    ? `/businesses/${transaction.customerId}`
    : `/individuals/${transaction.customerId}`;
}

/**
 * Get counterparty navigation path
 */
function getCounterpartyPath(transaction: Transaction): string | null {
  if (
    !transaction.counterpartyId ||
    !transaction.counterpartyAssociatedEntityType ||
    !transaction.counterpartyAssociatedEntityId
  ) {
    return null;
  }

  const association =
    transaction.counterpartyAssociatedEntityType === "BUSINESS"
      ? "businesses"
      : transaction.counterpartyAssociatedEntityType === "INDIVIDUAL"
      ? "individuals"
      : transaction.counterpartyAssociatedEntityType === "ACCOUNT"
      ? "accounts"
      : "configuration/products";

  return `/${association}/${transaction.counterpartyAssociatedEntityId}/counterparties/${transaction.counterpartyId}`;
}

/**
 * Get status color for badge
 */
function getStatusColor(status?: string): "green" | "orange" | "gray" {
  switch (status) {
    case "POSTED":
      return "green";
    case "PENDING":
      return "orange";
    default:
      return "gray";
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Reusable transaction table with standard columns.
 * Used across Transaction History, Transaction Review, Account details,
 * Business/Individual details, and Alert details.
 *
 * @example
 * <TransactionTable
 *   transactions={data?.content ?? []}
 *   pagination={pagination.getTablePaginationProps(totalCount, isFetching)}
 *   onRowClick={(tx) => router.push(`/transactions/${tx.paymentId}`)}
 *   expandable
 *   expanded={expanded}
 *   onToggleExpand={() => setExpanded(!expanded)}
 * />
 */
export function TransactionTable({
  transactions,
  pagination,
  onRowClick,
  hideColumns = [],
  expandable = false,
  expanded = false,
  onToggleExpand,
}: TransactionTableProps) {
  const router = useRouter();

  // ─────────────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────────────

  const handleRowClick = useCallback(
    (params: { row: Transaction }) => {
      onRowClick?.(params.row);
    },
    [onRowClick]
  );

  const handleCellClick = useCallback(
    (params: GridCellParams, event: MuiEvent<React.MouseEvent>) => {
      const transaction = params.row as Transaction;

      // Handle counterparty click
      if (params.field === "counterpartyId") {
        const path = getCounterpartyPath(transaction);
        if (path) {
          router.push(path);
        }
        event.stopPropagation();
      }

      // Prevent row click when clicking customer link
      if (params.field === "customerId") {
        event.stopPropagation();
      }
    },
    [router]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Column visibility
  // ─────────────────────────────────────────────────────────────────────────

  const columnVisibilityModel = useMemo(() => {
    const model: Record<string, boolean> = { paymentId: false };
    hideColumns.forEach((col) => {
      model[col] = false;
    });
    return model;
  }, [hideColumns]);

  // ─────────────────────────────────────────────────────────────────────────
  // Column definitions
  // ─────────────────────────────────────────────────────────────────────────

  const columns = useMemo(
    () => [
      {
        field: "paymentId",
        headerName: "Payment ID",
        flex: 1,
        minWidth: 160,
        hide: true,
      },
      {
        field: "createdAt",
        headerName: "Created",
        flex: 1,
        minWidth: 140,
        valueFormatter: (params: number) => formatTimestamp(params),
        valueGetter: (_: unknown, row: Transaction) => row.createdAt,
      },
      {
        field: "accountNumber",
        headerName: "Account Number",
        flex: 1,
        minWidth: 200,
      },
      {
        field: "amount",
        headerName: "Amount",
        flex: 1,
        minWidth: 120,
        align: "right" as const,
        display: "flex" as const,
        renderCell: (params: { row: Transaction }) => (
          <div>{toDollarFormat(params.row.amount)}</div>
        ),
      },
      {
        field: "customerId",
        headerName: "Customer",
        flex: 1,
        minWidth: 200,
        display: "flex" as const,
        renderCell: (params: { row: Transaction }) => (
          <MyLinkText
            textProps={{ size: "table" }}
            link={getCustomerLink(params.row)}
          >
            {params.row.customerName}
          </MyLinkText>
        ),
        valueGetter: (_: unknown, row: Transaction) => row.customerName,
      },
      {
        field: "counterpartyId",
        headerName: "Counterparty",
        flex: 1,
        minWidth: 200,
        display: "flex" as const,
        renderCell: (params: { row: Transaction }) => (
          <MyText primary underline size="table">
            {params.row.counterpartyName}
          </MyText>
        ),
        valueGetter: (_: unknown, row: Transaction) => row.counterpartyName,
      },
      {
        field: "description",
        headerName: "Description",
        flex: 1,
        minWidth: 200,
      },
      {
        field: "transactionType",
        headerName: "Transaction Type",
        flex: 1,
        minWidth: 250,
        display: "flex" as const,
        renderCell: (params: { row: Transaction }) => (
          <LabelBox color="gray" border>
            {enumTextToReadableText(params.row.transactionType)}
          </LabelBox>
        ),
        valueGetter: (_: unknown, row: Transaction) => row.transactionType,
      },
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        minWidth: 140,
        display: "flex" as const,
        renderCell: (params: { row: Transaction }) => (
          <LabelBox color={getStatusColor(params.row.status)} fill>
            {enumTextToReadableText(params.row.status ?? "")}
          </LabelBox>
        ),
        valueGetter: (_: unknown, row: Transaction) => row.status,
      },
      {
        field: "updatedAt",
        headerName: "Updated",
        flex: 1,
        minWidth: 140,
        valueFormatter: (params: number) => formatTimestamp(params),
        valueGetter: (_: unknown, row: Transaction) => row.updatedAt,
      },
    ],
    []
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <MyTable
      sizeOptions={pageSizeOptions}
      pagination={pagination}
      exp={expandable}
      expand={expanded}
      toggleExpand={onToggleExpand}
      customId={(row: Transaction) => row.paymentId}
      handleRowClick={handleRowClick}
      handleCellClick={handleCellClick}
      columnVisibilityModel={columnVisibilityModel}
      columns={columns}
      rows={transactions}
      sortModel={[{ field: "createdAt", sort: "desc" }]}
    />
  );
}

