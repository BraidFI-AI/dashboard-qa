"use client";

import { useEffect } from "react";
import NocTable from "./noc_table";
import { setTitle } from "@/redux/slices/AppSlice";

const NocPage = () => {
  useEffect(() => {
    setTitle("NOC");
  }, []);
  return <NocTable />;
};

export default NocPage;
