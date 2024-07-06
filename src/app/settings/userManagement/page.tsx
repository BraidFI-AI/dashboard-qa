"use client";

import Box from "@mui/material/Box";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import Link from "next/link";
import UsersTable from "./UsersTable";

const UserManagement = () => {
  return (
    <Box className="flex flex-col h-full">
      <Box className="w-40">
        <Link href={"/settings/userManagement/create"}>
          <MyBlueButton>Create User</MyBlueButton>
        </Link>
      </Box>
      <Box className="pb-4"></Box>
      <UsersTable></UsersTable>
    </Box>
  );
};

export default UserManagement;
