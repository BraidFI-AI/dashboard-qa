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
  editable?: boolean;
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
  editable = true,
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
          {editable && (
            <div>
              <MyEditButton editing={isEditing} setEditing={setIsEditing} />
            </div>
          )}
          <div className="w-full">
            <ItemRow
              horizontal={!editable}
              title="ID"
              value={counterparty?.wire?.id ?? ""}
            ></ItemRow>
            <ItemRow
              horizontal={!editable}
              title="Contact ID"
              value={counterparty?.wire?.contactId ?? ""}
            ></ItemRow>
            {editable ? (
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
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Bank Name"
                value={counterparty.wire?.bankName ?? ""}
              ></ItemRow>
            )}
            {editable ? (
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
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Routing Number Type"
                value={counterparty.wire?.routingNumberType ?? ""}
              ></ItemRow>
            )}
            {editable ? (
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
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Routing Number"
                value={counterparty.wire?.routingNumber ?? ""}
              ></ItemRow>
            )}
            {editable ? (
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
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Intermediary Routing Number"
                value={counterparty.wire?.accountNumber ?? ""}
              ></ItemRow>
            )}
            {editable ? (
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
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Account Number"
                value={counterparty.wire?.accountNumber ?? ""}
              ></ItemRow>
            )}
            <ItemRow
              horizontal={!editable}
              title="Status"
              value={counterparty?.wire?.status ?? ""}
            ></ItemRow>
            <ItemRow
              horizontal={!editable}
              title="Created at"
              value={timestampToDate(counterparty?.wire?.createdAt)}
            ></ItemRow>

            <ItemRow
              horizontal={!editable}
              title="Updated at"
              value={timestampToDate(counterparty?.wire?.updatedAt)}
            ></ItemRow>
            {counterparty.wire?.status &&
              counterparty.wire?.status == "BLOCKED" && (
                <>
                  {editable ? (
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
                  ) : (
                    <ItemRow
                      horizontal={!editable}
                      title="Blocked results"
                      value={counterparty.wire?.blockedResults ?? ""}
                    ></ItemRow>
                  )}
                </>
              )}
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
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Street Address"
                value={counterparty.wire?.line1 ?? ""}
              ></ItemRow>
            )}
            {editable ? (
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
                        required: false,
                      }
                }
                value={counterparty.wire?.line2 ? counterparty.wire?.line2 : ""}
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Apt, Building etc"
                value={counterparty.wire?.line2 ?? ""}
              ></ItemRow>
            )}
            {editable ? (
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
            ) : (
              <ItemRow
                horizontal={!editable}
                title="City"
                value={counterparty.wire?.city ?? ""}
              ></ItemRow>
            )}
            {editable ? (
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
            ) : (
              <ItemRow
                horizontal={!editable}
                title="State"
                value={counterparty.wire?.state ?? ""}
              ></ItemRow>
            )}
            {editable ? (
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
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Postal Code"
                value={counterparty.wire?.postalCode ?? ""}
              ></ItemRow>
            )}
            {editable ? (
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
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Country Code"
                value={counterparty.wire?.countryCode ?? ""}
              ></ItemRow>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CounterpartyWireDetailsView;
