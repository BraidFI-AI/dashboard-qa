"use client";

import { ACH } from "@/core/api/ApiTypes";
import MyTable from "@/core/components/Table/MyTable";
import MyLinkText from "@/core/components/Text/LinkText";
import ACHModelView from "@/core/components/views/ach/ach_modal_view";
import { paginationPageSize, PaginationStateType } from "@/core/constants";
import linkToCounterparty from "@/core/utils/link_to_counterparty";
import toDollarFormat from "@/core/utils/toDollarFormat";
import {
  fetchUnauthorizedReturns,
  setUnauthReturnsPaginationPageNumber,
} from "@/redux/slices/ach_return_slice";
import { useAppDispatch } from "@/redux/store/store";
import { GridEventListener } from "@mui/x-data-grid";
import { useState } from "react";
import { useSelector } from "react-redux";

interface UnauthorizedReturnsTableProps {
  returns: ACH[];
}

const UnauthorizedReturnsTable: React.FC<UnauthorizedReturnsTableProps> = ({
  returns,
}) => {
  const dispatch = useAppDispatch();
  const [selectedAch, setSelectedAch] = useState(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    setSelectedAch(params.row);
    handleModalOpen();
  };

  const pagination: PaginationStateType = useSelector(
    (state: any) => state.return.pagination
  );

  const handleModalClose = () => setModalOpen(false);
  const handleModalOpen = () => setModalOpen(true);

  return (
    <>
      {selectedAch && (
        <ACHModelView
          ach={selectedAch}
          modalOpen={modalOpen}
          handleModalClose={handleModalClose}
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
            dispatch(setUnauthReturnsPaginationPageNumber(page));
            dispatch(fetchUnauthorizedReturns(false));
          },
        }}
        handleRowClick={handleRowClick}
        columns={[
          {
            field: "id",
            headerName: "ID",
            flex: 1,
            minWidth: 160,
          },
          {
            field: "productId",
            headerName: "Product ID",
            flex: 1,
            minWidth: 120,
            renderCell: (params: any) => (
              <MyLinkText
                link={
                  params.row.productId
                    ? `/configuration/products/${params.row.productId}`
                    : ""
                }
              >
                {params.row.productId}
              </MyLinkText>
            ),
            valueGetter: (params: any) => params.row.productId,
          },
          {
            field: "customerName",
            headerName: "Customer Name",
            flex: 1,
            minWidth: 160,
            renderCell: (params: any) => (
              <MyLinkText
                link={
                  params.row.customer &&
                  params.row.customer.type &&
                  params.row.customer.type == "BUSINESS"
                    ? `/businesses/${params.row.customer?.id}`
                    : `/individuals/${params.row.customer?.id}`
                }
              >
                {params.row.customerName}
              </MyLinkText>
            ),
            valueGetter: (params: any) => params.row.customerName,
          },
          {
            field: "counterpartyName",
            headerName: "Counterparty Name",
            flex: 1,
            minWidth: 160,
            renderCell: (params: any) => (
              <MyLinkText
                link={linkToCounterparty(params.row.counterparty) ?? ""}
              >
                {params.row.counterpartyName}
              </MyLinkText>
            ),
            valueGetter: (params: any) => params.row.counterpartyName,
          },
          { field: "secCode", headerName: "Sec Code", width: 120 },
          { field: "returnCode", headerName: "Return Code", width: 120 },
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
            field: "effectiveDate",
            headerName: "Effective Date",
            flex: 1,
            minWidth: 160,
            renderCell: (params: any) => (
              <div>{`${params.row.effective_date?.[0]
                .toString()
                .padStart(2, "0")}-${params.row.effective_date?.[1]
                .toString()
                .padStart(2, "0")}-${params.row.effective_date?.[2]
                .toString()
                .padStart(2, "0")}`}</div>
            ),
            valueGetter: (params: any) =>
              `${params.row.effective_date?.[0]
                .toString()
                .padStart(2, "0")}-${params.row.effective_date?.[1]
                .toString()
                .padStart(2, "0")}-${params.row.effective_date?.[2]
                .toString()
                .padStart(2, "0")}`,
          },
          { field: "externalId", headerName: "External ID", width: 120 },
        ]}
        rows={returns}
      />
    </>
  );
};

export default UnauthorizedReturnsTable;
