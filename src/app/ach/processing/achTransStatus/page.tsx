"use client";

import { ACHTransactionStatus } from "@/core/api/ApiTypes";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import MyTable from "@/core/components/Table/MyTable";
import {
  pageSizeOptions,
  paginationPageSize,
  PaginationStateType,
} from "@/core/constants";
import timestampToDate from "@/core/utils/timestampToDate";
import {
  fetchACHFileErrors,
  fetchACHTransactionStatus,
  setACHFilesPaginationPageNumber,
  setACHFilesPaginationPageSize,
} from "@/redux/slices/ach_processing_slice";
import { setTitle } from "@/redux/slices/AppSlice";
import { useAppDispatch } from "@/redux/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

const ACHTransactionStatusPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const pagination: PaginationStateType = useSelector(
    (state: any) => state.processing.filesPagination
  );

  const files: "loading" | string | ACHTransactionStatus[] = useSelector(
    (state: any) => state.processing.files
  );

  useEffect(() => {
    dispatch(setTitle("Transactions Status"));
    dispatch(fetchACHTransactionStatus(true));
  }, [dispatch]);

  return files == "loading" ? (
    <MyCircularProgressIndicator />
  ) : typeof files == "string" ? (
    <ErrorPage
      error={files}
      recoveryButtonTitle="Retry"
      recoveryButtonOnClick={() => {
        dispatch(fetchACHTransactionStatus(false));
      }}
    />
  ) : (
    <div style={{ height: "67vh" }}>
      <MyTable
        sizeOptions={[5, 10, 20, 50, ...pageSizeOptions]}
        pagination={{
          rowCount: pagination.rowCount,
          loading: pagination.loadingPage,
          paginationModel: {
            page: pagination.pageNumber,
            pageSize: pagination.pageSize ?? 5,
          },
          setPaginationModel: (page: number, size: number) => {
            dispatch(setACHFilesPaginationPageSize(size));
            dispatch(setACHFilesPaginationPageNumber(page));
            dispatch(fetchACHTransactionStatus(false));
          },
        }}
        handleRowClick={(params: any) => {
          router.push(
            `/ach/processing/achFileErrors?filename=${params.row.fileName}`
          );
        }}
        customId={(row: any) => uuidv4()}
        columns={[
          {
            field: "fileName",
            headerName: "File Name",
            flex: 1,
            minWidth: 200,
          },
          {
            field: "processingDate",
            headerName: "Processing Date",
            flex: 1,
            minWidth: 120,
            valueFormatter: (params: any) => {
              return `${timestampToDate(params, false, true)}`;
            },
            valueGetter: (value: any, row: any) => row?.processingDate,
          },
          {
            field: "errorTransactionsCount",
            headerName: "Error Transactions",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "pendingTransactionsCount",
            headerName: "Pending Transactions",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "postedTransactionsCount",
            headerName: "Posted Transactions",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "manualReviewTransactionsCount",
            headerName: "Manual Review Transactions",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "successfulReturnsCount",
            headerName: "Returned",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "notificationOfChangeCount",
            headerName: "NOC",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "rejectedTransactionsCount",
            headerName: "Rejected Transactions",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "duplicateTransactionsCount",
            headerName: "Duplicate Transactions",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "offsetTransactionsCount",
            headerName: "Offset Transactions",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "totalTransactions",
            headerName: "Total Transactions",
            flex: 1,
            minWidth: 120,
          },
        ]}
        rows={files}
        sortModel={[{ field: "processingDate", sort: "desc" }]}
      />
    </div>
  );
};

export default ACHTransactionStatusPage;
