"use client";

import { Counterparty } from "@/core/api/ApiTypes";
import Divider from "@mui/material/Divider";
import ItemRow from "@/core/components/Text/ItemRow";
import MyText from "@/core/components/Text/Text";
import MyExpandableButton from "@/core/components/Button/MyExpandableButton";
import MyEditButton from "@/core/components/Button/MyEditButton";
import MyEditableTextField from "@/core/components/TextField/MyEditableTextField";
import { useState } from "react";
import { timestampToDate } from "@/core/utils/date_time_util";
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
              title="Wire Type"
              value={counterparty?.wire?.type ?? ""}
            ></ItemRow>
            {editable && (
              <>
                <MyText size="md">Beneficiary Address details</MyText>
                <div className="pb-4" />
              </>
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
                        required: false,
                      }
                }
                value={
                  counterparty.wire?.address?.state
                    ? counterparty.wire?.address?.state
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="State"
                value={
                  counterparty.wire?.address?.state
                    ? counterparty.wire?.address?.state
                    : ""
                }
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
                value={
                  counterparty.wire?.address?.city
                    ? counterparty.wire?.address?.city
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="City"
                value={counterparty.wire?.address?.city ?? ""}
              ></ItemRow>
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
                value={
                  counterparty.wire?.address?.line1
                    ? counterparty.wire?.address?.line1
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Street Address"
                value={counterparty.wire?.address?.line1 ?? ""}
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
                value={
                  counterparty.wire?.address?.line2
                    ? counterparty.wire?.address?.line2
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Apt, Building etc"
                value={counterparty.wire?.address?.line2 ?? ""}
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
                  counterparty.wire?.address?.postalCode
                    ? counterparty.wire?.address?.postalCode
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Postal Code"
                value={counterparty.wire?.address?.postalCode ?? ""}
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
                        validate: (value: string, _: any) => {
                          const countryCodeRegex = /^[A-Z]{2}$/;
                          if (!countryCodeRegex.test(value) || value == "") {
                            return "Country code must be 2 uppercase letters";
                          }
                        },
                      }
                }
                value={
                  counterparty.wire?.address?.countryCode
                    ? counterparty.wire?.address?.countryCode
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Country Code"
                value={counterparty.wire?.address?.countryCode ?? ""}
              ></ItemRow>
            )}
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
                displayName="Receiver Bank Short Name"
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
                  counterparty.wire?.receiverShortName
                    ? counterparty.wire?.receiverShortName
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Receiver Bank Short Name"
                value={counterparty.wire?.receiverShortName ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.beneficiaryAccountNumber"
                displayName="Beneficiary FI Account Number"
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
                title="Beneficiary FI Account Number"
                value={counterparty.wire?.beneficiaryAccountNumber ?? ""}
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
                        required:
                          counterparty.wire?.type == "INTERNATIONAL"
                            ? true
                            : false,
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
                name="wire.beneficiaryFIIdType"
                displayName="Beneficiary FI ID Type"
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required:
                          counterparty.wire?.type == "INTERNATIONAL"
                            ? true
                            : false,
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
                        required:
                          counterparty.wire?.type == "INTERNATIONAL"
                            ? true
                            : false,
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
                name="wire.beneficiaryFIAddress.state"
                displayName="Beneficiary State"
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
                  counterparty.wire?.beneficiaryFIAddress?.state
                    ? counterparty.wire?.beneficiaryFIAddress?.state
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Beneficiary State"
                value={counterparty.wire?.beneficiaryFIAddress?.state ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.beneficiaryFIAddress.city"
                displayName="Beneficiary City"
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required:
                          counterparty.wire?.type == "INTERNATIONAL"
                            ? true
                            : false,
                      }
                }
                value={
                  counterparty.wire?.beneficiaryFIAddress?.city
                    ? counterparty.wire?.beneficiaryFIAddress?.city
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Beneficiary City"
                value={counterparty.wire?.beneficiaryFIAddress?.city ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.beneficiaryFIAddress.line1"
                displayName="Beneficiary Street Address"
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required:
                          counterparty.wire?.type == "INTERNATIONAL"
                            ? true
                            : false,
                      }
                }
                value={
                  counterparty.wire?.beneficiaryFIAddress?.line1
                    ? counterparty.wire?.beneficiaryFIAddress?.line1
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Beneficiary Street Address"
                value={counterparty.wire?.beneficiaryFIAddress?.line1 ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.beneficiaryFIAddress.line2"
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
                  counterparty.wire?.beneficiaryFIAddress?.line2
                    ? counterparty.wire?.beneficiaryFIAddress?.line2
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Beneficiary Apt, Building etc"
                value={counterparty.wire?.beneficiaryFIAddress?.line2 ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.beneficiaryFIAddress.postalCode"
                displayName="Beneficiary Postal Code"
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required:
                          counterparty.wire?.type == "INTERNATIONAL"
                            ? true
                            : false,
                      }
                }
                value={
                  counterparty.wire?.beneficiaryFIAddress?.postalCode
                    ? counterparty.wire?.beneficiaryFIAddress?.postalCode
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Beneficiary Postal Code"
                value={
                  counterparty.wire?.beneficiaryFIAddress?.postalCode ?? ""
                }
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.beneficiaryFIAddress.countryCode"
                displayName="Beneficiary Country Code"
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required:
                          counterparty.wire?.type == "INTERNATIONAL"
                            ? true
                            : false,
                        validate: (value: string, _: any) => {
                          if (counterparty.wire?.type == "INTERNATIONAL") {
                            const countryCodeRegex = /^[A-Z]{2}$/;
                            if (!countryCodeRegex.test(value) || value == "") {
                              return "Country code must be 2 uppercase letters";
                            }
                          }
                        },
                      }
                }
                value={
                  counterparty.wire?.beneficiaryFIAddress?.countryCode
                    ? counterparty.wire?.beneficiaryFIAddress?.countryCode
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Beneficiary Country Code"
                value={
                  counterparty.wire?.beneficiaryFIAddress?.countryCode ?? ""
                }
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.beneficiaryFIAddress.type"
                displayName="Beneficiary FI Address Type"
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required:
                          counterparty.wire?.type == "INTERNATIONAL"
                            ? true
                            : false,
                      }
                }
                value={
                  counterparty.wire?.beneficiaryFIAddress?.type
                    ? counterparty.wire?.beneficiaryFIAddress?.type
                    : ""
                }
                options={["BUSINESS", "RESIDENCE", "MAILING", "OTHER"]}
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Beneficiary FI Address Type"
                value={counterparty.wire?.beneficiaryFIAddress?.type ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.originatorAccountNumber"
                displayName="Originator FI Account Number"
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
                  counterparty.wire?.originatorAccountNumber
                    ? counterparty.wire?.originatorAccountNumber
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Originator FI Account Number"
                value={counterparty.wire?.originatorAccountNumber ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.originatorFiName"
                displayName="Originator FI Name"
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required:
                          counterparty.wire?.type == "INTERNATIONAL"
                            ? true
                            : false,
                      }
                }
                value={
                  counterparty.wire?.originatorFiName
                    ? counterparty.wire?.originatorFiName
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Originator FI Name"
                value={counterparty.wire?.originatorFiName ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.originatorFiIdType"
                displayName="Originator FI ID Type"
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required:
                          counterparty.wire?.type == "INTERNATIONAL"
                            ? true
                            : false,
                      }
                }
                value={
                  counterparty.wire?.originatorFiIdType
                    ? counterparty.wire?.originatorFiIdType
                    : ""
                }
                submitting={false}
                options={["ABA", "BIC"]}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Originator FI ID Type"
                value={counterparty.wire?.originatorFiIdType ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.originatorFiIdNumber"
                displayName="Originator ID Number"
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required:
                          counterparty.wire?.type == "INTERNATIONAL"
                            ? true
                            : false,
                      }
                }
                value={
                  counterparty.wire?.originatorFiIdNumber
                    ? counterparty.wire?.originatorFiIdNumber
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Originator ID Number"
                value={counterparty.wire?.originatorFiIdNumber ?? ""}
              ></ItemRow>
            )}
            {editable && (
              <>
                <MyText size="md">Originator FI Address</MyText>
                <div className="pb-4" />
              </>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.originatorFiAddress.state"
                displayName="Originator State"
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
                  counterparty.wire?.originatorFiAddress?.state
                    ? counterparty.wire?.originatorFiAddress?.state
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Originator State"
                value={counterparty.wire?.originatorFiAddress?.state ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.originatorFiAddress.city"
                displayName="Originator City"
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required:
                          counterparty.wire?.type == "INTERNATIONAL"
                            ? true
                            : false,
                      }
                }
                value={
                  counterparty.wire?.originatorFiAddress?.city
                    ? counterparty.wire?.originatorFiAddress?.city
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Originator City"
                value={counterparty.wire?.originatorFiAddress?.city ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.originatorFiAddress.line1"
                displayName="Originator Street Address"
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required:
                          counterparty.wire?.type == "INTERNATIONAL"
                            ? true
                            : false,
                      }
                }
                value={
                  counterparty.wire?.originatorFiAddress?.line1
                    ? counterparty.wire?.originatorFiAddress?.line1
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Originator Street Address"
                value={counterparty.wire?.originatorFiAddress?.line1 ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.originatorFiAddress.line2"
                displayName="Originator Apt, Building etc"
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
                  counterparty.wire?.originatorFiAddress?.line2
                    ? counterparty.wire?.originatorFiAddress?.line2
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Originator Apt, Building etc"
                value={counterparty.wire?.originatorFiAddress?.line2 ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.originatorFiAddress.postalCode"
                displayName="Originator Postal Code"
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required:
                          counterparty.wire?.type == "INTERNATIONAL"
                            ? true
                            : false,
                      }
                }
                value={
                  counterparty.wire?.originatorFiAddress?.postalCode
                    ? counterparty.wire?.originatorFiAddress?.postalCode
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Originator Postal Code"
                value={counterparty.wire?.originatorFiAddress?.postalCode ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.originatorFiAddress.countryCode"
                displayName="Originator Country Code"
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required:
                          counterparty.wire?.type == "INTERNATIONAL"
                            ? true
                            : false,
                        validate: (value: string, _: any) => {
                          if (counterparty.wire?.type == "INTERNATIONAL") {
                            const countryCodeRegex = /^[A-Z]{2}$/;
                            if (!countryCodeRegex.test(value) || value == "") {
                              return "Country code must be 2 uppercase letters";
                            }
                          }
                        },
                      }
                }
                value={
                  counterparty.wire?.originatorFiAddress?.countryCode
                    ? counterparty.wire?.originatorFiAddress?.countryCode
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Originator Country Code"
                value={
                  counterparty.wire?.originatorFiAddress?.countryCode ?? ""
                }
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.originatorFiAddress.type"
                displayName="Originator FI Address Type"
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required:
                          counterparty.wire?.type == "INTERNATIONAL"
                            ? true
                            : false,
                      }
                }
                value={
                  counterparty.wire?.originatorFiAddress?.type
                    ? counterparty.wire?.originatorFiAddress?.type
                    : ""
                }
                options={["BUSINESS", "RESIDENCE", "MAILING", "OTHER"]}
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Originator FI Address Type"
                value={counterparty.wire?.originatorFiAddress?.type ?? ""}
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
                        required: false,
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
                        required: false,
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
                name="wire.intermediaryFIAddress.state"
                displayName="State"
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
                  counterparty.wire?.intermediaryFIAddress?.state
                    ? counterparty.wire?.intermediaryFIAddress?.state
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Intermediary FI State"
                value={counterparty.wire?.intermediaryFIAddress?.state ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.intermediaryFIAddress.city"
                displayName="City"
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
                  counterparty.wire?.intermediaryFIAddress?.city
                    ? counterparty.wire?.intermediaryFIAddress?.city
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Intermediary FI City"
                value={counterparty.wire?.intermediaryFIAddress?.city ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.intermediaryFIAddress.line1"
                displayName="Intermediary FI Street Address"
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
                  counterparty.wire?.intermediaryFIAddress?.line1
                    ? counterparty.wire?.intermediaryFIAddress?.line1
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Intermediary FI Street Address"
                value={counterparty.wire?.intermediaryFIAddress?.line1 ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.intermediaryFIAddress.line2"
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
                  counterparty.wire?.intermediaryFIAddress?.line2
                    ? counterparty.wire?.intermediaryFIAddress?.line2
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Intermediary FI Apt, Building etc"
                value={counterparty.wire?.intermediaryFIAddress?.line2 ?? ""}
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.intermediaryFIAddress.postalCode"
                displayName="Postal Code"
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
                  counterparty.wire?.intermediaryFIAddress?.postalCode
                    ? counterparty.wire?.intermediaryFIAddress?.postalCode
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Intermediary FI Postal Code"
                value={
                  counterparty.wire?.intermediaryFIAddress?.postalCode ?? ""
                }
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.intermediaryFIAddress.countryCode"
                displayName="Intermediary FI Country Code"
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
                  counterparty.wire?.intermediaryFIAddress?.countryCode
                    ? counterparty.wire?.intermediaryFIAddress?.countryCode
                    : ""
                }
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Intermediary FI Country Code"
                value={
                  counterparty.wire?.intermediaryFIAddress?.countryCode ?? ""
                }
              ></ItemRow>
            )}
            {editable ? (
              <MyEditableTextField
                editing={isEditing}
                setEditing={setIsEditing}
                editable={false}
                name="wire.intermediaryFIAddress.type"
                displayName="Intermediary FI Address Type"
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
                  counterparty.wire?.intermediaryFIAddress?.type
                    ? counterparty.wire?.intermediaryFIAddress?.type
                    : ""
                }
                options={["BUSINESS", "RESIDENCE", "MAILING", "OTHER"]}
                submitting={false}
              />
            ) : (
              <ItemRow
                horizontal={!editable}
                title="Intermediary FI Address Type"
                value={counterparty.wire?.intermediaryFIAddress?.type ?? ""}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default CounterpartyWireDetailsView;
