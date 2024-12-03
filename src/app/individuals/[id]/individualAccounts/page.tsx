"use client";

import { CustomerAccount, Individual } from "@/core/api/ApiTypes";
import MyTable from "@/core/components/Table/MyTable";
import MyText from "@/core/components/Text/Text";
import { useAppDispatch } from "@/redux/store/store";
import { GridEventListener } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { setTitle } from "@/redux/slices/AppSlice";
import { useParams, useRouter } from "next/navigation";
import toDollarFormat from "@/core/utils/toDollarFormat";
import {
  fetchIndividualV2,
  fetchIndividualAccounts,
  setRefreshIndividual,
  setInitialIndividualState,
} from "@/redux/slices/IndividualSlice";
import { useSelector } from "react-redux";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import { PaginationStateType } from "@/core/constants";

const Accounts = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [status, setstatus] = useState("");
  const [refreshAccounts, setRefreshAccounts] = useState(true);

  const individual: "loading" | string | Individual = useSelector(
    (state: any) => state.individual.individual
  );

  const accounts: "loading" | string | CustomerAccount[] = useSelector(
    (state: any) => state.individual.individualAccounts
  );

  const pagination: PaginationStateType = useSelector(
    (state: any) => state.individual.individualAccountsPagination
  );

  const refresh = useSelector((state: any) => state.individual.refresh);

  useEffect(() => {
    if (refresh) {
      dispatch(setTitle("Individual Customer"));
      dispatch(fetchIndividualV2(parseInt(params.id.toString())));
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
      dispatch(
        fetchIndividualAccounts({ id: individual.id, refresh: true })
      ).then((data: any) => {
        setRefreshAccounts(false);
      });
    }
  }, [individual, refreshAccounts]);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    router.push(`/accounts/${params.row.accountNumber}/`);
  };

  return individual == "loading" ||
    accounts == null ||
    accounts == "loading" ? (
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
          flex: 1,
          minWidth: 120,
        },
        {
          field: "accountNumber",
          headerName: "Account Number",
          flex: 1,
          minWidth: 200,
        },
        {
          field: "accountName",
          headerName: "Account Name",
          flex: 1,
          minWidth: 180,
        },
        {
          field: "balance.accountBalance",
          headerName: "Account Balance",
          flex: 1,
          minWidth: 160,
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
          minWidth: 160,
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
          flex: 1,
          minWidth: 120,
          valueFormatter: (params: any) => {
            if (params == null) {
              return "";
            }
            return (
              params?.toString()[0].toUpperCase()[0] +
              params?.toString().slice(1)
            );
          },
        },
        {
          field: "frozen",
          headerName: "Frozen",
          flex: 1,
          minWidth: 120,
          valueFormatter: (params: any) => {
            if (params == null) {
              return "";
            }
            return (
              params?.toString()[0].toUpperCase()[0] +
              params?.toString().slice(1)
            );
          },
        },
      ]}
      rows={accounts}
    />
  );
};

export default Accounts;
