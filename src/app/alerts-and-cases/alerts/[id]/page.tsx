"use client";

import ReviewTransactionModal from "@/app/transactions/transactionReview/review_transaction_modal";
import { Case } from "@/core/api/ApiTypes";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import { fetchAlert } from "@/redux/slices/alerts_slice";
import { setTitle } from "@/redux/slices/AppSlice";
import { fetchCase } from "@/redux/slices/cases_slice";
import { fetchLimit } from "@/redux/slices/RulesAndLimitsSlice";
import { useAppDispatch } from "@/redux/store/store";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import AlertNotesComponent from "./components/notes";
import AlertDocumentsComponent from "./components/documents";
import AlertDetailsComponent from "./components/details";
import AlertTimelineComponent from "./components/timeline";
import { SCROLLBAR_STYLE } from "@/core/constants";
import EntityTypeOFACComponent from "./components/entity_detail_components/entity_type_ofac";
import { fetchOFACHit } from "@/redux/slices/OFACSlice";
import { fetch314ARecord } from "@/redux/slices/314a_slice";
import { fetchProduct } from "@/redux/slices/ProductSlice";
import { fetchIndividualV2 } from "@/redux/slices/IndividualSlice";
import { fetchBusinessV2 } from "@/redux/slices/BusinessSlice";
import { fetchCounterPartyV2 } from "@/redux/slices/CounterpartySlice";
import EntityType314AComponent from "./components/entity_detail_components/entity_type_314a";
import { fetchTransactions } from "@/redux/slices/TransactionSlice";
import EntityTypeFileNameComponent from "./components/entity_detail_components/entity_type_file_name";
import EntityTypeVelocityLimitComponent from "./components/entity_detail_components/entity_type_velocity_limit";
import EntityTypeTransactionComponent from "./components/entity_detail_components/entity_type_transaction";
import EntityTypeProductComponent from "./components/entity_detail_components/entity_type_product";
import EntityTypeBusinessComponent from "./components/entity_detail_components/entity_type_business";
import EntityTypeIndividualComponent from "./components/entity_detail_components/entity_type_individual";
import EntityTypeCounterpartyComponent from "./components/entity_detail_components/entity_type_counterparty";
import EntityTypeTransactionMonitoringComponent from "./components/entity_detail_components/entity_type_transaction_monitoring";
import { getWireFileProcessingError } from "@/redux/slices/wire_processing_slice";
import EntityTypeFileRecordComponent from "./components/entity_detail_components/file_record";
import { fetchRawACHTransaction } from "@/redux/slices/ach_processing_slice";
import ACHReturnProcessingComponent from "./components/entity_detail_components/ach_return_processing";

const AlertsPage = () => {
  const dispatch = useAppDispatch();
  const params = useParams();

  const alert = useSelector((state: any) => state.alerts.alert);

  const [c, setCase] = useState<null | Case>(null);

  const columnRef = useRef<HTMLDivElement>(null);
  const [columnHeight, setColumnHeight] = useState<number | null>(null);

  const detailsRef = useRef<HTMLDivElement>(null);
  const [detailsWidth, setDetailsWidth] = useState<number | null>(null);

  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const handleReviewModalOpen = () => setReviewModalOpen(true);
  const handleReviewModalClose = () => setReviewModalOpen(false);

  const [context, setContext] = useState<any>("loading");
  const [entityType, setEntityType] = useState<
    | ""
    | "OFAC" // ofac
    | "TRANSACTION_MONITORING" // transaction
    | "TRANSACTION_REVIEW" // transaction
    | "FILE_NAME" // dual approval
    | "VELOCITY_LIMIT" // // dual approval
    | "TRANSACTION" // dual approval
    | "PRODUCT" // dual approval
    | "LIST_314A" // list 314a
    | "INDIVIDUAL" // prohibited entity
    | "BUSINESS" // prohibited entity
    | "COUNTERPARTY" // prohibited entity
    | "FILE_RECORD" // transaction processing error
    | "ACH_RETURN_PROCESSING" // ach inbound transaction processing error
  >("");

  const [refresh, setRefresh] = useState<boolean>(true);

  useEffect(() => {
    if (refresh) {
      setRefresh(false);
      dispatch(setTitle("Alert"));
      dispatch(fetchAlert(params.id.toString())).then((data: any) => {
        if (typeof data.payload != "string") {
          dispatch(setTitle(data.payload.type?.replaceAll("_", " ")));

          // setting entity type to show details
          let entity = "";
          if (data.payload.additionalParam == "MANUAL_ALERT") {
            setEntityType(data.payload.contextType);
            entity = data.payload.contextType;
          } else if (
            data.payload.type == "OFAC" ||
            data.payload.type == "LIST_314A" ||
            data.payload.type == "DUAL_APPROVAL" ||
            data.payload.type == "PROHIBITED_ENTITY" ||
            data.payload.type == "TRANSACTION_PROCESSING_ERROR" 
          ) {
            setEntityType(data.payload.contextType);
            entity = data.payload.contextType;
          } else if (data.payload.type == "TRANSACTION_MONITORING") {
            setEntityType("TRANSACTION_MONITORING");
            entity = "TRANSACTION_MONITORING";
          } else if (data.payload.type == "TRANSACTION_REVIEW") {
            setEntityType("TRANSACTION_REVIEW");
            entity = "TRANSACTION_REVIEW";
          }
          else if (data.payload.type == "ACH_RETURN_PROCESSING") {
            setEntityType("ACH_RETURN_PROCESSING");
            entity = "ACH_RETURN_PROCESSING";
          }

          if (entity == "OFAC") {
            dispatch(fetchOFACHit(data.payload.contextId.toString())).then(
              (e: any) => {
                setContext(e.payload);
              }
            );
          } else if (entity == "LIST_314A") {
            dispatch(fetch314ARecord(data.payload.contextId.toString())).then(
              (e: any) => {
                setContext(e.payload);
              }
            );
          } else if (entity == "FILE_NAME") {
            dispatch(
              fetchTransactions({
                refresh: true,
                criteria: { wireFileHandle: data.payload.contextId },
              })
            ).then((e: any) => {
              setContext(e.payload.transactions);
            });
          } else if (entity == "VELOCITY_LIMIT") {
            dispatch(fetchLimit(data.payload.contextId.toString())).then(
              (e: any) => {
                setContext(e.payload);
              }
            );
          } else if (entity == "TRANSACTION") {
            dispatch(
              fetchTransactions({
                refresh: true,
                criteria: { paymentId: data.payload.contextId },
              })
            ).then((e: any) => {
              setContext(e.payload.transactions);
            });
          } else if (entity == "PRODUCT") {
            dispatch(fetchProduct(data.payload.contextId.toString())).then(
              (e: any) => {
                setContext(e.payload);
              }
            );
          } else if (entity == "INDIVIDUAL") {
            dispatch(fetchIndividualV2(data.payload.contextId.toString())).then(
              (e: any) => {
                setContext(e.payload);
              }
            );
          } else if (entity == "BUSINESS") {
            dispatch(fetchBusinessV2(data.payload.contextId.toString())).then(
              (e: any) => {
                setContext(e.payload);
              }
            );
          } else if (entity == "COUNTERPARTY") {
            dispatch(
              fetchCounterPartyV2(data.payload.contextId.toString())
            ).then((e: any) => {
              setContext(e.payload);
            });
          } else if (entity == "TRANSACTION_MONITORING") {
            setContext({});
          } else if (entity == "TRANSACTION_REVIEW") {
            setContext({});
          } else if (entity == "FILE_RECORD") {
            dispatch(
              getWireFileProcessingError(data.payload.contextId.toString())
            ).then((e: any) => {
              setContext(e.payload);
            });
          }
          else if (entity == 'ACH_RETURN_PROCESSING'){
            dispatch(fetchRawACHTransaction(data.payload.contextId.toString())).then((e: any) => { 
              setContext(e.payload);
            });
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

  const calculateHeight = useCallback(() => {
    const column = columnRef.current;
    if (!column) return null;

    // Calculate total height of children, accounting for margin/padding
    const children = Array.from(column.children);
    const totalHeight = children.reduce((sum, child) => {
      // Use getBoundingClientRect to get precise height including margins
      const rect = child.getBoundingClientRect();
      return sum + rect.height;
    }, 0);

    return totalHeight;
  }, []);

  useEffect(() => {
    const column = columnRef.current;
    if (!column) return;

    // Create a ResizeObserver to track height changes
    const resizeObserver = new ResizeObserver(() => {
      const newHeight = calculateHeight();
      setColumnHeight(newHeight);
    });

    // Observe each child to capture height changes in nested components
    const children = Array.from(column.children);
    children.forEach((child) => resizeObserver.observe(child));

    // Initial height calculation
    const initialHeight = calculateHeight();
    setColumnHeight(initialHeight);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, [calculateHeight, alert, context]);

  useEffect(() => {
    const details = detailsRef.current;
    if (!details) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const children = Array.from(entry.target.children);
        const totalWidth = children.reduce((sum, child) => {
          return sum + child.clientWidth;
        }, 0);

        setDetailsWidth(totalWidth);
      }
    });

    // Start observing the column
    resizeObserver.observe(details);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, [alert, context]);

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
    <div className={`${SCROLLBAR_STYLE}`}>
      <div className="flex flex-row">
        <div ref={columnRef} className="flex flex-col w-full pr-6">
          <div ref={detailsRef}>
            <AlertDetailsComponent
              alert={alert}
              context={context}
              entity={entityType}
            />
          </div>
          <div className="h-6" />
          {context == "loading" ? (
            <MyCircularProgressIndicator />
          ) : typeof context == "string" ? (
            <ErrorPage
              error={context}
              recoveryButtonTitle="Retry"
              recoveryButtonOnClick={() => setRefresh(true)}
            />
          ) : (
            <>
              {entityType == "OFAC" ? (
                <EntityTypeOFACComponent alert={alert} context={context} />
              ) : entityType == "LIST_314A" ? (
                <EntityType314AComponent alert={alert} context={context} />
              ) : entityType == "FILE_NAME" ? (
                <div
                  style={{
                    width: detailsWidth ? `${detailsWidth}px` : "auto",
                  }}
                >
                  <EntityTypeFileNameComponent
                    alert={alert}
                    context={context}
                  />
                </div>
              ) : entityType == "VELOCITY_LIMIT" ? (
                <EntityTypeVelocityLimitComponent
                  alert={alert}
                  context={context}
                />
              ) : entityType == "TRANSACTION" ? (
                <div
                  style={{
                    width: detailsWidth ? `${detailsWidth}px` : "auto",
                  }}
                >
                  <EntityTypeTransactionComponent
                    alert={alert}
                    context={context}
                  />
                </div>
              ) : entityType == "PRODUCT" ? (
                <EntityTypeProductComponent alert={alert} context={context} />
              ) : entityType == "BUSINESS" ? (
                <EntityTypeBusinessComponent alert={alert} context={context} />
              ) : entityType == "INDIVIDUAL" ? (
                <EntityTypeIndividualComponent
                  alert={alert}
                  context={context}
                />
              ) : entityType == "COUNTERPARTY" ? (
                <EntityTypeCounterpartyComponent
                  alert={alert}
                  context={context}
                />
              ) : entityType == "TRANSACTION_MONITORING" ? (
                <div
                  style={{
                    width: detailsWidth ? `${detailsWidth}px` : "auto",
                  }}
                >
                  <EntityTypeTransactionMonitoringComponent
                    alert={alert}
                    alertId={alert.id}
                    paymentId={alert.contextId}
                    ofacId={alert.ofacId ?? ""}
                  />
                </div>
              ) : entityType == "TRANSACTION_REVIEW" ? (
                <div
                  style={{
                    width: detailsWidth ? `${detailsWidth}px` : "auto",
                  }}
                >
                  <EntityTypeTransactionMonitoringComponent
                    alert={alert}
                    alertId={alert.id}
                    paymentId={alert.contextId}
                    ofacId={alert.ofacId ?? ""}
                  />
                </div>
              ) : entityType == "FILE_RECORD" ? (
                <EntityTypeFileRecordComponent
                  alert={alert}
                  context={context}
                />
              ) : entityType == "ACH_RETURN_PROCESSING" ? (
                <ACHReturnProcessingComponent
                  alert={alert}
                  context={context}
                />
              ) : (
                <></>
              )}
            </>
          )}
        </div>
        <div
          style={{
            height: columnHeight ? `${columnHeight + 3}px` : "auto",
            maxHeight: columnHeight ? `${columnHeight + 3}px` : "none",
          }}
        >
          <AlertTimelineComponent alert={alert} />
        </div>
      </div>
      <div className="h-6" />
      <div className="w-full flex flex-row">
        <div className="pr-4 w-full">
          <AlertNotesComponent alert={alert} />
        </div>
        <AlertDocumentsComponent alert={alert} />
      </div>
      <div className="h-10" />
    </div>
  );
};

export default AlertsPage;
