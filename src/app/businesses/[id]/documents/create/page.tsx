"use client";

import { BusinessDocument, CreateBusinessDocument } from "@/core/api/ApiTypes";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyText from "@/core/components/Text/Text";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import { setTitle } from "@/redux/slices/AppSlice";
import {
  createBusinessDocument,
  uploadBusinessDocument,
} from "@/redux/slices/BusinessSlice";
import { useAppDispatch } from "@/redux/store/store";
import { useParams, useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const UploadDocument = () => {
  const params = useParams();
  const router = useRouter();

  const dispatch = useAppDispatch();

  const documentRef = useRef<HTMLInputElement>(null);
  const [document, setDocument] = useState<any>(null);

  const [submitting, setSubmitting] = useState(false);

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
  } = useForm<CreateBusinessDocument>();
  const onSubmit: SubmitHandler<CreateBusinessDocument> = (
    data: CreateBusinessDocument
  ) => {
    setSubmitting(true);
    console.log("data:", data);

    if (!document) {
      enqueueSnackbar("Please select a document file first");
      setSubmitting(false);
      return;
    }

    dispatch(
      createBusinessDocument({ id: (params.id as string) || "0", data: data })
    ).then((d: any) => {
      if (d.payload) {
        dispatch(
          uploadBusinessDocument({
            businessId: (params.id as string) || "0",
            documentId: d.payload.id,
            file: document,
          })
        ).then((ud: any) => {
          if (ud.payload) {
            enqueueSnackbar("Document uploaded successfully", {
              variant: "success",
            });
            router.back();
          } else {
            // enqueueSnackbar("Error creating document", {
            //   variant: "error",
            // });
          }

          setSubmitting(false);
        });
      } else {
        enqueueSnackbar("Error creating document", {
          variant: "error",
        });
        setSubmitting(false);
      }
    });

    // dispatch(fetchUploadedBusinessDocuments((params.id as string) || "0")).then(
    //   (docs: any) => {
    //     if (docs.payload) {
    //       console.log(docs.payload);
    //       let created = -1;
    //       docs.payload.forEach((d: BusinessDocument) => {
    //         if (d.documentType == data.documentType) {
    //           created = d.id;
    //         }
    //       });

    //       created = -1;
    //       if (created != -1) {
    //         console.log("document already created! uplading only");
    //         dispatch(
    //           uploadBusinessDocument({
    //             businessId: (params.id as string) || "0",
    //             documentId: created.toString(),
    //             file: document,
    //           })
    //         ).then((ud: any) => {
    //           if (ud.payload) {
    //             enqueueSnackbar("Document uploaded successfully", {
    //               variant: "success",
    //             });
    //           } else {
    //             enqueueSnackbar("Error creating document", {
    //               variant: "error",
    //             });
    //           }
    //           setSubmitting(false);
    //         });
    //       } else {
    //         console.log("document doesn't exits. Creating and uplaoding");
    //         dispatch(
    //           createBusinessDocument({ id: (params.id as string) || "0", data: data })
    //         ).then((d: any) => {
    //           if (d.payload) {
    //             dispatch(
    //               uploadBusinessDocument({
    //                 businessId: (params.id as string) || "0",
    //                 documentId: d.payload.id,
    //                 file: document,
    //               })
    //             ).then((ud: any) => {
    //               if (ud.payload) {
    //                 enqueueSnackbar("Document uploaded successfully", {
    //                   variant: "success",
    //                 });
    //               } else {
    //                 enqueueSnackbar("Error creating document", {
    //                   variant: "error",
    //                 });
    //               }
    //               setSubmitting(false);
    //             });
    //           } else {
    //             enqueueSnackbar("Error creating document", {
    //               variant: "error",
    //             });
    //             setSubmitting(false);
    //           }
    //         });
    //         // create and uplaod
    //       }
    //     } else {
    //       enqueueSnackbar("Error uploading document", { variant: "error" });
    //       setSubmitting(false);
    //     }
    //   }
    // );
  };

  useEffect(() => {
    dispatch(setTitle("Upload document"));
  }, [dispatch]);

  return (
    <div className="pt-6 w-[300px]">
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
        value=""
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
        value=""
      />
      <div className="pb-4" />
      <MyText>Document type</MyText>
      <MyControlledAutocomplete
        value={"ID_DOCUMENT_FRONT"}
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
            const extension = filename.substring(filename.lastIndexOf(".") + 1);
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
    </div>
  );
};

export default UploadDocument;
