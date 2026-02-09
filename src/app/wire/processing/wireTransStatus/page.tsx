"use client";

import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import MyTable from "@/core/components/Table/MyTable";
import { pageSizeOptions } from "@/core/constants";
import { timestampToDate } from "@/core/utils/date_time_util";
import { setTitle } from "@/redux/slices/AppSlice";
import { useAppDispatch } from "@/redux/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePagination } from "@/core/hooks";
import { useWireTransactionStatus } from "@/features/wire_processing";

const WireTransactionStatusPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Pagination (universal hook with URL sync)
  const pagination = usePagination({ syncToUrl: true, defaultPageSize: 10 });

  // React Query hook for fetching wire transaction status
  const { data, isLoading, isError, error, isFetching, refetch } =
    useWireTransactionStatus(pagination.page, pagination.pageSize);

  useEffect(() => {
    dispatch(setTitle("Transactions Status"));
  }, [dispatch]);

  return isLoading ? (
    <MyCircularProgressIndicator />
  ) : isError ? (
    <ErrorPage
      error={error?.message ?? "Error fetching transactions status"}
      recoveryButtonTitle="Retry"
      recoveryButtonOnClick={() => {
        refetch();
      }}
    />
  ) : (
    <div style={{ height: "77vh" }}>
      <MyTable
        handleRowClick={(params: any) => {
          router.push(
            `/wire/processing/wireFileErrors?filename=${params.row.baseFilename}`
          );
        }}
        customId={(row: any) => row.id}
        pagination={pagination.getTablePaginationProps(
          data?.totalElements ?? 0,
          isFetching
        )}
        sizeOptions={pageSizeOptions}
        columns={[
          {
            field: "baseFilename",
            headerName: "File Name",
            flex: 1,
            minWidth: 260,
          },
          {
            field: "createdAt",
            headerName: "Created Date",
            flex: 1,
            minWidth: 120,
            valueFormatter: (params: any) => {
              return `${timestampToDate(params)}`;
            },
            valueGetter: (value: any, row: any) => row.createdAt,
          },
          {
            field: "errorCount",
            headerName: "Error Transactions",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "pendingCount",
            headerName: "Pending Transactions",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "postedCount",
            headerName: "Posted Transactions",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "rejectCount",
            headerName: "Rejected Transactions",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "totalRecords",
            headerName: "Total Transactions",
            flex: 1,
            minWidth: 120,
          },
        ]}
        rows={data?.content ?? []}
        sortModel={[{ field: "createdAt", sort: "desc" }]}
      />
    </div>
  );
};

export default WireTransactionStatusPage;
