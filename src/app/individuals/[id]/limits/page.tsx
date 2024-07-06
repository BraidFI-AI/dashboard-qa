"use client";

import MyBlueButton from "@/core/components/Button/MyBlueButton";
import RulesTableView from "@/core/components/views/rules/RulesTable";
import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { fetchIndividualLimits } from "@/redux/slices/RulesAndLimitsSlice";
import { fetchIndividual } from "@/redux/slices/IndividualSlice";
import { useAppDispatch } from "@/redux/store/store";
import { setTitle } from "@/redux/slices/AppSlice";

const Rules = () => {
  const params = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setTitle("Individual Customer"));
    dispatch(fetchIndividual(parseInt(params.id.toString()))).then(
      (data: any) => {
        if (data.payload != null) {
          dispatch(
            setTitle(data.payload.firstName + " " + data.payload.lastName)
          );
        }
      }
    );
  }, [dispatch, params.id]);

  const fetchDataMemoized = useMemo(
    () => fetchIndividualLimits(params.id.toString()),
    [params.id]
  );

  return (
    <Box className="flex flex-col h-full">
      <Box className="w-fit">
        <Link href={`/individuals/${params.id}/limits/create`}>
          <MyBlueButton>Add Limit</MyBlueButton>
        </Link>
      </Box>
      <Box className="pb-4"></Box>
      <div style={{ height: "67vh" }}>
        <RulesTableView
          fetchData={fetchDataMemoized}
          pushTo={`/individuals/${params.id}/limits`}
        />
      </div>
    </Box>
  );
};

export default Rules;
