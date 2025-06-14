"use client";

import { Fees } from "@/core/api/ApiTypes";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import MyText from "@/core/components/Text/Text";
import MyTable from "@/core/components/Table/MyTable";
import { GridEventListener } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/store/store";
import { fetchFees } from "@/redux/slices/FeeSlice";
import toDollarFormat from "@/core/utils/toDollarFormat";
import ErrorPage from "../../error_page";
import { useSelector } from "react-redux";

type FeeTableViewProps = {
  fetchData: any;
  pushTo: string;
  extraColumn?: any;
};

const FeeTableView: React.FC<FeeTableViewProps> = ({
  fetchData,
  pushTo,
  extraColumn = [],
}) => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const fees = useSelector((state: any) => state.fee.fees);

  const handleRowClick: GridEventListener<"rowClick"> = (p: any) => {
    router.push(`${pushTo}/${p.row.id}`);
  };

  useEffect(() => {
    dispatch(fetchData);
  }, [dispatch, fetchData]);

  return fees == "loading" ? (
    <div className="flex flex-col items-center justify-center pt-10">
      <CircularProgress></CircularProgress>
      <div>Loading Fees...</div>
    </div>
  ) : typeof fees == "string" ? (
    <ErrorPage
      error={fees}
      recoveryButtonOnClick={() => {
        dispatch(fetchData);
      }}
      recoveryButtonTitle="Retry"
    />
  ) : fees.length == 0 ? (
    <MyText>No fee configured</MyText>
  ) : (
    <MyTable
      handleRowClick={handleRowClick}
      customId={(row: Fees) => row.id}
      columns={[
        { field: "id", headerName: "ID", flex: 1, minWidth: 120 },
        ...extraColumn,
        {
          field: "feeType",
          headerName: "Fee Type",
          fflex: 1,
          minWidth: 160,
        },
        {
          field: "tranType",
          headerName: "Transaction Type",
          flex: 1,
          minWidth: 180,
        },
        {
          field: "amount",
          headerName: "Fee amount",
          flex: 1,
          minWidth: 160,
          valueGetter: (value: any, row: any) =>
            row.feeType == "PERCENT" ? row.amount : toDollarFormat(row?.amount),
        },
        {
          field: "feeChargingAccountNumber",
          headerName: "Charging Account",
          flex: 1,
          minWidth: 160,
        },
        {
          field: "settlementAccountNumber",
          headerName: "Settlement Account",
          flex: 1,
          minWidth: 160,
        },
      ]}
      rows={fees}
    />
  );
};

export default FeeTableView;
