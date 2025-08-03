"use client";

import { Counterparty, CounterpartyBlockedResults } from "@/core/api/ApiTypes";
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
import MyEditButton from "../../Button/MyEditButton";
import MyRedButton from "../../Button/MyRedButton";
import { SubmitHandler, useForm } from "react-hook-form";
import { updateCounterparty } from "@/redux/slices/CounterpartySlice";

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

  const [unblocking, setUnblocking] = useState(false);

  const [modalOpen, setModalOpen] = useState<boolean[]>(
    Array.from(
      { length: counterparty.blockedResults?.length ?? 0 },
      (_) => false
    )
  );

  const handleModalClose = (index: number) => {
    let temp = [...modalOpen];
    temp[index] = false;

    setModalOpen(temp);
  };
  const handleModalOpen = (index: number) => {
    let temp = [...modalOpen];
    temp[index] = true;

    setModalOpen(temp);
  };

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
  }, [counterparty.idNumber, dispatch]);

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
    }
  }, [isEditing, counterparty?.name, setValue]);
  return (
    <div className="pt-2">
      <div className="flex flex-wrap w-full gap-x-10 gap-y-4">
        <div className="w-[250px] h-[25px]">
          <ItemRowHorizontal
            title="ID"
            value={counterparty.id?.toString() ?? ""}
          />
        </div>
        <div className="w-[250px] h-[25px]">
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
        </div>
        <div className="w-[250px] h-[25px]">
          <ItemRowHorizontal
            title="Counterparty Type"
            value={counterparty.type ?? ""}
          />
        </div>
        <div className="w-[250px] h-[25px]">
          <ItemRowHorizontal title="Status" value={counterparty.status ?? ""} />
        </div>
        {(counterparty.idNumber != null ||
          counterparty.idType != null ||
          counterparty.dateOfBirth != null) && (
          <>
            <div className="flex flex-row items-center gap-2 justify-between w-[250px] h-[25px]">
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
            <div className="w-[250px] h-[25px]">
              <ItemRowHorizontal
                title="ID Type"
                value={counterparty.idType ?? ""}
              />
            </div>
            <div className="w-[250px] h-[25px]">
              <ItemRowHorizontal
                title="Date of Birth"
                value={`${
                  counterparty.dateOfBirth != null
                    ? `${counterparty.dateOfBirth?.[0]}-${counterparty.dateOfBirth?.[1]}-${counterparty.dateOfBirth?.[2]}`
                    : ""
                }`}
              />
            </div>
          </>
        )}
        <div className="w-[250px] h-[25px]">
          <ItemRowHorizontal
            title="Created By"
            value={counterparty.createdBy ?? ""}
          />
        </div>
        <div className="w-[250px] h-[25px]">
          <ItemRowHorizontal
            title="Created At"
            value={timestampToDate(counterparty.createdAt)}
          />
        </div>
        <div className="w-[250px] h-[20px]">
          <ItemRowHorizontal
            title="Updated By"
            value={counterparty.updatedBy ?? ""}
          />
        </div>
        <div className="w-[250px] h-[20px]">
          <ItemRowHorizontal
            title="Updated At"
            value={timestampToDate(counterparty.updatedAt)}
          />
        </div>
      </div>
      <div className={`flex flex-row ${editable ? "pt-10 pb-4" : ""}`}>
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
