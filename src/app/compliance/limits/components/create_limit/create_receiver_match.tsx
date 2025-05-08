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

type CreateReceiverMatchProps = {
  control: any;
  errors: any;
  submitting: boolean;
  limitType: any;
  setLimitType: (limitType: any) => void;
  programIdsList: any;
  setProgramIdsList: (programIdsList: any) => void;
  setProgramId: (programId: any) => void;
};

const CreateReceiverMatch = ({
  control,
  errors,
  submitting,
  limitType,
  setLimitType,
  programIdsList,
  setProgramIdsList,
  setProgramId,
}: CreateReceiverMatchProps) => {
  const dispatch = useAppDispatch();

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
        <MyText>Volume (0.1-1.0)</MyText>
        <MyControlledTextField
          name="volumeMatch"
          displayName="Volume"
          control={control}
          errors={errors}
          rules={
            submitting
              ? { required: false }
              : {
                  required: true,
                  pattern:
                    /^(0\.1|0\.2|0\.3|0\.4|0\.5|0\.6|0\.7|0\.8|0\.9|1\.0)$/,
                }
          }
          value=""
        />
        <Box className="pb-4"></Box>
      </div>
    </>
  );
};

export default CreateReceiverMatch;
