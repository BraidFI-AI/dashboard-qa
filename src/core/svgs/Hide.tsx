import React, { FC } from "react";
import { useState } from "react";

const Hide: FC<{ onClick?: any }> = ({ onClick }) => {
  const [visible, setVisible] = useState(true);
  return (
    <div
      onClick={() => {
        setVisible((prev) => !prev);
        onClick();
      }}
    >
      {visible ? (
        <svg
          width="18"
          height="16"
          viewBox="0 1 18 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.66663 7.99996C1.66663 7.99996 4.33329 2.66663 8.99996 2.66663C13.6666 2.66663 16.3333 7.99996 16.3333 7.99996C16.3333 7.99996 13.6666 13.3333 8.99996 13.3333C4.33329 13.3333 1.66663 7.99996 1.66663 7.99996Z"
            stroke="#42526D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z"
            stroke="#42526D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.96 12.96C11.8204 13.8286 10.4327 14.3099 8.99996 14.3333C4.33329 14.3333 1.66663 8.99998 1.66663 8.99998C2.49589 7.45457 3.64605 6.10438 5.03996 5.03998M7.59996 3.82664C8.05885 3.71923 8.52867 3.66554 8.99996 3.66664C13.6666 3.66664 16.3333 8.99998 16.3333 8.99998C15.9286 9.75705 15.446 10.4698 14.8933 11.1266M10.4133 10.4133C10.2302 10.6098 10.0094 10.7674 9.76406 10.8767C9.51873 10.986 9.25389 11.0448 8.98535 11.0496C8.71681 11.0543 8.45007 11.0049 8.20103 10.9043C7.952 10.8037 7.72577 10.654 7.53586 10.4641C7.34594 10.2742 7.19622 10.0479 7.09563 9.7989C6.99504 9.54987 6.94564 9.28312 6.95038 9.01458C6.95512 8.74604 7.0139 8.48121 7.12321 8.23587C7.23252 7.99054 7.39013 7.76974 7.58663 7.58664"
            stroke="#42526D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1.66663 1.66663L16.3333 16.3333"
            stroke="#42526D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
};

export default Hide;
