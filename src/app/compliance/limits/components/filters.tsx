"use client";

import { VelocityLimitFilters } from "@/core/api/ApiTypes";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyTextButton from "@/core/components/Button/MyTextButton";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import MyText from "@/core/components/Text/Text";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import {
  fetchTransactionTypes,
  TransactionTypesType,
} from "@/redux/slices/AppSlice";
import { useAppDispatch } from "@/redux/store/store";
import { Drawer } from "@mui/material";

import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form";
import { useSelector } from "react-redux";

const VelocityLimitFiltersTab = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const transactionTypes: TransactionTypesType = useSelector(
    (state: any) => state.app.transactionTypes
  );

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

  const {
    formState: { errors },
    control,
    handleSubmit,
    getValues,
    reset,
  } = useForm<VelocityLimitFilters>();
  const onSubmit: SubmitHandler<VelocityLimitFilters> = (data: any) => {
    console.log("data:", data);

    if (data.accountNumber == null || data.accountNumber == "") {
      data.accountNumber = undefined;
    }

    if (data.counterpartyId == null || data.counterpartyId == "") {
      data.counterpartyId = undefined;
    }

    if (data.productId == null || data.productId == "") {
      data.productId = undefined;
    }

    if (data.programId == null || data.programId == "") {
      data.programId = undefined;
    }

    if (data.limitName == null || data.limitName == "") {
      data.limitName = undefined;
    }

    if (data.limitType == null || data.limitType == "") {
      data.limitType = undefined;
    }

    if (data.status == null || data.status == "") {
      data.status = undefined;
    }

    if (data.aggregationLevel == null || data.aggregationLevel == "") {
      data.aggregationLevel = undefined;
    }

    if (data.action == null || data.action == "") {
      data.action = undefined;
    }

    if (data.transactionType == null || data.transactionType == "") {
      data.transactionType = undefined;
    }

    if (data.transactionGroup == null || data.transactionGroup == "") {
      data.transactionGroup = undefined;
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

    router.replace(`/compliance/limits${params}`);
  };

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
          className: "w-[500px]",
        }}
      >
        <Box className="flex flex-col px-4 pt-8 max-w-full">
          <MyText size="lg">Velocity Limit Filters</MyText>
          <Box className="flex flex-col pt-6">
            <div className="flex flex-row justify-between gap-4">
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
              <Box className="pb-4 w-full">
                <MyText>Counterparty ID</MyText>
                <MyControlledTextField
                  name="counterpartyId"
                  displayName="Counterparty ID"
                  control={control}
                  errors={errors}
                  rules={{}}
                  value={getValues("counterpartyId")}
                />
              </Box>
            </div>
            <div className="flex flex-row justify-between gap-4">
              <Box className="pb-4 w-full">
                <MyText>Product ID</MyText>
                <MyControlledTextField
                  name="productId"
                  displayName="Product ID"
                  control={control}
                  errors={errors}
                  rules={{}}
                  value={getValues("productId")}
                />
              </Box>
              <Box className="pb-4 w-full">
                <MyText>Program ID</MyText>
                <MyControlledTextField
                  name="programId"
                  displayName="Program ID"
                  control={control}
                  errors={errors}
                  rules={{}}
                  value={getValues("programId")}
                />
              </Box>
            </div>
            <div className="flex flex-row justify-between gap-4">
              <Box className="pb-4 w-full">
                <MyText>Limit Name</MyText>
                <MyControlledTextField
                  name="limitName"
                  displayName="Limit Name"
                  control={control}
                  errors={errors}
                  rules={{}}
                  value={getValues("limitName")}
                />
              </Box>
              <Box className="pb-4 w-full">
                <MyText>Limit Type</MyText>
                <MyControlledAutocomplete
                  value={getValues("limitType") ?? ""}
                  displayName="Limit Type"
                  name={"limitType"}
                  control={control}
                  errors={errors}
                  rules={{}}
                  options={[
                    "TRANSACTION_LIMIT",
                    "RECEIVER_MATCH",
                    "RESTRICTED_ENTITY",
                    "ROUNDED_NUMBER",
                  ]}
                />
              </Box>
            </div>
            <div className="flex flex-row justify-between gap-4">
              <Box className="pb-4 w-full">
                <MyText>Status</MyText>
                <MyControlledAutocomplete
                  value={getValues("status") ?? ""}
                  displayName="Status"
                  name={"status"}
                  control={control}
                  errors={errors}
                  rules={{}}
                  options={[
                    "INACTIVE",
                    "ACTIVE",
                    "DELETED",
                    "PENDING_DEACTIVATION",
                  ]}
                />
              </Box>
              <Box className="pb-4 w-full">
                <MyText>Aggregation Level</MyText>
                <MyControlledAutocomplete
                  value={getValues("aggregationLevel") ?? ""}
                  displayName="Aggregation Level"
                  name={"aggregationLevel"}
                  control={control}
                  errors={errors}
                  rules={{}}
                  options={[
                    "TRANSACTION",
                    "ACCOUNT_COUNTERPARTY",
                    "ACCOUNT",
                    "PRODUCT",
                    "PROGRAM",
                    "GLOBAL",
                  ]}
                />
              </Box>
            </div>
            <div className="flex flex-row justify-between gap-4">
              <Box className="pb-4 w-full">
                <MyText>Action</MyText>
                <MyControlledAutocomplete
                  value={getValues("action") ?? ""}
                  displayName="Action"
                  name={"action"}
                  control={control}
                  errors={errors}
                  rules={{}}
                  options={["DECLINE", "FLAG"]}
                />
              </Box>
              <Box className="pb-4 w-full">
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
                  <MyControlledAutocomplete
                    value={getValues("transactionType") ?? ""}
                    displayName="Transaction Type"
                    name={"transactionType"}
                    control={control}
                    errors={errors}
                    rules={{}}
                    options={transactionTypes}
                  />
                )}
              </Box>
            </div>
            <div className="flex flex-row justify-between gap-4">
              <Box className="pb-4 w-full">
                <MyText>Transaction Group</MyText>
                <MyControlledAutocomplete
                  value={getValues("transactionGroup") ?? ""}
                  displayName="Transaction Group"
                  name={"transactionGroup"}
                  control={control}
                  errors={errors}
                  rules={{}}
                  options={[
                    "ALL_TRANSACTION",
                    "ALL_CREDIT",
                    "ALL_DEBIT",
                    "ALL_ACH",
                    "ALL_WIRE",
                  ]}
                />
              </Box>
              <Box className="pb-4 w-full"></Box>
            </div>
            <Box className="flex flex-row justify-between pb-10">
              <Box className="w-32 pt-6">
                <MyTextButton
                  onClick={() => {
                    reset({
                      accountNumber: undefined,
                      counterpartyId: undefined,
                      productId: undefined,
                      programId: undefined,
                      limitName: undefined,
                      limitType: "",
                      status: "",
                      aggregationLevel: "",
                      action: "",
                      transactionType: "",
                      transactionGroup: "",
                    });
                    setDrawerOpen(false);

                    router.replace(`/compliance/limits`);
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
        </Box>
      </Drawer>
    </React.Fragment>
  );
};

export default VelocityLimitFiltersTab;
