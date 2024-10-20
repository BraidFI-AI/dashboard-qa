"use client";

import { useState } from "react";
import MyBlueButton from "../../Button/MyBlueButton";
import { useAppDispatch } from "@/redux/store/store";
import {
  fetchWireReturnFiles,
  runReturnSettlement,
} from "@/redux/slices/wire_settlement_slice";
import { enqueueSnackbar } from "notistack";

const WireRunReturnSettlementButton = () => {
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState<boolean>(false);

  return (
    <MyBlueButton
      submitting={submitting}
      onClick={() => {
        setSubmitting(true);

        dispatch(runReturnSettlement()).then((resp: any) => {
          setSubmitting(false);
          if (typeof resp.payload != "string") {
            enqueueSnackbar("Return Settlement Ran", {
              variant: "success",
              persist: false,
            });

            dispatch(fetchWireReturnFiles({ refresh: true }));
          }
        });
      }}
    >
      Run Return Settlement
    </MyBlueButton>
  );
};

export default WireRunReturnSettlementButton;
