"use client";

import ReviewTransactionModal from "@/app/transactions/transactionReview/review_transaction_modal";
import { Alert, Case } from "@/core/api/ApiTypes";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import MyTable from "@/core/components/Table/MyTable";
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

const AlertsPage = () => {
  const dispatch = useAppDispatch();
  const params = useParams();

  const alert = useSelector((state: any) => state.alerts.alert);

  const [c, setCase] = useState<null | Case>(null);

  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const handleReviewModalOpen = () => setReviewModalOpen(true);
  const handleReviewModalClose = () => setReviewModalOpen(false);

  const [context, setContext] = useState<any>("loading");

  useEffect(() => {
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
  }, [dispatch, params.id]);

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
      />
      <ItemRow title="Alert ID" value={alert.id ?? ""} />
      {alert.caseId != null && (
        <ItemRow
          title="Case ID"
          value={{
            link: `/alerts-and-cases/cases/${alert.caseId}`,
            value: c == null ? alert.caseId : c.name,
          }}
        />
      )}
      <ItemRow title="Type" value={alert.type ?? ""} />
      <ItemRow
        status={alert.status == "CLOSED" ? true : false}
        title="Status"
        value={alert.status ?? ""}
      />
      <ItemRow title="Description" value={alert.description ?? ""} />
      <ItemRow title="Entity Type" value={alert.contextType ?? ""} />
      {alert.contextType == "TRANSACTION" ? (
        <div
          className="cursor-pointer"
          onClick={(e: any) => {
            if (alert.contextType == "TRANSACTION") {
              handleReviewModalOpen();
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          <ItemRow title="Entity ID" value={alert.contextId} primary={true} />
        </div>
      ) : alert.contextType == "VELOCITY_LIMIT" ? (
        <>
          {context == "loading" ? (
            <ItemRow title="Entity ID" value={alert.contextId} />
          ) : context == null || typeof context == "string" ? (
            <ErrorPage
              error={
                typeof context == "string" ? context : "Failed to fetch limit"
              }
              recoveryButtonTitle="Retry"
              recoveryButtonOnClick={() => {
                dispatch(fetchLimit(alert.contextId.toString())).then(
                  (data: any) => {
                    setContext(data.payload);
                  }
                );
              }}
            />
          ) : (
            <ItemRow
              title="Entity ID"
              value={{
                value: context.limitName,
                link:
                  context.productId != null
                    ? `/configuration/products/${context.productId}/limits/${context.id}`
                    : `/accounts/${context.accountNumber}/limits/${context.id}`,
              }}
            />
          )}
        </>
      ) : (
        <ItemRow
          title="Entity ID"
          value={{
            value: alert.contextId,
            link: `/compliance/ofac/${alert.contextId}`,
          }}
        />
      )}
      <div className="h-10" />
    </>
  );
};

export default AlertsPage;
