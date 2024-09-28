"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { Individual } from "@/core/api/ApiTypes";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchIndividuals } from "@/redux/slices/IndividualSlice";
import { useRouter } from "next/navigation";
import MyTable from "@/core/components/Table/MyTable";
import { GridEventListener } from "@mui/x-data-grid";
import timestampToDate from "@/core/utils/timestampToDate";
import ErrorPage from "@/core/components/error_page";
import MyLinkText from "@/core/components/Text/LinkText";
import LabelBox from "@/core/components/label_box";
import { enumTextToReadableText } from "@/core/utils/formatting_util";

const IndividualsTable = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const individuals: Individual[] | null = useSelector(
    (state: any) => state.individual.individuals
  );

  useEffect(() => {
    dispatch(fetchIndividuals()).then(() => {
      setLoading(false);
    });
  }, [dispatch]);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    router.push(`/individuals/${params.row.id}`);
  };

  return loading ? (
    <div className="flex flex-col items-center justify-center">
      <CircularProgress></CircularProgress>
      <div>Loading individuals...</div>
    </div>
  ) : individuals === null ? (
    <ErrorPage
      error="Error loading individuals"
      recoveryButtonTitle="Retry"
      recoveryButtonOnClick={() => {
        setLoading(true);
        dispatch(fetchIndividuals()).then(() => {
          setLoading(false);
        });
      }}
    />
  ) : (
    <MyTable
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
  );
};

export default IndividualsTable;
