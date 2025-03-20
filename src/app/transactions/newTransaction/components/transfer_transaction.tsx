"use client";

import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyText from "@/core/components/Text/Text";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import ConfirmTransaction from "./confirm_transaction";
import { transferTransaction } from "@/redux/slices/new_transaction_slice";
import { useAppDispatch } from "@/redux/store/store";
import { enqueueSnackbar } from "notistack";

export default function TransferTransaction() {
  const dispatch = useAppDispatch();

  const [submitting, setSubmitting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      senderAccountNumber: "",
      recipientAccountNumber: "",
      amount: "",
      description: "",
    },
  });

  const onSubmit: SubmitHandler<{
    senderAccountNumber: string;
    recipientAccountNumber: string;
    amount: string;
    description: string;
  }> = (data: {
    senderAccountNumber: string;
    recipientAccountNumber: string;
    amount: string;
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
            key: "Sender Account Number",
            value: getValues("senderAccountNumber"),
          },
          {
            key: "Receiver Account Number",
            value: getValues("recipientAccountNumber"),
          },
          {
            key: "Amount",
            value: getValues("amount"),
          },
          {
            key: "Description",
            value: getValues("description"),
          },
        ]}
        onConfirm={() => {
          setSubmitting(true);
          dispatch(
            transferTransaction({
              amount: parseFloat(getValues("amount")),
              description: getValues("description"),
              recipientAccountNumber: getValues("recipientAccountNumber"),
              senderAccountNumber: getValues("senderAccountNumber"),
            })
          ).then((res: any) => {
            console.log("res:", res);
            setSubmitting(false);
            if (typeof res.payload != "string") {
              enqueueSnackbar("Transfer successful", { variant: "success" });
              reset({
                senderAccountNumber: "",
                recipientAccountNumber: "",
                amount: "",
                description: "",
              });
              setModalOpen(false);
            } else {
              enqueueSnackbar("Transfer failed", { variant: "error" });
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
            <MyText>Sender Account Number</MyText>
            <div className="w-[300px]">
              <MyControlledTextField
                name="senderAccountNumber"
                displayName="Sender Account Number"
                control={control}
                errors={errors}
                rules={{ required: true }}
                value={getValues("senderAccountNumber")}
              />
            </div>
          </div>
          <div className="flex flex-row gap-2 justify-between items-center">
            <MyText>Receiver Account Number</MyText>
            <div className="w-[300px]">
              <MyControlledTextField
                name="recipientAccountNumber"
                displayName="Receiver Account Number"
                control={control}
                errors={errors}
                rules={{ required: true }}
                value={getValues("recipientAccountNumber")}
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
