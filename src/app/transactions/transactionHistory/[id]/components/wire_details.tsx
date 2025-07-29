"use client";

import { Transaction } from "@/core/api/ApiTypes";
import ItemRowHorizontal from "@/core/components/Text/ItemRowHorizontal";
import MyText from "@/core/components/Text/Text";
import { boxStyle, isAdmin } from "@/core/constants";
import { enumTextToReadableText } from "@/core/utils/formatting_util";
import { timestampToDate } from "@/core/utils/date_time_util";
import MyEditableTextField from "@/core/components/TextField/MyEditableTextField";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import { updateTransactionIMAD } from "@/redux/slices/TransactionSlice";
import { useAppDispatch } from "@/redux/store/store";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { useSelector } from "react-redux";
export default function WireDetails({
  transaction,
}: {
  transaction: Transaction;
}) {
  const userType = useSelector((state: any) => state.app.userType);

  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    getValues,
    handleSubmit,
    reset,
  } = useForm<{
    imad?: string;
  }>();
  const onSubmit: SubmitHandler<{
    imad?: string;
  }> = (data: { imad?: string }) => {
    console.log("data:", data);
    setSubmitting(true);
    dispatch(
      updateTransactionIMAD({
        paymentId: transaction.paymentId ?? "",
        imad: data.imad ?? "",
      })
    ).then((res: any) => {
      if (typeof res.payload == "string") {
        enqueueSnackbar(res.payload, { variant: "error" });
      } else {
        enqueueSnackbar("IMAD updated", { variant: "success" });
        setEditing(false);
      }
    });
  };

  return transaction.wire == null ? (
    <></>
  ) : (
    <div
      className={`flex flex-col min-w-[820px] min-h-fit rounded-[10px] justify-center items-start ${boxStyle}`}
    >
      <div className="pt-6 pb-2 px-6">
        <MyText variant="label" size="lg" weight="semibold">
          Wire Details
        </MyText>
      </div>
      <div className="w-full pt-2 px-6 flex flex-row justify-start">
        <div className="flex flex-col justify-start min-w-[340px] w-full">
          <ItemRowHorizontal
            title="Type"
            value={enumTextToReadableText(transaction?.wire?.type ?? "")}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Originator Name"
            value={(transaction as any).wire?.originatorName ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Originator Account Number"
            value={(transaction as any).wire?.originatorAccountNumber ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Originator Routing Number"
            value={(transaction as any).wire?.originatorRoutingNumber ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Originator Bank Name"
            value={(transaction as any).wire?.originatorBankName ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Beneficiary Name"
            value={(transaction as any).wire?.beneficiaryName ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Beneficiary Account Number"
            value={(transaction as any).wire?.beneficiaryAccountNumber ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Beneficiary Routing Number"
            value={(transaction as any).wire?.beneficiaryRoutingNumber ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Beneficiary Bank Name"
            value={(transaction as any).wire?.beneficiaryBankName ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Intermediary Routing Number"
            value={(transaction as any).wire?.intermediaryRoutingNumber ?? ""}
          />
          <div className="h-3" />
        </div>
        <div className="min-w-[60px]" />
        <div className="flex flex-col justify-start min-w-[340px] w-full">
          {isAdmin(userType) &&
          (transaction as any).isInbound != null &&
          (transaction as any).isInbound == false ? (
            <div className="flex flex-row justify-between">
              <div>
                <MyEditableTextField
                  editing={editing}
                  setEditing={setEditing}
                  name="imad"
                  displayName="IMAD"
                  control={control}
                  errors={errors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: true,
                        }
                  }
                  value={(transaction as any).wire?.imad ?? ""}
                  submitting={submitting}
                />
              </div>
              {editing && (
                <div className="w-fit">
                  <MyBlueButton
                    onClick={() => {
                      handleSubmit(onSubmit)();
                    }}
                  >
                    Save
                  </MyBlueButton>
                </div>
              )}
            </div>
          ) : (
            <ItemRowHorizontal
              title="IMAD"
              value={(transaction as any).wire?.imad ?? ""}
            />
          )}
          <div className="h-3" />
          <ItemRowHorizontal
            title="OMAD"
            value={(transaction as any).wire?.omad ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Originator To Beneficiary Info"
            value={(transaction as any).wire?.originatorToBeneficiaryInfo ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="File Handle"
            link={`/transactions/transactionHistory?wireFileHandle=${
              (transaction as any).wire?.fileHandle
            }`}
            value={(transaction as any).wire?.fileHandle ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Raw Data"
            value={(transaction as any).wire?.rawData ?? ""}
          />
          <div className="h-3" />
        </div>
      </div>
    </div>
  );
}
