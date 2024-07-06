"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { GridEventListener, GridValueFormatterParams } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { Card } from "@/core/api/ApiTypes";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchCards } from "@/redux/slices/CardManagementSlice";
import MyTable from "@/core/components/Table/MyTable";
import { useRouter } from "next/navigation";
import moment, { Moment } from "moment";

const CardsTable = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const cards: Card[] | null = useSelector(
    (state: any) => state.cardManagement.cards
  );

  useEffect(() => {
    dispatch(fetchCards()).then(() => {
      setLoading(false);
    });
  }, [dispatch]);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    router.push(`/configuration/cardmanagement/${params.row.id}`);
  };

  return (
    <>
      {!loading && cards != null ? (
        <MyTable
          handleRowClick={handleRowClick}
          columns={[
            { field: "id", headerName: "ID", width: 120 },
            { field: "productId", headerName: "Product ID", width: 120 },
            {
              field: "name",
              headerName: "Name",
              flex: 1,
              minWidth: 120,
              maxWidth: 220,
            },
            {
              field: "bin",
              headerName: "Bin",
              flex: 1,
              minWidth: 120,
              maxWidth: 220,
            },
            {
              field: "startDate",
              headerName: "Start Date",
              width: 120,
              valueGetter(params: any) {
                if (!params.value) {
                  return params.value;
                }

                const date = moment(
                  params.value[0].toString() +
                    "-" +
                    params.value[1].toString() +
                    "-" +
                    params.value[2].toString()
                );

                return date;
              },
              valueFormatter: (params: GridValueFormatterParams<Moment>) => {
                if (params.value == null) {
                  return "";
                }

                return `${
                  params.value.year() +
                  "-" +
                  (params.value.month() + 1) +
                  "-" +
                  params.value.date()
                }`;
              },
            },
            {
              field: "endDate",
              headerName: "End Date",
              width: 120,
              valueGetter(params: any) {
                if (!params.value) {
                  return params.value;
                }

                const date = moment(
                  params.value[0].toString() +
                    "-" +
                    params.value[1].toString() +
                    "-" +
                    params.value[2].toString()
                );

                return date;
              },
              valueFormatter: (params: GridValueFormatterParams<Moment>) => {
                if (params.value == null) {
                  return "";
                }
                return `${
                  params.value.year() +
                  "-" +
                  (params.value.month() + 1) +
                  "-" +
                  params.value.date()
                }`;
              },
            },
            { field: "active", headerName: "Active", width: 120 },
          ]}
          rows={cards}
        />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <CircularProgress></CircularProgress>
          <div>Loading cards...</div>
        </div>
      )}
    </>
  );
};

export default CardsTable;
