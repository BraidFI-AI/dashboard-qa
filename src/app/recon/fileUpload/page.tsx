"use client";

import RadioButton from "@/core/components/Button/RadioButton";
import MyText from "@/core/components/Text/Text";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { useAppDispatch } from "@/redux/store/store";
import { uploadReconFile } from "@/redux/slices/recon_file_upload_slice";
const FileUpload = () => {
  const dispatch = useAppDispatch();

  const [fileType, setFileType] = useState<"WIRE" | "ACH">("ACH");
  const [file, setFile] = useState<any>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes

  return (
    <div className="flex flex-col gap-4">
      <RadioButton
        title="File Type"
        value={fileType}
        setValue={setFileType}
        options={["ACH", "WIRE"]}
        layout="horizontal"
      />
      <div>
        <input
          type="file"
          accept=".csv"
          onChange={(event) => {
            if (
              event?.target?.files != null &&
              event?.target?.files?.length != 0
            ) {
              const selectedFile = event.target.files[0];
              const filename = selectedFile.name;
              const extension = filename.substring(
                filename.lastIndexOf(".") + 1
              );

              if (extension.toLowerCase() !== "csv") {
                enqueueSnackbar("Only CSV files are allowed", {
                  variant: "error",
                });

                // unselecting the file
                event.target.value = "";
                return;
              }

              if (selectedFile.size > MAX_FILE_SIZE) {
                enqueueSnackbar("File size must be less than 100MB", {
                  variant: "error",
                });

                // unselecting the file
                event.target.value = "";
                return;
              }

              setFile(selectedFile);
            }
          }}
        />
        <div className="h-[2px]" />
        <MyText size="sm">Only CSV files are allowed (max size: 100MB)</MyText>
      </div>
      <div className="w-fit pt-2">
        <MyBlueButton
          submitting={submitting}
          onClick={() => {
            if (!file) {
              enqueueSnackbar("Please select a file first", {
                variant: "error",
              });
              setSubmitting(false);
              return;
            }
            setSubmitting(true);

            dispatch(uploadReconFile({ file, type: fileType })).then((res) => {
              setSubmitting(false);
              if (typeof res.payload != "string") {
                enqueueSnackbar("File uploaded successfully", {
                  variant: "success",
                });
              } else {
                enqueueSnackbar(res.payload, {
                  variant: "error",
                  persist: true,
                });
              }
            });
          }}
        >
          Upload
        </MyBlueButton>
      </div>
    </div>
  );
};

export default FileUpload;
