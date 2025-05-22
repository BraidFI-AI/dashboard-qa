"use client";

import RadioButton from "@/core/components/Button/RadioButton";
import MyControlledDatePicker from "@/core/components/DateTimePicker/MyControlledDateTimePicker";
import { Moment } from "moment";
import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import { SubmitHandler } from "react-hook-form";
import moment from "moment";
import MyText from "@/core/components/Text/Text";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { useAppDispatch } from "@/redux/store/store";
import {
  fetchSettlementsPaginated,
  fetchTransactionsPaginated,
  performManualMatch,
  setSettlementsPageNumber,
  setSettlementsPaginationPageSize,
  setTransactionsPageNumber,
  setTransactionsPaginationPageSize,
} from "@/redux/slices/recon_exception_review_slice";
import { useSelector } from "react-redux";
import { Transaction } from "@/core/api/ApiTypes";
import {
  pageSizeOptions,
  paginationPageSize,
  PaginationStateType,
} from "@/core/constants";
import MyTable from "@/core/components/Table/MyTable";
import { v4 as uuidv4 } from "uuid";
import toDollarFormat from "@/core/utils/toDollarFormat";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import { useRouter } from "next/navigation";
import { GridEventListener } from "@mui/x-data-grid";
import MyModal from "@/core/components/my_modal";
import { JSONTree } from "react-json-tree";
import MyCheckbox from "@/core/components/Button/MyCheckbox ";
import MyRedButton from "@/core/components/Button/MyRedButton";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import { enqueueSnackbar } from "notistack";
function extractReceiverAccountNumber(content: any) {
  // Using regex to find the pattern receiverAccountNumber=NUMBER
  const regex = /receiverAccountNumber=(\d+)/;
  const match = content.match(regex);

  // If a match is found, return the captured group (the account number)
  if (match && match[1]) {
    return match[1];
  }

  // Return null if no match is found
  return null;
}

const ExceptionReview = () => {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const [transactionType, setTransactionType] = useState<"ACH" | "WIRE">("ACH");
  const [submittingTransactions, setSubmittingTransactions] =
    useState<boolean>(false);
  const [submittingSettlements, setSubmittingSettlements] =
    useState<boolean>(false);

  const [settlementManualMatchSubmitting, setSettlementManualMatchSubmitting] =
    useState<boolean>(false);

  const transactions: "initial" | "loading" | string | Transaction[] =
    useSelector(
      (state: any) => state.reconExceptionReview.transactionsPaginated
    );

  const transactionsPagination: PaginationStateType = useSelector(
    (state: any) => state.reconExceptionReview.transactionsPagination
  );

  const settlements: "initial" | "loading" | string | any[] = useSelector(
    (state: any) => state.reconExceptionReview.settlementsPaginated
  );

  const settlementsPagination: PaginationStateType = useSelector(
    (state: any) => state.reconExceptionReview.settlementsPagination
  );

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedSettlement, setSelectedSettlement] = useState<any>(null);

  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);
  const [selectedSettlementId, setSelectedSettlementId] = useState<
    string | null
  >(null);

  const [manualMatchModalOpen, setManualMatchModalOpen] =
    useState<boolean>(false);

  const handleModalClose = () => setModalOpen(false);
  const handleModalOpen = () => setModalOpen(true);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    setSelectedSettlement(params.row);
    handleModalOpen();
  };

  const {
    formState: { errors },
    control,
    handleSubmit,
    getValues,
  } = useForm<{
    beginDate: Moment;
    endDate: Moment;
  }>();

  const [tableContainerWidth, setTableContainerWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setTableContainerWidth(window.innerWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onSubmit: SubmitHandler<{
    beginDate: Moment;
    endDate: Moment;
  }> = (data: { beginDate: Moment; endDate: Moment }) => {
    console.log("data:", data);
    setSubmittingTransactions(true);
    setSubmittingSettlements(true);
    dispatch(
      fetchTransactionsPaginated({
        beginDate: data.beginDate,
        endDate: data.endDate,
        transactionType: transactionType,
        refresh: true,
      })
    ).then((res: any) => {
      setSubmittingTransactions(false);
    });
    setSelectedTransactionId(null);
    setSelectedSettlementId(null);
    dispatch(
      fetchSettlementsPaginated({
        beginDate: data.beginDate,
        endDate: data.endDate,
        transactionType: transactionType,
        refresh: true,
      })
    ).then((res: any) => {
      setSubmittingSettlements(false);
    });
  };

  const {
    control: manualMatchControl,
    handleSubmit: manualMatchHandleSubmit,
    getValues: manualMatchGetValues,
  } = useForm<{
    note: string;
  }>();
  const manualMatchOnSubmit: SubmitHandler<{ note: string }> = (data: {
    note: string;
  }) => {
    if (selectedTransactionId == null || selectedSettlementId == null) {
      return;
    }

    setSettlementManualMatchSubmitting(true);

    dispatch(
      performManualMatch({
        notes: data.note,
        transactionAuditId: selectedTransactionId,
        settlementFileId: selectedSettlementId,
        settlementFileType: transactionType,
      })
    )
      .then((res: any) => {
        if (typeof res.payload == "string") {
          enqueueSnackbar(res.payload, {
            variant: "error",
            persist: true,
          });
        } else {
          enqueueSnackbar("Manual match performed successfully", {
            variant: "success",
          });
          setManualMatchModalOpen(false);
        }
      })
      .finally(() => {
        setSettlementManualMatchSubmitting(false);
      });
  };

  return (
    <>
      <MyModal
        modalOpen={manualMatchModalOpen}
        handleModalClose={() => setManualMatchModalOpen(false)}
        height="250px"
      >
        <MyText size="lg">Manual Match</MyText>
        <div className="pb-4" />
        <MyText size="sm">Note</MyText>
        <MyControlledTextField
          name="note"
          displayName={"Note"}
          control={manualMatchControl}
          errors={errors}
          rules={{ required: true }}
          value=""
        />
        <div className="pb-4" />
        <div className="w-fit pt-4">
          <MyBlueButton
            onClick={manualMatchHandleSubmit(manualMatchOnSubmit)}
            submitting={settlementManualMatchSubmitting}
          >
            Submit
          </MyBlueButton>
        </div>
      </MyModal>
      <MyModal
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
        height="500px"
      >
        <MyText size="lg">Settlement Details</MyText>
        <JSONTree
          data={selectedSettlement}
          hideRoot
          theme={{
            base00: "#ffffff",
            base01: "#000000",
            base02: "#000000",
            base03: "#000000",
            base04: "#000000",
            base05: "#000000",
            base06: "#000000",
            base07: "#000000",
            base08: "#000000",
            base09: "#000000",
            base0A: "#000000",
            base0B: "#000000",
            base0C: "#000000",
            base0D: "#000000",
            base0E: "#000000",
            base0F: "#000000",
          }}
        />
      </MyModal>
      <div className="w-full">
        <div className="flex flex-row gap-4">
          <div className="w-[300px]">
            <MyText size="sm">Start Date</MyText>
            <MyControlledDatePicker
              name="beginDate"
              displayName="Start Date"
              control={control}
              errors={errors}
              rules={{
                required: true,
                validate: (value: any) => {
                  const dateObject = moment(value.toString());
                  if (dateObject.isValid() == false) {
                    return "Invalid Date";
                  } else {
                    return true;
                  }
                },
              }}
              value=""
            />
          </div>
          <div className="w-[300px]">
            <MyText size="sm">End Date</MyText>
            <MyControlledDatePicker
              name="endDate"
              displayName="End Date"
              control={control}
              errors={errors}
              rules={{
                required: true,
                validate: (value: any) => {
                  const dateObject = moment(value.toString());
                  if (dateObject.isValid() == false) {
                    return "Invalid Date";
                  } else {
                    return true;
                  }
                },
              }}
              value=""
            />
          </div>
          <div className="w-[300px]">
            <MyText size="sm">Transaction Type</MyText>
            <div className="pb-[7px]"></div>
            <RadioButton
              title=""
              value={transactionType}
              setValue={setTransactionType}
              options={["ACH", "WIRE"]}
              layout="horizontal"
            />
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="w-fit pt-4">
            <MyBlueButton
              onClick={handleSubmit(onSubmit)}
              submitting={submittingTransactions || submittingSettlements}
            >
              Search
            </MyBlueButton>
          </div>
          {selectedTransactionId != null && selectedSettlementId != null && (
            <div className="w-fit pt-4">
              <MyRedButton
                onClick={() => {
                  setManualMatchModalOpen(true);
                }}
              >
                Manual Match
              </MyRedButton>
            </div>
          )}
        </div>
        <div className="pb-4" />
        {transactions == "initial" || settlements == "initial" ? (
          <MyText size="sm">Please select dates</MyText>
        ) : transactions == "loading" || settlements == "loading" ? (
          <MyCircularProgressIndicator />
        ) : (
          <div
            style={{ height: "calc(100vh - 230px)" }}
            className="flex flex-row gap-4 w-full"
          >
            <div className="flex flex-col w-full overflow-hidden">
              <MyText size="sm">Transactions</MyText>
              <div className="pb-2" />
              {transactions.length == 0 ? (
                <MyText size="sm">No transactions found</MyText>
              ) : (
                <MyTable
                  sizeOptions={[25, 50, ...pageSizeOptions]}
                  key={`transactions-${tableContainerWidth}`}
                  customId={(row: any) => uuidv4()}
                  handleRowClick={(params: any) => {
                    router.push(
                      `/transactions/transactionHistory/${params.row.paymentId}`
                    );
                  }}
                  handleCellClick={(params: any, event: any) => {
                    if (params.field == "checkbox") {
                      event.stopPropagation();
                    }
                  }}
                  columns={[
                    {
                      field: "checkbox",
                      headerName: "Select Row",
                      width: 60,
                      sortable: false,
                      renderCell: (params: any) => (
                        <MyCheckbox
                          disabled={
                            selectedTransactionId != null &&
                            params.row.paymentId != selectedTransactionId
                          }
                          title=""
                          checked={
                            params.row.paymentId === selectedTransactionId
                          }
                          onChange={(val: any) => {
                            setSelectedTransactionId(
                              val ? params.row.paymentId : null
                            );
                          }}
                        />
                      ),
                    },
                    {
                      field: "amount",
                      headerName: "Amount",
                      flex: 1,
                      minWidth: 120,
                      align: "right",
                      display: "flex",
                      renderCell: (params: any) => (
                        <div>{toDollarFormat(params.row.amount)}</div>
                      ),
                    },
                    {
                      field: "createdAt",
                      headerName: "Created",
                      flex: 1,
                      minWidth: 140,
                      valueFormatter: (params: any) => {
                        return `${moment(params * 1000).year()}-${(
                          moment(params * 1000).month() + 1
                        )
                          .toString()
                          .padStart(2, "0")}-${moment(params * 1000)
                          .date()
                          .toString()
                          .padStart(2, "0")} ${moment(params * 1000)
                          .hour()
                          .toString()
                          .padStart(2, "0")}:${moment(params * 1000)
                          .minute()
                          .toString()
                          .padStart(2, "0")}`;
                      },
                      valueGetter: (value: any, row: any) => row.createdAt,
                    },
                    {
                      field: "senderAccountNumber",
                      headerName: "Sender Account",
                      flex: 1,
                      minWidth: 140,
                      align: "right",
                      display: "flex",
                    },
                    {
                      field: "recipientAccountNumber",
                      headerName: "Receiver Account",
                      flex: 1,
                      minWidth: 140,
                      align: "right",
                      display: "flex",
                    },
                  ]}
                  rows={transactions}
                  sortModel={[{ field: "createdAt", sort: "desc" }]}
                  pagination={{
                    rowCount: transactionsPagination.rowCount,
                    loading: transactionsPagination.loadingPage,
                    paginationModel: {
                      page: transactionsPagination.pageNumber,
                      pageSize:
                        transactionsPagination.pageSize ?? paginationPageSize,
                    },
                    setPaginationModel: (page: number, size: number) => {
                      dispatch(setTransactionsPaginationPageSize(size));
                      dispatch(setTransactionsPageNumber(page));
                      dispatch(
                        fetchTransactionsPaginated({
                          beginDate: getValues("beginDate"),
                          endDate: getValues("endDate"),
                          transactionType: transactionType,
                          refresh: false,
                        })
                      );
                    },
                  }}
                />
              )}
            </div>
            <div className="flex flex-col w-full overflow-hidden">
              <MyText size="sm">Settlements</MyText>
              <div className="pb-2" />
              {settlements.length == 0 ? (
                <MyText size="sm">No settlements found</MyText>
              ) : transactionType == "ACH" ? (
                <MyTable
                  sizeOptions={[25, 50, ...pageSizeOptions]}
                  key={`settlements-${tableContainerWidth}`}
                  customId={(row: any) => uuidv4()}
                  handleRowClick={handleRowClick}
                  handleCellClick={(params: any, event: any) => {
                    if (params.field == "checkboxACH") {
                      event.stopPropagation();
                    }
                  }}
                  columns={[
                    {
                      field: "checkboxACH",
                      headerName: "Select Row",
                      width: 60,
                      sortable: false,
                      renderCell: (params: any) => (
                        <MyCheckbox
                          disabled={
                            selectedSettlementId != null &&
                            params.row.id != selectedSettlementId
                          }
                          title=""
                          checked={params.row.id === selectedSettlementId}
                          onChange={(val: any) => {
                            setSelectedSettlementId(val ? params.row.id : null);
                          }}
                        />
                      ),
                    },
                    {
                      field: "amount",
                      headerName: "Amount",
                      flex: 1,
                      minWidth: 120,
                      align: "right",
                      display: "flex",
                      renderCell: (params: any) => (
                        <div>{toDollarFormat(params.row.amount)}</div>
                      ),
                    },
                    {
                      field: "createdAt",
                      headerName: "Created",
                      flex: 1,
                      minWidth: 140,
                      valueFormatter: (params: any) => {
                        return `${moment(params * 1000).year()}-${(
                          moment(params * 1000).month() + 1
                        )
                          .toString()
                          .padStart(2, "0")}-${moment(params * 1000)
                          .date()
                          .toString()
                          .padStart(2, "0")} ${moment(params * 1000)
                          .hour()
                          .toString()
                          .padStart(2, "0")}:${moment(params * 1000)
                          .minute()
                          .toString()
                          .padStart(2, "0")}`;
                      },
                      valueGetter: (value: any, row: any) => row.createdAt,
                    },
                    {
                      field: "receiverAccountNumber",
                      headerName: "Receiver Account",
                      flex: 1,
                      minWidth: 140,
                      align: "right",
                      display: "flex",
                      renderCell: (params: any) => (
                        <div>
                          {extractReceiverAccountNumber(
                            params.row.originalContent
                          )}
                        </div>
                      ),
                    },
                  ]}
                  rows={settlements}
                  sortModel={[{ field: "createdAt", sort: "desc" }]}
                  pagination={{
                    rowCount: settlementsPagination.rowCount,
                    loading: settlementsPagination.loadingPage,
                    paginationModel: {
                      page: settlementsPagination.pageNumber,
                      pageSize:
                        settlementsPagination.pageSize ?? paginationPageSize,
                    },
                    setPaginationModel: (page: number, size: number) => {
                      dispatch(setSettlementsPaginationPageSize(size));
                      dispatch(setSettlementsPageNumber(page));
                      dispatch(
                        fetchSettlementsPaginated({
                          beginDate: getValues("beginDate"),
                          endDate: getValues("endDate"),
                          transactionType: transactionType,
                          refresh: false,
                        })
                      );
                    },
                  }}
                />
              ) : (
                <MyTable
                  sizeOptions={[25, 50, ...pageSizeOptions]}
                  key={`settlements-${tableContainerWidth}`}
                  customId={(row: any) => uuidv4()}
                  handleRowClick={handleRowClick}
                  handleCellClick={(params: any, event: any) => {
                    if (params.field == "checkboxWIRE") {
                      event.stopPropagation();
                    }
                  }}
                  columns={[
                    {
                      field: "checkboxWIRE",
                      headerName: "Select Row",
                      width: 60,
                      sortable: false,
                      renderCell: (params: any) => (
                        <MyCheckbox
                          disabled={
                            selectedSettlementId != null &&
                            params.row.id != selectedSettlementId
                          }
                          title=""
                          checked={params.row.id === selectedSettlementId}
                          onChange={(val: any) => {
                            setSelectedSettlementId(val ? params.row.id : null);
                          }}
                        />
                      ),
                    },
                    {
                      field: "amount",
                      headerName: "Amount",
                      flex: 1,
                      minWidth: 120,
                      align: "right",
                      display: "flex",
                      renderCell: (params: any) => (
                        <div>{toDollarFormat(params.row.amount)}</div>
                      ),
                    },
                    {
                      field: "createdAt",
                      headerName: "Created",
                      flex: 1,
                      minWidth: 140,
                      valueFormatter: (params: any) => {
                        return `${moment(params * 1000).year()}-${(
                          moment(params * 1000).month() + 1
                        )
                          .toString()
                          .padStart(2, "0")}-${moment(params * 1000)
                          .date()
                          .toString()
                          .padStart(2, "0")} ${moment(params * 1000)
                          .hour()
                          .toString()
                          .padStart(2, "0")}:${moment(params * 1000)
                          .minute()
                          .toString()
                          .padStart(2, "0")}`;
                      },
                      valueGetter: (value: any, row: any) => row.createdAt,
                    },
                    {
                      field: "originatorAccountNumber",
                      headerName: "Sender Account",
                      flex: 1,
                      minWidth: 140,
                      align: "right",
                      display: "flex",
                    },
                    {
                      field: "beneficiaryAccountNumber",
                      headerName: "Receiver Account",
                      flex: 1,
                      minWidth: 140,
                      align: "right",
                      display: "flex",
                    },
                  ]}
                  rows={settlements}
                  sortModel={[{ field: "createdAt", sort: "desc" }]}
                  pagination={{
                    rowCount: settlementsPagination.rowCount,
                    loading: settlementsPagination.loadingPage,
                    paginationModel: {
                      page: settlementsPagination.pageNumber,
                      pageSize:
                        settlementsPagination.pageSize ?? paginationPageSize,
                    },
                    setPaginationModel: (page: number, size: number) => {
                      dispatch(setSettlementsPaginationPageSize(size));
                      dispatch(setSettlementsPageNumber(page));
                      dispatch(
                        fetchSettlementsPaginated({
                          beginDate: getValues("beginDate"),
                          endDate: getValues("endDate"),
                          transactionType: transactionType,
                          refresh: false,
                        })
                      );
                    },
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ExceptionReview;
