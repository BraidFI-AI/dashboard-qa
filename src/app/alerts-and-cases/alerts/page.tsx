"use client";

import { Alert } from "@/core/api/ApiTypes";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import MyLinkText from "@/core/components/Text/LinkText";
import MyText from "@/core/components/Text/Text";
import { paginationPageSize, PaginationStateType } from "@/core/constants";
import {
  fetchAlerts,
  setAlertsPaginationPageNumber,
} from "@/redux/slices/alerts_slice";
import { useAppDispatch } from "@/redux/store/store";
import { GridCellParams, GridEventListener, MuiEvent } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AlertsTable from "./alerts_table";
import { setTitle } from "@/redux/slices/AppSlice";

const AlertsTablePage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const alerts: "loading" | string | Alert[] = useSelector(
    (state: any) => state.alerts.alerts
  );

  useEffect(() => {
    dispatch(setTitle("Alerts"));
    dispatch(fetchAlerts(true));
  }, [dispatch]);

  return (
    <div className="h-full">
      <>
        {alerts == "loading" ? (
          <MyCircularProgressIndicator />
        ) : typeof alerts == "string" ? (
          <ErrorPage
            error={alerts}
            recoveryButtonTitle="Retry"
            recoveryButtonOnClick={() => {
              dispatch(fetchAlerts(false));
            }}
          />
        ) : (
          <AlertsTable alerts={alerts} isPaginated={true} />
        )}
      </>
    </div>
  );
};

export default AlertsTablePage;
