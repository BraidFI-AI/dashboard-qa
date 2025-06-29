"use client";

import CircularProgress from "@mui/material/CircularProgress";
import { RulesAndLimits } from "@/core/api/ApiTypes";
import { useEffect, useState } from "react";
import MyText from "@/core/components/Text/Text";
import MyTable from "@/core/components/Table/MyTable";
import { GridEventListener } from "@mui/x-data-grid";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/store/store";
import { AsyncThunkAction } from "@reduxjs/toolkit";
import toDollarFormat from "@/core/utils/toDollarFormat";
import { v4 as uuidv4 } from "uuid";
import { LimitsType } from "@/redux/slices/RulesAndLimitsSlice";
import { useSelector } from "react-redux";
import MyCircularProgressIndicator from "../../circular_progress_indicator";
import { timestampToDate } from "@/core/utils/date_time_util";
type RulesTableViewType = {
  fetchData: any;
  pushTo: string;
};

const RulesTableView: React.FC<RulesTableViewType> = ({
  fetchData,
  pushTo,
}) => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const limits: LimitsType = useSelector((state: any) => state.limits.limits);

  useEffect(() => {
    dispatch(fetchData);
  }, [dispatch, fetchData]);

  const handleRowClick: GridEventListener<"rowClick"> = (p: any) => {
    router.push(`${pushTo}/${p.row.id}`);
  };

  return limits == "loading" ? (
    <MyCircularProgressIndicator />
  ) : typeof limits == "string" ? (
    <MyText>{limits}</MyText>
  ) : (
    <MyTable
      handleRowClick={handleRowClick}
      columns={[
        { field: "id", headerName: "ID", flex: 1, minWidth: 120 },
        {
          field: "limitName",
          headerName: "Limit Name",
          flex: 1,
          minWidth: 120,
        },
        {
          field: "transactionType",
          headerName: "Transaction Type",
          flex: 1,
          minWidth: 140,
        },
        {
          field: "limitType",
          headerName: "Limit Type",
          flex: 1,
          minWidth: 160,
        },
        {
          field: "action",
          headerName: "Action",
          flex: 1,
          minWidth: 120,
        },
        {
          field: "status",
          headerName: "Status",
          flex: 1,
          minWidth: 120,
        },
        {
          field: "amount",
          headerName: "Amount",
          flex: 1,
          minWidth: 120,
          display: "flex",
          renderCell: (params: any) => (
            <div>{toDollarFormat(params.row.amount)}</div>
          ),
          valueGetter: (value: any, row: any) => row.amount,
        },
        {
          field: "createdAt",
          headerName: "Created At",
          flex: 1,
          minWidth: 120,
          valueFormatter: (params: any) => {
            return `${timestampToDate(params)}`;
          },
          valueGetter: (value: any, row: any) => row.createdAt,
        },
      ]}
      filterModel={{
        items: [{ field: "status", operator: "equals", value: "ACTIVE" }],
      }}
      rows={limits}
    />
  );
};

export default RulesTableView;
