"use client";

import { useAppDispatch } from "@/redux/store/store";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import MyText from "@/core/components/Text/Text";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import { CreateForm } from "@/core/api/ApiTypes";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { enqueueSnackbar } from "notistack";
import { fetchProgramIdsList } from "@/redux/slices/ProgramSlice";
import { useRouter } from "next/navigation";
import { fetchProductIdsList } from "@/redux/slices/ProductSlice";
import { createForm } from "@/redux/slices/CustomizableFormSlice";

const CreateProgram = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [loadingProductIdsList, setLoadingProductIdsList] = useState(true);
  const [loadingProgramIdsList, setLoadingProgramIdsList] = useState(true);
  const [productIdsList, setProductIdsList] = useState<string[] | null>();
  const [programIdsList, setProgramIdsList] = useState<string[] | null>();

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
  } = useForm<CreateForm>();
  const onSubmit: SubmitHandler<CreateForm> = (data: CreateForm) => {
    console.log(data);

    setSubmitting(true);

    dispatch(createForm(data)).then(() => {
      router.replace("/configuration/forms");
    });
  };

  useEffect(() => {
    dispatch(fetchProductIdsList()).then((data: any) => {
      setProductIdsList(
        data.payload.map((prd: any) => {
          return prd.id;
        })
      );
      setLoadingProductIdsList(false);
    });

    dispatch(fetchProgramIdsList()).then((data: any) => {
      setProgramIdsList(data.payload);
      setLoadingProgramIdsList(false);
    });
  }, [dispatch]);

  useEffect(() => {
    if (isSubmitted && !isValid) {
      enqueueSnackbar("Invalid Fields", { variant: "error" });
    }
  }, [submitCount, isValid, isSubmitted]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-6">
      <Box className="flex flex-col w-1/3">
        <MyText>Form name</MyText>
        <MyControlledTextField
          name="name"
          displayName="Form Name"
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
        <MyText>Program ID</MyText>
        {loadingProgramIdsList ? (
          <CircularProgress size="25px" />
        ) : programIdsList == null || programIdsList.length == 0 ? (
          <div></div>
        ) : (
          <MyControlledAutocomplete
            value={programIdsList[0]}
            displayName="Program ID"
            name={"programId"}
            control={control}
            errors={errors}
            rules={
              submitting
                ? { required: false }
                : {
                    required: true,
                  }
            }
            options={programIdsList}
          />
        )}
        <Box className="pb-4"></Box>
        <MyText>Product ID</MyText>
        {loadingProductIdsList ? (
          <CircularProgress size="25px" />
        ) : productIdsList == null || productIdsList.length == 0 ? (
          <div></div>
        ) : (
          <MyControlledAutocomplete
            value={productIdsList[0]}
            displayName="Product ID"
            name={"productId"}
            control={control}
            errors={errors}
            rules={
              submitting
                ? { required: false }
                : {
                    required: true,
                  }
            }
            options={productIdsList}
          />
        )}
        <Box className="pb-8"></Box>
        <Box className="w-40">
          <MyBlueButton type="submit" submitting={submitting}>
            Create Form
          </MyBlueButton>
        </Box>
      </Box>
    </form>
  );
};

export default CreateProgram;
