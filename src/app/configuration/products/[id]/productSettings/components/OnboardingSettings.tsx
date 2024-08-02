"use client";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { OnboardingConfig, Product } from "@/core/api/ApiTypes";
import MyText from "@/core/components/Text/Text";
import MyTextField from "@/core/components/TextField/MyTextField";
import {
  createOnboardingUrl,
  fetchOnboardingConfig,
  updateOnboardingConfigButtonColor,
  uploadOnboardingConfigLogo,
} from "@/redux/slices/ProductSlice";
import { useAppDispatch } from "@/redux/store/store";
import Colorful from "@uiw/react-color-colorful";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { enqueueSnackbar } from "notistack";

type OnbaordingSettingsProps = {
  product: Product | null;
};

const OnbaordingSettings: React.FC<OnbaordingSettingsProps> = ({ product }) => {
  const dispatch = useAppDispatch();

  const [onboardingConfig, setOnboardingConfig] =
    useState<OnboardingConfig | null>(null);

  const [refresh, setRefresh] = useState(true);
  const [loading, setLoading] = useState(true);
  const [creatingOnboardingUrl, setCreatingOnboardingUrl] = useState(false);
  const [colorPickerHex, setColorPickerHex] = useState("#000000");
  const [colorPickerHexError, setColorPickerHexError] = useState(false);
  const [submittingColor, setSubmittingColor] = useState(false);
  const [logo, setLogo] = useState<any>(null);
  const logoPickerRef = useRef<HTMLInputElement>(null);
  const [submittingFile, setSubmittingFile] = useState(false);

  const {
    formState: {
      errors: onboardingConfigErrors,
      submitCount: onboardingConfigSubmitCount,
      isSubmitted: onboardingConfigIsSubmitted,
      isValid: onboardingConfigIsValid,
    },
    control: onboardingConfigControl,
    handleSubmit: onboardingConfigHandleSubmit,
  } = useForm<{ onboardingUrl: string }>();
  const onboardingConfigOnSubmit: SubmitHandler<{
    onboardingUrl: string;
  }> = (data: { onboardingUrl: string }) => {
    console.log(data);

    setCreatingOnboardingUrl(true);

    if (product != null) {
      dispatch(
        createOnboardingUrl({
          productId: product.id ?? -1,
          url: data.onboardingUrl,
        })
      ).then(() => {
        setCreatingOnboardingUrl(false);
        setRefresh(true);
      });
    }
  };

  useEffect(() => {
    if (refresh) {
      if (product != null) {
        dispatch(fetchOnboardingConfig(product.id ?? -1)).then((data: any) => {
          if (data.payload) {
            setOnboardingConfig(data.payload);
            if (data.payload.buttonColor != null) {
              setColorPickerHex(data.payload.buttonColor);
            }
          }
          setLoading(false);
          setRefresh(false);
        });
      }
    }
  }, [dispatch, product, refresh]);

  return product == null ? (
    <>Product not found</>
  ) : loading ? (
    <div className="flex flex-col items-center justify-center pt-10">
      <CircularProgress></CircularProgress>
      <div>Loading Onboarding Configuration...</div>
    </div>
  ) : onboardingConfig == null ? (
    <>
      <MyText>Onboarding Url</MyText>
      <MyControlledTextField
        name="onboardingUrl"
        displayName="Onboarding Url"
        control={onboardingConfigControl}
        errors={onboardingConfigErrors}
        rules={
          creatingOnboardingUrl
            ? {
                required: false,
                validate: (value: any) => {
                  return true;
                },
              }
            : {
                required: true,
                validate: (value: any) => {
                  if (value.length > 10) {
                    return "Onboarding cannot be greater then 10 characters";
                  }
                  return true;
                },
              }
        }
        value={""}
      />
      <div className="pb-4"></div>
      <MyBlueButton
        onClick={() => {
          onboardingConfigHandleSubmit(onboardingConfigOnSubmit)();
        }}
        submitting={creatingOnboardingUrl}
      >
        Create Onboarding Url
      </MyBlueButton>
    </>
  ) : (
    <Box className="flex flex-col">
      <Box className="flex flex-row">
        <Box className="flex flex-col">
          <MyText size="md">Buttons Color for Onboarding App</MyText>
          <div className="pb-1"></div>
          <Colorful
            color={colorPickerHex}
            onChange={(color: any) => {
              setColorPickerHex(
                color.hexa.toString().slice(0, color.hexa.toString().length - 2)
              );
            }}
            disableAlpha
          />
          <div className="pb-1"></div>
          <Box className="flex flex-row items-center">
            <MyText>Hex</MyText>
            <div className="pr-2"></div>
            <MyTextField
              displayName="Hex"
              value={colorPickerHex.toUpperCase()}
              setValue={setColorPickerHex}
              error={colorPickerHexError}
              errorText="Invalid Hex"
            ></MyTextField>
            <div className="pr-2"></div>
            <MyBlueButton
              submitting={submittingColor}
              onClick={() => {
                setSubmittingColor(true);
                const hexRegex = /^([0-9A-Fa-f]{2})*$/;
                const validHex = hexRegex.test(colorPickerHex.slice(1));

                if (validHex) {
                  setColorPickerHexError(false);
                  dispatch(
                    updateOnboardingConfigButtonColor({
                      productId: product.id ?? 0,
                      hex: colorPickerHex.toLowerCase(),
                    })
                  ).then(() => {
                    setSubmittingColor(false);
                  });
                } else {
                  setColorPickerHexError(true);
                  setSubmittingColor(false);
                }
              }}
            >
              Set Buttons Color
            </MyBlueButton>
          </Box>
        </Box>
      </Box>
      <div className="pb-6"></div>
      <Box className="flex flex-col">
        <MyText size="md">Upload Logo (png only)</MyText>
        <div className="pb-1"></div>
        <input
          type="file"
          accept="image/png"
          ref={logoPickerRef}
          onChange={(event) => {
            if (
              event?.target?.files != null &&
              event?.target?.files?.length != 0
            ) {
              const filename = event.target.files[0].name;
              const extension = filename.substring(
                filename.lastIndexOf(".") + 1
              );
              console.log(extension);

              if (extension.toLowerCase() != "png") {
                enqueueSnackbar("Only PNG images are allowed for logo", {
                  variant: "error",
                });

                // unselecting the file
                event.target.value = "";
                return;
              }

              setLogo(event.target.files[0]);
              console.log("logo selected");
            }
          }}
        />
        <div className="pb-4"></div>
        <MyBlueButton
          submitting={submittingFile}
          onClick={() => {
            setSubmittingFile(true);
            if (!logo) {
              enqueueSnackbar("Please select a logo file first");
              setSubmittingFile(false);
            } else {
              dispatch(
                uploadOnboardingConfigLogo({
                  productId: product.id ?? 0,
                  file: logo,
                })
              ).then((data: any) => {
                setSubmittingFile(false);
                console.log(data);
                if (!data.payload) {
                  // enqueueSnackbar("Error uploading logo", { variant: "error" });
                } else {
                  enqueueSnackbar("Logo uploaded successfully!", {
                    variant: "success",
                  });
                  setLogo(null);
                  if (logoPickerRef && logoPickerRef.current) {
                    logoPickerRef.current.value = "";
                  }
                }
              });
            }
          }}
        >
          Upload Logo
        </MyBlueButton>
      </Box>
    </Box>
  );
};

export default OnbaordingSettings;
