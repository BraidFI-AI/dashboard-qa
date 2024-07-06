"use client";

import { useAppDispatch } from "@/redux/store/store";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import MyText from "@/core/components/Text/Text";
import Modal from "@mui/material/Modal";
import { Transaction } from "@/core/api/ApiTypes";
import { fetchTransactions } from "@/redux/slices/TransactionSlice";
import { setTitle } from "@/redux/slices/AppSlice";
import { fetchBusiness } from "@/redux/slices/BusinessSlice";
import { GridEventListener } from "@mui/x-data-grid";
import MyTable from "@/core/components/Table/MyTable";
import timestampToDate from "@/core/utils/timestampToDate";
import { fetchAccount } from "@/redux/slices/AccountSlice";
import MyLinkText from "@/core/components/Text/LinkText";
import toDollarFormat from "@/core/utils/toDollarFormat";
import moment from "moment";

const Transactions = ({ params }: { params: any }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const ModalBoxstyle = {
    position: "absolute" as any as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: "5px",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    dispatch(setTitle("Business Customer"));
    dispatch(fetchAccount(params.accountId)).then((account: any) => {
      if (account) {
        dispatch(
          fetchTransactions({
            criteria: { accountNumber: account.payload?.accountNumber },
          })
        ).then((data: any) => {
          setTransactions(data.payload);
          setLoading(false);
        });

        dispatch(fetchBusiness(parseInt(params.id))).then((business: any) => {
          dispatch(setTitle(business.payload.name));
          if (business.payload != null) {
            dispatch(setTitle(business.payload.name));
          }
        });
      } else {
        setLoading(false);
      }
    });
  }, [dispatch, params.id, params.accountId]);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    if (transactions) {
      transactions.forEach((row: any) => {
        if (row.customUUID == params.id) {
          setSelectedTransaction(row);
        }
      });

      handleModalOpen();
    }
  };

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  return (
    <Box className="flex flex-col h-full">
      <MyText size="lg">{`Account ${params.accountId} Transactions`}</MyText>
      <div className="pb-4"></div>
      {transactions != null && selectedTransaction != null ? (
        <Modal
          open={modalOpen}
          onClose={handleModalClose}
          className="overflow-auto"
        >
          <Box className="w-[520px] my-20" sx={ModalBoxstyle}>
            <MyText size="lg">Transaction Details</MyText>
            <div className="h-4"></div>
            <ItemRow
              title="Account ID"
              value={selectedTransaction.accountId}
            ></ItemRow>
            <ItemRow
              title="Counter Account ID"
              value={selectedTransaction.counterAccountId}
            ></ItemRow>
            <ItemRow
              title="Currency"
              value={selectedTransaction.currency}
            ></ItemRow>
            <ItemRow
              title="Amount"
              value={toDollarFormat(selectedTransaction.amount)}
            ></ItemRow>
            <ItemRow
              title="Anonymous"
              value={selectedTransaction.anonymous}
            ></ItemRow>
            <ItemRow
              title="Operation Type"
              value={selectedTransaction.operationType}
            ></ItemRow>
            <ItemRow
              title="Market Value Amount"
              value={selectedTransaction.marketValue?.amount}
            ></ItemRow>
            <ItemRow
              title="Market Value Currency"
              value={selectedTransaction.marketValue?.currency}
            ></ItemRow>
            <ItemRow
              title="Market Value Source"
              value={selectedTransaction.marketValue?.source}
            ></ItemRow>
            <ItemRow
              title="Market Value Source Data"
              value={selectedTransaction.marketValue?.sourceDate}
            ></ItemRow>
            <ItemRow
              title="Transaction Type"
              value={selectedTransaction.transactionType}
            ></ItemRow>
            <ItemRow
              title="Reference"
              value={selectedTransaction.reference}
            ></ItemRow>
            <ItemRow
              title="Transaction Code"
              value={selectedTransaction.transactionCode}
            ></ItemRow>
            <ItemRow
              title="Sender Note"
              value={selectedTransaction.senderNote}
            ></ItemRow>
            <ItemRow
              title="Recipient Note"
              value={selectedTransaction.recipientNote}
            ></ItemRow>
            <ItemRow
              title="Payment ID"
              value={selectedTransaction.paymentId}
            ></ItemRow>
            <ItemRow title="Attr" value={selectedTransaction.attr}></ItemRow>
            <ItemRow
              title="Address"
              value={selectedTransaction.address}
            ></ItemRow>
            <ItemRow title="Tx ID" value={selectedTransaction.txId}></ItemRow>
            <ItemRow
              title="location"
              value={selectedTransaction.location}
            ></ItemRow>
            <ItemRow
              title="Fee Amount"
              value={toDollarFormat(selectedTransaction.feeAmount)}
            ></ItemRow>
            <ItemRow
              title="Created"
              value={moment(selectedTransaction.created)}
            ></ItemRow>
          </Box>
        </Modal>
      ) : (
        <></>
      )}
      {loading ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading Transactions...</div>
        </div>
      ) : transactions == null || transactions.length == 0 ? (
        <MyText size="md">No transaction for this account found</MyText>
      ) : (
        <MyTable
          customId={(row: Transaction) => row.customUUID}
          handleRowClick={handleRowClick}
          columns={[
            {
              field: "created",
              headerName: "Created",
              width: 120,
              renderCell: (params: any) => (
                <div>{timestampToDate(params.row.created, true)}</div>
              ),
            },
            // {
            //   field: "updatedAt",
            //   headerName: "Updated",
            //   flex: 1,
            //   minWidth: 150,
            //   renderCell: (params: any) => (
            //     <div>{timestampToDate(params.row.created, true)}</div>
            //   ),
            // },
            {
              field: "accountNumber",
              headerName: "Account Number",
              width: 160,
            },
            {
              field: "ach.customer.id",
              headerName: "Customer",
              width: 120,
              renderCell: (params: any) => (
                <MyLinkText
                  link={`/${
                    params.row?.ach?.customer?.type == "BUSINESS"
                      ? "businesses"
                      : "individuals"
                  }/${params.row?.ach?.customer?.id}`}
                >
                  {params.row?.ach?.customer?.firstName}
                </MyLinkText>
              ),
            },
            {
              field: "ach.counterparty.id",
              headerName: "Counterparty",
              width: 160,
              renderCell: (params: any) => (
                <MyLinkText
                  link={`${
                    params.row?.ach?.counterparty?.productId
                      ? `/configuration/products/${params.row?.ach?.counterparty?.productId}`
                      : params.row?.ach?.counterparty?.businessId
                      ? `/businesses/${params.row?.ach?.counterparty?.businessId}`
                      : params.row?.ach?.counterparty?.individualId
                      ? `/individuals/${params.row?.ach?.counterparty?.individualId}`
                      : params.row?.ach?.counterparty?.accountId
                      ? `/accounts/${params.row?.ach?.counterparty?.accountId}`
                      : ""
                  }/counterparties/${params.row?.ach?.counterparty?.id}`}
                >
                  {params.row?.ach?.counterparty?.businessName
                    ? params.row?.ach?.counterparty?.businessName
                    : params.row?.ach?.counterparty?.firstName +
                      " " +
                      params.row?.ach?.counterparty?.lastName}
                </MyLinkText>
              ),
            },
            {
              field: "amount",
              headerName: "Amount",
              width: 120,
              valueGetter: (params: any) => toDollarFormat(params.row?.amount),
            },
            {
              field: "ach.direction",
              headerName: "Direction",
              width: 110,
              valueGetter: (params: any) => params.row?.ach?.direction,
            },
            {
              field: "transactionCode",
              headerName: "Transaction Code",
              width: 200,
            },
            {
              field: "status",
              headerName: "Status",
              width: 130,
            },
          ]}
          rows={transactions}
        />
      )}
    </Box>
  );
};

type ItemRowProps = {
  title: any;
  value: any;
};
const ItemRow: React.FC<ItemRowProps> = ({ title, value }) => {
  return (
    <Box className="flex flex-row justify-between pb-2">
      <MyText size="sm">{title}</MyText>

      <div className="w-7/12 break-all">
        <MyText size="sm">{value}</MyText>
      </div>
    </Box>
  );
};

export default Transactions;
