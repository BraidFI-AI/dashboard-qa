"use client";

import { setTitle } from "@/redux/slices/AppSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import MyText from "@/core/components/Text/Text";
import TransferTransaction from "./components/transfer_transaction";
import AdjustmentTransaction from "./components/adjustment_transaction";
import { ADMIN_OPS_ROLE, ADMIN_ROLE } from "@/core/constants";
import WireTransaction from "./components/wire_transaction";

enum TransactionTypes {
  ADJUSTMENT = "Adjustment",
  TRANSFER = "Transfer",
  WIRE = "Wire",
  ACH = "ACH",
}

export default function NewTransaction() {
  const dispatch = useDispatch();
  const [transactionType, setTransactionType] = useState(TransactionTypes.WIRE);

  const userType = useSelector((state: any) => state.app.userType);

  useEffect(() => {
    dispatch(setTitle("New Transaction"));
  }, [dispatch]);

  return (
    <div className="p-4">
      <div className="pb-8">
        <MyText>Select Transaction Type</MyText>
        <div className="flex flex-row gap-4 pt-2">
          {(userType == ADMIN_ROLE || userType == ADMIN_OPS_ROLE) && (
            <div
              className={`cursor-pointer p-2 border rounded-md ${
                transactionType === TransactionTypes.ADJUSTMENT
                  ? "border-[#12A7FF] bg-blue-50"
                  : "border-gray-300"
              }`}
              onClick={() => setTransactionType(TransactionTypes.ADJUSTMENT)}
            >
              <MyText>Adjustment</MyText>
            </div>
          )}
          <div
            className={`cursor-pointer p-2 border rounded-md ${
              transactionType === TransactionTypes.TRANSFER
                ? "border-[#12A7FF] bg-blue-50"
                : "border-gray-300"
            }`}
            onClick={() => setTransactionType(TransactionTypes.TRANSFER)}
          >
            <MyText>Transfer</MyText>
          </div>
          <div
            className={`cursor-default p-2 border rounded-md ${
              transactionType === TransactionTypes.WIRE
                ? "border-[#12A7FF] bg-blue-50"
                : "border-gray-400"
            }`}
            onClick={() => setTransactionType(TransactionTypes.WIRE)}
          >
            <MyText>Wire</MyText>
          </div>
          <div
            className={`cursor-default p-2 border rounded-md ${
              transactionType === TransactionTypes.ACH
                ? "border-[#12A7FF] bg-blue-50"
                : "border-gray-400 bg-gray-300"
            }`}
            // onClick={() => setTransactionType(TransactionTypes.ACH)}
          >
            <MyText>ACH</MyText>
          </div>
        </div>
      </div>
      {transactionType === TransactionTypes.ADJUSTMENT && (
        <AdjustmentTransaction />
      )}
      {transactionType === TransactionTypes.TRANSFER && <TransferTransaction />}
      {transactionType === TransactionTypes.WIRE && <WireTransaction />}
    </div>
  );
}
