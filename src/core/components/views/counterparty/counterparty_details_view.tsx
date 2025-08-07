"use client";

import {
  Counterparty,
  CounterpartyBlockedResults,
  OFAC,
} from "@/core/api/ApiTypes";
import { useEffect, useState } from "react";
import MyText from "@/core/components/Text/Text";
import CounterpartyBlockedResultsPage from "./counterparty_blocked_results_view";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { useAppDispatch } from "@/redux/store/store";
import { unblockBusinessCounterparty } from "@/redux/slices/BusinessSlice";
import { enqueueSnackbar } from "notistack";
import MyTextButton from "../../Button/MyTextButton";
import { timestampToDate } from "@/core/utils/date_time_util";
import ItemRowHorizontal from "../../Text/ItemRowHorizontal";
import MyHorizontalEditableTextField from "../../TextField/horizontal_editable_textfield";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { decrypt } from "@/redux/slices/encryption_slice";
import MyRedButton from "../../Button/MyRedButton";
import { SubmitHandler, useForm } from "react-hook-form";
import { updateCounterparty } from "@/redux/slices/CounterpartySlice";
import WrapContainer from "../../divs/wrap_container";
import WrapItem from "../../divs/wrap_item";
import { fetchOFACHitNew } from "@/redux/slices/OFACSlice";
import ErrorPage from "../../error_page";
import MyLinkText from "../../Text/LinkText";
import CircularProgress from "@mui/material/CircularProgress";

type CounterpartyDetailsViewProps = {
  counterparty: Counterparty;
  setRefresh: any;
  editable?: boolean;
  counterpartyId: any;
};

const CounterpartyDetailsView: React.FC<CounterpartyDetailsViewProps> = ({
  counterparty,
  setRefresh,
  editable = true,
  counterpartyId,
}) => {
  const dispatch = useAppDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showEncryptedData, setShowEncryptedData] = useState(false);
  const [idNumber, setIdNumber] = useState("••••••••");

  const [ofac, setOfac] = useState<"loading" | string | OFAC>("loading");

  const [unblocking, setUnblocking] = useState(false);

  useEffect(() => {
    if (counterparty.idNumber != null) {
      dispatch(decrypt(counterparty.idNumber)).then((d: any) => {
        if (typeof d.payload == "string") {
          setIdNumber(d.payload);
        } else {
          setIdNumber(d.payload.data);
        }
      });
    }

    if (counterparty.ofacId) {
      setOfac("loading");
      dispatch(fetchOFACHitNew(counterparty.ofacId.toString())).then(
        (o: any) => {
          setOfac(o.payload);
        }
      );
    }
  }, [counterparty.idNumber, counterparty.ofacId, dispatch]);

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
    reset,
    setValue,
  } = useForm<Counterparty>({
    defaultValues: {
      ...counterparty,
    },
  });

  const onSubmit: SubmitHandler<Counterparty> = (data: Counterparty) => {
    setSubmitting(true);

    if (counterparty) {
      // TODO -- make null or empty strings undefined for all fields

      dispatch(
        updateCounterparty({
          id: parseInt(counterpartyId),
          counterparty: data as any,
        })
      ).then((p: any) => {
        if (typeof p.payload === "string") {
          enqueueSnackbar(p.payload, { variant: "error", persist: true });
        } else {
          setIsEditing(false);
        }
        setRefresh(true);
        setSubmitting(false);
      });
    }
  };

  useEffect(() => {
    if (!isEditing) {
      setValue("name", counterparty?.name);
      setValue("status", counterparty?.status);
    }
  }, [isEditing, counterparty?.name, counterparty?.status, setValue]);
  return (
    <div className="flex flex-col gap-y-8 pt-2 w-full">
      <WrapContainer>
        <WrapItem>
          <ItemRowHorizontal
            title="ID"
            value={counterparty.id?.toString() ?? ""}
          />
        </WrapItem>
        <WrapItem>
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="name"
              displayName="Name"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: true,
                    }
              }
              value={counterparty.name ?? ""}
              submitting={false}
            />
          ) : (
            <>
              <ItemRowHorizontal title="Name" value={counterparty.name ?? ""} />
              <div className="h-3" />
            </>
          )}
        </WrapItem>
        <WrapItem>
          <ItemRowHorizontal
            title="Counterparty Type"
            value={counterparty.type ?? ""}
          />
        </WrapItem>
        <WrapItem>
          {editable ? (
            <MyHorizontalEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="status"
              displayName="Status"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: true,
                    }
              }
              clearable={false}
              value={counterparty.status ?? ""}
              submitting={false}
              options={["NEEDS_OFAC", "BLOCKED", "ACTIVE", "PENDING_UNBLOCK"]}
            />
          ) : (
            <ItemRowHorizontal
              title="Status"
              value={counterparty.status ?? ""}
            />
          )}
        </WrapItem>
        {(counterparty.idNumber != null ||
          counterparty.idType != null ||
          counterparty.dateOfBirth != null) && (
          <WrapItem>
            <div className="flex flex-row justify-between">
              <div className="flex flex-row gap-1 items-center">
                <MyText size="sm" color="text-[#677990]">
                  ID Number
                </MyText>
                {showEncryptedData ? (
                  <VisibilityOffIcon
                    className="text-[#12A7FF] h-[20px]"
                    onClick={() => {
                      setShowEncryptedData(!showEncryptedData);
                    }}
                  />
                ) : (
                  <VisibilityIcon
                    className="text-[#12A7FF] h-[20px]"
                    onClick={() => {
                      setShowEncryptedData(!showEncryptedData);
                    }}
                  />
                )}
              </div>
              <MyText size="sm">
                {showEncryptedData ? idNumber : "••••••••"}
              </MyText>
            </div>
          </WrapItem>
        )}
        {(counterparty.idNumber != null ||
          counterparty.idType != null ||
          counterparty.dateOfBirth != null) && (
          <WrapItem>
            <ItemRowHorizontal
              title="ID Type"
              value={counterparty.idType ?? ""}
            />
          </WrapItem>
        )}
        {(counterparty.idNumber != null ||
          counterparty.idType != null ||
          counterparty.dateOfBirth != null) && (
          <WrapItem>
            <ItemRowHorizontal
              title="Date of Birth"
              value={`${
                counterparty.dateOfBirth != null
                  ? `${counterparty.dateOfBirth?.[0]}-${counterparty.dateOfBirth?.[1]}-${counterparty.dateOfBirth?.[2]}`
                  : ""
              }`}
            />
          </WrapItem>
        )}

        <WrapItem>
          <ItemRowHorizontal
            title="Created By"
            value={counterparty.createdBy ?? ""}
          />
        </WrapItem>
        <WrapItem>
          <ItemRowHorizontal
            title="Created At"
            value={timestampToDate(counterparty.createdAt)}
          />
        </WrapItem>
        <WrapItem>
          <ItemRowHorizontal
            title="Updated By"
            value={counterparty.updatedBy ?? ""}
          />
        </WrapItem>
        <WrapItem>
          <ItemRowHorizontal
            title="Updated At"
            value={timestampToDate(counterparty.updatedAt)}
          />
        </WrapItem>
      </WrapContainer>
      <div>
        <MyText size="sm">OFAC Details</MyText>
        <div className="pb-1" />
        <WrapContainer>
          <WrapItem>
            {counterparty.ofacId == null ? (
              <>
                <MyText size="sm" color="text-[#677990]">
                  No OFAC check
                </MyText>
              </>
            ) : ofac === "loading" ? (
              <CircularProgress size={16} />
            ) : typeof ofac == "string" ? (
              <ErrorPage
                error={ofac}
                recoveryButtonOnClick={() => {
                  if (counterparty.ofacId) {
                    setOfac("loading");
                    dispatch(
                      fetchOFACHitNew(counterparty.ofacId.toString())
                    ).then((o: any) => {
                      setOfac(o.payload);
                    });
                  }
                }}
                recoveryButtonTitle="Retry"
              />
            ) : (
              <ItemRowHorizontal
                title="Last OFAC date"
                value={timestampToDate(ofac.createdAt ?? 0)}
              />
            )}
          </WrapItem>
          <WrapItem>
            {counterparty.ofacId != null && ofac === "loading" ? (
              <CircularProgress size={16} />
            ) : typeof ofac == "string" ? (
              <></>
            ) : (
              <MyLinkText
                textProps={{
                  size: "sm",
                  color: "text-[#677990]",
                }}
                link={`/compliance/ofac/${counterparty.ofacId}`}
              >
                Last OFAC status
              </MyLinkText>
            )}
          </WrapItem>
        </WrapContainer>
      </div>
      <div className={`flex flex-row ${editable ? "pt-2" : ""}`}>
        {editable &&
          counterparty.status &&
          counterparty.status == "BLOCKED" && (
            <div className="w-fit">
              <MyRedButton
                submitting={unblocking}
                onClick={() => {
                  if (counterparty.id) {
                    setUnblocking(true);

                    dispatch(unblockBusinessCounterparty(counterparty.id)).then(
                      (d: any) => {
                        if (typeof d.payload != "string") {
                          enqueueSnackbar(
                            "Counterparty unblocked successfully!",
                            {
                              variant: "success",
                            }
                          );
                          setRefresh(true);
                        } else {
                          enqueueSnackbar(d.payload, {
                            variant: "error",
                          });
                        }
                        setUnblocking(false);
                      }
                    );
                  }
                }}
              >
                Unblock Counterparty
              </MyRedButton>
            </div>
          )}
        {editable &&
          counterparty.status &&
          counterparty.status != "BLOCKED" && (
            <>
              {isEditing ? (
                <div className="flex flex-row gap-4">
                  <div className="w-fit">
                    <MyTextButton
                      submitting={submitting}
                      onClick={() => {
                        setIsEditing(false);
                      }}
                    >
                      Cancel
                    </MyTextButton>
                  </div>
                  <div className="w-fit">
                    <MyBlueButton
                      submitting={submitting}
                      onClick={() => {
                        handleSubmit(onSubmit)();
                      }}
                    >
                      Update Counterparty
                    </MyBlueButton>
                  </div>
                </div>
              ) : (
                <div className="w-fit">
                  <MyBlueButton
                    submitting={submitting}
                    onClick={() => {
                      setIsEditing(true);
                    }}
                  >
                    Edit Counterparty
                  </MyBlueButton>
                </div>
              )}
            </>
          )}
      </div>
    </div>
  );

  // {counterparty.status && counterparty.status == "BLOCKED" && (
  //   <>
  //     {editable ? (
  //       <MyText size="md">Counterparty blocked results</MyText>
  //     ) : (
  //       <MyText size="sm" color="text-[#677990]">
  //         Counterparty blocked results
  //       </MyText>
  //     )}
  //     <div className="pb-2"></div>
  //     {counterparty.blockedResults?.map(
  //       (results: CounterpartyBlockedResults, index: number) => {
  //         return (
  //           <div className="pb-2" key={index}>
  //             <CounterpartyBlockedResultsPage
  //               modalOpen={modalOpen[index]}
  //               handleModalClose={() => {
  //                 handleModalClose(index);
  //               }}
  //               handleModalOpen={() => {
  //                 handleModalOpen(index);
  //               }}
  //               results={results}
  //             />
  //           </div>
  //         );
  //       }
  //     )}
  //   </>
  // )}
};

export default CounterpartyDetailsView;
