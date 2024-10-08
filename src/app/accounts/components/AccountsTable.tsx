"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import {
  DataGrid,
  GridCellParams,
  GridEventListener,
  GridToolbar,
  MuiEvent,
} from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { Account } from "@/core/api/ApiTypes";
import CircularProgress from "@mui/material/CircularProgress";
import {
  fetchAccounts,
  setAccountsPaginationPageNumber,
} from "@/redux/slices/AccountSlice";
import { useRouter } from "next/navigation";
import MyTable from "@/core/components/Table/MyTable";
import timestampToDate from "@/core/utils/timestampToDate";
import ErrorPage from "@/core/components/error_page";
import Link from "next/link";
import MyText from "@/core/components/Text/Text";
import { paginationPageSize, PaginationStateType } from "@/core/constants";
import MyLinkText from "@/core/components/Text/LinkText";
import LabelBox from "@/core/components/label_box";
import { enumTextToReadableText } from "@/core/utils/formatting_util";

const AccountsTable = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const accounts: "loading" | string | Account[] = useSelector(
    (state: any) => state.account.accounts
  );

  const pagination: PaginationStateType = useSelector(
    (state: any) => state.account.accontsPagination
  );

  useEffect(() => {
    dispatch(fetchAccounts(true));
  }, []);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    router.push(`/accounts/${params.row.accountNumber}`);
  };

  return accounts == null || accounts == "loading" ? (
    <div className="flex flex-col items-center justify-center">
      <CircularProgress></CircularProgress>
      <div>Loading accounts...</div>
    </div>
  ) : typeof accounts == "string" ? (
    <ErrorPage
      error={accounts}
      recoveryButtonOnClick={() => {
        dispatch(fetchAccounts(true));
      }}
      recoveryButtonTitle="Retry"
    />
  ) : accounts.length == 0 ? (
    <MyText>No accounts found</MyText>
  ) : (
    <MyTable
      pagination={{
        rowCount: pagination.rowCount,
        loading: pagination.loadingPage,
        paginationModel: {
          page: pagination.pageNumber,
          pageSize: paginationPageSize,
        },
        setPaginationModel: (page: number) => {
          dispatch(setAccountsPaginationPageNumber(page));
          dispatch(fetchAccounts(false));
        },
      }}
      handleRowClick={handleRowClick}
      handleCellClick={(
        params: GridCellParams,
        event: MuiEvent<React.MouseEvent>
      ) => {
        if (params.field == "customerName") {
          event.stopPropagation();
        }
      }}
      columns={[
        { field: "id", headerName: "ID", width: 120 },
        {
          field: "accountNumber",
          headerName: "Account Number",
          flex: 1,
          minWidth: 180,
        },
        {
          field: "accountName",
          headerName: "Account Name",
          flex: 1,
          minWidth: 210,
        },
        {
          field: "customerId",
          headerName: "Customer ID",
          flex: 1,
          minWidth: 150,
        },
        {
          field: "customerName",
          headerName: "Customer Name",
          flex: 1,
          minWidth: 150,
          renderCell: (params: any) => (
            <MyLinkText
              textProps={{ size: "table" }}
              link={
                params.row.customerType == "BUSINESS"
                  ? `/businesses/${params.row.customerId}`
                  : `/individuals/${params.row.customerId}`
              }
            >
              {params.row.customerName}
            </MyLinkText>
          ),
        },
        {
          field: "status",
          headerName: "Status",
          flex: 1,
          minWidth: 120,
          renderCell: (params: any) => (
            <LabelBox
              color={
                params.row?.status == "ACTIVE"
                  ? "green"
                  : params.row?.status == "BLOCKED"
                  ? "red"
                  : "gray"
              }
              fill
            >
              {enumTextToReadableText(params.row?.status)}
            </LabelBox>
          ),
          valueGetter: (params: any) => params.row?.status,
        },
        {
          field: "createdAt",
          headerName: "Created At",
          flex: 1,
          minWidth: 150,
          valueFormatter: (params: any) => {
            return `${timestampToDate(params.value)}`;
          },
          valueGetter: (params: any) => params.row.createdAt,
        },
        {
          field: "upadtedAt",
          headerName: "Updated At",
          flex: 1,
          minWidth: 150,
          valueFormatter: (params: any) => {
            return `${timestampToDate(params.value)}`;
          },
          valueGetter: (params: any) => params.row.updatedAt,
        },
      ]}
      // sortModel={[{ field: "createdAt", sort: "desc" }]}
      rows={accounts}
    />
  );
};

export default AccountsTable;
