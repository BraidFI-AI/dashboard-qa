import { Transaction, TransactionSearch } from "@/core/api/ApiTypes";
import MyTable from "@/core/components/Table/MyTable";
import { GridCellParams, GridEventListener, MuiEvent } from "@mui/x-data-grid";
import React, { use, useEffect, useState } from "react";
import MyLinkText from "@/core/components/Text/LinkText";
import toDollarFormat from "@/core/utils/toDollarFormat";
import moment from "moment";
import { PaginationStateType, paginationPageSize } from "@/core/constants";
import { useAppDispatch } from "@/redux/store/store";
import { useSelector } from "react-redux";
import {
  fetchTransactions,
  setPaginationPageNumber,
} from "@/redux/slices/TransactionSlice";
import { useRouter } from "next/navigation";
import { fetchCounterParty } from "@/redux/slices/CounterpartySlice";
import linkToCounterparty from "@/core/utils/link_to_counterparty";
import MyText from "../../Text/Text";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MyModal from "../../my_modal";
import ItemRow from "../../Text/ItemRow";

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

  const [navigating, setNavigating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(
    null
  );
  const [selectedTransactionType, setSelectedTransactionType] = useState<
    string | null
  >(null);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const navigateToEntity = async (ach: any) => {
    if (ach == null) {
      return;
    }

    const association =
      ach.counterpartyAssociatedEntityType == "BUSINESS"
        ? "businesses"
        : ach.counterpartyAssociatedEntityType == "INVIDIDUAL"
        ? "individuals"
        : ach.counterpartyAssociatedEntityType == "ACCOUNT"
        ? "accounts"
        : "configuration/products";

    const link = `/${association}/${ach.counterpartyAssociatedEntityId}/counterparties/${ach.counterpartyId}`;

    router.push(link);

    // if (id == null) {
    //   return;
    // }
    // setNavigating(true);
    // dispatch(fetchCounterParty(id)).then((cp: any) => {
    //   if (cp.payload) {
    //     const link = linkToCounterparty(cp.payload);
    //     if (link) {
    //       router.push(link);
    //     }
    //   }
    //   setNavigating(false);
    // });
  };

  const showTransactionDetails = (
    transaction: any | null,
    type: string | null
  ) => {
    if (transaction == null || type == null) {
      return;
    }
    setSelectedTransaction(transaction);
    setSelectedTransactionType(type);
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
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === "object" && value !== null) {
        return renderObject(value, fullKey);
      }
      return <ItemRow title={formatTitle(fullKey)} value={value as any} />;
    });
  };

  return (
    <>
      {selectedTransaction != null &&
        selectedTransactionType != null &&
        modalOpen && (
          <MyModal modalOpen={modalOpen} handleModalClose={handleModalClose}>
            <MyText size="lg">{selectedTransactionType + " Details"}</MyText>
            <div className="pb-3" />
            {renderObject(selectedTransaction)}
          </MyModal>
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
        handleRowClick={() => {}}
        handleCellClick={(
          params: GridCellParams,
          event: MuiEvent<React.MouseEvent>
        ) => {
          if (
            params.field == "ach.counterparty.id" ||
            params.field == "ach.customerId"
          ) {
            if (params.field == "ach.counterparty.id") {
              navigateToEntity(params.row.ach);
            }
            event.stopPropagation();
          }
        }}
        columnVisibilityModel={{
          paymentId: false,
          "ach.counterparty.id": false,
          description: false,
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
            renderCell: (params: any) => (
              <div>{toDollarFormat(params.row.amount)}</div>
            ),
          },
          {
            field: "ach.customerId",
            headerName: "Customer",
            flex: 1,
            minWidth: 200,
            renderCell: (params: any) => (
              <MyLinkText
                link={
                  params.row.customerType != null &&
                  params.row.customerType == "BusinessCustomer"
                    ? `/businesses/${params.row?.customerId}`
                    : `/individuals/${params.row?.customerId}`
                }
              >
                {params.row?.customerName}
              </MyLinkText>
            ),
            valueGetter: (params: any) => params.row?.customerName,
          },
          {
            field: "ach.counterparty.id",
            headerName: "Counterparty",
            flex: 1,
            minWidth: 200,
            renderCell: (params: any) => (
              <MyText primary={true} underline={true} size="md">
                {params.row?.ach?.counterpartyName}
              </MyText>
            ),
            valueGetter: (params: any) => params.row?.ach?.counterpartyName,
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
          },
          {
            field: "details",
            headerName: "Details",
            flex: 1,
            minWidth: 100,
            renderCell: (params: any) => (
              <InfoOutlinedIcon
                className="text-[#12A7FF]"
                onClick={() => {
                  showTransactionDetails(
                    params.row.ach ?? params.row.wire ?? null,
                    params.row.ach != null
                      ? "ACH"
                      : params?.row?.wire != null
                      ? "Wire"
                      : null
                  );
                }}
              >
                {params.row?.ach != null
                  ? "ACH"
                  : params?.row?.wire != null
                  ? "Wire"
                  : "Unknown"}
              </InfoOutlinedIcon>
            ),
            valueGetter: (params: any) =>
              params.row?.ach ?? params?.row?.wire ?? params?.row ?? "",
          },
          {
            field: "status",
            headerName: "Status",
            flex: 1,
            minWidth: 140,
          },
          {
            field: "updatedAt",
            headerName: "Updated",
            flex: 1,
            minWidth: 140,
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
            valueGetter: (params: any) => params.row.updatedAt,
          },
        ]}
        rows={transactions}
        sortModel={[{ field: "createdAt", sort: "desc" }]}
      />
    </>
  );
};

export default TransactionTableView;
