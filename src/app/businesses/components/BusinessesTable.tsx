"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { GridCellParams, GridEventListener, MuiEvent } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { Business } from "@/core/api/ApiTypes";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchBusinesses, setRefresh } from "@/redux/slices/BusinessSlice";
import { useRouter } from "next/navigation";
import MyTable from "@/core/components/Table/MyTable";
import timestampToDate from "@/core/utils/timestampToDate";
import Link from "next/link";
import ErrorPage from "@/core/components/error_page";

const BusinessesTable = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const businesses: Business[] | null = useSelector(
    (state: any) => state.business.businesses
  );

  const refresh = useSelector((state: any) => state.business.refresh);

  useEffect(() => {
    dispatch(fetchBusinesses()).then(() => {
      setLoading(false);
    });
  }, [dispatch, refresh]);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    router.push(`/businesses/${params.row.id}`);
  };

  return (
    <>
      {!loading && businesses != null ? (
        <MyTable
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
              width: 120,
            },
            {
              field: "name",
              headerName: "Business Name",
              flex: 2,
              minWidth: 120,
              maxWidth: 220,
            },
            {
              field: "productName",
              headerName: "Product Name",
              minWidth: 140,
              maxWidth: 160,
              flex: 1,
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
              valueGetter: (params: any) => params.row.productName,
            },
            {
              field: "customerVerified",
              headerName: "Verified",
              minWidth: 120,
              maxWidth: 200,
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
          rows={businesses}
          sortModel={[{ field: "createdAt", sort: "desc" }]}
        />
      ) : !loading && businesses == null ? (
        <ErrorPage
          error="Error loading businesses"
          recoveryButtonOnClick={() => {
            setLoading(true);
            dispatch(fetchBusinesses()).then(() => {
              setLoading(false);
            });
          }}
          recoveryButtonTitle="Retry"
        />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <CircularProgress></CircularProgress>
          <div>Loading businesses...</div>
        </div>
      )}
    </>
  );
};

export default BusinessesTable;
