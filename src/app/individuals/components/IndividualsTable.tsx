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
          minWidth: 120,
          maxWidth: 220,
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
          minWidth: 120,
          maxWidth: 220,
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
          minWidth: 120,
          maxWidth: 220,
        },
        { field: "status", headerName: "Status", width: 120 },
        {
          field: "createdAt",
          headerName: "Created",
          width: 120,
          valueFormatter: (params: any) => {
            return `${timestampToDate(params.value)}`;
          },
          valueGetter: (params: any) => params.row.createdAt,
        },
        {
          field: "updatedAt",
          headerName: "Modified",
          width: 120,
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
