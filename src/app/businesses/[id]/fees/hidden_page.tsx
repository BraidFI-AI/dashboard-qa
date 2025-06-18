"use client";

import MyBlueButton from "@/core/components/Button/MyBlueButton";
import FeeTableView from "@/core/components/views/fees/FeeTableView";
import {
  fetchBusiness,
  fetchAllBusinessAccounts,
} from "@/redux/slices/BusinessSlice";
import { useAppDispatch } from "@/redux/store/store";
import Box from "@mui/material/Box";
import Link from "next/link";
import { useParams } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useMemo, useState } from "react";
import ErrorPage from "@/core/components/error_page";
import { setTitle } from "@/redux/slices/AppSlice";

const FeeTable = () => {
  const params = useParams();

  const dispatch = useAppDispatch();

  const [accIds, setAccIds] = useState<"loading" | string | string[]>(
    "loading"
  );

  useEffect(() => {
    dispatch(setTitle("Business Customer"));
    dispatch(fetchBusiness(parseInt((params.id as string) || "0"))).then(
      (data: any) => {
        if (data.payload != null) {
          dispatch(setTitle(data.payload.name));
        }
      }
    );
  });

  useEffect(() => {
    setAccIds("loading");
    dispatch(
      fetchAllBusinessAccounts(parseInt((params.id as string) || "0"))
    ).then((acc: any) => {
      let ids: string[] = [];
      if (typeof acc.payload != "string") {
        acc.payload.forEach((acc: any) => {
          ids.push(acc.accountNumber);
        });
        console.log("accids:", ids);
        setAccIds(ids);
      } else {
        setAccIds(acc.payload);
      }
    });
  }, [dispatch, params.id]);

  // const fetchDataMemoized = useMemo(
  //   () =>
  //     fetchFeesByMultipleAccountIds(typeof accIds != "string" ? accIds : []),
  //   [accIds]
  // );

  return (
    <Box className="flex flex-col">
      <Box className="pb-4"></Box>
      {accIds == "loading" ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading...</div>
        </div>
      ) : accIds == null || typeof accIds == "string" ? (
        <ErrorPage
          error="Error fetching fees"
          recoveryButtonOnClick={() => {
            setAccIds("loading");
            dispatch(
              fetchAllBusinessAccounts(parseInt((params.id as string) || "0"))
            ).then((acc: any) => {
              let ids: string[] = [];
              if (acc.payload) {
                acc.payload.forEach((acc: any) => {
                  ids.push(acc.accountNumber);
                });
                console.log(ids);
                setAccIds(ids);
              }
            });
          }}
          recoveryButtonTitle="Retry"
        />
      ) : (
        <div>
          <FeeTableView
            fetchData={() => {}}
            pushTo={`/businesses/${params.id}/fees`}
            extraColumn={[
              {
                field: "accountId",
                headerName: "Account",
                flex: 1,
                minWidth: 120,
                maxWidth: 220,
              },
            ]}
          />
        </div>
      )}
    </Box>
  );
};

export default FeeTable;
