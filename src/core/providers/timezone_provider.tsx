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

  // Always set UTC as the initial default timezone
  useEffect(() => {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault("UTC");
    moment.tz.setDefault("UTC");
  }, []);

  // Fetch the server's timezone config
  useEffect(() => {
    dispatch(fetchTimezone());
  }, [dispatch]);

  // If the server returned a valid timezone, overwrite UTC
  useEffect(() => {
    // Only overwrite if we have a valid timezone object and it's a real tz name
    if (
      typeof timezoneConfig !== "string" &&
      timezoneConfig &&
      timezoneConfig.timezone &&
      moment.tz.zone(timezoneConfig.timezone)
    ) {
      dayjs.tz.setDefault(timezoneConfig.timezone);
      moment.tz.setDefault(timezoneConfig.timezone);
    }
    // If not, it will stay at UTC
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