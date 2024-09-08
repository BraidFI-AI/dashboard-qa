"use client";

import { Business, OFAC, Product } from "@/core/api/ApiTypes";
import ItemRow from "@/core/components/Text/ItemRow";
import MyText from "@/core/components/Text/Text";
import timestampToDate from "@/core/utils/timestampToDate";
import { setTitle } from "@/redux/slices/AppSlice";
import {
  approveBusiness,
  downloadBusinessPdf,
  fetchBusiness,
  fetchUboKycStatus,
  unblockBusiness,
  updateBusiness,
} from "@/redux/slices/BusinessSlice";
import { useAppDispatch } from "@/redux/store/store";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { fetchProduct } from "@/redux/slices/ProductSlice";
import { enqueueSnackbar } from "notistack";
// import { PDFDocument } from "pdf-lib";
import MyTextButton from "@/core/components/Button/MyTextButton";
import { fetchOFACHitNew } from "@/redux/slices/OFACSlice";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import MyLinkText from "@/core/components/Text/LinkText";
import { useSelector } from "react-redux";
import { ADMIN_OPS_ROLE, ADMIN_ROLE } from "@/core/constants";
import { SubmitHandler, useForm } from "react-hook-form";
import MyEditButton from "@/core/components/Button/MyEditButton";
import MyEditableTextField from "@/core/components/TextField/MyEditableTextField";
// import { generatePdf } from "@/core/utils/pdfUtils";

const BusinessDetails = ({ params }: { params: { id: string } }) => {
  const dispatch = useAppDispatch();

  const userType = useSelector((state: any) => state.app.userType);

  const [statusValues, setStatusValues] = useState<string[]>([
    "INACTIVE",
    "BLOCKED",
  ]);
  const [editing, setEditing] = useState(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const [ofac, setOfac] = useState<"loading" | string | OFAC>("loading");

  const [unblocking, setUnblocking] = useState(false);

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
      updateBusiness({
        id: params.id.toString(),
        status: data.status,
        cipStatus: data.cipStatus,
      })
    ).then((d: any) => {
      if (typeof d.payload == "string") {
        enqueueSnackbar(d.payload, { variant: "error", persist: true });
      } else {
        enqueueSnackbar("Business updated successfully", {
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
      dispatch(setTitle("Business Customer"));
      dispatch(fetchBusiness(parseInt(params.id))).then((data: any) => {
        if (data.payload) {
          setBusiness(data.payload);
          dispatch(setTitle(data.payload.name));

          dispatch(fetchProduct(data.payload.productId)).then((prd: any) => {
            setProduct(prd.payload);
          });

          dispatch(fetchOFACHitNew(data.payload.ofacId)).then((o: any) => {
            console.log("fetched");
            setOfac(o.payload);
          });
        }
        setLoading(false);
      });
      setRefresh(false);
    }
  }, [dispatch, params.id, refresh]);

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading Business data...</div>
        </div>
      ) : business == null ? (
        <ErrorPage
          error="Error fetching business"
          recoveryButtonOnClick={() => {
            setLoading(true);
            dispatch(setTitle("Business Customer"));
            dispatch(fetchBusiness(parseInt(params.id))).then((data: any) => {
              if (data.payload) {
                setBusiness(data.payload);
                dispatch(setTitle(data.payload.name));

                dispatch(fetchProduct(data.payload.productId)).then(
                  (prd: any) => {
                    setProduct(prd.payload);
                  }
                );

                dispatch(fetchOFACHitNew(data.payload.ofacId)).then(
                  (o: any) => {
                    console.log("fetched");
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
        <div className="w-[1320px] flex flex-row justify-between h-fit">
          <div className="flex flex-row border-solid border-[1px] border-[#E5E5E5] rounded-[10px] h-fit px-3 pt-3">
            <div className="w-[320px]">
              <ItemRow
                title="Business Name"
                value={business.name ?? ""}
              ></ItemRow>
              <ItemRow title="Type" value={business.type ?? ""}></ItemRow>
              <ItemRow
                title="Company Type"
                value={business.businessEntityType ?? ""}
              ></ItemRow>
              <ItemRow
                title="Incorporation State"
                value={business.incorporationState ?? ""}
              ></ItemRow>
              <ItemRow
                title="ID Number"
                value={business.idNumber ?? ""}
              ></ItemRow>
              <ItemRow
                title="ID Number Type"
                value={business.businessIdType ?? ""}
              ></ItemRow>
              <ItemRow
                title="Formation Date"
                value={
                  business.formationDate?.toString()?.replaceAll(",", "-") ?? ""
                }
              ></ItemRow>
              <ItemRow
                title="ACH company ID"
                value={business.achCompanyId ?? ""}
              ></ItemRow>
            </div>
            <div className="w-[320px]">
              <ItemRow
                title="Doing Business as"
                value={business.dba ?? ""}
              ></ItemRow>
              <ItemRow title="Website" value={business.website ?? ""}></ItemRow>
              <ItemRow
                status={business.tcAgreed}
                title="TC Agreed"
                value={business.tcAgreed?.toString() ?? ""}
              ></ItemRow>
              <MyText size="md">Contact Person</MyText>
              <div className="pb-2" />
              <ItemRow
                title="First Name"
                value={business.submittedBy?.contactPersonFirstName ?? ""}
              ></ItemRow>
              <ItemRow
                title="Last Name"
                value={business.submittedBy?.contactPersonLastName ?? ""}
              ></ItemRow>
              <ItemRow
                title="Email"
                value={business.submittedBy?.contactPersonEmail ?? ""}
              ></ItemRow>
              <ItemRow
                title="Phone Number"
                value={business.submittedBy?.contactPersonPhone ?? ""}
              ></ItemRow>
              <div className="w-fit">
                {/* <MyBlueButton
                submitting={downloadingPdf}
                onClick={async () => {
                  setDownloadingPdf(true);
                  dispatch(
                    downloadBusinessPdf({
                      id: params.id.toString(),
                      filename: business.name,
                    })
                  ).then((url: any) => {
                    if (!url.payload) {
                      enqueueSnackbar("No pdf found", { variant: "error" });
                    }
                    setDownloadingPdf(false);
                  });
                }}
              >
                Download PDF Form
              </MyBlueButton> */}
              </div>
            </div>
            <div className="w-[320px]">
              <MyText size="md">Mailing Address</MyText>
              <div className="pb-2" />
              <ItemRow
                title="Street Address"
                value={(business as any)?.addresses?.[0]?.line1 ?? ""}
              ></ItemRow>
              <ItemRow
                title="Apartment, suite, or floor"
                value={(business as any)?.addresses?.[0]?.line2 ?? ""}
              ></ItemRow>
              <ItemRow
                title="Country Code"
                value={(business as any)?.addresses?.[0]?.countryCode ?? ""}
              ></ItemRow>
              <ItemRow
                title="State"
                value={(business as any)?.addresses?.[0]?.state ?? ""}
              ></ItemRow>
              <ItemRow
                title="City"
                value={(business as any)?.addresses?.[0]?.city ?? ""}
              ></ItemRow>
              <ItemRow
                title="Postal Code"
                value={(business as any)?.addresses?.[0]?.postalCode ?? ""}
              ></ItemRow>
            </div>
          </div>
          <div className="w-[320px] border-solid border-[1px] border-[#E5E5E5] rounded-[10px] px-3 pt-3">
            <ItemRow title="Business ID" value={business.id ?? ""}></ItemRow>
            <ItemRow
              title="Product Name"
              value={{
                value:
                  product == null
                    ? business.productId == null
                      ? ""
                      : business.productId?.toString()
                    : product.productName?.toString(),

                link: `/configuration/products/${business.productId}`,
              }}
            />
            <div className="flex flex-row justify-between">
              <div className="flex flex-row">
                {typeof ofac != "string" && ofac.status != "REVIEW" ? (
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
                      value={business.status}
                      options={statusValues}
                      submitting={false}
                    />
                  </div>
                ) : (
                  <ItemRow
                    title="Status"
                    value={business.status ?? ""}
                  ></ItemRow>
                )}

                {/* <ItemRow
                  status={business.status === "ACTIVE"}
                  title="Status"
                  value={business.status ?? ""}
                ></ItemRow> */}
                {typeof ofac != "string" &&
                  ofac.status != "REVIEW" &&
                  business.status === "BLOCKED" && (
                    <div className="w-fit pl-10">
                      <MyTextButton
                        submitting={unblocking}
                        onClick={() => {
                          setUnblocking(true);
                          dispatch(unblockBusiness(business.id ?? -1)).then(
                            (biz: any) => {
                              if (typeof biz.payload != "string") {
                                enqueueSnackbar(
                                  "Business unblocked successfully",
                                  {
                                    variant: "success",
                                  }
                                );
                                setRefresh(true);
                              } else {
                                enqueueSnackbar(biz.payload, {
                                  variant: "error",
                                });
                              }
                              setUnblocking(false);
                            }
                          );
                        }}
                      >
                        Unblock
                      </MyTextButton>
                    </div>
                  )}
              </div>
              {typeof ofac != "string" && ofac.status != "REVIEW" && (
                <MyEditButton editing={editing} setEditing={setEditing} />
              )}
            </div>
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
                    value={business.cipStatus}
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
                  business.cipStatus != null
                    ? business.cipStatus?.toString()
                    : ""
                }
              ></ItemRow>
            )}
            <ItemRow
              title="Created Date"
              value={timestampToDate(business.createdAt)}
            />
            <ItemRow
              title="Updated Date"
              value={timestampToDate(business.updatedAt)}
            />
            {business.ofacId == null ? (
              <MyText size="md">No OFAC check</MyText>
            ) : ofac === "loading" ? (
              <MyCircularProgressIndicator />
            ) : typeof ofac == "string" ? (
              <ErrorPage
                error={ofac}
                recoveryButtonOnClick={() => {
                  if (business.ofacId) {
                    setOfac("loading");
                    dispatch(fetchOFACHitNew(business.ofacId?.toString())).then(
                      (o: any) => {
                        setOfac(o.payload);
                      }
                    );
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
            {business.ofacId != null && ofac === "loading" ? (
              <MyCircularProgressIndicator />
            ) : typeof ofac == "string" ? (
              <></>
            ) : (
              <MyLinkText link={`/compliance/ofac/${business.ofacId}`}>
                Last OFAC status
              </MyLinkText>
            )}
            <div className="pb-4" />
            {(business.status == "PENDING_APPROVAL" ||
              business.status == "PENDING") && (
              <div className="w-fit pt-2 pb-10">
                <MyBlueButton
                  submitting={submitting}
                  onClick={async () => {
                    setSubmitting(true);
                    dispatch(approveBusiness(business.id ?? -1)).then(() => {
                      setSubmitting(false);
                      setRefresh(true);
                    });
                  }}
                >
                  Approve Business
                </MyBlueButton>
                <div className="pb-6" />
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
                <div className="pb-6" />
              </div>
            )}

            {/* <MyText size="md">Address Details</MyText>
            <div className="pb-2" />
            <ItemRow
              title="State"
              value={(business as any).addresses?.[0]?.state ?? ""}
            />
            <ItemRow
              title="City"
              value={(business as any).addresses?.[0]?.city ?? ""}
            />
            <ItemRow
              title="Street address"
              value={(business as any).addresses?.[0]?.line1 ?? ""}
            />
            <ItemRow
              title="Apartment, suite, or floor"
              value={(business as any).addresses?.[0]?.line2 ?? ""}
            />
            <ItemRow
              title="Address Type"
              value={(business as any).addresses?.[0]?.type ?? ""}
            />
            <ItemRow
              title="Postal Code"
              value={(business as any).addresses?.[0]?.postalCode ?? ""}
            />
            <ItemRow
              title="Country Code"
              value={(business as any).addresses?.[0]?.countryCode ?? ""}
            />   */}
          </div>
        </div>
      )}
    </>
  );
};

export default BusinessDetails;
