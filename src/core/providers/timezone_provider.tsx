"use client";

import { useAppDispatch } from "@/redux/store/store";
import { useEffect } from "react";

import { useSelector } from "react-redux";
import { fetchTimezone } from "@/redux/slices/AppSlice";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import moment from "moment-timezone";
import TimezoneSplashScreen from "../components/TimezoneSplashScreen";

const TimezoneProvider = (props: any) => {
  const dispatch = useAppDispatch();

  const timezoneConfig: "loading" | string | { timezone: string } = useSelector(
    (state: any) => state.app.timezone
  );

  useEffect(() => {
    dispatch(fetchTimezone());
  }, [dispatch]);

  useEffect(() => {
    if (typeof timezoneConfig !== "string") {
      dayjs.extend(utc);
      dayjs.extend(timezone);
      dayjs.tz.setDefault(timezoneConfig.timezone);

      moment.tz.setDefault(timezoneConfig.timezone);
    }
  }, [timezoneConfig]);

  return (
    <>
      {timezoneConfig === "loading" ? (
        <TimezoneSplashScreen />
      ) : typeof timezoneConfig === "string" ? (
        <div>{timezoneConfig}</div>
      ) : (
        <>{props.children}</>
      )}
    </>
  );
};

export default TimezoneProvider;
