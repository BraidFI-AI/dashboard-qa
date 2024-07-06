"use client";

import { CreateLimit } from "@/core/api/ApiTypes";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyText from "@/core/components/Text/Text";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import {
  TransactionTypesType,
  fetchTransactionTypes,
} from "@/redux/slices/AppSlice";
import { createLimit } from "@/redux/slices/RulesAndLimitsSlice";
import { useAppDispatch } from "@/redux/store/store";
import Box from "@mui/material/Box";
import { useParams, useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const CreateLimitPage = () => {
  const router = useRouter();
  const params = useParams();

  const dispatch = useAppDispatch();

  const [limitType, setLimitType] = useState<string>(
    "MAX_SINGLE_TRANSACTION_PRODUCT"
  );

  const transactionTypes: TransactionTypesType = useSelector(
    (state: any) => state.app.transactionTypes
  );

  const [submitting, setSubmitting] = useState(false);

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    getValues,
    handleSubmit,
  } = useForm<CreateLimit>();
  const onSubmit: SubmitHandler<CreateLimit> = (data: CreateLimit) => {
    data = { ...data, productId: parseInt(params.id.toString()) };
    console.log(data);

    setSubmitting(true);

    dispatch(createLimit(data)).then((r: any) => {
      if (typeof r.payload != "string") {
        enqueueSnackbar("Limit created", { variant: "success" });
        router.back();
      } else {
        enqueueSnackbar(r.payload, { variant: "error", persist: true });
      }
      setSubmitting(false);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-6">
      <Box className="flex flex-col w-[300px]">
        <MyText>Rule Name</MyText>
        <MyControlledTextField
          name="limitName"
          displayName="Limit name"
          control={control}
          errors={errors}
          rules={
            submitting
              ? { required: false }
              : {
                  required: true,
                }
          }
          value=""
        />
        <Box className="pb-4"></Box>
        <MyText>Product ID</MyText>
        <MyText size="md">{params.id.toString()}</MyText>
        <Box className="pb-4"></Box>
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
          <MyControlledAutocomplete
            value={transactionTypes[0]}
            displayName="Transaction Type"
            name={"transactionType"}
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
          />
        )}
        <Box className="pb-4"></Box>
        <MyText>Limit type</MyText>
        <MyControlledAutocomplete
          value={"MAX_SINGLE_TRANSACTION_PRODUCT"}
          displayName="Limit type"
          name={"limitType"}
          control={control}
          errors={errors}
          rules={
            submitting
              ? { required: false }
              : {
                  required: true,
                }
          }
          customOnChange={(v: string) => {
            setLimitType(v);
          }}
          options={["MAX_SINGLE_TRANSACTION_PRODUCT", "PRODUCT_LEVEL"]}
        />
        <Box className="pb-4"></Box>
        <MyText>Action</MyText>
        <MyControlledAutocomplete
          value={"FLAG"}
          displayName="Action"
          name={"action"}
          control={control}
          errors={errors}
          rules={
            submitting
              ? { required: false }
              : {
                  required: true,
                }
          }
          customOnChange={(v: string) => {
            setLimitType(v);
          }}
          options={["FLAG", "DECLINE"]}
        />
        <Box className="pb-4"></Box>
        <MyText>Amount</MyText>
        <MyControlledTextField
          name="amount"
          displayName="Amount"
          control={control}
          errors={errors}
          rules={
            submitting || getValues("frequencyMax")
              ? { required: false }
              : {
                  required: true,
                  pattern: /^(0|[1-9]\d*)(\.\d+)?$/,
                }
          }
          value=""
        />
        <Box className="pb-4"></Box>
        {limitType == "PRODUCT_LEVEL" && (
          <>
            <MyText>{"Duration (days)"}</MyText>
            <MyControlledTextField
              name="durationDays"
              displayName="Duration"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: true,
                      pattern: /^[0-9]+$/,
                    }
              }
              value=""
            />
            <Box className="pb-4"></Box>
          </>
        )}
        <MyText>Frequency (optional)</MyText>
        <MyControlledTextField
          name="frequencyMax"
          displayName="Frequency"
          control={control}
          errors={errors}
          rules={
            submitting
              ? { required: false }
              : {
                  pattern: /^[0-9]+$/,
                }
          }
          value=""
        />
        <Box className="pb-10"></Box>
        <div className="w-fit">
          <MyBlueButton submitting={submitting} type="submit">
            Create limit
          </MyBlueButton>
        </div>
      </Box>
    </form>
  );
};

export default CreateLimitPage;
