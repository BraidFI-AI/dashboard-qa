"use client";

import { ACH, Transaction } from "@/core/api/ApiTypes";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyTable from "@/core/components/Table/MyTable";
import MyLinkText from "@/core/components/Text/LinkText";
import { timestampToDate } from "@/core/utils/date_time_util";
import toDollarFormat from "@/core/utils/toDollarFormat";
import { GridCellParams, GridEventListener, MuiEvent } from "@mui/x-data-grid";
import moment from "moment";
import { useEffect, useState } from "react";
import ACHModelView from "@/core/components/views/ach/ach_modal_view";
import { fetchCounterParty } from "@/redux/slices/CounterpartySlice";
import linkToCounterparty from "@/core/utils/link_to_counterparty";
import MyText from "@/core/components/Text/Text";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/redux/store/store";
import ReviewTransactionModal from "./review_transaction_modal";
import { useSelector } from "react-redux";
import { PaginationStateType, paginationPageSize } from "@/core/constants";
import {
  fetchToReviewACHTransactions,
  setPaginationPageNumber,
} from "@/redux/slices/transaction_review_slice";

type TransactionReviewTableProps = {};

const TransactionReviewTable: React.FC<TransactionReviewTableProps> = ({}) => {
  const router = useRouter();
  const qParams = useSearchParams();

  const dispatch = useAppDispatch();

  const transactions = useSelector(
    (state: any) => state.transactionReview.transactions
  );

  const pagination: PaginationStateType = useSelector(
    (state: any) => state.transactionReview.pagination
  );

  const [filters, setFilters] = useState<{
    wireFileHandle?: string;
  }>({});

  const [navigating, setNavigating] = useState(false);

  const [selectedTransaction, setSelectedTransaction] = useState<ACH | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleReviewModalOpen = () => setReviewModalOpen(true);
  const handleReviewModalClose = () => setReviewModalOpen(false);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    if (transactions) {
      transactions.forEach((row: any) => {
        if (row.id == params.id) {
          setSelectedTransaction(row);
        }
      });

      handleModalOpen();
    }
  };

  useEffect(() => {
    const params: { [anyProp: string]: string | string[] } = {};

    qParams.forEach((value, key) => {
      if (value.includes(",")) {
        params[key] = value.split(",");
      } else {
        params[key] = value;
      }
    });

    setFilters(
      params as {
        wireFileHandle?: string;
      }
    );
  }, [qParams]);

  return (
    <div className="h-full">
      {modalOpen && selectedTransaction != null && (
        <ACHModelView
          ach={selectedTransaction}
          modalOpen={modalOpen}
          handleModalClose={handleModalClose}
        />
      )}
      {reviewModalOpen && selectedTransaction != null && (
        <ReviewTransactionModal
          paymentId={selectedTransaction.paymentId ?? ""}
          alertId={(selectedTransaction as any).alertId ?? ""}
          modalOpen={reviewModalOpen}
          handleModalClose={handleReviewModalClose}
          ofacId={(selectedTransaction as any).ofacId ?? ""}
        />
      )}
      <MyTable
        pagination={{
          rowCount: pagination.rowCount,
          loading: pagination.loadingPage,
          paginationModel: {
            page: pagination.pageNumber,
            pageSize: paginationPageSize,
          },
          setPaginationModel: (page: number) => {
            dispatch(setPaginationPageNumber(page));
            dispatch(fetchToReviewACHTransactions({ filter: filters }));
          },
        }}
        handleCellClick={(
          params: GridCellParams,
          event: MuiEvent<React.MouseEvent>
        ) => {
          if (
            params.field == "counterpartyName" ||
            params.field == "accountNumber" ||
            params.field == "customerName" ||
            params.field == "productId" ||
            params.field == "review"
          ) {
            event.stopPropagation();
          }
        }}
        handleRowClick={(params: any) => {
          router.push(
            `/transactions/transactionHistory/${params.row.paymentId}`
          );
        }}
        customId={(params: any) => params.paymentId}
        columns={[
          {
            field: "paymentId",
            headerName: "Payment ID",
            flex: 1,
            minWidth: 180,
          },
          {
            field: "createdAt",
            headerName: "Created at",
            flex: 1,
            minWidth: 130,
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
            field: "productId",
            headerName: "Product ID",
            flex: 1,
            minWidth: 120,
            display: "flex",
            renderCell: (params: any) => (
              <MyLinkText
                link={`/configuration/products/${params.row.productId}`}
              >
                {params.row.productId}
              </MyLinkText>
            ),
            valueGetter: (value: any, row: any) => row.productId,
          },
          {
            field: "customerName",
            headerName: "Customer",
            flex: 1,
            minWidth: 180,
            display: "flex",
            renderCell: (params: any) => (
              <MyLinkText link={`/businesses/${params.row.customerId}`}>
                {params.row.customerName}
              </MyLinkText>
            ),
            valueGetter: (value: any, row: any) => row.customerName,
          },
          {
            field: "counterpartyName",
            headerName: "Counterparty",
            flex: 1,
            minWidth: 180,
            display: "flex",
            renderCell: (params: any) => (
              <div
                onClick={() => {
                  setNavigating(true);
                  dispatch(fetchCounterParty(params.row.counterpartyId)).then(
                    (cp: any) => {
                      if (cp.payload) {
                        const link = linkToCounterparty(cp.payload);
                        if (link) {
                          router.push(link);
                        }
                      }
                      setNavigating(false);
                    }
                  );
                }}
              >
                <MyText primary={true} underline={true} size="md">
                  {params.row.counterpartyName}
                </MyText>
              </div>
            ),
            valueGetter: (value: any, row: any) => row.counterpartyName,
          },
          {
            field: "accountNumber",
            headerName: "Account number",
            flex: 1,
            minWidth: 140,
            display: "flex",
            renderCell: (params: any) => (
              <MyLinkText link={`/accounts/${params.row.accountNumber}`}>
                {params.row.accountNumber}
              </MyLinkText>
            ),
            valueGetter: (value: any, row: any) => row.accountNumber,
          },
          {
            field: "amount",
            headerName: "Amount",
            flex: 1,
            minWidth: 150,
            display: "flex",
            renderCell: (params: any) => (
              <div>{toDollarFormat(params.row.amount)}</div>
            ),
            valueGetter: (value: any, row: any) => row.amount,
          },
          {
            field: "transactionType",
            headerName: "Transaction Type",
            width: 120,
          },
          // {
          //   field: "review",
          //   headerName: "Review",
          //   flex: 1,
          //   minWidth: 150,
          //   renderCell: (params: any) => (
          //     <div className="flex items-center justify-center">
          //       <MyBlueButton
          //         onClick={() => {
          //           setSelectedTransaction(params.row);
          //           handleReviewModalOpen();
          //         }}
          //       >
          //         Review
          //       </MyBlueButton>
          //     </div>
          //   ),
          // },
        ]}
        rows={transactions}
      />
    </div>
  );
};

export default TransactionReviewTable;
