"use client";

import { CreateFee, TieredFee } from "@/core/api/ApiTypes";
import { useAppDispatch } from "@/redux/store/store";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import MyText from "@/core/components/Text/Text";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import RadioButton from "@/core/components/Button/RadioButton";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { createFee, refreshFees } from "@/redux/slices/FeeSlice";
import { enqueueSnackbar } from "notistack";
import {
  TransactionTypesType,
  fetchTransactionTypes,
} from "@/redux/slices/AppSlice";
import { useSelector } from "react-redux";
import MyCircularProgressIndicator from "../../circular_progress_indicator";
import ErrorPage from "../../error_page";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Drawer, IconButton, Tooltip } from "@mui/material";
import React from "react";
import MyControlledMultiAutocomplete from "../../Autocomplete/MyControlledMultiAutocomplete";
import TieredFeeComponent from "./tiered_fee";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

type CreateFeeViewProps = {
  level: "PRODUCT" | "ACCOUNT" | "PROGRAM" | "GLOBAL";
  ids: string[];
  disabled?: boolean;
};

const CreateFeeView: React.FC<CreateFeeViewProps> = ({
  level,
  ids,
  disabled = false,
}) => {
  const dispatch = useAppDispatch();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [associatedIds, setAssociatedIds] = useState(ids);

  const [associatedEntityId, setAssociatedEntityId] = useState(ids[0] ?? "");
  const [associatedEntityType, setAssociatedEntityType] = useState(level);
  const transactionTypes: TransactionTypesType = useSelector(
    (state: any) => state.app.transactionTypes
  );

  const [submitting, setSubmitting] = useState(false);

  const [feeType, setFeeType] = useState("FLAT");

  const [tranTypes, setTranTypes] = useState<string[]>([]);
  const [tranGroups, setTranGroups] = useState<string[]>([]);
  const [parameterType, setParameterType] =
    useState<string>("Transaction Types");

  const [tieredFee, setTieredFee] = useState<TieredFee[]>([]);

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    getValues,
    setValue,
    handleSubmit,
  } = useForm<CreateFee>();
  const onSubmit: SubmitHandler<CreateFee> = (data: CreateFee) => {
    if (feeType == "MONTHLY") {
      data.feeChargingAccountId = undefined;
    }

    if (data.feeChargingAccountId == "" || data.feeChargingAccountId == null) {
      data.feeChargingAccountId = undefined;
    }

    console.log("data", data);

    setSubmitting(true);
    dispatch(createFee({ ...data, tieredFeeDetails: tieredFee })).then(
      (d: any) => {
        if (typeof d.payload != "string") {
          enqueueSnackbar("Fee added successfully", { variant: "success" });
          closeDrawer();
          dispatch(refreshFees());
          setSubmitting(false);
          return;
        }
        enqueueSnackbar(d.payload, { variant: "error" });
        setSubmitting(false);
      }
    );
  };

  const closeDrawer = () => {
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

  return (
    <>
      <Box className="w-auto">
        {!drawerOpen && (
          <div>
            <MyBlueButton onClick={toggleDrawer(true)}>
              Create Fees
            </MyBlueButton>
          </div>
        )}
      </Box>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          className: "w-[700px]",
        }}
      >
        <Box className="flex flex-col px-4 pt-[20px] max-w-full">
          <div className="flex flex-row h-fit items-center">
            <div className="w-[5px] h-[40px] bg-[#12A7FF] mr-[10px]" />
            <MyText size="lg">Create Fees</MyText>
          </div>
          <Box className="pb-8"></Box>
          <form onSubmit={handleSubmit(onSubmit)} className="pb-6">
            <Box className="flex flex-col w-[620px]">
              <div className="flex flex-row gap-4">
                <div className="w-full">
                  <MyText>Fee amount/ Percentage</MyText>
                  <MyControlledTextField
                    name="amount"
                    displayName="Fee Amount"
                    control={control}
                    errors={errors}
                    rules={
                      submitting
                        ? { required: false, pattern: null }
                        : {
                            required: tieredFee.length > 0 ? false : true,
                            pattern: /^(0|[1-9]\d*)(\.\d+)?$/,
                          }
                    }
                    value=""
                  />
                </div>
                <div className="w-full">
                  <MyText>Fee Type</MyText>
                  <MyControlledAutocomplete
                    value={"FLAT"}
                    displayName="Fee Type"
                    name={"type"}
                    control={control}
                    errors={errors}
                    rules={
                      submitting
                        ? { required: false }
                        : {
                            required: true,
                          }
                    }
                    options={["FLAT", "PERCENT", "MONTHLY"]}
                    customOnChange={(val: any) => {
                      setFeeType(val);
                    }}
                  />
                </div>
              </div>
              <Box className="pb-4"></Box>
              <div className="flex flex-row gap-4">
                <div className="w-full">
                  <MyText>Settlement Account</MyText>
                  <MyControlledTextField
                    value={""}
                    displayName="Account"
                    name={"settlementAccountId"}
                    control={control}
                    errors={errors}
                    rules={
                      submitting
                        ? { required: false }
                        : {
                            required: false,
                          }
                    }
                  />
                </div>
                <div className="w-full">
                  {feeType != "MONTHLY" && (
                    <>
                      <div className="flex flex-row items-center">
                        <MyText>Charging Account</MyText>
                        <Tooltip title="Leave this field empty if the account owner pays the fee. If someone else pays, their information should be entered">
                          <ErrorOutlineIcon
                            style={{ height: "16px", color: "#12A7FF" }}
                          />
                        </Tooltip>
                      </div>
                      <MyControlledTextField
                        value={""}
                        displayName="Charging Account"
                        name={"feeChargingAccountId"}
                        control={control}
                        errors={errors}
                        // disabled={true}
                        rules={
                          submitting
                            ? { required: false }
                            : {
                                required: false,
                              }
                        }
                      />
                    </>
                  )}
                </div>
              </div>
              <Box className="pb-4"></Box>
              <div className="flex flex-row gap-4">
                {feeType == "MONTHLY" && (
                  <div className="w-full">
                    <MyText>Day of month</MyText>
                    <MyControlledTextField
                      name="dayOfMonth"
                      displayName="Day of month"
                      control={control}
                      errors={errors}
                      rules={
                        submitting
                          ? { required: false, pattern: null }
                          : {
                              required: false,
                              pattern: /^[0-9]+$/,
                            }
                      }
                      value=""
                    />
                  </div>
                )}
                <div className="w-full">
                  <MyText>Same day</MyText>
                  <MyControlledAutocomplete
                    value={"False"}
                    displayName="Same day"
                    name={"sameDay"}
                    control={control}
                    errors={errors}
                    rules={
                      submitting
                        ? { required: false }
                        : {
                            required: true,
                          }
                    }
                    options={["False", "True"]}
                  />
                </div>
              </div>
              <Box className="pb-4"></Box>
              <div className="flex flex-row gap-4">
                <div className="w-full">
                  <MyText>Associated Entity</MyText>
                  <MyControlledAutocomplete
                    value={associatedEntityType}
                    disabled={disabled}
                    displayName="Associated Entity Type"
                    name={"associatedEntityType"}
                    control={control}
                    errors={errors}
                    rules={
                      submitting
                        ? { required: false }
                        : {
                            required: true,
                          }
                    }
                    customOnChange={(val: any) => {
                      setAssociatedEntityType(val);
                    }}
                    options={["ACCOUNT", "PRODUCT", "PROGRAM", "GLOBAL"]}
                  />
                </div>
                {associatedEntityType != "GLOBAL" && (
                  <div className="w-full">
                    <MyText>Associated Entity</MyText>
                    <MyControlledTextField
                      value={associatedEntityId}
                      disabled={disabled}
                      displayName="Associated Entity ID"
                      name={"associatedEntityId"}
                      control={control}
                      errors={errors}
                      customOnChange={(val: any) => {
                        setAssociatedEntityId(val);
                      }}
                      rules={
                        submitting
                          ? { required: false }
                          : {
                              required: true,
                            }
                      }
                    />
                  </div>
                )}
              </div>
              <Box className="pb-4"></Box>

              <RadioButton
                title=""
                value={parameterType}
                setValue={(val: string) => {
                  setParameterType(val);
                  setTranGroups([]);
                  setTranTypes([]);
                  setValue("transactionTypes", []);
                  setValue("transactionGroups", []);
                }}
                options={["Transaction Types", "Transaction Groups"]}
                layout="horizontal"
              />
              <Box className="pb-4"></Box>
              <div className="w-[300px]">
                {parameterType == "Transaction Groups" ? (
                  <>
                    <MyText>Transaction Groups</MyText>
                    <MyControlledMultiAutocomplete
                      value={tranGroups}
                      displayName="Transaction Groups"
                      name={"transactionGroups"}
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
                      customOnChange={(val: string[]) => {
                        setTranGroups(val);
                      }}
                    />
                  </>
                ) : (
                  <>
                    <MyText>Transaction type</MyText>
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
                        value={tranTypes}
                        displayName="Transaction Types"
                        name={"transactionTypes"}
                        control={control}
                        errors={errors}
                        rules={{}}
                        options={transactionTypes}
                        customOnChange={(val: string[]) => {
                          setTranTypes(val);
                        }}
                      />
                    )}
                  </>
                )}
              </div>
              <Box className="pb-4"></Box>
              {tieredFee.map((fee, index) => (
                <div key={index} className="flex flex-row gap-4 items-center">
                  <MyText>
                    {`Amount: ${fee.amount} - Start Count: ${fee.startCount} - End Count: ${fee.endCount}`}
                  </MyText>
                  <IconButton
                    onClick={() => {
                      setTieredFee(tieredFee.filter((_, i) => i !== index));
                    }}
                  >
                    <DeleteOutlineRoundedIcon
                      style={{ color: "red", height: "20px", width: "20px" }}
                    />
                  </IconButton>
                </div>
              ))}
              <Box className="pb-4"></Box>
              <TieredFeeComponent
                tieredFee={tieredFee}
                setTieredFee={setTieredFee}
              />
              <Box className="pb-6"></Box>
              <Box className="w-fit">
                <MyBlueButton type="submit" submitting={submitting}>
                  Add Fee
                </MyBlueButton>
              </Box>
            </Box>
          </form>
        </Box>
      </Drawer>
    </>
  );
};

export default CreateFeeView;
