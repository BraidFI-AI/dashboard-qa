"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { CustomerSearch, Individual } from "@/core/api/ApiTypes";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter, useSearchParams } from "next/navigation";
import MyTable from "@/core/components/Table/MyTable";
import { GridEventListener } from "@mui/x-data-grid";
import timestampToDate from "@/core/utils/timestampToDate";
import ErrorPage from "@/core/components/error_page";
import MyLinkText from "@/core/components/Text/LinkText";
import LabelBox from "@/core/components/label_box";
import { enumTextToReadableText } from "@/core/utils/formatting_util";
import { setTitle } from "@/redux/slices/AppSlice";
import {
  fetchIndividualsPaginated,
  setIndividualsPageNumber,
  setIndividualsPageSize,
} from "@/redux/slices/IndividualSlice";
import { paginationPageSize, PaginationStateType } from "@/core/constants";
import CustomerFilters from "@/core/components/customer_filters";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import MyText from "@/core/components/Text/Text";

const IndividualsTable = () => {
  const qParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState<CustomerSearch | null>(null);

  const individuals: "loading" | string | Individual[] = useSelector(
    (state: any) => state.individual.individualsPaginated
  );

  const pagination: PaginationStateType = useSelector(
    (state: any) => state.individual.individualsPagination
  );

  useEffect(() => {
    dispatch(setTitle("Individuals"));

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

    const fetchIndividualsHelper = () => {
      console.log("filters:", params);
      dispatch(fetchIndividualsPaginated({ refresh: true, filters: params }));
    };

    fetchIndividualsHelper();
  }, [dispatch, qParams]);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    router.push(`/individuals/${params.row.id}`);
  };

  return (
    <>
      <div className="pb-2 w-fit">
        <CustomerFilters type={"individuals"} />
      </div>
      {individuals == "loading" ? (
        <MyCircularProgressIndicator />
      ) : typeof individuals == "string" ? (
        <ErrorPage
          error="Error loading individuals"
          recoveryButtonOnClick={() => {
            dispatch(
              fetchIndividualsPaginated({
                refresh: true,
                filters: filters ?? {},
              })
            );
          }}
          recoveryButtonTitle="Retry"
        />
      ) : individuals.length == 0 ? (
        <MyText>No Individuals found</MyText>
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
                dispatch(setIndividualsPageSize(size));
                dispatch(setIndividualsPageNumber(page));
                dispatch(
                  fetchIndividualsPaginated({
                    refresh: false,
                    filters: filters ?? {},
                  })
                );
              },
            }}
            handleRowClick={handleRowClick}
            handleCellClick={(params: any, e: any) => {
              if (params.field === "productName") {
                e.stopPropagation();
              }
            }}
            columns={[
              { field: "id", headerName: "ID", width: 120 },
              {
                field: "name",
                headerName: "Name",
                flex: 1,
                minWidth: 200,
                renderCell: (params: any) => (
                  <div>{params.row.firstName + " " + params.row.lastName}</div>
                ),
                valueGetter: (params: any) =>
                  params.row.firstName + " " + params.row.lastName,
              },
              {
                field: "productName",
                headerName: "Product Name",
                flex: 1,
                minWidth: 160,
                renderCell: (params: any) => (
                  <MyLinkText
                    textProps={{ size: "table" }}
                    link={`/configuration/products/${params.row.productId}`}
                  >
                    {params.row.productName}
                  </MyLinkText>
                ),
                valueGetter: (params: any) =>
                  params.row.firstName + " " + params.row.lastName,
              },
              {
                field: "cipStatus",
                headerName: "CIP Status",
                flex: 1,
                minWidth: 160,
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
                valueGetter: (params: any) => params.row?.cipStatus,
              },
              {
                field: "status",
                headerName: "Status",
                flex: 1,
                minWidth: 120,
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
                valueGetter: (params: any) => params.row?.status,
              },
              {
                field: "createdAt",
                headerName: "Created",
                flex: 1,
                minWidth: 120,
                valueFormatter: (params: any) => {
                  return `${timestampToDate(params.value)}`;
                },
                valueGetter: (params: any) => params.row.createdAt,
              },
              {
                field: "updatedAt",
                headerName: "Modified",
                flex: 1,
                minWidth: 120,
                valueFormatter: (params: any) => {
                  return `${timestampToDate(params.value)}`;
                },
                valueGetter: (params: any) => params.row.updatedAt,
              },
            ]}
            rows={individuals}
            sortModel={[{ field: "createdAt", sort: "desc" }]}
          />
        </div>
      )}
    </>
  );
};

export default IndividualsTable;
