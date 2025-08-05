"use client";

import {
  Card,
  Developer,
  Product,
  Program,
  UpdateProduct,
} from "@/core/api/ApiTypes";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyEditButton from "@/core/components/Button/MyEditButton";
import ItemRow from "@/core/components/Text/ItemRow";
import MyText from "@/core/components/Text/Text";
import MyEditableTextField from "@/core/components/TextField/MyEditableTextField";
import ErrorPage from "@/core/components/error_page";
import { ADMIN_OPS_ROLE, ADMIN_ROLE } from "@/core/constants";
import { timestampToDate } from "@/core/utils/date_time_util";
import { setTitle } from "@/redux/slices/AppSlice";
import { fetchDeveloper } from "@/redux/slices/DeveloperSlice";
import { fetchProduct, updateProduct } from "@/redux/slices/ProductSlice";
import { fetchProgram } from "@/redux/slices/ProgramSlice";
import { useAppDispatch } from "@/redux/store/store";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import MyTextField from "@/core/components/TextField/MyTextField";
import { IconButton } from "@mui/material";
import _ from "lodash";
import { useParams } from "next/navigation";

const ProductDetails = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [cardManagement, setCardManagement] = useState<Card | null>(null);
  const params = useParams();
  const [refresh, setRefresh] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emails, setEmails] = useState<{ settlementEmail: string }[]>([]);
  const [isEditingInterestRate, setIsEditingInterestRate] = useState(false);
  const [isEditingOperatingModel, setIsEditingOperatingModel] = useState(false);
  const [isEditingInterestPayoutDate, setIsEditingInterestPayoutDate] =
    useState(false);
  const [
    isEditingDuplicatePaymentCheckDays,
    setIsEditingDuplicatePaymentCheckDays,
  ] = useState(false);
  const [isEditingCipConfig, setIsEditingCipConfig] = useState(false);
  const [isEditingId, setIsEditingId] = useState(false);
  const [isEditingActive, setIsEditingActive] = useState(false);

  const userType = useSelector((state: any) => state.app.userType);

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
    reset,
  } = useForm<UpdateProduct>({
    defaultValues: {
      productName: product?.productName ?? "",
      isActive: product?.isActive ?? false,
      productSettlementEmails: product?.productSettlementEmails ?? [],
    },
  });
  const onSubmit: SubmitHandler<UpdateProduct> = async (
    data: UpdateProduct
  ) => {
    setSubmitting(true);

    if (product) {
      if (!isEditingName) {
        data.productName =
          product.productName != null ? product.productName : "";
      }
      if (!isEditingActive) {
        data.isActive = product.isActive != null ? product.isActive : false;
      }

      if (!isEditingEmail) {
        data.productSettlementEmails =
          product.productSettlementEmails != null
            ? product.productSettlementEmails
            : [];
      } else {
        data.productSettlementEmails = emails;
      }

      console.log(data);

      if (isEditingCipConfig && data.cipConfig == "REQUIRED") {
        data.cipConfig = null;
      }

      dispatch(
        updateProduct({
          id: parseInt((params.id as string) || "0"),
          product: data,
        })
      ).then((data: any) => {
        if (data.payload) {
          enqueueSnackbar("Product updated successfully", {
            variant: "success",
          });
        }
        setSubmitting(false);
        setIsEditingName(false);
        setIsEditingOperatingModel(false);
        setIsEditingId(false);
        setIsEditingActive(false);
        setIsEditingEmail(false);
        setIsEditingCipConfig(false);
        setIsEditingInterestRate(false);
        setIsEditingInterestPayoutDate(false);
        setIsEditingDuplicatePaymentCheckDays(false);
        setRefresh(true);
      });
    }
  };

  useEffect(() => {
    if (refresh) {
      setLoading(true);
      dispatch(setTitle("Product"));
      dispatch(fetchProduct(parseInt((params.id as string) || "0"))).then(
        (data: any) => {
          if (data.payload) {
            setEmails(
              data.payload.productSettlementEmails != null
                ? _.cloneDeep(data.payload.productSettlementEmails)
                : []
            );
            setProduct(data.payload);
            dispatch(setTitle(data.payload.productName));
            reset({
              productName: data.payload.productName,
              isActive: data.payload.isActive,
              productSettlementEmails: data.payload.productSettlementEmails,
            });

            if (userType == ADMIN_ROLE || userType == ADMIN_OPS_ROLE) {
              dispatch(fetchProgram(data.payload.programId)).then(
                (prg: any) => {
                  if (prg.payload) {
                    setProgram(prg.payload);
                  }
                }
              );

              dispatch(fetchDeveloper(data.payload.tenantId)).then(
                (dev: any) => {
                  if (dev.payload) {
                    setDeveloper(dev.payload);
                  }
                }
              );
            }
          }
          setLoading(false);
          setRefresh(false);
        }
      );
    }
  }, [dispatch, params.id, refresh, reset, userType]);

  return (
    <div className="pb-10 pt-6">
      {loading ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading Prouct Details...</div>
        </div>
      ) : product == null ? (
        <ErrorPage
          error="Error loading product"
          recoveryButtonOnClick={() => {
            setRefresh(true);
          }}
          recoveryButtonTitle="Retry"
        />
      ) : (
        <div>
          <div className="w-[700px] flex flex-row justify-between">
            <div className="w-[300px]">
              <ItemRow title="ID" value={product.id ?? ""}></ItemRow>
              <MyEditableTextField
                editing={isEditingName}
                setEditing={setIsEditingName}
                name="productName"
                displayName="Name"
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                value={product.productName != null ? product.productName : ""}
                submitting={false}
              />
              <div className="flex flex-row justify-between">
                <div>
                  <MyText>Settlement Emails</MyText>
                  {isEditingEmail ? (
                    <>
                      {emails?.map((email, index) => (
                        <div
                          key={index}
                          className="flex flex-row justify-between items-center"
                        >
                          <MyText size="md">
                            {email.settlementEmail ?? ""}
                          </MyText>
                          <IconButton
                            onClick={() => {
                              emails?.splice(index, 1);
                              setProduct({ ...product });
                            }}
                          >
                            <DeleteOutlineRoundedIcon className="text-red-500" />
                          </IconButton>
                        </div>
                      ))}
                      <MyTextField value={newEmail} setValue={setNewEmail} />
                      <div className="w-fit pt-2">
                        <MyBlueButton
                          onClick={() => {
                            if (newEmail == "") {
                              enqueueSnackbar("Email cannot be empty", {
                                variant: "error",
                              });
                              return;
                            }
                            const chars = newEmail.split("");
                            if (
                              !(
                                chars.filter((c) => c == "@").length == 1 &&
                                chars.filter((c) => c == ".").length >= 1
                              )
                            ) {
                              enqueueSnackbar("Invalid Email", {
                                variant: "error",
                              });
                              return;
                            }

                            if (
                              emails.find(
                                (e) => e.settlementEmail == newEmail
                              ) != undefined
                            ) {
                              enqueueSnackbar("Email already added", {
                                variant: "error",
                              });
                              return;
                            }

                            let newEmails = [
                              ...emails,
                              { settlementEmail: newEmail },
                            ];

                            setEmails(newEmails);

                            setNewEmail("");
                          }}
                        >
                          Add
                        </MyBlueButton>
                      </div>
                    </>
                  ) : (
                    <>
                      {product.productSettlementEmails?.length == 0 ? (
                        <MyText size="md">No Email Configured</MyText>
                      ) : (
                        product.productSettlementEmails?.map((email, index) => (
                          <div
                            key={index}
                            className="flex flex-row justify-between items-center"
                          >
                            <MyText size="md">
                              {email.settlementEmail ?? ""}
                            </MyText>
                          </div>
                        ))
                      )}
                    </>
                  )}
                </div>
                <MyEditButton
                  editing={isEditingEmail}
                  setEditing={setIsEditingEmail}
                />
              </div>
              <div className="pb-4" />
              <ItemRow title="Prefix" value={product.prefix ?? ""}></ItemRow>
              <ItemRow title="Suffix" value={product.suffix ?? ""}></ItemRow>
              <ItemRow
                title="Length"
                value={product.length?.toString() ?? 0}
              ></ItemRow>
              <ItemRow
                title="Created Date"
                value={timestampToDate(product.createdAt ?? 0)}
              ></ItemRow>
            </div>
            <div className="w-[300px]">
              {(userType == ADMIN_ROLE || userType == ADMIN_OPS_ROLE) && (
                <>
                  <ItemRow
                    title="Program"
                    value={{
                      value:
                        program == null
                          ? product.programId?.toString()
                          : program.name == null
                          ? product.programId?.toString()
                          : program.name,
                      link: `/configuration/programs/${product.programId}`,
                    }}
                  ></ItemRow>
                  <ItemRow
                    title="Tenant"
                    value={{
                      value: developer ? developer.name : product.tenantId,
                      link: `/configuration/developers/${product.tenantId}`,
                    }}
                  ></ItemRow>
                  <MyEditableTextField
                    editing={isEditingInterestRate}
                    setEditing={setIsEditingInterestRate}
                    name="interestRate"
                    displayName="Interest Rate"
                    control={control}
                    errors={errors}
                    rules={
                      submitting
                        ? { required: false, pattern: null }
                        : {
                            required: true,
                          }
                    }
                    value={product?.interestRate?.toFixed(4) ?? "0.0000"}
                    submitting={false}
                  />
                  <MyEditableTextField
                    editing={isEditingOperatingModel}
                    setEditing={setIsEditingOperatingModel}
                    name="operatingModel"
                    displayName="Operating Model"
                    control={control}
                    errors={errors}
                    rules={
                      submitting
                        ? { required: false, pattern: null }
                        : {
                            required: false,
                          }
                    }
                    value={product?.operatingModel ?? ""}
                    options={["LICENSED", "REGULATED_FI", "NON_LICENSED"]}
                    submitting={false}
                  />
                  <MyEditableTextField
                    editing={isEditingInterestPayoutDate}
                    setEditing={setIsEditingInterestPayoutDate}
                    name="interestPayDayOfMonth"
                    displayName="Interest Payout Date"
                    control={control}
                    errors={errors}
                    rules={
                      submitting
                        ? { required: false, pattern: null }
                        : {
                            required: true,
                          }
                    }
                    value={product?.interestPayDayOfMonth?.toString() ?? ""}
                    submitting={false}
                  />
                  <MyEditableTextField
                    editing={isEditingDuplicatePaymentCheckDays}
                    setEditing={setIsEditingDuplicatePaymentCheckDays}
                    name="duplicatePaymentDays"
                    displayName="Duplicate Payment Check Days"
                    control={control}
                    errors={errors}
                    rules={
                      submitting
                        ? { required: false, pattern: null }
                        : {
                            required: true,
                          }
                    }
                    value={product?.duplicatePaymentDays?.toString() ?? ""}
                    submitting={false}
                  />
                </>
              )}
              <MyEditableTextField
                editing={isEditingCipConfig}
                setEditing={setIsEditingCipConfig}
                name="cipConfig"
                displayName="CIP Config"
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                options={["BYPASS", "TRUST_VERIFY", "BANK_VERIFY"]}
                value={product?.cipConfig ?? ""}
                submitting={false}
              />
              <ItemRow
                title="Account Type"
                value={product.customerAccountType ?? ""}
              ></ItemRow>
              <MyEditableTextField
                editing={isEditingActive}
                setEditing={setIsEditingActive}
                name="isActive"
                displayName="Active"
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                options={["True", "False"]}
                value={
                  product.isActive != null
                    ? product.isActive.toString()[0].toUpperCase() +
                      product.isActive.toString().slice(1)
                    : ""
                }
                submitting={false}
              />
              <ItemRow
                title="Updated Date"
                value={timestampToDate(product.updatedAt ?? 0)}
              ></ItemRow>
            </div>
          </div>
          {(isEditingName ||
            isEditingId ||
            isEditingActive ||
            isEditingInterestRate ||
            isEditingInterestPayoutDate ||
            isEditingDuplicatePaymentCheckDays ||
            isEditingCipConfig ||
            isEditingOperatingModel ||
            isEditingEmail) && (
            <Box className="w-fit pt-4">
              <MyBlueButton
                submitting={submitting}
                onClick={() => {
                  handleSubmit(onSubmit)();
                }}
              >
                Update Product
              </MyBlueButton>
            </Box>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
