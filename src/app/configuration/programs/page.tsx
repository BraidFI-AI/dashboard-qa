"use client";

import Box from "@mui/material/Box";
import ProgramsTable from "./components/ProgramsTable";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import Link from "next/link";
import RequireRole from "@/core/components/RequireRole";
import { ADMIN_ROUTE } from "@/core/constants";

const Programs = () => {
  return (
    <Box className="flex flex-col h-full">
      <Box className="w-40">
        <Link href={"/configuration/programs/create"}>
          <MyBlueButton>Create Program</MyBlueButton>
        </Link>
      </Box>
      <Box className="pb-4"></Box>
      <ProgramsTable></ProgramsTable>
    </Box>
  );
};

export default RequireRole(Programs, ADMIN_ROUTE);
