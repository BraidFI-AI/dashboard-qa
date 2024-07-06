"use client";

import Box from "@mui/material/Box";
import { useState } from "react";
import ACHHistoryTable from "./components/ACHHistoryTable";
import { SubmitHandler, useForm } from "react-hook-form";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyText from "@/core/components/Text/Text";
import MyControlledDatePicker from "@/core/components/DateTimePicker/MyControlledDateTimePicker";
import moment, { Moment } from "moment";
import CircularProgress from "@mui/material/CircularProgress";
import { ACHSettlementHistory } from "@/core/api/ApiTypes";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import { useAppDispatch } from "@/redux/store/store";
import { fetchProductIdsList } from "@/redux/slices/ProductSlice";
import {
  clearACHHistory,
  fetchACHSettlementHistory,
} from "@/redux/slices/ACHSlice";
import RequireRole from "@/core/components/RequireRole";
import { ADMIN_ROUTE } from "@/core/constants";
import { enqueueSnackbar } from "notistack";
import ErrorPage from "@/core/components/error_page";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";

const ACH = () => {
  const dispatch = useAppDispatch();

  const achHistory = useSelector(
    (state: any) => state.ach.achSettlementHistory
  );

  useEffect(() => {
    dispatch(fetchACHSettlementHistory({}));
  }, [dispatch]);

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
