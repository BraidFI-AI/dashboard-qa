"use client";
import CircularProgress from "@mui/material/CircularProgress";

const Loading = () => {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <CircularProgress></CircularProgress>
    </div>
  );
};

export default Loading;
