"use client";

import { Individual, OFAC, Product } from "@/core/api/ApiTypes";
import {
  approveIndividual,
  fetchIndividual,
  unblockIndividual,
  updateIndividual,
} from "@/redux/slices/IndividualSlice";
import { useAppDispatch } from "@/redux/store/store";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { setTitle } from "@/redux/slices/AppSlice";
import MyText from "@/core/components/Text/Text";
import timestampToDate from "@/core/utils/timestampToDate";
import ItemRow from "@/core/components/Text/ItemRow";
import MyTextButton from "@/core/components/Button/MyTextButton";
import { enqueueSnackbar } from "notistack";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import MyLinkText from "@/core/components/Text/LinkText";
import { fetchOFACHitNew } from "@/redux/slices/OFACSlice";
import ErrorPage from "@/core/components/error_page";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { useSelector } from "react-redux";
import MyEditableTextField from "@/core/components/TextField/MyEditableTextField";
import { SubmitHandler, useForm } from "react-hook-form";
import { ADMIN_OPS_ROLE, ADMIN_ROLE, States } from "@/core/constants";
import MyEditButton from "@/core/components/Button/MyEditButton";
import { fetchProduct } from "@/redux/slices/ProductSlice";
import MyRedButton from "@/core/components/Button/MyRedButton";

export default function IndividualPage({ params }: { params: { id: string } }) {
  const userType = useSelector((state: any) => state.app.userType);

  const [statusValues, setStatusValues] = useState<string[]>([
    "INACTIVE",
    "BLOCKED",
  ]);

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [individual, setIndividual] = useState<Individual | null>(null);

  const [product, setProduct] = useState<Product | null>(null);

  const [refresh, setRefresh] = useState(true);
  const [unblocking, setUnblocking] = useState(false);

  const [ofac, setOfac] = useState<"loading" | string | OFAC>("loading");

  const [submitting, setSubmitting] = useState(false);

  const [editing, setEditing] = useState(false);

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    getValues,
    reset,
    handleSubmit,
  } = useForm<Individual>({
    defaultValues: { ...individual },
  });
  const onSubmit: SubmitHandler<Individual> = (data: Individual) => {
    console.log("data", data);

    setSubmitting(true);

    for (const key in data) {
      if ((data as any)[key] === null || (data as any)[key] === "") {
        (data as any)[key] = undefined;
      }
    }

    dispatch(
      updateIndividual({
        id: params.id.toString(),
        individual: data,
      })
    ).then((d: any) => {
      if (typeof d.payload == "string") {
        enqueueSnackbar(d.payload, { variant: "error", persist: true });
      } else {
        enqueueSnackbar("Individual updated successfully", {
          variant: "success",
        });
      }
      setSubmitting(false);
      setEditing(false);
      setRefresh(true);
    });
  };

  useEffect(() => {
    if (userType == ADMIN_ROLE || userType == ADMIN_OPS_ROLE) {
      setStatusValues([
        "ACTIVE",
        "BLOCKED",
        "INACTIVE",
        "PENDING_APPROVAL",
        "PENDING",
        "INITIALIZED",
        "PENDING_UNBLOCKED",
      ]);
    } else {
      setStatusValues(["BLOCKED", "INACTIVE"]);
    }
  }, [userType]);

  useEffect(() => {
    if (refresh) {
      dispatch(setTitle("Individual Customer"));
      dispatch(fetchIndividual(parseInt(params.id))).then((data: any) => {
        if (data.payload) {
          setIndividual(data.payload);
          dispatch(
            setTitle(data.payload.firstName + " " + data.payload.lastName)
          );

          dispatch(fetchProduct(data.payload.productId)).then((prd: any) => {
            setProduct(prd.payload);
          });

          dispatch(fetchOFACHitNew(data.payload.ofacId)).then((o: any) => {
            setOfac(o.payload);
          });
        }
        setLoading(false);
      });
      setRefresh(false);
    }
  }, [dispatch, params.id, refresh]);

  return (
    <Box className="h-full">
      {!loading && individual != null ? (
        <div className="flex flex-row justify-between h-full">
          <div className="w-full flex flex-row border-solid border-[1px] border-[#E5E5E5] rounded-[10px] h-full px-3 pt-3">
            <div className="flex flex-col w-full min-w-[200px] max-w-[400px] pr-[12px]">
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="firstName"
                displayName="First Name"
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                value={individual.firstName != null ? individual.firstName : ""}
                submitting={false}
              />
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="middleName"
                displayName="Middle Name"
                control={control}
                errors={errors}
                editable={false}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: false,
                      }
                }
                value={
                  individual.middleName != null ? individual.middleName : ""
                }
                submitting={false}
              />
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="lastName"
                displayName="Last Name"
                control={control}
                errors={errors}
                editable={false}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                value={individual.lastName != null ? individual.lastName : ""}
                submitting={false}
              />
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="tcAgreed"
                displayName="TC Agreed"
                control={control}
                errors={errors}
                editable={false}
                options={["true", "false"]}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                value={individual.tcAgreed}
                submitting={false}
              />
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="idType"
                displayName="ID Type"
                control={control}
                errors={errors}
                editable={false}
                options={["EIN", "SSN", "ITIN", "PASSPORT", "OTHER_ID"]}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                value={individual.idType != null ? individual.idType : ""}
                submitting={false}
              />
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="idNumber"
                displayName="ID Number"
                control={control}
                errors={errors}
                editable={false}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                value={individual.idNumber != null ? individual.idNumber : ""}
                submitting={false}
              />
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="achCompanyId"
                displayName="ACH Company ID"
                control={control}
                errors={errors}
                editable={false}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                value={
                  individual.achCompanyId != null ? individual.achCompanyId : ""
                }
                submitting={false}
              />
              <ItemRow
                title="Date of Birth"
                value={`${individual.dateOfBirth?.[0]}-${individual.dateOfBirth?.[1]}-${individual.dateOfBirth?.[2]}`}
              ></ItemRow>
            </div>
            <div className="flex flex-col w-full min-w-[200px] max-w-[400px] pr-[12px]">
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="email"
                displayName="Email"
                control={control}
                errors={errors}
                editable={false}
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
                value={individual.email != null ? individual.email : ""}
                submitting={false}
              />
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="mobilePhone"
                displayName="Mobile Number"
                control={control}
                errors={errors}
                editable={false}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                        pattern:
                          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
                      }
                }
                value={
                  individual.mobilePhone != null ? individual.mobilePhone : ""
                }
                submitting={false}
              />
              <MyText size="md">Address</MyText>
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="address.state"
                displayName="State"
                control={control}
                errors={errors}
                editable={false}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                options={States}
                value={individual.addresses?.[0]?.state ?? ""}
                submitting={false}
              />
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="address.city"
                displayName="City"
                control={control}
                errors={errors}
                editable={false}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                value={individual.addresses?.[0]?.city ?? ""}
                submitting={false}
              />
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="address.line1"
                displayName="Street Address"
                control={control}
                errors={errors}
                editable={false}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                value={individual.addresses?.[0]?.line1 ?? ""}
                submitting={false}
              />
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="address.line2"
                displayName="Apartment, suite, or floor"
                control={control}
                errors={errors}
                editable={false}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: false,
                      }
                }
                value={individual.addresses?.[0]?.line2 ?? ""}
                submitting={false}
              />
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="address.postalCode"
                displayName="Postal Code"
                control={control}
                errors={errors}
                editable={false}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                value={individual.addresses?.[0]?.postalCode ?? ""}
                submitting={false}
              />
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="address.countryCode"
                displayName="Country Code"
                control={control}
                errors={errors}
                editable={false}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                value={individual.addresses?.[0]?.countryCode ?? ""}
                submitting={false}
              />
            </div>
          </div>
          <div className="w-3" />
          <div className="h-full w-[350px] border-solid border-[1px] border-[#E5E5E5] rounded-[10px] px-3 pt-3">
            <ItemRow title="Individual ID" value={individual.id}></ItemRow>
            <ItemRow
              title="Product Name"
              value={{
                value:
                  product == null
                    ? individual.productId == null
                      ? ""
                      : individual.productId?.toString()
                    : product.productName?.toString(),

                link: `/configuration/products/${individual.productId}`,
              }}
            />
            {userType == ADMIN_ROLE || userType == ADMIN_OPS_ROLE ? (
              <div className="flex flex-row justify-between">
                <div>
                  <MyEditableTextField
                    editing={editing}
                    setEditing={setEditing}
                    editable={false}
                    name="cipStatus"
                    displayName="CIP Status"
                    control={control}
                    errors={errors}
                    rules={
                      submitting
                        ? { required: false }
                        : {
                            required: true,
                          }
                    }
                    value={individual.cipStatus}
                    options={["NOT_START", "PASS", "FAIL", "IN_REVIEW"]}
                    submitting={false}
                  />
                </div>
                <MyEditButton editing={editing} setEditing={setEditing} />
              </div>
            ) : (
              <ItemRow
                title="CIP Status"
                value={
                  individual.cipStatus != null
                    ? individual.cipStatus.toString()
                    : ""
                }
              ></ItemRow>
            )}
            <div className="flex flex-row justify-between">
              <div className="flex flex-row">
                <div>
                  <MyEditableTextField
                    editing={editing}
                    setEditing={setEditing}
                    editable={false}
                    name="status"
                    displayName="Status"
                    control={control}
                    errors={errors}
                    rules={
                      submitting
                        ? { required: false }
                        : {
                            required: true,
                          }
                    }
                    value={individual.status}
                    options={statusValues}
                    submitting={false}
                  />
                </div>
                {/* <ItemRow
                status={individual.status === "ACTIVE"}
                title="Status"
                value={individual.status}
              ></ItemRow> */}
                {/* {individual.status === "BLOCKED" &&
                  (userType == ADMIN_ROLE || userType == ADMIN_OPS_ROLE) && (
                    <div className="w-fit pl-10">
                      <MyTextButton
                        submitting={unblocking}
                        onClick={() => {
                          setUnblocking(true);
                          dispatch(unblockIndividual(individual.id)).then(
                            (biz: any) => {
                              if (typeof biz.payload != "string") {
                                enqueueSnackbar(
                                  "Business unblocked successfully",
                                  {
                                    variant: "success",
                                  }
                                );
                              } else {
                                enqueueSnackbar(biz.payload, {
                                  variant: "error",
                                });
                              }
                              setUnblocking(false);
                              setRefresh(true);
                            }
                          );
                        }}
                      >
                        Unblock
                      </MyTextButton>
                    </div>
                  )} */}
              </div>
              <MyEditButton editing={editing} setEditing={setEditing} />
            </div>
            <ItemRow
              title="CreatedAt"
              value={timestampToDate(individual.createdAt)}
            ></ItemRow>
            <ItemRow
              title="UpdatedAt"
              value={timestampToDate(individual.updatedAt)}
            ></ItemRow>
            {individual.ofacId == null ? (
              <MyText size="md">No OFAC check</MyText>
            ) : ofac === "loading" ? (
              <MyCircularProgressIndicator />
            ) : typeof ofac == "string" ? (
              <ErrorPage
                error={ofac}
                recoveryButtonOnClick={() => {
                  if (individual.ofacId != null) {
                    setOfac("loading");
                    dispatch(
                      fetchOFACHitNew(individual.ofacId.toString())
                    ).then((o: any) => {
                      setOfac(o.payload);
                    });
                  }
                }}
                recoveryButtonTitle="Retry"
              />
            ) : (
              <ItemRow
                title="Last OFAC date"
                value={timestampToDate(ofac.createdAt ?? 0)}
              />
            )}
            {individual.ofacId != null && ofac === "loading" ? (
              <MyCircularProgressIndicator />
            ) : typeof ofac == "string" ? (
              <></>
            ) : (
              <>
                <MyLinkText link={`/compliance/ofac/${individual.ofacId}`}>
                  Last OFAC status
                </MyLinkText>
                <div className="pb-10" />
              </>
            )}
            {(individual.status == "PENDING_APPROVAL" ||
              individual.status == "PENDING") && (
              <div className="w-fit pt-2 pb-10">
                <MyBlueButton
                  submitting={submitting}
                  onClick={async () => {
                    setSubmitting(true);
                    dispatch(approveIndividual(individual.id ?? -1)).then(
                      (aprv: any) => {
                        if (typeof aprv.payload == "string") {
                          enqueueSnackbar(aprv.payload, {
                            variant: "error",
                            persist: true,
                          });
                        } else {
                          enqueueSnackbar("Individual approved successfully", {
                            variant: "success",
                          });
                          setRefresh(true);
                        }
                        setSubmitting(false);
                      }
                    );
                  }}
                >
                  Approve Individual
                </MyBlueButton>
              </div>
            )}
            {editing && (
              <div className="flex flex-row justify-between">
                <div className="w-fit pt-2 pb-10">
                  <MyRedButton
                    submitting={submitting}
                    onClick={() => {
                      setEditing(false);
                    }}
                  >
                    Cancel
                  </MyRedButton>
                </div>
                <div className="w-fit pt-2 pb-10">
                  <MyBlueButton
                    onClick={handleSubmit(onSubmit)}
                    submitting={submitting}
                  >
                    Update Customer
                  </MyBlueButton>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : !loading && individual == null ? (
        <ErrorPage
          error="Error loading individual"
          recoveryButtonOnClick={() => {
            setLoading(true);
            dispatch(setTitle("Individual Customer"));
            dispatch(fetchIndividual(parseInt(params.id))).then((data: any) => {
              if (data.payload) {
                setIndividual(data.payload);
                dispatch(setTitle(data.payload.name));

                dispatch(fetchProduct(data.payload.productId)).then(
                  (prd: any) => {
                    setProduct(prd.payload);
                  }
                );

                dispatch(fetchOFACHitNew(data.payload.ofacId)).then(
                  (o: any) => {
                    setOfac(o.payload);
                  }
                );
              }
              setLoading(false);
            });
          }}
          recoveryButtonTitle="Retry"
        />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <CircularProgress></CircularProgress>
          <div>Loading individual...</div>
        </div>
      )}
    </Box>
  );
}
