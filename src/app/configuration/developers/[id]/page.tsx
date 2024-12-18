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
} from "@/redux/slices/DeveloperSlice";
import RequireRole from "@/core/components/RequireRole";
import {
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

  const [deleting, setDeleting] = useState<string[]>([]);

  useEffect(() => {
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
  }, [dispatch, params.id]);

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
      <ItemRow
        title="Enable IP Restriction"
        value={developer.enableIpRestriction ?? ""}
      ></ItemRow>
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
