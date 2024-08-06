"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { GridCellParams, GridEventListener, MuiEvent } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { OFAC } from "@/core/api/ApiTypes";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
import MyTable from "@/core/components/Table/MyTable";
import timestampToDate from "@/core/utils/timestampToDate";
import { fetchOFACHits } from "@/redux/slices/OFACSlice";
import { fetchCounterParty } from "@/redux/slices/CounterpartySlice";
import linkToCounterparty from "@/core/utils/link_to_counterparty";
import ErrorPage from "@/core/components/error_page";
import DescriptionIcon from "@mui/icons-material/Description";
import IconButton from "@mui/material/IconButton";
import MyText from "@/core/components/Text/Text";
import MyModal from "@/core/components/my_modal";

const OFACHitsTable = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const ofacsHits: OFAC[] | null = useSelector(
    (state: any) => state.ofac.OFACs
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

  useEffect(() => {
    dispatch(fetchOFACHits()).then(() => {
      setLoading(false);
    });
  }, [dispatch]);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    router.push(`/compliance/ofac/${params.row.ofacId}`);
  };

  const navigateToEntity = async (row: any) => {
    if (row.uboId) {
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

  return loading ? (
    <div className="flex flex-col items-center justify-center">
      <CircularProgress></CircularProgress>
      <div>Loading OFAC checks...</div>
    </div>
  ) : ofacsHits == null ? (
    <ErrorPage
      error="Error loading OFAC checks"
      recoveryButtonOnClick={() => {
        setLoading(true);
        dispatch(fetchOFACHits()).then(() => {
          setLoading(false);
        });
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
      <div
        style={navigating ? { pointerEvents: "none" } : {}}
        className="h-full"
      >
        <MyTable
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
                return `${timestampToDate(params.value)}`;
              },
              valueGetter: (params: any) => params.row.createdAt,
            },
            {
              field: "entity",
              headerName: "Entity",
              flex: 1,
              minWidth: 160,
              renderCell: (params: any) => (
                <MyText
                  primary={
                    params.row.businessName == null &&
                    params.row.individualName == null &&
                    params.row.counterpartyName == null
                      ? false
                      : true
                  }
                  underline={
                    params.row.businessName == null &&
                    params.row.individualName == null &&
                    params.row.counterpartyName == null
                      ? false
                      : true
                  }
                  size="md"
                >
                  {params.row.businessName ??
                    params.row.individualName ??
                    params.row.counterpartyName ??
                    "Unknown"}
                </MyText>
              ),
              valueGetter: (params: any) =>
                params.row.businessName ??
                params.row.individualName ??
                params.row.counterpartyName ??
                "Unknown",
            },
            {
              field: "entityType",
              headerName: "Entity Type",
              flex: 1,
              minWidth: 140,
              renderCell: (params: any) => (
                <div>
                  {params.row.uboId
                    ? "UBO"
                    : params.row.businessName
                    ? "Business"
                    : params.row.individualName
                    ? "Individual"
                    : params.row.counterpartyName
                    ? "Counterparty"
                    : "Unknown"}
                </div>
              ),
              valueGetter: (params: any) =>
                params.row.uboId
                  ? "UBO"
                  : params.row.businessName
                  ? "Business"
                  : params.row.individualName
                  ? "Individual"
                  : params.row.counterpartyName
                  ? "Counterparty"
                  : "Unknown",
            },
            {
              field: "status",
              headerName: "Status",
              flex: 1,
              minWidth: 120,
            },
            {
              field: "updatedAt",
              headerName: "Updated",
              flex: 1,
              minWidth: 140,
              valueFormatter: (params: any) => {
                return `${timestampToDate(params.value)}`;
              },
              valueGetter: (params: any) => params.row.updatedAt,
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
      </div>
    </>
  );
};

export default OFACHitsTable;
