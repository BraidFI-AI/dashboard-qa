"use client";

import { BusinessDocumentWithLink } from "@/core/api/ApiTypes";
import Box from "@mui/material/Box";
import { timestampToDate } from "@/core/utils/date_time_util";
import {
  fetchBusiness,
  fetchBusinessDocuments,
} from "@/redux/slices/BusinessSlice";
import { useAppDispatch } from "@/redux/store/store";
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { setTitle } from "@/redux/slices/AppSlice";
import MyText from "@/core/components/Text/Text";
import Link from "next/link";
import Image from "next/image";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

const Documents = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<BusinessDocumentWithLink[]>([]);

  useEffect(() => {
    dispatch(setTitle("Business Customer"));
    dispatch(fetchBusiness(parseInt((params.id as string) || "0"))).then(
      (business: any) => {
        if (business.payload != null) {
          dispatch(setTitle(business.payload.name));

          dispatch(fetchBusinessDocuments(business.payload.id)).then(
            (data: any) => {
              if (data.payload) {
                setDocuments(data.payload);
              }
              setLoading(false);
            }
          );
        } else {
          setLoading(false);
        }
      }
    );
  }, [dispatch, params.id]);

  const handleFullscreen = (id: string) => {
    const container = document.getElementById(id);

    if (container) {
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <>
      <div className="pb-10 w-[180px]">
        <MyBlueButton
          onClick={() => {
            router.push("documents/create");
          }}
        >
          Upload Document
        </MyBlueButton>
      </div>
      {loading ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading Documents...</div>
        </div>
      ) : documents == null || documents.length == 0 ? (
        <MyText size="md">No documents found</MyText>
      ) : (
        documents.map((document: BusinessDocumentWithLink, index: number) => {
          return (
            <div key={index} className="flex flex-col pb-4">
              <div className="flex flex-row w-full pb-4">
                <div className="w-[600px]">
                  <ItemRow title="ID" value={document.document.id}></ItemRow>
                  <ItemRow
                    title="Customer ID"
                    value={document.document.customerId}
                  ></ItemRow>
                  <ItemRow
                    title="Name"
                    value={document.document.name}
                  ></ItemRow>
                  <ItemRow
                    title="Description"
                    value={document.document.description}
                  ></ItemRow>
                  <ItemRow
                    title="Type"
                    value={document.document.documentType}
                  ></ItemRow>
                  <ItemRow
                    title="Status"
                    value={document.document.status}
                  ></ItemRow>
                  {document.document.reasonCode && (
                    <ItemRow
                      title="Reason Code"
                      value={document.document.reasonCode}
                    ></ItemRow>
                  )}
                  {document.document.reason && (
                    <ItemRow
                      title="Reason"
                      value={document.document.reason}
                    ></ItemRow>
                  )}
                  <ItemRow
                    title="CreatedAt"
                    value={timestampToDate(document.document.createdAt)}
                  ></ItemRow>
                  <ItemRow
                    title="UpdatedAt"
                    value={timestampToDate(document.document.updatedAt)}
                  ></ItemRow>
                </div>
                <div className="flex w-[360px] justify-center items-center">
                  {document.document.status === "REQUIRED" ? (
                    <div className="text-red-500">
                      <MyText size="md">Document is Required</MyText>
                    </div>
                  ) : (
                    <>
                      {document.document.fileType == "image" ? (
                        <div className="relative w-[360px] h-[200px]">
                          <Image
                            layout="fill"
                            objectFit="contain"
                            alt={
                              document.document.name
                                ? document.document.name
                                : document.document.documentType
                            }
                            id={document.document.id.toString()}
                            className="rounded-xl hover:cursor-zoom-in"
                            src={document.link}
                            loading="lazy"
                            onClick={() =>
                              handleFullscreen(document.document.id.toString())
                            }
                          ></Image>
                        </div>
                      ) : (
                        <div className="underline text-[#12A7FF]">
                          <Link
                            href={`/businesses/${parseInt(
                              (params.id as string) || "0"
                            )}/documents/${encodeURIComponent(document.link)}`}
                          >
                            <MyText size="md">View PDF</MyText>
                          </Link>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              <Divider />
            </div>
          );
        })
      )}
    </>
  );
};

type ItemRowProps = {
  title: any;
  value: any;
};
const ItemRow: React.FC<ItemRowProps> = ({ title, value }) => {
  return (
    <Box className="flex flex-row justify-between pb-2">
      <MyText size="md">{title}</MyText>

      <div className="w-1/2 break-all">
        <MyText size="md">{value}</MyText>
      </div>
    </Box>
  );
};

export default Documents;
