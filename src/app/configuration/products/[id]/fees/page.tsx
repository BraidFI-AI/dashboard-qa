"use client";

import MyBlueButton from "@/core/components/Button/MyBlueButton";
import FeeTableView from "@/core/components/views/fees/FeeTableView";
import { fetchFeesByProductId } from "@/redux/slices/FeeSlice";
import Box from "@mui/material/Box";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const FeeTable = () => {
  const params = useParams();

  const fetchDataMemoized = useMemo(
    () => fetchFeesByProductId((params.id as string) || "0"),
    [params.id]
  );

  return (
    <Box className="flex flex-col h-full">
      <Box className="pb-4"></Box>
      <div style={{ height: "67vh" }}>
        <FeeTableView
          fetchData={fetchDataMemoized}
          pushTo={`/configuration/products/${params.id}/fees`}
        />
      </div>
    </Box>
  );
};

export default FeeTable;
