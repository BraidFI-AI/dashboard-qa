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
} from "@/redux/slices/BusinessSlice";
import { useAppDispatch } from "@/redux/store/store";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { fetchProduct } from "@/redux/slices/ProductSlice";
import { enqueueSnackbar } from "notistack";
import { PDFDocument } from "pdf-lib";
import MyTextButton from "@/core/components/Button/MyTextButton";
import { fetchOFACHitNew } from "@/redux/slices/OFACSlice";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import MyLinkText from "@/core/components/Text/LinkText";
// import { generatePdf } from "@/core/utils/pdfUtils";

const BusinessDetails = ({ params }: { params: { id: string } }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const [ofac, setOfac] = useState<"loading" | string | OFAC>("loading");

  const [unblocking, setUnblocking] = useState(false);

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
        <div className="w-[1000px] flex flex-row justify-between h-fit">
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
                value={timestampToDate(business.formationDate ?? -1, true)}
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
            <div className="flex flex-row">
              <ItemRow
                status={business.status === "ACTIVE"}
                title="Status"
                value={business.status ?? ""}
              ></ItemRow>
              {business.status === "BLOCKED" && (
                <div className="w-fit pl-10">
                  <MyTextButton
                    submitting={unblocking}
                    onClick={() => {
                      setUnblocking(true);
                      dispatch(unblockBusiness(business.id ?? -1)).then(
                        (biz: any) => {
                          if (typeof biz.payload != "string") {
                            enqueueSnackbar("Business unblocked successfully", {
                              variant: "success",
                            });
                            setRefresh(true);
                          } else {
                            enqueueSnackbar(biz.payload, { variant: "error" });
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
            <ItemRow
              title="Customer Verified"
              value={business.customerVerified?.toString() ?? ""}
            />
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
                    dispatch(fetchOFACHitNew(business.ofacId.toString())).then(
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
            {(business.status == "PENDING_APPROVAL" ||
              business.status == "INACTIVE" ||
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
              </div>
            )}
            <div className="pb-10" />
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
