"use client";

import Box from "@mui/material/Box";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppDispatch } from "@/redux/store/store";
import { useSelector } from "react-redux";
import {
  AccountCounterpartyType,
  fetchAccount,
  fetchAccountCounterparties,
  setAccountCounterpartyPaginationPageNumber,
} from "@/redux/slices/AccountSlice";
import CounterpartyTableView from "@/core/components/views/counterparty/counterparty_table_view";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import { useEffect } from "react";
import { PaginationStateType } from "@/core/constants";
import { setTitle } from "@/redux/slices/AppSlice";

const CounterpartyPage = () => {
  const params = useParams();

  const dispatch = useAppDispatch();

  const counterparties: AccountCounterpartyType = useSelector(
    (state: any) => state.account.counterparties
  );

  const pagination: PaginationStateType = useSelector(
    (state: any) => state.account.counterpartyPagination
  );

  useEffect(() => {
    dispatch(setTitle("Account"));

    dispatch(fetchAccount(params.id.toString())).then((result: any) => {
      if (result.payload) {
        if (result.payload.accountName != null) {
          dispatch(setTitle(result.payload.accountName));
        }

        dispatch(
          fetchAccountCounterparties({ id: result.payload.id, refresh: true })
        );
      }
    });
  }, [dispatch, params.id]);

  return (
    <Box className="flex flex-col h-full">
      <Box className="w-fit">
        <Link href={"counterparties/create"}>
          <MyBlueButton>Create Counterparty</MyBlueButton>
        </Link>
      </Box>
      <Box className="pb-4"></Box>
      {counterparties == "loading" ? (
        <MyCircularProgressIndicator />
      ) : typeof counterparties == "string" ? (
        <ErrorPage
          error={counterparties}
          recoveryButtonTitle="Retry"
          recoveryButtonOnClick={() => {
            dispatch(fetchAccount(params.id.toString())).then((result: any) => {
              if (result.payload) {
                dispatch(
                  fetchAccountCounterparties({
                    id: result.payload.id,
                    refresh: true,
                  })
                );
              }
            });
          }}
        />
      ) : counterparties.length == 0 ? (
        <ErrorPage
          error={"No counterparties found"}
          recoveryButtonTitle="Refresh"
          recoveryButtonOnClick={() => {
            dispatch(fetchAccount(params.id.toString())).then((result: any) => {
              if (result.payload) {
                dispatch(
                  fetchAccountCounterparties({
                    id: result.payload.id,
                    refresh: true,
                  })
                );
              }
            });
          }}
        />
      ) : (
        <CounterpartyTableView
          counterparties={counterparties}
          fetchData={fetchAccountCounterparties({
            id: params.id.toString(),
          })}
          setPageNumber={(page: number) => {
            dispatch(setAccountCounterpartyPaginationPageNumber(page));
          }}
          pagination={pagination}
        ></CounterpartyTableView>
      )}
    </Box>
  );
};

export default CounterpartyPage;
