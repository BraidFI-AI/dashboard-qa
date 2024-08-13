"use client";

import { useAppDispatch } from "@/redux/store/store";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import MyText from "@/core/components/Text/Text";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { enqueueSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { CreateDeveloper } from "@/core/api/ApiTypes";
import { createDeveloper } from "@/redux/slices/DeveloperSlice";
import RequireRole from "@/core/components/RequireRole";
import { ADMIN_ROUTE } from "@/core/constants";

const CreateDeveloperPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
  } = useForm<CreateDeveloper>();
  const onSubmit: SubmitHandler<CreateDeveloper> = (data: CreateDeveloper) => {
    console.log(data);

    setSubmitting(true);

    dispatch(createDeveloper(data)).then(() => {
      router.replace("/configuration/developers");
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
        <MyText>Developer ID</MyText>
        <MyControlledTextField
          name="tenantId"
          displayName="Tenant ID"
          control={control}
          errors={errors}
          rules={
            submitting
              ? { required: false }
              : {
                  required: true,
                  validate: (value: string, _: any) => {
                    if (value.length > 10) {
                      return "Tenant ID must be less then 10 characters";
                    }
                  },
                }
          }
          value=""
        />
        <Box className="pb-4"></Box>
        <MyText>Developer name</MyText>
        <MyControlledTextField
          name="name"
          displayName="Developer name"
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
        <Box className="pb-8"></Box>
        <Box className="w-fit">
          <MyBlueButton type="submit" submitting={submitting}>
            Create Developer
          </MyBlueButton>
        </Box>
      </Box>
    </form>
  );
};

export default RequireRole(CreateDeveloperPage, ADMIN_ROUTE);
