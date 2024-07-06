"use client";

import { useAppDispatch } from "@/redux/store/store";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import MyText from "@/core/components/Text/Text";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import { CreateProgram } from "@/core/api/ApiTypes";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { enqueueSnackbar } from "notistack";
import { createProgram } from "@/redux/slices/ProgramSlice";
import { useRouter } from "next/navigation";
import RequireRole from "@/core/components/RequireRole";
import { ADMIN_ROUTE } from "@/core/constants";

const programMappings = (type: string) => {
  if (type === "Government") {
    return "GOVERNMENT";
  } else if (type === "Financial Institution") {
    return "FINANCIAL_INSTITUTION";
  } else if (type === "Corporation") {
    return "CORPORATION";
  } else {
    return "OTHER";
  }
};

const CreateProgramPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
  } = useForm<CreateProgram>();
  const onSubmit: SubmitHandler<CreateProgram> = (data: CreateProgram) => {
    data = { ...data, type: programMappings(data.type), isActive: true };

    console.log(data);

    setSubmitting(true);

    dispatch(createProgram(data)).then(() => {
      router.replace("/configuration/programs");
    });
  };

  useEffect(() => {
    if (isSubmitted && !isValid) {
      enqueueSnackbar("Invalid Fields", { variant: "error" });
    }
  }, [submitCount, isSubmitted, isValid]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-6">
      <Box className="flex flex-col w-1/3">
        <MyText>Program name</MyText>
        <MyControlledTextField
          name="name"
          displayName="Program Name"
          control={control}
          errors={errors}
          rules={
            submitting
              ? { required: false }
              : {
                  required: true,
                }
          }
          value=""
        />
        <Box className="pb-4"></Box>
        <MyText>Type</MyText>
        <MyControlledAutocomplete
          name="type"
          displayName="Program Type"
          control={control}
          errors={errors}
          options={[
            "Government",
            "Financial Institution",
            "Corporation",
            "Other",
          ]}
          rules={
            submitting
              ? { required: false }
              : {
                  required: true,
                }
          }
          value={"Government"}
        />
        <Box className="pb-8"></Box>
        <Box className="w-40">
          <MyBlueButton type="submit" submitting={submitting}>
            Create Program
          </MyBlueButton>
        </Box>
      </Box>
    </form>
  );
};

export default RequireRole(CreateProgramPage, ADMIN_ROUTE);
