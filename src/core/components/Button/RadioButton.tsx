"use client";

import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import MyText from "../Text/Text";

type RadioButtonProps = {
  value: string | boolean;
  setValue: any;
  options: string[] | boolean[] | { name: string; isDisabled: boolean }[];
  title?: string;
  layout?: "horizontal" | "vertical";
  disabled?: boolean;
};

const RadioButton: React.FC<RadioButtonProps> = ({
  title,
  value,
  setValue,
  options,
  layout = "vertical",
  disabled = false,
}) => {
  return (
    <FormControl disabled={disabled}>
      {title && <MyText>{title}</MyText>}
      <RadioGroup
        sx={{ borderRadius: 0 }}
        value={value}
        onChange={(event: any) => {
          setValue(event.target.value);
        }}
      >
        <div
          className={`flex ${layout == "vertical" ? "flex-col" : "flex-row"}`}
        >
          {options.map((option: any, index: number) => {
            return option == "" ? null : typeof option == "string" ? (
              <div key={index}>
                <FormControlLabel
                  componentsProps={{
                    typography: {
                      className: "font-avenir-regular text-[13px] pt-1",
                    },
                  }}
                  value={option}
                  control={
                    <Radio
                      className={`${
                        layout == "horizontal" ? "pr-1 pb-0 pt-0" : ""
                      }`}
                      size="small"
                    />
                  }
                  label={option}
                />
              </div>
            ) : (
              <div key={index}>
                <FormControlLabel
                  componentsProps={{
                    typography: {
                      className: "font-avenir-regular text-[13px] pt-1",
                    },
                  }}
                  value={option.name}
                  control={
                    <Radio
                      disabled={option.isDisabled}
                      className={`${
                        layout == "horizontal" ? "pr-1 pb-0 pt-0" : ""
                      }`}
                      size="small"
                    />
                  }
                  label={option.name}
                />
              </div>
            );
          })}
        </div>
      </RadioGroup>
    </FormControl>
  );
};

export default RadioButton;
