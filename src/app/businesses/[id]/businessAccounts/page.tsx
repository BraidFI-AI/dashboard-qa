"use client";

import { Business, CustomerAccount } from "@/core/api/ApiTypes";
import MyTable from "@/core/components/Table/MyTable";
import MyText from "@/core/components/Text/Text";
import {
  creatBusinessAccount,
  fetchBusinessV2,
  fetchBusinessAccountsV2,
  setRefresh,
} from "@/redux/slices/BusinessSlice";
import { useAppDispatch } from "@/redux/store/store";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import {
  GridCellParams,
  GridEventListener,
  GridValueFormatterParams,
  MuiEvent,
} from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { setTitle } from "@/redux/slices/AppSlice";
import { useParams, useRouter } from "next/navigation";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { enqueueSnackbar } from "notistack";
import toDollarFormat from "@/core/utils/toDollarFormat";
import { useSelector } from "react-redux";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";

const Accounts = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [status, setstatus] = useState("");
  const [refreshAccounts, setRefreshAccounts] = useState(true);
  const [accounts, setAccounts] = useState<
    "loading" | string | CustomerAccount[]
  >("loading");

  const business: "loading" | string | Business = useSelector(
    (state: any) => state.business.business
  );

  const refresh = useSelector((state: any) => state.business.refresh);

  useEffect(() => {
    if (refresh) {
      dispatch(setTitle("Business Customer"));
      dispatch(fetchBusinessV2(parseInt(params.id.toString())));
      setAccounts("loading");
      dispatch(setRefresh(false));
    }
  }, [dispatch, params.id, refresh]);

  useEffect(() => {
    if (typeof business != "string") {
      dispatch(setTitle(business.name));
      setstatus(business.status);
      setRefreshAccounts(true);
    }
  }, [business]);

  useEffect(() => {
    if (typeof business != "string" && refreshAccounts) {
      dispatch(fetchBusinessAccountsV2(business.id)).then((data: any) => {
        setAccounts(data.payload);
        setRefreshAccounts(false);
      });
    }
  }, [business, refreshAccounts]);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    router.push(`/accounts/${params.row.accountNumber}/`);
  };

  return business == "loading" || accounts == "loading" ? (
    <MyCircularProgressIndicator />
  ) : typeof business == "string" ? (
    <ErrorPage
      error={business}
      recoveryButtonOnClick={() => {
        dispatch(setRefresh(false));
      }}
      recoveryButtonTitle="Retry"
    />
  ) : typeof accounts == "string" ? (
    <ErrorPage
      error={accounts}
      recoveryButtonOnClick={() => {
        dispatch(setRefresh(false));
      }}
      recoveryButtonTitle="Retry"
    />
  ) : status != "ACTIVE" ? (
    <MyText>Business is Not Approved</MyText>
  ) : accounts.length == 0 ? (
    <MyText>No Accounts Found</MyText>
  ) : (
    <div style={{ height: "75vh" }}>
      <MyTable
        // handleCellClick={(
        //   params: GridCellParams,
        //   event: MuiEvent<React.MouseEvent>
        // ) => {
        //   if (params.field == "transaction") {
        //     event.stopPropagation();
        //   }
        // }}
        handleRowClick={handleRowClick}
        columns={[
          {
            field: "id",
            headerName: "Account ID",
            width: 120,
          },
          {
            field: "accountNumber",
            headerName: "Account Number",
            flex: 1,
            minWidth: 120,
            maxWidth: 300,
          },
          {
            field: "accountName",
            headerName: "Account Name",
            flex: 1,
            minWidth: 120,
            maxWidth: 300,
          },
          {
            field: "balance.accountBalance",
            headerName: "Account Balance",
            flex: 1,
            minWidth: 120,
            maxWidth: 300,
            valueGetter(params: any) {
              if (!params.value) {
                return params.row.balance?.accountBalance;
              }
              return params.row.balance?.accountBalance;
            },
            renderCell: (params: any) => (
              <MyText>
                {toDollarFormat(params.row.balance?.accountBalance)}
              </MyText>
            ),
          },
          {
            field: "balance.availableBalance",
            headerName: "Available Balance",
            flex: 1,
            minWidth: 120,
            maxWidth: 300,
            valueGetter(params: any) {
              if (!params.value) {
                return params.row.balance?.availableBalance;
              }
              return params.row.balance?.availableBalance;
            },
            renderCell: (params: any) => (
              <MyText>
                {toDollarFormat(params.row.balance?.availableBalance)}
              </MyText>
            ),
          },
          {
            field: "active",
            headerName: "Active",
            width: 120,
            valueFormatter: (params: GridValueFormatterParams<any>) => {
              if (params.value == null) {
                return "";
              }
              return (
                params.value?.toString()[0].toUpperCase()[0] +
                params.value?.toString().slice(1)
              );
            },
          },
          {
            field: "frozen",
            headerName: "Frozen",
            width: 120,
            valueFormatter: (params: GridValueFormatterParams<any>) => {
              if (params.value == null) {
                return "";
              }
              return (
                params.value?.toString()[0].toUpperCase()[0] +
                params.value?.toString().slice(1)
              );
            },
          },
          // {
          //   field: "transaction",
          //   headerName: "Transactions",
          //   flex: 1,
          //   minWidth: 180,
          //   maxWidth: 220,
          //   renderCell: (cellParams: any) => (
          //     <Tooltip title="View Account Transactions" placement="left">
          //       <div className="flex justify-center w-full">
          //         <MyBlueButton
          //           onClick={() => {
          //             if (cellParams != null) {
          //               router.push(
          //                 `/businesses/${parseInt(
          //                   params.id.toString()
          //                 )}/businessAccounts/${cellParams.id}`
          //               );
          //             }
          //           }}
          //         >
          //           View Transactions
          //         </MyBlueButton>
          //       </div>
          //     </Tooltip>
          //   ),
          // },
        ]}
        rows={accounts}
      />
    </div>
  );
};

export default Accounts;
