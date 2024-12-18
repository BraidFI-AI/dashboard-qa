"use client";

import { ACH, RulesAndLimits, Transaction } from "@/core/api/ApiTypes";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyRedButton from "@/core/components/Button/MyRedButton";
import MyTextButton from "@/core/components/Button/MyTextButton";
import MyTable from "@/core/components/Table/MyTable";
import ItemRow from "@/core/components/Text/ItemRow";
import MyText from "@/core/components/Text/Text";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import MyModal from "@/core/components/my_modal";
import timestampToDate from "@/core/utils/timestampToDate";
import toDollarFormat from "@/core/utils/toDollarFormat";
import { fetchTransactionByPaymentId } from "@/redux/slices/TransactionSlice";
import {
  updateTransactionStatus,
  fetchBreachedLimits,
} from "@/redux/slices/transaction_review_slice";
import { useAppDispatch } from "@/redux/store/store";
import { GridEventListener } from "@mui/x-data-grid";
import { set } from "lodash";
import moment from "moment";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type ReviewTransactionModalProps = {
  modalOpen: boolean;
  handleModalClose: () => void;
  paymentId: string;
  alertId: string;
  customActionOnCompletion?: any;
  ofacId: string;
};

const ReviewTransactionModal: React.FC<ReviewTransactionModalProps> = ({
  modalOpen,
  handleModalClose,
  paymentId,
  alertId,
  customActionOnCompletion,
  ofacId,
}) => {
  console.log("ofacId", ofacId);

  const dispatch = useAppDispatch();

  const [limits, setLimits] = useState<"loading" | string | RulesAndLimits[]>(
    "loading"
  );

  const [submitting, setSubmitting] = useState(false);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {};

  const [transaction, setTransaction] = useState<
    "loading" | string | Transaction
  >("loading");

  const userType = useSelector((state: any) => state.app.userType);
  const username = useSelector((state: any) => state.app.username);

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
        }
      }
    });
  }, [dispatch, paymentId]);

  useEffect(() => {
    if (!paymentId) {
      setLimits("No payment ID found");
    } else {
      dispatch(fetchBreachedLimits(paymentId ?? "")).then((result: any) => {
        setLimits(result.payload);
      });
    }
  }, [dispatch, paymentId]);
  return (
    <MyModal
      width="800px"
      height={duplicatePaymentId != null ? "400px" : "630px"}
      modalOpen={modalOpen}
      handleModalClose={handleModalClose}
    >
      <>
        <MyText size="lg">Review Transaction</MyText>
        <div className="h-4" />
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
                  boxValues={true}
                  title="Transaction Type"
                  value={transaction.transactionType ?? ""}
                />
                <ItemRow
                  boxValues={true}
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
                  <ItemRow
                    boxValues={true}
                    title="OFAC ID"
                    value={{
                      link: `/compliance/ofac/${sOfacId}`,
                      value: sOfacId ?? "",
                    }}
                  />
                )}
              </div>
              <div className="w-[250px]">
                <ItemRow
                  boxValues={true}
                  title="Account Number"
                  value={{
                    link: `/accounts/${transaction.accountNumber}`,
                    value: transaction.accountNumber,
                  }}
                />
                <ItemRow
                  boxValues={true}
                  title="Amount"
                  value={toDollarFormat(transaction.amount)}
                />
                {duplicatePaymentId != null && (
                  <ItemRow
                    boxValues={true}
                    title="Duplicate Payment ID"
                    value={{
                      link: `/transactions/transactionHistory?paymentId=${duplicatePaymentId}`,
                      value: duplicatePaymentId ?? "",
                    }}
                  />
                )}
              </div>
              <div className="w-[250px]">
                {transaction?.customerType != null &&
                  transaction.customerName != null &&
                  transaction.customerId != null && (
                    <ItemRow
                      boxValues={true}
                      title="Customer"
                      value={{
                        link:
                          transaction?.customerType == "BUSINESS"
                            ? `/businesses/${transaction?.customerId}`
                            : `/individuals/${transaction?.customerId}`,
                        value: transaction?.customerName ?? "",
                      }}
                    />
                  )}{" "}
                {transaction?.counterpartyAssociatedEntityType != null &&
                  transaction.counterpartyAssociatedEntityId != null &&
                  transaction.counterpartyName != null &&
                  transaction.counterpartyId != null && (
                    <ItemRow
                      boxValues={true}
                      title="Counterparty"
                      value={{
                        link:
                          transaction?.counterpartyAssociatedEntityType ==
                          "BUSINESS"
                            ? `/businesses/${transaction?.counterpartyAssociatedEntityId}/counterparties`
                            : transaction?.counterpartyAssociatedEntityType ==
                              "INDIVIDUAL"
                            ? `/individuals/${transaction?.counterpartyAssociatedEntityId}/counterparties`
                            : transaction?.counterpartyAssociatedEntityType ==
                              "PRODUCT"
                            ? `/configuration/products/${transaction?.counterpartyAssociatedEntityId}/counterparties`
                            : `/accounts/${transaction?.counterpartyAssociatedEntityId}/counterparties`,
                        value: transaction?.counterpartyName ?? "",
                      }}
                    />
                  )}
              </div>
            </div>
          </>
        )}
        {(duplicatePaymentId == null || duplicatePaymentId == "") && (
          <>
            <MyText size="md">Breached Limits</MyText>
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
                    dispatch(fetchBreachedLimits(paymentId ?? "")).then(
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
                <div className="h-[270px]">
                  <MyTable
                    hideColumnsButton
                    hideDensityButton
                    hideFilterButton
                    hideSearch
                    handleRowClick={handleRowClick}
                    columns={[
                      { field: "id", headerName: "ID", width: 80 },
                      {
                        field: "limitName",
                        headerName: "Limit Name",
                        flex: 1,
                        minWidth: 120,
                      },
                      {
                        field: "transactionType",
                        headerName: "Transaction Type",
                        flex: 1,
                        minWidth: 180,
                      },
                      {
                        field: "limitType",
                        headerName: "Limit Type",
                        flex: 1,
                        minWidth: 180,
                      },
                      {
                        field: "status",
                        headerName: "Status",
                        flex: 1,
                        minWidth: 120,
                      },
                      {
                        field: "amount",
                        headerName: "Amount",
                        flex: 1,
                        minWidth: 120,
                        display: "flex",
                        renderCell: (params: any) => (
                          <div>{toDollarFormat(params.row.amount)}</div>
                        ),
                        valueGetter: (value: any, row: any) => row.amount,
                      },
                      {
                        field: "createdAt",
                        headerName: "Created At",
                        flex: 1,
                        minWidth: 120,
                        valueFormatter: (params: any) => {
                          return `${timestampToDate(params)}`;
                        },
                        valueGetter: (value: any, row: any) => row.createdAt,
                      },
                    ]}
                    rows={limits}
                  />
                </div>
              </div>
            )}
          </>
        )}
        <div className="h-6" />
        <div className="flex flex-row justify-end">
          <div className="w-fit">
            <MyRedButton
              submitting={submitting}
              onClick={() => {
                if (alertId != null) {
                  setSubmitting(true);
                  dispatch(
                    updateTransactionStatus({
                      alertId: alertId,
                      action: "DECLINE",
                      note: `Transaction rejected by ${userType} ${username}`,
                    })
                  ).then((rej: any) => {
                    if (typeof rej.payload === "string") {
                      enqueueSnackbar(rej.payload, {
                        variant: "error",
                        persist: true,
                      });
                    } else {
                      enqueueSnackbar("Transaction rejected successfully", {
                        variant: "success",
                      });

                      if (customActionOnCompletion) {
                        customActionOnCompletion();
                      }
                    }
                    setSubmitting(false);
                    handleModalClose();
                  });
                }
              }}
            >
              Reject
            </MyRedButton>
          </div>
          <div className="w-4" />
          <div className="w-fit">
            <MyBlueButton
              submitting={submitting}
              onClick={() => {
                if (paymentId) {
                  setSubmitting(true);
                  dispatch(
                    updateTransactionStatus({
                      alertId: alertId,
                      action: "APPROVE",
                      note: `Transaction approved by ${userType} ${username}`,
                    })
                  ).then((rej: any) => {
                    if (typeof rej.payload === "string") {
                      enqueueSnackbar(rej.payload, {
                        variant: "error",
                        persist: true,
                      });
                    } else {
                      enqueueSnackbar("Transaction approved successfully", {
                        variant: "success",
                      });

                      if (customActionOnCompletion) {
                        customActionOnCompletion();
                      }
                    }
                    setSubmitting(false);
                    handleModalClose();
                  });
                }
              }}
            >
              Approve
            </MyBlueButton>
          </div>
        </div>
        <div className="h-6" />
      </>
    </MyModal>
  );
};

export default ReviewTransactionModal;
