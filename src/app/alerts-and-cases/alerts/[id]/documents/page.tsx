"use client";

import { Alert, AlertDocument } from "@/core/api/ApiTypes";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import ItemRow from "@/core/components/Text/ItemRow";
import MyText from "@/core/components/Text/Text";
import timestampToDate from "@/core/utils/timestampToDate";
import { fetchAlert } from "@/redux/slices/alerts_slice";
import { setTitle } from "@/redux/slices/AppSlice";
import { useAppDispatch } from "@/redux/store/store";
import Divider from "@mui/material/Divider";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const AlertDocumentsPage = () => {
  const dispatch = useAppDispatch();
  const params = useParams();

  const alert: "loading" | string | Alert = useSelector(
    (state: any) => state.alerts.alert
  );

  useEffect(() => {
    dispatch(setTitle("Alert"));
    dispatch(fetchAlert(params.id.toString())).then((data: any) => {
      if (typeof data.payload != "string") {
        dispatch(setTitle(data.payload.type?.replaceAll("_", " ")));
      }
    });
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

  return alert == "loading" ? (
    <MyCircularProgressIndicator />
  ) : typeof alert == "string" ? (
    <ErrorPage
      error={alert}
      recoveryButtonTitle="Retry"
      recoveryButtonOnClick={() => {
        dispatch(fetchAlert(params.id.toString())).then((data: any) => {
          if (typeof data.payload != "string") {
            dispatch(setTitle(data.payload.type?.replaceAll("_", "")));
          }
        });
      }}
    />
  ) : alert.alertDocuments == null || alert.alertDocuments.length == 0 ? (
    <MyText>No documents</MyText>
  ) : (
    alert.alertDocuments.map((document: AlertDocument, index: number) => {
      return (
        <div key={index} className="flex flex-col pb-4">
          <div className="flex flex-row w-full pb-4">
            <div className="w-[600px]">
              <ItemRow title="ID" value={document.id ?? ""}></ItemRow>
              <ItemRow
                title="Type"
                value={document.documentType ?? ""}
              ></ItemRow>
              <ItemRow title="Status" value={document.status ?? ""}></ItemRow>
              <ItemRow
                title="Description"
                value={document.description ?? ""}
              ></ItemRow>
              <ItemRow
                title="CreatedAt"
                value={timestampToDate(document.createdAt)}
              ></ItemRow>
              <ItemRow
                title="UpdatedAt"
                value={timestampToDate(document.updatedAt)}
              ></ItemRow>
            </div>
            <div className="flex w-[360px] justify-center items-center">
              {document.status === "REQUIRED" ? (
                <div className="text-red-500">
                  <MyText size="md">Document is Required</MyText>
                </div>
              ) : (
                <>
                  {document.fileType == "image" ? (
                    <div className="relative w-[360px] h-[200px]">
                      <Image
                        layout="fill"
                        objectFit="contain"
                        alt={document.documentType ?? ""}
                        id={document.id?.toString()}
                        className="rounded-xl hover:cursor-zoom-in"
                        src={document.documentUrl ?? ""}
                        loading="lazy"
                        onClick={() =>
                          handleFullscreen(document.id?.toString() ?? "")
                        }
                      ></Image>
                    </div>
                  ) : (
                    <div className=" underline text-[#12A7FF]">
                      <Link
                        href={`/alerts-and-cases/alerts/${params.id.toString()}/documents/${encodeURIComponent(
                          (document as any).documentUrl
                        )}`}
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
  );
};

export default AlertDocumentsPage;
