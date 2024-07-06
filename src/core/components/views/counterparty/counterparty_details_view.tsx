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
import timestampToDate from "@/core/utils/timestampToDate";

type CounterpartyDetailsViewProps = {
  counterparty: Counterparty;
  isEditing: any;
  setIsEditing: any;
  control: any;
  errors: any;
  submitting: any;
  setRefresh: any;
};

const CounterpartyDetailsView: React.FC<CounterpartyDetailsViewProps> = ({
  counterparty,
  isEditing,
  setIsEditing,
  control,
  errors,
  submitting,
  setRefresh,
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
        <div className="flex flex-row-reverse justify-between">
          <div>
            <MyEditButton editing={isEditing} setEditing={setIsEditing} />
          </div>
          <div>
            <ItemRow title="ID" value={counterparty.id ?? ""}></ItemRow>
            {/* <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="id"
              displayName="ID"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: true,
                    }
              }
              value={counterparty.id ? counterparty.id : ""}
              submitting={false}
            /> */}
            {/* <ItemRow
            title="First Name"
            value={counterparty.firstName ?? ""}
          ></ItemRow> */}

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

            <ItemRow
              title="Counterparty type"
              value={counterparty.type ?? ""}
            ></ItemRow>
            {/* <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="businessId"
              displayName="Business ID"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: true,
                    }
              }
              value={counterparty.businessId ? counterparty.businessId : ""}
              submitting={false}
            /> */}
            <div className="flex flex-row">
              <ItemRow
                title="Status"
                value={counterparty.status ?? ""}
              ></ItemRow>
              {counterparty.status && counterparty.status == "BLOCKED" && (
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
            {/* <MyEditableTextField
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
              value={counterparty.status ? counterparty.status : ""}
              submitting={false}
            /> */}
            <ItemRow
              title="Created By"
              value={counterparty.createdBy ?? ""}
            ></ItemRow>
            <ItemRow
              title="Created At"
              value={timestampToDate(counterparty.createdAt)}
            ></ItemRow>
            <ItemRow
              title="Updated By"
              value={counterparty.updatedBy ?? ""}
            ></ItemRow>
            <ItemRow
              title="Updated At"
              value={timestampToDate(counterparty.updatedAt)}
            ></ItemRow>
            {counterparty.status && counterparty.status == "BLOCKED" && (
              <>
                <MyText>Counterparty blocked results</MyText>
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

                {/* <MyEditableTextField
                  editing={isEditing}
                  setEditing={setIsEditing}
                  editable={false}
                  name="blockedResults"
                  displayName="Blocked results"
                  control={control}
                  errors={errors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: true,
                        }
                  }
                  value={
                    counterparty.blockedResults
                      ? counterparty.blockedResults
                      : ""
                  }
                  submitting={false}
                /> */}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CounterpartyDetailsView;
