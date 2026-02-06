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
import { addCaseNote, resolveCase } from "@/redux/slices/cases_slice";
import MyRedButton from "../../Button/MyRedButton";
import MyControlledAutocomplete from "../../Autocomplete/MyControlledAutocomplete";
import MyCheckbox from "../../Button/MyCheckbox ";
import { set } from "lodash";
import { useSelector } from "react-redux";
import { Case } from "@/core/api/ApiTypes";

const ResolveCaseButton = () => {
  const params = useParams();

  const dispatch = useAppDispatch();

  const c: "loading" | string | Case = useSelector(
    (state: any) => state.cases.case,
  );

  const [isResolved, setIsResolved] = useState(false);

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
    caseId: string;
    note: string;
    updateAttachedAlerts: boolean;
    action: string;
  }>({
    defaultValues: {
      caseId: (params.id as string) || "0",
      action: "DECLINE",
      note: "",
      updateAttachedAlerts: true,
    },
  });
  const onSubmit: SubmitHandler<{
    caseId: string;
    note: string;
    updateAttachedAlerts: boolean;
    action: string;
  }> = (data: {
    caseId: string;
    note: string;
    updateAttachedAlerts: boolean;
    action: string;
  }) => {
    data = { ...data, updateAttachedAlerts: updateAlerts };

    console.log("data:", data);
    setSubmitting(true);

    dispatch(resolveCase(data)).then((result) => {
      if (typeof result.payload === "string") {
        enqueueSnackbar(result.payload, { variant: "error", persist: true });
      } else {
        enqueueSnackbar("Case resolved", { variant: "success" });
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
      <div className="w-fit">
        <MyRedButton
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Resolve Case
        </MyRedButton>
      </div>
      <MyModal
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
        height="410px"
      >
        <MyText size="lg">Resolve Case</MyText>
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
        <div className="h-3" />
        <MyCheckbox
          title="Update attached alerts?"
          checked={updateAlerts}
          onChange={(val: boolean) => {
            setUpdateAlerts(val);
          }}
        />
        <div className="pb-8" />
        <div className="w-fit">
          <MyBlueButton
            submitting={submitting}
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
          >
            Resolve Case
          </MyBlueButton>
        </div>
        <div className="pb-6" />
      </MyModal>
    </>
  );
};

export default ResolveCaseButton;
