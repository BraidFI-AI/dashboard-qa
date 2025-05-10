"use client";

import { useParams } from "next/navigation";
import { useAppDispatch } from "@/redux/store/store";
import { useEffect } from "react";
import { setTitle } from "@/redux/slices/AppSlice";
import { fetchProgramV2 } from "@/redux/slices/ProgramSlice";
import LimitsTable from "@/app/compliance/limits/components/limits_table";

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

  return (
    <div style={{ height: "77vh" }}>
      <LimitsTable />
    </div>
  );
};

export default Rules;
