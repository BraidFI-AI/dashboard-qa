"use client";

import Box from "@mui/material/Box";
import ProductsTable from "./components/ProductsTable";
import Link from "next/link";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { useEffect } from "react";
import { setTitle } from "@/redux/slices/AppSlice";
import { useAppDispatch } from "@/redux/store/store";

const Products = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setTitle("Products"));
  }, [dispatch]);
  return (
    <Box className="flex flex-col h-full">
      <ProductsTable></ProductsTable>
    </Box>
  );
};

export default Products;
