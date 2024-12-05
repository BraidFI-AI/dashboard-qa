"use client";

import { Fees } from "@/core/api/ApiTypes";
import { useAppDispatch } from "@/redux/store/store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import MyText from "@/core/components/Text/Text";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import RadioButton from "@/core/components/Button/RadioButton";
import { fetchProductIdsList } from "@/redux/slices/ProductSlice";
import CircularProgress from "@mui/material/CircularProgress";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { createFee } from "@/redux/slices/FeeSlice";
import { enqueueSnackbar } from "notistack";
import {
  TransactionTypesType,
  fetchTransactionTypes,
} from "@/redux/slices/AppSlice";
import { useSelector } from "react-redux";
import MyCircularProgressIndicator from "../../circular_progress_indicator";
import ErrorPage from "../../error_page";
import IconButton from "@mui/material/IconButton";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Tooltip } from "@mui/material";
import ItemRow from "../../Text/ItemRow";
import { fetchAccountNumbersList } from "@/redux/slices/AccountSlice";
import MyControlledAsyncAutocomplete from "../../Autocomplete/MyControlledAsyncAutocomplete";
import React from "react";

type CreateFeeViewProps = {
  level: "Product" | "Account";
  ids: string[];
  replaceTo: string;
};

const CreateFeeView: React.FC<CreateFeeViewProps> = ({
  level,
  ids,
  replaceTo,
}) => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const [loadingProdIds, setLoadingProdIds] = useState(true);
  const [loadingAccds, setLoadingAccIds] = useState(true);
  const [loadingSAccds, setLoadingSAccIds] = useState(true);
  const [prod, setProd] = useState("0");
  const [prodIds, setProdIds] = useState<{ id: string; name: string }[] | null>(
    null
  );
  const [accIds, setAccIds] = useState<string[] | null>(null);
  const [feeLevel, setFeeLevel] = useState<"Account" | "Product">(level);
  const [sAccIds, setSAccIds] = useState<string[] | null>(null);

  const transactionTypes: TransactionTypesType = useSelector(
    (state: any) => state.app.transactionTypes
  );

  const [submitting, setSubmitting] = useState(false);

  const [feeType, setFeeType] = useState("FLAT");

  const [tranType, setTranType] = useState("");

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    getValues,
    handleSubmit,
  } = useForm<Fees>();
  const onSubmit: SubmitHandler<Fees> = (data: Fees) => {
    if (feeLevel == "Account") {
      data.productId = undefined;
    }
    if (feeLevel == "Product") {
      data.productId = ids[0];

      data.accountNumber = undefined;
    }

    if (feeType == "MONTHLY") {
      data.tranType = undefined;
      data.feeChargingAccountNumber = undefined;
    }

    if (
      data.feeChargingAccountNumber == "" ||
      data.feeChargingAccountNumber == null
    ) {
      data.feeChargingAccountNumber = undefined;
    }

    console.log("data", data);

    setSubmitting(true);
    dispatch(createFee(data)).then((d: any) => {
      if (typeof d.payload != "string") {
        enqueueSnackbar("Fee added successfully", { variant: "success" });
        router.back();
        return;
      }
      enqueueSnackbar(d.payload, { variant: "error" });
      setSubmitting(false);
    });
  };

  useEffect(() => {
    dispatch(fetchProductIdsList()).then((pIds: any) => {
      if (pIds.payload) {
        setProd(pIds.payload[0].id);
      }
      setProdIds(pIds.payload);
      setLoadingProdIds(false);
    });

    // dispatch(fetchAccountNumbersList()).then((acc: any) => {
    //   setSAccIds(acc.payload);
    //   setLoadingSAccIds(false);
    // });

    setAccIds(ids);
    setLoadingAccIds(false);
  }, [dispatch, ids]);

  return (
    (<form onSubmit={handleSubmit(onSubmit)} className="pb-6">
      <Box className="flex flex-col w-[420px]">
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
                  required: true,
                  pattern: /^(0|[1-9]\d*)(\.\d+)?$/,
                }
          }
          value=""
        />
        <Box className="pb-4"></Box>
        <MyText>Fee Type</MyText>
        <MyControlledAutocomplete
          value={"FLAT"}
          displayName="Fee Type"
          name={"feeType"}
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
        <Box className="pb-4"></Box>
        {tranType?.toLowerCase()?.includes("ach") ? (
          <>
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
          </>
        ) : (
          <div className="flex flex-row items-center">
            <MyText>Same Day:</MyText>
            <div className="pr-2" />
            <MyText size="md">False</MyText>
          </div>
        )}
        <Box className="pb-4"></Box>
        {feeType == "MONTHLY" && (
          <>
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
            <Box className="pb-4"></Box>
          </>
        )}
        {feeType != "MONTHLY" && (
          <>
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
                value={transactionTypes[0]}
                displayName="Transaction Type"
                name={"tranType"}
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                options={transactionTypes}
                customOnChange={(val: any) => {
                  setTranType(val);
                }}
              />
            )}
            <Box className="pb-4"></Box>
          </>
        )}
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
              name={"feeChargingAccountNumber"}
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
            <Box className="pb-4"></Box>
          </>
        )}
        <MyText>Settlement Account</MyText>
        <MyControlledAsyncAutocomplete
          displayName="Account"
          name={"settlementAccountNumber"}
          control={control}
          errors={errors}
          rules={
            submitting
              ? { required: false }
              : {
                  required: true,
                }
          }
          fetchOptions={async (query: any, page: any) => {
            const accNumbers: any = await dispatch(
              fetchAccountNumbersList(page)
            );

            if (typeof accNumbers.payload == "string") {
              return accNumbers.payload;
            } else {
              return {
                data: accNumbers.payload.accountIds,
                totalPages: accNumbers.payload.totalPages,
              };
            }
          }}
        />
        <Box className="pb-4"></Box>
        <RadioButton
          title="Fee Level"
          value={feeLevel}
          setValue={setFeeLevel}
          options={["Account", "Product"]}
          layout="horizontal"
          disabled={true}
        />
        {feeLevel == "Product" && (
          <>
            <Box className="pb-4"></Box>
            <MyText>Product ID</MyText>
            {loadingProdIds ? (
              <CircularProgress size="25px" />
            ) : prodIds == null ? (
              <MyText>No Product ID found</MyText>
            ) : (
              <MyControlledAutocomplete
                value={`${
                  prodIds?.filter((p: any) => p.id == ids[0])[0].id
                } - ${prodIds?.filter((p: any) => p.id == ids[0])[0].name}`}
                displayName="Product ID"
                name={"productId"}
                control={control}
                errors={errors}
                disabled={true}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: false,
                      }
                }
                options={prodIds.map((prd) => {
                  return `${prd.id} - ${prd.name}`;
                })}
                customOnChange={(val: any) => {
                  const id = val?.split(" - ")[0];
                  if (id) {
                    setProd(id);
                  }
                }}
              />
            )}
          </>
        )}
        {feeLevel == "Account" && (
          <>
            <Box className="pb-4"></Box>
            <MyText>Triggering Account</MyText>
            {loadingAccds ? (
              <CircularProgress size="25px" />
            ) : accIds == null ? (
              <MyText>No Account found</MyText>
            ) : (
              <MyControlledAutocomplete
                value={accIds[0]}
                displayName="Account"
                name={"accountNumber"}
                control={control}
                errors={errors}
                // disabled={true}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                options={accIds}
              />
            )}
          </>
        )}
        <Box className="pb-6"></Box>
        <Box className="w-fit">
          <MyBlueButton type="submit" submitting={submitting}>
            Add Fee
          </MyBlueButton>
        </Box>
      </Box>
    </form>)
  );
};

export default CreateFeeView;
