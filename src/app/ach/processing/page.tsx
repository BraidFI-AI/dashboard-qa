"use client";

import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyCheckbox from "@/core/components/Button/MyCheckbox ";
import RadioButton from "@/core/components/Button/RadioButton";
import MyText from "@/core/components/Text/Text";
import { ADMIN_ROLE } from "@/core/constants";
import { getTextFromFile } from "@/core/utils/file_processing_util";
import {
  uploadInboundFile,
  uploadOutboundFile,
} from "@/redux/slices/ach_processing_slice";
import { useAppDispatch } from "@/redux/store/store";
import Head from "next/head";
import Script from "next/script";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const ProcessingPage = () => {
  const dispatch = useAppDispatch();

  const userType = useSelector((state: any) => state.app.userType);

  const [fileType, setFileType] = useState<"Receiving" | "Originating">(
    "Receiving"
  );

  const [achFile, setACHFile] = useState<any>(null);

  const [submitting, setSubmitting] = useState(false);

  return (
    <div>
      <MyText size="md">Upload ACH file for processing</MyText>
      <div className="pb-4" />
      <RadioButton
        title="File type"
        value={fileType}
        setValue={setFileType}
        options={
          userType == ADMIN_ROLE
            ? ["Receiving", "Originating"]
            : ["Originating"]
        }
        layout="horizontal"
      />
      <div className="pb-4" />
      <input
        type="file"
        accept="application/text, application/ach"
        onChange={(event) => {
          if (
            event?.target?.files != null &&
            event?.target?.files?.length != 0
          ) {
            const filename = event.target.files[0].name;
            const extension = filename.substring(filename.lastIndexOf(".") + 1);

            if (extension.toLowerCase() != "txt" && extension != "ach") {
              enqueueSnackbar("Only text and ach files are allowed", {
                variant: "error",
              });

              // unselecting the file
              event.target.value = "";
              return;
            }

            setACHFile(event.target.files[0]);
          }
        }}
      />
      <div className="pb-6" />
      <div className="w-fit">
        <MyBlueButton
          submitting={submitting}
          onClick={async () => {
            setSubmitting(true);
            if (!achFile) {
              enqueueSnackbar("Please select ach file first", {
                variant: "error",
              });
              setSubmitting(false);
              return;
            }

            const fileText = await getTextFromFile(
              achFile,
              "Error parsing ach file"
            );
            if (!fileText) {
              setSubmitting(false);
              return;
            }

            let up: any;
            if (fileType == "Receiving") {
              up = await dispatch(uploadInboundFile(fileText));
            } else {
              up = await dispatch(uploadOutboundFile(fileText));
            }

            if (!up.payload || typeof up.payload == "string") {
              enqueueSnackbar(up.payload, { variant: "error", persist: true });
            } else {
              enqueueSnackbar(
                `Ach file successfully uploaded (filename: ${
                  up.payload.filename ?? ""
                })`,
                {
                  variant: "success",
                  persist: true,
                }
              );
            }

            setSubmitting(false);
          }}
        >
          Upload ACH file
        </MyBlueButton>
      </div>
    </div>
  );
};

export default ProcessingPage;
