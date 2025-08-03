"use client";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import { Controller } from "react-hook-form";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import CircularProgress from "@mui/material/CircularProgress";

export interface MyHorizontalControlledAutocompleteProps {
  name: string;
  displayName?: string;
  control: any;
  errors: any;
  options: any;
  rules: any;
  customOnChange?: any;
  value: string;
  clearable?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  onScroll?: any;
  freeSolo?: boolean;
}
function getErrorByNameString(errors: any, name: string) {
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

const MyHorizontalControlledAutocomplete: React.FC<
  MyHorizontalControlledAutocompleteProps
> = ({
  clearable = true,
  displayName,
  name,
  control,
  errors,
  options,
  rules,
  customOnChange,
  value: val,
  disabled,
  loading,
  loadingText,
  onScroll,
  freeSolo = false,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={val}
      render={({ field: { onChange, value } }) => (
        <Autocomplete
          /// async changes
          loading={loading}
          loadingText={loadingText}
          ListboxProps={{
            onScroll: onScroll,
          }}
          /// async changes ^^^
          sx={{ "& fieldset": { borderRadius: "5px" } }}
          onChange={(event: any, item) => {
            onChange(item || null);
            if (customOnChange) {
              customOnChange(item, event.target.dataset.optionIndex);
            }
          }}
          freeSolo={freeSolo}
          disabled={disabled}
          disableClearable={!clearable}
          value={value || null}
          options={options}
          fullWidth
          autoHighlight
          getOptionLabel={(option: any) => option}
          renderOption={(props, option) => (
            <div key={uuidv4()}>
              <Box
                key={uuidv4()}
                component="li"
                {...(({ key, ...filteredProps }: any) => filteredProps)(props)}
                className="font-avenir-regular text-[13px] px-3 cursor-pointer"
              >
                {option}
              </Box>
            </div>
          )}
          renderTags={(tagValue, getTagProps) => {
            return tagValue.map((option, index) => (
              <Chip {...getTagProps({ index })} key={option} label={option} />
            ));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              /// Async changes
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? <CircularProgress size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
              /// Async changes ^^^
              inputProps={{
                ...params.inputProps,
                className: "font-avenir-regular text-[13px] py-0 h-[11px]",
              }}
              error={getErrorByNameString(errors, name) ? true : false}
              helperText={
                getErrorByNameString(errors, name)?.type === "required"
                  ? `${displayName ? displayName : name} is required`
                  : getErrorByNameString(errors, name)
                  ? getErrorByNameString(errors, name).message
                  : ""
              }
              size="small"
            />
          )}
        />
      )}
    />
  );
};

export default MyHorizontalControlledAutocomplete;
