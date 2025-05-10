"use client";

import ErrorPage from "@/core/components/error_page";

import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import MyText from "@/core/components/Text/Text";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import Box from "@mui/material/Box";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import { useAppDispatch } from "@/redux/store/store";
import RadioButton from "@/core/components/Button/RadioButton";
import { useState } from "react";
import MyControlledMultiAutocomplete from "@/core/components/Autocomplete/MyControlledMultiAutocomplete";
import {
  fetchTransactionTypes,
  TransactionTypesType,
} from "@/redux/slices/AppSlice";
import { useSelector } from "react-redux";
import AddRestrictedEntity from "./add_restricted_entity";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

type CreateRestrictedEntityProps = {
  control: any;
  errors: any;
  submitting: boolean;
  types: string[];
  setTypes: (types: string[]) => void;
  groups: string[];
  setGroups: (groups: string[]) => void;
  setValue: any;
  associatedEntityType: string;
  setAssociatedEntityType: (associatedEntityType: string) => void;
  countries:
    | "loading"
    | string
    | { countryName: string; countryCodeISO2: string }[];
  setCountries: any;
  restrictedEntities: {
    entityType: string;
    entityName: string;
    entityCode?: string;
  }[];
  setRestrictedEntities: (
    restrictedEntity: {
      entityType: string;
      entityName: string;
      entityCode?: string;
    }[]
  ) => void;
  entityId?: string;
  entityType?: string;
};

const CreateRestrictedEntity = ({
  control,
  errors,
  submitting,
  types,
  setTypes,
  groups,
  setGroups,
  setValue,
  associatedEntityType,
  setAssociatedEntityType,
  countries,
  setCountries,
  restrictedEntities,
  setRestrictedEntities,
  entityId,
  entityType,
}: CreateRestrictedEntityProps) => {
  const dispatch = useAppDispatch();

  const [parameterType, setParameterType] =
    useState<string>("Transaction Types");

  const transactionTypes: TransactionTypesType = useSelector(
    (state: any) => state.app.transactionTypes
  );

  return (
    <>
      <div className="flex flex-row items-start">
        <div className="flex flex-col w-[350px] justify-between pr-[30px]">
          <MyText>Limit Name</MyText>
          <MyControlledTextField
            name="limitName"
            displayName="Limit Name"
            control={control}
            errors={errors}
            rules={
              submitting
                ? { required: false }
                : {
                    required: true,
                  }
            }
            value=""
          />
          <Box className="pb-4"></Box>
          <MyText>Associated Entity Type</MyText>
          <MyControlledAutocomplete
            value={associatedEntityType}
            displayName="Associated Entity Type"
            clearable={false}
            disabled={entityType != null ? true : false}
            name={"associatedEntityType"}
            control={control}
            errors={errors}
            rules={
              submitting
                ? { required: false }
                : {
                    required: true,
                  }
            }
            options={["GLOBAL", "PROGRAM", "PRODUCT", "ACCOUNT"]}
            customOnChange={(val: string) => {
              setAssociatedEntityType(val);
            }}
          />
          <Box className="pb-4"></Box>
          <MyText>Action</MyText>
          <MyControlledAutocomplete
            value={"FLAG"}
            displayName="Action"
            clearable={false}
            name={"action"}
            control={control}
            errors={errors}
            rules={
              submitting
                ? { required: false }
                : {
                    required: true,
                  }
            }
            options={["FLAG", "DECLINE"]}
          />
          <Box className="pb-4"></Box>
          <MyText>Aggregation Days</MyText>
          <MyControlledTextField
            name="aggregationDays"
            displayName="Aggregation Days"
            control={control}
            errors={errors}
            rules={
              submitting
                ? { required: false }
                : {
                    required: false,
                  }
            }
            value=""
          />
          <Box className="pb-4"></Box>
          <RadioButton
            title=""
            value={parameterType}
            setValue={(val: string) => {
              setParameterType(val);
              setGroups([]);
              setTypes([]);
              setValue("transactionTypes", []);
              setValue("transactionGroups", []);
            }}
            options={["Transaction Types", "Transaction Groups"]}
            layout="horizontal"
          />
          <Box className="pb-4"></Box>
          {parameterType == "Transaction Groups" ? (
            <MyControlledMultiAutocomplete
              value={groups}
              displayName="Transaction Groups"
              name={"transactionGroups"}
              control={control}
              errors={errors}
              rules={{}}
              options={[
                "ALL_TRANSACTION",
                "ALL_CREDIT",
                "ALL_DEBIT",
                "ALL_ACH",
                "ALL_WIRE",
              ]}
              customOnChange={(val: string[]) => {
                setGroups(val);
              }}
            />
          ) : (
            <>
              <MyText>Transaction type</MyText>
              {transactionTypes == "loading" ? (
                <MyCircularProgressIndicator />
              ) : typeof transactionTypes == "string" ? (
                <ErrorPage
                  error={transactionTypes}
                  recoveryButtonOnClick={() => {
                    dispatch(fetchTransactionTypes());
                  }}
                  recoveryButtonTitle="Retry"
                />
              ) : (
                <MyControlledMultiAutocomplete
                  value={types}
                  displayName="Transaction Types"
                  name={"transactionTypes"}
                  control={control}
                  errors={errors}
                  rules={{}}
                  options={transactionTypes}
                  customOnChange={(val: string[]) => {
                    setTypes(val);
                  }}
                />
              )}
            </>
          )}
        </div>
        <div className="flex flex-col w-[350px] justify-between">
          <MyText>Aggregation Level</MyText>
          <MyControlledAutocomplete
            value={"TRANSACTION"}
            displayName="Aggregation Level"
            clearable={false}
            name={"aggregationLevel"}
            control={control}
            errors={errors}
            rules={
              submitting
                ? { required: false }
                : {
                    required: true,
                  }
            }
            options={[
              "TRANSACTION",
              "ACCOUNT_COUNTERPARTY",
              "ACCOUNT",
              "PRODUCT",
              "PROGRAM",
              "GLOBAL",
            ]}
          />
          <Box className="pb-4"></Box>
          <MyText>Associated Entity ID</MyText>
          <MyControlledTextField
            name="associatedEntityId"
            displayName="Associated Entity ID"
            control={control}
            errors={errors}
            disabled={entityType != null && entityType != "ACCOUNT"}
            rules={
              submitting
                ? { required: false }
                : {
                    required: associatedEntityType != "GLOBAL" ? true : false,
                  }
            }
            value={entityId ?? ""}
          />
          <Box className="pb-4"></Box>
          <MyText>Volume</MyText>
          <MyControlledTextField
            name="volume"
            displayName="Volume"
            control={control}
            errors={errors}
            rules={
              submitting
                ? { required: false }
                : {
                    required: false,
                  }
            }
            value=""
          />
          <Box className="pb-4"></Box>
          <MyText>Frequency Max</MyText>
          <MyControlledTextField
            name="frequencyMax"
            displayName="Frequency Max"
            control={control}
            errors={errors}
            rules={
              submitting
                ? { required: false }
                : {
                    required: false,
                  }
            }
            value=""
          />
          <Box className="pb-4"></Box>
        </div>
      </div>
      <Box className="pb-4"></Box>
      <div className="flex flex-col w-[600px]">
        <MyText>Restricted Entities</MyText>
        <div className="pb-4"></div>
        <AddRestrictedEntity
          countries={countries}
          setCountries={setCountries}
          setRestrictedEntities={setRestrictedEntities}
          restrictedEntities={restrictedEntities}
        />
        <Box className="pb-4"></Box>
        {restrictedEntities.map((restrictedEntity, index) => (
          <div key={index} className="flex flex-row justify-between w-[600px]">
            <div className="flex flex-row">
              <div className="flex flex-row w-[170px]">
                <div className="pr-1">
                  <MyText>{`Type: `}</MyText>{" "}
                </div>
                <MyText weight="semibold">{restrictedEntity.entityType}</MyText>
              </div>
              <div className="flex flex-row w-[170px]">
                <div className="pr-1">
                  <MyText>{`Name: `}</MyText>{" "}
                </div>
                <MyText weight="semibold">{restrictedEntity.entityName}</MyText>
              </div>
              {restrictedEntity.entityCode && (
                <div className="flex flex-row w-[170px]">
                  <div className="pr-1">
                    <MyText>{`Code: `}</MyText>{" "}
                  </div>
                  <MyText weight="semibold">
                    {restrictedEntity.entityCode}
                  </MyText>
                </div>
              )}
            </div>
            <IconButton
              onClick={() => {
                setRestrictedEntities(
                  restrictedEntities.filter((_, i) => i !== index)
                );
              }}
            >
              <DeleteOutlineRoundedIcon
                style={{ color: "red", height: "20px", width: "20px" }}
              />
            </IconButton>
          </div>
        ))}
      </div>
    </>
  );
};

export default CreateRestrictedEntity;
