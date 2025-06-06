"use client";

import { Transaction } from "@/core/api/ApiTypes";
import { setTitle } from "@/redux/slices/AppSlice";
import { fetchTransactions } from "@/redux/slices/TransactionSlice";
import { useAppDispatch } from "@/redux/store/store";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import TransactionDetails from "./components/transaction_details";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import { SCROLLBAR_STYLE } from "@/core/constants";
import { TransactionTimeline } from "./components/transaction_timeline";
import AchDetails from "./components/ach_details";
import WireDetails from "./components/wire_details";
import { useSelector } from "react-redux";
import TransferDetails from "./components/transfer_details";

export default function TransactionHistoryPage() {
  const params = useParams();

  const dispatch = useAppDispatch();

  const columnRef = useRef<HTMLDivElement>(null);
  const [columnHeight, setColumnHeight] = useState<number | null>(null);

  const transactions: "loading" | string | Transaction[] = useSelector(
    (state: any) => state.transaction.transactions
  );

  useEffect(() => {
    dispatch(setTitle("Transaction Details"));

    dispatch(
      fetchTransactions({
        criteria: {
          paymentId: (params.id as string) || "0",
        },
      })
    );
  }, [dispatch, params]);

  return (
    <div>
      {transactions == "loading" ? (
        <MyCircularProgressIndicator />
      ) : typeof transactions == "string" ? (
        <ErrorPage
          error={transactions}
          recoveryButtonTitle="Retry"
          recoveryButtonOnClick={() => {
            dispatch(
              fetchTransactions({
                criteria: {
                  paymentId: (params.id as string) || "0",
                },
              })
            );
          }}
        />
      ) : transactions?.length == 0 ? (
        <div>Transaction not found</div>
      ) : (
        <div className={`${SCROLLBAR_STYLE}`}>
          <div className="min-w-[1026px] flex flex-row">
            <div className="w-full">
              <div>
                <TransactionDetails transaction={transactions?.[0]} />
              </div>
              {(transactions?.[0] as any).transfer != null && (
                <>
                  <div className="h-[10px]" />
                  <TransferDetails transaction={transactions?.[0]} />
                </>
              )}
              {transactions?.[0]?.ach != null && (
                <>
                  <div className="h-[10px]" />
                  <AchDetails transaction={transactions?.[0]} />
                </>
              )}
              {transactions?.[0]?.wire != null && (
                <>
                  <div className="h-[10px]" />
                  <WireDetails transaction={transactions?.[0]} />
                </>
              )}
            </div>
            <div className="pr-[10px]" />
            <div>
              <TransactionTimeline transaction={transactions?.[0]} />
            </div>
          </div>
          <div className="h-[20px]" />
        </div>
      )}
    </div>
  );
}
