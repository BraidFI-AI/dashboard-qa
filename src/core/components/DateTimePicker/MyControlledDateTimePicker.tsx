import { Controller } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import moment from "moment";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React from "react";
import { useSelector } from "react-redux";

type MyControlledDateTimePickerProps = {
  name: string;
  displayName?: string;
  control: any;
  errors: any;
  rules: any;
  customOnChange?: any;
  value: string;
  noDefault?: boolean;
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

const MyControlledDatePicker: React.FC<MyControlledDateTimePickerProps> = ({
  displayName,
  name,
  control,
  errors,
  rules,
  value,
  noDefault = false,
}) => {
  const timezone = useSelector((state: any) => state.app.timezone);

  return typeof timezone == "string" ? (
    <></>
  ) : (
    <Controller
      key={value}
      name={name}
      defaultValue={noDefault == true ? null : moment(value)}
      control={control}
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en">
          <DatePicker
            sx={{
              "& fieldset": { borderRadius: "5px" },
              "& .MuiInputBase-root": {
                height: "42px",
                fontSize: "15px",
                // fontFamily: "AvenirNext LT Pro Regular",
              },
            }}
            timezone={timezone.timezone}
            value={typeof value == "string" ? moment(value) : value}
            onChange={(event) => {
              onChange(event ? event : undefined);
            }}
            slotProps={{
              popper: { placement: "auto" },
              actionBar: { actions: ["clear"] },
              textField: {
                fullWidth: true,
                variant: "outlined",
                error: getErrorByNameString(errors, name) ? true : false,
                helperText:
                  getErrorByNameString(errors, name)?.type === "required"
                    ? `${displayName ? displayName : name} is required`
                    : getErrorByNameString(errors, name)
                    ? getErrorByNameString(errors, name).message
                      ? getErrorByNameString(errors, name).message
                      : `Invalid ${displayName}`
                    : "",
              },
            }}
          />
        </LocalizationProvider>
      )}
    />
  );
};

export default MyControlledDatePicker;
