"use client";

import { useAppDispatch } from "@/redux/store/store";
import MyBlueButton from "../../Button/MyBlueButton";
import { useEffect, useState } from "react";
import MyModal from "../../my_modal";
import MyText from "../../Text/Text";
import { SubmitHandler, useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import MyRedButton from "../../Button/MyRedButton";
import { useSelector } from "react-redux";
import { Transaction } from "@/core/api/ApiTypes";
import {
  cancelTransaction,
  fetchTransactions,
} from "@/redux/slices/TransactionSlice";
import MyControlledTextField from "../../TextField/MyControlledTextField";

const CancelTransactionButton = () => {
  const dispatch = useAppDispatch();

  const transactions: "loading" | string | Transaction[] = useSelector(
    (state: any) => state.transaction.transactions
  );

  const transSearchCriteria: any = useSelector(
    (state: any) => state.transaction.criteria
  );

  const [showButton, setShowButton] = useState<boolean>(true);

  const [modalOpen, setModalOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const {
    formState: { errors },
    control,
    handleSubmit,
    getValues,
    setValue,
  } = useForm<{
    reason: string;
  }>();
  const onSubmit: SubmitHandler<{
    reason: string;
  }> = (data: { reason: string }) => {
    console.log("data:", data);
    if (!showButton) {
      return;
    }
    setSubmitting(true);

    dispatch(
      cancelTransaction({
        paymentId: (transactions?.[0] as any)?.paymentId,
        reason: data.reason,
      })
    ).then((d: any) => {
      setSubmitting(false);
      if (typeof d.payload == "string") {
        enqueueSnackbar(d.payload, { variant: "error", persist: true });
      } else {
        handleModalClose();
        dispatch(
          fetchTransactions({
            criteria: transSearchCriteria,
            refresh: true,
          })
        );
        enqueueSnackbar("Transaction cancelled successfully", {
          variant: "success",
        });
      }
    });
  };

  useEffect(() => {
    if (typeof transactions != "string") {
      if (
        transactions.length > 0 &&
        (transactions?.[0] as any)?.processingStatus == "INITIATED" &&
        (transactions?.[0]?.wire != null || transactions?.[0]?.ach != null)
      ) {
        setShowButton(true);
      }
    }
  }, [transactions]);

  return !showButton ? (
    <></>
  ) : (
    <>
      <div className="w-fit">
        <MyRedButton
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Cancel Transaction
        </MyRedButton>
      </div>
      <MyModal
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
        height="260px"
      >
        <MyText size="lg">Cancel Transaction</MyText>
        <div className="pb-6" />
        <MyText>Reason</MyText>
        <MyControlledTextField
          name={"reason"}
          displayName={"Reason"}
          control={control}
          errors={errors}
          rules={{
            required: true,
          }}
          value={getValues("reason")}
        />
        <div className="pb-8" />
        <div className="w-fit">
          <MyBlueButton
            submitting={submitting}
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
          >
            Cancel Transaction
          </MyBlueButton>
        </div>
        <div className="pb-6" />
      </MyModal>
    </>
  );
};

export default CancelTransactionButton;
