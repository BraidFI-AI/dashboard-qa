"use client";
import Checkbox from "@mui/material/Checkbox";
import MyText from "../Text/Text";
import { Controller } from "react-hook-form";

export type MyCheckboxProps = {
  name: string;
  displayName?: string;
  control: any;
  errors: any;
  rules: any | null;
  customOnChange?: any;
  value: boolean;
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

const MyControlledCheckbox: React.FC<MyCheckboxProps> = ({
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
        <div>
          <div className="flex flex-row items-center">
            <Checkbox
              checked={val}
              sx={{ marginLeft: 0, paddingLeft: 0 }}
              onChange={(val) => {
                onChange(val.target.checked);
                if (customOnChange) {
                  customOnChange(val.target.checked);
                }
              }}
            />
            <div
              className="cursor-pointer"
              onClick={() => {
                onChange(!val);
                if (customOnChange) {
                  customOnChange(!val);
                }
              }}
            >
              <MyText size="smd">{displayName}</MyText>
            </div>
          </div>
          <div className="h-4">
            <MyText size="sm">
              {getErrorByNameString(errors, name)?.type === "required"
                ? `${displayName ? displayName : name} is required`
                : getErrorByNameString(errors, name)
                ? getErrorByNameString(errors, name).message
                  ? getErrorByNameString(errors, name).message
                  : `Invalid ${displayName}`
                : ""}
            </MyText>
          </div>
        </div>
      )}
    />
  );
};

export default MyControlledCheckbox;
