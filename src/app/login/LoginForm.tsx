"use client";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { login } from "@/redux/slices/AuthSlice";
import Cookies from "js-cookie";
import { useAppDispatch } from "@/redux/store/store";
import BraidLogo from "@/core/svgs/BraidLogo";
import MyText from "@/core/components/Text/Text";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import { enqueueSnackbar } from "notistack";

const SignupForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<{
    email: string;
    password: string;
  }>();
  const onSubmit: SubmitHandler<{
    email: string;
    password: string;
  }> = (data: any) => {
    setSubmitting(true);
    dispatch(login(data)).then(() => {
      const tokenAvailable = Cookies.get("token");
      if (tokenAvailable) {
        router.replace("/");
      } else {
        setSubmitting(false);
        enqueueSnackbar("Invalid username or password", {
          variant: "error",
          autoHideDuration: 2000,
        });
      }
    });
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-row items-start">
          <BraidLogo />
          <div className="w-4"></div>
          <MyText variant="title">Braid</MyText>
        </div>
        <div className="h-6"></div>
        <MyText size="lg">Login</MyText>
        <div className="h-2"></div>
        <MyText>Email</MyText>
        <MyControlledTextField
          name="email"
          displayName="Email"
          control={control}
          errors={errors}
          rules={{
            required: true,
            // validate: (value: string, _: any) => {
            //   const chars = value.split("");
            //   if (
            //     !(
            //       chars.filter((c) => c == "@").length == 1 &&
            //       chars.filter((c) => c == ".").length >= 1
            //     )
            //   ) {
            //     return "Invalid Email";
            //   }
            // },
          }}
          value=""
        ></MyControlledTextField>
        <div className="h-6"></div>
        <MyText>Password</MyText>
        <div className="pb-1"></div>
        <FormControl fullWidth>
          <OutlinedInput
            {...register("password", {
              required: true,
            })}
            placeholder="Please provide passowrd of atleast length 8"
            type={showPassword ? "text" : "password"}
            fullWidth
            error={errors.password ? true : false}
            className="font-avenir-regular text-[15px] h-[42px] rounded-[5px] bg-white"
            inputProps={{
              className:
                "font-avenir-regular text-[15px] h-[5px] rounded-[5px] bg-white",
            }}
            endAdornment={
              <InputAdornment
                position="end"
                sx={{
                  height: "30px",
                  padding: 0,
                  margin: 0,
                  paddingLeft: 4,
                }}
              >
                <div className="border-s border-s-slate-300 absolute right-0 p-2 bg-white">
                  <IconButton
                    style={{
                      padding: 0,
                      margin: 0,
                    }}
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </div>
              </InputAdornment>
            }
          />
          <FormHelperText className="text-[#D32F2F]">
            {errors.password?.type === "required"
              ? "Password is required"
              : errors.password
              ? "Invalid Email"
              : ""}
          </FormHelperText>
        </FormControl>
        <div className="h-8"></div>
        {submitting ? (
          <div>
            <CircularProgress></CircularProgress>
          </div>
        ) : (
          <MyBlueButton type="submit">Login</MyBlueButton>
        )}
      </form>
    </div>
  );
};

export default SignupForm;
