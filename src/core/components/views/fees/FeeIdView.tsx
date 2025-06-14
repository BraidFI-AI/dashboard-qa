"use client";

import { Fees } from "@/core/api/ApiTypes";
import MyText from "@/core/components/Text/Text";
import { deleteFee, fetchFee, updateFee } from "@/redux/slices/FeeSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppDispatch } from "@/redux/store/store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ItemRow from "@/core/components/Text/ItemRow";
import timestampToDate from "@/core/utils/timestampToDate";
import MyEditableTextField from "@/core/components/TextField/MyEditableTextField";
import { SubmitHandler, useForm } from "react-hook-form";
import MyEditButton from "@/core/components/Button/MyEditButton";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { enqueueSnackbar } from "notistack";
import toDollarFormat from "@/core/utils/toDollarFormat";
import {
  TransactionTypesType,
  fetchTransactionTypes,
} from "@/redux/slices/AppSlice";
import { useSelector } from "react-redux";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "../../error_page";
import { set } from "lodash";
import React from "react";
import MyRedButton from "../../Button/MyRedButton";

type FeeIdViewProps = {
  replaceTo: string;
};

const FeeIdView: React.FC<FeeIdViewProps> = ({ replaceTo }) => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();

  const [refresh, setRefresh] = useState(true);
  const [loading, setLoading] = useState(true);
  const [fee, setFee] = useState<"loading" | null | Fees>("loading");

  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(-1);

  const transactionTypes: TransactionTypesType = useSelector(
    (state: any) => state.app.transactionTypes
  );

  const [feeType, setFeeType] = useState("FLAT");

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    getValues,
    reset,
    setValue,
    handleSubmit,
  } = useForm<Fees>();
  const onSubmit: SubmitHandler<Fees> = (data: Fees) => {
    // console.log("data", data);
    // if (feeType == "MONTHLY") {
    //   data.tranType = undefined;
    // }
    // setSubmitting(true);
    // dispatch(updateFee(data)).then((d: any) => {
    //   if (d.payload) {
    //     enqueueSnackbar("Fee updated successfully", { variant: "success" });
    //     setRefresh(true);
    //     setSubmitting(false);
    //     setEditing(false);
    //   } else {
    //     // enqueueSnackbar("Error updating fee", { variant: "error" });
    //     setSubmitting(false);
    //   }
    // });
  };

  useEffect(() => {
    if (refresh) {
      setFee("loading");
      dispatch(fetchFee((params.feeId as string) || "0")).then((data: any) => {
        setFee(data.payload);
        reset({ ...data.payload });
        setLoading(false);
        setFeeType(data.payload.feeType ?? "FLAT");
      });

      setRefresh(false);
    }
  }, [dispatch, refresh, params.feeId, reset]);

  const handleClickOpen = (index: number) => {
    setDeleting(index);
  };

  const handleClose = () => {
    if (submitting) {
      return;
    }
    setDeleting(-1);
  };

  return fee == "loading" ? (
    <div className="flex flex-col items-center justify-center pt-10">
      <CircularProgress></CircularProgress>
      <div>Loading fees...</div>
    </div>
  ) : fee == null ? (
    <ErrorPage
      error="Error fetching fee"
      recoveryButtonOnClick={() => {
        setFee("loading");
        dispatch(fetchFee((params.feeId as string) || "0")).then(
          (data: any) => {
            if (data.payload != null) {
              setFeeType(data.payload.feeType);
            }
            setFee(data.payload);
            reset({ ...data.payload });
            setLoading(false);
            setFeeType(data.payload.feeType ?? "FLAT");
          }
        );
      }}
      recoveryButtonTitle="Retry"
    />
  ) : (
    <>
      {deleting != -1 && (
        <>
          <Dialog open={deleting != -1 ? true : false} onClose={handleClose}>
            <DialogTitle>{`Delete Fee ${fee.id ?? ""}`}</DialogTitle>
            <DialogContent>
              <MyText size="md">
                Are you sure you want to delete this fee?
              </MyText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>
                {submitting ? <CircularProgress size="25px" /> : "Cancel"}
              </Button>
              <Button
                onClick={() => {
                  if (submitting) {
                    return;
                  }
                  setSubmitting(true);
                  dispatch(deleteFee(fee.id?.toString() ?? "")).then(
                    (p: any) => {
                      if (p.payload) {
                        router.back();
                        enqueueSnackbar("Fee deleted successfully", {
                          variant: "success",
                        });
                      } else {
                        setSubmitting(false);
                        // enqueueSnackbar("Error deleting fee", {
                        //   variant: "error",
                        // });
                      }
                    }
                  );
                }}
                autoFocus
              >
                {submitting ? <CircularProgress size="25px" /> : "Delete"}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      <div className="w-[300px]">
        <div className="flex flex-row justify-between">
          <ItemRow title="ID" value={fee.id ?? ""}></ItemRow>
          {/* <MyEditButton
            editing={editing}
            setEditing={setEditing}
          ></MyEditButton> */}
        </div>
        {fee.associatedEntityType == "ACCOUNT" && (
          <ItemRow
            title="Account Number"
            value={fee.associatedEntityId ?? ""}
          ></ItemRow>
        )}
        {fee.associatedEntityType == "PRODUCT" && (
          <ItemRow
            title="Product ID"
            value={fee.associatedEntityId ?? ""}
          ></ItemRow>
        )}
        <ItemRow title="Same day" value={fee.sameDay ?? "false"} />
        {feeType != "MONTHLY" && (
          <MyEditableTextField
            editing={editing}
            setEditing={setEditing}
            editable={false}
            name="feeChargingAccountId"
            displayName="Charging Account"
            control={control}
            errors={errors}
            rules={{
              required: false,
            }}
            value={fee.feeChargingAccountId ?? ""}
            submitting={false}
          />
        )}
        <MyEditableTextField
          editing={editing}
          setEditing={setEditing}
          editable={false}
          name="settlementAccountId"
          displayName="Settlement Account Number"
          control={control}
          errors={errors}
          rules={{
            required: true,
          }}
          value={fee.settlementAccountId ?? ""}
          submitting={false}
        />
        <MyEditableTextField
          editing={editing}
          setEditing={setEditing}
          editable={false}
          name="amount"
          displayName="Amount"
          control={control}
          errors={errors}
          rules={{
            required: true,
            pattern: /^(0|[1-9]\d*)(\.\d+)?$/,
          }}
          value={
            fee.amount
              ? fee.type == "PERCENT"
                ? fee.amount
                : toDollarFormat(fee.amount)
              : ""
          }
          submitting={false}
        />
        <MyEditableTextField
          editing={editing}
          setEditing={setEditing}
          editable={false}
          name="type"
          displayName="Fee Type"
          control={control}
          errors={errors}
          rules={{
            required: true,
          }}
          value={fee.type ?? ""}
          submitting={false}
          options={["FLAT", "PERCENT", "MONTHLY"]}
          customOnChange={(val: string) => {
            setFeeType(val);
            if (val == "MONTHLY") {
              setValue("transactionTypes", undefined);
            }
          }}
        />
        {feeType == "MONTHLY" && (
          <MyEditableTextField
            editing={editing}
            setEditing={setEditing}
            editable={false}
            name="dayOfMonth"
            displayName="Day of Month"
            control={control}
            errors={errors}
            rules={{
              required: true,
              pattern: /^[0-9]+$/,
            }}
            value={fee.dayOfMonth ?? 0}
            submitting={false}
          />
        )}
        {feeType != "MONTHLY" ? (
          <>
            {transactionTypes == "loading" ? (
              <MyCircularProgressIndicator />
            ) : typeof transactionTypes == "string" ? (
              <ErrorPage
                error={transactionTypes}
                recoveryButtonOnClick={() => {
                  dispatch(fetchTransactionTypes());
                }}
                recoveryButtonTitle="Retry"
              />
            ) : (
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                editable={false}
                name="transactionTypes"
                displayName="Transaction Type"
                control={control}
                errors={errors}
                rules={{
                  required: true,
                }}
                value={fee.transactionTypes ?? ""}
                submitting={false}
                options={transactionTypes}
              />
            )}
          </>
        ) : (
          <></>
        )}
        <ItemRow
          title="Created at"
          value={timestampToDate(fee.createdAt ?? 0)}
        ></ItemRow>
        <ItemRow
          title="Updated at"
          value={timestampToDate(fee.updatedAt ?? 0)}
        ></ItemRow>
        <div className="flex flex-row">
          <div className="w-fit">
            <MyRedButton
              // className="text-red-500"
              // disabled={submitting}
              // style={{ textTransform: "none" }}
              // variant="text"
              onClick={() => {
                handleClickOpen(1);
              }}
            >
              Delete Fee
            </MyRedButton>
          </div>
          <div className="pr-2"></div>
          {/* <div className="w-fit">
            <MyBlueButton
              submitting={submitting}
              onClick={() => {
                if (editing) {
                  handleSubmit(onSubmit)();
                }
              }}
            >
              Update Fee
            </MyBlueButton>
          </div> */}
        </div>
        <div className="pb-10"></div>
      </div>
    </>
  );
};

export default FeeIdView;
