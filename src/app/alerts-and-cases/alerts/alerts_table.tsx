"use client";

import ReviewTransactionModal from "@/app/transactions/transactionReview/review_transaction_modal";
import { Alert } from "@/core/api/ApiTypes";
import MyTable from "@/core/components/Table/MyTable";
import MyLinkText from "@/core/components/Text/LinkText";
import MyText from "@/core/components/Text/Text";
import { paginationPageSize, PaginationStateType } from "@/core/constants";
import {
  fetchAlerts,
  setAlertsPaginationPageNumber,
} from "@/redux/slices/alerts_slice";
import { useAppDispatch } from "@/redux/store/store";
import { GridCellParams, MuiEvent } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

type AlertsTableProps = {
  alerts: Alert[];
  isPaginated: boolean;
  hideHeaders?: boolean;
};

const AlertsTable: React.FC<AlertsTableProps> = ({
  alerts,
  isPaginated,
  hideHeaders = false,
}) => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const pagination: PaginationStateType = useSelector(
    (state: any) => state.alerts.pagination
  );

  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const handleReviewModalOpen = () => setReviewModalOpen(true);
  const handleReviewModalClose = () => setReviewModalOpen(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  return alerts.length == 0 ? (
    <MyText>No alerts found</MyText>
  ) : (
    <>
      {selectedAlert != null && selectedAlert.contextId != null && (
        <ReviewTransactionModal
          paymentId={selectedAlert.contextId}
          modalOpen={reviewModalOpen}
          handleModalClose={handleReviewModalClose}
        />
      )}
      <MyTable
        hideSearch={hideHeaders}
        hideColumnsButton={hideHeaders}
        hideFilterButton={hideHeaders}
        hideDensityButton={hideHeaders}
        exp={!hideHeaders}
        pagination={
          isPaginated
            ? {
                rowCount: pagination.rowCount,
                loading: pagination.loadingPage,
                paginationModel: {
                  page: pagination.pageNumber,
                  pageSize: paginationPageSize,
                },
                setPaginationModel: (page: number) => {
                  dispatch(setAlertsPaginationPageNumber(page));
                  dispatch(fetchAlerts(false));
                },
              }
            : undefined
        }
        customId={(row: Alert) => row.id}
        handleRowClick={(params: any) => {
          router.push(`/alerts-and-cases/alerts/${params.row.id}`);
        }}
        handleCellClick={(
          params: GridCellParams,
          event: MuiEvent<React.MouseEvent>
        ) => {
          if (params.field == "contextId") {
            event.stopPropagation();
          }
        }}
        columns={[
          {
            field: "id",
            headerName: "Alert ID",
            width: 80,
          },
          {
            field: "type",
            headerName: "Type",
            width: 200,
          },
          {
            field: "status",
            headerName: "Status",
            width: 120,
          },
          {
            field: "contextType",
            headerName: "Context Type",
            width: 140,
          },
          {
            field: "contextId",
            headerName: "Context ID",
            width: 140,
            renderCell: (params: any) => {
              return params.row.contextType == "TRANSACTION" ? (
                <div
                  className="cursor-pointer"
                  onClick={(e: any) => {
                    if (params.row.contextType == "TRANSACTION") {
                      setSelectedAlert(params.row);
                      handleReviewModalOpen();
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                >
                  <MyText size="md" primary={true} underline={true}>
                    {params.row.contextId}
                  </MyText>
                </div>
              ) : (
                <MyLinkText link={`/compliance/ofac/${params.row.contextId}`}>
                  {params.row.contextId}
                </MyLinkText>
              );
            },
            valueGetter: (params: any) => params.row.contextId,
          },
          {
            field: "description",
            headerName: "Description",
            minWidth: 160,
            flex: 1,
          },
        ]}
        rows={alerts}
        // sortModel={[{ field: "createdAt", sort: "desc" }]}
      />
    </>
  );
};

export default AlertsTable;
