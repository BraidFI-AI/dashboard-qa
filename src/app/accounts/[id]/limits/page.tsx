"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { fetchAccount } from "@/redux/slices/AccountSlice";
import { setTitle } from "@/redux/slices/AppSlice";
import LimitsTable from "@/app/compliance/limits/components/limits_table";

const Rules = () => {
  const params = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setTitle("Account"));
    dispatch(fetchAccount((params.id as string) || "0")).then((d: any) => {
      if (d.payload.accountName != null) {
        dispatch(setTitle(d.payload.accountName));
      }
    });
  }, [dispatch, params.id]);

  return (
    <div style={{ height: "77vh" }}>
      <LimitsTable />
    </div>
  );
};

export default Rules;
