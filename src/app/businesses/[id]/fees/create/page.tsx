"use client";

import CreateFeeView from "@/core/components/views/fees/CreateFeeView";
import { fetchBusinessAccounts } from "@/redux/slices/BusinessSlice";
import { useAppDispatch } from "@/redux/store/store";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const CreateFee = () => {
  const params = useParams();

  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);
  const [accIds, setAccIds] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchBusinessAccounts(parseInt(params.id.toString()))).then(
      (acc: any) => {
        let ids: string[] = [];
        if (acc.payload) {
          acc.payload.forEach((acc: any) => {
            ids.push(acc.accountNumber);
          });
        }
        console.log(ids);
        setAccIds(ids);
        setLoading(false);
      }
    );
  }, [dispatch, params.id]);

  return loading ? (
    <div className="flex flex-col items-center justify-center pt-10">
      <CircularProgress></CircularProgress>
      <div>Loading</div>
    </div>
  ) : (
    <CreateFeeView ids={accIds} replaceTo={``} level="Account" />
  );
};

export default CreateFee;
