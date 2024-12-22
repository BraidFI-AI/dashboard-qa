"use client";

import { useAppDispatch } from "@/redux/store/store";
import MyBlueButton from "../../Button/MyBlueButton";
import { useEffect, useState } from "react";
import MyModal from "../../my_modal";
import MyText from "../../Text/Text";
import MyControlledTextField from "../../TextField/MyControlledTextField";
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import MyControlledAutocomplete from "../../Autocomplete/MyControlledAutocomplete";
import { useSelector } from "react-redux";
import { Alert, OFAC } from "@/core/api/ApiTypes";
import { resolveAlert } from "@/redux/slices/alerts_slice";
import { fetchOFACHitNew } from "@/redux/slices/OFACSlice";
import MyCircularProgressIndicator from "../../circular_progress_indicator";
import ErrorPage from "../../error_page";
import { updateWireFileRecord } from "@/redux/slices/wire_processing_slice";

const ResolveAlertButton = () => {
  const params = useParams();

  const dispatch = useAppDispatch();

  const alert: "loading" | string | Alert = useSelector(
    (state: any) => state.alerts.alert
  );

  const [isOpen, setIsOpen] = useState(false);

  const [action, setAction] = useState<string>("");

  const [modalOpen, setModalOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [ofacHit, setOfacHit] = useState<"loading" | null | string | OFAC>(
    "loading"
  );

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const [resolveOptions, setResolveOptions] = useState<String[]>([
    "Approve",
    "Decline",
  ]);

  const {
    formState: { errors },
    control,
    handleSubmit,
    getValues,
    setValue,
  } = useForm<{
    alertId: string;
    action: string;
    note: string;
  }>({
    defaultValues: {
      alertId: params.id.toString(),
      action: "",
      note: "",
    },
  });
  const onSubmit: SubmitHandler<{
    alertId: string;
    action: string;
    note: string;
    note2?: string;
  }> = (data: {
    alertId: string;
    action: string;
    note: string;
    note2?: string;
  }) => {
    console.log("data:", data);
    setSubmitting(true);

    const resolveData: {
      alertId: string;
      action: string;
      note: string;
      note2?: string;
      whiteList?: {
        ofacId: string;
      };
    } = { ...data };

    data.action = data.action.toUpperCase();

    if (
      ofacHit != null &&
      typeof ofacHit != "string" &&
      typeof alert != "string"
    ) {
      if (data.action.toLowerCase().includes("whitelist")) {
        resolveData.whiteList = {
          ofacId: ofacHit.ofacId ?? "",
        };
      }
    }

    if (typeof alert != "string") {
      if (
        data.action == "APPROVE" &&
        alert.contextType == "FILE_RECORD" &&
        (alert.additionalParam == "INBOUND_WIRE_INCORRECT_ACCOUNT_NUMBER" ||
          alert.additionalParam == "INBOUND_WIRE_INCORRECT_BENEFICIARY_CODE")
      ) {
        dispatch(
          updateWireFileRecord({
            recordId: alert.contextId ?? "",
            accountNumber: data.note,
            beneficiaryCode: data.note2 ?? "",
          })
        ).then((result) => {
          if (typeof result.payload == "string") {
            enqueueSnackbar(result.payload, {
              variant: "error",
              persist: true,
            });
          } else {
            enqueueSnackbar("Alert Resolved", { variant: "success" });
            handleModalClose();
          }

          setSubmitting(false);
        });
      } else
        dispatch(resolveAlert(resolveData)).then((result) => {
          if (typeof result.payload == "string") {
            enqueueSnackbar(result.payload, {
              variant: "error",
              persist: true,
            });
          } else {
            enqueueSnackbar("Alert Resolved", { variant: "success" });
            handleModalClose();
          }

          setSubmitting(false);
        });
    }
  };

  useEffect(() => {
    if (typeof alert != "string") {
      if (
        alert.status == "UNASSIGNED" ||
        alert.status == "OPEN" ||
        alert.status == "ASSIGNED"
      ) {
        setIsOpen(true);

        if (alert.type == "OFAC") {
          dispatch(fetchOFACHitNew(alert.contextId?.toString() ?? "")).then(
            (data: any) => {
              setOfacHit(data.payload);
              if (typeof data.payload != "string") {
                if (
                  data.payload?.individualId != null ||
                  data.payload?.businessId != null
                ) {
                  setResolveOptions([
                    "Approve",
                    "Approve & Whitelist",
                    "Decline",
                  ]);
                }
              }
            }
          );
        } else {
          setOfacHit(null);
        }
      } else {
        setIsOpen(false);
      }
    }
  }, [alert]);

  return isOpen == false ? (
    <></>
  ) : typeof alert == "string" ? (
    <></>
  ) : (
    <>
      <div className="w-fit">
        <MyBlueButton
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Resolve Alert
        </MyBlueButton>
      </div>
      <MyModal
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
        height="430px"
      >
        {ofacHit == "loading" ? (
          <MyCircularProgressIndicator />
        ) : typeof ofacHit == "string" ? (
          <ErrorPage
            error={ofacHit}
            recoveryButtonTitle="Retry"
            recoveryButtonOnClick={() => {
              dispatch(fetchOFACHitNew(alert.contextId?.toString() ?? "")).then(
                (data: any) => {
                  setOfacHit(data.payload);
                  if (typeof data.payload != "string") {
                    if (
                      data.payload?.individualId != null ||
                      data.payload?.businessId != null
                    ) {
                      setResolveOptions([
                        "Approve",
                        "Approve & Whitelist",
                        "Decline",
                      ]);
                    }
                  }
                }
              );
            }}
          />
        ) : (
          <>
            <MyText size="lg">Resolve Alert</MyText>
            <div className="pb-6" />
            <MyText>Decision</MyText>
            <MyControlledAutocomplete
              clearable={false}
              name="action"
              displayName="Action"
              control={control}
              errors={errors}
              options={resolveOptions}
              rules={{
                required: true,
              }}
              value={getValues("action")}
              customOnChange={(value: any) => {
                setAction(value);
              }}
            />
            <div className="h-4" />
            <MyText>
              {action != "Decline" &&
              alert.contextType == "FILE_RECORD" &&
              (alert.additionalParam ==
                "INBOUND_WIRE_INCORRECT_ACCOUNT_NUMBER" ||
                alert.additionalParam ==
                  "INBOUND_WIRE_INCORRECT_BENEFICIARY_CODE")
                ? "Correct Account Number"
                : "Note"}
            </MyText>
            <MyControlledTextField
              name={"note"}
              displayName={"Note"}
              control={control}
              errors={errors}
              rules={{
                required: true,
              }}
              value={getValues("note")}
            />
            {action != "Decline" &&
              alert.contextType == "FILE_RECORD" &&
              (alert.additionalParam ==
                "INBOUND_WIRE_INCORRECT_ACCOUNT_NUMBER" ||
                alert.additionalParam ==
                  "INBOUND_WIRE_INCORRECT_BENEFICIARY_CODE") && (
                <>
                  <div className="h-4" />
                  <MyText>
                    {action == "Decline"
                      ? "Note"
                      : alert.contextType == "FILE_RECORD"
                      ? alert.additionalParam ==
                        "INBOUND_WIRE_INCORRECT_ACCOUNT_NUMBER"
                        ? "Correct Account Number"
                        : alert.additionalParam ==
                          "INBOUND_WIRE_INCORRECT_BENEFICIARY_CODE"
                        ? "Correct Beneficiary Code"
                        : "Note"
                      : "Note"}
                  </MyText>
                  <MyControlledTextField
                    name={"note2"}
                    displayName={"Note"}
                    control={control}
                    errors={errors}
                    rules={{
                      required: true,
                    }}
                    value={getValues("note")}
                  />
                </>
              )}
            <div className="pb-8" />
            <div className="w-fit">
              <MyBlueButton
                submitting={submitting}
                onClick={() => {
                  handleSubmit(onSubmit)();
                }}
              >
                Resolve Alert
              </MyBlueButton>
            </div>
            <div className="pb-6" />
          </>
        )}
      </MyModal>
    </>
  );
};

export default ResolveAlertButton;
