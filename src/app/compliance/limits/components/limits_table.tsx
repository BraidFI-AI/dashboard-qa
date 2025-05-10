"use client";

import { useAppDispatch } from "@/redux/store/store";
import {
  fetchVelocityLimits,
  setLimitsPageSize,
  setLimitsPageNumber,
} from "@/redux/slices/velocity_limit_slice";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { paginationPageSize, PaginationStateType } from "@/core/constants";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import { GridCellParams, GridRowParams } from "@mui/x-data-grid";
import { MuiEvent } from "@mui/x-data-grid";
import MyTable from "@/core/components/Table/MyTable";
import timestampToDate from "@/core/utils/timestampToDate";
import { VelocityLimit, VelocityLimitFilters } from "@/core/api/ApiTypes";
import { setTitle } from "@/redux/slices/AppSlice";
import { useSearchParams } from "next/navigation";
import LimitDetails from "./limit_details";

const LimitsTable = () => {
  const qParams = useSearchParams();
  const dispatch = useAppDispatch();

  const [filters, setFilters] = useState<VelocityLimitFilters>({});

  const [selectedLimit, setSelectedLimit] = useState<VelocityLimit | null>(
    null
  );

  const limits: "loading" | string | VelocityLimit[] = useSelector(
    (state: any) => state.velocityLimit.limits
  );

  const pagination: PaginationStateType = useSelector(
    (state: any) => state.velocityLimit.limitsPagination
  );

  useEffect(() => {
    dispatch(setTitle("Velocity Limits"));
  }, [dispatch]);

  useEffect(() => {
    const params: { [anyProp: string]: string | string[] } = {};

    qParams.forEach((value, key) => {
      if (value.includes(",")) {
        params[key] = value.split(",");
      } else {
        params[key] = value;
      }
    });

    setFilters(params as VelocityLimitFilters);

    const fetchLimitsHelper = () => {
      dispatch(
        fetchVelocityLimits({
          filters: { ...params },
          refresh: true,
        })
      );
    };

    fetchLimitsHelper();
  }, [dispatch, qParams]);

  return limits == "loading" ? (
    <MyCircularProgressIndicator />
  ) : typeof limits == "string" ? (
    <ErrorPage
      error={limits}
      recoveryButtonOnClick={() => {
        dispatch(fetchVelocityLimits({ refresh: true, filters: filters }));
      }}
      recoveryButtonTitle="Retry"
    />
  ) : (
    <>
      {selectedLimit && (
        <LimitDetails
          limit={selectedLimit}
          filters={filters}
          modalOpen={selectedLimit != null}
          handleModalClose={() => {
            setSelectedLimit(null);
          }}
        />
      )}
      <MyTable
        rows={limits}
        pagination={{
          rowCount: pagination.rowCount,
          loading: pagination.loadingPage,
          paginationModel: {
            page: pagination.pageNumber,
            pageSize: pagination.pageSize ?? paginationPageSize,
          },
          setPaginationModel: (page: number, size: number) => {
            dispatch(setLimitsPageSize(size));
            dispatch(setLimitsPageNumber(page));
            dispatch(
              fetchVelocityLimits({
                refresh: false,
                filters: filters,
              })
            );
          },
        }}
        handleRowClick={(params: GridRowParams) => {
          setSelectedLimit(params.row as VelocityLimit);
        }}
        handleCellClick={(
          params: GridCellParams,
          event: MuiEvent<React.MouseEvent>
        ) => {
          if (params.field == "productName") {
            event.stopPropagation();
          }
        }}
        columns={[
          {
            field: "id",
            headerName: "Limit ID",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "createdAt",
            headerName: "Created",
            flex: 1,
            minWidth: 120,
            valueFormatter: (params: any) => {
              return `${timestampToDate(params)}`;
            },
            valueGetter: (value: any, row: any) => row.createdAt,
          },
          {
            field: "limitName",
            headerName: "Limit Name",
            flex: 1,
            minWidth: 120,
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
            field: "associatedEntity",
            headerName: "Associated Entity",
            flex: 1,
            minWidth: 120,
            valueFormatter: (params: any, row: any) => {
              return (row as any).programId != null
                ? "Program"
                : (row as any).productId != null
                ? "Product"
                : (row as any).accountNumber != null
                ? "Account"
                : (row as any).counterpartyId != null
                ? "Counterparty"
                : "Global";
            },
            valueGetter: (value: any, row: any) =>
              (row as any).programId != null
                ? "Program"
                : (row as any).productId != null
                ? "Product"
                : (row as any).accountNumber != null
                ? "Account"
                : (row as any).counterpartyId != null
                ? "Counterparty"
                : "Global",
          },
          {
            field: "associatedEntityId",
            headerName: "Associated Entity ID",
            flex: 1,
            minWidth: 120,
            valueFormatter: (params: any, row: any) => {
              return (row as any).programId != null
                ? (row as any).programId
                : (row as any).productId != null
                ? (row as any).productId
                : (row as any).accountNumber != null
                ? (row as any).accountNumber
                : (row as any).counterpartyId != null
                ? (row as any).counterpartyId
                : "";
            },
            valueGetter: (value: any, row: any) =>
              (row as any).programId != null
                ? (row as any).programId
                : (row as any).productId != null
                ? (row as any).productId
                : (row as any).accountNumber != null
                ? (row as any).accountNumber
                : (row as any).counterpartyId != null
                ? (row as any).counterpartyId
                : "",
          },
        ]}
      />
    </>
  );
};

export default LimitsTable;
