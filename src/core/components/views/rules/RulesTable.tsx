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
import timestampToDate from "@/core/utils/timestampToDate";

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
        { field: "id", headerName: "ID", width: 80 },
        {
          field: "limitName",
          headerName: "Limit Name",
          flex: 1,
          minWidth: 120,
        },
        {
          field: "transactionType",
          headerName: "Transaction Type",
          flex: 2,
          minWidth: 140,
        },
        {
          field: "limitType",
          headerName: "Limit Type",
          flex: 2,
          minWidth: 160,
        },
        {
          field: "action",
          headerName: "Action",
          width: 100,
        },
        {
          field: "status",
          headerName: "Status",
          width: 120,
        },
        {
          field: "amount",
          headerName: "Amount",
          width: 100,
          renderCell: (params: any) => (
            <div>{toDollarFormat(params.row.amount)}</div>
          ),
          valueGetter: (params: any) => params.row.amount,
        },
        {
          field: "createdAt",
          headerName: "Created At",
          minWidth: 120,
          valueFormatter: (params: any) => {
            return `${timestampToDate(params.value)}`;
          },
          valueGetter: (params: any) => params.row.createdAt,
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
