"use client";

import { WireInbound } from "@/core/api/ApiTypes";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyText from "@/core/components/Text/Text";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import MyModal from "@/core/components/my_modal";
import { processInboundWire } from "@/redux/slices/wire_processing_slice";
import { useAppDispatch } from "@/redux/store/store";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type InboundWireForm = {
  handleModalClose: any;
  modalOpen: boolean;
  submitting: boolean;
  setSubmitting: any;
};

const InboundWireForm: React.FC<InboundWireForm> = ({
  modalOpen,
  handleModalClose,
  submitting,
  setSubmitting,
}) => {
  const dispatch = useAppDispatch();

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
  } = useForm<WireInbound>();
  const onSubmit: SubmitHandler<WireInbound> = (data: WireInbound) => {
    console.log("data:", data);
    setSubmitting(true);

    dispatch(processInboundWire(data)).then((result) => {
      if (typeof result.payload == "string") {
        enqueueSnackbar(result.payload, { variant: "error", persist: true });
      } else {
        enqueueSnackbar("Inbound wire processed", { variant: "success" });
        handleModalClose();
      }
      setSubmitting(false);
    });
  };

  return (
    (<MyModal modalOpen={modalOpen} handleModalClose={handleModalClose}>
      <MyText size="lg">Inbound wire processing</MyText>
      <div className="pb-6" />
      <MyText>Originator bank name</MyText>
      <MyControlledTextField
        name={"originatorBankName"}
        displayName={"Originator bank name"}
        control={control}
        errors={errors}
        rules={{
          required: true,
        }}
        value=""
      />
      <div className="pb-4" />
      <MyText>Originator account number</MyText>
      <MyControlledTextField
        name={"originatorAccountNumber"}
        displayName={"Originator account number"}
        control={control}
        errors={errors}
        rules={{
          required: true,
        }}
        value=""
      />
      <div className="pb-4" />
      <MyText>Originator routing number</MyText>
      <MyControlledTextField
        name={"originatorRoutingNumber"}
        displayName={"Originator routing number"}
        control={control}
        errors={errors}
        rules={{
          required: true,
        }}
        value=""
      />
      <div className="pb-4" />
      <MyText>Originator to Beneficiary info</MyText>
      <MyControlledTextField
        name={"originatorToBeneficiaryInfo"}
        displayName={"Originator to Beneficiary info"}
        control={control}
        errors={errors}
        rules={{
          required: true,
        }}
        value=""
      />
      <div className="pb-4" />
      <MyText>Beneficiary account number</MyText>
      <MyControlledTextField
        name={"beneficiaryAccountNumber"}
        displayName={"Beneficiary account number"}
        control={control}
        errors={errors}
        rules={{
          required: true,
        }}
        value=""
      />
      <div className="pb-4" />
      <MyText>Amount</MyText>
      <MyControlledTextField
        name={"amount"}
        displayName={"Amount"}
        control={control}
        errors={errors}
        rules={{
          required: true,
          pattern: /^(0|[1-9]\d*)(\.\d+)?$/,
        }}
        value=""
      />
      <div className="pb-4" />
      <MyText>IMAD</MyText>
      <MyControlledTextField
        name={"imad"}
        displayName={"IMAD"}
        control={control}
        errors={errors}
        rules={{
          required: true,
        }}
        value=""
      />
      <div className="pb-4" />
      <MyText>OMAD</MyText>
      <MyControlledTextField
        name={"omad"}
        displayName={"OMAD"}
        control={control}
        errors={errors}
        rules={{
          required: true,
        }}
        value=""
      />
      <div className="pb-8" />
      <div className="w-fit">
        <MyBlueButton
          submitting={submitting}
          onClick={() => {
            handleSubmit(onSubmit)();
          }}
        >
          Process
        </MyBlueButton>
      </div>
      <div className="pb-6" />
    </MyModal>)
  );
};

export default InboundWireForm;
