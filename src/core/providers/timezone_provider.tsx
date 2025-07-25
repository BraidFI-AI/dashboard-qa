"use client";

import { useAppDispatch } from "@/redux/store/store";
import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { fetchTimezone } from "@/redux/slices/AppSlice";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import moment from "moment-timezone";
import TimezoneSplashScreen from "../components/TimezoneSplashScreen";

const TimezoneProvider = (props: any) => {
  const dispatch = useAppDispatch();
  const [timezoneReady, setTimezoneReady] = useState(false);

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
      setTimezoneReady(true);
    } else if (timezoneConfig === "loading") {
      // Still loading, keep timezoneReady false
      setTimezoneReady(false);
    } else {
      // Timezone loaded but invalid, use UTC
      setTimezoneReady(true);
    }
  }, [timezoneConfig]);

  // Show loading screen while timezone is being fetched
  if (timezoneConfig === "loading" || !timezoneReady) {
    return <TimezoneSplashScreen />;
  }

  // Show error if timezone fetch failed
  if (typeof timezoneConfig === "string") {
    return <div>{timezoneConfig}</div>;
  }

  // Timezone is ready, render children
  return <>{props.children}</>;
};

export default TimezoneProvider;