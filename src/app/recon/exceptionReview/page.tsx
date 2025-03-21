"use client";

import RadioButton from "@/core/components/Button/RadioButton";
import MyControlledDatePicker from "@/core/components/DateTimePicker/MyControlledDateTimePicker";
import { Moment } from "moment";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import moment from "moment";
import MyText from "@/core/components/Text/Text";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { useAppDispatch } from "@/redux/store/store";
import { fetchTransactionsPaginated } from "@/redux/slices/recon_exception_review_slice";
import { useSelector } from "react-redux";
import { Transaction } from "@/core/api/ApiTypes";

const ExceptionReview = () => {
  const dispatch = useAppDispatch();

  const [transactionType, setTransactionType] = useState<"ACH" | "WIRE">("ACH");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const transactions: "initial" | "loading" | string | Transaction[] =
    useSelector(
      (state: any) => state.reconExceptionReview.transactionsPaginated
    );

  const {
    formState: { errors },
    control,
    handleSubmit,
    getValues,
  } = useForm<{
    beginDate: Moment;
    endDate: Moment;
  }>();
  const onSubmit: SubmitHandler<{
    beginDate: Moment;
    endDate: Moment;
  }> = (data: { beginDate: Moment; endDate: Moment }) => {
    console.log("data:", data);
    setSubmitting(true);
    dispatch(
      fetchTransactionsPaginated({
        beginDate: data.beginDate,
        endDate: data.endDate,
        transactionType: transactionType,
        refresh: true,
      })
    ).then((res: any) => {
      setSubmitting(false);
    });
  };

  return (
    <div>
      <div className="flex flex-row gap-4">
        <div className="w-[300px]">
          <MyText size="sm">Start Date</MyText>
          <MyControlledDatePicker
            name="beginDate"
            displayName="Start Date"
            control={control}
            errors={errors}
            rules={{
              required: true,
              validate: (value: any) => {
                const dateObject = moment(value.toString());
                if (dateObject.isValid() == false) {
                  return "Invalid Date";
                } else {
                  return true;
                }
              },
            }}
            value=""
          />
        </div>
        <div className="w-[300px]">
          <MyText size="sm">End Date</MyText>
          <MyControlledDatePicker
            name="endDate"
            displayName="End Date"
            control={control}
            errors={errors}
            rules={{
              required: true,
              validate: (value: any) => {
                const dateObject = moment(value.toString());
                if (dateObject.isValid() == false) {
                  return "Invalid Date";
                } else {
                  return true;
                }
              },
            }}
            value=""
          />
        </div>
        <div className="w-[300px]">
          <MyText size="sm">Transaction Type</MyText>
          <div className="pb-[7px]"></div>
          <RadioButton
            title=""
            value={transactionType}
            setValue={setTransactionType}
            options={["ACH", "WIRE"]}
            layout="horizontal"
          />
        </div>
      </div>
      <div className="w-fit pt-4">
        <MyBlueButton onClick={handleSubmit(onSubmit)} submitting={submitting}>
          Search
        </MyBlueButton>
      </div>
    </div>
  );
};

export default ExceptionReview;
