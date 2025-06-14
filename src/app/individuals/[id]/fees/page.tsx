"use client";

import MyBlueButton from "@/core/components/Button/MyBlueButton";
import FeeTableView from "@/core/components/views/fees/FeeTableView";
import { fetchFeesByMultipleAccountIds } from "@/redux/slices/FeeSlice";
import { useAppDispatch } from "@/redux/store/store";
import Box from "@mui/material/Box";
import Link from "next/link";
import { useParams } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useMemo, useState } from "react";
import ErrorPage from "@/core/components/error_page";
import {
  fetchIndividual,
  fetchAllIndividualAccounts,
} from "@/redux/slices/IndividualSlice";
import { setTitle } from "@/redux/slices/AppSlice";

const FeeTable = () => {
  const params = useParams();

  const dispatch = useAppDispatch();

  const [accIds, setAccIds] = useState<"loading" | string | string[]>(
    "loading"
  );

  useEffect(() => {
    dispatch(setTitle("Individual Customer"));
    dispatch(fetchIndividual(parseInt((params.id as string) || "0"))).then(
      (data: any) => {
        if (data.payload != null) {
          dispatch(
            setTitle(data.payload.firstName + " " + data.payload.lastName)
          );
        }
      }
    );
  }, [dispatch, params.id]);

  useEffect(() => {
    setAccIds("loading");
    dispatch(fetchAllIndividualAccounts((params.id as string) || "0")).then(
      (acc: any) => {
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
      }
    );
  }, [dispatch, params.id]);

  const fetchDataMemoized = useMemo(
    () =>
      fetchFeesByMultipleAccountIds(typeof accIds != "string" ? accIds : []),
    [accIds]
  );

  return (
    <Box className="flex flex-col">
      <Box className="pb-4"></Box>
      {accIds == "loading" ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading...</div>
        </div>
      ) : accIds == null ? (
        <ErrorPage
          error="Error fetching fees"
          recoveryButtonOnClick={() => {
            setAccIds("loading");
            dispatch(
              fetchAllIndividualAccounts((params.id as string) || "0")
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
          }}
          recoveryButtonTitle="Retry"
        />
      ) : (
        <div>
          <FeeTableView
            fetchData={fetchDataMemoized}
            pushTo={`/individuals/${params.id}/fees`}
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
