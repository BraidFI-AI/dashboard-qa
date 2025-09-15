"use client";

import LimitDetails from "@/app/compliance/limits/components/limit_details";
import {
  Alert,
  RulesAndLimits,
  Transaction,
  VelocityLimit,
} from "@/core/api/ApiTypes";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import MyTable from "@/core/components/Table/MyTable";
import ItemRow from "@/core/components/Text/ItemRow";
import ItemRowHorizontal from "@/core/components/Text/ItemRowHorizontal";
import MyText from "@/core/components/Text/Text";
import TransactionTableView from "@/core/components/views/transactions/transactions_table_view";
import { boxStyle } from "@/core/constants";
import { timestampToDate } from "@/core/utils/date_time_util";
import toDollarFormat from "@/core/utils/toDollarFormat";
import { fetchBreachedLimitsNew } from "@/redux/slices/transaction_review_slice";
import {
  fetchTransactionByPaymentId,
  fetchTransactions,
} from "@/redux/slices/TransactionSlice";
import { useAppDispatch } from "@/redux/store/store";
import { GridEventListener } from "@mui/x-data-grid";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type EntityTypeTransactionMonitoringComponentProps = {
  alert: Alert;
  paymentId: string;
  alertId: string;
  customActionOnCompletion?: any;
  ofacId: string;
};

const EntityTypeTransactionMonitoringComponent: React.FC<
  EntityTypeTransactionMonitoringComponentProps
> = ({ alert, paymentId, alertId, customActionOnCompletion, ofacId }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [limits, setLimits] = useState<"loading" | string | RulesAndLimits[]>(
    "loading"
  );

  const [submitting, setSubmitting] = useState(false);
  const [selectedLimit, setSelectedLimit] = useState<VelocityLimit | null>(
    null
  );

  const [transaction, setTransaction] = useState<
    "loading" | string | Transaction
  >("loading");

  const [duplicateTransactions, setDuplicateTransactions] = useState<
    null | Transaction[]
  >(null);

  const [sOfacId, setSOfacId] = useState<null | string>(null);

  const [duplicatePaymentId, setDuplicatePaymentId] = useState<null | string>(
    null
  );

  useEffect(() => {
    setSOfacId(ofacId);
    dispatch(fetchTransactionByPaymentId(paymentId)).then((result: any) => {
      setTransaction(result.payload);
      if (ofacId == null || ofacId == "") {
        if (result.payload != null) {
          setSOfacId(result.payload?.ofacId);
          setDuplicatePaymentId(result.payload?.duplicateOfPaymentId);
          if (result.payload?.duplicateOfPaymentId != null) {
            dispatch(
              fetchTransactions({
                criteria: {
                  paymentId:
                    result.payload?.duplicateOfPaymentId?.toString() ?? "",
                },
                refresh: true,
              })
            ).then((result: any) => {
              setDuplicateTransactions(result.payload.transactions);
            });
          }
        }
      }
    });
  }, [dispatch, paymentId]);

  useEffect(() => {
    if (!paymentId) {
      setLimits("No payment ID found");
    } else {
      dispatch(fetchBreachedLimitsNew(paymentId ?? "")).then((result: any) => {
        setLimits(result.payload);
      });
    }
  }, [dispatch, paymentId]);

  return (
    <div
      className={`flex flex-col min-w-[700px] h-full rounded-[10px] justify-center items-start ${boxStyle}`}
    >
      <div className="pb-6 w-full px-6">
        <div
          className="pt-6 pb-3 cursor-pointer"
          onClick={() => {
            if (transaction != null) {
              router.push(
                `/transactions/transactionHistory/${alert.contextId}`
              );
            }
          }}
        >
          <MyText variant="label" size="lg" weight="semibold" primary>
            {alert.contextId}
          </MyText>
        </div>
        <>
          <div className="h-1" />
          {transaction === "loading" ? (
            <MyCircularProgressIndicator />
          ) : typeof transaction === "string" ? (
            <ErrorPage
              error={transaction}
              recoveryButtonOnClick={() => {
                setTransaction("loading");
                dispatch(fetchTransactionByPaymentId(paymentId)).then(
                  (result: any) => {
                    setTransaction(result.payload);
                  }
                );
              }}
              recoveryButtonTitle="Retry"
            />
          ) : (
            <>
              <div className="flex flex-row justify-between">
                <div className="w-[300px]">
                  <ItemRow
                    horizontal={true}
                    title="Transaction Type"
                    value={transaction.transactionType ?? ""}
                  />
                  <ItemRow
                    horizontal={true}
                    title="Created"
                    value={`${moment(
                      (transaction as any).createdAt * 1000
                    ).year()}-${(
                      moment((transaction as any).createdAt * 1000).month() + 1
                    )
                      .toString()
                      .padStart(2, "0")}-${moment(
                      (transaction as any).createdAt * 1000
                    )
                      .date()
                      .toString()
                      .padStart(2, "0")} ${moment(
                      (transaction as any).createdAt * 1000
                    )
                      .hour()
                      .toString()
                      .padStart(2, "0")}:${moment(
                      (transaction as any).createdAt * 1000
                    )
                      .minute()
                      .toString()
                      .padStart(2, "0")}`}
                  />
                  {sOfacId != null && (
                    <>
                      <ItemRowHorizontal
                        title="OFAC ID"
                        link={`/compliance/ofac/${sOfacId}`}
                        value={sOfacId?.toString() ?? ""}
                      />
                      <div className="h-3" />
                    </>
                  )}
                  {transaction?.customerType != null &&
                    transaction.customerName != null &&
                    transaction.customerId != null && (
                      <>
                        <ItemRowHorizontal
                          title="Customer"
                          link={
                            transaction?.customerType == "BUSINESS"
                              ? `/businesses/${transaction?.customerId}`
                              : `/individuals/${transaction?.customerId}`
                          }
                          value={transaction?.customerName ?? ""}
                        />
                        <div className="h-3" />
                      </>
                    )}
                </div>
                <div className="w-[300px]">
                  <ItemRowHorizontal
                    title="Account Number"
                    link={`/accounts/${transaction.accountNumber}`}
                    value={transaction.accountNumber ?? ""}
                  />
                  <div className="h-3" />
                  <ItemRow
                    horizontal={true}
                    title="Amount"
                    value={toDollarFormat(transaction.amount)}
                  />
                  <div className="h-3" />
                  {duplicatePaymentId != null && (
                    <>
                      <ItemRowHorizontal
                        title="Duplicate Payment ID"
                        link={`/transactions/transactionHistory?paymentId=${duplicatePaymentId}`}
                        value={duplicatePaymentId ?? ""}
                      />
                      <div className="h-3" />
                    </>
                  )}
                  {transaction?.counterpartyAssociatedEntityType != null &&
                    transaction.counterpartyAssociatedEntityId != null &&
                    transaction.counterpartyName != null &&
                    transaction.counterpartyId != null && (
                      <>
                        <ItemRowHorizontal
                          title="Counterparty"
                          link={
                            transaction?.counterpartyAssociatedEntityType ==
                            "BUSINESS"
                              ? `/businesses/${transaction?.counterpartyAssociatedEntityId}/counterparties`
                              : transaction?.counterpartyAssociatedEntityType ==
                                "INDIVIDUAL"
                              ? `/individuals/${transaction?.counterpartyAssociatedEntityId}/counterparties`
                              : transaction?.counterpartyAssociatedEntityType ==
                                "PRODUCT"
                              ? `/configuration/products/${transaction?.counterpartyAssociatedEntityId}/counterparties`
                              : `/accounts/${transaction?.counterpartyAssociatedEntityId}/counterparties`
                          }
                          value={transaction?.counterpartyName ?? ""}
                        />
                        <div className="h-3" />
                      </>
                    )}
                </div>
              </div>
            </>
          )}
          {duplicatePaymentId == null || duplicatePaymentId == "" ? (
            <>
              <div className="h-1" />
              {limits === "loading" ? (
                <MyCircularProgressIndicator />
              ) : typeof limits === "string" ? (
                <ErrorPage
                  error={limits}
                  recoveryButtonOnClick={() => {
                    if (!paymentId) {
                      setLimits("No payment ID found");
                    } else {
                      setLimits("loading");
                      dispatch(fetchBreachedLimitsNew(paymentId ?? "")).then(
                        (result: any) => {
                          setLimits(result.payload);
                        }
                      );
                    }
                  }}
                  recoveryButtonTitle="Retry"
                />
              ) : (
                <div>
                  {selectedLimit && (
                    <LimitDetails
                      limit={selectedLimit}
                      modalOpen={selectedLimit != null}
                      handleModalClose={() => {
                        setSelectedLimit(null);
                      }}
                      filters={{}}
                    />
                  )}
                  <MyText size="md">Breached Limits</MyText>
                  <div className="h-[270px]">
                    <MyTable
                      hideColumnsButton
                      hideDensityButton
                      hideFilterButton
                      hideSearch
                      handleRowClick={(params: any) => {
                        setSelectedLimit(
                          params.row?.velocityLimit as VelocityLimit
                        );
                      }}
                      columns={[
                        { field: "id", headerName: "ID", width: 80 },
                        {
                          field: "limitName",
                          headerName: "Limit Name",
                          flex: 1,
                          minWidth: 140,
                          valueFormatter: (params: any, row: any) => {
                            console.log("va name", params, row);
                            return (row as any)?.velocityLimit?.limitName;
                          },
                          valueGetter: (value: any, row: any) =>
                            (row as any)?.velocityLimit?.limitName,
                        },
                        {
                          field: "result",
                          headerName: "Result",
                          flex: 1,
                          minWidth: 100,
                        },
                        {
                          field: "value",
                          headerName: "Value",
                          flex: 1,
                          minWidth: 80,
                        },
                        {
                          field: "message",
                          headerName: "Message",
                          flex: 1,
                          minWidth: 120,
                        },
                      ]}
                      rows={limits}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="h-[350px] w-full">
              <TransactionTableView
                transactions={duplicateTransactions ?? []}
              />
            </div>
          )}
          <div className="h-2" />
        </>
      </div>
    </div>
  );
};

export default EntityTypeTransactionMonitoringComponent;
