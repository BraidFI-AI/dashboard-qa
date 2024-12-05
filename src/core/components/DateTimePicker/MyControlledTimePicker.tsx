import { Controller } from "react-hook-form";
import {
  DatePicker,
  LocalizationProvider,
  TimeField,
  TimePicker,
} from "@mui/x-date-pickers";
import moment from "moment";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";

type MyControlledTimePickerProps = {
  name: string;
  displayName?: string;
  control: any;
  errors: any;
  rules: any;
  customOnChange?: any;
  value: string;
};

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

const MyControlledTimePicker: React.FC<MyControlledTimePickerProps> = ({
  displayName,
  name,
  control,
  errors,
  rules,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
          <TimeField
            format="HH:mm"
            sx={{
              "& fieldset": { borderRadius: "5px" },
              "& .MuiInputBase-root": {
                height: "41.99px",
                fontSize: "15px",
                fontFamily: "AvenirNext LT Pro Regular",
              },
            }}
            value={value}
            onChange={(event) => {
              onChange(event ? event : null);
            }}
            slotProps={
              {
                //   popper: { placement: "auto" },
                //   actionBar: { actions: ["clear"] },
                // textField: {
                //   fullWidth: true,
                //   variant: "outlined",
                //   error: getErrorByNameString(errors, name) ? true : false,
                //   helperText:
                //     getErrorByNameString(errors, name)?.type === "required"
                //       ? `${displayName ? displayName : name} is required`
                //       : getErrorByNameString(errors, name)
                //       ? getErrorByNameString(errors, name).message
                //         ? getErrorByNameString(errors, name).message
                //         : `Invalid ${displayName}`
                //       : "",
                // },
              }
            }
          />
        </LocalizationProvider>
      )}
    />
  );
};

export default MyControlledTimePicker;
