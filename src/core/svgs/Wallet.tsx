import React, { FC } from "react";

const Wallet: FC<{ focus?: boolean }> = ({ focus }) => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 7.01318C22 4.80404 20.2091 3.01318 18 3.01318H6C3.79086 3.01318 2 4.80404 2 7.01318V17.0132C2 19.2223 3.79086 21.0132 6 21.0132H18C20.2091 21.0132 22 19.2223 22 17.0132V7.01318Z"
        stroke={focus ? "#ffffff" : "#6B788E"}
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M8 12.0132C8 10.3563 6.65685 9.01318 5 9.01318H2V15.0132H5C6.65685 15.0132 8 13.67 8 12.0132V12.0132Z"
        stroke={focus ? "#ffffff" : "#6B788E"}
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Wallet;
