"use client";

import Box from "@mui/material/Box";
import AccountsTable from "./components/AccountsTable";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import { SubmitHandler, useForm } from "react-hook-form";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyText from "@/core/components/Text/Text";
import { useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { fetchAccounts, searchAccount } from "@/redux/slices/AccountSlice";

const Accounts = () => {
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);
  const {
    formState: { errors: achErrors },
    control: control,
    handleSubmit,
    getValues,
  } = useForm<{
    accountNumber: string;
  }>();
  const onSubmit: SubmitHandler<{ accountNumber: string }> = (data: {
    accountNumber: string;
  }) => {
    setSubmitting(true);
    if (data.accountNumber == null || data.accountNumber.trim() == "") {
      dispatch(fetchAccounts(true)).then(() => {
        setSubmitting(false);
      });
    } else {
      dispatch(searchAccount(data.accountNumber.trim())).then(() => {
        setSubmitting(false);
      });
    }
  };

  return (
    <Box className="flex flex-col h-full">
      <div className="pb-4">
        <MyText>Account Number</MyText>
        <div className="flex flex-row">
          <div className="w-[320px]">
            <MyControlledTextField
              name="accountNumber"
              displayName="Account Number"
              control={control}
              errors={achErrors}
              rules={{}}
              value={getValues("accountNumber")}
            />
          </div>
          <div className="pr-2" />
          <div className="w-[32px]">
            <MyBlueButton
              onClick={handleSubmit(onSubmit)}
              submitting={submitting}
            >
              Search
            </MyBlueButton>
          </div>
        </div>
      </div>
      <AccountsTable></AccountsTable>
    </Box>
  );
};

export default Accounts;
