"use client";

import Box from "@mui/material/Box";
import CardsTable from "./components/CardsTable";

const CardManagement = () => {
  return (
    <Box className="flex flex-col h-full">
      <CardsTable></CardsTable>
    </Box>
  );
};

export default CardManagement;
