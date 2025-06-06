"use client";

import { useAppDispatch } from "@/redux/store/store";
import MyBlueButton from "../../../../../core/components/Button/MyBlueButton";
import { useEffect, useState } from "react";
import MyModal from "../../../../../core/components/my_modal";
import MyText from "../../../../../core/components/Text/Text";
import MyControlledTextField from "../../../../../core/components/TextField/MyControlledTextField";
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { addCaseNote } from "@/redux/slices/cases_slice";
import { Case } from "@/core/api/ApiTypes";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";

type AddCaseNodeButtonProps = {
  c: Case;
};

const AddCaseNodeButton: React.FC<AddCaseNodeButtonProps> = ({ c }) => {
  const params = useParams();

  const dispatch = useAppDispatch();

  const [isResolved, setIsResolved] = useState(false);

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

    dispatch(
      addCaseNote({ id: (params.id as string) || "0", note: data.note })
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

  useEffect(() => {
    if (typeof c != "string") {
      console.log(c.status);

      if (c.status == "CLOSED") {
        setIsResolved(true);
      } else {
        setIsResolved(false);
      }
    }
  }, [c]);

  return isResolved == true ? (
    <></>
  ) : typeof c == "string" ? (
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

export default AddCaseNodeButton;
