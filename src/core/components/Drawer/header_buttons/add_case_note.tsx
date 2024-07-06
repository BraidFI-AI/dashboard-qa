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
import { addCaseNote } from "@/redux/slices/cases_slice";
import { Case } from "@/core/api/ApiTypes";
import { useSelector } from "react-redux";

const AddCaseNodeButton = () => {
  const params = useParams();

  const dispatch = useAppDispatch();

  const c: "loading" | string | Case = useSelector(
    (state: any) => state.cases.case
  );

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

    dispatch(addCaseNote({ id: params.id.toString(), note: data.note })).then(
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

export default AddCaseNodeButton;
