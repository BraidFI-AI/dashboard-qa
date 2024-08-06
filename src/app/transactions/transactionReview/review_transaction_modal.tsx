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
  approveTransaction,
  fetchBreachedLimits,
  rejectTransaction,
} from "@/redux/slices/transaction_review_slice";
import { useAppDispatch } from "@/redux/store/store";
import { GridEventListener } from "@mui/x-data-grid";
import { set } from "lodash";
import moment from "moment";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

type ReviewTransactionModalProps = {
  modalOpen: boolean;
  handleModalClose: () => void;
  paymentId: string;
};

const ReviewTransactionModal: React.FC<ReviewTransactionModalProps> = ({
  modalOpen,
  handleModalClose,
  paymentId,
}) => {
  const dispatch = useAppDispatch();

  const [limits, setLimits] = useState<"loading" | string | RulesAndLimits[]>(
    "loading"
  );

  const [submitting, setSubmitting] = useState(false);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {};

  const [transaction, setTransaction] = useState<
    "loading" | string | Transaction
  >("loading");

  useEffect(() => {
    dispatch(fetchTransactionByPaymentId(paymentId)).then((result: any) => {
      setTransaction(result.payload);
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
      height="630px"
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
            </div>
            <div className="w-[250px]">
              {transaction.ach?.customerType != null &&
                transaction.ach.customerName != null &&
                transaction.ach.customerId != null && (
                  <ItemRow
                    boxValues={true}
                    title="Customer"
                    value={{
                      link:
                        transaction.ach?.customerType == "BUSINESS"
                          ? `/businesses/${transaction.ach?.customerId}`
                          : `/individuals/${transaction.ach?.customerId}`,
                      value: transaction.ach?.customerName ?? "",
                    }}
                  />
                )}{" "}
              {transaction.ach?.counterpartyAssociatedEntityType != null &&
                transaction.ach.counterpartyAssociatedEntityId != null &&
                transaction.ach.counterpartyName != null &&
                transaction.ach.counterpartyId != null && (
                  <ItemRow
                    boxValues={true}
                    title="Counterparty"
                    value={{
                      link:
                        transaction.ach?.counterpartyAssociatedEntityType ==
                        "BUSINESS"
                          ? `/businesses/${transaction.ach?.counterpartyAssociatedEntityId}/counterparties`
                          : transaction.ach?.counterpartyAssociatedEntityType ==
                            "INDIVIDUAL"
                          ? `/individuals/${transaction.ach?.counterpartyAssociatedEntityId}/counterparties`
                          : transaction.ach?.counterpartyAssociatedEntityType ==
                            "PRODUCT"
                          ? `/configuration/products/${transaction.ach?.counterpartyAssociatedEntityId}/counterparties`
                          : `/accounts/${transaction.ach?.counterpartyAssociatedEntityId}/counterparties`,
                      value: transaction.ach?.counterpartyName ?? "",
                    }}
                  />
                )}
            </div>
          </div>
        )}
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
                    renderCell: (params: any) => (
                      <div>{toDollarFormat(params.row.amount)}</div>
                    ),
                    valueGetter: (params: any) => params.row.amount,
                  },
                  {
                    field: "createdAt",
                    headerName: "Created At",
                    flex: 1,
                    minWidth: 120,
                    valueFormatter: (params: any) => {
                      return `${timestampToDate(params.value)}`;
                    },
                    valueGetter: (params: any) => params.row.createdAt,
                  },
                ]}
                rows={limits}
              />
            </div>
            <div className="h-6" />
            <div className="flex flex-row justify-end">
              <div className="w-fit">
                <MyRedButton
                  submitting={submitting}
                  onClick={() => {
                    if (paymentId != null) {
                      setSubmitting(true);
                      dispatch(rejectTransaction(paymentId)).then(
                        (rej: any) => {
                          if (typeof rej.payload === "string") {
                            enqueueSnackbar(rej.payload, {
                              variant: "error",
                              persist: true,
                            });
                          } else {
                            enqueueSnackbar(
                              "Transaction rejected successfully",
                              {
                                variant: "success",
                              }
                            );
                          }
                          setSubmitting(false);
                          handleModalClose();
                        }
                      );
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
                      dispatch(approveTransaction(paymentId)).then(
                        (rej: any) => {
                          if (typeof rej.payload === "string") {
                            enqueueSnackbar(rej.payload, {
                              variant: "error",
                              persist: true,
                            });
                          } else {
                            enqueueSnackbar(
                              "Transaction approved successfully",
                              {
                                variant: "success",
                              }
                            );
                          }
                          setSubmitting(false);
                          handleModalClose();
                        }
                      );
                    }
                  }}
                >
                  Approve
                </MyBlueButton>
              </div>
            </div>
            <div className="h-6" />
          </div>
        )}
      </>
    </MyModal>
  );
};

export default ReviewTransactionModal;
