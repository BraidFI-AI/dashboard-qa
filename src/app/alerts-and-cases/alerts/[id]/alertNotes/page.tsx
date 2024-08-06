"use client";

import { Alert } from "@/core/api/ApiTypes";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import MyTable from "@/core/components/Table/MyTable";
import ItemRow from "@/core/components/Text/ItemRow";
import MyText from "@/core/components/Text/Text";
import timestampToDate from "@/core/utils/timestampToDate";
import { fetchAlert } from "@/redux/slices/alerts_slice";
import { setTitle } from "@/redux/slices/AppSlice";
import { useAppDispatch } from "@/redux/store/store";
import { GridCellParams, MuiEvent } from "@mui/x-data-grid";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AlertsNotesPage = () => {
  const dispatch = useAppDispatch();
  const params = useParams();

  const alert = useSelector((state: any) => state.alerts.alert);

  useEffect(() => {
    dispatch(setTitle("Alert"));
    dispatch(fetchAlert(params.id.toString())).then((data: any) => {
      if (typeof data.payload != "string") {
        dispatch(setTitle(data.payload.type?.replaceAll("_", " ")));
      }
    });
  }, [dispatch, params.id]);

  return alert == "loading" ? (
    <MyCircularProgressIndicator />
  ) : typeof alert == "string" ? (
    <ErrorPage
      error={alert}
      recoveryButtonTitle="Retry"
      recoveryButtonOnClick={() => {
        dispatch(fetchAlert(params.id.toString())).then((data: any) => {
          if (typeof data.payload != "string") {
            dispatch(setTitle(data.payload.type?.replaceAll("_", "")));
          }
        });
      }}
    />
  ) : (
    <div className="h-full">
      {alert.alertNotes?.length == 0 ? (
        <MyText>No notes</MyText>
      ) : (
        <MyTable
          handleRowClick={(params: any) => {}}
          handleCellClick={(
            params: GridCellParams,
            event: MuiEvent<React.MouseEvent>
          ) => {}}
          columns={[
            {
              field: "id",
              headerName: "Note ID",
              flex: 1,
              minWidth: 120,
            },
            {
              field: "username",
              headerName: "Username",
              flex: 1,
              minWidth: 120,
            },
            {
              field: "noteDateTime",
              headerName: "Created",
              flex: 1,
              minWidth: 140,
              renderCell: (params: any) => (
                <div>{timestampToDate(params.row.noteDateTime)}</div>
              ),
              valueGetter: (params: any) =>
                timestampToDate(params.row.noteDateTime),
            },
            {
              field: "note",
              headerName: "Note",
              minWidth: 160,
              flex: 1,
            },
          ]}
          rows={alert.alertNotes}
        />
      )}
    </div>
  );
};

export default AlertsNotesPage;
