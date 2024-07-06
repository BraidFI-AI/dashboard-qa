"use client";

import { setTitle } from "@/redux/slices/AppSlice";
import { fetchBusinessDocumentUrl } from "@/redux/slices/BusinessSlice";
import { useAppDispatch } from "@/redux/store/store";
import axios from "axios";
import { useEffect, useState } from "react";
import { BsPlus, BsArrowsFullscreen, BsDash } from "react-icons/bs";
import { Document, Page, pdfjs } from "react-pdf";
import CircularProgress from "@mui/material/CircularProgress";
import MyText from "@/core/components/Text/Text";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const ViewDocument = ({
  params,
}: {
  params: { id: string; documentId: number };
}) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const [documnetUrl, setDocumnetUrl] = useState<string | null>(null);

  useEffect(() => {
    dispatch(setTitle("Business Customer"));
    dispatch(
      fetchBusinessDocumentUrl({
        businessId: parseInt(params.id),
        documentId: params.documentId,
      })
    ).then((data: any) => {
      if (data.payload) {
        setDocumnetUrl(data.payload);
        axios({
          method: "GET",
          url: data.payload,
          responseType: "blob",
        })
          .then((response) => setPdfResponse(response.data))
          .then(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  }, [dispatch, params.id, params.documentId]);

  const defaultScale = 1;
  const [pdfResponse, setPdfResponse] = useState();
  const [numPages, setNumPages] = useState(-1);
  const [scale, setScale] = useState(defaultScale);

  const handleFullscreen = () => {
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
  };

  const handleEscapeKey = (event: any) => {
    if (event.key === "Escape") {
      handleFullscreen();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [handleEscapeKey]);

  const handleZoomIn = () => {
    setScale((prevScale) => prevScale + 0.1);
  };

  const handleZoomOut = () => {
    setScale((prevScale) => prevScale - 0.1);
  };

  return (
    <div className="h-[75vh]">
      {loading ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading Documents...</div>
        </div>
      ) : documnetUrl == null ? (
        <MyText size="md">Document Not Found</MyText>
      ) : (
        <div className="h-full w-full flex flex-row justify-between py-4">
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
                onClick={handleFullscreen}
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
      )}
    </div>
  );
};

export default ViewDocument;
