"use client";

import TextField from "@mui/material/TextField";
import React, { forwardRef } from "react";

type MyRefTextFieldProps = {
  displayName?: string;
  error?: boolean;
  errorText?: string;
};

const MyRefTextField = React.forwardRef<
  any,
  React.PropsWithChildren<MyRefTextFieldProps>
>((props, ref) => (
  <TextField
    inputRef={ref}
    size="small"
    inputProps={{
      className: "font-avenir-regular text-[15px] h-[25px]",
    }}
    fullWidth
    error={props.error}
    helperText={props.error ? props.errorText : undefined}
  />
));

// const MyRefTextField: React.FC<MyRefTextFieldProps> = forwardRef(
//   ({ displayName, error, errorText, ref }) => {
//     return (
//       <TextField
//         ref={ref}
//         size="small"
//         inputProps={{
//           className: "font-avenir-regular text-[15px] h-[25px]",
//         }}
//         fullWidth
//         error={error}
//         helperText={error ? errorText : undefined}
//       />
//     );
//   }
// );

MyRefTextField.displayName = "MyRefTextField";

export default MyRefTextField;
