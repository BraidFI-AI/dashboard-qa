"use client";

import { fetchBusiness, fetchCIPStatus } from "@/redux/slices/BusinessSlice";
import { useAppDispatch } from "@/redux/store/store";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorPage from "@/core/components/error_page";
import { setTitle } from "@/redux/slices/AppSlice";
import MyText from "@/core/components/Text/Text";
import LabelBox from "@/core/components/label_box";
import { AlertDocument } from "@/core/api/ApiTypes";
import DocumentComponent from "./doc";
import XMLViewer from "react-xml-viewer";
import { JSONTree } from "react-json-tree";

function tryParse(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

const BusinessDetails = ({ params }: { params: { id: string } }) => {
  const dispatch = useAppDispatch();

  const [cipStatus, setCipStatus] = useState<"loading" | string | any>(
    "loading"
  );

  useEffect(() => {
    dispatch(fetchBusiness(parseInt(params.id))).then((d: any) => {
      if (typeof d.payload != "string") dispatch(setTitle(d.payload.name));
    });

    setCipStatus("loading");
    dispatch(fetchCIPStatus(params.id)).then((d: any) => {
      setCipStatus(d.payload);
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

  return (
    <>
      {cipStatus == "loading" ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading Business data...</div>
        </div>
      ) : typeof cipStatus == "string" ? (
        <ErrorPage
          error="Error fetching business"
          recoveryButtonOnClick={() => {
            dispatch(fetchBusiness(parseInt(params.id))).then((d: any) => {
              if (typeof d.payload != "string")
                dispatch(setTitle(d.payload.name));
            });

            setCipStatus("loading");
            dispatch(fetchCIPStatus(params.id)).then((d: any) => {
              setCipStatus(d.payload);
            });
          }}
          recoveryButtonTitle="Retry"
        />
      ) : cipStatus.cipStatus == null ? (
        <MyText>No CIP Information found</MyText>
      ) : (
        <div className="flex flex-col justify-between h-fit">
          <div className="flex flex-row justify-between w-[400px]">
            <div className="flex flex-row pb-6 items-center">
              <MyText>Type</MyText>
              {cipStatus.isDeveloperInitiated ? (
                <LabelBox color={"gray"} fill>
                  Developer Initiated
                </LabelBox>
              ) : (
                cipStatus.resultType && (
                  <LabelBox color={"gray"} fill>
                    {cipStatus.resultType}
                  </LabelBox>
                )
              )}
            </div>
            <div className="flex flex-row items-center">
              <MyText>Result</MyText>
              <div className="pl-2">
                <LabelBox
                  color={cipStatus.cipStatus == "PASS" ? "green" : "red"}
                  fill
                >
                  {cipStatus.cipStatus}
                </LabelBox>
              </div>
            </div>
          </div>
          <div className="flex flex-row pb-6 items-center">
            <div className="pr-2">
              <MyText>Provider</MyText>
            </div>
            <MyText>{cipStatus.provider}</MyText>
          </div>
          <div className="pb-6">
            {typeof cipStatus.result == "string" ? (
              <MyText>{cipStatus.result}</MyText>
            ) : tryParse(cipStatus.result) ? (
              <JSONTree
                data={JSON.parse(cipStatus.result)}
                hideRoot
                theme={{
                  base00: "#ffffff",
                  base01: "#000000",
                  base02: "#000000",
                  base03: "#000000",
                  base04: "#000000",
                  base05: "#000000",
                  base06: "#000000",
                  base07: "#000000",
                  base08: "#000000",
                  base09: "#000000",
                  base0A: "#000000",
                  base0B: "#000000",
                  base0C: "#000000",
                  base0D: "#000000",
                  base0E: "#000000",
                  base0F: "#000000",
                }}
              />
            ) : (
              <div className="pb-6">
                <XMLViewer xml={cipStatus.result} />
              </div>
            )}
          </div>
          {cipStatus.document?.map((document: AlertDocument, index: number) => {
            return (
              <div className="pb-4" key={index}>
                <DocumentComponent alertDocument={document} />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default BusinessDetails;
