"use client";

import Box from "@mui/material/Box";
import AccountsTable from "./components/AccountsTable";

const Accounts = () => {
  return (
    <Box className="flex flex-col h-full">
      <AccountsTable></AccountsTable>
    </Box>
  );
};

export default Accounts;
