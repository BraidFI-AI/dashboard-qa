"use client";

import ReviewTransactionModal from "@/app/transactions/transactionReview/review_transaction_modal";
import { Alert, Case } from "@/core/api/ApiTypes";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import ItemRow from "@/core/components/Text/ItemRow";
import MyText from "@/core/components/Text/Text";
import timestampToDate from "@/core/utils/timestampToDate";
import { fetchAlert } from "@/redux/slices/alerts_slice";
import { setTitle } from "@/redux/slices/AppSlice";
import { fetchCase } from "@/redux/slices/cases_slice";
import { fetchLimit } from "@/redux/slices/RulesAndLimitsSlice";
import { useAppDispatch } from "@/redux/store/store";
import { GridCellParams, MuiEvent } from "@mui/x-data-grid";
import { set } from "lodash";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AlertNotesComponent from "./components/notes";
import AlertDocumentsComponent from "./components/documents";
import AlertDetailsComponent from "./components/details";
import AlertTimelineComponent from "./components/timeline";

const AlertsPage = () => {
  const dispatch = useAppDispatch();
  const params = useParams();

  const alert = useSelector((state: any) => state.alerts.alert);

  const [c, setCase] = useState<null | Case>(null);

  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const handleReviewModalOpen = () => setReviewModalOpen(true);
  const handleReviewModalClose = () => setReviewModalOpen(false);

  const [context, setContext] = useState<any>("loading");

  const [refresh, setRefresh] = useState<boolean>(true);

  useEffect(() => {
    if (refresh) {
      setRefresh(false);
      dispatch(setTitle("Alert"));
      dispatch(fetchAlert(params.id.toString())).then((data: any) => {
        if (typeof data.payload != "string") {
          dispatch(setTitle(data.payload.type?.replaceAll("_", " ")));

          if (data.payload.contextType == "VELOCITY_LIMIT") {
            dispatch(fetchLimit(data.payload.contextId.toString())).then(
              (data: any) => {
                setContext(data.payload);
              }
            );
          }

          if (data.payload.caseId != null) {
            dispatch(fetchCase(data.payload.caseId.toString())).then(
              (cas: any) => {
                setCase(cas.payload);
              }
            );
          }
        }
      });
    }
  }, [dispatch, params.id, refresh]);

  return alert == "loading" ? (
    <MyCircularProgressIndicator />
  ) : typeof alert == "string" ? (
    <ErrorPage
      error={alert}
      recoveryButtonTitle="Retry"
      recoveryButtonOnClick={() => {
        dispatch(fetchAlert(params.id.toString())).then((data: any) => {
          if (typeof data.payload != "string") {
            dispatch(setTitle(data.payload.type?.replaceAll("_", "")));
          }
        });
      }}
    />
  ) : (
    <>
      <ReviewTransactionModal
        paymentId={alert.contextId}
        modalOpen={reviewModalOpen}
        handleModalClose={handleReviewModalClose}
        alertId={alert.id}
        ofacId={alert.ofacId ?? ""}
        customActionOnCompletion={() => setRefresh(true)}
      />
      <div className="flex flex-row">
        <div className="flex flex-col w-full">
          <AlertDetailsComponent alert={alert} context={context} />
          <div className="h-6" />
          <AlertDetailsComponent alert={alert} context={context} />
        </div>
        <div className="w-6" />
        <AlertTimelineComponent alert={alert} />
      </div>
      <div className="h-6" />
      <div className="w-full flex flex-row">
        <div className="pr-4 w-full">
          <AlertNotesComponent alert={alert} />
        </div>
        <AlertDocumentsComponent alert={alert} />
      </div>
      <div className="h-10" />
    </>
  );
};

export default AlertsPage;
