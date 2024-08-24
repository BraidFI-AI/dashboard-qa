"use client";

import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyText from "@/core/components/Text/Text";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import TransactionTableView from "@/core/components/views/transactions/transactions_table_view";
import {
  AccountTransactionsType,
  fetchAccount,
  // fetchAccountTransactionsData,
} from "@/redux/slices/AccountSlice";
import { setTitle } from "@/redux/slices/AppSlice";
import {
  fetchTransactions,
  setLoadingTransactions,
} from "@/redux/slices/TransactionSlice";
import { useAppDispatch } from "@/redux/store/store";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AccountTransactionsPage = () => {
  const params = useParams();

  const dispatch = useAppDispatch();

  const [init, setInit] = useState(true);

  const transactions = useSelector(
    (state: any) => state.transaction.transactions
  );

  useEffect(() => {
    dispatch(setTitle("Account"));
    dispatch(fetchAccount(params.id.toString())).then((account: any) => {
      if (
        typeof account.payload != "string" &&
        account.payload.accountName != null
      ) {
        dispatch(setTitle(account.payload.accountName));
      }
    });
  }, []);

  useEffect(() => {
    dispatch(setLoadingTransactions());
    if (init) {
      setInit(false);
    }
    dispatch(
      fetchTransactions({
        criteria: { accountNumber: params.id.toString() },
        refresh: true,
      })
    );
  }, [dispatch, params.id, init]);

  return transactions == "loading" || init == true ? (
    <MyCircularProgressIndicator />
  ) : typeof transactions == "string" ? (
    <>
      <ErrorPage
        error={transactions}
        recoveryButtonOnClick={() => {
          dispatch(
            fetchTransactions({
              criteria: { accountNumber: params.id.toString() },
              refresh: true,
            })
          );
        }}
        recoveryButtonTitle="Retry"
      />
    </>
  ) : transactions.length == 0 ? (
    <MyText size="md">No trasactions found</MyText>
  ) : (
    <div style={{ height: "76vh" }}>
      <TransactionTableView
        transactions={transactions}
        filters={{ accountNumber: params.id.toString() }}
      />
    </div>
  );
};

export default AccountTransactionsPage;
