"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import {
  GridCellParams,
  GridEventListener,
  MuiEvent,
} from "@mui/x-data-grid-pro";
import { useSelector } from "react-redux";
import { Business, CustomerSearch } from "@/core/api/ApiTypes";
import {
  fetchBusinessesPaginated,
  setBusinessesPageNumber,
  setBusinessesPageSize,
} from "@/redux/slices/BusinessSlice";
import { useRouter, useSearchParams } from "next/navigation";
import MyTable from "@/core/components/Table/MyTable";
import timestampToDate from "@/core/utils/timestampToDate";
import Link from "next/link";
import ErrorPage from "@/core/components/error_page";
import LabelBox from "@/core/components/label_box";
import { enumTextToReadableText } from "@/core/utils/formatting_util";
import { paginationPageSize, PaginationStateType } from "@/core/constants";
import { setTitle } from "@/redux/slices/AppSlice";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import MyText from "@/core/components/Text/Text";
import CustomerFilters from "../../../core/components/customer_filters";

const BusinessesTable = () => {
  const qParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CustomerSearch | null>(null);

  const businesses: "loading" | string | Business[] = useSelector(
    (state: any) => state.business.businessesPaginated
  );

  const pagination: PaginationStateType = useSelector(
    (state: any) => state.business.businessPagination
  );

  const refresh = useSelector((state: any) => state.business.refresh);

  useEffect(() => {
    dispatch(setTitle("Businesses"));

    const params: { [anyProp: string]: string | string[] } = {};

    qParams.forEach((value, key) => {
      if (value.includes(",")) {
        params[key] = value.split(",");
      } else {
        params[key] = value;
      }
    });

    setFilters(params as CustomerSearch);

    console.log("params:", params);

    const fetchBusinessesHelper = () => {
      console.log("filters:", params);
      dispatch(fetchBusinessesPaginated({ refresh: true, filters: params }));
    };

    fetchBusinessesHelper();
  }, [dispatch, refresh, qParams]);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    router.push(`/businesses/${params.row.id}`);
  };

  return (
    <>
      <div className="pb-2 w-fit">
        <CustomerFilters type="businesses" />
      </div>
      {businesses == "loading" ? (
        <MyCircularProgressIndicator />
      ) : typeof businesses == "string" ? (
        <ErrorPage
          error="Error loading businesses"
          recoveryButtonOnClick={() => {
            setLoading(true);
            dispatch(
              fetchBusinessesPaginated({
                refresh: true,
                filters: filters ?? {},
              })
            );
          }}
          recoveryButtonTitle="Retry"
        />
      ) : businesses.length == 0 ? (
        <MyText>No businesses found</MyText>
      ) : (
        <div
          style={{
            height: "calc(100vh - 150px)",
          }}
        >
          <MyTable
            pagination={{
              rowCount: pagination.rowCount,
              loading: pagination.loadingPage,
              paginationModel: {
                page: pagination.pageNumber,
                pageSize: pagination.pageSize ?? paginationPageSize,
              },
              setPaginationModel: (page: number, size: number) => {
                dispatch(setBusinessesPageSize(size));
                dispatch(setBusinessesPageNumber(page));
                dispatch(
                  fetchBusinessesPaginated({
                    refresh: false,
                    filters: filters ?? {},
                  })
                );
              },
            }}
            handleRowClick={handleRowClick}
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
                headerName: "Business ID",
                flex: 1,
                minWidth: 120,
              },
              {
                field: "name",
                headerName: "Business Name",
                flex: 1,
                minWidth: 150,
              },
              {
                field: "productName",
                headerName: "Product Name",
                minWidth: 140,
                flex: 1,
                display: "flex",
                renderCell: (params: any) => (
                  <Link
                    className={`${params.row.productId < 1 ? "hidden" : ""}`}
                    href={`/configuration/products/${params.row.productId}`}
                  >
                    <div className="underline text-[#12A7FF]">
                      {params.row.productName}
                    </div>
                  </Link>
                ),
                valueGetter: (value: any, row: any) => row.productName,
              },
              {
                field: "cipStatus",
                headerName: "CIP status",
                flex: 1,
                minWidth: 120,
                display: "flex",
                renderCell: (params: any) => (
                  <LabelBox
                    color={
                      params.row?.cipStatus == "PASS"
                        ? "green"
                        : params.row?.cipStatus == "FAIL"
                        ? "red"
                        : "gray"
                    }
                    border
                  >
                    {enumTextToReadableText(params.row?.cipStatus)}
                  </LabelBox>
                ),
                valueGetter: (value: any, row: any) => row?.cipStatus,
              },
              {
                field: "status",
                headerName: "Status",
                width: 120,
                display: "flex",
                renderCell: (params: any) => (
                  <LabelBox
                    color={
                      params.row?.status == "ACTIVE"
                        ? "green"
                        : params.row?.status == "BLOCKED"
                        ? "red"
                        : "gray"
                    }
                    fill
                  >
                    {enumTextToReadableText(params.row?.status)}
                  </LabelBox>
                ),
                valueGetter: (value: any, row: any) => row?.status,
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
                field: "updatedAt",
                headerName: "Modified",
                flex: 1,
                minWidth: 120,
                valueFormatter: (params: any) => {
                  return `${timestampToDate(params)}`;
                },
                valueGetter: (value: any, row: any) => row.updatedAt,
              },
            ]}
            rows={businesses}
            sortModel={[{ field: "createdAt", sort: "desc" }]}
          />
        </div>
      )}
    </>
  );
};

export default BusinessesTable;
