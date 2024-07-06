"use client";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import React from "react";

type MyTextButtonProps = {
  children: any;
  type?: "submit" | "reset" | "button" | undefined;
  onClick?: any;
  submitting?: boolean;
  icon?: any | null;
  isCancel?: boolean;
  isRed?: boolean;
};

const MyTextButton: React.FC<MyTextButtonProps> = ({
  children,
  type,
  onClick: customOnClick,
  submitting = false,
  icon = null,
  isCancel = false,
  isRed = false,
}) => {
  return (
    <Button
      className={`${isCancel ? "text-black" : isRed ? "text-red-600" : ""}`}
      variant="text"
      type={type}
      style={{ textTransform: "none" }}
      onClick={customOnClick}
      disabled={submitting}
    >
      {submitting ? (
        <CircularProgress size="25px" />
      ) : (
        <Box className="flex flex-row justify-center items-center">
          {icon != null && <div className="pr-2">{icon}</div>}
          {children}
        </Box>
      )}
    </Button>
  );
};

export default MyTextButton;
