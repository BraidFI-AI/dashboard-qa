"use client";

import { useAppDispatch } from "@/redux/store/store";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import MyText from "@/core/components/Text/Text";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import { CreateProduct } from "@/core/api/ApiTypes";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { enqueueSnackbar } from "notistack";
import { fetchProgramIdsListWithNames } from "@/redux/slices/ProgramSlice";
import { useRouter } from "next/navigation";
import {
  createDepositTokenProduct,
  createProduct,
  createStableCoinProduct,
} from "@/redux/slices/ProductSlice";
import RequireRole from "@/core/components/RequireRole";
import { ADMIN_ROUTE } from "@/core/constants";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import { fetchTenetIdsListNew } from "@/redux/slices/DeveloperSlice";

const CreateProductPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);

  const [programIdsList, setProgramIdsList] = useState<
    "loading" | string | { name: string; id: string }[]
  >("loading");
  const [programId, setProgramId] = useState<string | null>(null);

  const [tenetIdsList, setTenetIdsList] = useState<
    "loading" | string | string[]
  >("loading");

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
  } = useForm<CreateProduct>();
  const onSubmit: SubmitHandler<CreateProduct> = (data: any) => {
    if (programId == null) {
      enqueueSnackbar(`Please select Program first`, {
        variant: "error",
        persist: true,
      });
      return;
    }

    data = { ...data, programId: programId };

    setSubmitting(true);

    console.log(data);

    dispatch(createProduct(data)).then(() => {
      router.replace("/configuration/products");
    });
  };

  useEffect(() => {
    dispatch(fetchProgramIdsListWithNames()).then((data: any) => {
      setProgramIdsList(data.payload);
      if (data.payload?.length > 0) {
        setProgramId(data.payload[0]?.id);
      }
    });

    dispatch(fetchTenetIdsListNew()).then((data: any) => {
      setTenetIdsList(data.payload);
    });
  }, [dispatch]);

  useEffect(() => {
    if (isSubmitted && !isValid) {
      console.log(errors);
      enqueueSnackbar("Invalid Fields", { variant: "error" });
    }
  }, [submitCount, errors, isSubmitted, isValid]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-6">
      <div className="flex flex-row w-[650px] justify-between">
        <Box className="flex flex-col w-[300px]">
          <MyText>Product Name</MyText>
          <MyControlledTextField
            name="productName"
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
          <MyText>Product ID</MyText>
          <MyControlledTextField
            name="productId"
            displayName="Product ID"
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
          <MyText>Developer Name</MyText>
          {tenetIdsList == "loading" ? (
            <MyCircularProgressIndicator />
          ) : typeof tenetIdsList == "string" ? (
            <ErrorPage
              error={tenetIdsList}
              recoveryButtonTitle="Retry"
              recoveryButtonOnClick={() => {
                dispatch(fetchTenetIdsListNew()).then((data: any) => {
                  setTenetIdsList(data.payload);
                });
              }}
            />
          ) : tenetIdsList.length == 0 ? (
            <MyText>No tenant found</MyText>
          ) : (
            <MyControlledAutocomplete
              value={tenetIdsList[0]}
              displayName="Developer Name"
              name={"tenantId"}
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: true,
                    }
              }
              options={tenetIdsList}
            />
          )}
          <Box className="pb-4"></Box>
          <MyText>Program ID</MyText>
          {programIdsList == "loading" ? (
            <MyCircularProgressIndicator />
          ) : typeof programIdsList == "string" ? (
            <ErrorPage
              error={programIdsList}
              recoveryButtonTitle="Retry"
              recoveryButtonOnClick={() => {
                dispatch(fetchProgramIdsListWithNames()).then((data: any) => {
                  setProgramIdsList(data.payload);
                  if (data.payload?.length > 0) {
                    setProgramId(data.payload[0]?.id);
                  }
                });
              }}
            />
          ) : programIdsList.length == 0 ? (
            <MyText>No Program found</MyText>
          ) : (
            <MyControlledAutocomplete
              value={`${programIdsList[0].id} - ${programIdsList[0].name}`}
              displayName="Program Name"
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
              options={programIdsList?.map((prg) => {
                return `${prg.id} - ${prg.name}`;
              })}
              customOnChange={(val: string) => {
                const id = val?.split(" - ")[0];
                if (id) {
                  setProgramId(id);
                }
              }}
            />
          )}
          <Box className="pb-4"></Box>
          <MyText>Interest Rate</MyText>
          <MyControlledTextField
            name="interestRate"
            displayName="Interest Rate"
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
          <MyText>Is Active</MyText>
          <MyControlledAutocomplete
            name="isActive"
            displayName="isActive"
            control={control}
            errors={errors}
            options={["true", "false"]}
            rules={
              submitting
                ? { required: false }
                : {
                    required: true,
                  }
            }
            value={"false"}
          />
          <Box className="pb-4"></Box>
          <MyText>Length</MyText>
          <MyControlledTextField
            name="length"
            displayName="Length"
            control={control}
            errors={errors}
            rules={
              submitting
                ? { required: false, pattern: "" }
                : {
                    required: true,
                    pattern: /^[0-9]+$/,
                  }
            }
            value=""
          />
          <Box className="pb-4"></Box>
          <MyText>Prefix</MyText>
          <MyControlledTextField
            name="prefix"
            displayName="Prefix"
            control={control}
            errors={errors}
            rules={{}}
            value=""
          />
          <Box className="pb-4"></Box>
          <MyText>Suffix</MyText>
          <MyControlledTextField
            name="suffix"
            displayName="Suffix"
            control={control}
            errors={errors}
            rules={{}}
            value=""
          />
          <Box className="pb-8"></Box>
        </Box>
        <Box className="flex flex-col w-[300px]">
          <MyText>Settlement Email</MyText>
          <MyControlledTextField
            name="settlementEmail"
            displayName="Settlement Email"
            control={control}
            errors={errors}
            rules={
              submitting
                ? { required: false }
                : {
                    required: true,
                    validate: (value: any, formValues: any) => {
                      const chars = value.split("");
                      if (
                        !(
                          chars.filter((c: any) => c == "@").length == 1 &&
                          chars.filter((c: any) => c == ".").length >= 1
                        )
                      ) {
                        return "Invalid Email";
                      }
                    },
                  }
            }
            value=""
          />
          <Box className="pb-4"></Box>
          <MyText>Settlement Phone Number</MyText>
          <MyControlledTextField
            name="settlementPhoneNumber"
            displayName="Settlement Phone Number"
            control={control}
            errors={errors}
            rules={
              submitting
                ? { required: false }
                : {
                    required: true,
                    pattern: /^[0-9]+$/,
                  }
            }
            value=""
          />
          <Box className="pb-4"></Box>
          <MyText>Bank Name</MyText>
          <MyControlledTextField
            name="bankName"
            displayName="Bank Name"
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
          <MyText>Account Type</MyText>
          <MyControlledAutocomplete
            value={"CHECKING"}
            displayName="Account Type"
            name={"accountType"}
            control={control}
            errors={errors}
            rules={
              submitting
                ? { required: false }
                : {
                    required: true,
                  }
            }
            options={["CHECKING", "SAVINGS", "BOTH"]}
          />
          <Box className="pb-4"></Box>
          <MyText>Duplicate Payment Days</MyText>
          <MyControlledTextField
            name="duplicatePaymentDays"
            displayName="Duplicate Payment Days"
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
          <MyText>Interest Pay Day of Month</MyText>
          <MyControlledTextField
            name="interestPayDayOfMonth"
            displayName="Interest Pay Day of Month"
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
          <MyText>Customer Account Type</MyText>
          <MyControlledAutocomplete
            name="customerAccountType"
            displayName="Customer Account Type"
            control={control}
            errors={errors}
            options={["BUSINESS", "INDIVIDUAL", "BOTH"]}
            rules={
              submitting
                ? { required: false }
                : {
                    required: true,
                  }
            }
            value={"BUSINESS"}
          />
          <Box className="pb-8"></Box>
          <Box className="w-40">
            <MyBlueButton type="submit" submitting={submitting}>
              Create Product
            </MyBlueButton>
          </Box>
        </Box>
      </div>
    </form>
  );
};

export default RequireRole(CreateProductPage, ADMIN_ROUTE);
