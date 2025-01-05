import { Transaction, TransactionSearch } from "@/core/api/ApiTypes";
import MyTable from "@/core/components/Table/MyTable";
import { GridCellParams, MuiEvent } from "@mui/x-data-grid";
import React, { useState } from "react";
import MyLinkText from "@/core/components/Text/LinkText";
import toDollarFormat from "@/core/utils/toDollarFormat";
import moment from "moment";
import {
  PaginationStateType,
  pageSizeOptions,
  paginationPageSize,
  wireReturnCodes,
} from "@/core/constants";
import { useAppDispatch } from "@/redux/store/store";
import { useSelector } from "react-redux";
import {
  fetchTransactions,
  returnAchTransaction,
  returnWireTransaction,
  setPaginationPageNumber,
  setPaginationPageSize,
} from "@/redux/slices/TransactionSlice";
import { useRouter } from "next/navigation";
import MyText from "../../Text/Text";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MyModal from "../../my_modal";
import ItemRow from "../../Text/ItemRow";
import timestampToDate from "@/core/utils/timestampToDate";
import LabelBox from "../../label_box";
import { enumTextToReadableText } from "@/core/utils/formatting_util";
import MyRedButton from "../../Button/MyRedButton";
import MyControlledAutocomplete from "../../Autocomplete/MyControlledAutocomplete";
import { SubmitHandler, useForm } from "react-hook-form";
import MyTextButton from "../../Button/MyTextButton";
import MyBlueButton from "../../Button/MyBlueButton";
import MyCircularProgressIndicator from "../../circular_progress_indicator";
import ErrorPage from "../../error_page";
import { fetchAchReturnCodes } from "@/redux/slices/AppSlice";
import { enqueueSnackbar } from "notistack";

type TransactionTableViewProps = {
  transactions: Transaction[];
  expandTable?: boolean;
  toggleExpandTable?: any;
  filters?: TransactionSearch | null;
};

const TransactionTableView: React.FC<TransactionTableViewProps> = ({
  transactions,
  expandTable,
  toggleExpandTable,
  filters,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pagination: PaginationStateType = useSelector(
    (state: any) => state.transaction.pagination
  );

  const achReturnCodes: "loading" | string | string[] = useSelector(
    (state: any) => state.app.achReturnCodes
  );

  const [returningTransaction, setReturningTransaction] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(
    null
  );
  const handleModalClose = () => {
    setModalOpen(false);
    setReturningTransaction(false);
  };

  const navigateToEntity = async (row: any) => {
    if (
      row == null ||
      row.counterpartyId == null ||
      row.counterpartyAssociatedEntityType == null ||
      row.counterpartyAssociatedEntityId == null
    ) {
      return;
    }

    const association =
      row.counterpartyAssociatedEntityType == "BUSINESS"
        ? "businesses"
        : row.counterpartyAssociatedEntityType == "INVIDIDUAL"
        ? "individuals"
        : row.counterpartyAssociatedEntityType == "ACCOUNT"
        ? "accounts"
        : "configuration/products";

    const link = `/${association}/${row.counterpartyAssociatedEntityId}/counterparties/${row.counterpartyId}`;

    router.push(link);
  };

  const showTransactionDetails = (transaction: any | null) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };
  const formatTitle = (key: any) => {
    return (
      key
        ?.split(/(?=[A-Z])/)
        ?.map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
        ?.join(" ") ?? ""
    );
  };

  const renderObject = (obj: any, prefix: string = ""): any => {
    return Object.entries(obj).flatMap(([key, value]): any => {
      const fullKey = prefix ? `${prefix} ${key}` : key;
      if (typeof value === "object" && value !== null) {
        if (Array.isArray(value)) {
          if (value.every((item) => typeof item === "number" && !isNaN(item))) {
            return (
              <ItemRow
                title={formatTitle(fullKey.replaceAll("_", " "))}
                value={value.join("-")}
              />
            );
          } else if (value.every((item) => typeof item === "string")) {
            return (
              <ItemRow
                title={formatTitle(fullKey.replaceAll("_", " "))}
                value={value.join(", ")}
              />
            );
          }
        }
        return renderObject(value, fullKey);
      }
      return fullKey == "linkedPaymentId" ? (
        <>
          <MyText size="table">Linked Payment ID</MyText>
          <MyLinkText
            link={`/transactions/transactionHistory?paymentId=${value}`}
          >
            {value as any}
          </MyLinkText>
          <div className="pb-4" />
        </>
      ) : (
        <ItemRow
          title={formatTitle(fullKey.replaceAll("_", " "))}
          value={
            fullKey.includes("At") || fullKey.toLowerCase().includes("Date")
              ? timestampToDate(value as any, false, true)
              : fullKey.toLowerCase().includes("amount")
              ? toDollarFormat(value as any)
              : (value as any)
          }
        />
      );
    });
  };

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    getValues,
    handleSubmit,
    reset,
  } = useForm<{
    returnCode: string;
  }>();
  const onSubmit: SubmitHandler<{
    returnCode: string;
  }> = (data: { returnCode: string }) => {
    console.log("data:", data);
    setSubmitting(true);

    if (selectedTransaction.ach != null) {
      dispatch(
        returnAchTransaction({
          paymentId: selectedTransaction.paymentId,
          returnCode: data.returnCode,
        })
      ).then((d: any) => {
        setSubmitting(false);
        if (typeof d.payload == "string") {
          enqueueSnackbar(d.payload, { variant: "error", persist: true });
        } else {
          enqueueSnackbar("Transaction returned successfully", {
            variant: "success",
          });

          setReturningTransaction(false);
          setModalOpen(false);
        }
      });
    } else if (selectedTransaction.wire != null) {
      dispatch(
        returnWireTransaction({
          paymentId: selectedTransaction.paymentId,
          returnCode: data.returnCode,
        })
      ).then((d: any) => {
        setSubmitting(false);
        if (typeof d.payload == "string") {
          enqueueSnackbar(d.payload, { variant: "error", persist: true });
        } else {
          enqueueSnackbar("Transaction returned successfully", {
            variant: "success",
          });

          setReturningTransaction(false);
          setModalOpen(false);
        }
      });
    }
  };

  return (
    <>
      {selectedTransaction != null && modalOpen && (
        <MyModal
          modalOpen={modalOpen}
          handleModalClose={handleModalClose}
          height={returningTransaction == true ? "250px" : "500px"}
        >
          <div className="flex flex-row justify-between">
            <MyText size="lg">Transaction Details</MyText>
            {(selectedTransaction.ach != null ||
              selectedTransaction.wire != null) &&
            !returningTransaction ? (
              <div className="w-fit">
                <MyRedButton
                  onClick={() => {
                    setReturningTransaction(true);
                  }}
                >
                  Return Transaction
                </MyRedButton>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="pb-3" />
          {returningTransaction ? (
            <div className="h-[140px] flex flex-col justify-between">
              <div>
                {selectedTransaction.ach != null &&
                typeof achReturnCodes == "string" ? (
                  achReturnCodes == "loading" ? (
                    <MyCircularProgressIndicator />
                  ) : (
                    <ErrorPage
                      error={achReturnCodes}
                      recoveryButtonTitle="Retry"
                      recoveryButtonOnClick={() => {
                        dispatch(fetchAchReturnCodes());
                      }}
                    />
                  )
                ) : (
                  <>
                    <MyText>Return Code</MyText>
                    <MyControlledAutocomplete
                      name="returnCode"
                      displayName="Return Code"
                      control={control}
                      errors={control}
                      clearable={false}
                      rules={
                        submitting
                          ? { required: false }
                          : {
                              required: false,
                            }
                      }
                      value={
                        selectedTransaction.ach != null
                          ? achReturnCodes?.[0] ?? ""
                          : selectedTransaction.wire != null
                          ? wireReturnCodes[0]
                          : ""
                      }
                      options={
                        selectedTransaction.ach != null
                          ? achReturnCodes
                          : selectedTransaction.wire != null
                          ? wireReturnCodes
                          : []
                      }
                    />
                    <div className="h-3" />
                  </>
                )}
              </div>
              <div className="flex flex-row">
                <div className="w-fit pr-2">
                  <MyTextButton
                    onClick={() => {
                      setReturningTransaction(false);
                    }}
                  >
                    Cancel
                  </MyTextButton>
                </div>
                <div className="w-fit">
                  <MyBlueButton
                    onClick={() => {
                      handleSubmit(onSubmit)();
                    }}
                  >
                    Return Transaction
                  </MyBlueButton>
                </div>
              </div>
            </div>
          ) : (
            renderObject(selectedTransaction)
          )}
        </MyModal>
      )}
      <MyTable
        sizeOptions={pageSizeOptions}
        pagination={{
          rowCount: pagination.rowCount,
          loading: pagination.loadingPage,
          paginationModel: {
            page: pagination.pageNumber,
            pageSize: pagination.pageSize ?? paginationPageSize,
          },
          setPaginationModel: (page: number, size: number) => {
            dispatch(setPaginationPageSize(size));
            dispatch(setPaginationPageNumber(page));
            dispatch(
              fetchTransactions({
                criteria: { ...filters },
              })
            );
          },
        }}
        exp={true}
        expand={expandTable ?? undefined}
        toggleExpand={
          toggleExpandTable
            ? () => {
                toggleExpandTable(expandTable ? false : true);
              }
            : undefined
        }
        customId={(row: Transaction) => row.customUUID}
        handleRowClick={(params: any) => {
          setSelectedTransaction(params.row);
          setModalOpen(true);
        }}
        handleCellClick={(
          params: GridCellParams,
          event: MuiEvent<React.MouseEvent>
        ) => {
          if (params.field == "counterpartyId" && params.field != null) {
            navigateToEntity(params.row);
            event.stopPropagation();
          }
          if (params.field == "customerId") {
            event.stopPropagation();
          }
        }}
        columnVisibilityModel={{
          paymentId: false,
        }}
        columns={[
          {
            field: "paymentId",
            headerName: "Payment ID",
            flex: 1,
            minWidth: 160,
            hide: true,
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
            field: "accountNumber",
            headerName: "Account Number",
            flex: 1,
            minWidth: 200,
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
            field: "customerId",
            headerName: "Customer",
            flex: 1,
            minWidth: 200,
            display: "flex",
            renderCell: (params: any) => (
              <MyLinkText
                textProps={{ size: "table" }}
                link={
                  params.row.customerType != null &&
                  params.row.customerType == "BUSINESS"
                    ? `/businesses/${params.row?.customerId}`
                    : `/individuals/${params.row?.customerId}`
                }
              >
                {params.row?.customerName}
              </MyLinkText>
            ),
            valueGetter: (value: any, row: any) => row?.customerName,
          },
          {
            field: "counterpartyId",
            headerName: "Counterparty",
            flex: 1,
            minWidth: 200,
            display: "flex",
            renderCell: (params: any) => (
              <MyText primary={true} underline={true} size="table">
                {params.row?.counterpartyName}
              </MyText>
            ),
            valueGetter: (value: any, row: any) => row?.counterpartyName,
          },
          {
            field: "description",
            headerName: "Description",
            flex: 1,
            minWidth: 200,
          },
          {
            field: "transactionType",
            headerName: "Transaction Type",
            flex: 1,
            minWidth: 250,
            display: "flex",
            renderCell: (params: any) => (
              <LabelBox color="gray" border>
                {enumTextToReadableText(params.row?.transactionType)}
              </LabelBox>
            ),
            valueGetter: (value: any, row: any) => row?.transactionType,
          },
          {
            field: "details",
            headerName: "Details",
            flex: 1,
            minWidth: 100,
            display: "flex",
            renderCell: (params: any) => (
              <InfoOutlinedIcon
                className={"text-[#12A7FF]"}
                onClick={() => {
                  showTransactionDetails(params.row);
                }}
              />
            ),
            valueGetter: (value: any, row: any) =>
              row?.ach ?? row?.wire ?? row ?? "",
          },
          {
            field: "status",
            headerName: "Status",
            flex: 1,
            minWidth: 140,
            display: "flex",
            renderCell: (params: any) => (
              <LabelBox
                color={
                  params.row?.status == "POSTED"
                    ? "green"
                    : params.row?.status == "PENDING"
                    ? "orange"
                    : "gray"
                }
                fill
              >
                {enumTextToReadableText(params.row?.status)}
              </LabelBox>
            ),
            valueGetter: (value: any, row: any) => row?.status,
          },
          {
            field: "updatedAt",
            headerName: "Updated",
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
            valueGetter: (value: any, row: any) => row.updatedAt,
          },
        ]}
        rows={transactions}
        sortModel={[{ field: "createdAt", sort: "desc" }]}
      />
    </>
  );
};

export default TransactionTableView;
