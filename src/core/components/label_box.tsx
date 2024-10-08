"use client";

import MyText from "./Text/Text";

type LabelBoxProps = {
  color?: "gray" | "orange" | "blue" | "green" | "red";
  border?: boolean;
  fill?: boolean;
  children: string | number | boolean;
};

const borderColorToHex = {
  gray: "border-[#B1B9CA]",
  orange: "border-[#FFE0A6]",
  blue: "border-[#A9E2F8]",
  green: "border-[#B3DFD1]",
  red: "border-[#EDB4B4]",
  "": "",
};

const textColorToHex = {
  gray: "text-black",
  orange: "text-[#FFA400]",
  blue: "text-[#12A7E1]",
  green: "text-[#3C8F73]",
  red: "text-[#C42F30]",
  "": "",
};

const fillColorToHex = {
  gray: "bg-[#E7E9EE]",
  orange: "bg-[#FFF5E3]",
  blue: "bg-[#E4F6FD]",
  green: "bg-[#E7F5F0]",
  red: "bg-[#F9E8E8]",
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
        size="table"
        color={color == null ? undefined : textColorToHex[color]}
      >
        {children}
      </MyText>
    </div>
  );
};

export default LabelBox;
