"use client";

import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyTable from "@/core/components/Table/MyTable";
import MyLinkText from "@/core/components/Text/LinkText";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import ACHModelView from "@/core/components/views/ach/ach_modal_view";
import linkToCounterparty from "@/core/utils/link_to_counterparty";
import timestampToDate from "@/core/utils/timestampToDate";
import { NocType, fetchNoc } from "@/redux/slices/noc_slice";
import { useAppDispatch } from "@/redux/store/store";
import { GridCellParams, GridEventListener, MuiEvent } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NOCChangeModal from "./noc_change_modal";
import { fetchCounterParty } from "@/redux/slices/CounterpartySlice";
import { useRouter } from "next/navigation";
import MyText from "@/core/components/Text/Text";
import { PaginationStateType, paginationPageSize } from "@/core/constants";
import { setPaginationPageNumber } from "@/redux/slices/TransactionSlice";

const NocTable = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const noc: NocType = useSelector((state: any) => state.noc.noc);
  const pagination: PaginationStateType = useSelector(
    (state: any) => state.noc.pagination
  );

  const [selectedAch, setSelectedAch] = useState(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [changeModalOpen, setChangeModalOpen] = useState<boolean>(false);

  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    dispatch(fetchNoc({ refresh: true }));
  }, [dispatch]);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    setSelectedAch(params.row);
    handleModalOpen();
  };

  const handleModalClose = () => setModalOpen(false);
  const handleModalOpen = () => setModalOpen(true);

  const handleChangeModalClose = () => setChangeModalOpen(false);
  const handleChangeModalOpen = () => setChangeModalOpen(true);

  return noc == "loading" ? (
    <MyCircularProgressIndicator />
  ) : typeof noc == "string" ? (
    <ErrorPage
      error={noc}
      recoveryButtonTitle="Retry"
      recoveryButtonOnClick={() => {
        dispatch(fetchNoc({ refresh: true }));
      }}
    />
  ) : (
    <>
      {selectedAch && modalOpen && (
        <ACHModelView
          ach={selectedAch}
          modalOpen={modalOpen}
          handleModalClose={handleModalClose}
        />
      )}
      {selectedAch && changeModalOpen && (
        <NOCChangeModal
          handleModalClose={handleChangeModalClose}
          modalOpen={changeModalOpen}
          noc={selectedAch}
        />
      )}
      <div style={navigating ? { pointerEvents: "none" } : {}}>
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
              dispatch(fetchNoc({}));
            },
          }}
          handleCellClick={(
            params: GridCellParams,
            event: MuiEvent<React.MouseEvent>
          ) => {
            if (
              params.field == "change" ||
              params.field == "counterpartyName" ||
              params.field == "businessName"
            ) {
              event.stopPropagation();
            }
          }}
          handleRowClick={handleRowClick}
          columns={[
            {
              field: "id",
              headerName: "ID",
              flex: 1,
              minWidth: 200,
            },
            {
              field: "businessName",
              headerName: "Business Name",
              flex: 1,
              minWidth: 160,
              renderCell: (params: any) => (
                <MyLinkText
                  link={
                    // params.row.customer &&
                    // params.row.customer.type &&
                    // params.row.customer.type == "BUSINESS"
                    // ?
                    `/businesses/${params.row.customerId}`
                    // : `/individuals/${params.row.customerId}`
                  }
                >
                  {params.row.customerName}
                </MyLinkText>
              ),
              valueGetter: (params: any) => params.row.customerName,
            },
            {
              field: "counterpartyName",
              headerName: "Counterparty",
              flex: 1,
              minWidth: 160,
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
              field: "changeCode",
              headerName: "Change Code",
              flex: 1,
              minWidth: 120,
            },
            {
              field: "changeReason",
              headerName: "Change Reason",
              flex: 1,
              minWidth: 160,
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
            {
              field: "updatedAt",
              headerName: "Updated at",
              flex: 1,
              minWidth: 120,
              valueFormatter: (params: any) => {
                return `${timestampToDate(params.value)}`;
              },
              valueGetter: (params: any) => params.row.updatedAt,
            },
            {
              field: "change",
              headerName: "Change",
              flex: 1,
              minWidth: 120,
              renderCell: (params: any) => (
                <div className="flex justify-center items-center">
                  <MyBlueButton
                    onClick={() => {
                      setSelectedAch(params.row);
                      handleChangeModalOpen();
                    }}
                  >
                    Change
                  </MyBlueButton>
                </div>
              ),
            },
          ]}
          rows={noc}
          sortModel={[{ field: "updatedAt", sort: "desc" }]}
        />
      </div>
    </>
  );
};

export default NocTable;
