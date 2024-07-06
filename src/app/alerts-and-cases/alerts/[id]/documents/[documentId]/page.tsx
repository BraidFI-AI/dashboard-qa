"use client";

import { setTitle } from "@/redux/slices/AppSlice";
import { fetchBusinessDocumentUrl } from "@/redux/slices/BusinessSlice";
import { useAppDispatch } from "@/redux/store/store";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { BsPlus, BsArrowsFullscreen, BsDash } from "react-icons/bs";
import { Document, Page, pdfjs } from "react-pdf";
import CircularProgress from "@mui/material/CircularProgress";
import MyText from "@/core/components/Text/Text";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { useParams } from "next/navigation";
import { Alert, AlertDocument } from "@/core/api/ApiTypes";
import { useSelector } from "react-redux";
import { fetchAlert } from "@/redux/slices/alerts_slice";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const ViewDocument = () => {
  const dispatch = useAppDispatch();
  const params = useParams();

  const alert: "loading" | string | Alert = useSelector(
    (state: any) => state.alerts.alert
  );

  const [docUrl, setDocUrl] = useState<string | null>(null);

  useEffect(() => {
    dispatch(setTitle("Alert"));
    dispatch(fetchAlert(params.id.toString())).then((data: any) => {
      if (typeof data.payload != "string") {
        dispatch(setTitle(data.payload.type?.replaceAll("_", " ")));

        const doc: AlertDocument | undefined = (
          data.payload as Alert
        ).alertDocuments?.find(
          (d: AlertDocument) => d.id == parseInt(params.documentId.toString())
        );

        if (doc != undefined && doc.documentUrl) {
          setDocUrl(doc.documentUrl);
          axios({
            method: "GET",
            url: doc.documentUrl,
            responseType: "blob",
          }).then((response) => setPdfResponse(response.data));
        }
      }
    });
  }, [dispatch, params.id, params.documentId]);

  const defaultScale = 1;
  const [pdfResponse, setPdfResponse] = useState();
  const [numPages, setNumPages] = useState(-1);
  const [scale, setScale] = useState(defaultScale);

  const handleFullscreenCallback = useCallback(() => {
    const container = document.getElementById("pdf-container");

    if (container) {
      if (!document.fullscreenElement) {
        setScale(1.4);
        container.requestFullscreen().catch(() => {
          setScale(scale);
        });
      } else {
        document.exitFullscreen();
        setScale(scale);
      }
    }
  }, [scale]);

  const handleEscapeKeyCallback = useCallback(
    (event: any) => {
      if (event.key === "Escape") {
        handleFullscreenCallback();
      }
    },
    [handleFullscreenCallback]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscapeKeyCallback);

    return () => {
      document.removeEventListener("keydown", handleEscapeKeyCallback);
    };
  }, [handleEscapeKeyCallback]);

  const handleZoomIn = () => {
    setScale((prevScale) => prevScale + 0.1);
  };

  const handleZoomOut = () => {
    setScale((prevScale) => prevScale - 0.1);
  };

  return alert == "loading" ? (
    <MyCircularProgressIndicator />
  ) : typeof alert == "string" ? (
    <ErrorPage
      error={alert}
      recoveryButtonTitle="Retry"
      recoveryButtonOnClick={() => {
        dispatch(setTitle("Alert"));
        dispatch(fetchAlert(params.id.toString())).then((data: any) => {
          if (typeof data.payload != "string") {
            dispatch(setTitle(data.payload.type?.replaceAll("_", " ")));

            const doc: AlertDocument | undefined = (
              data.payload as Alert
            ).alertDocuments?.find(
              (d: AlertDocument) =>
                d.id == parseInt(params.documentId.toString())
            );

            if (doc != undefined && doc.documentUrl) {
              setDocUrl(doc.documentUrl);
              axios({
                method: "GET",
                url: doc.documentUrl,
                responseType: "blob",
              }).then((response) => setPdfResponse(response.data));
            }
          }
        });
      }}
    />
  ) : docUrl == null ? (
    <MyText size="md">Document Not Found</MyText>
  ) : (
    <div
      className="w-full flex flex-row justify-between py-4"
      style={{ height: "75vh" }}
    >
      <div
        id="pdf-container"
        className="w-3/4 h-full justify-center items-center overflow-auto
           mx-auto border-2 border-slate-400 bg-white"
      >
        <div className={`h-full w-full mx-auto overflow-y-auto`}>
          <Document
            loading={
              <div className="flex items-center justify-center text-black text-md">
                Loading...
              </div>
            }
            file={pdfResponse}
            onLoadSuccess={(pdf) => {
              setNumPages(pdf.numPages);
            }}
          >
            {Array.from({ length: numPages }, (_, index) => (
              <div key={`page_container_${index + 1}`} className="m-4">
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  className="border"
                  scale={scale}
                  renderTextLayer={false}
                  //   noData
                />
              </div>
            ))}
          </Document>
        </div>
      </div>
      <div className={`absolute ${"right-[8%]"} top-[17%]`}>
        <div className="flex flex-col h-fit">
          <button
            onClick={handleFullscreenCallback}
            className="p-3 mt-10 rounded-full bg-slate-600 text-slate-200 flex justify-center items-center"
          >
            <BsArrowsFullscreen />
          </button>
          <div className="h-2"></div>
          <button
            onClick={handleZoomIn}
            className="p-3  rounded-full bg-slate-600 text-slate-200 flex justify-center items-center"
          >
            <BsPlus size={20} />
          </button>
          <div className="h-2"></div>
          <button
            onClick={handleZoomOut}
            className="p-3 rounded-full bg-slate-600 text-slate-200 flex justify-center items-center"
          >
            <BsDash size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDocument;
