"use client";

import { useAppDispatch } from "@/redux/store/store";
import MyBlueButton from "../../../../../core/components/Button/MyBlueButton";
import { useEffect, useState } from "react";
import MyModal from "../../../../../core/components/my_modal";
import MyText from "../../../../../core/components/Text/Text";
import MyControlledTextField from "../../../../../core/components/TextField/MyControlledTextField";
import MyControlledAutocomplete from "../../../../../core/components/Autocomplete/MyControlledAutocomplete";
import { SubmitHandler, useForm } from "react-hook-form";
import { addAlertNote } from "@/redux/slices/alerts_slice";
import { enqueueSnackbar } from "notistack";
import { Alert } from "@/core/api/ApiTypes";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

type AddAlertNoteButtonProps = {
  alert: Alert | string;
};

const AddAlertNoteButton: React.FC<AddAlertNoteButtonProps> = ({ alert }) => {
  const dispatch = useAppDispatch();

  const [modalOpen, setModalOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
  } = useForm<{ note: string; type: string }>();
  const onSubmit: SubmitHandler<{ note: string; type: string }> = (data: {
    note: string;
    type: string;
  }) => {
    if (typeof alert == "string") return;
    console.log("data:", data);
    setSubmitting(true);

    dispatch(
      addAlertNote({
        id: alert.id?.toString() ?? "",
        note: data.note,
        type: data.type,
      })
    ).then((result) => {
      if (typeof result.payload == "string") {
        enqueueSnackbar(result.payload, { variant: "error", persist: true });
      } else {
        enqueueSnackbar("Note added!", { variant: "success" });
        handleModalClose();
      }
      setSubmitting(false);
    });
  };

  return typeof alert == "string" ? (
    <></>
  ) : (
    <>
      <IconButton
        onClick={() => {
          setModalOpen(true);
        }}
      >
        <AddIcon className="text-[#12A7FF] h-[34px] w-[34px]" />
      </IconButton>
      <MyModal
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
        height="450px"
      >
        <MyText size="lg">Add Note</MyText>
        <div className="pb-6" />
        <MyText>Note Type</MyText>
        <MyControlledAutocomplete
          name={"type"}
          displayName={"Note Type"}
          control={control}
          errors={errors}
          options={["INTERNAL", "RFI"]}
          rules={{
            required: true,
          }}
          value="INTERNAL"
          clearable={false}
        />
        <div className="pb-4" />
        <MyText>Note</MyText>
        <MyControlledTextField
          multiline
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

export default AddAlertNoteButton;
