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
import { useSearchParams } from "next/navigation";
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const ViewDocument = ({
  params,
}: {
  params: { id: string; documentId: number };
}) => {
  const qParams = useSearchParams();

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const [documnetUrl, setDocumnetUrl] = useState<string>("");

  useEffect(() => {
    dispatch(setTitle("Business Customer"));

    axios({
      method: "GET",
      url: "https://braid-590183986430-us-east-1-project-customer-documents.s3.amazonaws.com/EIN_CONFIRMATION/jake%40braidfi.com.pdf?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEB4aCXVzLWVhc3QtMSJHMEUCIHUZXuvk%2FV4ehc4djQBLzRHrrsVVihzC3T5wNe9GQfVMAiEAjiV5%2Be4DsdYw7GSqdvf0wECxGo8CpA7jSR%2Fe%2BUTgaFEq7QMIRhAAGgw1OTAxODM5ODY0MzAiDIFfO6br36O4A4iKnSrKAyyEEKPd5EzsJQ%2BiTR98sJPSxtn8YDDECw9348PE1pin44CuWkuccr8KxjSx9Dy2DyzzZLbcXjZ7CmawibWx%2FMajfOnPwwGRiiiWBaYA8pX9yq6b9vbz3SA6WhNwYDToNLQbtFjQMmdzr9kAPMpuAWHL%2BXpUV%2FfRszA9EfN9zDU5MsmSqKoIAWCJMVT9VtD8LUBXoogmkgoT9lW%2Ft%2Fn24n3F%2F4xXtPHDBggeg%2BPrymvAi8AUI75JqcTaP0tj5ufveHmWo6n2YE4xu4oOfe1C8kb7wS0IoMyGmTl%2B71Nc6f950zU%2BX7W%2FJqQR3VUFORN9CoJo1mCSjTdikos4lq1FvB8J5Eh2eXFQqcNpiq%2BsQKJpD1SOVuIjigzwC3V5PrX7bGZrwi5NEdlKdT7Ux%2BMO1yYKCfdIlDb7zC1J6zLTjmiS0fKc8r41PKEeKbKNFI3Kl82aMmudaa6jUa%2FmzZ2dd0S7mTlddIuoTJe5OoW9ra6QWmiCivLa5cm5iJxkMWHlrastZ8qB%2BmRrR%2BWbu1bRnxdpdq1jTexoTiLThDEn5dnVAS4Kk8KXk4ydWthz0%2FsIcIflZba2MnNuSUSaYJiQEpiw%2F06DQ8ochhXEMLjD9rYGOqUB%2Bvia1uHlfnM8qOglbkS5l%2Fvs5vX78aUpAW7Nn9YO%2FLcyFEovip2MWCuCMTTfAPzpaWiIDJLmqgOePvkdQnetsavay%2BrSA3kg0iIFIMGME8auGan4YsZ8jyPutTPPtfxHfV2e0fDoLuPjXfqBC9T9vLz%2F6ULsChtIEyOEZW28MKkmW8NaKvqrog1n5SrJp2xP7m9gVRFWJO5txBxY%2Boep3PUkhEOY&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240908T131243Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIAYS2NU6T7ABTPTHKL%2F20240908%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=48f17f8637c03d2608984d198d2df3b4ecb9a9cb6437d6d95ef44bd6b565d162",
      responseType: "blob",
    })
      .then((response) => {
        const blobUrl = URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" })
        );
        setDocumnetUrl(blobUrl);
        setPdfResponse(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching document", error);
        setLoading(false);
      });

    return () => {
      if (documnetUrl) {
        URL.revokeObjectURL(documnetUrl);
      }
    };
  }, [dispatch, params.id, params.documentId, qParams]);

  const defaultScale = 1;
  const [pdfResponse, setPdfResponse] = useState<any>();
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
              <object
                data={documnetUrl}
                type="application/pdf"
                width="100%"
                height="600px"
                // style="width:600px; height:500px;"
                // frameborder="0"
              ></object>

              {/* <Document
                options={{ isEvalSupported: false }}
                options={{ isEvalSupported: false }}
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
              </Document> */}
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
