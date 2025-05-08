"use client";

import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import MyText from "@/core/components/Text/Text";
import { IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import { useAppDispatch } from "@/redux/store/store";
import { getRestrictedEntities } from "@/redux/slices/velocity_limit_slice";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";

type AddRestrictedEntityProps = {
  countries:
    | "loading"
    | string
    | { countryName: string; countryCodeISO2: string }[];
  setCountries: any;
  setRestrictedEntities: (
    restrictedEntities: {
      entityType: string;
      entityName: string;
      entityCode?: string;
    }[]
  ) => void;
  restrictedEntities: {
    entityType: string;
    entityName: string;
    entityCode?: string;
  }[];
};

const AddRestrictedEntity = ({
  setRestrictedEntities,
  restrictedEntities,
  countries,
  setCountries,
}: AddRestrictedEntityProps) => {
  const dispatch = useAppDispatch();

  const [entityTypeState, setEntityTypeState] = useState<string>("COUNTRY");

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    setValue,
    handleSubmit,
  } = useForm<{
    entityType: string;
    entityName: string;
    entityCode?: string;
  }>();
  const onSubmit: SubmitHandler<{
    entityType: string;
    entityName: string;
    entityCode?: string;
  }> = (data: {
    entityType: string;
    entityName: string;
    entityCode?: string;
  }) => {
    console.log(data);

    if (data.entityType == "COUNTRY") {
      if (typeof countries != "string") {
        const country = countries.find(
          (country: { countryName: string; countryCodeISO2: string }) =>
            country.countryName == data.entityCode
        );
        if (country) {
          data = {
            entityType: "COUNTRY",
            entityName: country?.countryName,
            entityCode: country?.countryCodeISO2,
          };
        } else {
          enqueueSnackbar("Country not found", {
            variant: "error",
          });
          return;
        }
      } else {
        enqueueSnackbar("Country not found", {
          variant: "error",
        });
        return;
      }
    } else {
      data = {
        entityType: "KEYWORD",
        entityName: data.entityName,
      };
    }
    setRestrictedEntities([...restrictedEntities, data]);
    setValue("entityName", "");
  };

  return (
    <div className="flex flex-row w-[600px]">
      <div className="flex flex-row items-start h-[80px]">
        <div className="pr-4">
          <MyText>Entity Type</MyText>
          <MyControlledAutocomplete
            value={entityTypeState}
            displayName="Entity Type"
            clearable={false}
            name={"entityType"}
            control={control}
            errors={errors}
            rules={{ required: true }}
            options={["COUNTRY", "KEYWORD"]}
            customOnChange={(value: string) => {
              setEntityTypeState(value);
            }}
          />
        </div>
        <div className="pr-4">
          <MyText>Entity Name</MyText>
          <MyControlledTextField
            name="entityName"
            displayName="Entity Name"
            control={control}
            errors={errors}
            rules={{ required: true }}
            value=""
          />
        </div>
        <div className="pr-4">
          {entityTypeState == "COUNTRY" && (
            <>
              {countries == "loading" ? (
                <MyCircularProgressIndicator />
              ) : typeof countries == "string" ? (
                <ErrorPage
                  error={countries}
                  recoveryButtonOnClick={() => {
                    dispatch(getRestrictedEntities()).then((data: any) => {
                      setCountries(data.payload);
                    });
                  }}
                  recoveryButtonTitle="Retry"
                />
              ) : countries.length == 0 ? (
                <MyText>No countries found</MyText>
              ) : (
                <>
                  <MyText>Entity Code</MyText>
                  <MyControlledAutocomplete
                    value={countries[0].countryName}
                    displayName="Entity Code"
                    clearable={false}
                    name={"entityCode"}
                    control={control}
                    errors={errors}
                    rules={{
                      required: entityTypeState == "COUNTRY" ? true : false,
                    }}
                    options={countries.map((country) => country.countryName)}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
      <div className="w-fit pl-4 self-center">
        <MyBlueButton onClick={handleSubmit(onSubmit)}>
          <div className="flex flex-row items-center">
            <AddIcon
              style={{
                height: "20px",
                width: "20px",
              }}
            />
            <MyText white weight="semibold">
              Add
            </MyText>
          </div>
        </MyBlueButton>
      </div>
    </div>
  );
};

export default AddRestrictedEntity;
