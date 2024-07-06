"use client";

import Box from "@mui/material/Box";
import OFACHitsTable from "./OFACTable";
import { ADMIN_ROUTE, DEVELOPER_ROUTE } from "@/core/constants";
import RequireRole from "@/core/components/RequireRole";

const OFAC = () => {
  return (
    <Box className="flex flex-col h-full">
      <OFACHitsTable></OFACHitsTable>
    </Box>
  );
};

export default RequireRole(OFAC, DEVELOPER_ROUTE);
