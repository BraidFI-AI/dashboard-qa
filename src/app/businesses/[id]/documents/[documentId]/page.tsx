"use client";

import { setTitle } from "@/redux/slices/AppSlice";
import { useAppDispatch } from "@/redux/store/store";
import axios from "axios";
import { useEffect, useState } from "react";
import { BsArrowsFullscreen } from "react-icons/bs";
import CircularProgress from "@mui/material/CircularProgress";
import MyText from "@/core/components/Text/Text";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { useParams, useSearchParams } from "next/navigation";
import { SCROLLBAR_STYLE } from "@/core/constants";

const ViewDocument = () => {
  const params = useParams();

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const [documnetUrl, setDocumnetUrl] = useState<string>("");

  useEffect(() => {
    dispatch(setTitle("Business Customer"));

    axios({
      method: "GET",
      url: decodeURIComponent((params.documentId as string) || "0"),
      responseType: "blob",
    })
      .then((response) => {
        const blobUrl = URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" })
        );
        setDocumnetUrl(blobUrl + "#toolbar=0&navpanes=0&scrollbar=0");
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching document", error);
        setDocumnetUrl("Error fetching document: " + error);
        setLoading(false);
      });

    return () => {
      if (documnetUrl) {
        URL.revokeObjectURL(documnetUrl);
      }
    };
  }, [dispatch, params.id, params.documentId, params]);

  const handleFullscreen = () => {
    const container = document.getElementById("pdf-container");

    if (container) {
      if (!document.fullscreenElement) {
        container.requestFullscreen();
      } else {
        document.exitFullscreen();
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

  return (
    <div className="pt-6 h-[75vh]">
      {loading ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading Documents...</div>
        </div>
      ) : documnetUrl == null ? (
        <MyText size="md">Document Not Found</MyText>
      ) : documnetUrl.includes("Error fetching document:") ? (
        <MyText size="md">{documnetUrl}</MyText>
      ) : (
        <div className="h-full w-full flex flex-row justify-between py-4">
          <div
            id="pdf-container"
            className={`w-3/4 h-full justify-center items-center overflow-auto
           mx-auto border-2 border-slate-400 bg-white ${SCROLLBAR_STYLE}`}
          >
            <div className={`h-full w-full mx-auto ${SCROLLBAR_STYLE}`}>
              <object
                data={documnetUrl}
                type="application/pdf"
                width="100%"
                height="100%"
              ></object>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewDocument;
