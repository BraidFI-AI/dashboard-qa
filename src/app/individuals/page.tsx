"use client";

import Box from "@mui/material/Box";
import IndividualsTable from "./components/IndividualsTable";

const Individuals = () => {
  return (
    <Box className="flex flex-col h-full">
      <IndividualsTable></IndividualsTable>
    </Box>
  );
};

export default Individuals;
