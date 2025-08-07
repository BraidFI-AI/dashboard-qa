"use client";

import Box from "@mui/material/Box";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { useAppDispatch } from "@/redux/store/store";
import { useEffect } from "react";
import {
  ProductCounterpartyType,
  fetchProductCounterparties,
  setProductCounterpartyPaginationPageNumber,
} from "@/redux/slices/ProductSlice";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import CounterpartyTableView from "@/core/components/views/counterparty/counterparty_table_view";
import { PaginationStateType } from "@/core/constants";

const CounterpartyPage = () => {
  const params = useParams();

  const dispatch = useAppDispatch();

  const counterparties: ProductCounterpartyType = useSelector(
    (state: any) => state.product.counterparties
  );

  const pagination: PaginationStateType = useSelector(
    (state: any) => state.product.counterpartyPagination
  );

  useEffect(() => {
    dispatch(
      fetchProductCounterparties({
        id: (params.id as string) || "0",
        refresh: true,
      })
    );
  }, [dispatch, params.id]);

  return (
    <Box className="pt-6">
      {counterparties == "loading" ? (
        <MyCircularProgressIndicator />
      ) : typeof counterparties == "string" ? (
        <ErrorPage
          error={counterparties}
          recoveryButtonTitle="Retry"
          recoveryButtonOnClick={() => {
            fetchProductCounterparties({
              id: (params.id as string) || "0",
              refresh: true,
            });
          }}
        />
      ) : counterparties.length == 0 ? (
        <ErrorPage
          error={"No counterparties found"}
          recoveryButtonTitle="Refresh"
          recoveryButtonOnClick={() => {
            fetchProductCounterparties({
              id: (params.id as string) || "0",
              refresh: true,
            });
          }}
        />
      ) : (
        <div style={{ height: "78vh" }}>
          <CounterpartyTableView
            counterparties={counterparties}
            fetchData={fetchProductCounterparties({
              id: (params.id as string) || "0",
            })}
            setPageNumber={(page: number) => {
              dispatch(setProductCounterpartyPaginationPageNumber(page));
            }}
            pagination={pagination}
          ></CounterpartyTableView>
        </div>
      )}
    </Box>
  );
};

export default CounterpartyPage;
