"use client";

import Box from "@mui/material/Box";
import DevelopersTable from "./DevelopersTable";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import Link from "next/link";
import RequireRole from "@/core/components/RequireRole";
import { DEVELOPER_ROUTE } from "@/core/constants";

const Developers = () => {
  return (
    <Box className="flex flex-col h-full">
      <Box className="w-40">
        <Link href={"/configuration/developers/create"}>
          <MyBlueButton>Create Developer</MyBlueButton>
        </Link>
      </Box>
      <Box className="pb-4"></Box>
      <DevelopersTable></DevelopersTable>
    </Box>
  );
};

export default RequireRole(Developers, DEVELOPER_ROUTE);
