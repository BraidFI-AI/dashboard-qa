"use client";

import { CreateProgram, Program } from "@/core/api/ApiTypes";
import timestampToDate from "@/core/utils/timestampToDate";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import MyText from "@/core/components/Text/Text";
import React, { useEffect, useState } from "react";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { useAppDispatch } from "@/redux/store/store";
import { setTitle } from "@/redux/slices/AppSlice";
import {
  createProgramBaseUrl,
  fetchProgram,
  updateProgram,
} from "@/redux/slices/ProgramSlice";
import { SubmitHandler, useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import Link from "next/link";
import MyEditableTextField from "@/core/components/TextField/MyEditableTextField";
import ItemRow from "@/core/components/Text/ItemRow";
import RequireRole from "@/core/components/RequireRole";
import { ADMIN_ROUTE } from "@/core/constants";

const programTypeMappings = (type: string) => {
  console.log("hiiii", type);
  if (type === "GOVERNMENT") {
    return "Government";
  } else if (type === "FINANCIAL_INSTITUTION") {
    return "Financial Institution";
  } else if (type === "CORPORATION") {
    return "Corporation";
  } else {
    return "Other";
  }
};

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

const ProgramDetails = ({ params }: { params: { id: string } }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const [program, setProgram] = useState<Program | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingType, setIsEditingType] = useState(false);
  const [isEditingActive, setIsEditingActive] = useState(false);
  const [isEditingBaseUrl, setIsEditingBaseUrl] = useState(false);

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
    reset,
  } = useForm<{
    name: string;
    type: string;
    isActive: boolean;
    baseUrl: string;
    achOdfi: string;
  }>({
    defaultValues: {
      name: program?.name,
      isActive: program?.isActive,
      type: program?.type,
      achOdfi: program?.achOdfi ?? "",
    },
  });
  const onSubmit: SubmitHandler<{
    name: string;
    type: string;
    isActive: boolean;
    baseUrl: string;
    achOdfi: string;
  }> = (data: {
    name: string;
    type: string;
    isActive: boolean;
    baseUrl: string;
    achOdfi: string;
  }) => {
    console.log("program type:", program?.type);
    console.log(data);

    data = {
      ...data,
      type:
        data.type[data.type.length - 1] ==
        data.type[data.type.length - 1].toUpperCase()
          ? data.type
          : programMappings(data.type),
    };

    setSubmitting(true);

    if (program) {
      if (!isEditingName) {
        data.name = program.name ? program.name : "";
      }

      if (!isEditingType) {
        data.type =
          program.type != null
            ? program.type[data.type.length - 1] ==
              program.type[data.type.length - 1].toUpperCase()
              ? program.type
              : programMappings(program.type)
            : "OTHER";
      }

      if (!isEditingActive) {
        data.isActive = program.isActive ? program.isActive : false;
      }

      console.log(data);

      if (
        !isEditingBaseUrl &&
        (isEditingName || isEditingType || isEditingActive)
      ) {
        dispatch(
          updateProgram({
            id: parseInt(params.id),
            program: {
              name: data.name,
              type: data.type,
              isActive: data.isActive,
              achOdfi: data.achOdfi,
            },
          })
        ).then((data: any) => {
          if (data.payload) {
            enqueueSnackbar("Program updated successfully!", {
              variant: "success",
            });
          }
          setSubmitting(false);
          setIsEditingName(false);
          setIsEditingType(false);
          setIsEditingActive(false);
          setIsEditingBaseUrl(false);
          setRefresh(true);
        });
      } else if (
        isEditingBaseUrl &&
        (isEditingName || isEditingType || isEditingActive)
      ) {
        dispatch(
          updateProgram({
            id: parseInt(params.id),
            program: {
              name: data.name,
              type: data.type,
              isActive: data.isActive,
              achOdfi: data.achOdfi,
            },
          })
        ).then((prg: any) => {
          if (prg.payload) {
            enqueueSnackbar("Program updated successfully!", {
              variant: "success",
            });
          }
          dispatch(
            createProgramBaseUrl({ id: parseInt(params.id), url: data.baseUrl })
          ).then((data: any) => {
            if (data.payload) {
              enqueueSnackbar("Created Base url successfully!", {
                variant: "success",
              });
            }
            setSubmitting(false);
            setIsEditingName(false);
            setIsEditingType(false);
            setIsEditingActive(false);
            setIsEditingBaseUrl(false);
            setRefresh(true);
          });
        });
      } else if (
        isEditingBaseUrl &&
        !isEditingName &&
        !isEditingType &&
        !isEditingActive
      ) {
        dispatch(
          createProgramBaseUrl({ id: parseInt(params.id), url: data.baseUrl })
        ).then((data: any) => {
          if (data.payload) {
            enqueueSnackbar("Created Base url successfully!", {
              variant: "success",
            });
          }
          setSubmitting(false);
          setIsEditingName(false);
          setIsEditingType(false);
          setIsEditingActive(false);
          setIsEditingBaseUrl(false);
          setRefresh(true);
        });
      }
    }
  };

  useEffect(() => {
    if (refresh) {
      setLoading(true);
      dispatch(setTitle("Program"));
      dispatch(fetchProgram(parseInt(params.id))).then((data: any) => {
        if (data.payload) {
          setProgram(data.payload);
          dispatch(setTitle(data.payload.name));
          reset({
            name: data.payload.name,
            isActive: data.payload.isActive,
            type: data.payload.type,
          });
        }
        setLoading(false);
        setRefresh(false);
      });
    }
  }, [dispatch, params.id, reset, refresh]);

  return (
    <div className="pb-10 w-[300px]">
      {loading ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading Program Details...</div>
        </div>
      ) : program == null ? (
        <MyText size="md">Program not found</MyText>
      ) : (
        <>
          <ItemRow title="Program ID" value={program.id}></ItemRow>
          <MyEditableTextField
            editing={isEditingName}
            setEditing={setIsEditingName}
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
            value={program.name != null ? program.name : ""}
            submitting={false}
          />
          <ItemRow title="Customer ID" value={program.customerId}></ItemRow>
          <MyEditableTextField
            clearable={false}
            editing={isEditingType}
            setEditing={setIsEditingType}
            name="type"
            displayName="Type"
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
            value={
              program.type != null ? programTypeMappings(program.type) : ""
            }
            submitting={false}
          />
          <MyEditableTextField
            clearable={false}
            editing={isEditingType}
            setEditing={setIsEditingType}
            name="achOdfi"
            displayName="ACH ODFI"
            control={control}
            errors={errors}
            rules={
              submitting
                ? { required: false }
                : {
                    required: true,
                  }
            }
            value={program.achOdfi ?? ""}
            submitting={false}
          />
          <ItemRow
            title="Nacha Issuer ID"
            value={program.nachaIssuerId}
          ></ItemRow>
          <MyEditableTextField
            editing={isEditingActive}
            setEditing={setIsEditingActive}
            name="isActive"
            displayName="is Active"
            control={control}
            errors={errors}
            rules={
              submitting
                ? { required: false }
                : {
                    required: true,
                  }
            }
            value={
              program.isActive != null
                ? program.isActive.toString()[0].toUpperCase() +
                  program.isActive.toString().slice(1)
                : ""
            }
            options={["True", "False"]}
            submitting={false}
          />
          {/* {program.baseUrl != null || isEditingBaseUrl ? (
            <MyEditableTextField
              editing={isEditingBaseUrl}
              setEditing={setIsEditingBaseUrl}
              name="baseUrl"
              displayName="Base URL"
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
              submitting={false}
            />
          ) : (
            <div className="pb-[20px]">
              <MyText>Create Base Url</MyText>
              <MyBlueButton
                onClick={() => {
                  setIsEditingBaseUrl(true);
                }}
              >
                Create Base Url
              </MyBlueButton>
            </div>
          )} */}
          <ItemRow
            title="Created Date"
            value={timestampToDate(program.createdAt)}
          ></ItemRow>
          <ItemRow
            title="Updated Date"
            value={timestampToDate(program.updatedAt)}
          ></ItemRow>
        </>
      )}
      <Box className="pb-4"></Box>
      {(isEditingName ||
        isEditingType ||
        isEditingActive ||
        isEditingBaseUrl) && (
        <Box className="w-40">
          <MyBlueButton
            submitting={submitting}
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
          >
            Update Program
          </MyBlueButton>
        </Box>
      )}
    </div>
  );
};

export default RequireRole(ProgramDetails, ADMIN_ROUTE);
