"use client";

import { Transaction } from "@/core/api/ApiTypes";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import { setTitle } from "@/redux/slices/AppSlice";

import { useAppDispatch } from "@/redux/store/store";
import { useEffect, useState } from "react";
import TransactionReviewTable from "./transaction_review_table";
import { useSelector } from "react-redux";
import {
  fetchToReviewACHTransactions,
  setLoadingTransactions,
} from "@/redux/slices/transaction_review_slice";
import { useSearchParams } from "next/navigation";

const TransactionReviewPage = () => {
  const qParams = useSearchParams();
  const dispatch = useAppDispatch();

  const [init, setInit] = useState(true);

  const transactions = useSelector(
    (state: any) => state.transactionReview.transactions
  );

  useEffect(() => {
    dispatch(setLoadingTransactions());
    if (init) {
      setInit(false);
    }

    const params: { [anyProp: string]: string | string[] } = {};

    qParams.forEach((value, key) => {
      if (value.includes(",")) {
        params[key] = value.split(",");
      } else {
        params[key] = value;
      }
    });

    dispatch(fetchToReviewACHTransactions({ refresh: true, filter: params }));
  }, [dispatch, init, qParams]);

  return transactions === "loading" || init == true ? (
    <MyCircularProgressIndicator />
  ) : typeof transactions === "string" ? (
    <ErrorPage
      error={transactions}
      recoveryButtonOnClick={() => {
        const params: { [anyProp: string]: string | string[] } = {};

        qParams.forEach((value, key) => {
          if (value.includes(",")) {
            params[key] = value.split(",");
          } else {
            params[key] = value;
          }
        });
        dispatch(
          fetchToReviewACHTransactions({ refresh: true, filter: params })
        );
      }}
      recoveryButtonTitle="Retry"
    />
  ) : (
    <TransactionReviewTable />
  );
};

export default TransactionReviewPage;
