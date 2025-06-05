"use client";

import MyBlueButton from "@/core/components/Button/MyBlueButton";
import RulesTableView from "@/core/components/views/rules/RulesTable";
import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Link from "next/link";
import { useAppDispatch } from "@/redux/store/store";
import { useEffect, useMemo, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchBusiness } from "@/redux/slices/BusinessSlice";
import { fetchBusinessLimits } from "@/redux/slices/RulesAndLimitsSlice";
import { setTitle } from "@/redux/slices/AppSlice";
import LimitsTable from "@/app/compliance/limits/components/limits_table";

const Rules = () => {
  const dispatch = useAppDispatch();
  const params = useParams();

  useEffect(() => {
    dispatch(setTitle("Business Customer"));
    dispatch(fetchBusiness(parseInt((params.id as string) || "0"))).then(
      (data: any) => {
        if (data.payload != null) {
          dispatch(setTitle(data.payload.name));
        }
      }
    );
  }, [dispatch, params.id]);

  return (
    <div style={{ height: "77vh" }}>
      <LimitsTable />
    </div>
  );
};

export default Rules;
