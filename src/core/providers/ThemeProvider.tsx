"use client";

import { ThemeProvider, createTheme } from "@mui/material";

const MuiThemeProvider = (props: any) => {
  const theme = createTheme({
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            // color: "#22263f",
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          InputProps: {
            size: "small",
            style: {
              borderRadius: "5px",
            },
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          root: {},
        },
      },
    },
  });

  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};

export default MuiThemeProvider;
