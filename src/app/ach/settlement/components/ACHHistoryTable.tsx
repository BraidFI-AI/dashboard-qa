"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { GridCellParams, GridEventListener, MuiEvent } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { ACHSettlementHistory } from "@/core/api/ApiTypes";
import CircularProgress from "@mui/material/CircularProgress";
import { approveSettlement, downloadACHFile } from "@/redux/slices/ACHSlice";
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

const ACHHistoryTable = () => {
  const dispatch = useAppDispatch();

  const achHistory = useSelector(
    (state: any) => state.ach.achSettlementHistory
  );

  const [ACHModalOpen, setACHModalOpen] = useState<boolean>(false);
  const [selectedACH, setSelectedACH] = useState<any>(null);

  const handleACHModalOpen = () => setACHModalOpen(true);
  const handleACHModalClose = () => setACHModalOpen(false);

  const [approving, setApproving] = useState<string[]>([]);

  const ModalBoxstyle = {
    position: "absolute" as any as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: "5px",
    boxShadow: 24,
    p: 4,
  };

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

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    if (achHistory) {
      achHistory.forEach((row: any) => {
        if (row.filename == params.id) {
          setSelectedACH(row);
        }
      });

      handleACHModalOpen();
    }
  };

  return (
    <>
      {achHistory && selectedACH != null && (
        <Modal open={ACHModalOpen} onClose={handleACHModalClose}>
          <Box className="w-[480px]" sx={ModalBoxstyle}>
            <MyText size="lg">Details</MyText>
            <div className="h-4"></div>
            <ItemRow title="File Name" value={selectedACH.filename}></ItemRow>
            <ItemRow
              title="Extracted at"
              value={selectedACH.extracted ? selectedACH.extracted : null}
            ></ItemRow>
            <ItemRow
              title="Product"
              value={{
                value: selectedACH.productName,
                link: `/configuration/products/${selectedACH.productId}`,
              }}
            ></ItemRow>
            <ItemRow
              title="instruction Count"
              value={selectedACH.instructionCount}
            ></ItemRow>
            <ItemRow
              title="Debit Amount"
              value={toDollarFormat(selectedACH.totalDebitAmount)}
            ></ItemRow>
            <ItemRow
              title="Credit Amount"
              value={toDollarFormat(selectedACH.totalCreditAmount)}
            ></ItemRow>
            <ItemRow
              title="Debit Count"
              value={selectedACH.totalDebitCount}
            ></ItemRow>
            <ItemRow
              title="Credit Count"
              value={selectedACH.totalCreditCount}
            ></ItemRow>
          </Box>
        </Modal>
      )}
      <div style={{ height: "77vh" }}>
        <MyTable
          customId={(row: ACHSettlementHistory) => row.filename}
          handleRowClick={handleRowClick}
          handleCellClick={(
            params: GridCellParams,
            event: MuiEvent<React.MouseEvent>
          ) => {
            if (
              params.field == "status" ||
              params.field == "file" ||
              params.field == "productName"
            ) {
              event.stopPropagation();
            }
          }}
          columns={[
            {
              field: "filename",
              headerName: "File Name",
              flex: 2,
              minWidth: 140,
            },
            {
              field: "extracted",
              headerName: "Extracted at",
              flex: 2,
              minWidth: 120,
              valueFormatter: (params: any) => {
                return `${moment(params.value)}`;
              },
              valueGetter: (params: any) => params.row.extracted,
            },
            {
              field: "productName",
              headerName: "Product Name",
              flex: 1,
              minWidth: 120,
              renderCell: (params: any) => (
                <MyLinkText
                  link={`/configuration/products/${params.row.productId}`}
                >
                  {params.row.productName}
                </MyLinkText>
              ),
            },
            {
              field: "instructionCount",
              headerName: "Instruction Count",
              flex: 1,
              minWidth: 120,
            },
            {
              field: "totalDebitAmount",
              headerName: "Debit Amount",
              flex: 1,
              minWidth: 120,
              valueGetter: (params: any) =>
                toDollarFormat(params.row?.totalDebitAmount),
            },
            {
              field: "totalCreditAmount",
              headerName: "Credit Amount",
              flex: 1,
              minWidth: 120,
              valueGetter: (params: any) =>
                toDollarFormat(params.row?.totalCreditAmount),
            },
            {
              field: "totalDebitCount",
              headerName: "Debit Count",
              flex: 1,
              minWidth: 120,
            },
            {
              field: "totalCreditCount",
              headerName: "Credit Count",
              flex: 1,
              minWidth: 120,
            },
            {
              field: "status",
              headerName: "Status",
              flex: 1,
              minWidth: 120,
              renderCell: (params: any) =>
                params.row.status == "SUBMITTED" ? (
                  <Tooltip title="Approve Settlement" placement="right">
                    <div className="flex justify-center">
                      <MyBlueButton
                        submitting={approving.includes(params.row.filename)}
                        onClick={() => {
                          if (params != null) {
                            updateApprovingArr(params.row.filename, true);
                            dispatch(
                              approveSettlement({
                                productId: params.row.productId,
                                filename: params.row.filename,
                              })
                            ).then((d: any) => {
                              updateApprovingArr(params.row.filename, false);
                              if (d.payload) {
                                enqueueSnackbar("Settlement approved", {
                                  variant: "success",
                                });

                                let tH = [...achHistory];
                                let h = tH.find(
                                  (e) => e.filename == params?.row?.filename
                                );
                              } else {
                                // enqueueSnackbar(d.payload, {
                                //   variant: "error",
                                //   persist: true,
                                // });
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
                      : ""}
                  </div>
                ),
            },
            {
              field: "file",
              headerName: "ACH File",
              width: 82,
              renderCell: (params: any) => (
                <Tooltip title="Download ACH Setllment File" placement="right">
                  <div className="flex justify-center">
                    <MyBlueButton
                      onClick={() => {
                        if (params != null) {
                          dispatch(
                            downloadACHFile({
                              productId: params.row.productId,
                              filename: params.row.filename,
                            })
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
          ]}
          rows={achHistory}
          sortModel={[{ field: "extracted", sort: "desc" }]}
        />
      </div>
    </>
  );
};
export default ACHHistoryTable;
