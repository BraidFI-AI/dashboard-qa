"use client";

import { Program } from "@/core/api/ApiTypes";
import MyText from "@/core/components/Text/Text";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import { createProgramBaseUrl } from "@/redux/slices/ProgramSlice";
import { useAppDispatch } from "@/redux/store/store";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import { SubmitHandler, useForm } from "react-hook-form";
import MyBlueButton from "@/core/components/Button/MyBlueButton";

type BaseUrlSettingsProps = {
  program: Program;
};

const BaseUrlSettings: React.FC<BaseUrlSettingsProps> = ({ program }) => {
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
  } = useForm<{ baseUrl: string }>();
  const onSubmit: SubmitHandler<{ baseUrl: string }> = (data: {
    baseUrl: string;
  }) => {
    console.log(data);

    setSubmitting(true);

    dispatch(createProgramBaseUrl({ id: program.id, url: data.baseUrl })).then(
      () => {
        enqueueSnackbar("Base Url created!", {
          variant: "success",
        });
        setSubmitting(false);
      }
    );
  };

  return (
    <div>
      <MyText>Base Url</MyText>
      <MyControlledTextField
        name="baseUrl"
        displayName="Base Url"
        control={control}
        errors={errors}
        rules={
          submitting
            ? { required: false }
            : {
                required: true,
              }
        }
        value={program.baseUrl}
      />
      <Box className="pb-4"></Box>
      <MyBlueButton
        submitting={submitting}
        onClick={() => {
          handleSubmit(onSubmit)();
        }}
      >
        Update Base Url
      </MyBlueButton>
    </div>
  );
};

export default BaseUrlSettings;
