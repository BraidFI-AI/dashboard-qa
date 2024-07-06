"use client";

import { CustomerAccount, Individual } from "@/core/api/ApiTypes";
import MyTable from "@/core/components/Table/MyTable";
import MyText from "@/core/components/Text/Text";
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
import {
  createIndividualAccount,
  fetchIndividualV2,
  fetchIndividualAccountsV2,
  setRefreshIndividual,
} from "@/redux/slices/IndividualSlice";
import MyModal from "@/core/components/my_modal";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import { SubmitHandler, useForm } from "react-hook-form";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
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

  const individual: "loading" | string | Individual = useSelector(
    (state: any) => state.individual.individual
  );

  const refresh = useSelector((state: any) => state.individual.refresh);

  useEffect(() => {
    if (refresh) {
      dispatch(setTitle("Individual Customer"));
      dispatch(fetchIndividualV2(parseInt(params.id.toString())));
      setAccounts("loading");
      dispatch(setRefreshIndividual(false));
    }
  }, [dispatch, params.id, refresh]);

  useEffect(() => {
    if (typeof individual != "string") {
      dispatch(setTitle(individual.firstName + " " + individual.lastName));
      setstatus(individual.status);
      setRefreshAccounts(true);
    }
  }, [individual]);

  useEffect(() => {
    if (typeof individual != "string" && refreshAccounts) {
      dispatch(fetchIndividualAccountsV2(individual.id)).then((data: any) => {
        setAccounts(data.payload);
        setRefreshAccounts(false);
      });
    }
  }, [individual, refreshAccounts]);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    router.push(`/accounts/${params.row.accountNumber}/`);
  };

  return individual == "loading" || accounts == "loading" ? (
    <MyCircularProgressIndicator />
  ) : typeof individual == "string" ? (
    <ErrorPage
      error={individual}
      recoveryButtonOnClick={() => {
        dispatch(setRefreshIndividual(true));
      }}
      recoveryButtonTitle="Retry"
    />
  ) : typeof accounts == "string" ? (
    <ErrorPage
      error={accounts}
      recoveryButtonOnClick={() => {
        dispatch(setRefreshIndividual(true));
      }}
      recoveryButtonTitle="Retry"
    />
  ) : status != "ACTIVE" ? (
    <MyText>Individual is Not Approved</MyText>
  ) : accounts.length == 0 ? (
    <MyText>No Accounts Found</MyText>
  ) : (
    <MyTable
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
      ]}
      rows={accounts}
    />
  );
};

export default Accounts;
