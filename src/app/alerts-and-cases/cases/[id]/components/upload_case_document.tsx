"use client";

import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyText from "@/core/components/Text/Text";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import { useAppDispatch } from "@/redux/store/store";
import { useParams, useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import MyModal from "../../../../../core/components/my_modal";
import { Case } from "@/core/api/ApiTypes";
import {
  createCaseDocument,
  fetchCase,
  uploadCaseDocument,
} from "@/redux/slices/cases_slice";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import IconButton from "@mui/material/IconButton";

type UploadCaseDocumentButtonProps = {
  c: Case;
};

const UploadCaseDocumentButton: React.FC<UploadCaseDocumentButtonProps> = ({
  c,
}) => {
  const params = useParams();

  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const documentRef = useRef<HTMLInputElement>(null);
  const [document, setDocument] = useState<any>(null);

  const [modalOpen, setModalOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const {
    formState: { errors },
    getValues,
    control,
    handleSubmit,
  } = useForm<{
    caseId: string;
    description: string;
    documentType: string;
    name: string;
  }>({
    defaultValues: {
      caseId: (params.id as string) || "0",
      description: "",
      documentType: "ID_DOCUMENT_FRONT",
      name: "",
    },
  });
  const onSubmit: SubmitHandler<{
    caseId: string;
    description: string;
    documentType: string;
    name: string;
  }> = (data: {
    caseId: string;
    description: string;
    documentType: string;
    name: string;
  }) => {
    setSubmitting(true);
    console.log("data:", data);

    if (!document) {
      enqueueSnackbar("Please select a document file first");
      setSubmitting(false);
      return;
    }

    dispatch(createCaseDocument(data)).then((doc: any) => {
      if (
        typeof doc.payload != "string" &&
        doc.payload.caseDocuments != null &&
        doc.payload.caseDocuments.length > 0
      ) {
        const docId =
          doc.payload.caseDocuments[doc.payload.caseDocuments.length - 1].id;

        if (docId != null) {
          dispatch(
            uploadCaseDocument({
              caseId: (params.id as string) || "0",
              documentId: docId,
              file: document,
            })
          ).then((ud: any) => {
            if (typeof ud.payload != "string") {
              enqueueSnackbar("Document uploaded successfully", {
                variant: "success",
              });

              dispatch(fetchCase((params.id as string) || "0"));

              handleModalClose();
            } else {
              enqueueSnackbar(ud, {
                variant: "error",
                persist: true,
              });
            }
          });
          setSubmitting(false);
        } else {
          enqueueSnackbar(
            typeof doc.payload == "string"
              ? doc.payload
              : "Document didn't get created!",
            {
              variant: "error",
              persist: true,
            }
          );
          setSubmitting(false);
        }
      } else {
        enqueueSnackbar(
          typeof doc.payload == "string"
            ? doc.payload
            : "Document didn't get created!",
          {
            variant: "error",
            persist: true,
          }
        );
        setSubmitting(false);
      }
    });
  };

  useEffect(() => {
    if (typeof c != "string") {
      console.log(c.status);

      if (c.status == "CLOSED") {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    }
  }, [c]);

  return isOpen == false ? (
    <></>
  ) : typeof c == "string" ? (
    <></>
  ) : (
    <>
      <IconButton
        onClick={() => {
          setModalOpen(true);
        }}
      >
        <FileUploadOutlinedIcon className="text-[#12A7FF] h-[34px] w-[34px]" />
      </IconButton>
      <MyModal
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
        height="490px"
      >
        <MyText size="lg">Upload Document</MyText>
        <div className="pb-6" />
        <MyText>Document name</MyText>
        <MyControlledTextField
          name="name"
          displayName="Document name"
          control={control}
          errors={errors}
          rules={
            submitting
              ? { required: false }
              : {
                  required: true,
                }
          }
          value={getValues("name")}
        />
        <div className="pb-4" />
        <MyText>Description</MyText>
        <MyControlledTextField
          name="description"
          displayName="Description"
          control={control}
          errors={errors}
          rules={{
            required: false,
          }}
          value={getValues("description")}
        />
        <div className="pb-4" />
        <MyText>Document type</MyText>
        <MyControlledAutocomplete
          clearable={false}
          value={getValues("documentType")}
          displayName="Document Type"
          name={"documentType"}
          control={control}
          errors={errors}
          rules={
            submitting
              ? { required: false }
              : {
                  required: true,
                }
          }
          options={[
            "ID_DOCUMENT_FRONT",
            "ID_DOCUMENT_BACK",
            "PASSPORT",
            "ADDRESS_VERIFICATION",
            "CERTIFICATE_OF_INCORPORATION",
            "EIN_CONFIRMATION",
            "SOCIAL_SECURITY_CARD",
            "POWER_OF_ATTORNEY",
            "CLIENT_REQUESTED",
            "SELFIE_VERIFICATION",
            "FORMATION",
            "DBA",
            "OTHER",
          ]}
        />
        <div className="pb-4" />
        <MyText>Select document</MyText>
        <input
          type="file"
          accept="image/png, image/jpeg, application/pdf"
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

              if (
                extension.toLowerCase() != "pdf" &&
                extension.toLowerCase() != "png" &&
                extension.toLowerCase() != "jpeg" &&
                extension.toLowerCase() != "jpg"
              ) {
                enqueueSnackbar(
                  "Only Pdf/png/jpep files are allowed for Fee schedule",
                  {
                    variant: "error",
                  }
                );

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
              handleSubmit(onSubmit)();
            }}
          >
            Upload
          </MyBlueButton>
        </div>
      </MyModal>
    </>
  );
};

export default UploadCaseDocumentButton;
