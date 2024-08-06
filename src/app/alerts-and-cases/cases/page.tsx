"use client";

import { Case } from "@/core/api/ApiTypes";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import MyTable from "@/core/components/Table/MyTable";
import MyLinkText from "@/core/components/Text/LinkText";
import MyText from "@/core/components/Text/Text";
import { paginationPageSize, PaginationStateType } from "@/core/constants";
import { useAppDispatch } from "@/redux/store/store";
import { GridCellParams, GridEventListener, MuiEvent } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ReviewTransactionModal from "../../transactions/transactionReview/review_transaction_modal";
import {
  fetchCases,
  setCasesPaginationPageNumber,
} from "@/redux/slices/cases_slice";

const CasesTablePage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const pagination: PaginationStateType = useSelector(
    (state: any) => state.cases.pagination
  );

  console.log(pagination);

  const cases: "loading" | string | Case[] = useSelector(
    (state: any) => state.cases.cases
  );

  const [navigating, setNavigating] = useState(false);

  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const handleReviewModalOpen = () => setReviewModalOpen(true);
  const handleReviewModalClose = () => setReviewModalOpen(false);

  const navigateToEntity = async (contextId: any) => {
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

  useEffect(() => {
    dispatch(fetchCases(true));
  }, [dispatch]);

  return (
    <div className="h-full" style={navigating ? { pointerEvents: "none" } : {}}>
      <>
        {cases == "loading" ? (
          <MyCircularProgressIndicator />
        ) : typeof cases == "string" ? (
          <ErrorPage
            error={cases}
            recoveryButtonTitle="Retry"
            recoveryButtonOnClick={() => {
              dispatch(fetchCases(false));
            }}
          />
        ) : (
          <>
            <MyTable
              pagination={{
                rowCount: pagination.rowCount,
                loading: pagination.loadingPage,
                paginationModel: {
                  page: pagination.pageNumber,
                  pageSize: paginationPageSize,
                },
                setPaginationModel: (page: number) => {
                  dispatch(setCasesPaginationPageNumber(page));
                  dispatch(fetchCases(false));
                },
              }}
              exp={true}
              customId={(row: Case) => row.id}
              handleRowClick={(params: any) => {
                router.push(`/alerts-and-cases/cases/${params.row.id}`);
              }}
              handleCellClick={(
                params: GridCellParams,
                event: MuiEvent<React.MouseEvent>
              ) => {
                if (params.field == "contextId") {
                  navigateToEntity(params.row.ach);
                  event.stopPropagation();
                }
              }}
              columns={[
                {
                  field: "id",
                  headerName: "Case ID",
                  flex: 1,
                  minWidth: 120,
                },
                {
                  field: "name",
                  headerName: "Case Name",
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
                  field: "tenantId",
                  headerName: "Tenant ID",
                  flex: 1,
                  minWidth: 140,
                },
                {
                  field: "description",
                  headerName: "Description",
                  flex: 1,
                  minWidth: 200,
                },
              ]}
              rows={cases}
              // sortModel={[{ field: "createdAt", sort: "desc" }]}
            />
          </>
        )}
      </>
    </div>
  );
};

export default CasesTablePage;
