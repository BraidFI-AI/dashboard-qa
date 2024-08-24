"use client";

import CreateFeeView from "@/core/components/views/fees/CreateFeeView";
import { useAppDispatch } from "@/redux/store/store";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchAllIndividualAccounts } from "@/redux/slices/IndividualSlice";
import ErrorPage from "@/core/components/error_page";

const CreateFee = () => {
  const params = useParams();

  const dispatch = useAppDispatch();

  const [accIds, setAccIds] = useState<"loading" | string | string[]>(
    "loading"
  );

  useEffect(() => {
    setAccIds("loading");
    dispatch(fetchAllIndividualAccounts(params.id.toString())).then(
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
  ) : typeof accIds == "string" ? (
    <ErrorPage
      error={accIds}
      recoveryButtonTitle="Retry"
      recoveryButtonOnClick={() => {
        setAccIds("loading");
        dispatch(fetchAllIndividualAccounts(params.id.toString())).then(
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
      }}
    />
  ) : (
    <CreateFeeView ids={accIds} replaceTo={``} level="Account" />
  );
};

export default CreateFee;
