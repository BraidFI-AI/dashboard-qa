"use client";

import { OnboardingConfig } from "@/core/api/ApiTypes";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyTextButton from "@/core/components/Button/MyTextButton";
import ItemRow from "@/core/components/Text/ItemRow";
import MyLinkText from "@/core/components/Text/LinkText";
import MyText from "@/core/components/Text/Text";
import MyEditableTextField from "@/core/components/TextField/MyEditableTextField";
import MyTextField from "@/core/components/TextField/MyTextField";
import { timestampToDate } from "@/core/utils/date_time_util";
import { setTitle } from "@/redux/slices/AppSlice";
import {
  createOnboardingConfig,
  fetchOnboardingConfig,
  fetchProduct,
  updateOnboardingConfigButtonColor,
  uploadOnboardingConfigFeeSchedule,
  uploadOnboardingConfigLogo,
  uploadOnboardingConfigPdfTemplate,
} from "@/redux/slices/ProductSlice";
import { useAppDispatch } from "@/redux/store/store";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Colorful from "@uiw/react-color-colorful";
import Image from "next/image";
import Link from "next/link";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "next/navigation";

const OnboardingConfigPage = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [onboardingConfig, setOnboardingConfig] =
    useState<OnboardingConfig | null>(null);
  const params = useParams();
  const [refresh, setRefresh] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [creatingOnboardingConfig, setCreatingOnboardingConfig] =
    useState(false);

  const [colorPickerHex, setColorPickerHex] = useState("#000000");
  const [colorPickerHexError, setColorPickerHexError] = useState(false);

  const [logo, setLogo] = useState<any>(null);
  const logoPickerRef = useRef<HTMLInputElement>(null);

  const [feeSchedule, setFeeSchedule] = useState<any>(null);
  const pdfTemplateRef = useRef<HTMLInputElement>(null);
  const [pdfTemplate, setPdfTemplate] = useState<any>(null);
  const [missingPDFFields, setMissingPDFFields] = useState<string | null>(null);

  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [isEditingHex, setIsEditingHex] = useState(false);
  const [isEditingLogo, setIsEditingLogo] = useState(false);
  const [isEditingFeeS, setIsEditingFeeS] = useState(false);
  const [isEditingPdf, setIsEditingPdf] = useState(false);

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
  } = useForm<{
    onboardingUrl: string;
    buttonColor: string;
    logoUrl: string;
  }>({
    defaultValues: {
      onboardingUrl:
        onboardingConfig != null
          ? onboardingConfig.onboardingUrl != null
            ? onboardingConfig.onboardingUrl
            : undefined
          : undefined,
      buttonColor:
        onboardingConfig != null
          ? onboardingConfig.buttonColor != null
            ? onboardingConfig.buttonColor
            : undefined
          : undefined,
      logoUrl:
        onboardingConfig != null
          ? onboardingConfig.logoUrl != null
            ? onboardingConfig.logoUrl
            : undefined
          : undefined,
    },
  });
  const onSubmit: SubmitHandler<{
    onboardingUrl: string;
    buttonColor: string;
    logoUrl: string;
  }> = async (data: {
    onboardingUrl: string;
    buttonColor: string;
    logoUrl: string;
  }) => {
    const hexRegex = /^([0-9A-Fa-f]{2})*$/;
    const validHex = hexRegex.test(colorPickerHex.slice(1));

    if (validHex) {
      setColorPickerHexError(false);
    } else {
      setColorPickerHexError(true);
      return;
    }

    setSubmitting(true);
    console.log(data);

    if (creatingOnboardingConfig) {
      dispatch(
        createOnboardingConfig({
          id: parseInt((params.id as string) || "0"),
          url: data.onboardingUrl,
          hex: colorPickerHex,
        })
      ).then((config: any) => {
        if (config.payload) {
          enqueueSnackbar("Onboarding config created!", { variant: "success" });
        }
        setRefresh(true);
      });
    } else {
      if (isEditingPdf) {
        if (pdfTemplate == null) {
          enqueueSnackbar("Please select a pdf template first", {
            variant: "error",
          });
          setSubmitting(false);
          return;
        } else {
          await dispatch(
            uploadOnboardingConfigPdfTemplate({
              productId: parseInt((params.id as string) || "0"),
              file: pdfTemplate,
            })
          ).then((doc: any) => {
            if (doc.payload) {
              enqueueSnackbar("PDF template uploaded successfully", {
                variant: "success",
              });
            } else {
              // enqueueSnackbar("Error uploading PDF template", {
              //   variant: "error",
              // });
            }
          });
        }
      }

      if (isEditingFeeS) {
        if (!feeSchedule) {
          enqueueSnackbar("Please select a fee schedule file first");
          setSubmitting(false);
        } else {
          await dispatch(
            uploadOnboardingConfigFeeSchedule({
              productId: parseInt((params.id as string) || "0"),
              file: feeSchedule,
            })
          ).then(async (fs: any) => {
            if (fs.payload) {
              enqueueSnackbar("Fee Schedule uploaded successfully!", {
                variant: "success",
              });
            } else {
              // enqueueSnackbar("Error uploading Fee Schedule", {
              //   variant: "error",
              // });
            }
            if (isEditingLogo) {
              if (!logo) {
                enqueueSnackbar("Please select a logo file first");
                setSubmitting(false);
              } else {
                await dispatch(
                  uploadOnboardingConfigLogo({
                    productId: parseInt((params.id as string) || "0"),
                    file: logo,
                  })
                ).then(async (lg: any) => {
                  console.log(lg);
                  if (!lg.payload) {
                    enqueueSnackbar("Error uploading logo", {
                      variant: "error",
                    });
                  }
                  {
                    enqueueSnackbar("Logo uploaded successfully!", {
                      variant: "success",
                    });
                    setLogo(null);
                    if (logoPickerRef && logoPickerRef.current) {
                      logoPickerRef.current.value = "";
                    }
                  }

                  if (isEditingHex) {
                    await dispatch(
                      updateOnboardingConfigButtonColor({
                        productId: parseInt((params.id as string) || "0"),
                        hex: colorPickerHex.toLowerCase(),
                      })
                    ).then((hx: any) => {
                      if (hx.payload) {
                        enqueueSnackbar("Logo uploaded successfully!", {
                          variant: "success",
                        });
                      }
                      setRefresh(true);
                    });
                  } else {
                    setRefresh(true);
                  }
                });
              }
            } else if (isEditingHex) {
              await dispatch(
                updateOnboardingConfigButtonColor({
                  productId: parseInt((params.id as string) || "0"),
                  hex: colorPickerHex.toLowerCase(),
                })
              ).then(async (hx: any) => {
                if (hx.payload) {
                  enqueueSnackbar("Logo uploaded successfully!", {
                    variant: "success",
                  });
                }
                setRefresh(true);
              });
            } else {
              setRefresh(true);
            }
          });
        }
        setRefresh(true);
        setSubmitting(false);
      } else if (isEditingLogo) {
        if (!logo) {
          enqueueSnackbar("Please select a logo file first");
          setSubmitting(false);
        } else {
          await dispatch(
            uploadOnboardingConfigLogo({
              productId: parseInt((params.id as string) || "0"),
              file: logo,
            })
          ).then(async (lg: any) => {
            console.log(lg);
            if (!lg.payload) {
              enqueueSnackbar("Error uploading logo", { variant: "error" });
            }
            {
              enqueueSnackbar("Logo uploaded successfully!", {
                variant: "success",
              });
              setLogo(null);
              if (logoPickerRef && logoPickerRef.current) {
                logoPickerRef.current.value = "";
              }
            }

            if (isEditingHex) {
              await dispatch(
                updateOnboardingConfigButtonColor({
                  productId: parseInt((params.id as string) || "0"),
                  hex: colorPickerHex.toLowerCase(),
                })
              ).then((hx: any) => {
                if (hx.payload) {
                  enqueueSnackbar("Logo uploaded successfully!", {
                    variant: "success",
                  });
                }
                setRefresh(true);
              });
            } else {
              setRefresh(true);
            }
          });
        }
        setRefresh(true);
        setSubmitting(false);
      } else if (isEditingHex) {
        await dispatch(
          updateOnboardingConfigButtonColor({
            productId: parseInt((params.id as string) || "0"),
            hex: colorPickerHex.toLowerCase(),
          })
        ).then((hx: any) => {
          if (hx.payload) {
            enqueueSnackbar("Logo uploaded successfully!", {
              variant: "success",
            });
          }
          setRefresh(true);
        });
        setRefresh(true);
        setSubmitting(false);
      }
      setRefresh(true);
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (refresh) {
      setLoading(true);
      dispatch(setTitle("Product"));
      dispatch(fetchProduct(parseInt((params.id as string) || "0"))).then(
        (product: any) => {
          if (product.payload != null) {
            dispatch(setTitle(product.payload.productName));
            dispatch(fetchOnboardingConfig(product.payload.id)).then(
              (data: any) => {
                setOnboardingConfig(data.payload);
                setLoading(false);
                setSubmitting(false);
                setCreatingOnboardingConfig(false);
                setRefresh(false);
                setIsEditingUrl(false);
                setIsEditingHex(false);
                setIsEditingLogo(false);
                setIsEditingFeeS(false);
                setIsEditingPdf(false);
              }
            );
          } else {
            setLoading(false);
            setSubmitting(false);
            setCreatingOnboardingConfig(false);
            setRefresh(false);
            setIsEditingUrl(false);
            setIsEditingHex(false);
            setIsEditingLogo(false);
            setIsEditingFeeS(false);
            setIsEditingPdf(false);
          }
        }
      );
    }
  }, [dispatch, params.id, refresh]);

  // useEffect(() => {
  //   const checkPDFFields = async () => {
  //     console.log("checking if pdf values are provided");

  //     const form = (
  //       await PDFDocument.load(await pdfTemplate.arrayBuffer())
  //     ).getForm();

  //     let missingFields = "";

  //     const bizName = form.getFieldMaybe("bizName");
  //     const dba = form.getFieldMaybe("CharacterName 2");

  //     if (!bizName) {
  //       missingFields += "bizName ";
  //     }
  //     if (!dba) {
  //       missingFields += "dba ";
  //     }

  //     setMissingPDFFields(missingFields == "" ? null : missingFields);
  //   };

  //   if (pdfTemplate != null) {
  //     checkPDFFields();
  //   }
  // }, [pdfTemplate]);

  return (
    <div className="pb-10">
      {loading ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading Onboarding configuration...</div>
        </div>
      ) : onboardingConfig == null && !creatingOnboardingConfig ? (
        <>
          <Box className="w-fit">
            <MyBlueButton
              onClick={() => {
                setCreatingOnboardingConfig(true);
              }}
            >
              Create Onboarding Configuration
            </MyBlueButton>
          </Box>
        </>
      ) : (
        (onboardingConfig != null || creatingOnboardingConfig) && (
          <div className="flex flex-row w-[650px] justify-between">
            <div className="w-[300px]">
              <MyEditableTextField
                editing={creatingOnboardingConfig || isEditingUrl}
                setEditing={setIsEditingUrl}
                name="onboardingUrl"
                displayName="Onboarding URL"
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
                  onboardingConfig?.onboardingUrl != null
                    ? onboardingConfig.onboardingUrl
                    : ""
                }
                submitting={false}
                editable={creatingOnboardingConfig ? true : false}
              />
              <div className="flex flex-row">
                <div className="w-full">
                  <MyEditableTextField
                    editing={creatingOnboardingConfig || isEditingHex}
                    setEditing={setIsEditingHex}
                    name="onboardingUrl"
                    displayName="Button colors"
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
                      onboardingConfig?.buttonColor?.toUpperCase()
                        ? onboardingConfig.buttonColor.toUpperCase()
                        : ""
                    }
                    submitting={false}
                    customEditor={
                      <>
                        <Colorful
                          color={colorPickerHex}
                          onChange={(color: any) => {
                            setColorPickerHex(
                              color.hexa
                                .toString()
                                .slice(0, color.hexa.toString().length - 2)
                            );
                          }}
                          disableAlpha
                        />
                        <div className="pb-1"></div>
                        <Box className="flex flex-row items-center">
                          <MyText>Hex</MyText>
                          <div className="pr-2"></div>
                          <Box className="w-[110px]">
                            <MyTextField
                              displayName="Hex"
                              value={colorPickerHex.toUpperCase()}
                              setValue={setColorPickerHex}
                              error={colorPickerHexError}
                              errorText="Invalid Hex"
                            ></MyTextField>
                          </Box>
                        </Box>
                      </>
                    }
                  />
                  {onboardingConfig != null && (
                    <>
                      {
                        // onboardingConfig.logoUrl == null ||
                        // onboardingConfig.logoUrl == "" ? (
                        //   <ItemRow
                        //     title="Logo Url"
                        //     value={onboardingConfig.logoUrl!}
                        //   ></ItemRow>
                        // ) :
                        <>
                          <MyEditableTextField
                            editing={isEditingLogo}
                            setEditing={setIsEditingLogo}
                            name="logo"
                            displayName="Logo"
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
                              <Image
                                alt="Braidfi"
                                src={onboardingConfig.logoUrl ?? ""}
                                height={80}
                                width={80}
                              ></Image>
                            }
                            submitting={false}
                            customEditor={
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
                                      enqueueSnackbar(
                                        "Only PNG images are allowed for logo",
                                        {
                                          variant: "error",
                                        }
                                      );

                                      // unselecting the file
                                      event.target.value = "";
                                      return;
                                    }

                                    setLogo(event.target.files[0]);
                                    console.log(
                                      "logo selected",
                                      event.target.files[0]
                                    );
                                  }
                                }}
                              />
                            }
                          />
                          <div className="pb-4"></div>
                          <MyEditableTextField
                            editing={isEditingFeeS}
                            setEditing={setIsEditingFeeS}
                            name="feeSchedule"
                            displayName="Fee Schedule"
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
                              onboardingConfig.feeScheduleVersion &&
                              onboardingConfig.feeScheduleVersion > 0 ? (
                                <MyLinkText
                                  link={onboardingConfig.feeScheduleURL ?? ""}
                                >
                                  Fee Schedule
                                </MyLinkText>
                              ) : (
                                <MyText>Upload Fee Schedule</MyText>
                              )
                            }
                            submitting={false}
                            customEditor={
                              <input
                                type="file"
                                accept="application/pdf"
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

                                    if (extension.toLowerCase() != "pdf") {
                                      enqueueSnackbar(
                                        "Only Pdf files are allowed for Fee schedule",
                                        {
                                          variant: "error",
                                        }
                                      );

                                      // unselecting the file
                                      event.target.value = "";
                                      return;
                                    }

                                    setFeeSchedule(event.target.files[0]);
                                    console.log("fee schedule selected");
                                  }
                                }}
                              />
                            }
                          />
                        </>
                      }
                    </>
                  )}
                  {(creatingOnboardingConfig ||
                    isEditingUrl ||
                    isEditingLogo ||
                    isEditingFeeS ||
                    isEditingHex ||
                    isEditingPdf) && (
                    <>
                      <Box className={`flex flex-row pt-8`}>
                        {creatingOnboardingConfig && (
                          <Box className="w-fit pr-2">
                            <MyTextButton
                              submitting={submitting}
                              onClick={() => {
                                setCreatingOnboardingConfig(false);
                              }}
                              isCancel
                            >
                              Cancel
                            </MyTextButton>
                          </Box>
                        )}
                        <Box className="w-fit">
                          <MyBlueButton
                            submitting={submitting}
                            onClick={() => {
                              handleSubmit(onSubmit)();
                            }}
                          >
                            {creatingOnboardingConfig
                              ? "Create Onboarding Config"
                              : "Update Onboarding Config"}
                          </MyBlueButton>
                        </Box>
                      </Box>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="w-[300px]">
              {onboardingConfig != null && (
                <>
                  <MyEditableTextField
                    editing={isEditingPdf}
                    setEditing={setIsEditingPdf}
                    name="feeSchedule"
                    displayName="Business document PDF"
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
                      onboardingConfig.pdfTemplateUrl ? (
                        <MyLinkText
                          link={onboardingConfig.pdfTemplateUrl ?? ""}
                        >
                          PDF Template
                        </MyLinkText>
                      ) : (
                        <MyText>Upload PDF Template</MyText>
                      )
                    }
                    submitting={false}
                    customEditor={
                      <input
                        type="file"
                        accept="application/pdf"
                        ref={pdfTemplateRef}
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

                            if (extension.toLowerCase() != "pdf") {
                              enqueueSnackbar(
                                "Only Pdf files are allowed for Onboarding details document",
                                {
                                  variant: "error",
                                }
                              );

                              // unselecting the file
                              event.target.value = "";
                              return;
                            }

                            setPdfTemplate(event.target.files[0]);
                            console.log("pdf template selected");
                          }
                        }}
                      />
                    }
                  />
                  {missingPDFFields != null && isEditingPdf && (
                    <div className="text-red-500">
                      <MyText>
                        Warning Following fields are missing from PDF template:
                      </MyText>
                      <MyText>{missingPDFFields}</MyText>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default OnboardingConfigPage;
