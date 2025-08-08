"use client";

import { BusinessKYC, Individual } from "@/core/api/ApiTypes";
import MyTable from "@/core/components/Table/MyTable";
import MyText from "@/core/components/Text/Text";
import { fetchBusiness, fetchUboKycStatus } from "@/redux/slices/BusinessSlice";
import { useAppDispatch } from "@/redux/store/store";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import { GridCellParams, GridEventListener, MuiEvent } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { setTitle } from "@/redux/slices/AppSlice";
import Link from "next/link";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { useParams } from "next/navigation";

const UBOs = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [uboIndividualDetails, setUboIndividualDetails] = useState<
    Individual[] | null
  >(null);
  const [uboKYCData, setUboKYCData] = useState<BusinessKYC[] | null>(null);
  const [UBOModalOpen, setUBOModalOpen] = useState<boolean>(false);
  const [selectedUBO, setSelectedUBO] = useState<any>(null);
  const apiRef = React.createRef<any>();
  const params = useParams();
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

  useEffect(() => {
    dispatch(setTitle("Business Customer"));
    dispatch(fetchBusiness(parseInt((params.id as string) || "0"))).then(
      (business: any) => {
        if (business.payload != null) {
          dispatch(setTitle(business.payload.name));
          dispatch(fetchUboKycStatus(business.payload)).then((data: any) => {
            if (data.payload != null) {
              setUboIndividualDetails(data.payload.details);
              setUboKYCData(data.payload.kyc);
            }
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      }
    );
  }, [dispatch, params.id]);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    // getting index from row id

    if (uboIndividualDetails) {
      uboIndividualDetails.forEach((row: any) => {
        if (row.id == params.id) {
          let kyc: any = null;
          uboKYCData?.forEach((uboKyc: BusinessKYC) => {
            if (uboKyc.customerId == params.id) {
              kyc = uboKyc;
            }
          });

          setSelectedUBO({ details: row, kyc: kyc });
        }
      });

      handleUBOModalOpen();
    }
  };
  const handleUBOModalOpen = () => setUBOModalOpen(true);
  const handleUBOModalClose = () => setUBOModalOpen(false);

  return (
    <div className="pt-6">
      <Box className="w-40 pb-4">
        <Link href={`/businesses/${params.id}/ubo/create`}>
          <MyBlueButton>Create UBO</MyBlueButton>
        </Link>
      </Box>
      {loading ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading UBO data...</div>
        </div>
      ) : uboIndividualDetails == null || uboIndividualDetails.length == 0 ? (
        <MyText size="md">No UBO found</MyText>
      ) : (
        <>
          {uboIndividualDetails && selectedUBO != null && (
            <Modal open={UBOModalOpen} onClose={handleUBOModalClose}>
              <Box className="w-[480px]" sx={ModalBoxstyle}>
                <MyText size="lg">Details</MyText>
                <div className="h-4"></div>
                <ItemRow
                  title="Name"
                  value={
                    selectedUBO?.details?.firstName +
                    " " +
                    selectedUBO?.details?.middleName +
                    " " +
                    selectedUBO?.details?.lastName
                  }
                ></ItemRow>
                <ItemRow
                  title="Email"
                  value={selectedUBO?.details?.ubo?.email}
                ></ItemRow>
                <div className="h-1"></div>
                <Divider />
                <div className="h-4"></div>
                <MyText size="lg">KYC</MyText>
                <div className="h-4"></div>
                {uboKYCData != null &&
                uboKYCData.length != 0 &&
                selectedUBO.kyc != null ? (
                  <>
                    <ItemRow
                      title="Verification Status"
                      value={selectedUBO?.kyc?.verificationStatus}
                    ></ItemRow>
                    <ItemRow
                      title="Verification Start Date"
                      value={selectedUBO?.kyc?.startDateTime
                        ?.toString()
                        ?.replaceAll(",", "-")}
                    ></ItemRow>
                    {selectedUBO.completeDateTime != null && (
                      <ItemRow
                        title="Verification Completion Date"
                        value={selectedUBO?.kyc?.completeDateTime
                          ?.toString()
                          ?.replaceAll(",", "-")}
                      ></ItemRow>
                    )}
                  </>
                ) : (
                  <MyText size="sm">No KYC Data found</MyText>
                )}
              </Box>
            </Modal>
          )}
          <div>
            <MyTable
              apiRef={apiRef}
              handleCellClick={(
                params: GridCellParams,
                event: MuiEvent<React.MouseEvent>
              ) => {
                if (params.field == "id") {
                  event.stopPropagation();
                }
              }}
              columns={[
                {
                  field: "uboId",
                  headerName: "UBO ID",
                  flex: 1,
                  minWidth: 120,
                  valueGetter(value: any, row: any) {
                    if (!value) {
                      return row.ubo.id;
                    }
                    return row.ubo.id;
                  },
                },
                {
                  field: "id",
                  headerName: "Customer ID",
                  flex: 1,
                  minWidth: 120,
                  display: "flex",
                  renderCell: (params: any) => (
                    <Link href={`/individuals/${params.row.id}`}>
                      <div className="underline text-[#12A7FF]">
                        {params.row.id}
                      </div>
                    </Link>
                  ),
                  valueGetter: (value: any, row: any) => row.id,
                },
                {
                  field: "name",
                  headerName: "Name",
                  flex: 1,
                  minWidth: 160,
                  valueGetter(value: any, row: any) {
                    if (!value) {
                      return row.firstName + " " + row.lastName;
                    }
                    return row.firstName + " " + row.lastName;
                  },
                },
                {
                  field: "email",
                  headerName: "Email",
                  flex: 1,
                  minWidth: 180,
                  valueGetter(value: any, row: any) {
                    if (!value) {
                      return row.ubo.email;
                    }
                    return row.ubo.email;
                  },
                },
                {
                  field: "uboTitle",
                  headerName: "Title",
                  flex: 1,
                  minWidth: 120,
                  valueGetter(value: any, row: any) {
                    if (!value) {
                      return row.ubo.title;
                    }
                    return row.ubo.title;
                  },
                },
                {
                  field: "uboOwnership",
                  headerName: "Ownership",
                  flex: 1,
                  minWidth: 120,
                  valueGetter(value: any, row: any) {
                    if (!value) {
                      return `${row.ubo.ownership}%`;
                    }
                    return `${row.ubo.ownership}%`;
                  },
                },
                {
                  field: "customerVerified",
                  headerName: "KYC Status",
                  flex: 1,
                  minWidth: 120,
                },
              ]}
              handleRowClick={handleRowClick}
              rows={uboIndividualDetails}
            />
          </div>
        </>
      )}
    </div>
  );
};

type ItemRowProps = {
  title: any;
  value: any;
};
const ItemRow: React.FC<ItemRowProps> = ({ title, value }) => {
  return (
    <Box className="flex flex-row justify-between pb-2">
      <MyText size="sm">{title}</MyText>

      <div className="w-2/3 break-all">
        <MyText size="sm">{value}</MyText>
      </div>
    </Box>
  );
};

export default UBOs;
