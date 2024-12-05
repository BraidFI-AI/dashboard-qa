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
  editable?: boolean;
};

const CounterpartyACHDetailsView: React.FC<CounterpartyACHDetailsViewProps> = ({
  counterparty,
  control,
  errors,
  submitting,
  isEditing,
  setIsEditing,
  editable = true,
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
          {editable && (
            <div>
              <MyEditButton editing={isEditing} setEditing={setIsEditing} />
            </div>
          )}
          <div className="w-full">
            <ItemRow
              horizontal={!editable}
              title="ID"
              value={counterparty?.ach?.id ?? ""}
            ></ItemRow>
            {editable ? (
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
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Gateway Routing Number"
                value={counterparty.ach?.bankName ?? ""}
              ></ItemRow>
            )}
            {editable ? (
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
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Gateway Routing Number"
                value={counterparty.ach?.gatewayRoutingNumber ?? ""}
              ></ItemRow>
            )}
            {editable ? (
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
            ) : (
              <ItemRow
                horizontal={!editable}
                title="RDFI Number Qualifier"
                value={counterparty.ach?.rdfiNumberQualifier ?? ""}
              ></ItemRow>
            )}
            {editable ? (
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
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Account Type"
                value={counterparty.ach?.bankAccountType ?? ""}
              ></ItemRow>
            )}
            {editable ? (
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
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Rounting Number"
                value={counterparty.ach?.routingNumber ?? ""}
              ></ItemRow>
            )}
            {editable ? (
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
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Account Number"
                value={counterparty.ach?.accountNumber ?? ""}
              ></ItemRow>
            )}
            {editable ? (
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
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Country Code"
                value={counterparty.ach?.countryCode ?? ""}
              ></ItemRow>
            )}
            <ItemRow
              horizontal={!editable}
              title="Status"
              value={counterparty?.ach?.status ?? ""}
            ></ItemRow>
            {editable && (
              <>
                <MyText size="md">Bank Address</MyText>
                <div className="pb-4" />
              </>
            )}
            {editable ? (
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
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Street Address"
                value={counterparty.ach?.receiverStreetAddress ?? ""}
              ></ItemRow>
            )}
            {editable ? (
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
            ) : (
              <ItemRow
                horizontal={!editable}
                title="City"
                value={counterparty.ach?.receiverCity ?? ""}
              ></ItemRow>
            )}
            {editable ? (
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
            ) : (
              <ItemRow
                horizontal={!editable}
                title="State"
                value={counterparty.ach?.receiverState ?? ""}
              ></ItemRow>
            )}
            {editable ? (
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
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Postal Code"
                value={counterparty.ach?.receiverPostalCode ?? ""}
              ></ItemRow>
            )}
            <ItemRow
              horizontal={!editable}
              title="Created at"
              value={timestampToDate(counterparty?.ach?.createdAt)}
            ></ItemRow>
            <ItemRow
              horizontal={!editable}
              title="Updated at"
              value={timestampToDate(counterparty?.ach?.updatedAt)}
            ></ItemRow>
            {counterparty.ach?.status &&
              counterparty.ach?.status == "BLOCKED" && (
                <ItemRow
                  horizontal={!editable}
                  title="Blocked results"
                  values={[]}
                ></ItemRow>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CounterpartyACHDetailsView;
