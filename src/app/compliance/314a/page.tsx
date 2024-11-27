"use client";

import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyText from "@/core/components/Text/Text";
import { fetch314aData, upload314aFile } from "@/redux/slices/314a_slice";
import { useAppDispatch } from "@/redux/store/store";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import Compliance314aTable from "./314a_table";
import { setTitle } from "@/redux/slices/AppSlice";

const Compliance314aPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setTitle("314A"));
    dispatch(fetch314aData(true));
  }, []);

  return <Compliance314aTable />;
};

export default Compliance314aPage;
