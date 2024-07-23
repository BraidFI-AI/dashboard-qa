"use client";

import {
  ACHConfigWithStringDate,
  ACHConfigCalendarHoliday,
  ACHConfigCalendarHolidayWithStringDate,
  ACHConfigWindow,
  ACHConfigWindowWithStringTime,
  ACHConfig,
} from "@/core/api/ApiTypes";
import { useAppDispatch } from "@/redux/store/store";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import MyText from "@/core/components/Text/Text";
import MyEditButton from "@/core/components/Button/MyEditButton";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { enqueueSnackbar } from "notistack";
import {
  fetchACHConfig,
  fetchProduct,
  updateAchConfig,
} from "@/redux/slices/ProductSlice";
import { setTitle } from "@/redux/slices/AppSlice";
import MyExpandableButton from "@/core/components/Button/MyExpandableButton";
import MyControlledDatePicker from "@/core/components/DateTimePicker/MyControlledDateTimePicker";
import moment from "moment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import MyControlledTimePicker from "@/core/components/DateTimePicker/MyControlledTimePicker";
import MyEditableTextField from "@/core/components/TextField/MyEditableTextField";
import dayjs from "dayjs";
import RequireRole from "@/core/components/RequireRole";
import { ADMIN_ROUTE } from "@/core/constants";

const ServiceTypeMapping = (val: string) => {
  if (val === "Standard") {
    return "STANDARD";
  } else {
    return "SAME_DAY";
  }
};

const offsetTypeMapping = (val: string) => {
  if (val === "Auto Per Batch" || val == "AUTO_PER_BATCH") {
    return "AUTO_PER_BATCH";
  } else if (val === "No Offset" || val == "NO_OFFSET") {
    return "NO_OFFSET";
  } else {
    return "AUTO_PER_TRANSACTION";
  }
};

const offsetTypeToReadableMapping = (type: string) => {
  if (type === "AUTO_PER_BATCH") {
    return "Auto Per Batch";
  } else if (type === "NO_OFFSET") {
    return "No Offset";
  } else {
    return "Auto Per Transaction";
  }
};

const ACHConfigSettings = ({ params }: { params: { id: string } }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const [achConfig, setACHConfig] = useState<ACHConfigWithStringDate | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [expandDetails, toggleExpandDetails] = useState(false);
  const [expandOffset, toggleExpandOffset] = useState(false);
  const [expandCalendar, toggleExpandCalendar] = useState(false);
  const [expandWindow, toggleExpandWindow] = useState(false);
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [isEditingOffset, setIsEditingOffset] = useState(false);
  const [isEditingCalender, setIsEditingCalender] = useState(false);
  const [offset, setOffset] = useState(false);

  const [addHoliday, setAddHoliday] = useState(false);
  const [addWindow, setAddWindow] = useState(false);
  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
    reset,
  } = useForm<ACHConfigWithStringDate>();
  const onSubmit: SubmitHandler<ACHConfigWithStringDate> = (
    data: ACHConfigWithStringDate
  ) => {
    if (!achConfig?.offsetType) {
      enqueueSnackbar("Please select offect type.", { variant: "error" });
      return;
    }
    setSubmitting(true);

    const windows: ACHConfigWindow[] = [];

    achConfig?.windows?.map((window: ACHConfigWindowWithStringTime) => {
      if (window.time) {
        const time = dayjs(window.time);
        windows.push({
          allowSameDay: window.allowSameDay,
          hours: time.hour(),
          minutes: time.minute(),
        });
      } else {
        windows.push({
          allowSameDay: window.allowSameDay,
          hours: window.hours != null ? parseInt(window.hours) : -1,
          minutes: window.minutes != null ? parseInt(window.minutes) : -1,
        });
      }
    });

    const holidays: ACHConfigCalendarHoliday[] = [];

    achConfig?.calendar?.holidays?.map((holiday: ACHConfigCalendarHoliday) => {
      holidays.push({
        day: holiday.day,
        month: holiday.month,
        name: holiday.name,
        year: holiday.year,
      });
    });

    const calendar: any = {
      fridayActive: achConfig?.calendar?.fridayActive,
      mondayActive: achConfig?.calendar?.mondayActive,
      saturdayActive: achConfig?.calendar?.saturdayActive,
      sundayActive: achConfig?.calendar?.sundayActive,
      thursdayActive: achConfig?.calendar?.thursdayActive,
      tuesdayActive: achConfig?.calendar?.tuesdayActive,
      wednesdayActive: achConfig?.calendar?.wednesdayActive,
      holidays: holidays,
    };

    const config: ACHConfig = {
      immediateDestination: achConfig?.immediateDestination,
      immediateDestinationName: achConfig?.immediateDestinationName,
      immediateOrigin: achConfig?.immediateOrigin,
      immediateOriginName: achConfig?.immediateOriginName,
      leadDays: achConfig?.leadDays,
      odfi: achConfig?.odfi,
      offsetAccountName: achConfig?.offsetAccountName,
      offsetAccountNumber: achConfig?.offsetAccountNumber,
      offsetAccountType: achConfig?.offsetAccountType?.toUpperCase(),
      offsetIdentificationNumber: achConfig?.offsetIdentificationNumber,
      offsetRoutingNumber: achConfig?.offsetRoutingNumber,
      offsetType:
        achConfig && achConfig.offsetType
          ? offsetTypeMapping(achConfig.offsetType)
          : "",
      quickExtract: achConfig?.quickExtract,
      serviceType:
        achConfig && achConfig.serviceType
          ? ServiceTypeMapping(achConfig.serviceType)
          : "",
      timezone: achConfig?.timezone,
      windows: windows,
      calendar: calendar,
    };

    console.log("data:", config);

    dispatch(
      updateAchConfig({ id: parseInt(params.id), achConfig: config })
    ).then(() => {
      setRefresh(true);
      setSubmitting(false);
    });
  };

  const {
    formState: { errors: holidayErrors },
    control: holidayControl,
    handleSubmit: holidayHandleSubmit,
    reset: holidayReset,
  } = useForm<ACHConfigCalendarHolidayWithStringDate>();
  const holidayOnSubmit: SubmitHandler<
    ACHConfigCalendarHolidayWithStringDate
  > = (data: ACHConfigCalendarHolidayWithStringDate) => {
    let tempAchConfig: ACHConfigWithStringDate = { ...achConfig };

    if (tempAchConfig.calendar == undefined || tempAchConfig.calendar == null) {
      tempAchConfig = {
        ...tempAchConfig,
        calendar: {
          holidays: [],
        },
      };
    }

    let tempAchCalendar = { ...tempAchConfig.calendar };

    const tempAchHolidays = tempAchCalendar.holidays
      ? tempAchCalendar.holidays
      : [];

    const holiday: ACHConfigCalendarHoliday = {
      name: data.name,
      day: moment(data.date).date(),
      month: moment(data.date).month() + 1,
      year: moment(data.date).year(),
    };

    tempAchHolidays.push(holiday);

    tempAchCalendar = { ...tempAchCalendar, holidays: tempAchHolidays };

    tempAchConfig = { ...tempAchConfig, calendar: tempAchCalendar };

    setACHConfig(tempAchConfig);
    setAddHoliday(false);
    holidayReset();
  };

  const {
    formState: { errors: windowErrors },
    control: windowControl,
    handleSubmit: windowHandleSubmit,
    reset: windowReset,
  } = useForm<ACHConfigWindowWithStringTime>();
  const windowOnSubmit: SubmitHandler<ACHConfigWindowWithStringTime> = (
    data: ACHConfigWindowWithStringTime
  ) => {
    let tempAchConfig: ACHConfigWithStringDate = { ...achConfig };

    if (tempAchConfig.windows == undefined || tempAchConfig.windows == null) {
      tempAchConfig = { ...tempAchConfig, windows: [] };
    }

    const tempAchConfigWindows = tempAchConfig.windows;

    const window: ACHConfigWindowWithStringTime = {
      allowSameDay: data.allowSameDay,
      time: data.time,
      hours: dayjs(data.time).hour().toString(),
      minutes: dayjs(data.time).minute().toString(),
    };

    tempAchConfigWindows?.push(window);

    tempAchConfig = { ...tempAchConfig, windows: tempAchConfigWindows };
    setACHConfig(tempAchConfig);
    setAddWindow(false);
    windowReset();
  };

  useEffect(() => {
    if (refresh) {
      setLoading(true);
      dispatch(setTitle("Product"));
      dispatch(fetchProduct(parseInt(params.id))).then((product: any) => {
        if (product.payload != null) {
          dispatch(setTitle(product.payload.productName));
          dispatch(fetchACHConfig(product.payload.id)).then((data: any) => {
            // if (data.payload?.calendar?.holidays?.length > 0) {
            //   const holidays: ACHConfigCalendarHolidayWithStringDate[] = [];

            //   data.payload.calendar.holidays.map(
            //     (holiday: ACHConfigCalendarHoliday) => {
            //       console.log(`holiday:`, holiday);

            //       holidays.push({
            //         name: holiday.name,
            //         date: moment(
            //           `${holiday.year}-${holiday.month}-${holiday.day}`
            //         ).format("YYYY-MM-DD"),
            //       });
            //     }
            //   );

            //   data.payload.calendar.holidays = holidays;
            //   setACHConfig(data.payload);
            // } else {
            //   setACHConfig(data.payload);
            // }
            setACHConfig(data.payload);

            reset();
            holidayReset();
            windowReset();
            toggleExpandDetails(false);
            toggleExpandOffset(false);
            toggleExpandCalendar(false);
            toggleExpandWindow(false);
            setIsEditingConfig(false);
            setIsEditingOffset(false);
            setIsEditingCalender(false);
            setLoading(false);
          });
        } else {
          reset();
          holidayReset();
          windowReset();
          toggleExpandDetails(false);
          toggleExpandOffset(false);
          toggleExpandCalendar(false);
          toggleExpandWindow(false);
          setIsEditingConfig(false);
          setIsEditingOffset(false);
          setIsEditingCalender(false);
          setLoading(false);
        }
      });
      setRefresh(false);
    }
  }, [dispatch, params.id, refresh, reset, holidayReset, windowReset]);

  //   useEffect(() => {
  //     console.log("ach:", achConfig);
  //   }, [achConfig]);

  function isEmpty(value: any) {
    for (let prop in value) {
      if (value.hasOwnProperty(prop)) return false;
    }
    return true;
  }
  useEffect(() => {
    if (isSubmitted && !isValid) {
      if (!isEmpty(errors)) {
        enqueueSnackbar("Invalid Fields", { variant: "error" });
      }
    }
  }, [submitCount, isSubmitted, isValid, errors, isEditingConfig]);

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading ACH Config...</div>
        </div>
      ) : achConfig == null ? (
        <MyText size="md">No ACH Config found</MyText>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="pb-6">
          <Box className="flex flex-col w-[350px]">
            <MyExpandableButton
              title="ACH Details"
              expand={expandDetails}
              toggleExpand={toggleExpandDetails}
            />
            <Divider />
            <div className="pb-4"></div>
            <div
              className={`${
                expandDetails ? "visible" : "hidden"
              } flex justify-between flex-row-reverse`}
            >
              <div>
                <MyEditButton
                  editing={isEditingConfig}
                  setEditing={setIsEditingConfig}
                />
                <Box className="pb-4"></Box>
              </div>
              <div>
                <MyEditableTextField
                  editing={isEditingConfig}
                  setEditing={setIsEditingConfig}
                  editable={false}
                  name="serviceType"
                  displayName="Service Type"
                  options={["Standard", "Same Day"]}
                  control={control}
                  errors={errors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: true,
                        }
                  }
                  value={
                    achConfig.serviceType
                      ? achConfig.serviceType.toLowerCase()[0].toUpperCase() +
                        achConfig.serviceType.toLowerCase().slice(1)
                      : ""
                  }
                  customOnChange={(val: any) => {
                    const tempAchConfig: ACHConfigWithStringDate = {
                      ...achConfig,
                      serviceType: val,
                    };

                    setACHConfig(tempAchConfig);
                  }}
                  submitting={false}
                />
                <Box className="pb-4"></Box>
                <MyEditableTextField
                  editing={isEditingConfig}
                  setEditing={setIsEditingConfig}
                  editable={false}
                  name="timezone"
                  displayName="Timezone"
                  control={control}
                  errors={errors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: true,
                        }
                  }
                  options={[
                    "US/Pacific",
                    "US/Mountain",
                    "US/Central",
                    "US/Eastern",
                  ]}
                  value={achConfig.timezone ? achConfig.timezone : ""}
                  customOnChange={(val: any) => {
                    const tempAchConfig: ACHConfigWithStringDate = {
                      ...achConfig,
                      timezone: val,
                    };

                    setACHConfig(tempAchConfig);
                  }}
                  submitting={false}
                />
                <Box className="pb-4"></Box>
                <MyEditableTextField
                  editing={isEditingConfig}
                  setEditing={setIsEditingConfig}
                  editable={false}
                  name="leadDays"
                  displayName="Lead Days"
                  control={control}
                  errors={errors}
                  rules={
                    submitting
                      ? { required: false, pattern: "" }
                      : {
                          required: true,
                          pattern: /^[0-9]+$/,
                        }
                  }
                  value={
                    achConfig.leadDays != null
                      ? achConfig.leadDays.toString()
                      : ""
                  }
                  customOnChange={(val: any) => {
                    const tempAchConfig: ACHConfigWithStringDate = {
                      ...achConfig,
                      leadDays: val,
                    };

                    setACHConfig(tempAchConfig);
                  }}
                  submitting={false}
                />
                <Box className="pb-4"></Box>
                <MyEditableTextField
                  editing={isEditingConfig}
                  setEditing={setIsEditingConfig}
                  editable={false}
                  name="odfi"
                  displayName="ODFI"
                  control={control}
                  errors={errors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: true,
                        }
                  }
                  value={achConfig.odfi ? achConfig.odfi : ""}
                  customOnChange={(val: any) => {
                    const tempAchConfig: ACHConfigWithStringDate = {
                      ...achConfig,
                      odfi: val,
                    };

                    setACHConfig(tempAchConfig);
                  }}
                  submitting={false}
                />
                <Box className="pb-4"></Box>
                <MyEditableTextField
                  editing={isEditingConfig}
                  setEditing={setIsEditingConfig}
                  editable={false}
                  name="immediateOrigin"
                  displayName="Immediate Origin"
                  control={control}
                  errors={errors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: true,
                        }
                  }
                  value={
                    achConfig.immediateOrigin ? achConfig.immediateOrigin : ""
                  }
                  customOnChange={(val: any) => {
                    const tempAchConfig: ACHConfigWithStringDate = {
                      ...achConfig,
                      immediateOrigin: val,
                    };

                    setACHConfig(tempAchConfig);
                  }}
                  submitting={false}
                />
                <Box className="pb-4"></Box>
                <MyEditableTextField
                  editing={isEditingConfig}
                  setEditing={setIsEditingConfig}
                  editable={false}
                  name="immediateOriginName"
                  displayName="Immediate Origin Name"
                  control={control}
                  errors={errors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: true,
                        }
                  }
                  value={achConfig.immediateOriginName ?? ""}
                  customOnChange={(val: any) => {
                    const tempAchConfig: ACHConfigWithStringDate = {
                      ...achConfig,
                      immediateOriginName: val,
                    };

                    setACHConfig(tempAchConfig);
                  }}
                  submitting={false}
                />
                <Box className="pb-4"></Box>
                <MyEditableTextField
                  editing={isEditingConfig}
                  setEditing={setIsEditingConfig}
                  editable={false}
                  name="immediateDestination"
                  displayName="Immediate Destination"
                  control={control}
                  errors={errors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: true,
                        }
                  }
                  value={
                    achConfig.immediateDestination
                      ? achConfig.immediateDestination
                      : ""
                  }
                  customOnChange={(val: any) => {
                    const tempAchConfig: ACHConfigWithStringDate = {
                      ...achConfig,
                      immediateDestination: val,
                    };

                    setACHConfig(tempAchConfig);
                  }}
                  submitting={false}
                />
                <Box className="pb-4"></Box>
                <MyEditableTextField
                  editing={isEditingConfig}
                  setEditing={setIsEditingConfig}
                  editable={false}
                  name="immediateDestinationName"
                  displayName="Immediate Destination Name"
                  control={control}
                  errors={errors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: true,
                        }
                  }
                  value={
                    achConfig.immediateDestinationName
                      ? achConfig.immediateDestinationName
                      : ""
                  }
                  customOnChange={(val: any) => {
                    const tempAchConfig: ACHConfigWithStringDate = {
                      ...achConfig,
                      immediateDestinationName: val,
                    };

                    setACHConfig(tempAchConfig);
                  }}
                  submitting={false}
                />
                <Box className="pb-4"></Box>
              </div>
            </div>
            <MyExpandableButton
              title="Offset"
              expand={expandOffset}
              toggleExpand={toggleExpandOffset}
            />
            <Divider />
            <div className="pb-4"></div>
            <div
              className={`${
                expandOffset ? "visible" : "hidden"
              } flex flex-row-reverse justify-between`}
            >
              <div>
                <MyEditButton
                  editing={isEditingOffset}
                  setEditing={setIsEditingOffset}
                />
                <Box className="pb-4"></Box>
              </div>
              <div>
                {offset && (
                  <>
                    <MyEditableTextField
                      editable={false}
                      editing={isEditingOffset}
                      setEditing={setIsEditingOffset}
                      name="offsetAccountName"
                      displayName="Offset Account Name"
                      control={control}
                      errors={errors}
                      rules={
                        submitting
                          ? { required: false }
                          : {
                              required: true,
                            }
                      }
                      value={
                        achConfig.offsetAccountName
                          ? achConfig.offsetAccountName
                          : ""
                      }
                      customOnChange={(val: any) => {
                        const tempAchConfig: ACHConfigWithStringDate = {
                          ...achConfig,
                          offsetAccountName: val,
                        };

                        setACHConfig(tempAchConfig);
                      }}
                      submitting={false}
                    />
                    <Box className="pb-4"></Box>
                    <MyEditableTextField
                      editable={false}
                      editing={isEditingOffset}
                      setEditing={setIsEditingOffset}
                      name="offsetAccountNumber"
                      displayName="Offset Account Number"
                      control={control}
                      errors={errors}
                      rules={
                        submitting
                          ? { required: false }
                          : {
                              required: true,
                            }
                      }
                      value={
                        achConfig.offsetAccountNumber
                          ? achConfig.offsetAccountNumber
                          : ""
                      }
                      customOnChange={(val: any) => {
                        const tempAchConfig: ACHConfigWithStringDate = {
                          ...achConfig,
                          offsetAccountNumber: val,
                        };

                        setACHConfig(tempAchConfig);
                      }}
                      submitting={false}
                    />
                    <Box className="pb-4"></Box>
                    <MyEditableTextField
                      editable={false}
                      editing={isEditingOffset}
                      setEditing={setIsEditingOffset}
                      name="offsetAccountType"
                      displayName="Offset Account Type"
                      control={control}
                      errors={errors}
                      options={["Savings", "Checking"]}
                      rules={
                        submitting
                          ? { required: false }
                          : {
                              required: true,
                            }
                      }
                      value={
                        achConfig.offsetAccountType == null
                          ? ""
                          : achConfig.offsetAccountType[0] +
                            achConfig.offsetAccountType.toLowerCase().slice(1)
                      }
                      customOnChange={(val: any) => {
                        const tempAchConfig: ACHConfigWithStringDate = {
                          ...achConfig,
                          offsetAccountType: val,
                        };

                        setACHConfig(tempAchConfig);
                      }}
                      submitting={false}
                    />
                    <Box className="pb-4"></Box>
                    <MyEditableTextField
                      editable={false}
                      editing={isEditingOffset}
                      setEditing={setIsEditingOffset}
                      name="offsetIdentificationNumber"
                      displayName="Offset ID Number"
                      control={control}
                      errors={errors}
                      rules={
                        submitting
                          ? { required: false }
                          : {
                              required: true,
                            }
                      }
                      value={
                        achConfig.offsetIdentificationNumber
                          ? achConfig.offsetIdentificationNumber
                          : ""
                      }
                      customOnChange={(val: any) => {
                        const tempAchConfig: ACHConfigWithStringDate = {
                          ...achConfig,
                          offsetIdentificationNumber: val,
                        };

                        setACHConfig(tempAchConfig);
                      }}
                      submitting={false}
                    />
                    <Box className="pb-4"></Box>
                    <MyEditableTextField
                      editable={false}
                      editing={isEditingOffset}
                      setEditing={setIsEditingOffset}
                      name="offsetRoutingNumber"
                      displayName="Offset Routing Number"
                      control={control}
                      errors={errors}
                      rules={
                        submitting
                          ? { required: false }
                          : {
                              required: true,
                            }
                      }
                      value={
                        achConfig.offsetRoutingNumber
                          ? achConfig.offsetRoutingNumber
                          : ""
                      }
                      customOnChange={(val: any) => {
                        const tempAchConfig: ACHConfigWithStringDate = {
                          ...achConfig,
                          offsetRoutingNumber: val,
                        };

                        setACHConfig(tempAchConfig);
                      }}
                      submitting={false}
                    />
                  </>
                )}
                <Box className="pb-4"></Box>
                <MyEditableTextField
                  editable={false}
                  editing={isEditingOffset}
                  setEditing={setIsEditingOffset}
                  name="offsetType"
                  displayName="Offset Type"
                  control={control}
                  errors={errors}
                  options={[
                    "Auto Per Batch",
                    "No Offset",
                    "Auto Per Transaction",
                  ]}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: true,
                        }
                  }
                  value={
                    achConfig.offsetType
                      ? offsetTypeToReadableMapping(achConfig.offsetType)
                      : ""
                  }
                  customOnChange={(val: any) => {
                    const tempAchConfig: ACHConfigWithStringDate = {
                      ...achConfig,
                      offsetType: val,
                    };
                    setACHConfig(tempAchConfig);

                    if (val == "No Offset") {
                      setOffset(false);
                    } else {
                      setOffset(true);
                    }
                  }}
                  submitting={false}
                />
                <Box className="pb-4"></Box>
              </div>
            </div>
            <MyExpandableButton
              title="Calendar"
              expand={expandCalendar}
              toggleExpand={toggleExpandCalendar}
            />
            <Divider />
            <div className="pb-4"></div>
            <div
              className={`${
                expandCalendar ? "visible" : "hidden"
              } flex flex-row-reverse justify-between`}
            >
              <div>
                <MyEditButton
                  editing={isEditingCalender}
                  setEditing={setIsEditingCalender}
                />
                <Box className="pb-4"></Box>
              </div>
              <div>
                <MyEditableTextField
                  editable={false}
                  clearable={false}
                  editing={isEditingCalender}
                  setEditing={setIsEditingCalender}
                  name="calendar.mondayActive"
                  displayName="Monday Active"
                  control={control}
                  errors={errors}
                  options={["True", "False"]}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: true,
                        }
                  }
                  value={
                    achConfig.calendar?.mondayActive != null
                      ? achConfig?.calendar?.mondayActive
                          ?.toString()[0]
                          .toUpperCase() +
                        achConfig.calendar?.mondayActive?.toString().slice(1)
                      : ""
                  }
                  customOnChange={(val: any) => {
                    let tempAchConfig: ACHConfigWithStringDate = {
                      ...achConfig,
                    };

                    if (
                      achConfig.calendar == undefined ||
                      achConfig.calendar == null
                    ) {
                      tempAchConfig = { ...tempAchConfig, calendar: {} };
                    }

                    let tempAchCalendar = tempAchConfig.calendar;

                    tempAchCalendar = { ...tempAchCalendar, mondayActive: val };

                    tempAchConfig = {
                      ...tempAchConfig,
                      calendar: tempAchCalendar,
                    };

                    setACHConfig(tempAchConfig);
                  }}
                  submitting={false}
                />
                <Box className="pb-4"></Box>
                <MyEditableTextField
                  editable={false}
                  clearable={false}
                  editing={isEditingCalender}
                  setEditing={setIsEditingCalender}
                  name="calendar.tuesdayActive"
                  displayName="Tuesday Active"
                  control={control}
                  errors={errors}
                  options={["True", "False"]}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: true,
                        }
                  }
                  value={
                    achConfig.calendar?.tuesdayActive != null
                      ? achConfig.calendar?.tuesdayActive
                          ?.toString()[0]
                          .toUpperCase() +
                        achConfig.calendar?.tuesdayActive?.toString().slice(1)
                      : ""
                  }
                  customOnChange={(val: any) => {
                    let tempAchConfig: ACHConfigWithStringDate = {
                      ...achConfig,
                    };

                    if (
                      achConfig.calendar == undefined ||
                      achConfig.calendar == null
                    ) {
                      tempAchConfig = { ...tempAchConfig, calendar: {} };
                    }

                    let tempAchCalendar = tempAchConfig.calendar;

                    tempAchCalendar = {
                      ...tempAchCalendar,
                      tuesdayActive: val,
                    };

                    tempAchConfig = {
                      ...tempAchConfig,
                      calendar: tempAchCalendar,
                    };

                    setACHConfig(tempAchConfig);
                  }}
                  submitting={false}
                />
                <Box className="pb-4"></Box>
                <MyEditableTextField
                  editable={false}
                  clearable={false}
                  editing={isEditingCalender}
                  setEditing={setIsEditingCalender}
                  name="calendar.wednesdayActive"
                  displayName="Wednesday Active"
                  control={control}
                  errors={errors}
                  options={["True", "False"]}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: true,
                        }
                  }
                  value={
                    achConfig.calendar?.wednesdayActive != null
                      ? achConfig.calendar?.wednesdayActive
                          ?.toString()[0]
                          .toUpperCase() +
                        achConfig.calendar?.wednesdayActive?.toString().slice(1)
                      : ""
                  }
                  customOnChange={(val: any) => {
                    let tempAchConfig: ACHConfigWithStringDate = {
                      ...achConfig,
                    };

                    if (
                      achConfig.calendar == undefined ||
                      achConfig.calendar == null
                    ) {
                      tempAchConfig = { ...tempAchConfig, calendar: {} };
                    }

                    let tempAchCalendar = tempAchConfig.calendar;

                    tempAchCalendar = {
                      ...tempAchCalendar,
                      wednesdayActive: val,
                    };

                    tempAchConfig = {
                      ...tempAchConfig,
                      calendar: tempAchCalendar,
                    };

                    setACHConfig(tempAchConfig);
                  }}
                  submitting={false}
                />
                <Box className="pb-4"></Box>
                <MyEditableTextField
                  editable={false}
                  clearable={false}
                  editing={isEditingCalender}
                  setEditing={setIsEditingCalender}
                  name="calendar.thursdayActive"
                  displayName="Thursday Active"
                  control={control}
                  errors={errors}
                  options={["True", "False"]}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: true,
                        }
                  }
                  value={
                    achConfig.calendar?.thursdayActive != null
                      ? achConfig.calendar?.thursdayActive
                          ?.toString()[0]
                          .toUpperCase() +
                        achConfig.calendar?.thursdayActive?.toString().slice(1)
                      : ""
                  }
                  customOnChange={(val: any) => {
                    let tempAchConfig: ACHConfigWithStringDate = {
                      ...achConfig,
                    };

                    if (
                      achConfig.calendar == undefined ||
                      achConfig.calendar == null
                    ) {
                      tempAchConfig = { ...tempAchConfig, calendar: {} };
                    }

                    let tempAchCalendar = tempAchConfig.calendar;

                    tempAchCalendar = {
                      ...tempAchCalendar,
                      thursdayActive: val,
                    };

                    tempAchConfig = {
                      ...tempAchConfig,
                      calendar: tempAchCalendar,
                    };

                    setACHConfig(tempAchConfig);
                  }}
                  submitting={false}
                />
                <Box className="pb-4"></Box>
                <MyEditableTextField
                  editable={false}
                  clearable={false}
                  editing={isEditingCalender}
                  setEditing={setIsEditingCalender}
                  name="calendar.fridayActive"
                  displayName="Friday Active"
                  control={control}
                  errors={errors}
                  options={["True", "False"]}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: true,
                        }
                  }
                  value={
                    achConfig.calendar?.fridayActive != null
                      ? achConfig.calendar?.fridayActive
                          ?.toString()[0]
                          .toUpperCase() +
                        achConfig.calendar?.fridayActive?.toString().slice(1)
                      : ""
                  }
                  customOnChange={(val: any) => {
                    let tempAchConfig: ACHConfigWithStringDate = {
                      ...achConfig,
                    };

                    if (
                      achConfig.calendar == undefined ||
                      achConfig.calendar == null
                    ) {
                      tempAchConfig = { ...tempAchConfig, calendar: {} };
                    }

                    let tempAchCalendar = tempAchConfig.calendar;

                    tempAchCalendar = {
                      ...tempAchCalendar,
                      fridayActive: val,
                    };

                    tempAchConfig = {
                      ...tempAchConfig,
                      calendar: tempAchCalendar,
                    };

                    setACHConfig(tempAchConfig);
                  }}
                  submitting={false}
                />
                <Box className="pb-4"></Box>
                <MyEditableTextField
                  editable={false}
                  clearable={false}
                  editing={isEditingCalender}
                  setEditing={setIsEditingCalender}
                  name="calendar.saturdayActive"
                  displayName="Saturday Active"
                  control={control}
                  errors={errors}
                  options={["True", "False"]}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: true,
                        }
                  }
                  value={
                    achConfig.calendar?.saturdayActive != null
                      ? achConfig.calendar?.saturdayActive
                          ?.toString()[0]
                          .toUpperCase() +
                        achConfig.calendar?.saturdayActive?.toString().slice(1)
                      : ""
                  }
                  customOnChange={(val: any) => {
                    let tempAchConfig: ACHConfigWithStringDate = {
                      ...achConfig,
                    };

                    if (
                      achConfig.calendar == undefined ||
                      achConfig.calendar == null
                    ) {
                      tempAchConfig = { ...tempAchConfig, calendar: {} };
                    }

                    let tempAchCalendar = tempAchConfig.calendar;

                    tempAchCalendar = {
                      ...tempAchCalendar,
                      saturdayActive: val,
                    };

                    tempAchConfig = {
                      ...tempAchConfig,
                      calendar: tempAchCalendar,
                    };

                    setACHConfig(tempAchConfig);
                  }}
                  submitting={false}
                />
                <Box className="pb-4"></Box>
                <MyEditableTextField
                  editable={false}
                  clearable={false}
                  editing={isEditingCalender}
                  setEditing={setIsEditingCalender}
                  name="calendar.sundayActive"
                  displayName="Sunday Active"
                  control={control}
                  errors={errors}
                  options={["True", "False"]}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: true,
                        }
                  }
                  value={
                    achConfig.calendar?.sundayActive != null
                      ? achConfig.calendar?.sundayActive
                          ?.toString()[0]
                          .toUpperCase() +
                        achConfig.calendar?.sundayActive?.toString().slice(1)
                      : ""
                  }
                  customOnChange={(val: any) => {
                    let tempAchConfig: ACHConfigWithStringDate = {
                      ...achConfig,
                    };

                    if (
                      achConfig.calendar == undefined ||
                      achConfig.calendar == null
                    ) {
                      tempAchConfig = { ...tempAchConfig, calendar: {} };
                    }

                    let tempAchCalendar = tempAchConfig.calendar;

                    tempAchCalendar = {
                      ...tempAchCalendar,
                      sundayActive: val,
                    };

                    tempAchConfig = {
                      ...tempAchConfig,
                      calendar: tempAchCalendar,
                    };

                    setACHConfig(tempAchConfig);
                  }}
                  submitting={false}
                />
                <Box className="pb-4"></Box>
                {achConfig.calendar &&
                achConfig.calendar?.holidays &&
                achConfig.calendar?.holidays?.length > 0 ? (
                  <>
                    <MyText size="md">Holidays</MyText>
                    <Box className="pb-2"></Box>
                    {achConfig.calendar.holidays.map(
                      (holiday: ACHConfigCalendarHoliday, index: number) => {
                        return (
                          <div key={index}>
                            <div className="flex flex-row items-start">
                              <div>
                                <MyText>Holiday Name</MyText>
                                <MyText size="md">{holiday.name}</MyText>
                                <Box className="pb-4"></Box>
                                <MyText>Date</MyText>
                                <MyText size="md">
                                  {`${holiday.year}-${holiday.month}-${holiday.day}`}
                                </MyText>
                                <Box className="pb-4"></Box>
                              </div>
                              <IconButton
                                onClick={() => {
                                  let tempAchConfig: ACHConfigWithStringDate = {
                                    ...achConfig,
                                  };

                                  if (
                                    tempAchConfig.calendar == undefined ||
                                    tempAchConfig.calendar == null ||
                                    tempAchConfig.calendar.holidays ==
                                      undefined ||
                                    tempAchConfig.calendar.holidays == null ||
                                    tempAchConfig.calendar.holidays.length == 0
                                  ) {
                                    return;
                                  }

                                  let tempAchCalendar = {
                                    ...tempAchConfig.calendar,
                                  };

                                  const tempAchHolidays =
                                    tempAchCalendar.holidays;

                                  const tempAchHolidaysUpdated = tempAchHolidays
                                    ?.slice(0, index)
                                    .concat(tempAchHolidays?.slice(index + 1));

                                  tempAchCalendar = {
                                    ...tempAchCalendar,
                                    holidays: tempAchHolidaysUpdated,
                                  };

                                  tempAchConfig = {
                                    ...tempAchConfig,
                                    calendar: tempAchCalendar,
                                  };

                                  setACHConfig(tempAchConfig);
                                }}
                              >
                                <div className="text-red-500">
                                  <DeleteOutlineRoundedIcon />
                                </div>
                              </IconButton>
                            </div>
                          </div>
                        );
                      }
                    )}
                    <Box className="pb-4"></Box>
                  </>
                ) : (
                  <></>
                )}
                {addHoliday && (
                  <>
                    <MyText size="md">Add New Holiday</MyText>
                    <Box className="pb-4"></Box>
                    <MyText>Holiday Name</MyText>
                    <MyControlledTextField
                      name="name"
                      displayName="Holiday Name"
                      control={holidayControl}
                      errors={holidayErrors}
                      rules={{
                        required: true,
                      }}
                      value={""}
                    />
                    <Box className="pb-4"></Box>
                    <MyText>Date</MyText>
                    <MyControlledDatePicker
                      name="date"
                      displayName="Date"
                      control={holidayControl}
                      errors={holidayErrors}
                      rules={{
                        required: true,
                        validate: (value: any) => {
                          const dateObject = moment(value.toString());
                          if (dateObject.toString() === "Invalid Date") {
                            return "Invalid Date";
                          } else {
                          }
                          return true;
                        },
                      }}
                      value=""
                    />
                    <Box className="pb-4"></Box>
                  </>
                )}
                <Box className="flex flex-row">
                  {addHoliday && (
                    <Box className="w-32">
                      <Button
                        style={{ textTransform: "none" }}
                        sx={{ color: "red" }}
                        variant="text"
                        onClick={(event) => {
                          setAddHoliday(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                  <Box className="w-32">
                    <MyBlueButton
                      onClick={() => {
                        if (!addHoliday) {
                          setAddHoliday(true);
                        } else {
                          holidayHandleSubmit(holidayOnSubmit)();
                        }
                      }}
                    >
                      {addHoliday ? "Add" : "Add Holiday"}
                    </MyBlueButton>
                  </Box>
                </Box>
                <Box className="pb-4"></Box>
              </div>
            </div>
            <MyExpandableButton
              title="Windows"
              expand={expandWindow}
              toggleExpand={toggleExpandWindow}
            />
            <Divider />
            <div className="pb-4"></div>
            <div className={`${expandWindow ? "visible" : "hidden"}`}>
              {achConfig.windows && achConfig.windows.length > 0 ? (
                achConfig.windows.map(
                  (window: ACHConfigWindowWithStringTime, index: number) => {
                    return (
                      <div key={index}>
                        <div className="flex flex-row items-start">
                          <div>
                            <MyText>Allow Same Day</MyText>
                            <MyText size="md">{window.allowSameDay}</MyText>
                            <Box className="pb-4"></Box>
                            <MyText>Hours</MyText>
                            <MyText size="md">{window.hours}</MyText>
                            <Box className="pb-4"></Box>
                            <MyText>Minutes</MyText>
                            <MyText size="md">{window.minutes}</MyText>
                            <Box className="pb-4"></Box>
                          </div>
                          <IconButton
                            onClick={() => {
                              let tempAchConfig: ACHConfigWithStringDate = {
                                ...achConfig,
                              };

                              if (
                                tempAchConfig.windows == undefined ||
                                tempAchConfig.windows == null
                              ) {
                                return;
                              }

                              const tempAchWindows = tempAchConfig.windows;

                              const tempAchWindowsUpdated = tempAchWindows
                                ?.slice(0, index)
                                .concat(tempAchWindows?.slice(index + 1));

                              tempAchConfig = {
                                ...tempAchConfig,
                                windows: tempAchWindowsUpdated,
                              };

                              setACHConfig(tempAchConfig);
                            }}
                          >
                            <div className="text-red-500">
                              <DeleteOutlineRoundedIcon />
                            </div>
                          </IconButton>
                        </div>
                      </div>
                    );
                  }
                )
              ) : (
                <></>
              )}
              {addWindow && (
                <>
                  <MyText>Allow same day</MyText>
                  <MyControlledAutocomplete
                    name="allowSameDay"
                    displayName="Allow Same Day"
                    control={windowControl}
                    errors={windowErrors}
                    options={["True", "False"]}
                    rules={{
                      required: true,
                    }}
                    value="False"
                  />
                  <Box className="pb-4"></Box>
                  <MyText>Time (Hours:Minutes)</MyText>
                  <MyControlledTimePicker
                    name="time"
                    displayName="Time"
                    control={windowControl}
                    errors={windowErrors}
                    rules={{
                      required: true,
                      validate: (value: any) => {
                        const timeObject = moment(value.toString());
                        if (timeObject.toString() === "Invalid date") {
                          return "Invalid Time";
                        }
                        return true;
                      },
                    }}
                    value={""}
                  />
                  <Box className="pb-4"></Box>
                </>
              )}
              <Box className="flex flex-row">
                {addWindow && (
                  <Box className="w-32">
                    <Button
                      style={{ textTransform: "none" }}
                      sx={{ color: "red" }}
                      variant="text"
                      onClick={(event) => {
                        setAddWindow(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
                <Box className="w-32">
                  <MyBlueButton
                    onClick={() => {
                      if (!addWindow) {
                        setAddWindow(true);
                      } else {
                        windowHandleSubmit(windowOnSubmit)();
                      }
                    }}
                  >
                    {addWindow ? "Add" : "Add Window"}
                  </MyBlueButton>
                </Box>
              </Box>
              <Box className="pb-4"></Box>
            </div>
            <Box className="pb-8"></Box>
            <Box className="w-fit">
              <MyBlueButton type="submit" submitting={submitting}>
                Update ACH Config
              </MyBlueButton>
            </Box>
          </Box>
        </form>
      )}
    </>
  );
};

export default RequireRole(ACHConfigSettings, ADMIN_ROUTE);
