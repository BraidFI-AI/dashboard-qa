"use client";

import MyText from "./Text/Text";

type LabelBoxProps = {
  color?: "gray" | "orange" | "blue" | "green" | "red";
  border?: boolean;
  fill?: boolean;
  children: string | number | boolean;
};

const borderColorToHex = {
  gray: "border-[#EFEFF0]",
  orange: "border-[#FDD273]",
  blue: "border-[#A5CCFA]",
  green: "border-[#86E3C1]",
  red: "border-[#FEB2B2]",
  "": "",
};

const textColorToHex = {
  gray: "text-black",
  orange: "text-[#BB6224]",
  blue: "text-[#2665EB]",
  green: "text-[#3D8F73]",
  red: "text-[#C53030]",
  "": "",
};

const fillColorToHex = {
  gray: "bg-[#f5f5f5]",
  orange: "bg-[#fcf6e6]",
  blue: "bg-[#EFF6FF]",
  green: "bg-[#ECFDF6]",
  red: "bg-[#FEF6F6]",
  "": "",
};

const LabelBox: React.FC<LabelBoxProps> = ({
  children,
  color,
  fill = false,
  border = false,
}) => {
  return (
    <div
      className={`py-[2px] px-2 rounded-lg ${
        fill == false ? "" : fillColorToHex[color ?? ""]
      } ${border == false ? "" : `border-2 ${borderColorToHex[color ?? ""]}`}`}
    >
      <MyText
        size="md"
        color={color == null ? undefined : textColorToHex[color]}
      >
        {children}
      </MyText>
    </div>
  );
};

export default LabelBox;
