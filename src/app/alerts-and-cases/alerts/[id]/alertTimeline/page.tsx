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

const AlertsTimelinesPage = () => {
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
    <>
      {alert.alertTimelines?.length == 0 ? (
        <MyText>No timeline</MyText>
      ) : (
        <div className="h-full">
          <div className="h-full">
            <MyTable
              handleRowClick={(params: any) => {}}
              handleCellClick={(
                params: GridCellParams,
                event: MuiEvent<React.MouseEvent>
              ) => {}}
              columns={[
                {
                  field: "id",
                  headerName: "Timeline ID",
                  width: 100,
                },
                {
                  field: "username",
                  headerName: "Username",
                  width: 120,
                },
                {
                  field: "actionDateTime",
                  headerName: "Action Time",
                  width: 140,
                  renderCell: (params: any) => (
                    <div>{timestampToDate(params.row.actionDateTime)}</div>
                  ),
                  valueGetter: (params: any) =>
                    timestampToDate(params.row.actionDateTime),
                },
                {
                  field: "action",
                  headerName: "Action",
                  width: 160,
                },
              ]}
              rows={alert.alertTimelines}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AlertsTimelinesPage;
