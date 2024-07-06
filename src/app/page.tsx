"use client";

import ProductsChart from "./components/products_chart";
import TransactionsChart from "./components/transactions_chart";

export default function Home() {
  return (
    <>
      <div className="flex flex-col">
        <ProductsChart />
        <div className="h-8" />
        <TransactionsChart />
        <div className="h-24" />
      </div>
    </>
  );
}
