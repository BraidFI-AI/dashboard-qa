"use client";

import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyText from "@/core/components/Text/Text";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import ConfirmTransaction from "./confirm_transaction";
import { adjustmentTransaction } from "@/redux/slices/new_transaction_slice";
import { useAppDispatch } from "@/redux/store/store";
import { enqueueSnackbar } from "notistack";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import RadioButton from "@/core/components/Button/RadioButton";

export default function AdjustmentTransaction() {
  const dispatch = useAppDispatch();

  const [submitting, setSubmitting] = useState(false);

  const [direction, setDirection] = useState("DEBIT");

  const [modalOpen, setModalOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      accountNumber: "",
      amount: "",
      subType: "",
      description: "",
    },
  });

  const onSubmit: SubmitHandler<{
    accountNumber: string;
    amount: string;
    subType: string;
    description: string;
  }> = (data: {
    accountNumber: string;
    amount: string;
    subType: string;
    description: string;
  }) => {
    console.log(data);

    setModalOpen(true);
  };

  return (
    <>
      <ConfirmTransaction
        height="335px"
        submitting={submitting}
        data={[
          {
            key: "Account Number",
            value: getValues("accountNumber"),
          },
          {
            key: "Amount",
            value: getValues("amount"),
          },
          {
            key: "Direction",
            value: direction,
          },
          {
            key: "Type",
            value: getValues("subType"),
          },
          {
            key: "Description",
            value: getValues("description"),
          },
        ]}
        onConfirm={() => {
          setSubmitting(true);
          dispatch(
            adjustmentTransaction({
              accountNumber: getValues("accountNumber"),
              amount: parseFloat(getValues("amount")),
              direction: direction,
              subType: getValues("subType"),
              description: getValues("description"),
            })
          ).then((res: any) => {
            console.log("res:", res);
            setSubmitting(false);
            if (typeof res.payload != "string") {
              enqueueSnackbar("Adjustment successful", { variant: "success" });
              reset({
                accountNumber: "",
                amount: "",
                subType: "",
                description: "",
              });
              setDirection("DEBIT");
              setModalOpen(false);
            } else {
              enqueueSnackbar("Adjustment failed", { variant: "error" });
            }
          });
        }}
        modalOpen={modalOpen}
        handleModalClose={() => {
          setModalOpen(false);
        }}
      />
      <div className="w-[500px]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-2 justify-between items-center">
            <MyText>Account Number</MyText>
            <div className="w-[300px]">
              <MyControlledTextField
                name="accountNumber"
                displayName="Account Number"
                control={control}
                errors={errors}
                rules={{ required: true }}
                value={getValues("accountNumber")}
              />
            </div>
          </div>
          <div className="flex flex-row gap-2 justify-between items-center">
            <MyText>Amount</MyText>
            <div className="w-[300px] flex flex-row items-center gap-1">
              <MyText size="md">$</MyText>
              <MyControlledTextField
                name="amount"
                displayName="Amount"
                control={control}
                errors={errors}
                rules={{ required: true }}
                value={getValues("amount")}
              />
            </div>
          </div>
          <div className="flex flex-row gap-2 justify-between items-center">
            <MyText>Direction</MyText>
            <div className="w-[300px] flex flex-row items-center">
              <RadioButton
                value={direction}
                setValue={(value: string) => {
                  setDirection(value);
                }}
                options={["DEBIT", "CREDIT"]}
                layout="horizontal"
              />
            </div>
          </div>

          <div className="flex flex-row gap-2 justify-between items-center">
            <MyText>Type</MyText>
            <div className="w-[300px]">
              <MyControlledAutocomplete
                name="subType"
                displayName="Type"
                control={control}
                errors={errors}
                rules={{ required: true }}
                value={getValues("subType")}
                options={
                  direction == "CREDIT"
                    ? [
                        "NEGATIVE_BALANCE_CLEARING",
                        "PROVISIONAL_CREDIT",
                        "FEE_REFUND",
                        "TRANSACTION_REVERSAL",
                        "TRANSACTION_ADJUSTMENT",
                      ]
                    : [
                        "NEGATIVE_BALANCE_CLEARING",
                        "PROVISIONAL_DEBIT",
                        "COLLECTION",
                      ]
                }
              />
            </div>
          </div>
          <div className="flex flex-row gap-2 justify-between items-center">
            <MyText>Description</MyText>
            <div className="w-[300px]">
              <MyControlledTextField
                name="description"
                displayName="Description"
                control={control}
                errors={errors}
                rules={{ required: true }}
                value={getValues("description")}
              />
            </div>
          </div>
          <div className="pt-5 w-fit self-end">
            <MyBlueButton
              submitting={submitting}
              onClick={() => {
                handleSubmit(onSubmit)();
              }}
            >
              Create Transfer
            </MyBlueButton>
          </div>
        </div>
      </div>
    </>
  );
}
