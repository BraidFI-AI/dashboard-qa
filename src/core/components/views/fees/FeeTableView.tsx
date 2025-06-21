"use client";

import { Fees, FeeSearch } from "@/core/api/ApiTypes";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import MyText from "@/core/components/Text/Text";
import MyTable from "@/core/components/Table/MyTable";
import { GridEventListener } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/store/store";
import toDollarFormat from "@/core/utils/toDollarFormat";
import ErrorPage from "../../error_page";
import { useSelector } from "react-redux";
import { paginationPageSize, PaginationStateType } from "@/core/constants";
import {
  feeSearch,
  setFeePaginationPageSize,
  setFeePaginationPageNumber,
} from "@/redux/slices/FeeSlice";
import LabelBox from "../../label_box";

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

  const pagination: PaginationStateType = useSelector(
    (state: any) => state.fee.pagination
  );

  const criteria: FeeSearch = useSelector((state: any) => state.fee.search);

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
      pagination={{
        rowCount: pagination.rowCount,
        loading: pagination.loadingPage,
        paginationModel: {
          page: pagination.pageNumber,
          pageSize: pagination.pageSize ?? paginationPageSize,
        },
        setPaginationModel: (page: number, size: number) => {
          dispatch(setFeePaginationPageSize(size));
          dispatch(setFeePaginationPageNumber(page));
          dispatch(
            feeSearch({
              search: criteria,
              refresh: false,
            })
          );
        },
      }}
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
          field: "transactionTypes",
          headerName: "Transaction Types",
          flex: 1,
          display: "flex",
          minWidth: 220,
          renderCell: (params: any) => {
            return (
              <div className="flex flex-row gap-2 overflow-x-auto max-w-full scrollbar-hide">
                {params.row.transactionTypes?.map((type: any) => (
                  <LabelBox key={type} color="gray" fill>
                    {type}
                  </LabelBox>
                ))}
              </div>
            );
          },
        },
        {
          field: "transactionGroups",
          headerName: "Transaction Groups",
          flex: 1,
          display: "flex",
          minWidth: 220,
          renderCell: (params: any) => {
            return (
              <div className="flex flex-row gap-2 overflow-x-auto max-w-full scrollbar-hide">
                {params.row.transactionGroups?.map((group: any) => (
                  <LabelBox key={group} color="gray" fill>
                    {group}
                  </LabelBox>
                ))}
              </div>
            );
          },
        },
        {
          field: "amount",
          headerName: "Fee amount",
          flex: 1,
          minWidth: 160,
          valueGetter: (value: any, row: any) =>
            row.amount == null
              ? "Tiered"
              : row.feeType == "PERCENT"
              ? row.amount
              : toDollarFormat(row?.amount),
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
