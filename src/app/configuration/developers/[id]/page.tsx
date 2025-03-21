"use client";

import { useAppDispatch } from "@/redux/store/store";
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { setTitle } from "@/redux/slices/AppSlice";
import MyText from "@/core/components/Text/Text";
import ItemRow from "@/core/components/Text/ItemRow";
import { Developer, WhitelistedIP } from "@/core/api/ApiTypes";
import {
  deleteWhitelistedDeveloperIP,
  fetchDeveloper,
  fetchDeveloperWhitelistedIPs,
  setWhitelistedIPsPageNumber,
  updateDeveloper,
} from "@/redux/slices/DeveloperSlice";
import RequireRole from "@/core/components/RequireRole";
import {
  ADMIN_OPS_ROLE,
  ADMIN_ROLE,
  ADMIN_ROUTE,
  paginationPageSize,
  PaginationStateType,
} from "@/core/constants";
import { useSelector } from "react-redux";
import MyTable from "@/core/components/Table/MyTable";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { enqueueSnackbar } from "notistack";
import MyEditableTextField from "@/core/components/TextField/MyEditableTextField";
import { SubmitHandler, useForm } from "react-hook-form";

const DeveloperPage = ({ params }: { params: { id: string } }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const ips: "loading" | string | WhitelistedIP[] = useSelector(
    (state: any) => state.developer.whitelistedIPs
  );

  const pagination: PaginationStateType = useSelector(
    (state: any) => state.developer.whitelistedIPsPagination
  );

  const userType = useSelector((state: any) => state.app.userType);

  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [refresh, setRefresh] = useState(true);

  const [deleting, setDeleting] = useState<string[]>([]);

  useEffect(() => {
    if (refresh) {
      setRefresh(false);
      dispatch(setTitle("Developer"));
      dispatch(fetchDeveloper(params.id)).then((data: any) => {
        if (data.payload) {
          setDeveloper(data.payload);
          dispatch(setTitle(data.payload.name));
        }
        setLoading(false);
      });
      dispatch(
        fetchDeveloperWhitelistedIPs({
          id: params.id.toString(),
          refresh: true,
        })
      );
    }
  }, [dispatch, params.id, refresh]);

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    getValues,
    handleSubmit,
    reset,
  } = useForm<{
    enableIpRestriction: string;
  }>();
  const onSubmit: SubmitHandler<{
    enableIpRestriction: string;
  }> = (data: { enableIpRestriction: string }) => {
    console.log(data);
  };
  return loading ? (
    <div className="flex flex-col items-center justify-center">
      <CircularProgress></CircularProgress>
      <div>Fetching developer details...</div>
    </div>
  ) : developer == null ? (
    <MyText>Developer not found</MyText>
  ) : (
    <div className="">
      <ItemRow title="Tenant ID" value={developer.tenantId ?? ""}></ItemRow>
      <ItemRow title="Name" value={developer.name ?? ""}></ItemRow>
      {userType == ADMIN_ROLE || userType == ADMIN_OPS_ROLE ? (
        <div className="w-[300px]">
          <MyEditableTextField
            editing={editing}
            setEditing={setEditing}
            name="enableIpRestriction"
            displayName="Enable IP Restriction"
            control={control}
            errors={errors}
            rules={
              submitting
                ? { required: false }
                : {
                    required: true,
                  }
            }
            options={["True", "False"]}
            value={developer.enableIpRestriction ?? ""}
            submitting={submitting}
            customOnChange={(value: string) => {
              setEditing(false);
              setSubmitting(true);
              dispatch(
                updateDeveloper({
                  id: developer.tenantId ?? "",
                  enableIpRestriction: value,
                })
              ).then((data: any) => {
                setSubmitting(false);
                if (typeof data.payload != "string") {
                  enqueueSnackbar("Developer updated successfully", {
                    variant: "success",
                  });
                  setRefresh(true);
                } else {
                  enqueueSnackbar(data.payload, {
                    variant: "error",
                    persist: true,
                  });
                }
              });
            }}
          />
        </div>
      ) : (
        <ItemRow
          title="Enable IP Restriction"
          value={developer.enableIpRestriction ?? ""}
        ></ItemRow>
      )}
      <MyText>Whitelisted IP Addresses</MyText>
      <div className="pb-2" />
      {ips == "loading" ? (
        <MyCircularProgressIndicator />
      ) : typeof ips == "string" ? (
        <ErrorPage
          error={ips}
          recoveryButtonOnClick={() => {}}
          recoveryButtonTitle="Retry"
        />
      ) : ips.length == 0 ? (
        <MyText>No whitelisted IP found</MyText>
      ) : (
        <div style={{ height: "57vh" }}>
          <MyTable
            customId={(row: any) => row.ipAddress}
            handleRowClick={(row: any) => {}}
            pagination={{
              rowCount: pagination.rowCount,
              loading: pagination.loadingPage,
              paginationModel: {
                page: pagination.pageNumber,
                pageSize: paginationPageSize,
              },
              setPaginationModel: (page: number) => {
                dispatch(setWhitelistedIPsPageNumber(page));
                dispatch(
                  fetchDeveloperWhitelistedIPs({
                    id: params.id.toString(),
                    refresh: false,
                  })
                );
              },
            }}
            columns={[
              {
                field: "ipAddress",
                headerName: "IP Address",
                width: 160,
              },
              {
                field: "delete",
                headerName: "Delete IP",
                width: 120,
                display: "flex",
                renderCell: (rowParams: any) =>
                  deleting.includes(rowParams.row.id) ? (
                    <CircularProgress size="25px" />
                  ) : (
                    <div className="pl-[10px] text-red-500">
                      <DeleteOutlineRoundedIcon
                        onClick={() => {
                          const arr: string[] = [...deleting];
                          arr.push(rowParams.row.id ?? "");
                          setDeleting(arr);

                          dispatch(
                            deleteWhitelistedDeveloperIP(rowParams.row.id)
                          ).then((data: any) => {
                            if (data.payload == null) {
                              enqueueSnackbar(
                                "IP Address deleted successfully",
                                {
                                  variant: "success",
                                }
                              );
                              dispatch(
                                fetchDeveloperWhitelistedIPs({
                                  id: params.id.toString(),
                                  refresh: true,
                                })
                              );
                            } else {
                              enqueueSnackbar(data.payload, {
                                variant: "error",
                                persist: true,
                              });
                            }

                            const arr: string[] = [...deleting];
                            const uArr = arr.filter(
                              (e) => e != rowParams.row.id
                            );
                            setDeleting(uArr);
                          });
                        }}
                      />
                    </div>
                  ),
              },
            ]}
            rows={ips}
          />
        </div>
      )}
    </div>
  );
};

export default RequireRole(DeveloperPage, ADMIN_ROUTE);
