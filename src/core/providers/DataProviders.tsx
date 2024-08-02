"use client";

import { fetchOpenAlertsCount } from "@/redux/slices/alerts_slice";
import { fetchApiKey } from "@/redux/slices/ApiKeySlice";
import {
  fetchTransactionTypes,
  setUsername,
  setUserType,
} from "@/redux/slices/AppSlice";
import { fetchUsers } from "@/redux/slices/UsermanagementSlice";
import { useAppDispatch } from "@/redux/store/store";
import { Auth } from "aws-amplify";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  ADMIN_OPS_ROLE,
  ADMIN_ROLE,
  CUSTOMER_ROLE,
  DEVELOPER_OPS_ROLE,
  DEVELOPER_ROLE,
} from "../constants";

const DataProviders = (props: any) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const setUser = async () => {
      const user = await Auth.currentAuthenticatedUser();

      const groups: String[] =
        user?.signInUserSession?.accessToken?.payload?.["cognito:groups"];
      console.log(groups);

      let userType = null;

      if (groups?.includes("admins") || groups?.includes("admin-admin")) {
        userType = ADMIN_ROLE;
      } else if (groups?.includes("admin-ops")) {
        userType = ADMIN_OPS_ROLE;
      } else if (
        groups?.includes("developers") ||
        groups?.includes("developer-admin")
      ) {
        userType = DEVELOPER_ROLE;
      } else if (groups?.includes("developer-ops")) {
        userType = DEVELOPER_OPS_ROLE;
      } else if (groups?.includes("customers")) {
        userType = CUSTOMER_ROLE;
      }

      dispatch(setUserType(userType));
      dispatch(setUsername(user?.username));
    };

    setUser();

    dispatch(fetchTransactionTypes());
    dispatch(fetchUsers(""));
    dispatch(fetchApiKey());
    dispatch(fetchOpenAlertsCount());
  }, [dispatch]);

  return <>{props.children}</>;
};

export default DataProviders;
