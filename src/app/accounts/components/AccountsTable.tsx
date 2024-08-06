"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { DataGrid, GridEventListener, GridToolbar } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { Account } from "@/core/api/ApiTypes";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchAccounts } from "@/redux/slices/AccountSlice";
import { useRouter } from "next/navigation";
import MyTable from "@/core/components/Table/MyTable";
import timestampToDate from "@/core/utils/timestampToDate";
import ErrorPage from "@/core/components/error_page";

const AccountsTable = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const accounts: Account[] | null = useSelector(
    (state: any) => state.account.accounts
  );

  useEffect(() => {
    dispatch(fetchAccounts()).then(() => {
      setLoading(false);
    });
  }, [dispatch]);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    router.push(`/accounts/${params.row.accountNumber}`);
  };

  return loading ? (
    <div className="flex flex-col items-center justify-center">
      <CircularProgress></CircularProgress>
      <div>Loading accounts...</div>
    </div>
  ) : accounts == null ? (
    <ErrorPage
      error="Error loading accounts or no accounts found"
      recoveryButtonOnClick={() => {
        setLoading(true);
        dispatch(fetchAccounts()).then(() => {
          setLoading(false);
        });
      }}
      recoveryButtonTitle="Retry"
    />
  ) : (
    <MyTable
      handleRowClick={handleRowClick}
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
          field: "status",
          headerName: "Status",
          flex: 1,
          minWidth: 120,
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
      sortModel={[{ field: "createdAt", sort: "desc" }]}
      rows={accounts}
    />
  );
};

export default AccountsTable;
