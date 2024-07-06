"use client";

import { Typography } from "@mui/material";
import React from "react";
import MyText, { MyTextProps } from "./Text";
import Link from "next/link";

interface LinkTextProps {
  textProps?: Omit<MyTextProps, "children">;
  link: string;
  children: string | number | null | undefined;
  status?: boolean;
}

const MyLinkText: React.FC<LinkTextProps> = ({
  textProps,
  link,
  children,
  status,
}) => {
  return !children ? (
    <MyText
      status={status}
      {...(textProps == undefined ? { size: "md" } : { ...textProps })}
      underline={false}
      primary={false}
    >
      {children}
    </MyText>
  ) : (
    <Link href={link}>
      <MyText
        status={status}
        {...(textProps == undefined
          ? { size: "md", primary: true }
          : {
              ...textProps,
              primary:
                textProps.primary == undefined ? true : textProps.primary,
            })}
        underline={true}
      >
        {children}
      </MyText>
    </Link>
  );
};

export default MyLinkText;
