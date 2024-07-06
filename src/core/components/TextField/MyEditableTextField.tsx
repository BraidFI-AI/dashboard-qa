"use client";

import Box from "@mui/material/Box";
import MyControlledTextField from "./MyControlledTextField";
import ItemRow from "../Text/ItemRow";
import MyText from "../Text/Text";
import MyControlledAutocomplete from "../Autocomplete/MyControlledAutocomplete";
import MyEditButton from "../Button/MyEditButton";

type MyEditableTextFieldProps = {
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
  customEditor?: any;
  editable?: boolean;
  clearable?: boolean;
};

const MyEditableTextField: React.FC<MyEditableTextFieldProps> = ({
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
  customEditor,
  editable = true,
  clearable = true,
}) => {
  return (
    <>
      {editing &&
        (customEditor ? (
          <>
            <MyText>{displayName}</MyText>
            <Box className="flex justify-between pb-[12px]">
              <Box>{customEditor}</Box>
              <MyEditButton
                editing={editing}
                setEditing={setEditing}
                editable={editable}
              />
            </Box>
          </>
        ) : (
          <>
            <MyText>{displayName}</MyText>
            <Box className="flex justify-between items-center pb-[12px]">
              {typeof value == "object" ? (
                <>{value}</>
              ) : options == null ? (
                <MyControlledTextField
                  name={name}
                  displayName={displayName}
                  control={control}
                  errors={errors}
                  rules={rules}
                  value={value}
                  customOnChange={customOnChange}
                />
              ) : (
                <MyControlledAutocomplete
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
          </>
        ))}
      {!editing && (
        <Box className="flex flex-row justify-between items-top">
          <ItemRow title={displayName} value={value} />
          <MyEditButton
            editing={editing}
            setEditing={setEditing}
            editable={editable}
          />
        </Box>
      )}
    </>
  );
};

export default MyEditableTextField;
