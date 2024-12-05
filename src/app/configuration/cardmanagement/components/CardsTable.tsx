"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { GridEventListener } from "@mui/x-data-grid";
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
              minWidth: 160,
            },
            {
              field: "bin",
              headerName: "Bin",
              flex: 1,
              minWidth: 160,
            },
            {
              field: "startDate",
              headerName: "Start Date",
              flex: 1,
              minWidth: 120,
              valueGetter(value: any, row: any) {
                if (!value) {
                  return value;
                }

                const date = moment(
                  value[0].toString() +
                    "-" +
                    value[1].toString() +
                    "-" +
                    value[2].toString()
                );

                return date;
              },
              valueFormatter: (params: Moment) => {
                if (params == null) {
                  return "";
                }

                return `${
                  params.year() +
                  "-" +
                  (params.month() + 1) +
                  "-" +
                  params.date()
                }`;
              },
            },
            {
              field: "endDate",
              headerName: "End Date",
              flex: 1,
              minWidth: 120,
              valueGetter(value: any, row: any) {
                if (!value) {
                  return value;
                }

                const date = moment(
                  value[0].toString() +
                    "-" +
                    value[1].toString() +
                    "-" +
                    value[2].toString()
                );

                return date;
              },
              valueFormatter: (params: Moment) => {
                if (params == null) {
                  return "";
                }
                return `${
                  params.year() +
                  "-" +
                  (params.month() + 1) +
                  "-" +
                  params.date()
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
