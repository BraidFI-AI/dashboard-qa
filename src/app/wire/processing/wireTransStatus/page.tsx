"use client";

import { WireTransactionStatus } from "@/core/api/ApiTypes";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import MyTable from "@/core/components/Table/MyTable";
import { paginationPageSize, PaginationStateType } from "@/core/constants";
import timestampToDate from "@/core/utils/timestampToDate";
import { setTitle } from "@/redux/slices/AppSlice";
import {
  fetchWireTransactionStatus,
  setFileStatusPageNumber,
} from "@/redux/slices/wire_processing_slice";
import { useAppDispatch } from "@/redux/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const WireTransactionStatusPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const transactions: "loading" | string | WireTransactionStatus[] =
    useSelector((state: any) => state.wireProcessing.transactionsStatus);

  const pagination: PaginationStateType = useSelector(
    (state: any) => state.wireProcessing.fileStatusPagination
  );

  useEffect(() => {
    dispatch(setTitle("Transactions Status"));
    dispatch(fetchWireTransactionStatus({ refresh: true }));
  }, []);

  return transactions == "loading" ? (
    <MyCircularProgressIndicator />
  ) : typeof transactions == "string" ? (
    <ErrorPage
      error={transactions}
      recoveryButtonTitle="Retry"
      recoveryButtonOnClick={() => {
        dispatch(fetchWireTransactionStatus({ refresh: true }));
      }}
    />
  ) : (
    <div style={{ height: "77vh" }}>
      <MyTable
        handleRowClick={(params: any) => {
          router.push(
            `/wire/processing/wireFileErrors?filename=${params.row.baseFilename}`
          );
        }}
        customId={(row: any) => row.id}
        pagination={{
          rowCount: pagination.rowCount,
          loading: pagination.loadingPage,
          paginationModel: {
            page: pagination.pageNumber,
            pageSize: paginationPageSize,
          },
          setPaginationModel: (page: number) => {
            dispatch(setFileStatusPageNumber(page));
            dispatch(fetchWireTransactionStatus({ refresh: false }));
          },
        }}
        columns={[
          {
            field: "baseFilename",
            headerName: "File Name",
            flex: 1,
            minWidth: 260,
          },
          {
            field: "createdAt",
            headerName: "Created Date",
            flex: 1,
            minWidth: 120,
            valueFormatter: (params: any) => {
              return `${timestampToDate(params)}`;
            },
            valueGetter: (value: any, row: any) => row.createdAt,
          },
          {
            field: "errorCount",
            headerName: "Error Transactions",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "pendingCount",
            headerName: "Pending Transactions",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "postedCount",
            headerName: "Posted Transactions",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "rejectCount",
            headerName: "Rejected Transactions",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "totalRecords",
            headerName: "Total Transactions",
            flex: 1,
            minWidth: 120,
          },
        ]}
        rows={transactions}
        sortModel={[{ field: "createdAt", sort: "desc" }]}
      />
    </div>
  );
};

export default WireTransactionStatusPage;
