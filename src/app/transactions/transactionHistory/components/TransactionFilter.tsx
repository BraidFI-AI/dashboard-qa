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

type TransactionFilterProps = {};

const TransactionFilter: React.FC<TransactionFilterProps> = ({}) => {
  const router = useRouter();
  const qParams = useSearchParams();
  const dispatch = useAppDispatch();
  const transactionTypes: TransactionTypesType = useSelector(
    (state: any) => state.app.transactionTypes
  );

  const [productIdsList, setProductIdsList] = useState<
    "loading" | string | { id: string; name: string }[]
  >("loading");
  const [productId, setProductId] = useState<string | undefined>(undefined);

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const {
    formState: { errors },
    control,
    handleSubmit,
    getValues,
    reset,
  } = useForm<TransactionSearch>();
  const onSubmit: SubmitHandler<TransactionSearch> = (data: any) => {
    console.log("data:", data);

    data.productId = productId;
    if (productId == null || productId == "") {
      data.productId = undefined;
    }

    if (data.accountNumber == null || data.accountNumber == "") {
      data.accountNumber = undefined;
    }

    if (data.paymentId == null || data.paymentId == "") {
      data.paymentId = undefined;
    }

    if (data.achStatus == null || data.achStatus == "") {
      data.achStatus = undefined;
    }

    if (data.beginDate == null || data.beginDate == "") {
      data.beginDate = undefined;
    }

    if (data.endDate == null || data.endDate == "") {
      data.endDate = undefined;
    }

    if (data.maxAmount == null || data.maxAmount == "") {
      data.maxAmount = undefined;
    }

    if (data.minAmount == null || data.minAmount == "") {
      data.minAmount = undefined;
    }

    if (data.productId == null || data.productId == "") {
      data.productId = undefined;
    }

    if (data.transactionStatus == null || data.transactionStatus.length == 0) {
      data.transactionStatus = undefined;
    }

    if (data.transactionType == null || data.transactionType.length == 0) {
      data.transactionType = undefined;
    }

    let params = "?";

    for (const key in data) {
      if (data[key] !== undefined) {
        params += `${key}=${data[key]}&`;
      }
    }

    // remove the last &
    params = params.slice(0, -1);

    router.replace(`/transactions/transactionHistory${params}`);

    setDrawerOpen(false);
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
      accountNumber: qParams.get("accountNumber") ?? "",
      achStatus: qParams.get("achStatus") ?? "",
      beginDate: qParams.get("beginDate") ?? undefined,
      endDate: qParams.get("endDate") ?? undefined,
      maxAmount: qParams.get("maxAmount") ?? "",
      minAmount: qParams.get("minAmount") ?? "",
      productId: qParams.get("productId") ?? "",
      transactionStatus: qParams.getAll("transactionStatus") ?? [],
      transactionType: qParams.getAll("transactionType") ?? [],
      paymentId: qParams.get("paymentId") ?? "",
    });
    setProductId(undefined);
  }, [qParams]);

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
          <MyText size="lg">Transaction Filters</MyText>
          <Box className="flex flex-row  pt-8">
            <Box className="pb-4 w-full">
              <MyText>Account Number</MyText>
              <MyControlledTextField
                name="accountNumber"
                displayName="Account Number"
                control={control}
                errors={errors}
                rules={{}}
                value={getValues("accountNumber")}
              />
            </Box>
            <Box className="w-4"></Box>
            <Box className="pb-4 w-full">
              <MyText>Product</MyText>
              {productIdsList == "loading" ? (
                <CircularProgress size="25px" />
              ) : typeof productIdsList == "string" ? (
                <ErrorPage
                  error={productIdsList}
                  recoveryButtonOnClick={() => {
                    dispatch(fetchProductIdsList()).then((data: any) => {
                      setProductIdsList(data.payload);
                    });
                  }}
                  recoveryButtonTitle="Retry"
                />
              ) : (
                <MyControlledAutocomplete
                  value={getValues("productId") ?? ""}
                  displayName="Product"
                  name={"productId"}
                  control={control}
                  errors={errors}
                  rules={{}}
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
          </Box>
          <Box className="pb-4 w-full">
            <MyText>Payment ID</MyText>
            <MyControlledTextField
              name="paymentId"
              displayName="Payment ID"
              control={control}
              errors={errors}
              rules={{}}
              value={getValues("paymentId")}
            />
          </Box>
          <Box className="pb-4">
            <MyText>Transaction Type</MyText>
            {transactionTypes == "loading" ? (
              <MyCircularProgressIndicator />
            ) : typeof transactionTypes == "string" ? (
              <ErrorPage
                error={transactionTypes}
                recoveryButtonOnClick={() => {
                  dispatch(fetchTransactionTypes());
                }}
                recoveryButtonTitle="Retry"
              />
            ) : (
              <MyControlledMultiAutocomplete
                value={getValues("transactionType") ?? []}
                displayName="Transaction Type"
                name={"transactionType"}
                control={control}
                errors={errors}
                rules={{}}
                options={transactionTypes}
              />
            )}
          </Box>
          <Box className="pb-4 w-full">
            <MyText>Transaction Status</MyText>
            <MyControlledMultiAutocomplete
              value={getValues("transactionStatus") ?? []}
              displayName="Transaction Status"
              name={"transactionStatus"}
              control={control}
              errors={errors}
              rules={{}}
              options={[
                "REJECTED_PAYMENT_INSTRUMENT",
                "REVERSED",
                "REJECTED_VELOCITY_EXCEPTION",
                "RETURNED",
                "CANCELLED",
                "REJECTED_INSUFFICIENT_FUNDS",
                "REJECTED_INVALID_TRANSACTION_DATA",
                "REJECTED_ACCESS_EXCEPTION",
                "REJECTED_GENERIC",
                "PENDING",
                "FAILED",
                "REJECTED_ACCOUNT_STATE",
                "POSTED",
                "REJECTED_CUSTOMER_STATE",
                "APPROVED",
                "REJECTED_CONTACT_STATE",
              ]}
            />
          </Box>
          <Box className="pb-4 w-full">
            <MyText>ACH Status</MyText>
            <MyControlledAutocomplete
              value={getValues("achStatus") ?? ""}
              displayName="ACH Status"
              name={"achStatus"}
              control={control}
              errors={errors}
              rules={{}}
              options={[
                "MANUAL_REVIEW",
                "CONTESTED",
                "ERROR",
                "CANCELED",
                "INITIATED",
                "REJECTED",
                "RETURNED",
                "SENT",
                "SUBMITTED",
                "DISHONORED",
              ]}
            />
          </Box>
          <Box className="flex flex-row">
            <Box className="pb-4 w-full">
              <MyText>Min Amount</MyText>
              <MyControlledTextField
                value={getValues("minAmount")}
                displayName="Min Amount"
                name={"minAmount"}
                control={control}
                errors={errors}
                rules={{ pattern: /^[0-9]+$/ }}
              />
            </Box>
            <Box className="w-4"></Box>
            <Box className="pb-4 w-full">
              <MyText>Max Amount</MyText>
              <MyControlledTextField
                value={getValues("maxAmount")}
                displayName="Max Amount"
                name={"maxAmount"}
                control={control}
                errors={errors}
                rules={{ pattern: /^[0-9]+$/ }}
              />
            </Box>
          </Box>
          <Box className="flex flex-row">
            <Box className="pb-4 w-full">
              <MyText>Begin Date</MyText>
              <MyControlledDatePicker
                noDefault={true}
                name="beginDate"
                displayName="Begin Date"
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
                value={getValues("beginDate") ?? ""}
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
                    if (dateObject.isBefore(getValues("beginDate"))) {
                      return "End Date cannot be before begin date";
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
                    accountNumber: "",
                    achStatus: "",
                    beginDate: undefined,
                    endDate: undefined,
                    maxAmount: "",
                    minAmount: "",
                    productId: "",
                    transactionStatus: [],
                    transactionType: [],
                    paymentId: "",
                  });
                  setProductId(undefined);
                  setDrawerOpen(false);

                  router.replace(`/transactions/transactionHistory`);
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

export default TransactionFilter;
