"use client";

import { fetchOpenAlertsCount } from "@/redux/slices/alerts_slice";
import { fetchApiKey } from "@/redux/slices/ApiKeySlice";
import {
  fetchAchReturnCodes,
  fetchTransactionTypes,
  setTenantId,
  setUsername,
  setUserType,
} from "@/redux/slices/AppSlice";
import { fetchUsers } from "@/redux/slices/UsermanagementSlice";
import { useAppDispatch } from "@/redux/store/store";
import { fetchAuthSession } from "aws-amplify/auth";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  ADMIN_OPS_ROLE,
  ADMIN_READONLY_ROLE,
  ADMIN_ROLE,
  ADMIN_COMPLIANCE_ROLE,
  CUSTOMER_ROLE,
  DEVELOPER_OPS_ROLE,
  DEVELOPER_READONLY_ROLE,
  DEVELOPER_ROLE,
} from "../constants";
import { fetchClearSightData } from "@/redux/slices/clear_sight_slice";

const DataProviders = (props: any) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const setUser = async () => {
      const session = await fetchAuthSession();

      const groups: String[] =
        session?.tokens?.accessToken?.payload?.["cognito:groups"] != null
          ? (session?.tokens?.accessToken?.payload?.[
              "cognito:groups"
            ] as String[])
          : [];
      console.log(groups);

      const tenantId = session?.tokens?.idToken?.payload?.["custom:tenantId"];

      const username = session?.tokens?.idToken?.payload?.["cognito:username"];

      console.log(tenantId);
      let userType = null;

      // TODO -- make this generic
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
      } else if (groups?.includes("admin-readonly")) {
        userType = ADMIN_READONLY_ROLE;
      } else if (groups?.includes("developer-readonly")) {
        userType = DEVELOPER_READONLY_ROLE;
      } else if (groups?.includes("admin-compliance")) {
        userType = ADMIN_COMPLIANCE_ROLE;
      }

      dispatch(setUserType(userType));
      dispatch(setUsername(username));
      dispatch(setTenantId(tenantId));
    };

    setUser();

    dispatch(fetchTransactionTypes());
    dispatch(fetchAchReturnCodes());
    dispatch(fetchUsers(""));
    dispatch(fetchApiKey());
    dispatch(fetchOpenAlertsCount());
    dispatch(fetchClearSightData());
  }, [dispatch]);

  return <>{props.children}</>;
};

export default DataProviders;
