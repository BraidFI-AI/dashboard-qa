"use client";

import { Business, Product } from "@/core/api/ApiTypes";
import ItemRow from "@/core/components/Text/ItemRow";
import MyText from "@/core/components/Text/Text";
import timestampToDate from "@/core/utils/timestampToDate";
import { setTitle } from "@/redux/slices/AppSlice";
import {
  approveBusiness,
  deletePaymentInstrument,
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
import MyTextButton from "@/core/components/Button/MyTextButton";
import ErrorPage from "@/core/components/error_page";
import { useRouter } from "next/navigation";
import MyRedButton from "@/core/components/Button/MyRedButton";
import { useParams } from "next/navigation";

const BusinessACHPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [business, setBusiness] = useState<"loading" | string | Business>(
    "loading"
  );
  const [product, setProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const params = useParams();
  const [unblocking, setUnblocking] = useState(false);

  useEffect(() => {
    if (refresh) {
      dispatch(setTitle("Business Customer"));
      dispatch(fetchBusiness(parseInt((params.id as string) || "0"))).then(
        (data: any) => {
          if (data.payload != null) {
            dispatch(setTitle(data.payload.name));
          }
          setBusiness(data.payload);
        }
      );
      setRefresh(false);
    }
  }, [dispatch, params.id, refresh]);

  return (
    <>
      {business == "loading" ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading data...</div>
        </div>
      ) : typeof business == "string" ? (
        <ErrorPage
          error={business}
          recoveryButtonOnClick={() => {
            setBusiness("loading");
            dispatch(
              fetchBusiness(parseInt((params.id as string) || "0"))
            ).then((data: any) => {
              setBusiness(data.payload);
            });
          }}
          recoveryButtonTitle="Reload"
        />
      ) : business.ach == null ? (
        <div className="w-fit">
          <MyBlueButton
            onClick={() => {
              router.push("externalAccount/create");
            }}
          >
            Add payment instrument
          </MyBlueButton>
        </div>
      ) : (
        <div className="w-[700px] flex flex-row justify-between">
          <div className="w-[300px]">
            <ItemRow
              title="Account number"
              value={business.ach?.accountNumber ?? ""}
            ></ItemRow>
            <ItemRow
              title="Account type"
              value={business.ach?.bankAccountType ?? ""}
            ></ItemRow>
            <ItemRow
              title="Bank name"
              value={business.ach?.bankName ?? ""}
            ></ItemRow>
            <ItemRow
              title="Routing number"
              value={business.ach?.routingNumber ?? ""}
            ></ItemRow>
            <div className="p-2"></div>
            <div className="w-fit">
              <MyRedButton
                submitting={submitting}
                onClick={() => {
                  setSubmitting(true);
                  dispatch(
                    deletePaymentInstrument((params.id as string) || "0")
                  ).then((d: any) => {
                    if (typeof d.payload == "string") {
                      enqueueSnackbar(d.payload, {
                        variant: "error",
                        persist: true,
                      });
                    } else {
                      enqueueSnackbar(
                        "Payment instrument deleted successfully",
                        { variant: "success" }
                      );
                      setRefresh(true);
                    }
                    setSubmitting(false);
                  });
                }}
              >
                Delete payment instrument
              </MyRedButton>
            </div>
            <div className="p-10"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default BusinessACHPage;
