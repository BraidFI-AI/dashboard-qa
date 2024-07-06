import React, { FC } from "react";

const SideMenuArrowUp: FC<{ focus?: boolean }> = ({ focus }) => {
  return (
    <svg
      width="14"
      height="9"
      viewBox="0 0 14 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 7.01318L7 1.01318L1 7.01318"
        stroke={focus ? "#ffffff" : "#6B788E"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SideMenuArrowUp;
