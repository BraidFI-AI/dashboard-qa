import React, { FC } from "react";

const Customers: FC<{ focus?: boolean }> = ({ focus }) => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 21.0132V19.0132C17 17.9523 16.5786 16.9349 15.8284 16.1848C15.0783 15.4346 14.0609 15.0132 13 15.0132H5C3.93913 15.0132 2.92172 15.4346 2.17157 16.1848C1.42143 16.9349 1 17.9523 1 19.0132V21.0132"
        stroke={focus ? "#ffffff" : "#6B788E"}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 11.0132C11.2091 11.0132 13 9.22232 13 7.01318C13 4.80404 11.2091 3.01318 9 3.01318C6.79086 3.01318 5 4.80404 5 7.01318C5 9.22232 6.79086 11.0132 9 11.0132Z"
        stroke={focus ? "#ffffff" : "#6B788E"}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 21.0132V19.0132C22.9993 18.1269 22.7044 17.266 22.1614 16.5655C21.6184 15.865 20.8581 15.3648 20 15.1432"
        stroke={focus ? "#ffffff" : "#6B788E"}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 3.14319C16.8604 3.36349 17.623 3.86389 18.1676 4.5655C18.7122 5.26711 19.0078 6.13002 19.0078 7.01819C19.0078 7.90636 18.7122 8.76927 18.1676 9.47088C17.623 10.1725 16.8604 10.6729 16 10.8932"
        stroke={focus ? "#ffffff" : "#6B788E"}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Customers;
