"use client";

import { Counterparty } from "@/core/api/ApiTypes";
import Divider from "@mui/material/Divider";
import ItemRow from "@/core/components/Text/ItemRow";
import MyText from "@/core/components/Text/Text";
import MyEditButton from "@/core/components/Button/MyEditButton";
import MyEditableTextField from "@/core/components/TextField/MyEditableTextField";
import MyExpandableButton from "@/core/components/Button/MyExpandableButton";
import { useEffect, useState } from "react";
import { timestampToDate } from "@/core/utils/date_time_util";
import ItemRowHorizontal from "../../Text/ItemRowHorizontal";
import MyHorizontalEditableTextField from "../../TextField/horizontal_editable_textfield";
import MyBlueButton from "../../Button/MyBlueButton";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch } from "@/redux/store/store";
import { enqueueSnackbar } from "notistack";
import { updateCounterparty } from "@/redux/slices/CounterpartySlice";
import MyTextButton from "../../Button/MyTextButton";

type CounterpartyACHDetailsViewProps = {
  setRefresh: any;
  counterparty: Counterparty;
  editable?: boolean;
  counterpartyId: any;
};

const CounterpartyACHDetailsView: React.FC<CounterpartyACHDetailsViewProps> = ({
  setRefresh,
  counterparty,
  editable = true,
  counterpartyId,
}) => {
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
      <div className="flex flex-wrap w-full gap-x-10 gap-y-4">
        <div className="w-[300px] h-[25px]">
          <ItemRowHorizontal
            title="ID"
            value={counterparty?.ach?.id?.toString() ?? ""}
          />
        </div>
        <div className="w-[300px] h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="ach.bankName"
              displayName="Bank Name"
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
                counterparty.ach?.bankName ? counterparty.ach?.bankName : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Bank Name"
              value={counterparty.ach?.bankName ?? ""}
            />
          )}
        </div>
        <div className="w-[300px] h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="ach.gatewayRoutingNumber"
              displayName="Gateway Routing Number"
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
                counterparty.ach?.gatewayRoutingNumber
                  ? counterparty.ach?.gatewayRoutingNumber
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Gateway Routing Number"
              value={counterparty.ach?.gatewayRoutingNumber ?? ""}
            />
          )}
        </div>
        <div className="w-[300px] h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="ach.rdfiNumberQualifier"
              displayName="RDFI Number Qualifier"
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
                counterparty.ach?.rdfiNumberQualifier
                  ? counterparty.ach?.rdfiNumberQualifier
                  : ""
              }
              options={["NATIONAL_CLEARING_SYSTEM", "IBAN", "BIC"]}
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="RDFI Number Qualifier"
              value={counterparty.ach?.rdfiNumberQualifier ?? ""}
            />
          )}
        </div>
        <div className="w-[300px] h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="ach.bankAccountType"
              displayName="Account Type"
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
                counterparty.ach?.bankAccountType
                  ? counterparty.ach?.bankAccountType
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Account Type"
              value={counterparty.ach?.bankAccountType ?? ""}
            />
          )}
        </div>
        <div className="w-[300px] h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="ach.routingNumber"
              displayName="Rounting Number"
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
                counterparty.ach?.routingNumber
                  ? counterparty.ach?.routingNumber
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Rounting Number"
              value={counterparty.ach?.routingNumber ?? ""}
            />
          )}
        </div>
        <div className="w-[300px] h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="ach.accountNumber"
              displayName="Account Number"
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
                counterparty.ach?.accountNumber
                  ? counterparty.ach?.accountNumber
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Account Number"
              value={counterparty.ach?.accountNumber ?? ""}
            />
          )}
        </div>
        <div className="w-[300px] h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="ach.countryCode"
              displayName="Country Code"
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
                counterparty.ach?.countryCode
                  ? counterparty.ach?.countryCode
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Country Code"
              value={counterparty.ach?.countryCode ?? ""}
            />
          )}
        </div>
        <div className="w-[300px] h-[25px]">
          <ItemRowHorizontal
            title="Status"
            value={counterparty?.ach?.status ?? ""}
          />
        </div>
        <div className="w-[300px] h-[25px]">
          <ItemRowHorizontal
            title="Created at"
            value={timestampToDate(counterparty?.ach?.createdAt)}
          />
        </div>
        <div className="w-[300px] h-[25px]">
          <ItemRowHorizontal
            title="Updated at"
            value={timestampToDate(counterparty?.ach?.updatedAt)}
          />
        </div>
      </div>
      <div className="h-8" />
      <MyText size="sm">Bank Address</MyText>
      <div className="pb-1" />
      <div className="flex flex-wrap w-full gap-x-10 gap-y-4">
        <div className="w-[300px] h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="ach.receiverStreetAddress"
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
                counterparty.ach?.receiverStreetAddress
                  ? counterparty.ach?.receiverStreetAddress
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Street Address"
              value={counterparty.ach?.receiverStreetAddress ?? ""}
            />
          )}
        </div>
        <div className="w-[300px] h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="ach.receiverCity"
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
                counterparty.ach?.receiverCity
                  ? counterparty.ach?.receiverCity
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="City"
              value={counterparty.ach?.receiverCity ?? ""}
            />
          )}
        </div>
        <div className="w-[300px] h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="ach.receiverState"
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
                counterparty.ach?.receiverState
                  ? counterparty.ach?.receiverState
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="State"
              value={counterparty.ach?.receiverState ?? ""}
            />
          )}
        </div>
        <div className="w-[300px] h-[25px]">
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="ach.receiverPostalCode"
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
                counterparty.ach?.receiverPostalCode
                  ? counterparty.ach?.receiverPostalCode
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Postal Code"
              value={counterparty.ach?.receiverPostalCode ?? ""}
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
                    Update ACH Details
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
                  Edit ACH Details
                </MyBlueButton>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  // {
  //   counterparty.ach?.status && counterparty.ach?.status == "BLOCKED" && (
  //     <ItemRow
  //       horizontal={!editable}
  //       title="Blocked results"
  //       values={[]}
  //     ></ItemRow>
  //   );
  // }
};

export default CounterpartyACHDetailsView;
