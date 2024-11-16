"use client";

import TidyTree from "@/core/components/charts/tidy_tree";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import { setTitle } from "@/redux/slices/AppSlice";
import { fetchClearSightData } from "@/redux/slices/clear_sight_slice";
import { useAppDispatch } from "@/redux/store/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const ClearSight = () => {
  const dispatch = useAppDispatch();
  const clearSightData = useSelector((state: any) => state.clearSight.data);

  useEffect(() => {
    dispatch(setTitle("ClearSight"));
  }, []);

  return clearSightData == "loading" ? (
    <MyCircularProgressIndicator />
  ) : typeof clearSightData == "string" ? (
    <ErrorPage
      error={clearSightData}
      recoveryButtonTitle="Retry"
      recoveryButtonOnClick={() => {
        dispatch(fetchClearSightData());
      }}
    />
  ) : (
    <>
      <TidyTree data={clearSightData} />
      <div className="pb-10" />
    </>
  );
};

export default ClearSight;
