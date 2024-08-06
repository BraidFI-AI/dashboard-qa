"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { GridEventListener } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams, useRouter } from "next/navigation";
import MyTable from "@/core/components/Table/MyTable";
import { Counterparty } from "@/core/api/ApiTypes";
import MyText from "@/core/components/Text/Text";
import Link from "next/link";
import { PaginationStateType, paginationPageSize } from "@/core/constants";

interface CounterpartyTableViewProps {
  counterparties: Counterparty[];
  pagination: PaginationStateType;
  fetchData: any;
  setPageNumber: any;
}

const CounterpartyTableView: React.FC<CounterpartyTableViewProps> = ({
  counterparties,
  fetchData,
  setPageNumber,
  pagination,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    router.push(`counterparties/${params.row.id}`);
  };

  return (
    <div style={{ height: "67vh" }}>
      <MyTable
        pagination={{
          rowCount: pagination.rowCount,
          loading: pagination.loadingPage,
          paginationModel: {
            page: pagination.pageNumber,
            pageSize: paginationPageSize,
          },
          setPaginationModel: (page: number) => {
            setPageNumber(page);
            dispatch(fetchData);
          },
        }}
        handleRowClick={handleRowClick}
        columns={[
          { field: "id", headerName: "ID", flex: 1, minWidth: 120 },
          {
            field: "name",
            headerName: "Name",
            flex: 1,
            minWidth: 180,
          },
          {
            field: "email",
            headerName: "Email",
            flex: 1,
            minWidth: 200,
          },
          {
            field: "phone",
            headerName: "Phone number",
            flex: 1,
            minWidth: 200,
          },
          {
            field: "type",
            headerName: "Type",
            flex: 1,
            minWidth: 200,
          },
          { field: "status", headerName: "Status", flex: 1, minWidth: 120 },
        ]}
        rows={counterparties}
      />
    </div>
  );
};

export default CounterpartyTableView;
