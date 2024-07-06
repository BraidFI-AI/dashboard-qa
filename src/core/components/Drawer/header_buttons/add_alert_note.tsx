"use client";

import { useAppDispatch } from "@/redux/store/store";
import MyBlueButton from "../../Button/MyBlueButton";
import { useEffect, useState } from "react";
import MyModal from "../../my_modal";
import MyText from "../../Text/Text";
import MyControlledTextField from "../../TextField/MyControlledTextField";
import { SubmitHandler, useForm } from "react-hook-form";
import { addAlertNote } from "@/redux/slices/alerts_slice";
import { useParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { Alert } from "@/core/api/ApiTypes";

const AddAlertNodeButton = () => {
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
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
  } = useForm<{ note: string }>();
  const onSubmit: SubmitHandler<{ note: string }> = (data: {
    note: string;
  }) => {
    console.log("data:", data);
    setSubmitting(true);

    dispatch(addAlertNote({ id: params.id.toString(), note: data.note })).then(
      (result) => {
        if (typeof result.payload == "string") {
          enqueueSnackbar(result.payload, { variant: "error", persist: true });
        } else {
          enqueueSnackbar("Note added!", { variant: "success" });
          handleModalClose();
        }
        setSubmitting(false);
      }
    );
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
          Add Note
        </MyBlueButton>
      </div>
      <MyModal
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
        height="270px"
      >
        <MyText size="lg">Add Note</MyText>
        <div className="pb-6" />
        <MyText>Note</MyText>
        <MyControlledTextField
          name={"note"}
          displayName={"Note"}
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
            Add Note
          </MyBlueButton>
        </div>
        <div className="pb-6" />
      </MyModal>
    </>
  );
};

export default AddAlertNodeButton;
