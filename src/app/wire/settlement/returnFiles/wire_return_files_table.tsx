"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { GridCellParams, GridEventListener, MuiEvent } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { WireReturnFile } from "@/core/api/ApiTypes";
import CircularProgress from "@mui/material/CircularProgress";
import moment, { Moment } from "moment";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import Tooltip from "@mui/material/Tooltip";
import MyTable from "@/core/components/Table/MyTable";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import MyText from "@/core/components/Text/Text";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import { enqueueSnackbar } from "notistack";
import toDollarFormat from "@/core/utils/toDollarFormat";
import MyLinkText from "@/core/components/Text/LinkText";
import ItemRow from "@/core/components/Text/ItemRow";
import timestampToDate from "@/core/utils/timestampToDate";

const WireReturnFilesTable = () => {
  const dispatch = useAppDispatch();

  const wireReturnFiles = useSelector(
    (state: any) => state.wireSettlement.wireReturnFiles
  );

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedWireFile, setSelectedWireFile] = useState<any>(null);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {};

  return (
    <>
      {wireReturnFiles && selectedWireFile != null && (
        <Modal open={modalOpen} onClose={handleModalClose}>
          <></>
        </Modal>
      )}
      <div className="h-full">
        <MyTable
          customId={(row: WireReturnFile) => row.filename}
          handleRowClick={handleRowClick}
          handleCellClick={(
            params: GridCellParams,
            event: MuiEvent<React.MouseEvent>
          ) => {
            if (
              params.field == "status" ||
              params.field == "file" ||
              params.field == "productName" ||
              params.field == "sftpStatus"
            ) {
              event.stopPropagation();
            }
          }}
          columns={[
            {
              field: "filename",
              headerName: "File Name",
              flex: 1,
              minWidth: 260,
            },
            {
              field: "status",
              headerName: "Status",
              flex: 1,
              minWidth: 200,
            },
            {
              field: "transactionCount",
              headerName: "Transaction Count",
              flex: 1,
              minWidth: 200,
            },
            {
              field: "transactionAmount",
              headerName: "Transaction Amount",
              flex: 1,
              minWidth: 200,
            },
            {
              field: "createdAt",
              headerName: "Created at",
              flex: 1,
              minWidth: 120,
              valueFormatter: (params: any) => {
                return params.value == null
                  ? ""
                  : `${timestampToDate(params.value, false, true)}`;
              },
              valueGetter: (params: any) => params.row.createdAt,
            },
            {
              field: "updatedAt",
              headerName: "Updated at",
              flex: 1,
              minWidth: 120,
              valueFormatter: (params: any) => {
                return params.value == null
                  ? ""
                  : `${timestampToDate(params.value, false, true)}`;
              },
              valueGetter: (params: any) => params.row.updatedAt,
            },
          ]}
          rows={wireReturnFiles}
        />
      </div>
    </>
  );
};
export default WireReturnFilesTable;
