"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { GridCellParams, GridEventListener, MuiEvent } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { OFAC, OFACSearch } from "@/core/api/ApiTypes";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
import MyTable from "@/core/components/Table/MyTable";
import timestampToDate from "@/core/utils/timestampToDate";
import {
  fetchOFACHits,
  setOFACTablePageNumber,
  setOFACTablePageSize,
} from "@/redux/slices/OFACSlice";
import { fetchCounterParty } from "@/redux/slices/CounterpartySlice";
import linkToCounterparty from "@/core/utils/link_to_counterparty";
import ErrorPage from "@/core/components/error_page";
import DescriptionIcon from "@mui/icons-material/Description";
import IconButton from "@mui/material/IconButton";
import MyText from "@/core/components/Text/Text";
import MyModal from "@/core/components/my_modal";
import { paginationPageSize, PaginationStateType } from "@/core/constants";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import LabelBox from "@/core/components/label_box";
import { enumTextToReadableText } from "@/core/utils/formatting_util";

type OFACHitsTableProps = {
  filters: OFACSearch;
};

const OFACHitsTable: React.FC<OFACHitsTableProps> = ({ filters }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const ofacsHits: "loading" | string | OFAC[] = useSelector(
    (state: any) => state.ofac.OFACs
  );

  const pagination: PaginationStateType = useSelector(
    (state: any) => state.ofac.pagination
  );

  const [navigating, setNavigating] = useState(false);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [note, setNote] = useState(null);

  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    router.push(`/compliance/ofac/${params.row.ofacId}`);
  };

  const navigateToEntity = async (row: any) => {
    if (row.transactionPaymentId) {
      router.push(
        `/transactions/transactionHistory?paymentId=${row.transactionPaymentId}`
      );
    } else if (row.uboId) {
      router.push(`/individuals/${row.individualId}`);
    } else if (row.businessName) {
      router.push(`/businesses/${row.businessId}`);
    } else if (row.individualName) {
      router.push(`/individuals/${row.individualId}`);
    } else if (row.counterpartyName) {
      setNavigating(true);
      dispatch(fetchCounterParty(row.counterpartyId)).then((cp: any) => {
        if (cp.payload) {
          const link = linkToCounterparty(cp.payload);
          if (link) {
            router.push(link);
          }
        }
        setNavigating(false);
      });
    }
  };

  return ofacsHits == null || ofacsHits == "loading" ? (
    <div className="flex flex-col items-center justify-center">
      <div>Loading OFAC checks...</div>
    </div>
  ) : typeof ofacsHits == "string" ? (
    <ErrorPage
      error="Error loading OFAC checks"
      recoveryButtonOnClick={() => {
        dispatch(fetchOFACHits({ refresh: true, filters: filters }));
      }}
      recoveryButtonTitle="Retry"
    />
  ) : ofacsHits.length == 0 ? (
    <MyText>No OFAC checks found</MyText>
  ) : (
    <>
      <MyModal modalOpen={modalOpen} handleModalClose={handleModalClose}>
        <MyText>Note</MyText>
        <div className="pb-1"></div>
        <MyText size="md">{note}</MyText>
        <div className="pb-4"></div>
      </MyModal>
      {/* <div
        style={navigating ? { pointerEvents: "none" } : {}}
        className="h-full"
      > */}
      <MyTable
        pagination={{
          rowCount: pagination.rowCount,
          loading: pagination.loadingPage,
          paginationModel: {
            page: pagination.pageNumber,
            pageSize: pagination.pageSize ?? paginationPageSize,
          },
          setPaginationModel: (page: number, size: number) => {
            dispatch(setOFACTablePageSize(size));
            dispatch(setOFACTablePageNumber(page));
            dispatch(
              fetchOFACHits({
                refresh: false,
                filters: filters,
              })
            );
          },
        }}
        customId={(row: OFAC) => row.ofacId}
        handleRowClick={handleRowClick}
        handleCellClick={(
          params: GridCellParams,
          event: MuiEvent<React.MouseEvent>
        ) => {
          if (params.field == "entity" || params.field == "note") {
            if (params.field == "entity") {
              navigateToEntity(params.row);
            }
            if (params.field == "note") {
              setNote(params?.row?.note);
              handleModalOpen();
            }
            event.stopPropagation();
          }
        }}
        columns={[
          {
            field: "ofacId",
            headerName: "ID",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "createdAt",
            headerName: "Created",
            flex: 1,
            minWidth: 140,
            valueFormatter: (params: any) => {
              return `${timestampToDate(params)}`;
            },
            valueGetter: (value: any, row: any) => row.createdAt,
          },
          {
            field: "entity",
            headerName: "Entity",
            flex: 1,
            minWidth: 160,
            display: "flex",
            renderCell: (params: any) => (
              <MyText
                primary={
                  params.row.businessName == null &&
                  params.row.individualName == null &&
                  params.row.counterpartyName == null &&
                  params.row.transactionPaymentId == null
                    ? false
                    : true
                }
                underline={
                  params.row.businessName == null &&
                  params.row.individualName == null &&
                  params.row.counterpartyName == null &&
                  params.row.transactionPaymentId == null
                    ? false
                    : true
                }
                size="table"
              >
                {params.row.businessName ??
                  params.row.individualName ??
                  params.row.counterpartyName ??
                  params.row.transactionPaymentId ??
                  "Unknown"}
              </MyText>
            ),
            valueGetter: (value: any, row: any) =>
              row.businessName ??
              row.individualName ??
              row.counterpartyName ??
              row.transactionPaymentId ??
              "Unknown",
          },
          {
            field: "entityType",
            headerName: "Entity Type",
            flex: 1,
            minWidth: 140,
            display: "flex",
            renderCell: (params: any) => (
              <LabelBox
                color={
                  params.row.businessName != null
                    ? "blue"
                    : params.row.individualName != null
                    ? "orange"
                    : params.row.counterpartyName != null
                    ? "green"
                    : params.row.transactionPaymentId != null
                    ? "red"
                    : "gray"
                }
                border
              >
                {params.row.uboId
                  ? "UBO"
                  : params.row.businessName
                  ? "Business"
                  : params.row.individualName
                  ? "Individual"
                  : params.row.counterpartyName
                  ? "Counterparty"
                  : params.row.transactionPaymentId
                  ? "Transaction"
                  : "Unknown"}
              </LabelBox>
            ),
            valueGetter: (value: any, row: any) =>
              row.uboId
                ? "UBO"
                : row.businessName
                ? "Business"
                : row.individualName
                ? "Individual"
                : row.counterpartyName
                ? "Counterparty"
                : row.transactionPaymentId
                ? "Transaction"
                : "Unknown",
          },
          {
            field: "alertId",
            headerName: "Alert ID",
            flex: 1,
            minWidth: 120,
          },
          {
            field: "status",
            headerName: "Status",
            flex: 1,
            minWidth: 120,
            display: "flex",
            renderCell: (params: any) => (
              <LabelBox
                color={
                  params.row?.status == "CLEARED"
                    ? "green"
                    : params.row?.status == "CONFIRMED"
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
            field: "updatedAt",
            headerName: "Updated",
            flex: 1,
            minWidth: 140,
            valueFormatter: (params: any) => {
              return `${timestampToDate(params)}`;
            },
            valueGetter: (value: any, row: any) => row.updatedAt,
          },
          {
            field: "updatedBy",
            headerName: "Updated By",
            flex: 1,
            minWidth: 160,
          },
          {
            field: "note",
            headerName: "Note",
            flex: 1,
            minWidth: 140,
            display: "flex",
            renderCell: (params: any) =>
              params.row.note != undefined && params.row.note != null ? (
                <IconButton className="text-[#12A7FF]">
                  <DescriptionIcon />
                </IconButton>
              ) : (
                <></>
              ),
          },
        ]}
        rows={ofacsHits}
        sortModel={[{ field: "createdAt", sort: "desc" }]}
      />
      {/* </div> */}
    </>
  );
};

export default OFACHitsTable;
