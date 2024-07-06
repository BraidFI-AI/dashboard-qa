"use client";

import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch } from "@/redux/store/store";
import MyText from "@/core/components/Text/Text";
import RadioButton from "@/core/components/Button/RadioButton";
import { getTextFromFile } from "@/core/utils/file_processing_util";
import { uploadInboundWireFile } from "@/redux/slices/wire_processing_slice";

const WireProcessPage = () => {
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);

  const [fileType, setFileType] = useState<"Receiving" | "Originating">(
    "Receiving"
  );

  const [wireFile, setWireFile] = useState<any>(null);

  return (
    <>
      <div>
        <MyText size="md">Upload Wire file for processing</MyText>
        <div className="pb-4" />
        <RadioButton
          title="File type"
          value={fileType}
          setValue={setFileType}
          options={[
            { name: "Receiving", isDisabled: false },
            { name: "Originating", isDisabled: true },
          ]}
          layout="horizontal"
        />
        <div className="pb-4" />
        <input
          type="file"
          accept="application/text, application/wire"
          onChange={(event) => {
            if (
              event?.target?.files != null &&
              event?.target?.files?.length != 0
            ) {
              const filename = event.target.files[0].name;
              const extension = filename.substring(
                filename.lastIndexOf(".") + 1
              );

              if (extension.toLowerCase() != "txt" && extension != "wire") {
                enqueueSnackbar("Only text and wire files are allowed", {
                  variant: "error",
                });

                // unselecting the file
                event.target.value = "";
                return;
              }

              setWireFile(event.target.files[0]);
            }
          }}
        />
        <div className="pb-6" />
        <div className="w-fit">
          <MyBlueButton
            submitting={submitting}
            onClick={async () => {
              setSubmitting(true);
              if (!wireFile) {
                enqueueSnackbar("Please select wire file first", {
                  variant: "error",
                });
                setSubmitting(false);
                return;
              }

              const fileText = await getTextFromFile(
                wireFile,
                "Error parsing wire file"
              );
              if (!fileText) {
                setSubmitting(false);
                return;
              }

              let up: any;
              if (fileType == "Receiving") {
                up = await dispatch(uploadInboundWireFile(fileText));
              } else {
                // up = await dispatch(uploadOutboundFile(fileText));
              }

              if (!up.payload || typeof up.payload == "string") {
                enqueueSnackbar(up.payload, {
                  variant: "error",
                  persist: true,
                });
              } else {
                enqueueSnackbar(
                  `Wire file successfully uploaded (filename: ${
                    wireFile ?? ""
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
            Upload Wire file
          </MyBlueButton>
        </div>
      </div>
    </>
  );
};

export default WireProcessPage;
