"use client";

import ACHHistoryTable from "./components/ACHHistoryTable";
import MyText from "@/core/components/Text/Text";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { fetchACHSettlementHistory } from "@/redux/slices/ACHSlice";
import RequireRole from "@/core/components/RequireRole";
import { ADMIN_ROUTE } from "@/core/constants";
import ErrorPage from "@/core/components/error_page";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import { useSearchParams } from "next/navigation";

const ACH = () => {
  const qParams = useSearchParams();

  const dispatch = useAppDispatch();

  const achHistory = useSelector(
    (state: any) => state.ach.achSettlementHistory
  );

  useEffect(() => {
    const params: { [anyProp: string]: string | string[] } = {};

    qParams.forEach((value, key) => {
      if (value.includes(",")) {
        params[key] = value.split(",");
      } else {
        params[key] = value;
      }
    });

    console.log("params:", params);

    const fetchDataHelper = () => {
      console.log("filters:", params);
      dispatch(
        fetchACHSettlementHistory({
          productId: params.productId
            ? (params.productId as string)
            : undefined,
          date:
            params.startDate && params.endDate
              ? {
                  startDate: params.startDate as string,
                  endDate: params.endDate as string,
                }
              : undefined,
        })
      ).then((data: any) => {
        console.log(data.payload);
      });
    };

    fetchDataHelper();
  }, [dispatch, qParams]);

  return achHistory == "loading" ? (
    <MyCircularProgressIndicator />
  ) : typeof achHistory == "string" ? (
    <ErrorPage
      error={achHistory}
      recoveryButtonOnClick={() => {
        dispatch(fetchACHSettlementHistory({}));
      }}
      recoveryButtonTitle="Retry"
    />
  ) : achHistory.length == 0 ? (
    <MyText>No ACH Settlement History found</MyText>
  ) : (
    <ACHHistoryTable />
  );
};

export default RequireRole(ACH, ADMIN_ROUTE);
