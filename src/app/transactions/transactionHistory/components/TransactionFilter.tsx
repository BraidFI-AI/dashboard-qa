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
import MyControlledAsyncAutocomplete from "@/core/components/Autocomplete/MyControlledAsyncAutocomplete";
import MyControlledCheckbox from "@/core/components/Button/MyControlledCheckbox";

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

  const [isInbound, setIsInbound] = useState(false);
  const [showAchNoc, setShowAchNoc] = useState(false);
  const [excludeWire, setExcludeWire] = useState(false);
  const [excludeAch, setExcludeAch] = useState(false);

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

    if (data.counterpartyId == null || data.counterpartyId == "") {
      data.counterpartyId = undefined;
    }

    if (data.customerId == null || data.customerId == "") {
      data.customerId = undefined;
    }

    if (data.settlementFileName == null || data.settlementFileName == "") {
      data.settlementFileName = undefined;
    }

    if (data.originalFileName == null || data.originalFileName == "") {
      data.originalFileName = undefined;
    }

    if (data.direction == null || data.direction == "") {
      data.direction = undefined;
    }

    if (data.wireFileHandle == null || data.wireFileHandle == "") {
      data.wireFileHandle = undefined;
    }

    if (
      data.isInbound == null ||
      data.isInbound == "" ||
      data.isInbound == false
    ) {
      data.isInbound = undefined;
    }

    if (
      data.excludeWire == null ||
      data.excludeWire == "" ||
      data.excludeWire == false
    ) {
      data.excludeWire = undefined;
    }

    if (
      data.excludeAch == null ||
      data.excludeAch == "" ||
      data.excludeAch == false
    ) {
      data.excludeAch = undefined;
    }

    if (
      data.showAchNoc == null ||
      data.showAchNoc == "" ||
      data.showAchNoc == false
    ) {
      data.showAchNoc = undefined;
    }

    if (productId == null || productId == "") {
      data.productId = undefined;
    }

    if (data.accountNumber == null || data.accountNumber == "") {
      data.accountNumber = undefined;
    }

    if (data.paymentId == null || data.paymentId == "") {
      data.paymentId = undefined;
    }

    if (data.processingStatus == null || data.processingStatus.length == 0) {
      data.processingStatus = undefined;
    }

    if (data.beginDate == null || data.beginDate == "") {
      data.beginDate = undefined;
    }

    if (data.endDate == null || data.endDate == "") {
      data.endDate = undefined;
    }

    if (data.postDateStart == null || data.postDateStart == "") {
      data.postDateStart = undefined;
    }

    if (data.postDateEnd == null || data.postDateEnd == "") {
      data.postDateEnd = undefined;
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

    if (data.originalFileName == null || data.enoriginalFileNamedDate == "") {
      data.originalFileName = undefined;
    }

    if (data.requesterIpAddress == null || data.requesterIpAddress == "") {
      data.requesterIpAddress = undefined;
    }

    if (data.requesterUsername == null || data.requesterUsername == "") {
      data.requesterUsername = undefined;
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

    router.replace(`/transactions/transactionHistory${params}`);
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
      processingStatus: qParams.get("processingStatus")?.split(",") ?? [],
      beginDate: qParams.get("beginDate") ?? undefined,
      endDate: qParams.get("endDate") ?? undefined,
      postDateStart: qParams.get("postDateStart") ?? undefined,
      postDateEnd: qParams.get("postDateEnd") ?? undefined,
      maxAmount: qParams.get("maxAmount") ?? "",
      minAmount: qParams.get("minAmount") ?? "",
      productId: qParams.get("productId") ?? "",
      transactionStatus: qParams.get("transactionStatus")?.split(",") ?? [],
      transactionType: qParams.get("transactionType")?.split(",") ?? [],
      paymentId: qParams.get("paymentId") ?? "",
      customerId: qParams.get("customerId") ?? "",
      counterpartyId: qParams.get("counterpartyId") ?? "",
      settlementFileName: qParams.get("settlementFileName") ?? "",
      direction: qParams.get("direction") ?? "",
      wireFileHandle: qParams.get("wireFileHandle") ?? "",
      isInbound: qParams.get("isInbound") == "true",
      excludeWire: qParams.get("excludeWire") == "true",
      excludeAch: qParams.get("excludeAch") == "true",
      showAchNoc: qParams.get("showAchNoc") == "true",
      originalFileName: qParams.get("originalFileName") ?? "",
      requesterIpAddress: qParams.get("requesterIpAddress") ?? "",
      requesterUsername: qParams.get("requesterUsername") ?? "",
    });
    setProductId(qParams.get("productId") ?? undefined);
    setIsInbound(qParams.get("isInbound") == "true");
    setExcludeWire(qParams.get("excludeWire") == "true");
    setExcludeAch(qParams.get("excludeAch") == "true");
    setShowAchNoc(qParams.get("showAchNoc") == "true");
  }, [qParams, reset]);

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
          <div className="h-[50px]" />
          <MyText size="lg">Transaction Filters</MyText>
          <Box className="flex flex-row pt-8">
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
          <Box className="pb-4 w-full flex flex-row">
            <div className="pr-2 w-full">
              <MyText>Customer ID</MyText>
              <MyControlledTextField
                name="customerId"
                displayName="Customer ID"
                control={control}
                errors={errors}
                rules={{}}
                value={getValues("customerId")}
              />
            </div>
            <div className="w-full">
              <MyText>Counterparty ID</MyText>
              <MyControlledTextField
                name="counterpartyId"
                displayName="Counterparty ID"
                control={control}
                errors={errors}
                rules={{}}
                value={getValues("counterpartyId")}
              />
            </div>
          </Box>
          <Box className="pb-4 w-full">
            <MyText>Settlement File Name</MyText>
            <MyControlledTextField
              name="settlementFileName"
              displayName="Settlement File Name"
              control={control}
              errors={errors}
              rules={{}}
              value={getValues("settlementFileName") ?? ""}
            />
          </Box>
          <Box className="pb-4 w-full">
            <MyText>Original File Name</MyText>
            <MyControlledTextField
              name="originalFileName"
              displayName="Original File Name"
              control={control}
              errors={errors}
              rules={{}}
              value={getValues("originalFileName") ?? ""}
            />
          </Box>
          <Box className="pb-4 w-full">
            <MyText>Requester IP Address</MyText>
            <MyControlledTextField
              name="requesterIpAddress"
              displayName="Requester IP Address"
              control={control}
              errors={errors}
              rules={{}}
              value={getValues("requesterIpAddress") ?? ""}
            />
          </Box>
          <Box className="pb-4 w-full">
            <MyText>Requester Username</MyText>
            <MyControlledTextField
              name="requesterUsername"
              displayName="Requester Username"
              control={control}
              errors={errors}
              rules={{}}
              value={getValues("requesterUsername") ?? ""}
            />
          </Box>
          <Box className="pb-4 w-full">
            <MyText>Wire File Handle</MyText>
            <MyControlledTextField
              name="wireFileHandle"
              displayName="Wire File Handle"
              control={control}
              errors={errors}
              rules={{}}
              value={getValues("wireFileHandle") ?? ""}
            />
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
            <MyText>Processing Status</MyText>
            <MyControlledMultiAutocomplete
              value={getValues("processingStatus") ?? []}
              displayName="Processing Status"
              name={"processingStatus"}
              control={control}
              errors={errors}
              rules={{}}
              options={[
                "INITIATED",
                "MANUAL_REVIEW",
                "CANCELED",
                "SUBMITTED",
                "SENT",
                "RETURNED",
                "REJECTED",
                "CONFIRMED",
              ]}
            />
          </Box>
          <Box className="w-full pb-4">
            <MyText>Direction</MyText>
            <MyControlledAutocomplete
              value={getValues("direction") ?? ""}
              displayName="Direction"
              name={"direction"}
              control={control}
              errors={errors}
              rules={{}}
              options={["DEBIT", "CREDIT"]}
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
                rules={{ pattern: /^-?\d*\.?\d+$/ }}
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
                rules={{ pattern: /^-?\d*\.?\d+$/ }}
              />
            </Box>
          </Box>
          <Box className="flex flex-row">
            <Box className="pb-4 w-full">
              <MyText>Creation Date Start</MyText>
              <MyControlledDatePicker
                noDefault={true}
                name="beginDate"
                displayName="Creation Date Start"
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
              <MyText>Creation Date End</MyText>
              <MyControlledDatePicker
                noDefault={true}
                name="endDate"
                displayName="Creation Date End"
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
          <Box className="flex flex-row">
            <Box className="pb-4 w-full">
              <MyText>Post Date Start</MyText>
              <MyControlledDatePicker
                noDefault={true}
                name="postDateStart"
                displayName="Post Date Start"
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
                value={getValues("postDateStart") ?? ""}
              />
            </Box>
            <Box className="w-4"></Box>
            <Box className="pb-4 w-full">
              <MyText>Post Date End</MyText>
              <MyControlledDatePicker
                noDefault={true}
                name="postDateEnd"
                displayName="Post Date End"
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
                    if (dateObject.isBefore(getValues("postDateStart"))) {
                      return "End Date cannot be before begin date";
                    }
                    return true;
                  },
                }}
                value={getValues("postDateEnd") ?? ""}
              />
            </Box>
          </Box>
          <Box className="pb-4 w-full flex flex-row justify-between">
            <div className="w-1/2">
              <MyControlledCheckbox
                name="isInbound"
                displayName="Inbound"
                control={control}
                errors={errors}
                rules={{}}
                value={isInbound}
                customOnChange={(val: boolean) => {
                  setIsInbound(val);
                }}
              />
            </div>
            <div className="w-1/2">
              <MyControlledCheckbox
                name="showAchNoc"
                displayName="Show ACH NOC"
                control={control}
                errors={errors}
                rules={{}}
                value={showAchNoc}
                customOnChange={(val: boolean) => {
                  setShowAchNoc(val);
                }}
              />
            </div>
          </Box>
          <Box className="w-full flex flex-row justify-between">
            <div className="w-1/2">
              <MyControlledCheckbox
                name="excludeWire"
                displayName="Exclude Wire"
                control={control}
                errors={errors}
                rules={{}}
                value={excludeWire}
                customOnChange={(val: boolean) => {
                  setExcludeWire(val);
                }}
              />
            </div>
            <div className="w-1/2">
              <MyControlledCheckbox
                name="excludeAch"
                displayName="Exclude Ach"
                control={control}
                errors={errors}
                rules={{}}
                value={excludeAch}
                customOnChange={(val: boolean) => {
                  setExcludeAch(val);
                }}
              />
            </div>
          </Box>
          <Box className="flex flex-row justify-between pb-10">
            <Box className="w-32 pt-6">
              <MyTextButton
                onClick={() => {
                  reset({
                    counterpartyId: "",
                    customerId: "",
                    settlementFileName: "",
                    direction: "",
                    wireFileHandle: "",
                    isInbound: false,
                    excludeWire: false,
                    excludeAch: false,
                    showAchNoc: false,
                    accountNumber: "",
                    processingStatus: [],
                    beginDate: undefined,
                    endDate: undefined,
                    postDateStart: undefined,
                    postDateEnd: undefined,
                    maxAmount: "",
                    minAmount: "",
                    productId: "",
                    transactionStatus: [],
                    transactionType: [],
                    paymentId: "",
                    originalFileName: "",
                    requesterIpAddress: "",
                    requesterUsername: "",
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
