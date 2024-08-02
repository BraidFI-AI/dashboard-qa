"use client";

import {
  Card,
  Developer,
  Product,
  Program,
  UpdateProduct,
} from "@/core/api/ApiTypes";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import ItemRow from "@/core/components/Text/ItemRow";
import MyLinkText from "@/core/components/Text/LinkText";
import MyText from "@/core/components/Text/Text";
import MyEditableTextField from "@/core/components/TextField/MyEditableTextField";
import ErrorPage from "@/core/components/error_page";
import { ADMIN_OPS_ROLE, ADMIN_ROLE } from "@/core/constants";
import timestampToDate from "@/core/utils/timestampToDate";
import { setTitle } from "@/redux/slices/AppSlice";
import { fetchCard } from "@/redux/slices/CardManagementSlice";
import { fetchDeveloper } from "@/redux/slices/DeveloperSlice";
import { fetchProduct, updateProduct } from "@/redux/slices/ProductSlice";
import { fetchProgram } from "@/redux/slices/ProgramSlice";
import { useAppDispatch } from "@/redux/store/store";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const ProductDetails = ({ params }: { params: { id: string } }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [cardManagement, setCardManagement] = useState<Card | null>(null);

  const [refresh, setRefresh] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBankName, setIsEditingBankName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
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
      productId: product?.productId ?? "",
    },
  });
  const onSubmit: SubmitHandler<UpdateProduct> = async (
    data: UpdateProduct
  ) => {
    setSubmitting(true);

    if (product) {
      if (!isEditingName) {
        data.productName = product.productName ? product.productName : "";
      }

      if (!isEditingId) {
        data.productId = product.productId ? product.productId : "";
      }

      if (!isEditingActive) {
        data.isActive = product.isActive ? product.isActive : false;
      }

      console.log(data);

      dispatch(updateProduct({ id: parseInt(params.id), product: data })).then(
        (data: any) => {
          if (data.payload) {
            enqueueSnackbar("Product updated successfully", {
              variant: "success",
            });
          }
          setSubmitting(false);
          setIsEditingName(false);
          setIsEditingId(false);
          setIsEditingActive(false);
          setIsEditingBankName(false);
          setIsEditingEmail(false);
          setIsEditingPhone(false);
          setRefresh(true);
        }
      );
    }
  };

  useEffect(() => {
    if (refresh) {
      setLoading(true);
      dispatch(setTitle("Product"));
      dispatch(fetchProduct(parseInt(params.id))).then((data: any) => {
        if (data.payload) {
          setProduct(data.payload);
          dispatch(setTitle(data.payload.productName));
          reset({
            productName: data.payload.productName,
            isActive: data.payload.isActive,
            productId: data.payload.productId,
          });

          if (userType == ADMIN_ROLE || userType == ADMIN_OPS_ROLE) {
            dispatch(fetchProgram(data.payload.programId)).then((prg: any) => {
              if (prg.payload) {
                setProgram(prg.payload);
              }
            });

            dispatch(fetchDeveloper(data.payload.tenantId)).then((dev: any) => {
              if (dev.payload) {
                setDeveloper(dev.payload);
              }
            });
          }
        }
        setLoading(false);
        setRefresh(false);
      });
    }
  }, [dispatch, params.id, refresh, reset, userType]);

  return (
    <div className="pb-10">
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
              <MyEditableTextField
                editing={isEditingBankName}
                setEditing={setIsEditingBankName}
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
                value={product.bankName != null ? product.bankName : ""}
                submitting={false}
              />
              <MyEditableTextField
                editing={isEditingEmail}
                setEditing={setIsEditingEmail}
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
                value={
                  product.settlementEmail != null ? product.settlementEmail : ""
                }
                submitting={false}
              />
              <MyEditableTextField
                editing={isEditingPhone}
                setEditing={setIsEditingPhone}
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
                value={
                  product.settlementPhoneNumber != null
                    ? product.settlementPhoneNumber
                    : ""
                }
                submitting={false}
              />
              <ItemRow title="Prefix" value={product.prefix ?? ""}></ItemRow>
              <ItemRow title="Suffix" value={product.suffix ?? ""}></ItemRow>
              <ItemRow
                title="Length"
                value={product.length?.toString() ?? 0}
              ></ItemRow>
            </div>
            <div className="w-[300px]">
              {userType == ADMIN_ROLE ||
                (userType == ADMIN_OPS_ROLE && (
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
                  </>
                ))}
              <ItemRow
                title="Customer Account Type"
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
                title="Created Date"
                value={timestampToDate(product.createdAt)}
              ></ItemRow>
              <ItemRow
                title="Updated Date"
                value={timestampToDate(product.updatedAt)}
              ></ItemRow>
            </div>
          </div>
          {(isEditingName ||
            isEditingId ||
            isEditingActive ||
            isEditingBankName ||
            isEditingPhone ||
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
