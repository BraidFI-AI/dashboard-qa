"use client";

import ACHReturnFilesTable from "./ach_return_files_table";
import MyText from "@/core/components/Text/Text";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { fetchACHReturnFiles } from "@/redux/slices/ACHSlice";
import RequireRole from "@/core/components/RequireRole";
import { ADMIN_ROUTE } from "@/core/constants";
import ErrorPage from "@/core/components/error_page";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import React from "react";
import MyControlledDatePicker from "@/core/components/DateTimePicker/MyControlledDateTimePicker";
import moment from "moment";
import { enqueueSnackbar } from "notistack";
import { SubmitHandler, useForm } from "react-hook-form";
import { momentToPSTString } from "@/core/utils/dateTimeUtil";
import MyBlueButton from "@/core/components/Button/MyBlueButton";

const ACH = () => {
  const dispatch = useAppDispatch();

  const achHistory = useSelector((state: any) => state.ach.achReturnFiles);

  const {
    formState: { errors },
    control,
    handleSubmit,
    getValues,
    reset,
  } = useForm<{
    startDate?: string;
    endDate?: string;
  }>({
    defaultValues: {
      startDate: momentToPSTString(moment().subtract(1, "day"), true),
      endDate: momentToPSTString(moment(), false),
    },
  });
  const onSubmit: SubmitHandler<{
    productId?: string;
    startDate?: string;
    endDate?: string;
  }> = (data: { productId?: string; startDate?: string; endDate?: string }) => {
    if (data.startDate == null && data.endDate == null) {
      data.startDate = undefined;
      data.endDate = undefined;
    } else if (data.startDate == null || data.endDate == null) {
      enqueueSnackbar("Please select both start and end date", {
        variant: "error",
      });
      return;
    }

    console.log("data:", data);

    dispatch(
      fetchACHReturnFiles({
        date:
          data.startDate != undefined && data.endDate != undefined
            ? { startDate: data.startDate, endDate: data.endDate }
            : undefined,
      })
    );
  };

  return (
    <>
      <div className="flex flex-row pb-4 w-[650px]">
        <MyControlledDatePicker
          name="startDate"
          displayName="Start Date"
          control={control}
          errors={errors}
          rules={{
            required: true,
            validate: (value: any) => {
              const dateObject = moment(value.toString());
              if (dateObject.toString() === "Invalid Date") {
                return "Invalid Date";
              } else {
                // const now = moment();
                // dateObject.setHours(0, 0, 0, 0);
                // today.setHours(0, 0, 0, 0);
                // if (dateObject > today) {
                //   return "Date cannot be greater the today's date";
                // }
              }
              return true;
            },
          }}
          value=""
        />
        <div className="w-4"></div>
        <MyControlledDatePicker
          name="endDate"
          displayName="End Date"
          control={control}
          errors={errors}
          rules={{
            required: true,
            validate: (value: any) => {
              const dateObject = moment(value.toString());
              if (dateObject.toString() === "Invalid Date") {
                return "Invalid Date";
              } else {
                // const now = moment();
                // dateObject.setHours(0, 0, 0, 0);
                // today.setHours(0, 0, 0, 0);
                // if (dateObject > today) {
                //   return "Date cannot be greater the today's date";
                // }
              }
              return true;
            },
          }}
          value=""
        />
        <div className="w-4"></div>
        <div className="w-fit">
          <MyBlueButton onClick={handleSubmit(onSubmit)}>Search</MyBlueButton>
        </div>
      </div>
      {achHistory == "initial" ? (
        <MyText>Please select dates</MyText>
      ) : achHistory == "loading" ? (
        <MyCircularProgressIndicator />
      ) : typeof achHistory == "string" ? (
        <ErrorPage
          error={achHistory}
          recoveryButtonOnClick={() => {
            dispatch(fetchACHReturnFiles({}));
          }}
          recoveryButtonTitle="Retry"
        />
      ) : achHistory.length == 0 ? (
        <MyText>No ACH Return File found</MyText>
      ) : (
        <ACHReturnFilesTable />
      )}
    </>
  );
};

export default RequireRole(ACH, ADMIN_ROUTE);
