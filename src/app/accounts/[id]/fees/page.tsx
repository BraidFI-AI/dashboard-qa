"use client";

import MyBlueButton from "@/core/components/Button/MyBlueButton";
import FeeTableView from "@/core/components/views/fees/FeeTableView";
import Box from "@mui/material/Box";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import OneTimeFeeModal from "./one_time_fee_modal";
import { useAppDispatch } from "@/redux/store/store";
import { setTitle } from "@/redux/slices/AppSlice";
import { fetchAccount } from "@/redux/slices/AccountSlice";
import { feeSearch } from "@/redux/slices/FeeSlice";

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
    () =>
      feeSearch({
        search: {
          accountNumber: params.id as string,
        },
        refresh: true,
      }),
    [params.id]
  );

  return (
    <Box className="flex flex-col h-full pt-6">
      {feeModal == true && (
        <OneTimeFeeModal
          isOpen={feeModal}
          setIsOpen={setFeeModal}
          accountId={(params.id as string) || "0"}
        />
      )}
      <Box className="flex flex-row">
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
