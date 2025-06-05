"use client";

import MyBlueButton from "@/core/components/Button/MyBlueButton";
import FeeTableView from "@/core/components/views/fees/FeeTableView";
import { fetchFeesByAccountId } from "@/redux/slices/FeeSlice";
import Box from "@mui/material/Box";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import OneTimeFeeModal from "./one_time_fee_modal";
import { useAppDispatch } from "@/redux/store/store";
import { setTitle } from "@/redux/slices/AppSlice";
import { fetchAccount } from "@/redux/slices/AccountSlice";

const FeeTable = () => {
  const params = useParams();

  const dispatch = useAppDispatch();

  const [feeModal, setFeeModal] = useState(false);

  useEffect(() => {
    dispatch(setTitle("Account"));
    dispatch(fetchAccount((params.id as string) || "0")).then(
      (account: any) => {
        if (
          typeof account.payload != "string" &&
          account.payload.accountName != null
        ) {
          dispatch(setTitle(account.payload.accountName));
        }
      }
    );
  }, []);

  const fetchDataMemoized = useMemo(
    () => fetchFeesByAccountId((params.id as string) || "0"),
    [params.id]
  );

  return (
    <Box className="flex flex-col h-full">
      {feeModal == true && (
        <OneTimeFeeModal
          isOpen={feeModal}
          setIsOpen={setFeeModal}
          accountId={(params.id as string) || "0"}
        />
      )}
      <Box className="flex flex-row">
        <Box className="w-fit pr-4">
          <Link href={`/accounts/${params.id}/fees/create`}>
            <MyBlueButton>Add Fee</MyBlueButton>
          </Link>
        </Box>
        <Box>
          <MyBlueButton
            onClick={() => {
              setFeeModal(true);
            }}
          >
            Charge one-time fee
          </MyBlueButton>
        </Box>
      </Box>
      <Box className="pb-4"></Box>
      <div style={{ height: "67vh" }}>
        <FeeTableView
          fetchData={fetchDataMemoized}
          pushTo={`/accounts/${params.id}/fees`}
        />
      </div>
    </Box>
  );
};

export default FeeTable;
