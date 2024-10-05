"use client";

import { WireTransactionStatus } from "@/core/api/ApiTypes";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import MyTable from "@/core/components/Table/MyTable";
import MyText from "@/core/components/Text/Text";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import { fetchWireTransactionStatus } from "@/redux/slices/wire_processing_slice";
import { useAppDispatch } from "@/redux/store/store";
import { useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React from "react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

const WireFileErrorsPage = () => {
  const searchParams = useSearchParams();

  const dispatch = useAppDispatch();

  const [filename, setFilename] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const transactions: "loading" | string | WireTransactionStatus[] =
    useSelector((state: any) => state.wireProcessing.transactionsStatus);

  const {
    formState: { errors },
    control: control,
    handleSubmit,
    setValue,
    reset,
  } = useForm<{
    filename: string;
  }>();
  const onSubmit: SubmitHandler<{ filename: string }> = (data: {
    filename: string;
  }) => {
    console.log("data:", data);

    if (data.filename == null) {
      enqueueSnackbar("Please enter filename", { variant: "error" });
      return;
    }

    setSubmitting(true);
    setFilename(data.filename);
    dispatch(
      fetchWireTransactionStatus({ filename: data.filename, refresh: true })
    ).then(() => {
      setSubmitting(false);
    });
  };

  useEffect(() => {
    const fl = searchParams.get("filename");
    setFilename(fl);

    if (fl != null) {
      dispatch(fetchWireTransactionStatus({ filename: fl, refresh: true }));
    }
  }, []);

  return (
    <>
      <MyText size="md">Filename</MyText>
      <div className="flex flex-row">
        <div className="w-[400px]">
          <MyControlledTextField
            name="filename"
            displayName="File Name"
            control={control}
            errors={errors}
            rules={
              submitting
                ? { required: false }
                : {
                    required: true,
                  }
            }
            value={filename ?? ""}
          />
        </div>
        <div className="pr-4" />
        <div className="w-fit">
          <MyBlueButton
            submitting={submitting}
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
          >
            Get File Errors
          </MyBlueButton>
        </div>
      </div>
      <div className="pb-4" />
      {filename == null ? (
        <></>
      ) : transactions == "loading" ? (
        <MyCircularProgressIndicator />
      ) : typeof transactions == "string" ? (
        <ErrorPage
          error={transactions}
          recoveryButtonTitle="Retry"
          recoveryButtonOnClick={() => {
            if (filename != null) {
              dispatch(
                fetchWireTransactionStatus({
                  filename: filename,
                  refresh: true,
                })
              );
            }
          }}
        />
      ) : ///inbound2912624940572885318.txt.172226394871
      transactions.length == 0 ? (
        <MyText size="md">No file found</MyText>
      ) : transactions?.[0]?.errors?.length == 0 ? (
        <MyText size="md">No errors found</MyText>
      ) : (
        <div style={{ height: "67vh" }}>
          <MyTable
            handleRowClick={(params: any) => {}}
            customId={(row: any) => uuidv4()}
            columns={[
              {
                field: "level",
                headerName: "Level",
                width: 160,
              },
              {
                field: "message",
                headerName: "Message",
                flex: 1,
                minWidth: 250,
              },
            ]}
            rows={transactions?.[0]?.errors ?? []}
          />
        </div>
      )}
    </>
  );
};

export default WireFileErrorsPage;
