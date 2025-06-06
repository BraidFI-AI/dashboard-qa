"use client";

import { Alert } from "@/core/api/ApiTypes";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyText from "@/core/components/Text/Text";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import { useAppDispatch } from "@/redux/store/store";
import { useParams, useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import MyModal from "../../../../../core/components/my_modal";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import {
  createAlertDocument,
  fetchAlert,
  uploadAlertDocument,
} from "@/redux/slices/alerts_slice";
import IconButton from "@mui/material/IconButton";

type UploadAlertDocumentButtonProps = {
  alert: Alert;
};

const UploadAlertDocumentButton: React.FC<UploadAlertDocumentButtonProps> = ({
  alert,
}) => {
  const dispatch = useAppDispatch();

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
    alertId: string;
    description: string;
    documentType: string;
    name: string;
  }>({
    defaultValues: {
      alertId: alert.id?.toString() ?? "",
      description: "",
      documentType: "ID_DOCUMENT_FRONT",
      name: "",
    },
  });
  const onSubmit: SubmitHandler<{
    alertId: string;
    description: string;
    documentType: string;
    name: string;
  }> = (data: {
    alertId: string;
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

    dispatch(createAlertDocument(data)).then((doc: any) => {
      if (
        typeof doc.payload != "string" &&
        doc.payload.alertDocuments != null &&
        doc.payload.alertDocuments.length > 0
      ) {
        const docId =
          doc.payload.alertDocuments[doc.payload.alertDocuments.length - 1].id;

        if (docId != null) {
          dispatch(
            uploadAlertDocument({
              alertId: alert.id?.toString() ?? "",
              documentId: docId,
              file: document,
            })
          ).then((ud: any) => {
            if (typeof ud.payload != "string") {
              enqueueSnackbar("Document uploaded successfully", {
                variant: "success",
              });

              dispatch(fetchAlert(alert.id?.toString() ?? ""));

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

  return typeof alert == "string" ? (
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

export default UploadAlertDocumentButton;
