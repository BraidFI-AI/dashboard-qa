"use client";

import {
  getUploadStatus,
  setUploadStatusPaginationPageNumber,
} from "@/redux/slices/recon_file_upload_slice";
import { useAppDispatch } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import MyTable from "@/core/components/Table/MyTable";
import { paginationPageSize, PaginationStateType } from "@/core/constants";
import { GridCellParams, MuiEvent } from "@mui/x-data-grid";
import { timestampToDate } from "@/core/utils/date_time_util";
import LabelBox from "@/core/components/label_box";
import { enumTextToReadableText } from "@/core/utils/formatting_util";

const UploadStatusPage = () => {
  const dispatch = useAppDispatch();

  const uploadStatus: "loading" | string | any[] = useSelector(
    (state: any) => state.reconFileUpload.uploadStatus
  );
  const pagination: PaginationStateType = useSelector(
    (state: any) => state.reconFileUpload.uploadStatusPagination
  );

  useEffect(() => {
    dispatch(getUploadStatus({ refresh: true }));
  }, [dispatch]);

  return uploadStatus == "loading" ? (
    <MyCircularProgressIndicator />
  ) : typeof uploadStatus == "string" ? (
    <ErrorPage
      error={uploadStatus}
      recoveryButtonTitle="Retry"
      recoveryButtonOnClick={() => {
        dispatch(getUploadStatus({ refresh: false }));
      }}
    />
  ) : (
    <div style={{ height: "78vh" }}>
      <MyTable
        pagination={{
          rowCount: pagination.rowCount,
          loading: pagination.loadingPage,
          paginationModel: {
            page: pagination.pageNumber,
            pageSize: pagination.pageSize ?? paginationPageSize,
          },
          setPaginationModel: (page: number, size: number) => {
            dispatch(setUploadStatusPaginationPageNumber(page));
            dispatch(
              getUploadStatus({
                refresh: false,
              })
            );
          },
        }}
        handleRowClick={() => {}}
        // handleCellClick={(
        //   params: GridCellParams,
        //   event: MuiEvent<React.MouseEvent>
        // ) => {
        //   if (params.field == "productName") {
        //     event.stopPropagation();
        //   }
        // }}
        columns={[
          {
            field: "uploadedAt",
            headerName: "Uploaded",
            flex: 1,
            minWidth: 120,
            valueFormatter: (params: any) => {
              return `${timestampToDate(params)}`;
            },
            valueGetter: (value: any, row: any) => row.uploadedAt,
          },
          {
            field: "filename",
            headerName: "File Name",
            flex: 1,
            minWidth: 220,
          },
          {
            field: "type",
            headerName: "Type",
            flex: 1,
            minWidth: 150,
          },
          {
            field: "status",
            headerName: "Status",
            width: 120,
            display: "flex",
            renderCell: (params: any) => (
              <LabelBox
                color={
                  params.row?.status == "PROCESSED"
                    ? "green"
                    : params.row?.status == "FAILED"
                    ? "red"
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
            field: "requesterUsername",
            headerName: "Requester",
            flex: 1,
            minWidth: 150,
          },
          {
            field: "totalRecords",
            headerName: "Total Records",
            flex: 1,
            minWidth: 100,
          },
          {
            field: "matchedRecords",
            headerName: "Matched Records",
            flex: 1,
            minWidth: 100,
          },
          {
            field: "exceptionRecords",
            headerName: "Exception Records",
            flex: 1,
            minWidth: 100,
          },
          {
            field: "skippedRecords",
            headerName: "Skipped Records",
            flex: 1,
            minWidth: 100,
          },
          {
            field: "invalidRecords",
            headerName: "Invalid Records",
            flex: 1,
            minWidth: 100,
          },
        ]}
        rows={uploadStatus}
        sortModel={[{ field: "uploadedAt", sort: "desc" }]}
      />
    </div>
  );
};

export default UploadStatusPage;
