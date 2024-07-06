"use client";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import React from "react";

type MyFilledButtonProps = {
  children: any;
  type?: "submit" | "reset" | "button" | undefined;
  onClick?: any;
  submitting?: boolean;
  icon?: any | null;
};

const MyRedButton: React.FC<MyFilledButtonProps> = ({
  children,
  type,
  onClick: customOnClick,
  submitting = false,
  icon = null,
}) => {
  return (
    <Button
      className={`self-end px-4 py-2 rounded-lg w-full
       bg-red-700 hover:bg-red-700 hover:border-red-700
       border-red-700
       disabled:bg-red-500 disabled:border-[#12A7FF]
       text-white font-avenir-regular text-15px`}
      variant="contained"
      type={type}
      style={{ textTransform: "none" }}
      onClick={customOnClick}
      disabled={submitting}
    >
      {submitting ? (
        <CircularProgress sx={{ color: "white" }} size="25px" />
      ) : (
        <Box className="flex flex-row justify-center items-center">
          {icon != null && <div className="pr-2">{icon}</div>}
          {children}
        </Box>
      )}
    </Button>
  );
};

export default MyRedButton;
