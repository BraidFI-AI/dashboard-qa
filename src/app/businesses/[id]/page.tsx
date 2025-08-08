"use client";

import { Business, OFAC, Product } from "@/core/api/ApiTypes";
import ItemRow from "@/core/components/Text/ItemRow";
import MyText from "@/core/components/Text/Text";
import { timestampToDate } from "@/core/utils/date_time_util";
import { setTitle } from "@/redux/slices/AppSlice";
import {
  approveBusiness,
  fetchBusiness,
  updateBusiness,
} from "@/redux/slices/BusinessSlice";
import { useAppDispatch } from "@/redux/store/store";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { fetchProduct } from "@/redux/slices/ProductSlice";
import { enqueueSnackbar } from "notistack";
// import { PDFDocument } from "pdf-lib";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import MyLinkText from "@/core/components/Text/LinkText";
import { useSelector } from "react-redux";
import {
  ADMIN_OPS_ROLE,
  ADMIN_READONLY_ROLE,
  ADMIN_ROLE,
  mapBusinessTypeToString,
  mapStringToBusinessType,
  States,
} from "@/core/constants";
import { SubmitHandler, useForm } from "react-hook-form";
import MyEditButton from "@/core/components/Button/MyEditButton";
import MyEditableTextField from "@/core/components/TextField/MyEditableTextField";
import moment from "moment";
import MyControlledDatePicker from "@/core/components/DateTimePicker/MyControlledDateTimePicker";
import MyRedButton from "@/core/components/Button/MyRedButton";
import { fetchOFACHitNew } from "@/redux/slices/OFACSlice";
import { decrypt } from "@/redux/slices/encryption_slice";
// import { generatePdf } from "@/core/utils/pdfUtils";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useParams } from "next/navigation";

const BusinessDetails = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
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
  const [showEncryptedIdNumber, setShowEncryptedIdNumber] = useState(false);

  const [ofac, setOfac] = useState<"loading" | string | OFAC>("loading");

  const [unblocking, setUnblocking] = useState(false);

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    getValues,
    setValue,
    handleSubmit,
  } = useForm<Business>({ defaultValues: { ...business } });
  const onSubmit: SubmitHandler<Business> = (data: Business) => {
    console.log("data", data);

    setSubmitting(true);

    for (const key in data) {
      if ((data as any)[key] === null) {
        (data as any)[key] = undefined;
      }
    }

    data = {
      ...data,
      businessEntityType: mapStringToBusinessType(
        data.businessEntityType ?? ""
      ),
    };
    if (data.businessEntityType == null || data.businessEntityType == "") {
      data.businessEntityType = undefined;
    }

    dispatch(
      updateBusiness({
        id: (params.id as string) || "0",
        business: data,
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
      setStatusValues(["ACTIVE", "BLOCKED", "INACTIVE", "PENDING_APPROVAL"]);
    } else {
      setStatusValues(["BLOCKED", "INACTIVE"]);
    }
  }, [userType]);

  useEffect(() => {
    if (refresh) {
      dispatch(setTitle("Business Customer"));
      dispatch(fetchBusiness(parseInt((params.id as string) || ""))).then(
        (data: any) => {
          if (data.payload) {
            setBusiness(data.payload);
            dispatch(setTitle(data.payload.name));

            if (data.payload.idNumber != null) {
              dispatch(decrypt(data.payload.idNumber)).then((d: any) => {
                if (typeof d.payload == "string") {
                  setBusiness(data.payload);
                  setValue("idNumber", data.payload.idNumber);
                } else {
                  setBusiness({ ...data.payload, idNumber: d.payload.data });
                  setValue("idNumber", d.payload.data);
                }
              });
            } else {
              setBusiness(data.payload);
              setValue("idNumber", data.payload.idNumber);
            }

            dispatch(fetchProduct(data.payload.productId)).then((prd: any) => {
              setProduct(prd.payload);
            });

            dispatch(fetchOFACHitNew(data.payload.ofacId)).then((o: any) => {
              console.log("fetched");
              setOfac(o.payload);
            });
          }
          setLoading(false);
        }
      );
      setRefresh(false);
    }
  }, [dispatch, params.id, refresh, setValue]);

  return (
    <div className="pt-6">
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
            dispatch(
              fetchBusiness(parseInt((params.id as string) || "0"))
            ).then((data: any) => {
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
        <div className="flex flex-row justify-between h-fit">
          <div className="w-full flex flex-row border-solid border-[1px] border-[#E5E5E5] rounded-[10px] h-fit px-3 pt-3">
            <div className="flex flex-col w-full min-w-[200px] max-w-[400px] pr-[12px]">
              <MyEditableTextField
                editing={editing}
                setEditing={() => {
                  // reset({...business})
                  setEditing(!editing);
                }}
                name="name"
                displayName="Business Name"
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                value={business.name ?? ""}
                submitting={false}
              />
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="businessEntityType"
                displayName="Company Type"
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
                value={mapBusinessTypeToString(
                  business.businessEntityType ?? ""
                )}
                options={[
                  "Sole Proprietor",
                  "Limited Liability Company (LLC)",
                  "S or C Corporation",
                  "General Partnership",
                  "Limited Liability Partnership",
                  "Non-Profit Corporation",
                  "Trusts",
                  "Government Organization",
                  "Publicly Traded Company",
                ]}
                submitting={false}
              />
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="incorporationState"
                displayName="Incorporation State"
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
                options={States}
                value={business.incorporationState ?? ""}
                submitting={false}
              />
              <div className="flex flex-row justify-between">
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
                  value={
                    showEncryptedIdNumber ? business.idNumber ?? "" : "••••••••"
                  }
                  submitting={false}
                />
                {showEncryptedIdNumber ? (
                  <VisibilityOffIcon
                    className="text-[#12A7FF]"
                    onClick={() => {
                      setShowEncryptedIdNumber(!showEncryptedIdNumber);
                    }}
                  />
                ) : (
                  <VisibilityIcon
                    className="text-[#12A7FF]"
                    onClick={() => {
                      setShowEncryptedIdNumber(!showEncryptedIdNumber);
                    }}
                  />
                )}
              </div>
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="businessIdType"
                displayName="ID Number Type"
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
                options={["EIN", "SSN", "TIN", "OTHER_ID"]}
                value={business.businessIdType ?? ""}
                submitting={false}
              />
              <ItemRow
                title="Formation Date"
                value={
                  business.formationDate?.toString()?.replaceAll(",", "-") ?? ""
                }
              />
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="achCompanyId"
                displayName="ACH company ID"
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
                value={business.achCompanyId ?? ""}
                submitting={false}
              />
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="mcc"
                displayName="MCC"
                control={control}
                errors={errors}
                editable={false}
                rules={{ required: false }}
                value={business.mcc ?? ""}
                submitting={false}
              />
            </div>
            <div className="flex flex-col w-full min-w-[200px] max-w-[400px] pr-[12px]">
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="naics"
                displayName="NAICS"
                control={control}
                errors={errors}
                editable={false}
                rules={{ required: false }}
                value={business.naics ?? ""}
                submitting={false}
              />
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="dba"
                displayName="Doing Business as"
                control={control}
                errors={errors}
                editable={false}
                rules={{ required: false }}
                value={business.dba ?? ""}
                submitting={false}
              />
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="website"
                displayName="Website"
                control={control}
                errors={errors}
                editable={false}
                rules={{ required: false }}
                value={business.website ?? ""}
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
                rules={{ required: false }}
                options={["true", "false"]}
                value={business.tcAgreed?.toString() ?? ""}
                submitting={false}
              />
              <MyText size="md">Contact Person</MyText>
              <div className="pb-2" />
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="submittedBy.contactPersonFirstName"
                displayName="First Name"
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
                value={business.submittedBy?.contactPersonFirstName ?? ""}
                submitting={false}
              />
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="submittedBy.contactPersonLastName"
                displayName="Last Name"
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
                value={business.submittedBy?.contactPersonLastName ?? ""}
                submitting={false}
              />
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="submittedBy.contactPersonEmail"
                displayName="Email"
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
                value={business.submittedBy?.contactPersonEmail ?? ""}
                submitting={false}
              />
              <MyEditableTextField
                editing={editing}
                setEditing={setEditing}
                name="submittedBy.contactPersonPhone"
                displayName="Phone Number"
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
                value={business.submittedBy?.contactPersonPhone ?? ""}
                submitting={false}
              />
              <div className="w-fit">
                {/* <MyBlueButton
                submitting={downloadingPdf}
                onClick={async () => {
                  setDownloadingPdf(true);
                  dispatch(
                    downloadBusinessPdf({
                      id: (params.id as string) || "0",
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
            <div className="flex flex-col w-full min-w-[200px] max-w-[400px] pr-[12px]">
              <MyText size="md">Mailing Address</MyText>
              <div className="pb-2" />
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
                        required: false,
                      }
                }
                value={(business as any)?.addresses?.[0]?.line1 ?? ""}
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
                value={(business as any)?.addresses?.[0]?.line2 ?? ""}
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
                        required: false,
                      }
                }
                value={(business as any)?.addresses?.[0]?.city ?? ""}
                submitting={false}
              />
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
                        required: false,
                      }
                }
                options={States}
                value={(business as any)?.addresses?.[0]?.state ?? ""}
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
                        required: false,
                      }
                }
                value={(business as any)?.addresses?.[0]?.postalCode ?? ""}
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
                value={(business as any)?.addresses?.[0]?.countryCode ?? ""}
                submitting={false}
              />
            </div>
          </div>
          <div className="w-3" />
          <div className="w-[350px] border-solid border-[1px] border-[#E5E5E5] rounded-[10px] px-3 pt-3">
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
                {/* {typeof ofac != "string" &&
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
                  )} */}
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
                  <div className="pb-6" />
                </div>
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
    </div>
  );
};

export default BusinessDetails;
