"use client";

import { useAppDispatch } from "@/redux/store/store";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MyText from "@/core/components/Text/Text";
import { Transaction, TransactionSearch } from "@/core/api/ApiTypes";
import {
  fetchTransactions,
  setPaginationPageNumber,
  setPaginationPageSize,
} from "@/redux/slices/TransactionSlice";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { TransactionHistoryView } from "braid-ui";
import moment from "moment";
import { enumTextToReadableText } from "@/core/utils/formatting_util";
import LabelBox from "@/core/components/label_box";
import MyLinkText from "@/core/components/Text/LinkText";
import toDollarFormat from "@/core/utils/toDollarFormat";
import MyTable from "@/core/components/Table/MyTable";
import {
  pageSizeOptions,
  paginationPageSize,
  PaginationStateType,
} from "@/core/constants";
import { GridCellParams, MuiEvent } from "@mui/x-data-grid";
import { createDate, toISOString } from "@/core/utils/date_time_util";
import ErrorPage from "@/core/components/error_page";

// UI filter type matching braid-ui TransactionHistoryFilters
type TransactionHistoryFilters = {
  accountNumber: string;
  product: string;
  customerId: string;
  counterpartyId: string;
  settlementFileName: string;
  originalFileName: string;
  requesterIpAddress: string;
  requesterUsername: string;
  wireFileHandle: string;
  paymentId: string;
  transactionType: string;
  transactionStatus: string;
  processingStatus: string;
  direction: string;
  minAmount: string;
  maxAmount: string;
  creationDateStart?: Date;
  creationDateEnd?: Date;
  postDateStart?: Date;
  postDateEnd?: Date;
};

// Field name mappings between UI and API
const uiToApiFieldMap: Record<string, string> = {
  creationDateStart: "beginDate",
  creationDateEnd: "endDate",
  product: "productId",
};

const apiToUiFieldMap: Record<string, string> = {
  beginDate: "creationDateStart",
  endDate: "creationDateEnd",
  productId: "product",
};

const Transactions = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const updateUrlTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // UI filters state (using braid-ui field names)
  const [filters, setFilters] = useState<TransactionHistoryFilters>({
    accountNumber: "",
    product: "",
    customerId: "",
    counterpartyId: "",
    settlementFileName: "",
    originalFileName: "",
    requesterIpAddress: "",
    requesterUsername: "",
    wireFileHandle: "",
    paymentId: "",
    transactionType: "",
    transactionStatus: "",
    processingStatus: "",
    direction: "",
    minAmount: "",
    maxAmount: "",
    creationDateStart: undefined,
    creationDateEnd: undefined,
    postDateStart: undefined,
    postDateEnd: undefined,
  });

  const [expandTable, toggleExpandTable] = useState<boolean>(false);

  const transactions = useSelector(
    (state: any) => state.transaction.transactions
  );

  const pagination: PaginationStateType = useSelector(
    (state: any) => state.transaction.pagination
  );

  // Parse URL params into API filters object (using API field names)
  const apiFilters = useMemo(() => {
    const params: { [anyProp: string]: string | string[] } = {};
    searchParams.forEach((value, key) => {
      if (value.includes(",")) {
        params[key] = value.split(",");
      } else {
        params[key] = value;
      }
    });
    return params as TransactionSearch;
  }, [searchParams]);

  // Serialize apiFilters to a stable string for comparison
  const apiFiltersKey = useMemo(() => {
    return JSON.stringify(apiFilters);
  }, [apiFilters]);

  // Initialize UI filters from URL on mount (converting API field names to UI field names)
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const urlFilters: TransactionHistoryFilters = {
      accountNumber: params.get("accountNumber") || "",
      product: params.get("productId") || "", // API uses productId, UI uses product
      customerId: params.get("customerId") || "",
      counterpartyId: params.get("counterpartyId") || "",
      settlementFileName: params.get("settlementFileName") || "",
      originalFileName: params.get("originalFileName") || "",
      requesterIpAddress: params.get("requesterIpAddress") || "",
      requesterUsername: params.get("requesterUsername") || "",
      wireFileHandle: params.get("wireFileHandle") || "",
      paymentId: params.get("paymentId") || "",
      transactionType: params.get("transactionType") || "",
      transactionStatus: params.get("transactionStatus") || "",
      processingStatus: params.get("processingStatus") || "",
      direction: params.get("direction") || "",
      minAmount: params.get("minAmount") || "",
      maxAmount: params.get("maxAmount") || "",
      // API uses beginDate/endDate, UI uses creationDateStart/creationDateEnd
      // Use createDate to parse dates in the correct timezone
      creationDateStart: params.get("beginDate")
        ? createDate(params.get("beginDate")!) || undefined
        : undefined,
      creationDateEnd: params.get("endDate")
        ? createDate(params.get("endDate")!) || undefined
        : undefined,
      postDateStart: params.get("postDateStart")
        ? createDate(params.get("postDateStart")!) || undefined
        : undefined,
      postDateEnd: params.get("postDateEnd")
        ? createDate(params.get("postDateEnd")!) || undefined
        : undefined,
    };
    setFilters(urlFilters);
  }, [searchParams]);

  // Fetch transactions when API filters change
  useEffect(() => {
    dispatch(fetchTransactions({ criteria: apiFilters, refresh: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, apiFiltersKey]);

  const navigateToEntity = async (row: any) => {
    if (
      row == null ||
      row.counterpartyId == null ||
      row.counterpartyAssociatedEntityType == null ||
      row.counterpartyAssociatedEntityId == null
    ) {
      return;
    }

    const association =
      row.counterpartyAssociatedEntityType == "BUSINESS"
        ? "businesses"
        : row.counterpartyAssociatedEntityType == "INVIDIDUAL"
        ? "individuals"
        : row.counterpartyAssociatedEntityType == "ACCOUNT"
        ? "accounts"
        : "configuration/products";

    const link = `/${association}/${row.counterpartyAssociatedEntityId}/counterparties/${row.counterpartyId}`;

    router.push(link);
  };

  const table = useMemo(
    () => (
      <MyTable
        sizeOptions={pageSizeOptions}
        pagination={{
          rowCount: pagination.rowCount,
          loading: pagination.loadingPage,
          paginationModel: {
            page: pagination.pageNumber,
            pageSize: pagination.pageSize ?? paginationPageSize,
          },
          setPaginationModel: (page: number, size: number) => {
            dispatch(setPaginationPageSize(size));
            dispatch(setPaginationPageNumber(page));
            dispatch(
              fetchTransactions({
                criteria: apiFilters,
              })
            );
          },
        }}
        exp={true}
        expand={expandTable ?? undefined}
        toggleExpand={
          toggleExpandTable
            ? () => {
                toggleExpandTable(expandTable ? false : true);
              }
            : undefined
        }
        customId={(row: Transaction) => row.paymentId}
        handleRowClick={(params: any) => {
          router.push(
            `/transactions/transactionHistory/${params.row.paymentId}`
          );
        }}
        handleCellClick={(
          params: GridCellParams,
          event: MuiEvent<React.MouseEvent>
        ) => {
          if (params.field == "counterpartyId" && params.field != null) {
            navigateToEntity(params.row);
            event.stopPropagation();
          }
          if (params.field == "customerId") {
            event.stopPropagation();
          }
        }}
        columnVisibilityModel={{
          paymentId: false,
        }}
        columns={[
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
            valueFormatter: (params: any) => {
              return `${moment(params * 1000).year()}-${(
                moment(params * 1000).month() + 1
              )
                .toString()
                .padStart(2, "0")}-${moment(params * 1000)
                .date()
                .toString()
                .padStart(2, "0")} ${moment(params * 1000)
                .hour()
                .toString()
                .padStart(2, "0")}:${moment(params * 1000)
                .minute()
                .toString()
                .padStart(2, "0")}`;
            },
            valueGetter: (value: any, row: any) => row.createdAt,
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
            align: "right",
            display: "flex",
            renderCell: (params: any) => (
              <div>{toDollarFormat(params.row.amount)}</div>
            ),
          },
          {
            field: "customerId",
            headerName: "Customer",
            flex: 1,
            minWidth: 200,
            display: "flex",
            renderCell: (params: any) => (
              <MyLinkText
                textProps={{ size: "table" }}
                link={
                  params.row.customerType != null &&
                  params.row.customerType == "BUSINESS"
                    ? `/businesses/${params.row?.customerId}`
                    : `/individuals/${params.row?.customerId}`
                }
              >
                {params.row?.customerName}
              </MyLinkText>
            ),
            valueGetter: (value: any, row: any) => row?.customerName,
          },
          {
            field: "counterpartyId",
            headerName: "Counterparty",
            flex: 1,
            minWidth: 200,
            display: "flex",
            renderCell: (params: any) => (
              <MyText primary={true} underline={true} size="table">
                {params.row?.counterpartyName}
              </MyText>
            ),
            valueGetter: (value: any, row: any) => row?.counterpartyName,
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
            display: "flex",
            renderCell: (params: any) => (
              <LabelBox color="gray" border>
                {enumTextToReadableText(params.row?.transactionType)}
              </LabelBox>
            ),
            valueGetter: (value: any, row: any) => row?.transactionType,
          },
          {
            field: "status",
            headerName: "Status",
            flex: 1,
            minWidth: 140,
            display: "flex",
            renderCell: (params: any) => (
              <LabelBox
                color={
                  params.row?.status == "POSTED"
                    ? "green"
                    : params.row?.status == "PENDING"
                    ? "orange"
                    : "gray"
                }
                fill
              >
                {enumTextToReadableText(params.row?.status)}
              </LabelBox>
            ),
            valueGetter: (value: any, row: any) => row?.status,
          },
          {
            field: "updatedAt",
            headerName: "Updated",
            flex: 1,
            minWidth: 140,
            valueFormatter: (params: any) => {
              return `${moment(params * 1000).year()}-${(
                moment(params * 1000).month() + 1
              )
                .toString()
                .padStart(2, "0")}-${moment(params * 1000)
                .date()
                .toString()
                .padStart(2, "0")} ${moment(params * 1000)
                .hour()
                .toString()
                .padStart(2, "0")}:${moment(params * 1000)
                .minute()
                .toString()
                .padStart(2, "0")}`;
            },
            valueGetter: (value: any, row: any) => row.updatedAt,
          },
        ]}
        rows={transactions}
        sortModel={[{ field: "createdAt", sort: "desc" }]}
      />
    ),
    [transactions, pagination, apiFilters, expandTable, dispatch, router]
  );

  // Helper function to update URL (converts UI field names to API field names)
  const updateURL = useCallback(
    (newFilters: TransactionHistoryFilters) => {
      const params = new URLSearchParams();

      Object.entries(newFilters).forEach(([key, val]) => {
        if (val !== undefined && val !== "") {
          // Map UI field name to API field name
          const apiKey = uiToApiFieldMap[key] || key;

          if (val instanceof Date) {
            const isoString = toISOString(val);
            if (isoString) {
              params.set(apiKey, isoString);
            }
          } else if (Array.isArray(val)) {
            if (val.length > 0) {
              params.set(apiKey, val.join(","));
            }
          } else if (typeof val === "boolean") {
            if (val) {
              params.set(apiKey, String(val));
            }
          } else {
            params.set(apiKey, String(val));
          }
        }
      });

      const queryString = params.toString();
      const newUrl = queryString
        ? `/transactions/transactionHistory?${queryString}`
        : "/transactions/transactionHistory";
      router.replace(newUrl, { scroll: false });
    },
    [router]
  );

  // Handle individual field filter changes with debouncing
  const handleFilterChange = useCallback(
    (
      field: keyof TransactionHistoryFilters,
      value: string | Date | undefined
    ) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [field]: value };

        // Debounce URL updates to batch rapid changes
        if (updateUrlTimeoutRef.current) {
          clearTimeout(updateUrlTimeoutRef.current);
        }

        updateUrlTimeoutRef.current = setTimeout(() => {
          updateURL(newFilters);
        }, 300); // 300ms debounce

        return newFilters;
      });
    },
    [updateURL]
  );

  // Reset all filters and clear URL params
  const handleResetFilters = useCallback(() => {
    // Clear any pending URL updates
    if (updateUrlTimeoutRef.current) {
      clearTimeout(updateUrlTimeoutRef.current);
    }

    const emptyFilters: TransactionHistoryFilters = {
      accountNumber: "",
      product: "",
      customerId: "",
      counterpartyId: "",
      settlementFileName: "",
      originalFileName: "",
      requesterIpAddress: "",
      requesterUsername: "",
      wireFileHandle: "",
      paymentId: "",
      transactionType: "",
      transactionStatus: "",
      processingStatus: "",
      direction: "",
      minAmount: "",
      maxAmount: "",
      creationDateStart: undefined,
      creationDateEnd: undefined,
      postDateStart: undefined,
      postDateEnd: undefined,
    };
    setFilters(emptyFilters);

    // Clear URL parameters immediately (no debounce for reset)
    router.replace("/transactions/transactionHistory", { scroll: false });
  }, [router]);

  // Apply filters (for explicit apply button)
  const handleApplyFilters = useCallback(() => {
    // Clear any pending debounced updates
    if (updateUrlTimeoutRef.current) {
      clearTimeout(updateUrlTimeoutRef.current);
    }
    updateURL(filters);
  }, [filters, updateURL]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateUrlTimeoutRef.current) {
        clearTimeout(updateUrlTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="">
      {transactions == "loading" ? (
        <MyCircularProgressIndicator />
      ) : typeof transactions == "string" ? (
        <ErrorPage
          error={transactions}
          recoveryButtonTitle="Retry"
          recoveryButtonOnClick={handleResetFilters}
        />
      ) : (
        <TransactionHistoryView
          table={table}
          filters={filters as any}
          onFilterChange={handleFilterChange as any}
          onResetFilters={handleResetFilters}
          onApplyFilters={handleApplyFilters}
        />
      )}
    </div>
  );
};

export default Transactions;
