"use client";

import Box from "@mui/material/Box";
import ProductsTable from "./components/ProductsTable";
import Link from "next/link";
import MyBlueButton from "@/core/components/Button/MyBlueButton";

const Products = () => {
  return (
    <Box className="flex flex-col h-full">
      <ProductsTable></ProductsTable>
    </Box>
  );
};

export default Products;
