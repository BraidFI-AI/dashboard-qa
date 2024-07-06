"use client";

import { ACH, Transaction } from "@/core/api/ApiTypes";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyTable from "@/core/components/Table/MyTable";
import MyLinkText from "@/core/components/Text/LinkText";
import timestampToDate from "@/core/utils/timestampToDate";
import toDollarFormat from "@/core/utils/toDollarFormat";
import { GridCellParams, GridEventListener, MuiEvent } from "@mui/x-data-grid";
import moment from "moment";
import { useState } from "react";
import ACHModelView from "@/core/components/views/ach/ach_modal_view";
import { fetchCounterParty } from "@/redux/slices/CounterpartySlice";
import linkToCounterparty from "@/core/utils/link_to_counterparty";
import MyText from "@/core/components/Text/Text";
import { useRouter } from "next/navigation";
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

  const dispatch = useAppDispatch();

  const transactions = useSelector(
    (state: any) => state.transactionReview.transactions
  );

  const pagination: PaginationStateType = useSelector(
    (state: any) => state.transactionReview.pagination
  );

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
          modalOpen={reviewModalOpen}
          handleModalClose={handleReviewModalClose}
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
            dispatch(fetchToReviewACHTransactions({}));
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
        handleRowClick={handleRowClick}
        columns={[
          {
            field: "id",
            headerName: "ID",
            minWidth: 120,
            maxWidth: 280,
            flex: 1,
          },
          {
            field: "createdAt",
            headerName: "Created at",
            width: 130,
            valueFormatter: (params: any) => {
              return `${moment(params.value * 1000).year()}-${(
                moment(params.value * 1000).month() + 1
              )
                .toString()
                .padStart(2, "0")}-${moment(params.value * 1000)
                .date()
                .toString()
                .padStart(2, "0")} ${moment(params.value * 1000)
                .hour()
                .toString()
                .padStart(2, "0")}:${moment(params.value * 1000)
                .minute()
                .toString()
                .padStart(2, "0")}`;
            },
            valueGetter: (params: any) => params.row.createdAt,
          },
          {
            field: "productId",
            headerName: "Product ID",
            width: 100,
            renderCell: (params: any) => (
              <MyLinkText
                link={`/configuration/products/${params.row.productId}`}
              >
                {params.row.productId}
              </MyLinkText>
            ),
            valueGetter: (params: any) => params.row.productId,
          },
          {
            field: "customerName",
            headerName: "Customer",
            minWidth: 150,
            maxWidth: 200,
            flex: 1,
            renderCell: (params: any) => (
              <MyLinkText link={`/businesses/${params.row.customerId}`}>
                {params.row.customerName}
              </MyLinkText>
            ),
            valueGetter: (params: any) => params.row.customerName,
          },
          {
            field: "counterpartyName",
            headerName: "Counterparty",
            minWidth: 120,
            maxWidth: 200,
            flex: 1,
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
            valueGetter: (params: any) => params.row.counterpartyName,
          },
          {
            field: "accountNumber",
            headerName: "Account number",
            minWidth: 120,
            maxWidth: 140,
            flex: 1,
            renderCell: (params: any) => (
              <MyLinkText link={`/accounts/${params.row.accountNumber}`}>
                {params.row.accountNumber}
              </MyLinkText>
            ),
            valueGetter: (params: any) => params.row.accountNumber,
          },
          {
            field: "amount",
            headerName: "Amount",
            width: 150,
            renderCell: (params: any) => (
              <div>{toDollarFormat(params.row.amount)}</div>
            ),
            valueGetter: (params: any) => params.row.amount,
          },
          { field: "inbound", headerName: "Inbound", width: 120 },
          {
            field: "review",
            headerName: "Review",
            width: 150,
            renderCell: (params: any) => (
              <div className="flex items-center justify-center">
                <MyBlueButton
                  onClick={() => {
                    setSelectedTransaction(params.row);
                    handleReviewModalOpen();
                  }}
                >
                  Review
                </MyBlueButton>
              </div>
            ),
          },
        ]}
        rows={transactions}
      />
    </div>
  );
};

export default TransactionReviewTable;
