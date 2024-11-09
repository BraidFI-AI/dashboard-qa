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
import { fetchProgramLimits } from "@/redux/slices/RulesAndLimitsSlice";
import { setTitle } from "@/redux/slices/AppSlice";
import { fetchProgramV2 } from "@/redux/slices/ProgramSlice";

const Rules = () => {
  const dispatch = useAppDispatch();
  const params = useParams();

  useEffect(() => {
    dispatch(setTitle("Program Limits"));
    dispatch(fetchProgramV2(parseInt(params.id.toString()))).then(
      (data: any) => {
        if (typeof data.payload != "string") {
          dispatch(setTitle(data.payload.name));
        }
      }
    );
  });

  const fetchDataMemoized = useMemo(
    () => fetchProgramLimits(params.id.toString()),
    [params.id]
  );

  return (
    <Box className="flex flex-col h-full">
      <Box className="w-fit">
        <Link href={`/configuration/programs/${params.id}/limits/create`}>
          <MyBlueButton>Add Limit</MyBlueButton>
        </Link>
      </Box>
      <Box className="pb-4"></Box>
      <div style={{ height: "67vh" }}>
        <RulesTableView
          fetchData={fetchDataMemoized}
          pushTo={`/configuration/programs/${params.id}/limits`}
        />
      </div>
    </Box>
  );
};

export default Rules;
