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
  fetchIndividualAccounts,
} from "@/redux/slices/IndividualSlice";
import { setTitle } from "@/redux/slices/AppSlice";

const FeeTable = () => {
  const params = useParams();

  const dispatch = useAppDispatch();

  const [accIds, setAccIds] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(setTitle("Individual Customer"));
    dispatch(fetchIndividual(parseInt(params.id.toString()))).then(
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
    dispatch(fetchIndividualAccounts(parseInt(params.id.toString()))).then(
      (acc: any) => {
        let ids: string[] = [];
        if (acc.payload) {
          acc.payload.forEach((acc: any) => {
            ids.push(acc.accountNumber);
          });
          console.log(ids);
          setAccIds(ids);
        }
        setLoading(false);
      }
    );
  }, [dispatch, params.id]);

  const fetchDataMemoized = useMemo(
    () => fetchFeesByMultipleAccountIds(accIds ?? []),
    [accIds]
  );

  return (
    <Box className="flex flex-col">
      <Box className="w-fit">
        <Link href={`/individuals/${params.id}/fees/create`}>
          <MyBlueButton>Add Fee</MyBlueButton>
        </Link>
      </Box>
      <Box className="pb-4"></Box>
      {loading ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading...</div>
        </div>
      ) : accIds == null ? (
        <ErrorPage
          error="Error fetching fees"
          recoveryButtonOnClick={() => {
            setLoading(true);
            dispatch(
              fetchIndividualAccounts(parseInt(params.id.toString()))
            ).then((acc: any) => {
              let ids: string[] = [];
              if (acc.payload) {
                acc.payload.forEach((acc: any) => {
                  ids.push(acc.accountNumber);
                });
                console.log(ids);
                setAccIds(ids);
              }
              setLoading(false);
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
