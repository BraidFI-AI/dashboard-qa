"use client";

import { ACHTransactionStatus } from "@/core/api/ApiTypes";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import MyTable from "@/core/components/Table/MyTable";
import {
  fetchACHFileErrors,
  fetchACHTransactionStatus,
} from "@/redux/slices/ach_processing_slice";
import { setTitle } from "@/redux/slices/AppSlice";
import { useAppDispatch } from "@/redux/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const ACHTransactionStatusPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [transactions, setTtransactions] = useState<
    "loading" | string | ACHTransactionStatus[]
  >("loading");

  useEffect(() => {
    dispatch(setTitle("Transactions Status"));
    dispatch(fetchACHTransactionStatus()).then((res: any) => {
      setTtransactions(res.payload);
    });
  }, []);

  return transactions == "loading" ? (
    <MyCircularProgressIndicator />
  ) : typeof transactions == "string" ? (
    <ErrorPage
      error={transactions}
      recoveryButtonTitle="Retry"
      recoveryButtonOnClick={() => {}}
    />
  ) : (
    <div style={{ height: "67vh" }}>
      <MyTable
        handleRowClick={(params: any) => {
          router.push(
            `/ach/processing/achFileErrors?filename=${params.row.fileName}`
          );
        }}
        customId={(row: any) => uuidv4()}
        columns={[
          {
            field: "fileName",
            headerName: "File Name",
            flex: 1,
            minWidth: 200,
          },
          {
            field: "processingDate",
            headerName: "Processing Date",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "errorTransactions",
            headerName: "Error Transactions",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "pendingTransactions",
            headerName: "Pending Transactions",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "offsetTransactions",
            headerName: "Offset Transactions",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "postedTransactions",
            headerName: "Posted Transactions",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "rejectedTransactions",
            headerName: "Rejected Transactions",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "manualReviewTransactions",
            headerName: "Manual Review Transactions",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "duplicateTransactions",
            headerName: "Duplicate Transactions",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "totalTransactions",
            headerName: "Total Transactions",
            flex: 1,
            minWidth: 120,
          },
        ]}
        rows={transactions}
      />
    </div>
  );
};

export default ACHTransactionStatusPage;
