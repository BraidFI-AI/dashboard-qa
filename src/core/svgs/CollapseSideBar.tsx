import { FC } from "react";

const CollapseSideBar: FC<{ focus?: boolean }> = ({ focus }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.5 10.5L4.5 7L9.5 3.5"
        stroke={focus ? "#FFFFFF" : "#000000"}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CollapseSideBar;
