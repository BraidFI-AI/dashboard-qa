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
import ItemRowHorizontal from "../../Text/ItemRowHorizontal";

type CounterpartyBraidDetailsViewProps = {
  counterparty: Counterparty;
  control: any;
  errors: any;
  submitting: any;
  setIsEditing: any;
  isEditing: any;
  editable?: boolean;
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
  editable = true,
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
    <div className="flex flex-col">
      {counterparty.ofacId == null ? (
        <>
          {editable ? (
            <MyText size="md">No OFAC check</MyText>
          ) : (
            <MyText size="sm" color="text-[#677990]">
              No OFAC check
            </MyText>
          )}
        </>
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
        <>
          {editable ? (
            <ItemRow
              title="Last OFAC date"
              value={timestampToDate(ofac.createdAt ?? 0)}
            />
          ) : (
            <>
              <ItemRowHorizontal
                title="Last OFAC date"
                value={timestampToDate(ofac.createdAt ?? 0)}
              />
              <div className="h-3" />
            </>
          )}
        </>
      )}
      {counterparty.ofacId != null && ofac === "loading" ? (
        <MyCircularProgressIndicator />
      ) : typeof ofac == "string" ? (
        <></>
      ) : (
        <MyLinkText
          textProps={{
            size: editable ? "md" : "sm",
            color: editable ? undefined : "text-[#677990]",
          }}
          link={`/compliance/ofac/${counterparty.ofacId}`}
        >
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
          {editable && (
            <div>
              <MyEditButton editing={isEditing} setEditing={setIsEditing} />
            </div>
          )}
          <div className="w-full">
            <ItemRow
              horizontal={!editable}
              title="ID"
              value={counterparty?.braid?.id ?? ""}
            ></ItemRow>
            <ItemRow
              horizontal={!editable}
              title="Contact ID"
              value={counterparty?.braid?.contactId ?? ""}
            ></ItemRow>
            <ItemRow
              horizontal={!editable}
              title="Customer ID"
              value={counterparty?.braid?.custId ?? ""}
            ></ItemRow>
            <ItemRow
              horizontal={!editable}
              title="Type"
              value={counterparty?.braid?.instrumentType ?? ""}
            ></ItemRow>
            {editable ? (
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
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Account Number"
                value={counterparty.braid?.accountNumber ?? ""}
              ></ItemRow>
            )}
            <ItemRow
              horizontal={!editable}
              title="Status"
              value={counterparty?.braid?.status ?? ""}
            ></ItemRow>
            <ItemRow
              horizontal={!editable}
              title="Created at"
              value={timestampToDate(counterparty?.braid?.createdAt)}
            ></ItemRow>
            <ItemRow
              horizontal={!editable}
              title="Updated at"
              value={timestampToDate(counterparty?.braid?.updatedAt)}
            ></ItemRow>
            {counterparty.braid?.status &&
              counterparty.braid?.status == "BLOCKED" && (
                <ItemRow
                  horizontal={!editable}
                  horizontalNoSpace
                  title="Blocked results"
                  value={counterparty.braid?.blockedResults ?? ""}
                ></ItemRow>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CounterpartyBraidDetailsView;
