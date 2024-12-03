"use client";

import { Counterparty, OFAC } from "@/core/api/ApiTypes";
import Divider from "@mui/material/Divider";
import ItemRow from "@/core/components/Text/ItemRow";
import MyText from "@/core/components/Text/Text";
import MyExpandableButton from "@/core/components/Button/MyExpandableButton";
import MyEditButton from "@/core/components/Button/MyEditButton";
import MyEditableTextField from "@/core/components/TextField/MyEditableTextField";
import { useEffect, useState } from "react";
import timestampToDate from "@/core/utils/timestampToDate";
import MyCircularProgressIndicator from "../../circular_progress_indicator";
import MyLinkText from "../../Text/LinkText";
import ErrorPage from "../../error_page";
import { useAppDispatch } from "@/redux/store/store";
import { fetchOFACHitNew } from "@/redux/slices/OFACSlice";

type CounterpartyBraidDetailsViewProps = {
  counterparty: Counterparty;
  control: any;
  errors: any;
  submitting: any;
  setIsEditing: any;
  isEditing: any;
};

const CounterpartyBraidDetailsView: React.FC<
  CounterpartyBraidDetailsViewProps
> = ({
  counterparty,
  control,
  errors,
  submitting,
  isEditing,
  setIsEditing,
}) => {
  const dispatch = useAppDispatch();

  const [expandDetails, toggleExpandDetails] = useState(false);

  const [ofac, setOfac] = useState<"loading" | string | OFAC>("loading");

  useEffect(() => {
    if (counterparty.ofacId) {
      setOfac("loading");
      dispatch(fetchOFACHitNew(counterparty.ofacId.toString())).then(
        (o: any) => {
          setOfac(o.payload);
        }
      );
    }
  }, [dispatch, counterparty.ofacId]);

  return (
    (<div className="flex flex-col">
      {counterparty.ofacId == null ? (
        <MyText size="md">No OFAC check</MyText>
      ) : ofac === "loading" ? (
        <MyCircularProgressIndicator />
      ) : typeof ofac == "string" ? (
        <ErrorPage
          error={ofac}
          recoveryButtonOnClick={() => {
            if (counterparty.ofacId) {
              setOfac("loading");
              dispatch(fetchOFACHitNew(counterparty.ofacId.toString())).then(
                (o: any) => {
                  setOfac(o.payload);
                }
              );
            }
          }}
          recoveryButtonTitle="Retry"
        />
      ) : (
        <ItemRow
          title="Last OFAC date"
          value={timestampToDate(ofac.createdAt ?? 0)}
        />
      )}
      {counterparty.ofacId != null && ofac === "loading" ? (
        <MyCircularProgressIndicator />
      ) : typeof ofac == "string" ? (
        <></>
      ) : (
        <MyLinkText link={`/compliance/ofac/${counterparty.ofacId}`}>
          Last OFAC status
        </MyLinkText>
      )}
      <div className="pb-4"></div>
      <MyExpandableButton
        title="Braid Payment Instrument"
        expand={expandDetails}
        toggleExpand={toggleExpandDetails}
      />
      <Divider />
      <div className="pb-4"></div>
      {expandDetails && (
        <div className="flex flex-row-reverse justify-between">
          <div>
            <MyEditButton editing={isEditing} setEditing={setIsEditing} />
          </div>
          <div className="w-full">
            <ItemRow title="ID" value={counterparty?.braid?.id ?? ""}></ItemRow>
            {/* <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="braid.id"
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
              value={counterparty.braid?.id ? counterparty.braid?.id : ""}
              submitting={false}
            /> */}
            <ItemRow
              title="Contact ID"
              value={counterparty?.braid?.contactId ?? ""}
            ></ItemRow>
            {/* <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="braid.contactId"
              displayName="Contact ID"
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
                counterparty.braid?.contactId
                  ? counterparty.braid?.contactId
                  : ""
              }
              submitting={false}
            /> */}
            <ItemRow
              title="Customer ID"
              value={counterparty?.braid?.custId ?? ""}
            ></ItemRow>
            {/* <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="braid.custId"
              displayName="Customer ID"
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
                counterparty.braid?.custId ? counterparty.braid?.custId : ""
              }
              submitting={false}
            /> */}
            <ItemRow
              title="Type"
              value={counterparty?.braid?.instrumentType ?? ""}
            ></ItemRow>
            {/* <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="braid.instrumentType"
              displayName="Type"
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
                counterparty.braid?.instrumentType
                  ? counterparty.braid?.instrumentType
                  : ""
              }
              submitting={false}
            /> */}
            {/* <ItemRow
              title="Account Number"
              value={counterparty.braid.accountNumber ?? ""}
            ></ItemRow> */}
            <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="braid.accountNumber"
              displayName="Account Number"
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
                counterparty.braid?.accountNumber
                  ? counterparty.braid?.accountNumber
                  : ""
              }
              submitting={false}
            />
            <ItemRow
              title="Status"
              value={counterparty?.braid?.status ?? ""}
            ></ItemRow>
            {/* <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="braid.status"
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
              value={
                counterparty.braid?.status ? counterparty.braid?.status : ""
              }
              submitting={false}
            /> */}
            <ItemRow
              title="Created at"
              value={timestampToDate(counterparty?.braid?.createdAt)}
            ></ItemRow>
            <ItemRow
              title="Updated at"
              value={timestampToDate(counterparty?.braid?.updatedAt)}
            ></ItemRow>
            {/* <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="braid.updated_at"
              displayName="Updated at"
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
                counterparty.braid?.updated_at
                  ? counterparty.braid?.updated_at
                  : ""
              }
              submitting={false}
            /> */}
            {counterparty.braid?.status &&
              counterparty.braid?.status == "BLOCKED" && (
                (<ItemRow
                  title="Blocked results"
                  value={counterparty.braid?.blockedResults ?? ""}
                ></ItemRow>)
                // <MyEditableTextField
                //   editing={isEditing}
                //   setEditing={setIsEditing}
                //   editable={false}
                //   name="braid.blockedResults"
                //   displayName="Blocked results"
                //   control={control}
                //   errors={errors}
                //   rules={
                //     submitting
                //       ? { required: false }
                //       : {
                //           required: true,
                //         }
                //   }
                //   value={
                //     counterparty.braid?.blockedResults
                //       ? counterparty.braid?.blockedResults
                //       : ""
                //   }
                //   submitting={false}
                // />
              )}
          </div>
        </div>
      )}
    </div>)
  );
};

export default CounterpartyBraidDetailsView;
