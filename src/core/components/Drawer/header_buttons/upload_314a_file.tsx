"use client";

import { useRef, useState } from "react";
import MyBlueButton from "../../Button/MyBlueButton";
import MyModal from "../../my_modal";
import { useAppDispatch } from "@/redux/store/store";
import MyText from "../../Text/Text";
import { enqueueSnackbar } from "notistack";
import { upload314aFile } from "@/redux/slices/314a_slice";

const Upload314AFile = () => {
  const dispatch = useAppDispatch();
  const documentRef = useRef<HTMLInputElement>(null);
  const [document, setDocument] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <MyModal
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
        height="200px"
      >
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
                const extension = filename.substring(
                  filename.lastIndexOf(".") + 1
                );
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
                    setModalOpen(false);
                  }
                  setSubmitting(false);
                });
              }}
            >
              Upload
            </MyBlueButton>
          </div>
        </div>
      </MyModal>
      <div className="w-fit">
        <MyBlueButton
          submitting={submitting}
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Upload 314A File
        </MyBlueButton>
      </div>
    </>
  );
};

export default Upload314AFile;
