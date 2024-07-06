"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store/store";
import { SnackbarProvider, closeSnackbar } from "notistack";
// import AuthProvider from "./AuthProvider";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { usePathname, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { Amplify, Auth } from "aws-amplify";

import { Authenticator, View } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import amplifyConfiguration from "../../amplifyconfiguration.json";
import Image from "next/image";
import AuthProvider from "./AuthProvider";
import DataProviders from "./DataProviders";
import dayjs from "dayjs";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import moment from "moment-timezone";
import { APP_TIMEZONE } from "../constants";
import IconButton from "@mui/material/IconButton";
import PersistentDrawerLeft from "../components/Drawer/MyDrawerv2";

/// setting default timezone to PACIFIC timezone
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(APP_TIMEZONE);

moment.tz.setDefault(APP_TIMEZONE);

interface ProvidersProps {
  children: any;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  Amplify.configure(amplifyConfiguration);
  Auth.configure({
    ...amplifyConfiguration,
    authenticationFlowType: "USER_SRP_AUTH",
    storage: typeof window !== "undefined" ? window.sessionStorage : null,
  });

  useEffect(() => {
    NProgress.done();
    return () => {
      NProgress.start();
    };
  }, [pathname, searchParams]);

  return (
    <Suspense>
      <div className="w-full h-full">
        <Authenticator
          hideSignUp
          className="h-full flex items-center justify-center bg-white"
          components={{
            Header: () => (
              <div className="w-[380px] flex items-center justify-center pb-6 self-center pr-[1px]">
                <Image
                  alt="Braidfi"
                  src="/images/braid_logo_black.png"
                  height={57}
                  width={134}
                ></Image>
              </div>
            ),
            // SignIn: {
            //   Header: () => (
            //     <div className="pl-8 pt-2">
            //       <MyText variant="label" size="xl">
            //         Login
            //       </MyText>
            //     </div>
            //   ),
            // },
          }}
        >
          <Provider store={store}>
            <DataProviders>
              <AuthProvider>
                <SnackbarProvider
                  hideIconVariant
                  maxSnack={7}
                  autoHideDuration={2000}
                  action={(snackbarId) => (
                    <IconButton
                      className="text-white"
                      onClick={() => closeSnackbar(snackbarId)}
                    >
                      <CloseRoundedIcon />
                    </IconButton>
                  )}
                >
                  {/* <AuthProvider> */}
                  {pathname === "/login" ? (
                    children
                  ) : (
                    <PersistentDrawerLeft>{children}</PersistentDrawerLeft>
                  )}
                  {/* </AuthProvider> */}
                </SnackbarProvider>
              </AuthProvider>
            </DataProviders>
          </Provider>
        </Authenticator>
      </div>
    </Suspense>
  );
};

export default Providers;
