import React, { FC } from "react";

const Merchants: FC<{ focus?: boolean }> = ({ focus }) => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="2"
        y="6.01318"
        width="20"
        height="16"
        rx="4"
        stroke={focus ? "#ffffff" : "#6B788E"}
        strokeWidth="1.75"
      />
      <path
        d="M8 6.01318V5.01318C8 3.35633 9.34315 2.01318 11 2.01318H13C14.6569 2.01318 16 3.35633 16 5.01318V6.01318"
        stroke={focus ? "#ffffff" : "#6B788E"}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M2 11.0132C2 11.0132 8.09476 15.0132 12 15.0132C15.9052 15.0132 22 11.0132 22 11.0132"
        stroke={focus ? "#ffffff" : "#6B788E"}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M14 15.0132C14 16.1178 13.1046 17.0132 12 17.0132C10.8954 17.0132 10 16.1178 10 15.0132C10 13.9086 10.8954 13.0132 12 13.0132C13.1046 13.0132 14 13.9086 14 15.0132Z"
        fill={focus ? "#ffffff" : "#6B788E"}
      />
    </svg>
  );
};

export default Merchants;
