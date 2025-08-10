"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyText from "@/core/components/Text/Text";
import { SubmitHandler, useForm } from "react-hook-form";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import MyControlledDatePicker from "@/core/components/DateTimePicker/MyControlledDateTimePicker";
import moment from "moment";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorPage from "@/core/components/error_page";
import { useAppDispatch } from "@/redux/store/store";
import { fetchProductIdsList } from "@/redux/slices/ach_return_slice";
import MyTextButton from "@/core/components/Button/MyTextButton";
import { enqueueSnackbar } from "notistack";
import { fetchACHSettlementHistory } from "@/redux/slices/ACHSlice";
import { useRouter, useSearchParams } from "next/navigation";

const AchHistoryFilters = () => {
  const router = useRouter();
  const qParams = useSearchParams();

  const dispatch = useAppDispatch();
  const [productIdsList, setProductIdsList] = useState<
    "loading" | string | { id: string; name: string }[]
  >("loading");
  const [productId, setProductId] = useState<string | undefined>(undefined);

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const productIdFilter = useSelector((state: any) => state.ach.productId);
  const startDateFilter = useSelector((state: any) => state.ach.startDate);
  const endDateFilter = useSelector((state: any) => state.ach.endDate);

  const {
    formState: { errors },
    control,
    handleSubmit,
    getValues,
    reset,
  } = useForm<{
    productId?: string;
    startDate?: string;
    endDate?: string;
  }>({
    defaultValues: {
      productId: productIdFilter ?? undefined,
      startDate: startDateFilter == undefined ? undefined : startDateFilter,
      endDate: endDateFilter == undefined ? undefined : endDateFilter,
    },
  });
  const onSubmit: SubmitHandler<{
    productId?: string;
    startDate?: string;
    endDate?: string;
  }> = (data: { productId?: string; startDate?: string; endDate?: string }) => {
    if (productId == null || productId == "") {
      data.productId = undefined;
    } else {
      data.productId = productId;
    }
    if (
      (data.startDate == null || data.startDate == "") &&
      (data.endDate == null || data.endDate == "")
    ) {
      data.startDate = undefined;
      data.endDate = undefined;
    } else if (
      data.startDate == null ||
      data.startDate == "" ||
      data.endDate == null ||
      data.endDate == ""
    ) {
      enqueueSnackbar("Please select both start and end date", {
        variant: "error",
      });
      return;
    }

    console.log("data:", data);

    let params: string = "?";

    for (const key in data) {
      if ((data as any)[key] !== undefined) {
        params += `${key}=${(data as any)[key]}&`;
      }
    }

    // remove the last &
    params = params.slice(0, -1);
    setDrawerOpen(false);

    router.replace(`/ach/settlement${params}`);
  };

  useEffect(() => {
    reset({
      productId: qParams.get("accountNumber") ?? "",
      startDate: qParams.get("startDate") ?? undefined,
      endDate: qParams.get("endDate") ?? undefined,
    });
    setProductId(qParams.get("productId") ?? undefined);
  }, [qParams, reset]);

  useEffect(() => {
    dispatch(fetchProductIdsList()).then((data: any) => {
      setProductIdsList(data.payload);
    });
  }, [dispatch]);

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
    dispatch(fetchProductIdsList()).then((data: any) => {
      setProductIdsList(data.payload);
    });
  }, [dispatch]);

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
          <MyText size="lg">ACH Settlement Filters</MyText>
          <div className="h-6"></div>
          <form onSubmit={handleSubmit(onSubmit)} className="pb-6">
            <Box className="flex flex-col">
              <Box>
                <MyText>Product</MyText>
                {productIdsList == "loading" ? (
                  <CircularProgress size="25px" />
                ) : typeof productIdsList == "string" ? (
                  <ErrorPage
                    error={productIdsList}
                    recoveryButtonOnClick={() => {
                      dispatch(fetchProductIdsList()).then((data: any) => {
                        setProductIdsList(data.payload);
                        // if (data.payload?.length > 0) {
                        //   setProductId(data.payload[0]?.id);
                        // }
                      });
                    }}
                    recoveryButtonTitle="Retry"
                  />
                ) : (
                  <MyControlledAutocomplete
                    // clearable={false}
                    value={getValues("productId") ?? ""}
                    displayName="Product ID"
                    name={"productId"}
                    control={control}
                    errors={errors}
                    rules={{ required: false }}
                    options={productIdsList?.map((prd) => {
                      return `${prd.id} - ${prd.name}`;
                    })}
                    customOnChange={(val: string) => {
                      const id = val?.split(" - ")[0];
                      if (id) {
                        setProductId(id);
                      }
                    }}
                  />
                )}
              </Box>
              <div className="h-4"></div>
              <Box>
                <MyText>Start Date</MyText>
                <MyControlledDatePicker
                  noDefault={true}
                  name="startDate"
                  displayName="Start Date"
                  control={control}
                  errors={errors}
                  rules={{
                    required: false,
                    validate: (value: any) => {
                      if (value == null) {
                        return;
                      }
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
                  value={getValues("startDate") ?? ""}
                ></MyControlledDatePicker>
              </Box>
              <div className="h-4"></div>
              <Box>
                <MyText>End Date</MyText>
                <MyControlledDatePicker
                  noDefault={true}
                  name="endDate"
                  displayName="End Date"
                  control={control}
                  errors={errors}
                  rules={{
                    required: false,
                    validate: (value: any) => {
                      if (value == null) {
                        return;
                      }
                      const dateObject = moment(value.toString());
                      if (dateObject.toString() === "Invalid Date") {
                        return "Invalid Date";
                      } else {
                        // const now = moment();
                        // // dateObject.setHours(0, 0, 0, 0);
                        // // today.setHours(0, 0, 0, 0);
                        // const startDate = moment(
                        //   getValues("startDate").toString()
                        // )
                        // if (dateObject < startDate && dateObject != startDate) {
                        //   return "End date cannot be before start date";
                        // }
                        // if (dateObject > today) {
                        //   return "Date cannot be greater the today's date";
                        // }
                      }
                      return true;
                    },
                  }}
                  value={getValues("endDate") ?? ""}
                ></MyControlledDatePicker>
              </Box>
            </Box>
            <Box className="flex flex-row justify-between pb-10">
              <Box className="w-32 pt-6">
                <MyTextButton
                  onClick={() => {
                    reset({
                      productId: "",
                      startDate: undefined,
                      endDate: undefined,
                    });
                    setProductId(undefined);
                    setDrawerOpen(false);

                    router.replace(`/ach/settlement`);
                  }}
                >
                  Reset Filters
                </MyTextButton>
              </Box>
              <div className="w-32 pt-4 h-16">
                {typeof productIdsList != "string" && (
                  <MyBlueButton type="submit">Apply Filters</MyBlueButton>
                )}
              </div>
            </Box>
          </form>
        </Box>
      </Drawer>
    </React.Fragment>
  );
};

export default AchHistoryFilters;
