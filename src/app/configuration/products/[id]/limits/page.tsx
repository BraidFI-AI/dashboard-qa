"use client";

import RulesTableView from "@/core/components/views/rules/RulesTable";
import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import Link from "next/link";
import { fetchLimits } from "@/redux/slices/RulesAndLimitsSlice";
import { useMemo } from "react";

const Rules = () => {
  const params = useParams();

  const fetchDataMemoized = useMemo(
    () => fetchLimits({ productId: params.id.toString() }),
    [params.id]
  );

  return (
    <Box className="flex flex-col h-full">
      <Box className="w-fit">
        <Link href={`/configuration/products/${params.id}/limits/create`}>
          <MyBlueButton>Create limit</MyBlueButton>
        </Link>
      </Box>
      <Box className="pb-4"></Box>
      <div style={{ height: "67vh" }}>
        <RulesTableView
          fetchData={fetchDataMemoized}
          pushTo={`/configuration/products/${params.id}/limits`}
        />
      </div>
    </Box>
  );
};

export default Rules;
