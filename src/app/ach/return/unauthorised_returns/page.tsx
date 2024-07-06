"use client";

import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import { fetchUnauthorizedReturns } from "@/redux/slices/ach_return_slice";
import { useAppDispatch } from "@/redux/store/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import UnauthorizedReturnsTable from "./unauthorised_returns_table";

const ReturnPage = () => {
  const dispatch = useAppDispatch();
  const unauthReturns = useSelector(
    (state: any) => state.return.unauthorizedReturns
  );

  useEffect(() => {
    dispatch(fetchUnauthorizedReturns(true));
  }, [dispatch]);

  return unauthReturns == "loading" ? (
    <MyCircularProgressIndicator />
  ) : typeof unauthReturns == "string" ? (
    <ErrorPage
      error={unauthReturns}
      recoveryButtonOnClick={() => {
        dispatch(fetchUnauthorizedReturns(true));
      }}
      recoveryButtonTitle="Retry"
    />
  ) : (
    <div style={{ height: "65vh" }}>
      <UnauthorizedReturnsTable returns={unauthReturns} />
    </div>
  );
};

export default ReturnPage;
