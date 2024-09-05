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
import { fetchLimit } from "@/redux/slices/RulesAndLimitsSlice";
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

  const [navigating, setNavigating] = useState(false);

  const pagination: PaginationStateType = useSelector(
    (state: any) => state.alerts.pagination
  );

  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const handleReviewModalOpen = () => setReviewModalOpen(true);
  const handleReviewModalClose = () => setReviewModalOpen(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const navigateToDualApproval = (params: any) => {
    setNavigating(true);
    if (params.row.contextType == "VELOCITY_LIMIT") {
      dispatch(fetchLimit(params.row.contextId.toString())).then(
        (data: any) => {
          if (typeof data.payload == "string") {
            router.push(`/alerts-and-cases/alerts/${params.row.id}`);
          } else {
            router.push(
              data.payload.productId != null
                ? `/configuration/products/${data.payload.productId}/limits/${params.row.contextId}`
                : `/accounts/${data.payload.accountNumber}/limits/${params.row.contextId}`
            );
          }
          setNavigating(false);
        }
      );
    } else if (params.row.contextType == "PRODUCT") {
      router.push(`/configuration/products/${params.row.contextId}`);
    } else if (params.row.contextType == "FILE_NAME") {
      router.push(
        `/transactions/transactionReview?includeWire=true&includeAch=false&wireFileHandle=${params.row.contextId}`
      );
    } else {
      router.push(`/alerts-and-cases/alerts/${params.row.id}`);
    }
    setNavigating(false);
  };

  return alerts.length == 0 ? (
    <MyText>No alerts found</MyText>
  ) : (
    <>
      {selectedAlert != null && selectedAlert.contextId != null && (
        <ReviewTransactionModal
          paymentId={selectedAlert.contextId}
          modalOpen={reviewModalOpen}
          handleModalClose={handleReviewModalClose}
          alertId={selectedAlert.id?.toString() ?? ""}
          ofacId={(selectedAlert as any).ofacId ?? ""}
        />
      )}
      <div style={navigating ? { pointerEvents: "none" } : {}}>
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
              flex: 1,
              minWidth: 120,
            },
            {
              field: "type",
              headerName: "Type",
              flex: 1,
              minWidth: 200,
            },
            {
              field: "status",
              headerName: "Status",
              flex: 1,
              minWidth: 120,
            },
            {
              field: "contextType",
              headerName: "Context Type",
              flex: 1,
              minWidth: 140,
            },
            {
              field: "contextId",
              headerName: "Context ID",
              flex: 1,
              minWidth: 140,
              renderCell: (params: any) => {
                return params.row.type == "OFAC" ? (
                  <MyLinkText link={`/compliance/ofac/${params.row.contextId}`}>
                    {params.row.contextId}
                  </MyLinkText>
                ) : params.row.type == "TRANSACTION_MONITORING" ||
                  params.row.type == "TRANSACTION_REVIEW" ? (
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
                ) : params.row.type == "DUAL_APPROVAL" ? (
                  <div
                    className="cursor-pointer"
                    onClick={(e: any) => {
                      navigateToDualApproval(params);
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <MyText primary underline size="md">
                      {params.row.contextId}
                    </MyText>
                  </div>
                ) : (
                  <MyText>{params.row.contextId}</MyText>
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
      </div>
    </>
  );
};

export default AlertsTable;
