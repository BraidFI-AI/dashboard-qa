"use client";

import { Counterparty } from "@/core/api/ApiTypes";
import Divider from "@mui/material/Divider";
import ItemRow from "@/core/components/Text/ItemRow";
import MyText from "@/core/components/Text/Text";
import MyExpandableButton from "@/core/components/Button/MyExpandableButton";
import MyEditButton from "@/core/components/Button/MyEditButton";
import MyEditableTextField from "@/core/components/TextField/MyEditableTextField";
import { useState } from "react";
import timestampToDate from "@/core/utils/timestampToDate";

type CounterpartyWireDetailsViewProps = {
  counterparty: Counterparty;
  control: any;
  errors: any;
  submitting: any;
  setIsEditing: any;
  isEditing: any;
};

const CounterpartyWireDetailsView: React.FC<
  CounterpartyWireDetailsViewProps
> = ({
  counterparty,
  control,
  errors,
  submitting,
  isEditing,
  setIsEditing,
}) => {
  const [expandDetails, toggleExpandDetails] = useState(false);

  console.log("CPPPPT:", counterparty);

  return (
    <div className="flex flex-col">
      <MyExpandableButton
        title="Wire Payment Instrument"
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
            <ItemRow title="ID" value={counterparty?.wire?.id ?? ""}></ItemRow>
            {/* <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.id"
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
              value={counterparty.wire?.id ? counterparty.wire?.id : ""}
              submitting={false}
            /> */}
            <ItemRow
              title="Contact ID"
              value={counterparty?.wire?.contactId ?? ""}
            ></ItemRow>
            {/* <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.contactId"
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
                counterparty.wire?.contactId ? counterparty.wire?.contactId : ""
              }
              submitting={false}
            /> */}
            {/* <ItemRow
              title="Bank Name"
              value={counterparty.wire.bankName ?? ""}
            ></ItemRow> */}
            <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.bankName"
              displayName="Bank Name"
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
                counterparty.wire?.bankName ? counterparty.wire?.bankName : ""
              }
              submitting={false}
            />
            {/* <ItemRow
              title="Account Type"
              value={counterparty.wire.bankAccountType ?? ""}
            ></ItemRow> */}
            <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.routingNumberType"
              displayName="Routing Number Type"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: false,
                    }
              }
              value={
                counterparty.wire?.routingNumberType
                  ? counterparty.wire?.routingNumberType
                  : ""
              }
              submitting={false}
              options={["ABA", "BIC"]}
            />
            {/* <ItemRow
              title="Routing Number"
              value={counterparty.wire.routingNumber ?? ""}
            ></ItemRow> */}
            <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.routingNumber"
              displayName="Routing Number"
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
                counterparty.wire?.routingNumber
                  ? counterparty.wire?.routingNumber
                  : ""
              }
              submitting={false}
            />
            <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.intermediaryRoutingNumber"
              displayName="Intermediary Routing Number"
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
                counterparty.wire?.intermediaryRoutingNumber
                  ? counterparty.wire?.intermediaryRoutingNumber
                  : ""
              }
              submitting={false}
            />
            {/* <ItemRow
              title="Account Number"
              value={counterparty.wire.accountNumber ?? ""}
            ></ItemRow> */}
            <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.accountNumber"
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
                counterparty.wire?.accountNumber
                  ? counterparty.wire?.accountNumber
                  : ""
              }
              submitting={false}
            />
            <ItemRow
              title="Status"
              value={counterparty?.wire?.status ?? ""}
            ></ItemRow>
            {/* <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.status"
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
              value={counterparty.wire?.status ? counterparty.wire?.status : ""}
              submitting={false}
            /> */}
            <ItemRow
              title="Created at"
              value={timestampToDate(counterparty?.wire?.createdAt)}
            ></ItemRow>

            <ItemRow
              title="Updated at"
              value={timestampToDate(counterparty?.wire?.updatedAt)}
            ></ItemRow>
            {/* <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.updated_at"
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
                counterparty.wire?.updated_at
                  ? counterparty.wire?.updated_at
                  : ""
              }
              submitting={false}
            /> */}
            {counterparty.wire?.status &&
              counterparty.wire?.status == "BLOCKED" && (
                // <ItemRow title="Blocked results" values={[]}></ItemRow>
                <MyEditableTextField
                  editing={isEditing}
                  setEditing={setIsEditing}
                  editable={false}
                  name="wire.blockedResults"
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
                    counterparty.wire?.blockedResults
                      ? counterparty.wire?.blockedResults
                      : ""
                  }
                  submitting={false}
                />
              )}
            <MyText size="md">Bank Address</MyText>
            <div className="pb-4" />
            {/* <ItemRow
              title="Street Address"
              value={counterparty.wire.line1 ?? ""}
            ></ItemRow> */}
            <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.address.type"
              displayName="Address Type"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: true,
                    }
              }
              options={["OTHER", "MAILING", "RESIDENCE", "BUSINESS"]}
              value={counterparty.wire?.type ? counterparty.wire?.type : ""}
              submitting={false}
            />
            <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.address.line1"
              displayName="Street Address"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: true,
                    }
              }
              value={counterparty.wire?.line1 ? counterparty.wire?.line1 : ""}
              submitting={false}
            />
            {/* <ItemRow
              title="Apt, Building etc"
              value={counterparty.wire.line2 ?? ""}
            ></ItemRow> */}
            <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.address.line2"
              displayName="Apt, Building etc"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: true,
                    }
              }
              value={counterparty.wire?.line2 ? counterparty.wire?.line2 : ""}
              submitting={false}
            />
            {/* <ItemRow
              title="City"
              value={counterparty.wire.city ?? ""}
            ></ItemRow> */}
            <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.address.city"
              displayName="City"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: true,
                    }
              }
              value={counterparty.wire?.city ? counterparty.wire?.city : ""}
              submitting={false}
            />
            {/* <ItemRow
              title="State"
              value={counterparty.wire.state ?? ""}
            ></ItemRow> */}
            <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.address.state"
              displayName="State"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: true,
                    }
              }
              value={counterparty.wire?.state ? counterparty.wire?.state : ""}
              submitting={false}
            />
            {/* <ItemRow title="Postal Code" value={counterparty.wire.postalCode ?? ""}></ItemRow> */}
            <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.address.postalCode"
              displayName="Postal Code"
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
                counterparty.wire?.postalCode
                  ? counterparty.wire?.postalCode
                  : ""
              }
              submitting={false}
            />
            <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="wire.address.countryCode"
              displayName="Country Code"
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
                counterparty.wire?.countryCode
                  ? counterparty.wire?.countryCode
                  : ""
              }
              submitting={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CounterpartyWireDetailsView;
