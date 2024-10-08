"use client";

import { fetchProductIdsList } from "@/redux/slices/ProductSlice";
import { useAppDispatch } from "@/redux/store/store";
import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import MyText from "@/core/components/Text/Text";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import { SubmitHandler, useForm } from "react-hook-form";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { Transaction, TransactionSearch } from "@/core/api/ApiTypes";
import { fetchTransactions } from "@/redux/slices/TransactionSlice";
import TransactionFilter from "./components/TransactionFilter";
import TransactionTableView from "@/core/components/views/transactions/transactions_table_view";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";

const Transactions = () => {
  const dispatch = useAppDispatch();
  const qParams = useSearchParams();

  const [submitting, setSubmitting] = useState(true);

  const transactions = useSelector(
    (state: any) => state.transaction.transactions
  );

  const [filters, setFilters] = useState<TransactionSearch | null>(null);

  const [expandTable, toggleExpandTable] = useState<boolean>(false);

  useEffect(() => {
    const params: { [anyProp: string]: string | string[] } = {};

    qParams.forEach((value, key) => {
      if (value.includes(",")) {
        params[key] = value.split(",");
      } else {
        params[key] = value;
      }
    });

    setFilters(params as TransactionSearch);

    console.log("params:", params);

    const fetchTransactionsHelper = () => {
      setSubmitting(true);
      console.log("filters:", params);
      dispatch(
        fetchTransactions({
          criteria: { ...params },
          refresh: true,
        })
      ).then((data: any) => {
        console.log(data.payload);
        setSubmitting(false);
      });
    };

    fetchTransactionsHelper();
  }, [dispatch, qParams]);

  return (
    <div className="h-full flex flex-col">
      <div className="pb-2 w-fit">
        <TransactionFilter />
      </div>
      {transactions == "loading" ? (
        <MyCircularProgressIndicator />
      ) : typeof transactions == "string" ? (
        <>
          {submitting ? (
            <CircularProgress />
          ) : (
            <ErrorPage
              error={transactions}
              recoveryButtonOnClick={() => {
                const params: { [anyProp: string]: string } = {};

                qParams.forEach((value, key) => {
                  params[key] = value;
                });

                setFilters(params as TransactionSearch);

                console.log("params:", params);

                const fetchTransactionsHelper = () => {
                  setSubmitting(true);
                  console.log("filters:", params);
                  dispatch(
                    fetchTransactions({
                      criteria: { ...params },
                      refresh: true,
                    })
                  ).then((data: any) => {
                    console.log(data.payload);
                    setSubmitting(false);
                  });
                };

                fetchTransactionsHelper();
              }}
              recoveryButtonTitle="Retry"
            />
          )}
        </>
      ) : transactions.length == 0 ? (
        <MyText size="md">No trasactions found</MyText>
      ) : (
        <TransactionTableView
          filters={filters}
          transactions={transactions}
          expandTable={expandTable}
          toggleExpandTable={toggleExpandTable}
        />
      )}
    </div>
  );
};

export default Transactions;
