"use client";

import { Counterparty, OFAC } from "@/core/api/ApiTypes";
import { useEffect, useState } from "react";
import { timestampToDate } from "@/core/utils/date_time_util";
import { useAppDispatch } from "@/redux/store/store";
import ItemRowHorizontal from "../../Text/ItemRowHorizontal";
import WrapContainer from "../../divs/wrap_container";
import WrapItem from "../../divs/wrap_item";
import MyHorizontalEditableTextField from "../../TextField/horizontal_editable_textfield";
import MyBlueButton from "../../Button/MyBlueButton";
import MyTextButton from "../../Button/MyTextButton";
import { SubmitHandler, useForm } from "react-hook-form";
import { updateCounterparty } from "@/redux/slices/CounterpartySlice";
import { enqueueSnackbar } from "notistack";

type CounterpartyBraidDetailsViewProps = {
  counterparty: Counterparty;
  editable?: boolean;
  counterpartyId: any;
  setRefresh: any;
};

const CounterpartyBraidDetailsView: React.FC<
  CounterpartyBraidDetailsViewProps
> = ({ counterparty, setRefresh, editable = true, counterpartyId }) => {
  const dispatch = useAppDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    formState: { errors },
    control,
    handleSubmit,
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
      setValue("braid", counterparty?.braid);
    }
  }, [isEditing, counterparty?.braid, setValue]);

  return (
    <div className="flex flex-col gap-y-8 pt-2 w-full">
      <WrapContainer>
        <WrapItem>
          <ItemRowHorizontal
            title="ID"
            value={counterparty?.braid?.id?.toString() ?? ""}
          />
        </WrapItem>
        <WrapItem>
          <ItemRowHorizontal
            title="Contact ID"
            value={counterparty?.braid?.contactId?.toString() ?? ""}
          />
        </WrapItem>
        <WrapItem>
          <ItemRowHorizontal
            title="Customer ID"
            value={counterparty?.braid?.custId?.toString() ?? ""}
          />
        </WrapItem>
        <WrapItem>
          <ItemRowHorizontal
            title="Type"
            value={counterparty?.braid?.instrumentType ?? ""}
          />
        </WrapItem>
        <WrapItem>
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="braid.accountNumber"
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
                counterparty.braid?.accountNumber
                  ? counterparty.braid?.accountNumber
                  : ""
              }
              submitting={false}
            />
          ) : (
            <ItemRowHorizontal
              title="Account Number"
              value={counterparty.braid?.accountNumber ?? ""}
            />
          )}
        </WrapItem>
        <WrapItem>
          <ItemRowHorizontal
            title="Status"
            value={counterparty?.braid?.status ?? ""}
          />
        </WrapItem>
        <WrapItem>
          <ItemRowHorizontal
            title="Created at"
            value={timestampToDate(counterparty?.braid?.createdAt)}
          />
        </WrapItem>
        <WrapItem>
          <ItemRowHorizontal
            title="Updated at"
            value={timestampToDate(counterparty?.braid?.updatedAt)}
          />
        </WrapItem>
      </WrapContainer>
      {editable && counterparty.status && counterparty.status == "ACTIVE" && (
        <div className={`flex flex-row ${editable ? "pt-2" : ""}`}>
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
                    Update Braid Details
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
                  Edit Braid Details
                </MyBlueButton>
              </div>
            )}
          </>
        </div>
      )}
    </div>
  );

  // {
  //   counterparty.braid?.status && counterparty.braid?.status == "BLOCKED" && (
  //     <ItemRow
  //       horizontal={!editable}
  //       horizontalNoSpace
  //       title="Blocked results"
  //       value={counterparty.braid?.blockedResults ?? ""}
  //     ></ItemRow>
  //   );
  // }
};

export default CounterpartyBraidDetailsView;
