"use client";

import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyText from "@/core/components/Text/Text";
import { upload314aFile } from "@/redux/slices/314a_slice";
import { useAppDispatch } from "@/redux/store/store";
import { enqueueSnackbar } from "notistack";
import { useRef, useState } from "react";

const Compliance314aPage = () => {
  const documentRef = useRef<HTMLInputElement>(null);
  const [document, setDocument] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <div className="pb-4">
      <MyText size="md">Please select a 314a file to upload</MyText>
      <div className="pb-4" />
      <input
        type="file"
        accept="text/plain"
        ref={documentRef}
        onChange={(event) => {
          if (
            event?.target?.files != null &&
            event?.target?.files?.length != 0
          ) {
            const filename = event.target.files[0].name;
            const extension = filename.substring(filename.lastIndexOf(".") + 1);
            console.log(extension);

            if (extension.toLowerCase() != "txt") {
              enqueueSnackbar("Only txt files are allowed!", {
                variant: "error",
              });

              // unselecting the file
              event.target.value = "";
              return;
            }

            setDocument(event.target.files[0]);
            console.log("document selected");
          }
        }}
      />
      <div className="pt-6 w-[150px]">
        <MyBlueButton
          submitting={submitting}
          onClick={() => {
            if (document == null) {
              enqueueSnackbar("Please select a file to upload", {
                variant: "error",
              });
              return;
            }
            setSubmitting(true);
            dispatch(upload314aFile(document)).then((result: any) => {
              if (typeof result.payload == "string") {
                enqueueSnackbar(result.payload, {
                  variant: "error",
                  persist: true,
                });
              } else {
                enqueueSnackbar("File uploaded successfully", {
                  variant: "success",
                });
              }
              setSubmitting(false);
            });
          }}
        >
          Upload
        </MyBlueButton>
      </div>
    </div>
  );
};

export default Compliance314aPage;
