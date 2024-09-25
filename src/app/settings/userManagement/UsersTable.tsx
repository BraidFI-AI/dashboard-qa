"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { GridCellParams, GridEventListener, MuiEvent } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
import MyTable from "@/core/components/Table/MyTable";
import timestampToDate from "@/core/utils/timestampToDate";
import MyText from "@/core/components/Text/Text";
import {
  UserManagementState,
  deleteUser,
  disableUser,
  enableUser,
  fetchUsers,
  resetPassword,
  setUserManagementLoading,
} from "@/redux/slices/UsermanagementSlice";
import { User } from "@/core/api/ApiTypes";
import UserDetailsModal from "./UserModel";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { enqueueSnackbar } from "notistack";
import MyRedButton from "@/core/components/Button/MyRedButton";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import PersonAddDisabledOutlinedIcon from "@mui/icons-material/PersonAddDisabledOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import Tooltip from "@mui/material/Tooltip";
import { userGroupMappingToReadableNames } from "@/core/constants";

const UsersTable = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const state: UserManagementState = useSelector(
    (state: any) => state.userManagement
  );

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [deleting, setDeleting] = useState<string[]>([]);
  const [updatingStatus, setUpdatingStatus] = useState<string[]>([]);
  const [resettingPassword, setResettingPassword] = useState<string[]>([]);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    if (state.users) {
      state.users.forEach((user: User) => {
        if (user.Username == params.id) {
          setSelectedUser(user);
        }
      });

      handleModalOpen();
    }
  };

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  return state.loading ? (
    <div className="flex flex-col items-center justify-center">
      <CircularProgress></CircularProgress>
      <div>Loading users...</div>
    </div>
  ) : state.error ? (
    <>
      <MyText>{state.errorMessage}</MyText>
      <div className="pb-4"></div>
      <div className="w-[40px]">
        <MyBlueButton
          onClick={() => {
            dispatch(setUserManagementLoading());
            dispatch(fetchUsers(""));
          }}
        >
          Retry
        </MyBlueButton>
      </div>
    </>
  ) : state.users.length == 0 ? (
    <MyText>No users found</MyText>
  ) : (
    <>
      {selectedUser != null && (
        <UserDetailsModal
          user={selectedUser}
          modalOpen={modalOpen}
          handleModalClose={handleModalClose}
        />
      )}
      <MyTable
        handleCellClick={(
          params: GridCellParams,
          event: MuiEvent<React.MouseEvent>
        ) => {
          if (
            params.field == "changeStatus" ||
            params.field == "deleteUser" ||
            params.field == "resetPassword"
          ) {
            event.stopPropagation();
          }
        }}
        handleRowClick={handleRowClick}
        customId={(user: User) => user.Username}
        columns={[
          { field: "Username", headerName: "Username", flex: 1, minWidth: 160 },
          {
            field: "Attributes[3].name",
            headerName: "Email",
            flex: 1,
            minWidth: 200,
            renderCell: (params: any) => (
              <div>
                {
                  params.row.Attributes?.filter((attr: any) => {
                    return attr.Name == "email";
                  })?.[0]?.Value
                }
              </div>
            ),
            valueGetter: (params: any) =>
              params.row.Attributes?.filter((attr: any) => {
                return attr.Name == "email";
              })?.[0]?.Value,
          },
          {
            field: "Groups",
            headerName: "User Group",
            flex: 1,
            minWidth: 200,
            renderCell: (params: any) => (
              <div>{params.row.Groups?.[0] ?? ""}</div>
            ),
            valueGetter: (params: any) => params.row.Groups?.[0] ?? "",
          },
          {
            field: "Attributes[0].name",
            headerName: "Tenant ID",
            flex: 1,
            minWidth: 120,
            renderCell: (params: any) => (
              <div>
                {
                  params.row.Attributes?.filter((attr: any) => {
                    return attr?.Name == "custom:tenantId";
                  })?.[0]?.Value
                }
              </div>
            ),
            valueGetter: (params: any) =>
              params.row.Attributes?.filter((attr: any) => {
                return attr?.Name == "custom:tenantId";
              })?.[0]?.Value,
          },
          {
            field: "Groups",
            headerName: "User Group",
            flex: 1,
            minWidth: 200,
            renderCell: (params: any) => (
              <div>
                {userGroupMappingToReadableNames[params.row.Groups?.[0] ?? ""]}
              </div>
            ),
            valueGetter: (params: any) =>
              userGroupMappingToReadableNames[params.row.Groups?.[0] ?? ""],
          },
          {
            field: "Enabled",
            headerName: "Enabled",
            flex: 1,
            minWidth: 120,
            renderCell: (params: any) => (
              <div>
                {params.row.Enabled?.toString()?.[0]?.toUpperCase() +
                  params.row.Enabled?.toString()?.slice(1)}
              </div>
            ),
            valueGetter: (params: any) =>
              params.row.Enabled?.toString()?.[0]?.toUpperCase() +
              params.row.Enabled?.toString()?.slice(1),
          },
          {
            field: "UserStatus",
            headerName: "Status",
            flex: 1,
            minWidth: 220,
          },
          {
            field: "resetPassword",
            headerName: "Password",
            flex: 1,
            minWidth: 90,
            renderCell: (params: any) =>
              resettingPassword.includes(params.row.Username ?? "") ? (
                <CircularProgress size="25px" />
              ) : (
                <Tooltip title="Reset Password">
                  <div className="pl-[19px]">
                    <LockResetOutlinedIcon
                      className="text-[#12A7FF]"
                      onClick={() => {
                        const arr: string[] = [...resettingPassword];
                        arr.push(params.row.Username ?? "");
                        setResettingPassword(arr);

                        dispatch(resetPassword(params.row.Username)).then(
                          (data: any) => {
                            if (typeof data.payload != "string") {
                              enqueueSnackbar("Password reset successfully", {
                                variant: "success",
                              });
                            } else {
                              enqueueSnackbar(data.payload, {
                                variant: "error",
                                persist: true,
                              });
                            }
                            const arr: string[] = [...resettingPassword];
                            const uArr = resettingPassword.filter(
                              (e) => e != params.row.Username
                            );
                            setResettingPassword(uArr);
                          }
                        );
                      }}
                    />
                  </div>
                </Tooltip>
              ),
          },
          {
            field: "changeStatus",
            headerName: "Status",
            flex: 1,
            minWidth: 70,
            renderCell: (params: any) =>
              updatingStatus.includes(params.row.Username) ? (
                <CircularProgress size="25px" />
              ) : (
                <Tooltip
                  title={
                    params.row.Enabled == true ? "Disable user" : "Enable user"
                  }
                >
                  <div
                    className="pl-[9px]"
                    onClick={() => {
                      const arr: string[] = [...updatingStatus];
                      arr.push(params.row.Username);
                      setUpdatingStatus(arr);

                      params.row.Enabled
                        ? dispatch(disableUser(params.row.Username)).then(
                            (data: any) => {
                              if (typeof data.payload != "string") {
                                enqueueSnackbar("User disabled successfully", {
                                  variant: "success",
                                });
                              } else {
                                enqueueSnackbar(data.payload, {
                                  variant: "error",
                                  persist: true,
                                });
                              }

                              const arr: string[] = [...updatingStatus];
                              const uArr = arr.filter(
                                (e) => e != params.row.Username
                              );
                              setUpdatingStatus(uArr);
                            }
                          )
                        : dispatch(enableUser(params.row.Username)).then(
                            (data: any) => {
                              if (typeof data.payload != "string") {
                                enqueueSnackbar("User enabled successfully", {
                                  variant: "success",
                                });
                              } else {
                                enqueueSnackbar(data.payload, {
                                  variant: "error",
                                  persist: true,
                                });
                              }

                              const arr: string[] = [...updatingStatus];
                              const uArr = arr.filter(
                                (e) => e != params.row.Username
                              );
                              setUpdatingStatus(uArr);
                            }
                          );
                    }}
                  >
                    {params.row.Enabled == true ? (
                      <PersonAddDisabledOutlinedIcon className="text-red-500" />
                    ) : (
                      <PersonAddOutlinedIcon className="text-[#12A7FF]" />
                    )}
                  </div>
                </Tooltip>
              ),
          },
          {
            field: "deleteUser",
            headerName: "Delete",
            flex: 1,
            minWidth: 70,
            renderCell: (params: any) =>
              deleting.includes(params.row.Username) ? (
                <CircularProgress size="25px" />
              ) : (
                <div className="pl-[10px] text-red-500">
                  <DeleteOutlineRoundedIcon
                    onClick={() => {
                      const arr: string[] = [...deleting];
                      arr.push(params.row.Username ?? "");
                      setDeleting(arr);

                      dispatch(deleteUser(params.row.Username)).then(
                        (data: any) => {
                          if (typeof data.payload != "string") {
                            enqueueSnackbar("User deleted successfully", {
                              variant: "success",
                            });
                          } else {
                            enqueueSnackbar(data.payload, {
                              variant: "error",
                              persist: true,
                            });
                          }

                          const arr: string[] = [...deleting];
                          const uArr = arr.filter(
                            (e) => e != params.row.Username
                          );
                          setDeleting(uArr);
                        }
                      );
                    }}
                  />
                </div>
              ),
          },
        ]}
        rows={state.users}
      />
    </>
  );
};

export default UsersTable;
