"use client";

import {
  FundsAvailability,
  Product,
  UpdateFundsAvailability,
} from "@/core/api/ApiTypes";
import ItemRow from "@/core/components/Text/ItemRow";
import MyText from "@/core/components/Text/Text";
import {
  fetchFundsAvailability,
  fetchProduct,
  updateFundsAvailability,
} from "@/redux/slices/ProductSlice";
import { useAppDispatch } from "@/redux/store/store";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { setTitle } from "@/redux/slices/AppSlice";
import timestampToDate from "@/core/utils/timestampToDate";
import { SubmitHandler, useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import MyEditableTextField from "@/core/components/TextField/MyEditableTextField";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import React from "react";

const ACHConfig = ({ params }: { params: { id: string } }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [fundsAvailability, setFundsAvailability] =
    useState<FundsAvailability | null>(null);

  const [refresh, setRefresh] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [isEditingACHHold, setIsEditingACHHold] = useState(false);
  const [isEditingIIH, setIsEditingIIH] = useState(false);

  const [product, setProduct] = useState<Product | null>(null);

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
    reset,
  } = useForm<UpdateFundsAvailability>({
    defaultValues: {
      achHoldDays: fundsAvailability?.achHoldDays,
      checkDepositHoldDays: fundsAvailability?.checkDepositHoldDays,
    },
  });
  const onSubmit: SubmitHandler<UpdateFundsAvailability> = async (
    data: UpdateFundsAvailability
  ) => {
    setSubmitting(true);

    if (fundsAvailability) {
      if (!isEditingACHHold) {
        data.achHoldDays = fundsAvailability.achHoldDays
          ? fundsAvailability.achHoldDays
          : 0;
      }

      if (!isEditingIIH) {
        data.checkDepositHoldDays = fundsAvailability.checkDepositHoldDays
          ? fundsAvailability.checkDepositHoldDays
          : 0;
      }

      console.log("data:", data);

      dispatch(
        updateFundsAvailability({
          id: parseInt(params.id),
          fundsAvailability: data,
        })
      ).then((fa: any) => {
        if (fa.payload) {
          enqueueSnackbar("Funds availability updated!", {
            variant: "success",
          });
        }

        setRefresh(true);
      });
    }
  };

  useEffect(() => {
    if (refresh) {
      dispatch(setTitle("Product"));
      dispatch(fetchProduct(parseInt(params.id))).then((product: any) => {
        if (product.payload != null) {
          setProduct(product.payload);
          dispatch(setTitle(product.payload.productName));
          dispatch(fetchFundsAvailability(product.payload.id)).then(
            (data: any) => {
              if (data.payload) {
                reset({
                  achHoldDays: data.payload.achHoldDays,
                  checkDepositHoldDays: data.payload.checkDepositHoldDays,
                });
              }

              setFundsAvailability(data.payload);
              setRefresh(false);
              setIsEditingACHHold(false);
              setIsEditingIIH(false);
              setSubmitting(false);
              setLoading(false);
            }
          );
        } else {
          setRefresh(false);
          setSubmitting(false);
          setLoading(false);
        }
      });
    }
  }, [dispatch, params.id, refresh, reset]);

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading Funds Availability...</div>
        </div>
      ) : fundsAvailability == null || product == null ? (
        <MyText size="md">No ACH Config found</MyText>
      ) : (
        <div className="w-[300px]">
          <ItemRow title="ID" value={fundsAvailability.id}></ItemRow>
          <ItemRow
            title="Product Name"
            value={product.productName ?? ""}
          ></ItemRow>
          <MyEditableTextField
            editing={isEditingACHHold}
            setEditing={setIsEditingACHHold}
            name="achHoldDays"
            displayName="ACH Hold Days"
            control={control}
            errors={errors}
            rules={
              submitting
                ? { required: false, pattern: null }
                : {
                    required: true,
                    pattern: /^[0-9]+$/,
                  }
            }
            value={
              fundsAvailability.achHoldDays != null
                ? fundsAvailability.achHoldDays
                : 0
            }
            submitting={false}
          />
          <MyEditableTextField
            editing={isEditingIIH}
            setEditing={setIsEditingIIH}
            name="checkDepositHoldDays"
            displayName="Check Deposit Hold Days"
            control={control}
            errors={errors}
            rules={
              submitting
                ? { required: false, pattern: null }
                : {
                    required: true,
                    pattern: /^[0-9]+$/,
                  }
            }
            value={
              fundsAvailability.checkDepositHoldDays != null
                ? fundsAvailability.checkDepositHoldDays
                : 0
            }
            submitting={false}
          />
          <ItemRow
            title="Created Date"
            value={timestampToDate(fundsAvailability.createdAt)}
          ></ItemRow>
          <ItemRow
            title="Updated Date"
            value={timestampToDate(fundsAvailability.updatedAt)}
          ></ItemRow>
          {(isEditingACHHold || isEditingIIH) && (
            <Box className="w-fit pt-4">
              <MyBlueButton
                submitting={submitting}
                onClick={() => {
                  handleSubmit(onSubmit)();
                }}
              >
                Update funds availability
              </MyBlueButton>
            </Box>
          )}
        </div>
      )}
    </>
  );
};

export default ACHConfig;
