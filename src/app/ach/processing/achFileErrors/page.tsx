"use client";

import { ACHFileError } from "@/core/api/ApiTypes";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import MyTable from "@/core/components/Table/MyTable";
import MyText from "@/core/components/Text/Text";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import { paginationPageSize, PaginationStateType } from "@/core/constants";
import {
  fetchACHFileErrors,
  setACHFileErrorsPaginationPageNumber,
} from "@/redux/slices/ach_processing_slice";
import { useAppDispatch } from "@/redux/store/store";
import { useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const ACHFileErrorsPage = () => {
  const searchParams = useSearchParams();

  const dispatch = useAppDispatch();

  const [filename, setFilename] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const pagination: PaginationStateType = useSelector(
    (state: any) => state.processing.fileErrorsPagination
  );

  const errors: "loading" | string | ACHFileError[] = useSelector(
    (state: any) => state.processing.fileErrors
  );

  const {
    formState: { errors: achErrors },
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
    dispatch(fetchACHFileErrors({ filename: data.filename, reset: true })).then(
      () => {
        setSubmitting(false);
      }
    );
  };

  useEffect(() => {
    const fl = searchParams.get("filename");
    setFilename(fl);

    if (fl != null) {
      dispatch(fetchACHFileErrors({ filename: fl, reset: true }));
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
            errors={achErrors}
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
      ) : errors == "loading" ? (
        <MyCircularProgressIndicator />
      ) : typeof errors == "string" ? (
        <ErrorPage
          error={errors}
          recoveryButtonTitle="Retry"
          recoveryButtonOnClick={() => {
            if (filename != null) {
              dispatch(fetchACHFileErrors({ filename: filename, reset: true }));
            }
          }}
        />
      ) : ///inbound2912624940572885318.txt.172226394871
      errors.length == 0 ? (
        <MyText size="md">No errors found</MyText>
      ) : (
        <div style={{ height: "53vh" }}>
          <MyTable
            pagination={{
              rowCount: pagination.rowCount,
              loading: pagination.loadingPage,
              paginationModel: {
                page: pagination.pageNumber,
                pageSize: paginationPageSize,
              },
              setPaginationModel: (page: number) => {
                dispatch(setACHFileErrorsPaginationPageNumber(page));
                dispatch(
                  fetchACHFileErrors({ filename: filename, reset: false })
                );
              },
            }}
            handleRowClick={(params: any) => {}}
            columns={[
              {
                field: "id",
                headerName: "ID",
                flex: 1,
                minWidth: 120,
              },
              {
                field: "filename",
                headerName: "File Name",
                flex: 1,
                minWidth: 250,
              },
              {
                field: "details",
                headerName: "Details",
                flex: 1,
                minWidth: 300,
              },
              {
                field: "summary",
                headerName: "Summary",
                flex: 1,
                minWidth: 200,
              },
              {
                field: "externalId",
                headerName: "External ID",
                flex: 1,
                minWidth: 160,
              },
              {
                field: "reference",
                headerName: "Reference",
                flex: 1,
                minWidth: 120,
              },
              {
                field: "paymentId",
                headerName: "Payment ID",
                flex: 1,
                minWidth: 120,
              },
              {
                field: "linkedPaymentId",
                headerName: "Linked Payment ID",
                flex: 1,
                minWidth: 120,
              },
              {
                field: "productId",
                headerName: "Product ID",
                flex: 1,
                minWidth: 120,
              },
              {
                field: "accountId",
                headerName: "Account ID",
                flex: 1,
                minWidth: 120,
              },
              {
                field: "customerId",
                headerName: "Customer ID",
                flex: 1,
                minWidth: 120,
              },
              {
                field: "achId",
                headerName: "ACH ID",
                flex: 1,
                minWidth: 120,
              },
            ]}
            rows={errors}
          />
        </div>
      )}
    </>
  );
};

export default ACHFileErrorsPage;
