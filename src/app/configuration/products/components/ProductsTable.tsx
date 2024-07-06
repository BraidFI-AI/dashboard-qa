"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { GridEventListener, GridValueFormatterParams } from "@mui/x-data-grid";
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
  const [loading, setLoading] = useState(true);
  const products: Product[] | null = useSelector(
    (state: any) => state.product.products
  );

  const refresh = useSelector(
    (state: any) => state.product.refreshProductsTable
  );

  useEffect(() => {
    if (refresh == true) {
      setLoading(true);
      dispatch(fetchProducts()).then(() => {
        setLoading(false);
        dispatch(setRefreshProductsTable(false));
      });
    }
  }, [dispatch, refresh]);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    router.push(`/configuration/products/${params.row.id}`);
  };

  return loading ? (
    <div className="flex flex-col items-center justify-center">
      <CircularProgress></CircularProgress>
      <div>Loading products...</div>
    </div>
  ) : products == null ? (
    <ErrorPage
      error="Error loading products"
      recoveryButtonOnClick={() => {
        setLoading(true);
        dispatch(fetchProducts()).then(() => {
          setLoading(false);
        });
      }}
      recoveryButtonTitle="Retry"
    />
  ) : (
    <MyTable
      handleRowClick={handleRowClick}
      columns={[
        { field: "id", headerName: "ID", minWidth: 80 },
        { field: "productId", headerName: "Product ID", minWidth: 80 },
        {
          field: "productName",
          headerName: "Product Name",
          flex: 1,
          minWidth: 100,
          maxWidth: 160,
        },
        {
          field: "accountingCurrency",
          headerName: "Accounting Currency",
          width: 160,
        },
        { field: "programId", headerName: "Program ID", width: 120 },
        { field: "tenantId", headerName: "Tenant ID", minWidth: 120 },
        {
          field: "type",
          headerName: "Type",
          width: 120,
        },
        {
          field: "isActive",
          headerName: "Active",
          width: 120,
          valueFormatter: (params: GridValueFormatterParams<any>) => {
            if (params.value == null) {
              return "";
            }
            return (
              params.value.toString()[0].toUpperCase()[0] +
              params.value.toString().slice(1)
            );
          },
        },
      ]}
      rows={products}
    />
  );
};

export default ProductsTable;
