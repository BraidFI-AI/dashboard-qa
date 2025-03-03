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

export default function TransactionHistoryPage() {
  const params = useParams();

  const dispatch = useAppDispatch();

  const columnRef = useRef<HTMLDivElement>(null);
  const [columnHeight, setColumnHeight] = useState<number | null>(null);

  const [transaction, setTransaction] = useState<
    "loading" | "not_found" | Transaction
  >("loading");

  useEffect(() => {
    dispatch(setTitle("Transaction Details"));

    dispatch(
      fetchTransactions({
        criteria: {
          paymentId: params.id.toString() ?? "",
        },
      })
    ).then((data: any) => {
      if (typeof data.payload == "string") {
        setTransaction(data.payload);
      } else if (data.payload?.transactions?.length > 0) {
        setTransaction(data.payload.transactions[0]);
      } else {
        setTransaction("not_found");
      }
    });
  }, [dispatch, params]);

  const calculateHeight = useCallback(() => {
    const column = columnRef.current;
    if (!column) return null;

    // Calculate total height of children, accounting for margin/padding
    const children = Array.from(column.children);
    const totalHeight = children.reduce((sum, child) => {
      // Use getBoundingClientRect to get precise height including margins
      const rect = child.getBoundingClientRect();
      return sum + rect.height;
    }, 0);

    return totalHeight;
  }, []);

  useEffect(() => {
    const column = columnRef.current;
    if (!column) return;

    // Create a ResizeObserver to track height changes
    const resizeObserver = new ResizeObserver(() => {
      const newHeight = calculateHeight();
      setColumnHeight(newHeight);
    });

    // Observe each child to capture height changes in nested components
    const children = Array.from(column.children);
    children.forEach((child) => resizeObserver.observe(child));

    // Initial height calculation
    const initialHeight = calculateHeight();
    setColumnHeight(initialHeight);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, [calculateHeight, transaction]);

  return (
    <div>
      {transaction == "loading" ? (
        <MyCircularProgressIndicator />
      ) : transaction == "not_found" ? (
        <div>Transaction not found</div>
      ) : typeof transaction == "string" ? (
        <ErrorPage
          error={transaction}
          recoveryButtonTitle="Retry"
          recoveryButtonOnClick={() => {
            dispatch(
              fetchTransactions({
                criteria: {
                  paymentId: params.id.toString() ?? "",
                },
              })
            ).then((data: any) => {
              if (typeof data.payload == "string") {
                setTransaction(data.payload);
              } else if (data.payload?.transactions?.length > 0) {
                setTransaction(data.payload.transactions[0]);
              } else {
                setTransaction("not_found");
              }
            });
          }}
        />
      ) : (
        <div className={`${SCROLLBAR_STYLE}`}>
          <div className="min-w-[1026px] flex flex-row">
            <div ref={columnRef} className="w-full">
              <TransactionDetails transaction={transaction} />
            </div>
            <div className="min-w-[10px]" />
            <div
              style={{
                height: columnHeight ? `${columnHeight}px` : "auto",
                maxHeight: columnHeight ? `${columnHeight}px` : "none",
              }}
            >
              <TransactionTimeline transaction={transaction} />
            </div>
          </div>
          {transaction.ach != null && (
            <>
              <div className="h-[20px]" />
              <AchDetails transaction={transaction} />
            </>
          )}
          {transaction.wire != null && (
            <>
              <div className="h-[20px]" />
              <WireDetails transaction={transaction} />
            </>
          )}
          <div className="h-[20px]" />
        </div>
      )}
    </div>
  );
}
