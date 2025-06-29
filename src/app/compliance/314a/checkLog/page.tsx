"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import {
  GridCellParams,
  GridEventListener,
  MuiEvent,
} from "@mui/x-data-grid-pro";
import { useSearchParams } from "next/navigation";
import MyTable from "@/core/components/Table/MyTable";
import { timestampToDate } from "@/core/utils/date_time_util";
import Link from "next/link";
import ErrorPage from "@/core/components/error_page";
import LabelBox from "@/core/components/label_box";
import { enumTextToReadableText } from "@/core/utils/formatting_util";
import { setTitle } from "@/redux/slices/AppSlice";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import MyText from "@/core/components/Text/Text";
import { fetch314ALog } from "@/redux/slices/314a_slice";
import { Compliance314ALog } from "@/core/api/ApiTypes";
import { useForm } from "react-hook-form";
import { Moment } from "moment";
import { SubmitHandler } from "react-hook-form";
import { momentToTimeZoneString } from "@/core/utils/date_time_util";
import moment from "moment";
import MyControlledDatePicker from "@/core/components/DateTimePicker/MyControlledDateTimePicker";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import MyBlueButton from "@/core/components/Button/MyBlueButton";

const CheckLogTable = () => {
  const qParams = useSearchParams();
  const dispatch = useAppDispatch();

  const [logs, setLogs] = useState<
    "initial" | "loading" | string | Compliance314ALog[]
  >("initial");

  const [submitting, setSubmitting] = useState(false);

  const {
    formState: { errors },
    control,
    handleSubmit,
    getValues,
  } = useForm<{
    startDateTime: Moment;
    endDateTime: Moment;
  }>();
  const onSubmit: SubmitHandler<{
    startDateTime: Moment;
    endDateTime: Moment;
  }> = (data: { startDateTime: Moment; endDateTime: Moment }) => {
    console.log("data:", data);

    setSubmitting(true);

    dispatch(
      fetch314ALog({
        startDateTime: momentToTimeZoneString(data.startDateTime, true),
        endDateTime: momentToTimeZoneString(data.endDateTime, false),
      })
    ).then((d: any) => {
      setSubmitting(false);
      setLogs(d.payload);
    });
  };

  useEffect(() => {
    dispatch(setTitle("Check Log"));
  }, [dispatch, qParams]);

  return (
    <>
      <div>
        <div className="flex flex-row pb-4 w-[650px] items-end">
          <div className="w-[300px]">
            <MyText size="sm">Start Date</MyText>
            <MyControlledDatePicker
              name="startDateTime"
              displayName="Start Date"
              control={control}
              errors={errors}
              rules={{
                required: true,
                validate: (value: any) => {
                  const dateObject = moment(value.toString());
                  if (dateObject.isValid() == false) {
                    return "Invalid Date";
                  } else {
                  }
                  return true;
                },
              }}
              value=""
            />
          </div>
          <div className="w-4"></div>
          <div className="w-[300px]">
            <MyText size="sm">End Date</MyText>
            <MyControlledDatePicker
              name="endDateTime"
              displayName="End Date"
              control={control}
              errors={errors}
              rules={{
                required: true,
                validate: (value: any) => {
                  const dateObject = moment(value.toString());
                  if (dateObject.isValid() == false) {
                    return "Invalid Date";
                  } else {
                  }
                  return true;
                },
              }}
              value=""
            />
          </div>
          <div className="w-4"></div>
          <div className="w-fit pb-[2px]">
            <MyBlueButton
              onClick={handleSubmit(onSubmit)}
              submitting={submitting}
            >
              Search
            </MyBlueButton>
          </div>
        </div>
      </div>
      <div className="h-2"></div>
      {logs == "initial" ? (
        <></>
      ) : logs == "loading" ? (
        <MyCircularProgressIndicator />
      ) : typeof logs == "string" ? (
        <ErrorPage
          error="Error loading logs"
          recoveryButtonOnClick={() => {
            setLogs("loading");
            dispatch(
              fetch314ALog({
                startDateTime: momentToTimeZoneString(
                  getValues("startDateTime"),
                  true
                ),
                endDateTime: momentToTimeZoneString(
                  getValues("endDateTime"),
                  false
                ),
              })
            ).then((res: any) => {
              setLogs(res.payload);
            });
          }}
          recoveryButtonTitle="Retry"
        />
      ) : logs.length == 0 ? (
        <MyText>No logs found</MyText>
      ) : (
        <div
          style={{
            height: "calc(100vh - 260px)",
          }}
        >
          <MyTable
            handleRowClick={() => {}}
            handleCellClick={(
              params: GridCellParams,
              event: MuiEvent<React.MouseEvent>
            ) => {
              if (params.field == "productName") {
                event.stopPropagation();
              }
            }}
            columns={[
              {
                field: "id",
                headerName: "ID",
                flex: 1,
                minWidth: 120,
              },
              {
                field: "fileUploadedAt",
                headerName: "File Uploaded At",
                minWidth: 180,
                flex: 1,
                display: "flex",
                valueFormatter: (params: any) => {
                  return `${timestampToDate(params, false, true)}`;
                },
                valueGetter: (value: any, row: any) => row.fileUploadedAt,
              },
              {
                field: "filename",
                headerName: "Filename",
                flex: 1,
                minWidth: 140,
                display: "flex",
              },
              {
                field: "requesterUsername",
                headerName: "Upload By",
                flex: 1,
                minWidth: 160,
                display: "flex",
              },
              {
                field: "numberOfRecordsUploaded",
                headerName: "Record uploaded",
                flex: 1,
                minWidth: 120,
              },
              {
                field: "numberOfBusinessesScanned",
                headerName: "Business checked",
                flex: 1,
                minWidth: 120,
              },
              {
                field: "numberOfIndividualsScanned",
                headerName: "Individual checked",
                flex: 1,
                minWidth: 120,
              },
              {
                field: "numberOfAlertsCreated",
                headerName: "Alerts created",
                flex: 1,
                minWidth: 120,
              },
            ]}
            rows={logs}
          />
        </div>
      )}
    </>
  );
};

export default CheckLogTable;
