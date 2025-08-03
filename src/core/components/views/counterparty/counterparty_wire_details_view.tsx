"use client";

import { Counterparty } from "@/core/api/ApiTypes";
import Divider from "@mui/material/Divider";
import ItemRow from "@/core/components/Text/ItemRow";
import MyText from "@/core/components/Text/Text";
import MyExpandableButton from "@/core/components/Button/MyExpandableButton";
import MyEditButton from "@/core/components/Button/MyEditButton";
import MyEditableTextField from "@/core/components/TextField/MyEditableTextField";
import { useEffect, useState } from "react";
import { timestampToDate } from "@/core/utils/date_time_util";
import ItemRowHorizontal from "../../Text/ItemRowHorizontal";
import MyHorizontalEditableTextField from "../../TextField/horizontal_editable_textfield";
import MyBlueButton from "../../Button/MyBlueButton";
import MyTextButton from "../../Button/MyTextButton";
import { useAppDispatch } from "@/redux/store/store";
import { enqueueSnackbar } from "notistack";
import { updateCounterparty } from "@/redux/slices/CounterpartySlice";
import { SubmitHandler, useForm } from "react-hook-form";
import { gridStyle } from "@/core/constants";

type CounterpartyWireDetailsViewProps = {
  counterparty: Counterparty;
  editable?: boolean;
  counterpartyId: any;
  setRefresh: any;
};

const CounterpartyWireDetailsView: React.FC<
  CounterpartyWireDetailsViewProps
> = ({ counterparty, editable = true, counterpartyId, setRefresh }) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
    reset,
    setValue,
  } = useForm<Counterparty>({
    defaultValues: {
      ...counterparty,
    },
  });

  const onSubmit: SubmitHandler<Counterparty> = (data: Counterparty) => {
    setSubmitting(true);

    if (counterparty) {
      dispatch(
        updateCounterparty({
          id: parseInt(counterpartyId),
          counterparty: data as any,
        })
      ).then((p: any) => {
        if (typeof p.payload === "string") {
          enqueueSnackbar(p.payload, { variant: "error", persist: true });
        } else {
          setIsEditing(false);
        }
        setRefresh(true);
        setSubmitting(false);
      });
    }
  };

  useEffect(() => {
    if (!isEditing) {
      setValue("ach", counterparty?.ach);
    }
  }, [isEditing, counterparty?.ach, setValue]);

  return (
    <div className="pt-2">
      <div className={`${gridStyle} gap-x-10 gap-y-4 pb-8`}>
        <div className="h-[25px]">
          <ItemRowHorizontal
            title="ID"
            value={counterparty?.wire?.id?.toString() ?? ""}
          />
        </div>
        <div className="h-[25px]">
          <ItemRowHorizontal
            title="Wire Type"
            value={counterparty?.wire?.type ?? ""}
          />
        </div>
        <div className="h-[25px]">
          <ItemRowHorizontal
            title="Status"
            value={counterparty?.wire?.status ?? ""}
          />
        </div>
        <div className="h-[25px]">
          <ItemRowHorizontal
            title="Created at"
            value={timestampToDate(counterparty?.wire?.createdAt)}
          />
        </div>
        <div className="h-[25px]">
          <ItemRowHorizontal
            title="Updated at"
            value={timestampToDate(counterparty?.wire?.updatedAt)}
          />
        </div>
      </div>
      <MyText size="sm">Beneficiary Address details</MyText>
      <div className="pb-1" />
      <div className={`${gridStyle} gap-x-10 gap-y-4 pb-8`}>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.address.state"
              displayName="State"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.address?.state
                  ? counterparty.wire?.address?.state
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="State"
              value={
                counterparty.wire?.address?.state
                  ? counterparty.wire?.address?.state
                  : ""
              }
            />
          )}
        </div>{" "}
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.address.city"
              displayName="City"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.address?.city
                  ? counterparty.wire?.address?.city
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="City"
              value={counterparty.wire?.address?.city ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.address.line1"
              displayName="Street Address"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.address?.line1
                  ? counterparty.wire?.address?.line1
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Street Address"
              value={counterparty.wire?.address?.line1 ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.address.line2"
              displayName="Apt, Building etc"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.address?.line2
                  ? counterparty.wire?.address?.line2
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Apt, Building etc"
              value={counterparty.wire?.address?.line2 ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.address.postalCode"
              displayName="Postal Code"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.address?.postalCode
                  ? counterparty.wire?.address?.postalCode
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Postal Code"
              value={counterparty.wire?.address?.postalCode ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.address.countryCode"
              displayName="Country Code"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                      validate: (value: string, _: any) => {
                        const countryCodeRegex = /^[A-Z]{2}$/;
                        if (!countryCodeRegex.test(value) || value == "") {
                          return "Country code must be 2 uppercase letters";
                        }
                      },
                    }
              }
              value={
                counterparty.wire?.address?.countryCode
                  ? counterparty.wire?.address?.countryCode
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Country Code"
              value={counterparty.wire?.address?.countryCode ?? ""}
            />
          )}
        </div>
      </div>
      <MyText size="sm">Receiver details</MyText>
      <div className="pb-1" />
      <div className={`${gridStyle} gap-x-10 gap-y-4 pb-8`}>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.receiverRoutingNumber"
              displayName="Receiver Routing Number"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.receiverRoutingNumber
                  ? counterparty.wire?.receiverRoutingNumber
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Receiver Routing Number"
              value={counterparty.wire?.receiverRoutingNumber ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.receiverShortName"
              displayName="Receiver Bank Short Name"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.receiverShortName
                  ? counterparty.wire?.receiverShortName
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Receiver Bank Short Name"
              value={counterparty.wire?.receiverShortName ?? ""}
            />
          )}
        </div>
      </div>
      <MyText size="sm">Beneficiary FI details</MyText>
      <div className="pb-1" />
      <div className={`${gridStyle} gap-x-10 gap-y-4 pb-4`}>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.beneficiaryAccountNumber"
              displayName="Beneficiary FI Account Number"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.beneficiaryAccountNumber
                  ? counterparty.wire?.beneficiaryAccountNumber
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Beneficiary FI Account Number"
              value={counterparty.wire?.beneficiaryAccountNumber ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.beneficiaryFIName"
              displayName="Beneficiary FI Name"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.beneficiaryFIName
                  ? counterparty.wire?.beneficiaryFIName
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Beneficiary FI Name"
              value={counterparty.wire?.beneficiaryFIName ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.beneficiaryFIIdType"
              displayName="Beneficiary FI ID Type"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.beneficiaryFIIdType
                  ? counterparty.wire?.beneficiaryFIIdType
                  : ""
              }
              submitting={false}
              options={["ABA", "BIC"]}
            />
          ) : (
            <ItemRowHorizontal
              title="Beneficiary FI ID Type"
              value={counterparty.wire?.beneficiaryFIIdType ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.beneficiaryIdNumber"
              displayName="Beneficiary ID Number"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.beneficiaryIdNumber
                  ? counterparty.wire?.beneficiaryIdNumber
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Beneficiary ID Number"
              value={counterparty.wire?.beneficiaryIdNumber ?? ""}
            />
          )}{" "}
        </div>
      </div>
      <MyText size="sm">Beneficiary FI Address</MyText>
      <div className="pb-1" />
      <div className={`${gridStyle} gap-x-10 gap-y-4 pb-8`}>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.beneficiaryFIAddress.state"
              displayName="Beneficiary State"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.beneficiaryFIAddress?.state
                  ? counterparty.wire?.beneficiaryFIAddress?.state
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Beneficiary State"
              value={counterparty.wire?.beneficiaryFIAddress?.state ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.beneficiaryFIAddress.city"
              displayName="Beneficiary City"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.beneficiaryFIAddress?.city
                  ? counterparty.wire?.beneficiaryFIAddress?.city
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Beneficiary City"
              value={counterparty.wire?.beneficiaryFIAddress?.city ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.beneficiaryFIAddress.line1"
              displayName="Beneficiary Street Address"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.beneficiaryFIAddress?.line1
                  ? counterparty.wire?.beneficiaryFIAddress?.line1
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Beneficiary Street Address"
              value={counterparty.wire?.beneficiaryFIAddress?.line1 ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.beneficiaryFIAddress.line2"
              displayName="Beneficiary Apt, Building etc"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.beneficiaryFIAddress?.line2
                  ? counterparty.wire?.beneficiaryFIAddress?.line2
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Beneficiary Apt, Building etc"
              value={counterparty.wire?.beneficiaryFIAddress?.line2 ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.beneficiaryFIAddress.postalCode"
              displayName="Beneficiary Postal Code"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.beneficiaryFIAddress?.postalCode
                  ? counterparty.wire?.beneficiaryFIAddress?.postalCode
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Beneficiary Postal Code"
              value={counterparty.wire?.beneficiaryFIAddress?.postalCode ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.beneficiaryFIAddress.countryCode"
              displayName="Beneficiary Country Code"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                      validate: (value: string, _: any) => {
                        if (counterparty.wire?.type == "INTERNATIONAL") {
                          const countryCodeRegex = /^[A-Z]{2}$/;
                          if (!countryCodeRegex.test(value) || value == "") {
                            return "Country code must be 2 uppercase letters";
                          }
                        }
                      },
                    }
              }
              value={
                counterparty.wire?.beneficiaryFIAddress?.countryCode
                  ? counterparty.wire?.beneficiaryFIAddress?.countryCode
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Beneficiary Country Code"
              value={counterparty.wire?.beneficiaryFIAddress?.countryCode ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.beneficiaryFIAddress.type"
              displayName="Beneficiary FI Address Type"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.beneficiaryFIAddress?.type
                  ? counterparty.wire?.beneficiaryFIAddress?.type
                  : ""
              }
              options={["BUSINESS", "RESIDENCE", "MAILING", "OTHER"]}
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Beneficiary FI Address Type"
              value={counterparty.wire?.beneficiaryFIAddress?.type ?? ""}
            />
          )}
        </div>
      </div>
      <div className="h-8" />
      <MyText size="sm">Originator FI details</MyText>
      <div className="pb-1" />
      <div className={`${gridStyle} gap-x-10 gap-y-4`}>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.originatorAccountNumber"
              displayName="Originator FI Account Number"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.originatorAccountNumber
                  ? counterparty.wire?.originatorAccountNumber
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Originator FI Account Number"
              value={counterparty.wire?.originatorAccountNumber ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.originatorFiName"
              displayName="Originator FI Name"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.originatorFiName
                  ? counterparty.wire?.originatorFiName
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Originator FI Name"
              value={counterparty.wire?.originatorFiName ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.originatorFiIdType"
              displayName="Originator FI ID Type"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.originatorFiIdType
                  ? counterparty.wire?.originatorFiIdType
                  : ""
              }
              submitting={false}
              options={["ABA", "BIC"]}
            />
          ) : (
            <ItemRowHorizontal
              title="Originator FI ID Type"
              value={counterparty.wire?.originatorFiIdType ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.originatorFiIdNumber"
              displayName="Originator ID Number"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.originatorFiIdNumber
                  ? counterparty.wire?.originatorFiIdNumber
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Originator ID Number"
              value={counterparty.wire?.originatorFiIdNumber ?? ""}
            />
          )}
        </div>
      </div>
      <div className="h-4" />
      <MyText size="sm">Originator FI Address</MyText>
      <div className="pb-1" />
      <div className={`${gridStyle} gap-x-10 gap-y-4`}>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.originatorFiAddress.state"
              displayName="Originator State"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.originatorFiAddress?.state
                  ? counterparty.wire?.originatorFiAddress?.state
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Originator State"
              value={counterparty.wire?.originatorFiAddress?.state ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.originatorFiAddress.city"
              displayName="Originator City"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.originatorFiAddress?.city
                  ? counterparty.wire?.originatorFiAddress?.city
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Originator City"
              value={counterparty.wire?.originatorFiAddress?.city ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.originatorFiAddress.line1"
              displayName="Originator Street Address"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.originatorFiAddress?.line1
                  ? counterparty.wire?.originatorFiAddress?.line1
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Originator Street Address"
              value={counterparty.wire?.originatorFiAddress?.line1 ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.originatorFiAddress.line2"
              displayName="Originator Apt, Building etc"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.originatorFiAddress?.line2
                  ? counterparty.wire?.originatorFiAddress?.line2
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Originator Apt, Building etc"
              value={counterparty.wire?.originatorFiAddress?.line2 ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.originatorFiAddress.postalCode"
              displayName="Originator Postal Code"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.originatorFiAddress?.postalCode
                  ? counterparty.wire?.originatorFiAddress?.postalCode
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Originator Postal Code"
              value={counterparty.wire?.originatorFiAddress?.postalCode ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.originatorFiAddress.countryCode"
              displayName="Originator Country Code"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                      validate: (value: string, _: any) => {
                        if (counterparty.wire?.type == "INTERNATIONAL") {
                          const countryCodeRegex = /^[A-Z]{2}$/;
                          if (!countryCodeRegex.test(value) || value == "") {
                            return "Country code must be 2 uppercase letters";
                          }
                        }
                      },
                    }
              }
              value={
                counterparty.wire?.originatorFiAddress?.countryCode
                  ? counterparty.wire?.originatorFiAddress?.countryCode
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Originator Country Code"
              value={counterparty.wire?.originatorFiAddress?.countryCode ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.originatorFiAddress.type"
              displayName="Originator FI Address Type"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.originatorFiAddress?.type
                  ? counterparty.wire?.originatorFiAddress?.type
                  : ""
              }
              options={["BUSINESS", "RESIDENCE", "MAILING", "OTHER"]}
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Originator FI Address Type"
              value={counterparty.wire?.originatorFiAddress?.type ?? ""}
            />
          )}
        </div>
      </div>
      <div className="h-8" />
      <MyText size="sm">Intermediary FI details</MyText>
      <div className="pb-1" />
      <div className={`${gridStyle} gap-x-10 gap-y-4`}>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.intermediaryFIName"
              displayName="Intermediary FI Name"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.intermediaryFIName
                  ? counterparty.wire?.intermediaryFIName
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Intermediary FI Name"
              value={counterparty.wire?.intermediaryFIName ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.intermediaryFIIdType"
              displayName="Intermediary FI ID Type"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.intermediaryFIIdType
                  ? counterparty.wire?.intermediaryFIIdType
                  : ""
              }
              submitting={false}
              options={["ABA", "BIC"]}
            />
          ) : (
            <ItemRowHorizontal
              title="Intermediary FI ID Type"
              value={counterparty.wire?.intermediaryFIIdType ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.intermediaryFIIdNumber"
              displayName="Intermediary FI ID Number"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.intermediaryFIIdNumber
                  ? counterparty.wire?.intermediaryFIIdNumber
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Intermediary FI ID Number"
              value={counterparty.wire?.intermediaryFIIdNumber ?? ""}
            />
          )}
        </div>
      </div>
      <div className="h-8" />
      <MyText size="sm">Intermediary FI Address</MyText>
      <div className="pb-1" />
      <div className={`${gridStyle} gap-x-10 gap-y-4`}>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.intermediaryFIAddress.state"
              displayName="State"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.intermediaryFIAddress?.state
                  ? counterparty.wire?.intermediaryFIAddress?.state
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRow
              title="Intermediary FI State"
              value={counterparty.wire?.intermediaryFIAddress?.state ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.intermediaryFIAddress.city"
              displayName="City"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.intermediaryFIAddress?.city
                  ? counterparty.wire?.intermediaryFIAddress?.city
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Intermediary FI City"
              value={counterparty.wire?.intermediaryFIAddress?.city ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.intermediaryFIAddress.line1"
              displayName="Intermediary FI Street Address"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.intermediaryFIAddress?.line1
                  ? counterparty.wire?.intermediaryFIAddress?.line1
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Intermediary FI Street Address"
              value={counterparty.wire?.intermediaryFIAddress?.line1 ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.intermediaryFIAddress.line2"
              displayName="Apt, Building etc"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.intermediaryFIAddress?.line2
                  ? counterparty.wire?.intermediaryFIAddress?.line2
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Intermediary FI Apt, Building etc"
              value={counterparty.wire?.intermediaryFIAddress?.line2 ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.intermediaryFIAddress.postalCode"
              displayName="Postal Code"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.intermediaryFIAddress?.postalCode
                  ? counterparty.wire?.intermediaryFIAddress?.postalCode
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Intermediary FI Postal Code"
              value={counterparty.wire?.intermediaryFIAddress?.postalCode ?? ""}
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.intermediaryFIAddress.countryCode"
              displayName="Intermediary FI Country Code"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.intermediaryFIAddress?.countryCode
                  ? counterparty.wire?.intermediaryFIAddress?.countryCode
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Intermediary FI Country Code"
              value={
                counterparty.wire?.intermediaryFIAddress?.countryCode ?? ""
              }
            />
          )}
        </div>
        <div className="h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.intermediaryFIAddress.type"
              displayName="Intermediary FI Address Type"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.intermediaryFIAddress?.type
                  ? counterparty.wire?.intermediaryFIAddress?.type
                  : ""
              }
              options={["BUSINESS", "RESIDENCE", "MAILING", "OTHER"]}
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Intermediary FI Address Type"
              value={counterparty.wire?.intermediaryFIAddress?.type ?? ""}
            />
          )}
        </div>
      </div>
      <div className={`flex flex-row ${editable ? "pt-10 pb-4" : ""}`}>
        {editable && (
          <>
            {isEditing ? (
              <div className="flex flex-row gap-4">
                <div className="w-fit">
                  <MyTextButton
                    submitting={submitting}
                    onClick={() => {
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </MyTextButton>
                </div>
                <div className="w-fit">
                  <MyBlueButton
                    submitting={submitting}
                    onClick={() => {
                      handleSubmit(onSubmit)();
                    }}
                  >
                    Update Wire Details
                  </MyBlueButton>
                </div>
              </div>
            ) : (
              <div className="w-fit">
                <MyBlueButton
                  submitting={submitting}
                  onClick={() => {
                    setIsEditing(true);
                  }}
                >
                  Edit Wire Details
                </MyBlueButton>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  // {counterparty.wire?.status &&
  //   counterparty.wire?.status == "BLOCKED" && (
  //     <>
  //       {editable ? (
  //         <MyEditableTextField
  //           editing={isEditing}
  //           setEditing={setIsEditing}
  //           editable={false}
  //           name="wire.blockedResults"
  //           displayName="Blocked results"
  //           control={control}
  //           errors={errors}
  //           rules={
  //             submitting
  //               ? { required: false }
  //               : {
  //                   required: false,
  //                 }
  //           }
  //           value={
  //             counterparty.wire?.blockedResults
  //               ? counterparty.wire?.blockedResults
  //               : ""
  //           }
  //           submitting={false}
  //         />
  //       ) : (
  //         <ItemRow
  //           horizontal={!editable}
  //           title="Blocked results"
  //           value={counterparty.wire?.blockedResults ?? ""}
  //         ></ItemRow>
  //       )}
  //     </>
  //   )}
};

export default CounterpartyWireDetailsView;
