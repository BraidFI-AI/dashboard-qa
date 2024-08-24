"use client";

import { OneTimeFees } from "@/core/api/ApiTypes";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import MyText from "@/core/components/Text/Text";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyTextButton from "@/core/components/Button/MyTextButton";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppDispatch } from "@/redux/store/store";
import { chargeOneTimeFee, fetchAccount } from "@/redux/slices/AccountSlice";
import { enqueueSnackbar } from "notistack";
import ErrorPage from "@/core/components/error_page";

const ModalBoxstyle = {
  position: "absolute" as any as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
};

type OneTimeFeeModalProps = {
  isOpen: boolean;
  setIsOpen: any;
  accountId: string;
};

const OneTimeFeeModal: React.FC<OneTimeFeeModalProps> = ({
  isOpen,
  setIsOpen,
  accountId,
}) => {
  const dispatch = useAppDispatch();

  const [submitting, setSubmitting] = useState(false);
  const [accNumber, setAccNumber] = useState<"loading" | string | number>(
    "loading"
  );

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    getValues,
    handleSubmit,
  } = useForm<OneTimeFees>();
  const onSubmit: SubmitHandler<OneTimeFees> = (data: OneTimeFees) => {
    data = { ...data, accountNumber: accNumber.toString() };
    console.log("data", data);

    setSubmitting(true);

    dispatch(chargeOneTimeFee(data)).then((fee: any) => {
      if (fee.payload) {
        enqueueSnackbar("One time fee charged!", { variant: "success" });
      } else {
        // enqueueSnackbar("Error charging one time fee", { variant: "error" });
      }
      setSubmitting(false);
      setIsOpen(false);
    });
  };

  useEffect(() => {
    setAccNumber("loading");
    dispatch(fetchAccount(accountId)).then((acc: any) => {
      if (typeof acc.payload != "string") {
        setAccNumber(acc.payload.accountNumber);
      } else {
        setAccNumber(acc.payload);
        setIsOpen(false);
      }
    });
  }, [accountId, dispatch, setIsOpen]);

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
      className="overflow-auto"
    >
      <Box
        className="w-[400px] flex items-center justify-center"
        sx={ModalBoxstyle}
      >
        <>
          {accNumber == "loading" ? (
            <CircularProgress />
          ) : typeof accNumber == "string" ? (
            <ErrorPage
              error={accNumber}
              recoveryButtonTitle="Retry"
              recoveryButtonOnClick={() => {
                setAccNumber("loading");
                dispatch(fetchAccount(accountId)).then((acc: any) => {
                  if (typeof acc.payload != "string") {
                    setAccNumber(acc.payload.accountNumber);
                  } else {
                    setAccNumber(acc.payload);
                    setIsOpen(false);
                  }
                });
              }}
            />
          ) : (
            <div className="">
              <MyText size="md">Charge one time fee</MyText>
              <div className="pb-6"></div>
              <MyText>Fee amount</MyText>
              <MyControlledTextField
                name="amount"
                displayName="Fee Amount"
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false, pattern: null }
                    : {
                        required: true,
                        pattern: /^(0|[1-9]\d*)(\.\d+)?$/,
                      }
                }
                value=""
              />
              <div className="pb-4"></div>
              <MyText>Account number</MyText>
              <MyText size="md">{accNumber}</MyText>
              <div className="pb-4"></div>
              <MyText>Settlement account number</MyText>
              <MyControlledTextField
                name="settlementAccountNumber"
                displayName="Settlement account"
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false, pattern: null }
                    : {
                        required: true,
                        pattern: /^[0-9]+$/,
                      }
                }
                value=""
              />
              <div className="pb-4"></div>
              <MyText>Fee type</MyText>
              <MyControlledAutocomplete
                value={"SETUP_FEE"}
                displayName="Fee Type"
                name={"subType"}
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                options={["SETUP_FEE", "TERMINATION_FEE"]}
              />
              <div className="pb-4"></div>
              <MyText>Note</MyText>
              <MyControlledTextField
                name="notes"
                displayName="Note"
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: false,
                      }
                }
                value=""
              />
              <div className="flex flex-row justify-end pt-6">
                <div className="pr-2">
                  <MyTextButton
                    isCancel
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    Cancel
                  </MyTextButton>
                </div>
                <div>
                  <MyBlueButton
                    submitting={submitting}
                    onClick={() => {
                      handleSubmit(onSubmit)();
                    }}
                  >
                    Charge
                  </MyBlueButton>
                </div>
              </div>
            </div>
          )}
        </>
      </Box>
    </Modal>
  );
};

export default OneTimeFeeModal;
