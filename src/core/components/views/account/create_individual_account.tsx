"use client";

import { useAppDispatch } from "@/redux/store/store";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MyBlueButton from "../../Button/MyBlueButton";
import MyText from "../../Text/Text";
import MyControlledTextField from "../../TextField/MyControlledTextField";
import MyControlledAutocomplete from "../../Autocomplete/MyControlledAutocomplete";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { Individual } from "@/core/api/ApiTypes";
import {
  createIndividualAccount,
  setRefreshIndividual,
} from "@/redux/slices/IndividualSlice";

const CreateIndividualAccount = () => {
  const dispatch = useAppDispatch();

  const [submitting, setSubmitting] = useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
  } = useForm<{
    accountName: string;
    accountType: string;
    fundingAccountNumber: string;
  }>();
  const onSubmit: SubmitHandler<{
    accountName: string;
    accountType: string;
    fundingAccountNumber: string;
  }> = (data: {
    accountName: string;
    accountType: string;
    fundingAccountNumber: string;
  }) => {
    console.log("data:", data);
    if (typeof individual == "string") {
      return;
    }

    dispatch(
      createIndividualAccount({
        ...data,
        individualId: individual.id.toString(),
      })
    ).then((resp: any) => {
      if (typeof resp.payload == "string") {
        enqueueSnackbar(resp.payload, { variant: "error", persist: true });
      } else {
        enqueueSnackbar("Account created successfully", {
          variant: "success",
        });
        dispatch(setRefreshIndividual(true));
        setDrawerOpen(false);
      }
      setSubmitting(false);
    });
    setSubmitting(true);
  };

  const individual: "loading" | string | Individual = useSelector(
    (state: any) => state.individual.individual
  );

  return (
    typeof individual != "string" &&
    individual.status == "ACTIVE" && (
      <React.Fragment key="right">
        <Box className="w-auto">
          {!drawerOpen && (
            <div>
              <MyBlueButton onClick={toggleDrawer(true)}>
                Create Account
              </MyBlueButton>
            </div>
          )}
        </Box>
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          PaperProps={{
            className: "w-[400px]",
          }}
        >
          <Box className="flex flex-col px-4 pt-10 max-w-full">
            <div className="flex flex-row items-center">
              <div className="w-[5px] h-[40px] bg-[#12A7FF] mr-[10px]" />
              <MyText size="lg">Create Account</MyText>
            </div>
            <div className="w-[750px] flex flex-row justify-between pt-4">
              <div className="w-[350px]">
                <MyText size="lg">Create Account</MyText>
                <div className="pb-6" />
                <MyText>Account Name</MyText>
                <MyControlledTextField
                  name={"accountName"}
                  displayName={"Account Name"}
                  control={control}
                  errors={errors}
                  rules={{
                    required: true,
                  }}
                  value=""
                />
                <div className="pb-4" />
                <MyText>Account Type</MyText>
                <MyControlledAutocomplete
                  name={"accountType"}
                  displayName={"Account Type"}
                  control={control}
                  errors={errors}
                  rules={{
                    required: true,
                  }}
                  value="SAVING"
                  options={["SAVING", "CHECKING"]}
                />
                <div className="pb-4" />
                <MyText>Funding Account Number</MyText>
                <MyControlledTextField
                  name={"fundingAccountNumber"}
                  displayName={"Funding Account Number"}
                  control={control}
                  errors={errors}
                  rules={{
                    required: true,
                  }}
                  value=""
                />
                <div className="pb-8" />
                <div className="w-fit">
                  <MyBlueButton
                    submitting={submitting}
                    onClick={() => {
                      handleSubmit(onSubmit)();
                    }}
                  >
                    Create Account
                  </MyBlueButton>
                </div>
              </div>
            </div>
          </Box>
        </Drawer>
      </React.Fragment>
    )
  );
};

export default CreateIndividualAccount;
