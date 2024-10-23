"use client";

import {
  FundsAvailability,
  OnboardingConfig,
  Product,
  UpdateFundsAvailability,
  UpdateProduct,
} from "@/core/api/ApiTypes";
import { useAppDispatch } from "@/redux/store/store";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import MyText from "@/core/components/Text/Text";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { enqueueSnackbar } from "notistack";
import {
  createOnboardingUrl,
  fetchFundsAvailability,
  fetchOnboardingConfig,
  fetchProduct,
  updateFundsAvailability,
  updateOnboardingConfigButtonColor,
  updateProduct,
} from "@/redux/slices/ProductSlice";
import { setTitle } from "@/redux/slices/AppSlice";
import MyExpandableButton from "@/core/components/Button/MyExpandableButton";
import Colorful from "@uiw/react-color-colorful";
import MyTextField from "@/core/components/TextField/MyTextField";
import OnbaordingSettings from "./components/OnboardingSettings";
import React from "react";

const ProductSettings = ({ params }: { params: { id: string } }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [fundsAvailability, setFundsAvailability] =
    useState<FundsAvailability | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [expandDetails, toggleExpandDetails] = useState(false);
  const [expandFundsAvailability, toggleExpandFundsAvailability] =
    useState(false);
  const [expandOnboardingConfig, toggleExpandOnboardingConfig] =
    useState(false);

  // form hooks for updating product details
  const {
    formState: {
      errors: productErrors,
      submitCount: productSubmitCount,
      isSubmitted: productIsSubmitted,
      isValid: productIsValid,
    },
    control: productControl,
    handleSubmit: productHandleSubmit,
  } = useForm<UpdateProduct>();
  const productOnSubmit: SubmitHandler<UpdateProduct> = (
    data: UpdateProduct
  ) => {
    console.log(data);
    if (product != null) {
      setSubmitting(true);

      dispatch(updateProduct({ id: product.id ?? 0, product: data })).then(
        () => {
          setRefresh(true);
          setSubmitting(false);
        }
      );
    }
  };

  // form hook for updating funds availability
  const {
    formState: {
      errors: fundsErrors,
      submitCount: fundsSubmitCount,
      isSubmitted: fundsIsSubmitted,
      isValid: fundsIsValid,
    },
    control: fundsControl,
    handleSubmit: fundsHandleSubmit,
  } = useForm<UpdateFundsAvailability>();
  const fundsOnSubmit: SubmitHandler<UpdateFundsAvailability> = (
    data: UpdateFundsAvailability
  ) => {
    console.log(data);
    if (product != null && fundsAvailability != null) {
      setSubmitting(true);

      dispatch(
        updateFundsAvailability({
          id: product.id ?? 0,
          fundsAvailability: data,
        })
      ).then(() => {
        setRefresh(true);
        setSubmitting(false);
      });
    }
  };

  useEffect(() => {
    if (refresh) {
      setLoading(true);
      dispatch(setTitle("Product"));
      dispatch(fetchProduct(parseInt(params.id))).then((product: any) => {
        if (product.payload) {
          setProduct(product.payload);
          dispatch(setTitle(product.payload.productName));

          dispatch(fetchFundsAvailability(product.payload.id)).then(
            (data: any) => {
              setFundsAvailability(data.payload);
              setLoading(false);
            }
          );
        }
      });
      setRefresh(false);
    }
  }, [refresh, dispatch, params.id]);

  useEffect(() => {
    if (productIsSubmitted && !productIsValid) {
      enqueueSnackbar("Invalid Fields", { variant: "error" });
    }
  }, [productSubmitCount, productIsSubmitted, productIsValid]);

  useEffect(() => {
    if (fundsIsSubmitted && !fundsIsValid) {
      enqueueSnackbar("Invalid Fields", { variant: "error" });
    }
  }, [fundsSubmitCount, fundsIsSubmitted, fundsIsValid]);

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading Prouct Details...</div>
        </div>
      ) : product == null ? (
        <MyText size="md">Prouct Not found</MyText>
      ) : (
        <div className="w-1/3">
          <MyExpandableButton
            title="Product Settings"
            expand={expandDetails}
            toggleExpand={toggleExpandDetails}
          />
          <Divider />
          <div className="pb-4"></div>
          {expandDetails && (
            <form
              onSubmit={productHandleSubmit(productOnSubmit)}
              className="pb-6"
            >
              <Box className="flex flex-col">
                <MyText>Product name</MyText>
                <MyControlledTextField
                  name="productName"
                  displayName="Product Name"
                  control={productControl}
                  errors={productErrors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: true,
                        }
                  }
                  value={product.productName ?? ""}
                />
                <Box className="pb-4"></Box>
                <MyText>Product ID</MyText>
                <MyControlledTextField
                  name="productId"
                  displayName="Product ID"
                  control={productControl}
                  errors={productErrors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: true,
                        }
                  }
                  value={product.productId ?? ""}
                />
                <Box className="pb-4"></Box>
                <MyText>Is Active</MyText>
                <MyControlledAutocomplete
                  name="isActive"
                  displayName="Is Active"
                  control={productControl}
                  errors={productErrors}
                  options={["True", "False"]}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: true,
                        }
                  }
                  value={
                    "product.isActive?.toString()[0].toUpperCase() +product.isActive?.toString().slice(1)"
                  }
                />
                <Box className="pb-8"></Box>
                <Box className="w-40">
                  <MyBlueButton type="submit" submitting={submitting}>
                    Update Product
                  </MyBlueButton>
                </Box>
              </Box>
            </form>
          )}
          <div className="pb-4"></div>
          <MyExpandableButton
            title="Funds Availability Settings"
            expand={expandFundsAvailability}
            toggleExpand={toggleExpandFundsAvailability}
          />
          <Divider />
          <div className="pb-4"></div>
          {fundsAvailability == null ? (
            <MyText size="md">Funds Availability Not found</MyText>
          ) : (
            <>
              {expandFundsAvailability && (
                <form
                  onSubmit={fundsHandleSubmit(fundsOnSubmit)}
                  className="pb-6"
                >
                  <Box className="flex flex-col">
                    <MyText>ACH Hold Days</MyText>
                    <MyControlledTextField
                      name="achHoldDays"
                      displayName="ACH Hold Days"
                      control={fundsControl}
                      errors={fundsErrors}
                      rules={
                        submitting
                          ? { required: false }
                          : {
                              required: true,
                            }
                      }
                      value={fundsAvailability.achHoldDays.toString()}
                    />
                    <Box className="pb-4"></Box>
                    <MyText>Inter Issuer Hold</MyText>
                    <MyControlledTextField
                      name="checkDepositHoldDays"
                      displayName="Check Deposit Hold Days"
                      control={fundsControl}
                      errors={fundsErrors}
                      rules={
                        submitting
                          ? { required: false }
                          : {
                              required: true,
                            }
                      }
                      value={fundsAvailability.checkDepositHoldDays.toString()}
                    />
                    <Box className="pb-8"></Box>
                    <Box className="w-fit">
                      <MyBlueButton type="submit" submitting={submitting}>
                        Update Funds Availability
                      </MyBlueButton>
                    </Box>
                  </Box>
                </form>
              )}
            </>
          )}
          <div className="pb-4"></div>
          <MyExpandableButton
            title="Onboarding Configuration Settings"
            expand={expandOnboardingConfig}
            toggleExpand={toggleExpandOnboardingConfig}
          />
          <Divider />
          <div className="pb-4"></div>
          {expandOnboardingConfig && <OnbaordingSettings product={product} />}
          <div className="pb-12"></div>
        </div>
      )}
    </>
  );
};

export default ProductSettings;
