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

const MyBlueButton: React.FC<MyFilledButtonProps> = ({
  children,
  type,
  onClick: customOnClick,
  submitting = false,
  icon = null,
}) => {
  return (
    <Button
      className={`self-end px-4 py-2 rounded-lg w-full
       bg-[#12A7FF] hover:bg-[#12A7FF] hover:border-[#12A7FF]
       border-[#12A7FF]
       disabled:bg-[#12A7FF] disabled:border-[#12A7FF]
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

export default MyBlueButton;
