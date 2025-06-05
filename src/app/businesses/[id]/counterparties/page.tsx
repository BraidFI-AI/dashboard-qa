"use client";

import Box from "@mui/material/Box";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import Link from "next/link";
import { useAppDispatch } from "@/redux/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import CounterpartyTableView from "@/core/components/views/counterparty/counterparty_table_view";
import {
  BusinessCounterpartyType,
  fetchBusiness,
  fetchBusinessCounterparties,
  setBusinessCounterpartyPaginationPageNumber,
} from "@/redux/slices/BusinessSlice";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import { PaginationStateType } from "@/core/constants";
import { setTitle } from "@/redux/slices/AppSlice";

const CounterpartyPage = () => {
  const params = useParams();

  const dispatch = useAppDispatch();

  const counterparties: BusinessCounterpartyType = useSelector(
    (state: any) => state.business.counterparties
  );

  const pagination: PaginationStateType = useSelector(
    (state: any) => state.business.counterpartyPagination
  );

  useEffect(() => {
    dispatch(setTitle("Business Customer"));
    dispatch(fetchBusiness(parseInt((params.id as string) || "0"))).then(
      (data: any) => {
        if (data.payload != null) {
          dispatch(setTitle(data.payload.name));
        }
      }
    );
    dispatch(
      fetchBusinessCounterparties({
        id: (params.id as string) || "0",
        refresh: true,
      })
    );
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
            dispatch(
              fetchBusinessCounterparties({
                id: (params.id as string) || "0",
                refresh: true,
              })
            );
          }}
        />
      ) : counterparties.length == 0 ? (
        <ErrorPage
          error={"No counterparties found"}
          recoveryButtonTitle="Refresh"
          recoveryButtonOnClick={() => {
            dispatch(
              fetchBusinessCounterparties({
                id: (params.id as string) || "0",
                refresh: true,
              })
            );
          }}
        />
      ) : (
        <CounterpartyTableView
          counterparties={counterparties}
          fetchData={fetchBusinessCounterparties({
            id: (params.id as string) || "0",
          })}
          setPageNumber={(page: number) => {
            dispatch(setBusinessCounterpartyPaginationPageNumber(page));
          }}
          pagination={pagination}
        ></CounterpartyTableView>
      )}
    </Box>
  );
};

export default CounterpartyPage;
