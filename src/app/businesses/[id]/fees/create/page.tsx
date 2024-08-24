"use client";

import CreateFeeView from "@/core/components/views/fees/CreateFeeView";
import { fetchAllBusinessAccounts } from "@/redux/slices/BusinessSlice";
import { useAppDispatch } from "@/redux/store/store";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorPage from "@/core/components/error_page";

const CreateFee = () => {
  const params = useParams();

  const dispatch = useAppDispatch();

  const [accIds, setAccIds] = useState<"loading" | string | string[]>(
    "loading"
  );

  useEffect(() => {
    setAccIds("loading");
    dispatch(fetchAllBusinessAccounts(parseInt(params.id.toString()))).then(
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

  return accIds == "loading" ? (
    <div className="flex flex-col items-center justify-center pt-10">
      <CircularProgress></CircularProgress>
      <div>Loading</div>
    </div>
  ) : accIds == null || typeof accIds == "string" ? (
    <ErrorPage
      error="Error fetching fees"
      recoveryButtonOnClick={() => {
        setAccIds("loading");
        dispatch(fetchAllBusinessAccounts(parseInt(params.id.toString()))).then(
          (acc: any) => {
            let ids: string[] = [];
            if (typeof acc.payload != "string") {
              acc.payload.forEach((acc: any) => {
                ids.push(acc.accountNumber);
              });
              console.log(ids);
              setAccIds(ids);
            } else {
              setAccIds(acc.payload);
            }
          }
        );
      }}
      recoveryButtonTitle="Retry"
    />
  ) : (
    <CreateFeeView ids={accIds} replaceTo={``} level="Account" />
  );
};

export default CreateFee;
