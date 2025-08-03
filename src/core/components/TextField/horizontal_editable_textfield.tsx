"use client";

import Box from "@mui/material/Box";
import MyText from "../Text/Text";
import MyEditButton from "../Button/MyEditButton";
import CircularProgress from "@mui/material/CircularProgress";
import ItemRowHorizontal from "../Text/ItemRowHorizontal";
import MyHorizontalControlledTextField from "./horizontal_controlled_textfield";
import MyHorizontalControlledAutocomplete from "../Autocomplete/my_horizontal_controlled_autocomplete";

type MyHorizontalEditableTextFieldProps = {
  name: string;
  displayName: string;
  control: any;
  errors: any;
  rules: any | null;
  customOnChange?: any;
  value: any;
  submitting: boolean;
  options?: any;
  editing: boolean;
  setEditing: any;
  editable?: boolean;
  clearable?: boolean;
};

const MyHorizontalEditableTextField: React.FC<
  MyHorizontalEditableTextFieldProps
> = ({
  name,
  displayName,
  control,
  errors,
  rules,
  customOnChange,
  value,
  options,
  editing,
  setEditing,
  editable = true,
  clearable = true,
  submitting,
}) => {
  return (
    <>
      {editing && (
        <div className="flex flex-row justify-between gap-2 items-start">
          <div className="w-2/3">
            <MyText size="sm" color="text-[#677990]">
              {displayName}
            </MyText>
          </div>
          <Box className="flex justify-between items-center w-full">
            {typeof value == "object" ? (
              <>{value}</>
            ) : options == null ? (
              <MyHorizontalControlledTextField
                name={name}
                displayName={displayName}
                control={control}
                errors={errors}
                rules={rules}
                value={value}
                customOnChange={customOnChange}
              />
            ) : (
              <MyHorizontalControlledAutocomplete
                name={name}
                displayName={displayName}
                control={control}
                errors={errors}
                options={options}
                rules={rules}
                value={value}
                customOnChange={customOnChange}
                clearable={clearable}
              />
            )}
            {editable && (
              <MyEditButton
                editing={editing}
                setEditing={setEditing}
                editable={editable}
              />
            )}
          </Box>
        </div>
      )}
      {!editing && (
        <Box className="flex flex-row justify-between items-top">
          <ItemRowHorizontal title={displayName} value={value} />
          {submitting ? (
            <div className="flex flex-row items-center">
              <CircularProgress size="20px" />
            </div>
          ) : (
            <MyEditButton
              editing={editing}
              setEditing={setEditing}
              editable={editable}
            />
          )}
        </Box>
      )}
    </>
  );
};

export default MyHorizontalEditableTextField;
