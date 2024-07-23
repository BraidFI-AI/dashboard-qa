"use client";

import { Counterparty } from "@/core/api/ApiTypes";
import Divider from "@mui/material/Divider";
import ItemRow from "@/core/components/Text/ItemRow";
import MyText from "@/core/components/Text/Text";
import MyEditButton from "@/core/components/Button/MyEditButton";
import MyEditableTextField from "@/core/components/TextField/MyEditableTextField";
import MyExpandableButton from "@/core/components/Button/MyExpandableButton";
import { useState } from "react";
import timestampToDate from "@/core/utils/timestampToDate";

type CounterpartyACHDetailsViewProps = {
  counterparty: Counterparty;
  control: any;
  errors: any;
  submitting: any;
  setIsEditing: any;
  isEditing: any;
};

const CounterpartyACHDetailsView: React.FC<CounterpartyACHDetailsViewProps> = ({
  counterparty,
  control,
  errors,
  submitting,
  isEditing,
  setIsEditing,
}) => {
  const [expandDetails, toggleExpandDetails] = useState(false);

  return (
    <div className="flex flex-col">
      <MyExpandableButton
        title="ACH Payment Instrument"
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
            <ItemRow title="ID" value={counterparty?.ach?.id ?? ""}></ItemRow>
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
              value={counterparty.ach?.id ? counterparty.ach?.id : ""}
              submitting={false}
            /> */}
            {/* <ItemRow
              title="Contact ID"
              value={counterparty?.ach?.contactId ?? ""}
            ></ItemRow> */}
            {/* <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="ach.contactId"
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
                counterparty.ach?.contactId ? counterparty.ach?.contactId : ""
              }
              submitting={false}
            /> */}
            {/* <ItemRow
              title="Bank Name"
              value={counterparty?.ach?.bankName ?? ""}
            ></ItemRow> */}
            <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="ach.bankName"
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
                counterparty.ach?.bankName ? counterparty.ach?.bankName : ""
              }
              submitting={false}
            />
            <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="ach.gatewayRoutingNumber"
              displayName="Gateway Routing Number"
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
                counterparty.ach?.gatewayRoutingNumber
                  ? counterparty.ach?.gatewayRoutingNumber
                  : ""
              }
              submitting={false}
            />
            <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="ach.rdfiNumberQualifier"
              displayName="RDFI Number Qualifier"
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
                counterparty.ach?.rdfiNumberQualifier
                  ? counterparty.ach?.rdfiNumberQualifier
                  : ""
              }
              options={["NATIONAL_CLEARING_SYSTEM", "IBAN", "BIC"]}
              submitting={false}
            />
            {/* <ItemRow
              title="Account Type"
              value={counterparty?.ach?.bankAccountType ?? ""}
            ></ItemRow> */}
            <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="ach.bankAccountType"
              displayName="Account Type"
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
                counterparty.ach?.bankAccountType
                  ? counterparty.ach?.bankAccountType
                  : ""
              }
              submitting={false}
            />
            {/* <ItemRow
              title="Routing Number"
              value={counterparty?.ach?.routingNumber ?? ""}
            ></ItemRow> */}
            <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="ach.routingNumber"
              displayName="Rounting Number"
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
                counterparty.ach?.routingNumber
                  ? counterparty.ach?.routingNumber
                  : ""
              }
              submitting={false}
            />
            {/* <ItemRow
                title="Account Number"
                value={counterparty.ach.accountNumber ?? ""}
              ></ItemRow> */}
            <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="ach.accountNumber"
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
                counterparty.ach?.accountNumber
                  ? counterparty.ach?.accountNumber
                  : ""
              }
              submitting={false}
            />
            <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="ach.countryCode"
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
                counterparty.ach?.countryCode
                  ? counterparty.ach?.countryCode
                  : ""
              }
              submitting={false}
            />
            <ItemRow
              title="Status"
              value={counterparty?.ach?.status ?? ""}
            ></ItemRow>
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
              name="ach.receiverStreetAddress"
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
              value={
                counterparty.ach?.receiverStreetAddress
                  ? counterparty.ach?.receiverStreetAddress
                  : ""
              }
              submitting={false}
            />
            {/* <ItemRow
              title="Apt, Building etc"
              value={counterparty.wire.line2 ?? ""}
            ></ItemRow> */}
            {/* <ItemRow
              title="City"
              value={counterparty.wire.city ?? ""}
            ></ItemRow> */}
            <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="ach.receiverCity"
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
              value={
                counterparty.ach?.receiverCity
                  ? counterparty.ach?.receiverCity
                  : ""
              }
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
              name="ach.receiverState"
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
              value={
                counterparty.ach?.receiverState
                  ? counterparty.ach?.receiverState
                  : ""
              }
              submitting={false}
            />
            {/* <ItemRow title="Postal Code" value={counterparty.wire.postalCode ?? ""}></ItemRow> */}
            <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="ach.receiverPostalCode"
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
                counterparty.ach?.receiverPostalCode
                  ? counterparty.ach?.receiverPostalCode
                  : ""
              }
              submitting={false}
            />
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
              value={counterparty.ach?.status ? counterparty.ach?.status : ""}
              submitting={false}
            /> */}
            <ItemRow
              title="Created at"
              value={timestampToDate(counterparty?.ach?.createdAt)}
            ></ItemRow>
            <ItemRow
              title="Updated at"
              value={timestampToDate(counterparty?.ach?.updatedAt)}
            ></ItemRow>
            {/* <MyEditableTextField
              editing={isEditing}
              setEditing={setIsEditing}
              editable={false}
              name="updated_at"
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
                counterparty.ach?.updated_at ? counterparty.ach?.updated_at : ""
              }
              submitting={false}
            /> */}
            {counterparty.ach?.status &&
              counterparty.ach?.status == "BLOCKED" && (
                <ItemRow title="Blocked results" values={[]}></ItemRow>
                // <MyEditableTextField
                //   editing={isEditing}
                //   setEditing={setIsEditing}
                //   editable={false}
                //   name="ach.blockedResults"
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
                //     counterparty.ach?.blockedResults
                //       ? counterparty.ach?.blockedResults
                //       : ""
                //   }
                //   submitting={false}
                // />
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CounterpartyACHDetailsView;
