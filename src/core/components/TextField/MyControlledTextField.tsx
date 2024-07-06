"use client";

import TextField from "@mui/material/TextField";
import React from "react";
import { Controller } from "react-hook-form";

export type MyControlledTextFieldProps = {
  name: string;
  displayName?: string;
  control: any;
  errors: any;
  rules: any | null;
  customOnChange?: any;
  value: string | undefined;
};

export function getErrorByNameString(errors: any, name: string) {
  const properties = name.split(".");
  let value = errors;

  for (const property of properties) {
    value = value[String(property)];
    if (value === undefined) {
      return undefined;
    }
  }

  return value;
}

const MyControlledTextField: React.FC<MyControlledTextFieldProps> = ({
  displayName,
  name,
  control,
  errors,
  rules,
  value: val,
  customOnChange,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules ? rules : {}}
      defaultValue={val}
      render={({ field: { onChange } }) => (
        <TextField
          size="small"
          inputProps={{
            className: "font-avenir-regular text-[15px] h-[25px]",
          }}
          onChange={(event) => {
            onChange(event.target.value);
            if (customOnChange) {
              customOnChange(event.target.value);
            }
          }}
          defaultValue={val}
          fullWidth
          error={getErrorByNameString(errors, name) ? true : false}
          helperText={
            getErrorByNameString(errors, name)?.type === "required"
              ? `${displayName ? displayName : name} is required`
              : getErrorByNameString(errors, name)
              ? getErrorByNameString(errors, name).message
                ? getErrorByNameString(errors, name).message
                : `Invalid ${displayName}`
              : ""
          }
        />
      )}
    />
  );
};

export default MyControlledTextField;
