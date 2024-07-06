"use client";

import { useAppDispatch } from "@/redux/store/store";
import MyBlueButton from "../../Button/MyBlueButton";
import { useEffect, useState } from "react";
import MyModal from "../../my_modal";
import MyText from "../../Text/Text";
import MyControlledTextField from "../../TextField/MyControlledTextField";
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import MyRedButton from "../../Button/MyRedButton";
import MyControlledAutocomplete from "../../Autocomplete/MyControlledAutocomplete";
import MyCheckbox from "../../Button/MyCheckbox ";
import { useSelector } from "react-redux";
import { Alert } from "@/core/api/ApiTypes";
import { esclateAlert, resolveAlert } from "@/redux/slices/alerts_slice";

const ResolveAlertButton = () => {
  const params = useParams();

  const dispatch = useAppDispatch();

  const alert: "loading" | string | Alert = useSelector(
    (state: any) => state.alerts.alert
  );

  const [isOpen, setIsOpen] = useState(false);

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
    alertId: string;
    action: string;
    note: string;
  }>({
    defaultValues: {
      alertId: params.id.toString(),
      action: "",
      note: "",
    },
  });
  const onSubmit: SubmitHandler<{
    alertId: string;
    action: string;
    note: string;
  }> = (data: { alertId: string; action: string; note: string }) => {
    console.log("data:", data);
    setSubmitting(true);

    dispatch(resolveAlert(data)).then((result) => {
      if (typeof result.payload == "string") {
        enqueueSnackbar(result.payload, { variant: "error", persist: true });
      } else {
        enqueueSnackbar("Alert Resolved", { variant: "success" });
        handleModalClose();
      }

      setSubmitting(false);
    });
  };

  useEffect(() => {
    if (typeof alert != "string") {
      if (alert.status == "OPEN") {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }
  }, [alert]);

  return isOpen == false ? (
    <></>
  ) : typeof alert == "string" ? (
    <></>
  ) : (
    <>
      <div className="w-fit">
        <MyBlueButton
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Resolve Alert
        </MyBlueButton>
      </div>
      <MyModal
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
        height="360px"
      >
        <MyText size="lg">Resolve Alert</MyText>
        <div className="pb-6" />
        <MyText>Decision</MyText>
        <MyControlledAutocomplete
          clearable={false}
          name="action"
          displayName="Action"
          control={control}
          errors={errors}
          options={["APPROVE", "DECLINE"]}
          rules={{
            required: true,
          }}
          value={getValues("action")}
        />
        <div className="h-4" />
        <MyText>Note</MyText>
        <MyControlledTextField
          name={"note"}
          displayName={"Note"}
          control={control}
          errors={errors}
          rules={{
            required: true,
          }}
          value={getValues("note")}
        />
        <div className="pb-8" />
        <div className="w-fit">
          <MyBlueButton
            submitting={submitting}
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
          >
            Resolve Alert
          </MyBlueButton>
        </div>
        <div className="pb-6" />
      </MyModal>
    </>
  );
};

export default ResolveAlertButton;
