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

const DataProviders = (props: any) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const setUser = async () => {
      const user = await Auth.currentAuthenticatedUser();

      dispatch(
        setUserType(
          user?.signInUserSession?.accessToken?.payload?.["cognito:groups"]?.[0]
        )
      );
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
