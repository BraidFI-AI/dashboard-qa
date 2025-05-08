"use client";

import ErrorPage from "@/core/components/error_page";

import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import MyText from "@/core/components/Text/Text";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import { Box } from "@mui/material";
import { fetchProgramIdsListWithNames } from "@/redux/slices/ProgramSlice";
import { LimitType } from "./create_velocity_limit";
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
type CreateRoundedNumberProps = {
  control: any;
  errors: any;
  submitting: boolean;
  limitType: any;
  setLimitType: (limitType: any) => void;
  programIdsList: any;
  setProgramIdsList: (programIdsList: any) => void;
  setProgramId: (programId: any) => void;
  types: string[];
  setTypes: (types: string[]) => void;
  groups: string[];
  setGroups: (groups: string[]) => void;
  setValue: any;
};

const CreateRoundedNumber = ({
  control,
  errors,
  submitting,
  limitType,
  setLimitType,
  programIdsList,
  setProgramIdsList,
  setProgramId,
  types,
  setTypes,
  groups,
  setGroups,
  setValue,
}: CreateRoundedNumberProps) => {
  const dispatch = useAppDispatch();

  const [parameterType, setParameterType] =
    useState<string>("Transaction Types");

  const transactionTypes: TransactionTypesType = useSelector(
    (state: any) => state.app.transactionTypes
  );

  return (
    <>
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
        <MyText>Program</MyText>
        {programIdsList == "loading" ? (
          <MyCircularProgressIndicator />
        ) : typeof programIdsList == "string" ? (
          <ErrorPage
            error={programIdsList}
            recoveryButtonTitle="Retry"
            recoveryButtonOnClick={() => {
              dispatch(fetchProgramIdsListWithNames()).then((data: any) => {
                setProgramIdsList(data.payload);
                if (data.payload?.length > 0) {
                  setProgramId(data.payload[0]?.id);
                }
              });
            }}
          />
        ) : programIdsList.length == 0 ? (
          <MyText>No Program found</MyText>
        ) : (
          <MyControlledAutocomplete
            value={`${programIdsList[0].id} - ${programIdsList[0].name}`}
            displayName="Program Name"
            name={"programId"}
            control={control}
            errors={errors}
            rules={
              submitting
                ? { required: false }
                : {
                    required: true,
                  }
            }
            options={programIdsList?.map((prg: any) => {
              return `${prg.id} - ${prg.name}`;
            })}
            customOnChange={(val: string) => {
              const id = val?.split(" - ")[0];
              if (id) {
                setProgramId(id);
              }
            }}
          />
        )}
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
                  required: true,
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
    </>
  );
};

export default CreateRoundedNumber;
