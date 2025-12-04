"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store/store";
import { SnackbarProvider, closeSnackbar } from "notistack";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { usePathname, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { Amplify } from "aws-amplify";

import { Authenticator, View } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

// import amplifyConfiguration from "../../amplifyconfiguration.json";
import AuthProvider from "./AuthProvider";
import DataProviders from "./DataProviders";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import IconButton from "@mui/material/IconButton";
import PersistentDrawerLeft from "../components/Drawer/MyDrawerv2";
import { LicenseInfo } from "@mui/x-license";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";
import { sessionStorage } from "aws-amplify/utils";
import ClientLogo from "../components/client_logo";
import PoweredByBraid from "../components/powered_by_braid";
import { CDNProvider } from "./cdn_provider";
import TimezoneProvider from "./timezone_provider";

interface ProvidersProps {
  children: any;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  LicenseInfo.setLicenseKey(
    "916c78b7a12abd957ef38151ef35a926Tz0xMjI3MTYsRT0xNzk2NDI4Nzk5MDAwLFM9cHJvLExNPXN1YnNjcmlwdGlvbixQVj1pbml0aWFsLEtWPTI="
  );

  const pathname = usePathname();
  const searchParams = useSearchParams();

  Amplify.configure({
    aws_project_region: "us-east-1",
    aws_cognito_region: "us-east-1",
    aws_user_pools_id: "us-east-1_B7qrHUVxQ",
    aws_user_pools_web_client_id: "6tm3lbipups2qlbvk7asucg5af",
    oauth: {},
    aws_cognito_username_attributes: [],
    aws_cognito_social_providers: [],
    aws_cognito_signup_attributes: [],
    aws_cognito_mfa_configuration: "OFF",
    aws_cognito_mfa_types: [],
    aws_cognito_password_protection_settings: {
      passwordPolicyMinLength: 8,
      passwordPolicyCharacters: [
        "REQUIRES_LOWERCASE",
        "REQUIRES_UPPERCASE",
        "REQUIRES_NUMBERS",
        "REQUIRES_SYMBOLS",
      ],
    },
    aws_cognito_verification_mechanisms: ["EMAIL"],
    aws_cognito_readable_attributes: ["EMAIL_VERIFIED"],
  } as any);
  cognitoUserPoolsTokenProvider.setKeyValueStorage(sessionStorage);

  useEffect(() => {
    NProgress.done();
    return () => {
      NProgress.start();
    };
  }, [pathname, searchParams]);

  return (
    <Suspense>
      <CDNProvider>
        <div className="w-full h-full">
          <Authenticator
            hideSignUp
            className="h-full flex items-center justify-center bg-white"
            components={{
              Header: () => (
                <div className="w-[380px] flex flex-col items-center justify-center pb-6 self-center pr-[1px]">
                  <ClientLogo width={228} />
                </div>
              ),
              Footer: () => (
                <div className="w-[380px] flex flex-row justify-end">
                  <PoweredByBraid />
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
              <TimezoneProvider>
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
              </TimezoneProvider>
            </Provider>
          </Authenticator>
        </div>
      </CDNProvider>
    </Suspense>
  );
};

export default Providers;
