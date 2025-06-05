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
import { esclateAlert } from "@/redux/slices/alerts_slice";

const EsclateAlertButton = () => {
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

  const [updateAlerts, setUpdateAlerts] = useState(true);

  const {
    formState: { errors },
    control,
    handleSubmit,
    getValues,
    setValue,
  } = useForm<{
    alertIds: string[];
    name: string;
    description: string;
  }>({
    defaultValues: {
      alertIds: [(params.id as string) || "0"],
      name: "",
      description: "",
    },
  });
  const onSubmit: SubmitHandler<{
    alertIds: string[];
    name: string;
    description: string;
  }> = (data: { alertIds: string[]; name: string; description: string }) => {
    console.log("data:", data);
    setSubmitting(true);

    dispatch(esclateAlert(data)).then((result) => {
      if (typeof result === "string") {
        enqueueSnackbar(result, { variant: "error", persist: true });
      } else {
        enqueueSnackbar("Alert Escalated", { variant: "success" });
        handleModalClose();
      }

      setSubmitting(false);
    });
  };

  useEffect(() => {
    if (typeof alert != "string") {
      if (
        alert.status == "UNASSIGNED" ||
        alert.status == "OPEN" ||
        alert.status == "ASSIGNED"
      ) {
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
        <MyRedButton
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Esclate to Case
        </MyRedButton>
      </div>
      <MyModal
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
        height="360px"
      >
        <MyText size="lg">Esclate to Case</MyText>
        <div className="pb-6" />
        <MyText>Name</MyText>
        <MyControlledTextField
          name={"name"}
          displayName={"Name"}
          control={control}
          errors={errors}
          rules={{
            required: true,
          }}
          value={getValues("name")}
        />
        <div className="h-4" />
        <MyText>Description</MyText>
        <MyControlledTextField
          name={"description"}
          displayName={"Description"}
          control={control}
          errors={errors}
          rules={{
            required: true,
          }}
          value={getValues("description")}
        />
        <div className="pb-8" />
        <div className="w-fit">
          <MyBlueButton
            submitting={submitting}
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
          >
            Esclate to Case
          </MyBlueButton>
        </div>
        <div className="pb-6" />
      </MyModal>
    </>
  );
};

export default EsclateAlertButton;
