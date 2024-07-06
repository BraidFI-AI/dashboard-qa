"use client";

import { Individual, Product } from "@/core/api/ApiTypes";
import ItemRow from "@/core/components/Text/ItemRow";
import MyText from "@/core/components/Text/Text";
import timestampToDate from "@/core/utils/timestampToDate";
import { setTitle } from "@/redux/slices/AppSlice";
import { deletePaymentInstrument } from "@/redux/slices/BusinessSlice";
import { useAppDispatch } from "@/redux/store/store";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { fetchProduct } from "@/redux/slices/ProductSlice";
import { enqueueSnackbar } from "notistack";
import { PDFDocument } from "pdf-lib";
import MyTextButton from "@/core/components/Button/MyTextButton";
import ErrorPage from "@/core/components/error_page";
import { useRouter } from "next/navigation";
import MyRedButton from "@/core/components/Button/MyRedButton";
import { fetchIndividual } from "@/redux/slices/IndividualSlice";
// import { generatePdf } from "@/core/utils/pdfUtils";

const IndividualACHPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [individual, setIndividual] = useState<"loading" | string | Individual>(
    "loading"
  );
  const [product, setProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const [unblocking, setUnblocking] = useState(false);

  useEffect(() => {
    if (refresh) {
      dispatch(setTitle("Individual Customer"));
      dispatch(fetchIndividual(parseInt(params.id))).then((data: any) => {
        if (data.payload == null) {
          setIndividual("Error loading individual");
          return;
        }
        setIndividual(data.payload);
        dispatch(
          setTitle(data.payload.firstName + " " + data.payload.lastName)
        );
      });
      setRefresh(false);
    }
  }, [dispatch, params.id, refresh]);

  return (
    <>
      {individual == "loading" ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading data...</div>
        </div>
      ) : typeof individual == "string" ? (
        <ErrorPage
          error={individual}
          recoveryButtonOnClick={() => {
            setIndividual("loading");
            dispatch(fetchIndividual(parseInt(params.id))).then((data: any) => {
              setIndividual(data.payload);
              dispatch(
                setTitle(data.payload.firstName + " " + data.payload.lastName)
              );
            });
          }}
          recoveryButtonTitle="Reload"
        />
      ) : individual.ach == null ? (
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
              value={individual.ach?.accountNumber ?? ""}
            ></ItemRow>
            <ItemRow
              title="Account type"
              value={individual.ach?.bankAccountType ?? ""}
            ></ItemRow>
            <ItemRow
              title="Bank name"
              value={individual.ach?.bankName ?? ""}
            ></ItemRow>
            <ItemRow
              title="Routing number"
              value={individual.ach?.routingNumber ?? ""}
            ></ItemRow>
            {/* <div className="p-2"></div>
            <div className="w-fit">
              <MyRedButton
                submitting={submitting}
                onClick={() => {
                  setSubmitting(true);
                  dispatch(deletePaymentInstrument(params.id.toString())).then(
                    (d: any) => {
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
                    }
                  );
                }}
              >
                Delete payment instrument
              </MyRedButton>
            </div> */}
            <div className="p-10"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default IndividualACHPage;
