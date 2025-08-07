"use client";

import Box from "@mui/material/Box";
import Link from "next/link";
import MyBlueButton from "../../Button/MyBlueButton";

const CreateCounterparty = () => {
  return (
    <Box className="w-fit">
      <Link href={"counterparties/create"}>
        <MyBlueButton>Create Counterparty</MyBlueButton>
      </Link>
    </Box>
  );
};

export default CreateCounterparty;
