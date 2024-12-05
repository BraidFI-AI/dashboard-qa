"use client";

import { Alert, AlertSearch } from "@/core/api/ApiTypes";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import { fetchAlerts } from "@/redux/slices/alerts_slice";
import { useAppDispatch } from "@/redux/store/store";
import { GridCellParams, GridEventListener, MuiEvent } from "@mui/x-data-grid";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AlertsTable from "./alerts_table";
import { setTitle } from "@/redux/slices/AppSlice";
import AlertFilters from "./alert_filters";

const AlertsTablePage = () => {
  const qParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [filters, setFilters] = useState<AlertSearch | null>(null);

  const alerts: "loading" | string | Alert[] = useSelector(
    (state: any) => state.alerts.alerts
  );

  useEffect(() => {
    dispatch(setTitle("Alerts"));

    const params: { [anyProp: string]: string | string[] } = {};

    qParams.forEach((value, key) => {
      if (value.includes(",")) {
        params[key] = value.split(",");
      } else {
        params[key] = value;
      }
    });

    setFilters(params as AlertSearch);

    console.log("params:", params);

    const fetchAlertsHelper = () => {
      console.log("filters:", params);
      dispatch(fetchAlerts({ refresh: true, filters: params }));
    };

    fetchAlertsHelper();
  }, [dispatch, qParams]);

  return (
    <div className="h-full flex flex-col">
      <div className="pb-2 w-fit">
        <AlertFilters />
      </div>
      {alerts == "loading" ? (
        <MyCircularProgressIndicator />
      ) : typeof alerts == "string" ? (
        <ErrorPage
          error={alerts}
          recoveryButtonTitle="Retry"
          recoveryButtonOnClick={() => {
            dispatch(fetchAlerts({ refresh: true, filters: filters ?? {} }));
          }}
        />
      ) : (
        <AlertsTable
          alerts={alerts}
          isPaginated={true}
          filters={filters ?? {}}
        />
      )}
    </div>
  );
};

export default AlertsTablePage;
