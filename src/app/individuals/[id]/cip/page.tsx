"use client";

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
import {
  fetchIndividual,
  fetchIndividualCIPStatus,
} from "@/redux/slices/IndividualSlice";
import { decrypt } from "@/redux/slices/encryption_slice";

function tryParse(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

const IndividualDetails = ({ params }: { params: { id: string } }) => {
  const dispatch = useAppDispatch();

  const [cipStatus, setCipStatus] = useState<"loading" | string | any>(
    "loading"
  );

  const [showEncryptedResult, setShowEncryptedResult] = useState(false);

  useEffect(() => {
    dispatch(fetchIndividual(parseInt(params.id))).then((d: any) => {
      if (typeof d.payload != "string") {
        dispatch(setTitle(d.payload.firstName + " " + d.payload.lastName));
      }
    });

    setCipStatus("loading");
    dispatch(fetchIndividualCIPStatus(params.id)).then((cipStatus: any) => {
      if (cipStatus.payload.result != null) {
        dispatch(decrypt(cipStatus.payload.result)).then((d: any) => {
          if (typeof d.payload == "string") {
            setCipStatus({ ...cipStatus.payload, result: d.payload });
          } else {
            setCipStatus({ ...cipStatus.payload, result: d.payload.data });
          }
        });
      } else {
        setCipStatus(cipStatus.payload);
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

  return (
    <>
      {cipStatus == "loading" ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading Individual data...</div>
        </div>
      ) : typeof cipStatus == "string" ? (
        <ErrorPage
          error="Error fetching individual CIP status"
          recoveryButtonOnClick={() => {
            dispatch(fetchIndividual(parseInt(params.id))).then((d: any) => {
              if (typeof d.payload != "string") {
                dispatch(
                  setTitle(d.payload.firstName + " " + d.payload.lastName)
                );
              }
            });

            setCipStatus("loading");
            dispatch(fetchIndividualCIPStatus(params.id)).then((d: any) => {
              setCipStatus(d.payload);
            });
          }}
          recoveryButtonTitle="Retry"
        />
      ) : cipStatus.cipStatus == null ? (
        <MyText>No CIP Information found</MyText>
      ) : (
        <div className="flex flex-col justify-between h-fit">
          <div className="flex flex-row justify-between w-[400px] items-start">
            <div className="flex flex-row pb-6 items-center gap-2">
              <MyText>Is Developer Initiated</MyText>
              {cipStatus.isDeveloperInitiated ? (
                <LabelBox color={"gray"} fill>
                  True
                </LabelBox>
              ) : (
                <LabelBox color={"gray"} fill>
                  False
                </LabelBox>
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
          <div className="flex flex-row pb-6 items-start">
            <div className="pr-2">
              <MyText>Provider</MyText>
            </div>
            <div className="flex flex-col">
              {cipStatus.provider.map((provider: any, index: number) => {
                return (
                  <div key={index}>
                    <MyText>{provider}</MyText>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="pb-6">
            {!showEncryptedResult ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowEncryptedResult(!showEncryptedResult);
                }}
              >
                <MyText primary>Show Results</MyText>
              </div>
            ) : (
              <div className="flex flex-row">
                {tryParse(cipStatus.result) ? (
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
                ) : typeof cipStatus.result == "string" ? (
                  <MyText>{cipStatus.result}</MyText>
                ) : (
                  <div className="pb-6">
                    <XMLViewer xml={cipStatus.result} />
                  </div>
                )}
                <div
                  className="cursor-pointer pl-10"
                  onClick={() => {
                    setShowEncryptedResult(!showEncryptedResult);
                  }}
                >
                  <MyText primary>Hide Results</MyText>
                </div>
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

export default IndividualDetails;
