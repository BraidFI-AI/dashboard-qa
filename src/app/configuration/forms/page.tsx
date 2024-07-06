"use client";

import Box from "@mui/material/Box";
import FormsTable from "./components/FormsTable";
import Link from "next/link";
import MyBlueButton from "@/core/components/Button/MyBlueButton";

const CustomizableForm = () => {
  return (
    <Box className="flex flex-col h-full">
      <Box className="w-40">
        <Link href={"/configuration/forms/create"}>
          <MyBlueButton>Create Form</MyBlueButton>
        </Link>
      </Box>
      <Box className="pb-4"></Box>
      <FormsTable></FormsTable>
    </Box>
  );
};

export default CustomizableForm;
