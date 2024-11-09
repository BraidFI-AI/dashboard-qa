"use client";

import TextField from "@mui/material/TextField";
import React from "react";

type MyTextFieldProps = {
  displayName?: string;
  customOnChange?: any;
  value: string;
  setValue?: any;
  customSetValue?: any;
  error?: boolean;
  errorText?: string;
};

const MyTextField: React.FC<MyTextFieldProps> = ({
  displayName,
  error,
  errorText,
  value,
  customSetValue,
  setValue,
}) => {
  return (
    <TextField
      size="small"
      inputProps={{
        className: "font-avenir-regular text-[15px] h-[25px]",
      }}
      onChange={(event) => {
        if (customSetValue != null) {
          customSetValue(event.target.value);
        } else if (setValue != null) {
          setValue(event.target.value);
        }
      }}
      defaultValue={value}
      value={value}
      fullWidth
      error={error}
      helperText={error ? errorText : undefined}
    />
  );
};

export default MyTextField;
