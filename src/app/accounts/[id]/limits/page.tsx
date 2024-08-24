"use client";

import MyBlueButton from "@/core/components/Button/MyBlueButton";
import RulesTableView from "@/core/components/views/rules/RulesTable";
import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Link from "next/link";
import { fetchAccountLimits } from "@/redux/slices/RulesAndLimitsSlice";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { fetchAccount } from "@/redux/slices/AccountSlice";
import { Account } from "@/core/api/ApiTypes";
import ErrorPage from "@/core/components/error_page";
import { setTitle } from "@/redux/slices/AppSlice";

const Rules = () => {
  const params = useParams();

  const dispatch = useAppDispatch();

  const [account, setAccount] = useState<"initial" | string | Account>(
    "initial"
  );

  const fetchDataMemoized = useMemo(
    () => fetchAccountLimits(params.id.toString()),
    [params.id]
  );

  useEffect(() => {
    dispatch(setTitle("Account"));
    dispatch(fetchAccount(params.id.toString())).then((d: any) => {
      setAccount(d.payload);

      if (d.payload.accountName != null) {
        dispatch(setTitle(d.payload.accountName));
      }
    });
  }, [dispatch, params.id]);

  return (
    <Box className="flex flex-col h-full">
      <div className="flex flex-row justify-between">
        <Box className="w-fit">
          <Link href={`/accounts/${params.id}/limits/create`}>
            <MyBlueButton>Create limit</MyBlueButton>
          </Link>
        </Box>
        {account == "initial" ? (
          <></>
        ) : typeof account == "string" ? (
          <ErrorPage
            error={account}
            recoveryButtonOnClick={() => {
              setAccount("initial");
              dispatch(fetchAccount(params.id.toString())).then((d: any) => {
                setAccount(d.payload);
              });
            }}
            recoveryButtonTitle="Retry"
          />
        ) : (
          <Box className="w-fit">
            <Link href={`/configuration/products/${account.productId}/limits`}>
              <MyBlueButton>View Product Limits</MyBlueButton>
            </Link>
          </Box>
        )}
      </div>
      <Box className="pb-4"></Box>
      <div style={{ height: "67vh" }}>
        <RulesTableView
          fetchData={fetchDataMemoized}
          pushTo={`/accounts/${params.id}/limits`}
        />
      </div>
    </Box>
  );
};

export default Rules;
