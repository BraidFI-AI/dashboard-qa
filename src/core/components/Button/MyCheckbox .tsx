"use client";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import MyText from "../Text/Text";

type MyCheckboxProps = {
  checked: boolean;
  onChange: any;
  disabled?: boolean;
  title: string;
};

const MyCheckbox: React.FC<MyCheckboxProps> = ({
  title,
  checked,
  onChange,
  disabled,
}) => {
  return (
    <div className="flex flex-row items-center">
      <Checkbox
        disabled={disabled}
        checked={checked}
        sx={{ marginLeft: 0, paddingLeft: 0 }}
        onChange={(val) => {
          onChange(val.target.checked);
        }}
      />
      <MyText size="smd">{title}</MyText>
    </div>
  );
};

export default MyCheckbox;
