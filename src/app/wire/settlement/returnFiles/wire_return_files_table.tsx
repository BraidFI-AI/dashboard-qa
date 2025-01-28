"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { GridCellParams, GridEventListener, MuiEvent } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { WireReturnFile } from "@/core/api/ApiTypes";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import Tooltip from "@mui/material/Tooltip";
import MyTable from "@/core/components/Table/MyTable";
import Modal from "@mui/material/Modal";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import { enqueueSnackbar } from "notistack";
import {
  approveWireReturnSettlement,
  downloadWireReturnFile,
} from "@/redux/slices/wire_settlement_slice";
import timestampToDate from "@/core/utils/timestampToDate";

const WireReturnFilesTable = () => {
  const dispatch = useAppDispatch();

  const wireReturnFiles = useSelector(
    (state: any) => state.wireSettlement.wireReturnFiles
  );

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedWireFile, setSelectedWireFile] = useState<any>(null);

  const [approving, setApproving] = useState<string[]>([]);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {};

  const updateApprovingArr = (filename: string, status: boolean) => {
    if (status) {
      const tempArr = [...approving];
      tempArr.push(filename);
      setApproving(tempArr);
    } else {
      const tempArr = [...approving];
      const uArr = tempArr.filter((fname: string) => fname != filename);
      setApproving(uArr);
    }
  };

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
                return params == null
                  ? ""
                  : `${timestampToDate(params, false, true)}`;
              },
              valueGetter: (value: any, row: any) => row.createdAt,
            },
            {
              field: "updatedAt",
              headerName: "Updated at",
              flex: 1,
              minWidth: 120,
              valueFormatter: (params: any) => {
                return params == null
                  ? ""
                  : `${timestampToDate(params, false, true)}`;
              },
              valueGetter: (value: any, row: any) => row.updatedAt,
            },
            {
              field: "file",
              headerName: "FedWire Return File",
              flex: 1,
              minWidth: 82,
              display: "flex",
              renderCell: (params: any) => (
                <Tooltip title="Download Wire Return File" placement="right">
                  <div className="flex justify-center">
                    <MyBlueButton
                      onClick={() => {
                        if (params != null) {
                          dispatch(
                            downloadWireReturnFile(params.row.filename)
                          ).then((d: any) => {
                            if (!d.payload || d.payload != "downloaded") {
                              enqueueSnackbar(d.payload, {
                                variant: "error",
                                persist: true,
                              });
                            }
                          });
                        }
                      }}
                    >
                      <CloudDownloadOutlinedIcon />
                    </MyBlueButton>
                  </div>
                </Tooltip>
              ),
            },
            {
              field: "status",
              headerName: "Status",
              flex: 1,
              minWidth: 120,
              display: "flex",
              renderCell: (params: any) =>
                params.row.status?.toLowerCase() == "pending" ? (
                  <Tooltip title="Approve Settlement" placement="right">
                    <div className="flex justify-center">
                      <MyBlueButton
                        submitting={approving.includes(params.row.filename)}
                        onClick={() => {
                          if (params != null) {
                            updateApprovingArr(params.row.filename, true);
                            dispatch(
                              approveWireReturnSettlement(params.row.filename)
                            ).then((d: any) => {
                              updateApprovingArr(params.row.filename, false);
                              console.log(d.payload);
                              if (typeof d.payload != "string") {
                                enqueueSnackbar("Settlement approved", {
                                  variant: "success",
                                });
                              } else {
                                enqueueSnackbar(d.payload, {
                                  variant: "error",
                                  persist: true,
                                });
                              }
                            });
                          }
                        }}
                      >
                        Approve
                      </MyBlueButton>
                    </div>
                  </Tooltip>
                ) : (
                  <div>
                    {params.row?.status
                      ? params.row?.status?.[0] +
                        params?.row?.status?.slice(1)?.toLowerCase()
                      : "NaN"}
                  </div>
                ),
            },
          ]}
          rows={wireReturnFiles}
        />
      </div>
    </>
  );
};
export default WireReturnFilesTable;
