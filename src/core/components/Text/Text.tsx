"use client";

import { Typography } from "@mui/material";
import React from "react";

const firstLetterUpper = (val: boolean) => {
  if (val != undefined && val != null) {
    return val.toString()[0].toUpperCase() + val.toString().slice(1);
  }
};

export interface MyTextProps {
  variant?: "title" | "label";
  size?: "sm" | "smd" | "md" | "lg" | "xl";
  children: string | number | boolean | null | undefined;
  primary?: boolean;
  underline?: boolean;
  white?: boolean;
  status?: boolean;
}

const MyText: React.FC<MyTextProps> = ({
  variant = "label",
  size = "sm",
  children,
  primary = false,
  underline,
  white = false,
  status,
}) => {
  return typeof children === "string" && children === "" ? (
    <div className="invisible">.</div>
  ) : (
    <Typography
      className={`font-avenir-regular ${
        variant === "label"
          ? size == "sm"
            ? " text-[13px]"
            : size == "smd"
            ? " text-[15px]"
            : size == "md"
            ? "text-[16px]"
            : size == "xl"
            ? "text-[18px]"
            : "text-[20px]"
          : size == "sm"
          ? " text-[25px]"
          : size == "smd"
          ? "text-[30px]"
          : size == "md"
          ? "text-[40px]"
          : size == "xl"
          ? "text-[60px]"
          : "text[70px]"
      }
      ${
        primary
          ? "text-[#12A7FF]"
          : white
          ? "text-white"
          : status != null
          ? status == true
            ? "text-[#4DB984]"
            : "text-[#F54B24]"
          : "text-black"
      }
      ${underline ? " underline " : ""}
      `}
    >
      {children == null
        ? ""
        : typeof children === "boolean"
        ? firstLetterUpper(children)
        : children}
    </Typography>
  );
};

export default MyText;
