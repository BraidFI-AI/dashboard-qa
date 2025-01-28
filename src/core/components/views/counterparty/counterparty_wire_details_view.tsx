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
                name="wire.receiverRoutingNumber"
                displayName="Receiver Routing Number"
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
                  counterparty.wire?.receiverRoutingNumber
                    ? counterparty.wire?.receiverRoutingNumber
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Receiver Routing Number"
                value={counterparty.wire?.receiverRoutingNumber ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.receiverShortName"
                displayName="Receiver Short Name"
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
                  counterparty.wire?.receiverShortName
                    ? counterparty.wire?.receiverShortName
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Receiver Short Name"
                value={counterparty.wire?.receiverShortName ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.intermediaryFIIdType"
                displayName="Intermediary FI ID Type"
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
                  counterparty.wire?.intermediaryFIIdType
                    ? counterparty.wire?.intermediaryFIIdType
                    : ""
                }
                submitting={false}
                options={["ABA", "BIC"]}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Intermediary FI ID Type"
                value={counterparty.wire?.intermediaryFIIdType ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.intermediaryFIIdNumber"
                displayName="Intermediary FI ID Number"
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
                  counterparty.wire?.intermediaryFIIdNumber
                    ? counterparty.wire?.intermediaryFIIdNumber
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Intermediary FI ID Number"
                value={counterparty.wire?.intermediaryFIIdNumber ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.intermediaryFIName"
                displayName="Intermediary FI Name"
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
                  counterparty.wire?.intermediaryFIName
                    ? counterparty.wire?.intermediaryFIName
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Intermediary FI Name"
                value={counterparty.wire?.intermediaryFIName ?? ""}
              ></ItemRow>
            )}
            {editable && (
              <>
                <MyText size="md">Intermediary FI Address</MyText>
                <div className="pb-4" />
              </>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.intermediaryFIAddressLine1"
                displayName="Intermediary FI Street Address"
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
                  counterparty.wire?.intermediaryFIAddressLine1
                    ? counterparty.wire?.intermediaryFIAddressLine1
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Intermediary FI Street Address"
                value={counterparty.wire?.intermediaryFIAddressLine1 ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.intermediaryFIAddressLine2"
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
                value={
                  counterparty.wire?.intermediaryFIAddressLine2
                    ? counterparty.wire?.intermediaryFIAddressLine2
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Intermediary FI Apt, Building etc"
                value={counterparty.wire?.intermediaryFIAddressLine2 ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.intermediaryFIAddressCity"
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
                  counterparty.wire?.intermediaryFIAddressCity
                    ? counterparty.wire?.intermediaryFIAddressCity
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Intermediary FI City"
                value={counterparty.wire?.intermediaryFIAddressCity ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.intermediaryFIAddressState"
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
                  counterparty.wire?.intermediaryFIAddressState
                    ? counterparty.wire?.intermediaryFIAddressState
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Intermediary FI State"
                value={counterparty.wire?.intermediaryFIAddressState ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.intermediaryFIAddressPostalCode"
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
                  counterparty.wire?.intermediaryFIAddressPostalCode
                    ? counterparty.wire?.intermediaryFIAddressPostalCode
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Intermediary FI Postal Code"
                value={counterparty.wire?.intermediaryFIAddressPostalCode ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.intermediaryFIAddressCountryCode"
                displayName="Intermediary FI Country Code"
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
                  counterparty.wire?.intermediaryFIAddressCountryCode
                    ? counterparty.wire?.intermediaryFIAddressCountryCode
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Intermediary FI Country Code"
                value={
                  counterparty.wire?.intermediaryFIAddressCountryCode ?? ""
                }
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.beneficiaryFIIdType"
                displayName="Beneficiary FI ID Type"
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
                  counterparty.wire?.beneficiaryFIIdType
                    ? counterparty.wire?.beneficiaryFIIdType
                    : ""
                }
                submitting={false}
                options={["ABA", "BIC"]}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Beneficiary FI ID Type"
                value={counterparty.wire?.beneficiaryFIIdType ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.beneficiaryIdNumber"
                displayName="Beneficiary ID Number"
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
                  counterparty.wire?.beneficiaryIdNumber
                    ? counterparty.wire?.beneficiaryIdNumber
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Beneficiary ID Number"
                value={counterparty.wire?.beneficiaryIdNumber ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.beneficiaryFIName"
                displayName="Beneficiary FI Name"
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
                  counterparty.wire?.beneficiaryFIName
                    ? counterparty.wire?.beneficiaryFIName
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Beneficiary FI Name"
                value={counterparty.wire?.beneficiaryFIName ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.beneficiaryAccountNumber"
                displayName="Beneficiary Account Number"
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
                  counterparty.wire?.beneficiaryAccountNumber
                    ? counterparty.wire?.beneficiaryAccountNumber
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Beneficiary Account Number"
                value={counterparty.wire?.beneficiaryAccountNumber ?? ""}
              ></ItemRow>
            )}
            {editable && (
              <>
                <MyText size="md">Beneficiary FI Address</MyText>
                <div className="pb-4" />
              </>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.beneficiaryFIAddressLine1"
                displayName="Beneficiary Street Address"
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
                  counterparty.wire?.beneficiaryFIAddressLine1
                    ? counterparty.wire?.beneficiaryFIAddressLine1
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Beneficiary Street Address"
                value={counterparty.wire?.beneficiaryFIAddressLine1 ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.beneficiaryFIAddressLine2"
                displayName="Beneficiary Apt, Building etc"
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
                  counterparty.wire?.beneficiaryFIAddressLine2
                    ? counterparty.wire?.beneficiaryFIAddressLine2
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Beneficiary Apt, Building etc"
                value={counterparty.wire?.beneficiaryFIAddressLine2 ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.beneficiaryFIAddressCity"
                displayName="Beneficiary City"
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
                  counterparty.wire?.beneficiaryFIAddressCity
                    ? counterparty.wire?.beneficiaryFIAddressCity
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Beneficiary City"
                value={counterparty.wire?.beneficiaryFIAddressCity ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.beneficiaryFIAddressState"
                displayName="Beneficiary State"
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
                  counterparty.wire?.beneficiaryFIAddressState
                    ? counterparty.wire?.beneficiaryFIAddressState
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Beneficiary State"
                value={counterparty.wire?.beneficiaryFIAddressState ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.beneficiaryFIAddressPostalCode"
                displayName="Beneficiary Postal Code"
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
                  counterparty.wire?.beneficiaryFIAddressPostalCode
                    ? counterparty.wire?.beneficiaryFIAddressPostalCode
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Beneficiary Postal Code"
                value={counterparty.wire?.beneficiaryFIAddressPostalCode ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.beneficiaryFIAddressCountryCode"
                displayName="Beneficiary Country Code"
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
                  counterparty.wire?.beneficiaryFIAddressCountryCode
                    ? counterparty.wire?.beneficiaryFIAddressCountryCode
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Beneficiary Country Code"
                value={counterparty.wire?.beneficiaryFIAddressCountryCode ?? ""}
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
