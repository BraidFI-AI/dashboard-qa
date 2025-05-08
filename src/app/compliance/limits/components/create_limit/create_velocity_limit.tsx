"use client";

import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyText from "@/core/components/Text/Text";
import { fetchProgramIdsListWithNames } from "@/redux/slices/ProgramSlice";
import {
  createReceiverMatchLimit,
  createRoundedNumberLimit,
  createTransactionLimit,
  fetchVelocityLimits,
  getRestrictedEntities,
} from "@/redux/slices/velocity_limit_slice";
import { useAppDispatch } from "@/redux/store/store";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form";
import CreateReceiverMatch from "./create_receiver_match";
import CreateRoundedNumber from "./create_rounded_number";
import CreateRestrictedEntity from "./restricted_entity";
import CreateTransaction from "./transaction";
import { useSearchParams } from "next/navigation";
import { VelocityLimitFilters } from "@/core/api/ApiTypes";

export enum LimitType {
  RECEIVER_MATCH = "Receiver Match",
  ROUNDED_NUMBER = "Rounded Number",
  RESTRICTED_ENTITY = "Restricted Entity",
  TRANSACTION = "Transaction",
}

const CreateVelocityLimit = () => {
  const qParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<VelocityLimitFilters>({});
  const [submitting, setSubmitting] = useState(false);
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  const [limitType, setLimitType] = useState<LimitType>(
    LimitType.RECEIVER_MATCH
  );

  const [programIdsList, setProgramIdsList] = useState<
    "loading" | string | { name: string; id: string }[]
  >("loading");
  const [programId, setProgramId] = useState<string | null>(null);

  const [types, setTypes] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);

  const [associatedEntityType, setAssociatedEntityType] =
    useState<string>("ACCOUNT");

  const [countries, setCountries] = useState<
    "loading" | string | { countryName: string; countryCodeISO2: string }[]
  >("loading");

  const [restrictedEntities, setRestrictedEntities] = useState<
    { entityType: string; entityName: string; entityCode?: string }[]
  >([]);

  const fetchLimitsHelper = () => {
    const params: { [anyProp: string]: string | string[] } = {};
    qParams.forEach((value, key) => {
      if (value.includes(",")) {
        params[key] = value.split(",");
      } else {
        params[key] = value;
      }
    });

    setFilters(params as VelocityLimitFilters);
    dispatch(fetchVelocityLimits({ refresh: false, filters: filters }));
  };

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    setValue,
    handleSubmit,
  } = useForm<any>();
  const onSubmit: SubmitHandler<any> = (data: any) => {
    setSubmitting(true);
    if (limitType == LimitType.RECEIVER_MATCH) {
      data = {
        limitName: data.limitName,
        programId: programId as string,
        volume: data.volumeMatch,
        action: data.action,
      };
      dispatch(createReceiverMatchLimit(data)).then((d: any) => {
        setSubmitting(false);
        if (typeof d.payload == "string") {
          enqueueSnackbar(d.payload, {
            variant: "error",
            persist: true,
          });
        } else {
          enqueueSnackbar("Velocity limit created successfully", {
            variant: "success",
          });
          fetchLimitsHelper();
          setDrawerOpen(false);
        }
      });
    } else if (limitType == LimitType.ROUNDED_NUMBER) {
      data = {
        limitName: data.limitName,
        programId: programId as string,
        volume: data.volume,
        action: data.action,
        transactionGroups: groups.length > 0 ? groups : undefined,
        transactionTypes: types.length > 0 ? types : undefined,
      };
      dispatch(createRoundedNumberLimit(data)).then((d: any) => {
        setSubmitting(false);
        if (typeof d.payload == "string") {
          enqueueSnackbar(d.payload, {
            variant: "error",
            persist: true,
          });
        } else {
          enqueueSnackbar("Velocity limit created successfully", {
            variant: "success",
          });
          fetchLimitsHelper();
          setDrawerOpen(false);
        }
      });
    } else if (limitType == LimitType.RESTRICTED_ENTITY) {
      data = {
        limitName: data.limitName,
        volume: data.volume,
        aggregationDays: data.aggregationDays,
        frequencyMax: data.frequencyMax,
        aggregationLevel: data.aggregationLevel,
        associatedEntityType: associatedEntityType,
        associatedEntityId: data.associatedEntityId,
        action: data.action,
        transactionGroups: groups.length > 0 ? groups : undefined,
        transactionTypes: types.length > 0 ? types : undefined,
        restrictedEntities: restrictedEntities,
      };

      dispatch(createTransactionLimit(data)).then((d: any) => {
        setSubmitting(false);
        if (typeof d.payload == "string") {
          enqueueSnackbar(d.payload, {
            variant: "error",
            persist: true,
          });
        } else {
          enqueueSnackbar("Velocity limit created successfully", {
            variant: "success",
          });
          fetchLimitsHelper();

          setDrawerOpen(false);
        }
      });
    } else if (limitType == LimitType.TRANSACTION) {
      data = {
        limitName: data.limitName,
        volume: data.volume,
        aggregationDays: data.aggregationDays,
        frequencyMax: data.frequencyMax,
        aggregationLevel: data.aggregationLevel,
        associatedEntityType: associatedEntityType,
        associatedEntityId: data.associatedEntityId,
        action: data.action,
        transactionGroups: groups.length > 0 ? groups : undefined,
        transactionTypes: types.length > 0 ? types : undefined,
      };

      dispatch(createTransactionLimit(data)).then((d: any) => {
        setSubmitting(false);
        if (typeof d.payload == "string") {
          enqueueSnackbar(d.payload, {
            variant: "error",
            persist: true,
          });
        } else {
          enqueueSnackbar("Velocity limit created successfully", {
            variant: "success",
          });
          fetchLimitsHelper();
          setDrawerOpen(false);
        }
      });
    }
  };

  useEffect(() => {
    dispatch(fetchProgramIdsListWithNames()).then((data: any) => {
      setProgramIdsList(data.payload);
      if (data.payload?.length > 0) {
        setProgramId(data.payload[0]?.id);
      }
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch(getRestrictedEntities()).then((data: any) => {
      setCountries(data.payload);
    });
  }, [dispatch]);

  return (
    <>
      <Box className="w-auto">
        {!drawerOpen && (
          <div>
            <MyBlueButton onClick={toggleDrawer(true)}>
              Create Velocity Limit
            </MyBlueButton>
          </div>
        )}
      </Box>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          className: "w-[700px]",
        }}
      >
        <Box className="flex flex-col px-4 pt-[20px] max-w-full">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row h-fit items-center">
              <div className="w-[5px] h-[40px] bg-[#12A7FF] mr-[10px]" />
              <MyText size="lg">Create Velocity Limit</MyText>
            </div>
            <div className="flex flex-row w-[350px] justify-between">
              <MyText>Limit Type</MyText>
              <MyControlledAutocomplete
                value={limitType}
                displayName="Limit Type"
                clearable={false}
                name={"limitType"}
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                options={Object.values(LimitType)}
                customOnChange={(value: any) => {
                  setLimitType(value);
                }}
              />
              <Box className="pb-4"></Box>
            </div>
          </div>
          <Box className="pb-8"></Box>
          {limitType == LimitType.RECEIVER_MATCH && (
            <CreateReceiverMatch
              control={control}
              errors={errors}
              submitting={submitting}
              limitType={limitType}
              setLimitType={setLimitType}
              programIdsList={programIdsList}
              setProgramIdsList={setProgramIdsList}
              setProgramId={setProgramId}
            />
          )}
          {limitType == LimitType.ROUNDED_NUMBER && (
            <CreateRoundedNumber
              control={control}
              errors={errors}
              submitting={submitting}
              limitType={limitType}
              setLimitType={setLimitType}
              programIdsList={programIdsList}
              setProgramIdsList={setProgramIdsList}
              setProgramId={setProgramId}
              types={types}
              setTypes={setTypes}
              groups={groups}
              setGroups={setGroups}
              setValue={setValue}
            />
          )}
          {limitType == LimitType.RESTRICTED_ENTITY && (
            <CreateRestrictedEntity
              control={control}
              errors={errors}
              submitting={submitting}
              types={types}
              setTypes={setTypes}
              groups={groups}
              setGroups={setGroups}
              setValue={setValue}
              associatedEntityType={associatedEntityType}
              setAssociatedEntityType={setAssociatedEntityType}
              countries={countries}
              setCountries={setCountries}
              restrictedEntities={restrictedEntities}
              setRestrictedEntities={setRestrictedEntities}
            />
          )}
          {limitType == LimitType.TRANSACTION && (
            <CreateTransaction
              control={control}
              errors={errors}
              submitting={submitting}
              types={types}
              setTypes={setTypes}
              groups={groups}
              setGroups={setGroups}
              setValue={setValue}
              associatedEntityType={associatedEntityType}
              setAssociatedEntityType={setAssociatedEntityType}
            />
          )}
          <Box className="pt-4 pb-10">
            <div className="w-fit">
              <MyBlueButton
                submitting={submitting}
                onClick={handleSubmit(onSubmit)}
              >
                Create Velocity Limit
              </MyBlueButton>
            </div>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default CreateVelocityLimit;
