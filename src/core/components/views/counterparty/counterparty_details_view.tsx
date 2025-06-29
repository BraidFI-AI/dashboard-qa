"use client";

import Divider from "@mui/material/Divider";
import { Counterparty, CounterpartyBlockedResults } from "@/core/api/ApiTypes";
import MyExpandableButton from "@/core/components/Button/MyExpandableButton";
import ItemRow from "@/core/components/Text/ItemRow";
import MyEditableTextField from "@/core/components/TextField/MyEditableTextField";
import MyEditButton from "@/core/components/Button/MyEditButton";
import { useState } from "react";
import MyText from "@/core/components/Text/Text";
import CounterpartyBlockedResultsPage from "./counterparty_blocked_results_view";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { useAppDispatch } from "@/redux/store/store";
import { unblockBusinessCounterparty } from "@/redux/slices/BusinessSlice";
import { enqueueSnackbar } from "notistack";
import MyTextButton from "../../Button/MyTextButton";
import { timestampToDate } from "@/core/utils/date_time_util";
import ItemRowHorizontal from "../../Text/ItemRowHorizontal";

type CounterpartyDetailsViewProps = {
  counterparty: Counterparty;
  isEditing: any;
  setIsEditing: any;
  control: any;
  errors: any;
  submitting: any;
  setRefresh: any;
  editable?: boolean;
};

const CounterpartyDetailsView: React.FC<CounterpartyDetailsViewProps> = ({
  counterparty,
  isEditing,
  setIsEditing,
  control,
  errors,
  submitting,
  setRefresh,
  editable = true,
}) => {
  const dispatch = useAppDispatch();

  const [expandDetails, toggleExpandDetails] = useState(true);

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

  return (
    <>
      {expandDetails && (
        <div
          className={`flex flex-row-reverse ${
            editable ? "justify-between" : "justify-end"
          } `}
        >
          {editable && (
            <div>
              <MyEditButton editing={isEditing} setEditing={setIsEditing} />
            </div>
          )}
          <div className={`${!editable ? "w-full" : ""}`}>
            {editable ? (
              <ItemRow title="ID" value={counterparty.id ?? ""}></ItemRow>
            ) : (
              <>
                <ItemRowHorizontal
                  title="ID"
                  value={counterparty.id?.toString() ?? ""}
                />
                <div className="h-3" />
              </>
            )}
            {editable ? (
              <MyEditableTextField
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
                <ItemRowHorizontal
                  title="Name"
                  value={counterparty.name ?? ""}
                />
                <div className="h-3" />
              </>
            )}
            {editable ? (
              <ItemRow
                title="Counterparty Type"
                value={counterparty.type ?? ""}
              ></ItemRow>
            ) : (
              <>
                <ItemRowHorizontal
                  title="Counterparty Type"
                  value={counterparty.type ?? ""}
                />
                <div className="h-3" />
              </>
            )}
            <div className="flex flex-row">
              {editable ? (
                <ItemRow
                  title="Status"
                  value={counterparty.status ?? ""}
                ></ItemRow>
              ) : (
                <>
                  <ItemRowHorizontal
                    title="Status"
                    value={counterparty.status ?? ""}
                  />
                  <div className="h-3" />
                </>
              )}
              {editable &&
                counterparty.status &&
                counterparty.status == "BLOCKED" && (
                  <div className="pl-10 w-fit">
                    <MyTextButton
                      submitting={unblocking}
                      onClick={() => {
                        if (counterparty.id) {
                          setUnblocking(true);

                          dispatch(
                            unblockBusinessCounterparty(counterparty.id)
                          ).then((d: any) => {
                            if (typeof d.payload != "string") {
                              enqueueSnackbar(
                                "Counterparty unblocked successfully!",
                                { variant: "success" }
                              );
                              setRefresh(true);
                            } else {
                              enqueueSnackbar(d.payload, {
                                variant: "error",
                              });
                            }
                            setUnblocking(false);
                          });
                        }
                      }}
                    >
                      Unblock
                    </MyTextButton>
                  </div>
                )}
            </div>
            {!editable && <div className="h-3" />}
            {editable ? (
              <ItemRow
                title="Created By"
                value={counterparty.createdBy ?? ""}
              ></ItemRow>
            ) : (
              <>
                <ItemRowHorizontal
                  title="Created By"
                  value={counterparty.createdBy ?? ""}
                />
                <div className="h-3" />
              </>
            )}
            {editable ? (
              <ItemRow
                title="Created At"
                value={timestampToDate(counterparty.createdAt)}
              ></ItemRow>
            ) : (
              <>
                <ItemRowHorizontal
                  title="Created At"
                  value={timestampToDate(counterparty.createdAt)}
                />
                <div className="h-3" />
              </>
            )}
            {editable ? (
              <ItemRow
                title="Updated By"
                value={counterparty.updatedBy ?? ""}
              ></ItemRow>
            ) : (
              <>
                <ItemRowHorizontal
                  title="Updated By"
                  value={counterparty.updatedBy ?? ""}
                />
                <div className="h-3" />
              </>
            )}
            {editable ? (
              <ItemRow
                title="Updated At"
                value={timestampToDate(counterparty.updatedAt)}
              ></ItemRow>
            ) : (
              <>
                <ItemRowHorizontal
                  title="Updated At"
                  value={timestampToDate(counterparty.updatedAt)}
                />
                <div className="h-3" />
              </>
            )}
            {counterparty.status && counterparty.status == "BLOCKED" && (
              <>
                {editable ? (
                  <MyText size="md">Counterparty blocked results</MyText>
                ) : (
                  <MyText size="sm" color="text-[#677990]">
                    Counterparty blocked results
                  </MyText>
                )}
                <div className="pb-2"></div>
                {counterparty.blockedResults?.map(
                  (results: CounterpartyBlockedResults, index: number) => {
                    return (
                      <div className="pb-2" key={index}>
                        <CounterpartyBlockedResultsPage
                          modalOpen={modalOpen[index]}
                          handleModalClose={() => {
                            handleModalClose(index);
                          }}
                          handleModalOpen={() => {
                            handleModalOpen(index);
                          }}
                          results={results}
                        />
                      </div>
                    );
                  }
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CounterpartyDetailsView;
