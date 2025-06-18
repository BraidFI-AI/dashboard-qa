"use client";

import MyBlueButton from "@/core/components/Button/MyBlueButton";
import FeeTableView from "@/core/components/views/fees/FeeTableView";
import Box from "@mui/material/Box";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { feeSearch } from "@/redux/slices/FeeSlice";

const FeeTable = () => {
  const params = useParams();

  const fetchDataMemoized = useMemo(
    () =>
      feeSearch({
        search: {
          programId: params.id as string,
        },
        refresh: true,
      }),
    [params.id]
  );

  return (
    <Box className="flex flex-col h-full">
      <Box className="pb-4"></Box>
      <div style={{ height: "67vh" }}>
        <FeeTableView
          fetchData={fetchDataMemoized}
          pushTo={`/configuration/programs/${
            (params.id as string) || "0"
          }/fees`}
        />
      </div>
    </Box>
  );
};

export default FeeTable;
