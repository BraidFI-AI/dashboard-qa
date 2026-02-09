"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import MyText from "@/core/components/Text/Text";
import { AlertSearch, TransactionSearch } from "@/core/api/ApiTypes";
import { SubmitHandler, useForm } from "react-hook-form";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import MyControlledDatePicker from "@/core/components/DateTimePicker/MyControlledDateTimePicker";
import moment from "moment";
import {
  TransactionTypesType,
  fetchTransactionTypes,
} from "@/redux/slices/AppSlice";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import { useAppDispatch } from "@/redux/store/store";
import MyControlledMultiAutocomplete from "@/core/components/Autocomplete/MyControlledMultiAutocomplete";
import { fetchProductIdsList } from "@/redux/slices/ach_return_slice";
import MyTextButton from "@/core/components/Button/MyTextButton";
import { useRouter, useSearchParams } from "next/navigation";
import MyControlledAsyncAutocomplete from "@/core/components/Autocomplete/MyControlledAsyncAutocomplete";
import MyControlledCheckbox from "@/core/components/Button/MyControlledCheckbox";

type AlertFiltersrProps = {};

const AlertFilters: React.FC<AlertFiltersrProps> = ({}) => {
  const router = useRouter();
  const qParams = useSearchParams();
  const dispatch = useAppDispatch();

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const {
    formState: { errors },
    control,
    handleSubmit,
    getValues,
    reset,
  } = useForm<AlertSearch>();
  const onSubmit: SubmitHandler<AlertSearch> = (data: any) => {
    console.log("data:", data);

    if (data.contextType == null || data.contextType == "") {
      data.contextType = undefined;
    }

    if (data.contextId == null || data.contextId == "") {
      data.contextId = undefined;
    }

    if (data.types == null || data.types.length == 0) {
      data.types = undefined;
    }

    if (data.statuses == null || data.statuses.length == 0) {
      data.statuses = undefined;
    }

    if (data.alertId == null || data.alertId == "") {
      data.alertId = undefined;
    }

    if (data.rfiStatus == null || data.rfiStatus == "") {
      data.rfiStatus = undefined;
    }

    if (data.assignee == null || data.assignee == "") {
      data.assignee = undefined;
    }

    if (data.startDate == null || data.startDate == "") {
      data.startDate = undefined;
    }

    if (data.endDate == null || data.endDate == "") {
      data.endDate = undefined;
    }

    let params: string = "?";

    for (const key in data) {
      if (data[key] !== undefined) {
        params += `${key}=${data[key]}&`;
      }
    }

    // remove the last &
    params = params.slice(0, -1);
    setDrawerOpen(false);

    router.replace(`/alerts-and-cases/alerts${params}`);
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  useEffect(() => {
    reset({
      types: qParams.get("types")?.split(",") ?? [],
      statuses: qParams.get("statuses")?.split(",") ?? [],
      contextId: qParams.get("contextId") ?? "",
      contextType: qParams.get("contextType") ?? "",
      alertId: qParams.get("alertId") ?? "",
      rfiStatus: qParams.get("rfiStatus") ?? "",
      assignee: qParams.get("assignee") ?? "",
      startDate: qParams.get("startDate") ?? undefined,
      endDate: qParams.get("endDate") ?? undefined,
    });
  }, [qParams]);

  return (
    <React.Fragment key="right">
      <Box className="w-auto">
        <MyBlueButton onClick={toggleDrawer(true)}>Filters</MyBlueButton>
      </Box>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          className: "w-2/5",
        }}
      >
        <Box className="flex flex-col px-4 pt-8 max-w-full">
          {/* <div className="h-[50px]" /> */}
          <MyText size="lg">Alert Filters</MyText>
          <Box className="pb-4 w-full">
            <MyText>Alert ID</MyText>
            <MyControlledTextField
              name="alertId"
              displayName="Alert ID"
              control={control}
              errors={errors}
              rules={{}}
              value={getValues("alertId")}
            />
          </Box>
          <Box className="pb-4 w-full">
            <MyText>Context ID</MyText>
            <MyControlledTextField
              name="contextId"
              displayName="Context ID"
              control={control}
              errors={errors}
              rules={{}}
              value={getValues("contextId")}
            />
          </Box>
          <div className="pb-4 w-full">
            <MyText>Context Type</MyText>
            <MyControlledAutocomplete
              value={getValues("contextType") ?? ""}
              displayName="Context Type"
              name={"contextType"}
              control={control}
              errors={errors}
              rules={{}}
              options={[
                "TRANSACTION",
                "OFAC",
                "LIST_314A",
                "VELOCITY_LIMIT",
                "PRODUCT",
                "FILE_NAME",
                "FILE_RECORD",
                "ACH_INBOUND_TRANSACTION",
              ]}
            />
          </div>
          <Box className="pb-4 w-full">
            <MyText>Alert Type</MyText>
            <MyControlledMultiAutocomplete
              value={getValues("types") ?? []}
              displayName="Alert Types"
              name={"types"}
              control={control}
              errors={errors}
              rules={{}}
              options={[
                "OFAC",
                "LIST_314A",
                "DUAL_APPROVAL",
                "TRANSACTION_MONITORING",
                "TRANSACTION_REVIEW",
                "TRANSACTION_PROCESSING_ERROR",
                "ACH_RETURN_PROCESSING",
              ]}
            />
          </Box>
          <Box className="pb-4 w-full">
            <MyText>Alert Status</MyText>
            <MyControlledMultiAutocomplete
              value={getValues("statuses") ?? []}
              displayName="Alert Status"
              name={"statuses"}
              control={control}
              errors={errors}
              rules={{}}
              options={["ASSIGNED", "UNASSIGNED", "CLOSED", "ESCALATED"]}
            />
          </Box>
          <Box className="pb-4 w-full">
            <MyText>Assignee</MyText>
            <MyControlledTextField
              name="assignee"
              displayName="Assignee"
              control={control}
              errors={errors}
              rules={{}}
              value={getValues("assignee")}
            />
          </Box>
          <div className="pb-4 w-full">
            <MyText>RFI Status</MyText>
            <MyControlledAutocomplete
              value={getValues("rfiStatus") ?? ""}
              displayName="RFI Status"
              name={"rfiStatus"}
              control={control}
              errors={errors}
              rules={{}}
              options={["COMPLETED", "REQUESTED", "PROVIDED"]}
            />
          </div>
          <Box className="flex flex-row">
            <Box className="pb-4 w-full">
              <MyText>Start Date</MyText>
              <MyControlledDatePicker
                noDefault={true}
                name="startDate"
                displayName="Start Date"
                control={control}
                errors={errors}
                rules={{}}
                value={getValues("startDate") ?? ""}
              />
            </Box>
            <Box className="w-4"></Box>
            <Box className="pb-4 w-full">
              <MyText>End Date</MyText>
              <MyControlledDatePicker
                noDefault={true}
                name="endDate"
                displayName="End Date"
                control={control}
                errors={errors}
                rules={{}}
                value={getValues("endDate") ?? ""}
              />
            </Box>
          </Box>
          <Box className="flex flex-row justify-between pb-10">
            <Box className="w-32 pt-6">
              <MyTextButton
                onClick={() => {
                  reset({
                    contextId: "",
                    contextType: "",
                    types: [],
                    statuses: [],
                    alertId: "",
                    rfiStatus: "",
                    assignee: "",
                    startDate: undefined,
                    endDate: undefined,
                  });
                  setDrawerOpen(false);

                  router.replace(`/alerts-and-cases/alerts`);
                }}
              >
                Reset Filters
              </MyTextButton>
            </Box>
            <Box className="w-32 pt-6">
              <MyBlueButton onClick={handleSubmit(onSubmit)}>
                Apply Filters
              </MyBlueButton>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </React.Fragment>
  );
};

export default AlertFilters;
