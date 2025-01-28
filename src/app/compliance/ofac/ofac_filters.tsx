"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyText from "@/core/components/Text/Text";
import { OFACSearch } from "@/core/api/ApiTypes";
import { SubmitHandler, useForm } from "react-hook-form";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import { useAppDispatch } from "@/redux/store/store";
import MyTextButton from "@/core/components/Button/MyTextButton";
import { useRouter, useSearchParams } from "next/navigation";
import MyControlledDatePicker from "@/core/components/DateTimePicker/MyControlledDateTimePicker";
import moment from "moment";

type OFACFiltersProps = {};

const OFACFilters: React.FC<OFACFiltersProps> = ({}) => {
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
  } = useForm<OFACSearch>();
  const onSubmit: SubmitHandler<OFACSearch> = (data: any) => {
    console.log("data:", data);

    if (data.status == null || data.status == "") {
      data.status = undefined;
    }

    if (data.startDate == null || data.startDate == "") {
      data.startDate = undefined;
    }

    if (data.endDate == null || data.endDate == "") {
      data.endDate = undefined;
    }

    if (data.entityType == null || data.entityType == "") {
      data.entityType = undefined;
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

    router.replace(`/compliance/ofac${params}`);
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
      status: qParams.get("status") ?? "",
      startDate: qParams.get("startDate") ?? undefined,
      endDate: qParams.get("endDate") ?? undefined,
      entityType: qParams.get("entityType") ?? "",
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
        <Box className="flex flex-col px-4 pt-10 max-w-full">
          <div className="h-[50px]" />
          <MyText size="lg">OFAC Filters</MyText>
          <div className="pb-4 w-full">
            <MyText>Status</MyText>
            <MyControlledAutocomplete
              value={getValues("status") ?? ""}
              displayName="Status"
              name={"status"}
              control={control}
              errors={errors}
              rules={{}}
              options={[
                "NO_MATCH",
                "REVIEW",
                "CLEARED",
                "CONFIRMED",
                "BLOCKED",
              ]}
            />
          </div>
          <div className="pb-4 w-full">
            <MyText>Entity Type</MyText>
            <MyControlledAutocomplete
              value={getValues("entityType") ?? ""}
              displayName="Entity Type"
              name={"entityType"}
              control={control}
              errors={errors}
              rules={{}}
              options={[
                "INDIVIDUAL",
                "BUSINESS",
                "TRANSACTION",
                "UBO",
                "COUNTERPARTY",
              ]}
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
                rules={{
                  validate: (value: any) => {
                    if (value == null) {
                      return;
                    }
                    const dateObject = moment(value.toString());
                    if (dateObject.toString() === "Invalid Date") {
                      return "Invalid Date";
                    } else {
                    }
                    return true;
                  },
                }}
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
                rules={{
                  validate: (value: any) => {
                    console.log("value:", value);
                    if (value == null) {
                      return;
                    }
                    const dateObject = moment(value.toString());
                    if (dateObject.toString() === "Invalid Date") {
                      return "Invalid Date";
                    } else {
                    }
                    if (dateObject.isBefore(getValues("startDate"))) {
                      return "End Date cannot be before start date";
                    }
                    return true;
                  },
                }}
                value={getValues("endDate") ?? ""}
              />
            </Box>
          </Box>
          <Box className="flex flex-row justify-between pb-10">
            <Box className="w-32 pt-6">
              <MyTextButton
                onClick={() => {
                  reset({
                    status: "",
                    startDate: undefined,
                    endDate: undefined,
                    entityType: "",
                  });
                  setDrawerOpen(false);

                  router.replace(`/compliance/ofac`);
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

export default OFACFilters;
