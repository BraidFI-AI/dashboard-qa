"use client";

import { Individual, OFAC } from "@/core/api/ApiTypes";
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
import { ADMIN_ROLE } from "@/core/constants";
import MyEditButton from "@/core/components/Button/MyEditButton";

export default function IndividualPage({ params }: { params: { id: string } }) {
  const userType = useSelector((state: any) => state.app.userType);

  const [statusValues, setStatusValues] = useState<string[]>([
    "INACTIVE",
    "BLOCKED",
  ]);

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [individual, setIndividual] = useState<Individual | null>(null);

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
  } = useForm<{ status: string; cipStatus: string }>();
  const onSubmit: SubmitHandler<{
    status: string;
    cipStatus: string;
  }> = (data: { status: string; cipStatus: string }) => {
    console.log("data", data);

    setSubmitting(true);
    dispatch(
      updateIndividual({
        id: params.id.toString(),
        status: data.status,
        cipStatus: data.cipStatus,
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
    if (userType == ADMIN_ROLE) {
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
        <div className="w-[1000px] flex flex-row justify-between h-full">
          <div className="flex flex-row border-solid border-[1px] border-[#E5E5E5] rounded-[10px] h-full px-3 pt-3">
            <div className="w-[320px] h-full">
              <ItemRow title="Customer ID" value={individual.id}></ItemRow>
              <ItemRow
                title="First Name"
                value={individual.firstName}
              ></ItemRow>
              <ItemRow
                title="Middle Name"
                value={individual.middleName}
              ></ItemRow>
              <ItemRow title="Last Name" value={individual.lastName}></ItemRow>
              <ItemRow
                status={individual.tcAgreed}
                title="TC Agreed"
                value={individual.tcAgreed?.toString()}
              ></ItemRow>
              <ItemRow title="ID Type" value={individual.idType}></ItemRow>
              <ItemRow title="ID Number" value={individual.idNumber}></ItemRow>
              <ItemRow
                title="ACH Company ID"
                value={
                  individual.achCompanyId != null
                    ? individual.achCompanyId.toString()
                    : ""
                }
              ></ItemRow>
              <ItemRow
                title="Date of Birth"
                value={`${individual.dateOfBirth?.[0]}-${individual.dateOfBirth?.[1]}-${individual.dateOfBirth?.[2]}`}
              ></ItemRow>
            </div>
            <div className="w-[320px] h-full">
              <ItemRow title="Email" value={individual.email}></ItemRow>
              <ItemRow
                title="Mobile Number"
                value={individual.mobilePhone}
              ></ItemRow>
              <MyText size="md">Address</MyText>
              <ItemRow
                title="Address Type"
                value={individual.addresses?.[0]?.type ?? ""}
              />
              <ItemRow
                title="State"
                value={individual.addresses?.[0]?.state ?? ""}
              />
              <ItemRow
                title="City"
                value={individual.addresses?.[0]?.city ?? ""}
              />
              <ItemRow
                title="Street Address"
                value={`${individual.addresses?.[0]?.line1 ?? ""} ${
                  individual.addresses?.[0]?.line2 ?? ""
                } `}
              />
              <ItemRow
                title="Postal Code"
                value={individual.addresses?.[0]?.postalCode ?? ""}
              />
              <ItemRow
                title="Country Code"
                value={individual.addresses?.[0]?.countryCode ?? ""}
              />
            </div>
          </div>
          <div className="h-full w-[320px] border-solid border-[1px] border-[#E5E5E5] rounded-[10px] px-3 pt-3">
            {userType == ADMIN_ROLE ? (
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
                {individual.status === "BLOCKED" && userType == ADMIN_ROLE && (
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
                )}
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
              <div className="w-fit pt-2 pb-10">
                <MyBlueButton
                  onClick={handleSubmit(onSubmit)}
                  submitting={submitting}
                >
                  Update Customer
                </MyBlueButton>
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
