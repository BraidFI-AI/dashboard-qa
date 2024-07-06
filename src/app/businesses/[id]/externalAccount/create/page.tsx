"use client";

import { BusinessExternalAccount } from "@/core/api/ApiTypes";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyText from "@/core/components/Text/Text";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import { createPaymentInstrument } from "@/redux/slices/BusinessSlice";
import { useAppDispatch } from "@/redux/store/store";
import { useParams, useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const CreateExternalAccountPage = () => {
  const params = useParams();
  const router = useRouter();

  const dispatch = useAppDispatch();

  const [submitting, setSubmitting] = useState(false);

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
  } = useForm<BusinessExternalAccount>();
  const onSubmit: SubmitHandler<BusinessExternalAccount> = (data: any) => {
    console.log("data:", data);
    setSubmitting(true);
    dispatch(
      createPaymentInstrument({
        id: params.id.toString(),
        paymentInstrument: data,
      })
    ).then((d: any) => {
      if (typeof d.payload == "string") {
        enqueueSnackbar(d.payload, { variant: "error", persist: true });
      } else {
        enqueueSnackbar("Payment instrument added successfully", {
          variant: "success",
        });
        router.back();
      }
      setSubmitting(false);
    });
  };

  return (
    <div className="w-[350px]">
      <MyText size="lg">Add Payment Instrument</MyText>
      <div className="h-4"></div>
      <MyText>Account number</MyText>
      <MyControlledTextField
        name="accountNumber"
        displayName="Account number"
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
      <div className="h-4"></div>
      <MyText>Bank account type</MyText>
      <MyControlledAutocomplete
        name="bankAccountType"
        displayName="Bank account type"
        control={control}
        errors={errors}
        rules={
          submitting
            ? { required: false }
            : {
                required: true,
              }
        }
        value="SAVINGS"
        options={["SAVINGS", "CHECKING"]}
      />
      <div className="h-4"></div>
      <MyText>Bank name</MyText>
      <MyControlledTextField
        name="bankName"
        displayName="Bank name"
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
      <div className="h-4"></div>
      <MyText>Routing number</MyText>
      <MyControlledTextField
        name="routingNumber"
        displayName="Routing number"
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
      <div className="h-4"></div>
      <div className="w-fit">
        <MyBlueButton
          submitting={submitting}
          onClick={() => {
            handleSubmit(onSubmit)();
          }}
        >
          Add payment instrument
        </MyBlueButton>
        <div className="h-10"></div>
      </div>
    </div>
  );
};

export default CreateExternalAccountPage;
