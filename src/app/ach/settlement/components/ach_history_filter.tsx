"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import MyText from "@/core/components/Text/Text";
import { TransactionSearch } from "@/core/api/ApiTypes";
import { SubmitHandler, useForm } from "react-hook-form";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import MyControlledDatePicker from "@/core/components/DateTimePicker/MyControlledDateTimePicker";
import moment, { Moment } from "moment";
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
import { enqueueSnackbar } from "notistack";
import { fetchACHSettlementHistory } from "@/redux/slices/ACHSlice";

const AchHistoryFilters = () => {
  const dispatch = useAppDispatch();
  const [productIdsList, setProductIdsList] = useState<
    "loading" | string | { id: string; name: string }[]
  >("loading");
  const [productId, setProductId] = useState<string | null>(null);

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
    if (productId == null) {
      data.productId = undefined;
    } else {
      data.productId = productId;
    }

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
      fetchACHSettlementHistory({
        productId: data.productId,
        date:
          data.startDate != undefined && data.endDate != undefined
            ? { startDate: data.startDate, endDate: data.endDate }
            : undefined,
      })
    );
    setDrawerOpen(false);
  };

  useEffect(() => {
    dispatch(fetchProductIdsList()).then((data: any) => {
      setProductIdsList(data.payload);
      //   if (data.payload?.length > 0) {
      //     setProductId(data.payload[0]?.id);
      //   }
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
                      startDate: undefined,
                      endDate: undefined,
                      productId: "",
                    });
                    setProductId(null);

                    dispatch(fetchACHSettlementHistory({}));
                    setDrawerOpen(false);
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
