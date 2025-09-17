"use client";

import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/store/store";
import { useEffect, useState } from "react";
import MyText from "@/core/components/Text/Text";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import { SubmitHandler, useForm } from "react-hook-form";
import { CreateUser } from "@/core/api/ApiTypes";
import { CircularProgress } from "@mui/material";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import { fetchTenetIdsList } from "@/redux/slices/DeveloperSlice";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { createUser } from "@/redux/slices/UsermanagementSlice";
import { enqueueSnackbar } from "notistack";
import RequireRole from "@/core/components/RequireRole";
import { ADMIN_ROLE, DEVELOPER_ROLE, userGroupMapping } from "@/core/constants";
import { useSelector } from "react-redux";

const CreateUserPage = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tenants, setTenants] = useState<string[] | null>(null);
  const [isDeveloper, setIsDeveloper] = useState(true);
  const userType = useSelector((state: any) => state.app.userType);
  const tenantId = useSelector((state: any) => state.app.tenantId);

  const [userGroups, setUserGroups] = useState([
    "Bank Admin",
    "Bank Ops",
    "Fintech Admin",
    "Fintech Ops",
    "Bank readonly",
    "Fintech readonly",
    "Admin Compliance",
  ]);

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
  } = useForm<CreateUser>();
  const onSubmit: SubmitHandler<CreateUser> = (data: CreateUser) => {
    if (!isDeveloper) {
      data.tenantId = "";
    }
    console.log(data);

    setSubmitting(true);

    data.group = userGroupMapping[data.group];

    if (userType == DEVELOPER_ROLE) {
      data.tenantId = tenantId;
    }

    dispatch(createUser(data)).then((usr: any) => {
      if (typeof usr.payload != "string") {
        enqueueSnackbar("User created successfully", { variant: "success" });
        router.replace("/settings/userManagement");
      } else {
        enqueueSnackbar(usr.payload, { variant: "error" });
      }
      setSubmitting(false);
    });
  };

  useEffect(() => {
    if (userType == DEVELOPER_ROLE) {
      setUserGroups(["Fintech Ops", "Fintech readonly"]);
    }
  }, [userType]);

  useEffect(() => {
    if (userType != DEVELOPER_ROLE) {
      dispatch(fetchTenetIdsList()).then((ts: any) => {
        setTenants(ts.payload);
        setLoading(false);
      });
    }
  }, [dispatch, userType]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-6">
      <Box className="flex flex-col w-[300px]">
        <MyText>Username</MyText>
        <MyControlledTextField
          name="username"
          displayName="Username"
          control={control}
          errors={errors}
          rules={
            submitting
              ? { required: false }
              : {
                  required: true,
                  validate: (value: any, formValues: any) => {
                    if (value.includes(" ")) {
                      return "Username cannot contain spaces";
                    }
                  },
                }
          }
          value={""}
        />
        <Box className="pb-4"></Box>
        <MyText>Email</MyText>
        <MyControlledTextField
          name="email"
          displayName="Email"
          control={control}
          errors={errors}
          rules={
            submitting
              ? { required: false, validate: null }
              : {
                  required: true,
                  validate: (value: any, formValues: any) => {
                    const chars = value.split("");
                    if (
                      !(
                        chars.filter((c: any) => c == "@").length == 1 &&
                        chars.filter((c: any) => c == ".").length >= 1
                      )
                    ) {
                      return "Invalid Email";
                    }
                  },
                }
          }
          value={""}
        />
        <Box className="pb-4"></Box>
        {/* <MyText>Password</MyText>
        <MyText size="sm">
          8 characters with min 1 digit, 1 lowercase, 1 uppercase and 1 special
          character
        </MyText>
        <MyControlledTextField
          name="password"
          displayName="Password"
          control={control}
          errors={errors}
          rules={
            submitting
              ? { required: false, pattern: null }
              : {
                  required: true,
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                }
          }
          value={""}
        />
        <Box className="pb-4"></Box> */}
        {userType == DEVELOPER_ROLE ? (
          <>
            <MyText>Tenant ID</MyText>
            <MyText size="md">{tenantId}</MyText>
            <Box className="pb-4"></Box>
          </>
        ) : (
          isDeveloper && (
            <>
              <MyText>Tenant ID</MyText>
              {loading ? (
                <CircularProgress size="25px" />
              ) : tenants == null || tenants.length == 0 ? (
                <MyText>No Tenant found</MyText>
              ) : (
                <MyControlledAutocomplete
                  value={tenants[0]}
                  displayName="Tenant ID"
                  name={"tenantId"}
                  control={control}
                  errors={errors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: true,
                        }
                  }
                  options={tenants}
                />
              )}
              <Box className="pb-4"></Box>
            </>
          )
        )}
        <MyText>Group</MyText>
        <MyControlledAutocomplete
          value={"Fintech Ops"}
          displayName="Group"
          name={"group"}
          control={control}
          errors={errors}
          rules={
            submitting
              ? { required: false }
              : {
                  required: true,
                }
          }
          options={userGroups}
          // customOnChange={(val: string) => {
          //   if (val == "Developers") {
          //     setIsDeveloper(true);
          //   } else {
          //     setIsDeveloper(false);
          //   }
          // }}
        />
        <Box className="pb-6"></Box>
        <Box className="w-fit pb-10">
          <MyBlueButton submitting={submitting} type="submit">
            Create user
          </MyBlueButton>
        </Box>
      </Box>
    </form>
  );
};

export default RequireRole(CreateUserPage, [ADMIN_ROLE, DEVELOPER_ROLE]);
