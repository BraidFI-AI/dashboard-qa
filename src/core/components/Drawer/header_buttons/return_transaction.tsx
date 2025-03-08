"use client";

import { useAppDispatch } from "@/redux/store/store";
import MyBlueButton from "../../Button/MyBlueButton";
import { useEffect, useState } from "react";
import MyModal from "../../my_modal";
import MyText from "../../Text/Text";
import { SubmitHandler, useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import MyRedButton from "../../Button/MyRedButton";
import MyControlledAutocomplete from "../../Autocomplete/MyControlledAutocomplete";
import { useSelector } from "react-redux";
import { Transaction } from "@/core/api/ApiTypes";
import { wireReturnCodes } from "@/core/constants";
import {
  fetchTransactions,
  returnWireTransaction,
} from "@/redux/slices/TransactionSlice";
import { returnAchTransaction } from "@/redux/slices/TransactionSlice";

const ReturnTransactionButton = () => {
  const dispatch = useAppDispatch();

  const transactions: "loading" | string | Transaction[] = useSelector(
    (state: any) => state.transaction.transactions
  );

  const transSearchCriteria: any = useSelector(
    (state: any) => state.transaction.criteria
  );

  const achReturnCodes: "loading" | string | string[] = useSelector(
    (state: any) => state.app.achReturnCodes
  );

  const [transactionType, setTransactionType] = useState<"ACH" | "WIRE" | null>(
    null
  );

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
    returnCode: string;
  }>();
  const onSubmit: SubmitHandler<{
    returnCode: string;
  }> = (data: { returnCode: string }) => {
    console.log("data:", data);
    if (transactionType == null) {
      return;
    }
    setSubmitting(true);

    if (transactionType == "ACH") {
      dispatch(
        returnAchTransaction({
          paymentId: (transactions?.[0] as any)?.paymentId,
          returnCode: data.returnCode,
        })
      ).then((d: any) => {
        setSubmitting(false);
        if (typeof d.payload == "string") {
          enqueueSnackbar(d.payload, { variant: "error", persist: true });
        } else {
          handleModalClose();
          dispatch(
            fetchTransactions({ criteria: transSearchCriteria, refresh: true })
          );
          enqueueSnackbar("Transaction returned successfully", {
            variant: "success",
          });
        }
      });
    } else {
      dispatch(
        returnWireTransaction({
          paymentId: (transactions?.[0] as any)?.paymentId,
          returnCode: data.returnCode,
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
          enqueueSnackbar("Transaction returned successfully", {
            variant: "success",
          });
        }
      });
    }
  };

  useEffect(() => {
    if (typeof transactions != "string") {
      if (
        transactions.length > 0 &&
        (transactions?.[0] as any)?.processingStatus?.toLowerCase() !=
          "returned"
      ) {
        setTransactionType(
          transactions[0]?.ach != null
            ? "ACH"
            : transactions[0]?.wire != null
            ? "WIRE"
            : null
        );
      }
    }
  }, [transactions]);

  return transactionType == null ? (
    <></>
  ) : (
    <>
      <div className="w-fit">
        <MyBlueButton
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Return Transaction
        </MyBlueButton>
      </div>
      <MyModal
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
        height="260px"
      >
        <MyText size="lg">Return Transaction</MyText>
        <div className="pb-6" />
        <MyText>Return Code</MyText>
        <MyControlledAutocomplete
          name={"returnCode"}
          displayName={"Return Code"}
          control={control}
          errors={errors}
          rules={{
            required: true,
          }}
          value={getValues("returnCode")}
          options={transactionType == "ACH" ? achReturnCodes : wireReturnCodes}
        />
        <div className="pb-8" />
        <div className="w-fit">
          <MyBlueButton
            submitting={submitting}
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
          >
            Return Transaction
          </MyBlueButton>
        </div>
        <div className="pb-6" />
      </MyModal>
    </>
  );
};

export default ReturnTransactionButton;
