import React, { FC } from "react";

const Transaction: FC<{ focus?: boolean }> = ({ focus }) => {
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
        y="2.01318"
        width="10"
        height="8"
        rx="2"
        stroke={focus ? "#ffffff" : "#6B788E"}
        strokeWidth="1.75"
      />
      <rect
        x="12"
        y="14.0132"
        width="10"
        height="8"
        rx="2"
        stroke={focus ? "#ffffff" : "#6B788E"}
        strokeWidth="1.75"
      />
      <path
        d="M20.4142 4.01318L21.7071 5.30608C22.0976 5.6966 22.0976 6.32977 21.7071 6.72029L20.4142 8.01318M16 6.01318L21.4142 6.01318"
        stroke={focus ? "#ffffff" : "#6B788E"}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M3.58579 16.0132L2.29289 17.3061C1.90237 17.6966 1.90237 18.3298 2.29289 18.7203L3.58579 20.0132M8 18.0132L2.58579 18.0132"
        stroke={focus ? "#ffffff" : "#6B788E"}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Transaction;
