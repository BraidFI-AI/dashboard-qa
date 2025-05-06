"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { GridEventListener } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { Product } from "@/core/api/ApiTypes";
import CircularProgress from "@mui/material/CircularProgress";
import {
  fetchProducts,
  setRefreshProductsTable,
} from "@/redux/slices/ProductSlice";
import { useRouter } from "next/navigation";
import MyTable from "@/core/components/Table/MyTable";
import ErrorPage from "@/core/components/error_page";

const ProductsTable = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const products: "loading" | string | Product[] = useSelector(
    (state: any) => state.product.products
  );

  const refresh = useSelector(
    (state: any) => state.product.refreshProductsTable
  );

  useEffect(() => {
    dispatch(setRefreshProductsTable(true));
  }, []);

  useEffect(() => {
    if (refresh == true) {
      dispatch(fetchProducts()).then(() => {
        dispatch(setRefreshProductsTable(false));
      });
    }
  }, [dispatch, refresh]);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    router.push(`/configuration/products/${params.row.id}`);
  };

  console.log("asdasdsddssadds", products);

  return products == "loading" ? (
    <div className="flex flex-col items-center justify-center">
      <CircularProgress></CircularProgress>
      <div>Loading products...</div>
    </div>
  ) : products == null ? (
    <ErrorPage
      error="Error loading products"
      recoveryButtonOnClick={() => {
        dispatch(setRefreshProductsTable(true));
      }}
      recoveryButtonTitle="Retry"
    />
  ) : typeof products === "string" ? (
    <ErrorPage
      error={products}
      recoveryButtonOnClick={() => {
        dispatch(setRefreshProductsTable(true));
      }}
      recoveryButtonTitle="Retry"
    />
  ) : (
    <MyTable
      handleRowClick={handleRowClick}
      columns={[
        { field: "id", headerName: "ID", minWidth: 80 },
        {
          field: "productName",
          headerName: "Product Name",
          flex: 1,
          minWidth: 120,
        },
        {
          field: "programId",
          headerName: "Program ID",
          flex: 1,
          minWidth: 120,
        },
        { field: "tenantId", headerName: "Tenant ID", flex: 1, minWidth: 120 },
        {
          field: "operatingModel",
          headerName: "Operating Model",
          flex: 1,
          minWidth: 120,
        },
        {
          field: "isActive",
          headerName: "Active",
          flex: 1,
          minWidth: 120,
          valueFormatter: (params: any) => {
            if (params == null) {
              return "";
            }
            return (
              params.toString()[0].toUpperCase()[0] + params.toString().slice(1)
            );
          },
        },
      ]}
      rows={products}
    />
  );
};

export default ProductsTable;
