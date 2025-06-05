"use client";

import Box from "@mui/material/Box";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppDispatch } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import {
  IndividualCounterpartyType,
  fetchIndividual,
  fetchIndividualCounterparties,
  setIndividualCounterpartyPaginationPageNumber,
} from "@/redux/slices/IndividualSlice";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import CounterpartyTableView from "@/core/components/views/counterparty/counterparty_table_view";
import { PaginationStateType } from "@/core/constants";
import { setTitle } from "@/redux/slices/AppSlice";

const CounterpartyPage = () => {
  const params = useParams();

  const dispatch = useAppDispatch();

  const counterparties: IndividualCounterpartyType = useSelector(
    (state: any) => state.individual.counterparties
  );

  const pagination: PaginationStateType = useSelector(
    (state: any) => state.individual.counterpartyPagination
  );

  useEffect(() => {
    dispatch(fetchIndividual(parseInt((params.id as string) || "0"))).then(
      (data: any) => {
        if (data.payload != null) {
          dispatch(
            setTitle(data.payload.firstName + " " + data.payload.lastName)
          );
        }
      }
    );
    dispatch(
      fetchIndividualCounterparties({
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
              fetchIndividualCounterparties({
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
              fetchIndividualCounterparties({
                id: (params.id as string) || "0",
                refresh: true,
              })
            );
          }}
        />
      ) : (
        <CounterpartyTableView
          counterparties={counterparties}
          fetchData={fetchIndividualCounterparties({
            id: (params.id as string) || "0",
          })}
          setPageNumber={(page: number) => {
            dispatch(setIndividualCounterpartyPaginationPageNumber(page));
          }}
          pagination={pagination}
        ></CounterpartyTableView>
      )}
    </Box>
  );
};

export default CounterpartyPage;
