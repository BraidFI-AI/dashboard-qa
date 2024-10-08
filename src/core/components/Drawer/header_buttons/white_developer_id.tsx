"use client";

import { useAppDispatch } from "@/redux/store/store";
import MyBlueButton from "../../Button/MyBlueButton";
import { useEffect, useState } from "react";
import MyModal from "../../my_modal";
import MyText from "../../Text/Text";
import MyControlledTextField from "../../TextField/MyControlledTextField";
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { addCaseNote } from "@/redux/slices/cases_slice";
import { Case } from "@/core/api/ApiTypes";
import { useSelector } from "react-redux";
import React from "react";
import {
  fetchDeveloperWhitelistedIPs,
  whitelistDeveloperIP,
} from "@/redux/slices/DeveloperSlice";

const WhitelistDeveloperID = () => {
  const params = useParams();

  const dispatch = useAppDispatch();

  const [modalOpen, setModalOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
  } = useForm<{ ipAddress: string }>();
  const onSubmit: SubmitHandler<{ ipAddress: string }> = (data: {
    ipAddress: string;
  }) => {
    console.log("data:", data);
    setSubmitting(true);
    dispatch(
      whitelistDeveloperIP({ id: params.id?.toString(), ip: data.ipAddress })
    ).then((ip: any) => {
      if (typeof ip.payload == "string") {
        enqueueSnackbar(ip.payload, { variant: "error", persist: true });
      } else {
        enqueueSnackbar("IP whitelisted", { variant: "success" });
        dispatch(
          fetchDeveloperWhitelistedIPs({
            id: params.id.toString(),
            refresh: true,
          })
        );
        handleModalClose();
      }
      setSubmitting(false);
    });
  };

  return (
    <>
      <div className="w-fit">
        <MyBlueButton
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Whitelist IP
        </MyBlueButton>
      </div>
      <MyModal
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
        height="270px"
      >
        <MyText size="lg">Whitelist IP</MyText>
        <div className="pb-6" />
        <MyText>IP Address</MyText>
        <MyControlledTextField
          name={"ipAddress"}
          displayName={"IP Address"}
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
            Whitelist IP
          </MyBlueButton>
        </div>
        <div className="pb-6" />
      </MyModal>
    </>
  );
};

export default WhitelistDeveloperID;
