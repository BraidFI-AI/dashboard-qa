"use client";

import { ApiKeyState, fetchApiKey } from "@/redux/slices/ApiKeySlice";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import MyText from "@/core/components/Text/Text";
import ItemRow from "@/core/components/Text/ItemRow";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { useAppDispatch } from "@/redux/store/store";
import { enqueueSnackbar } from "notistack";

const APIKeyPage = () => {
  const dispatch = useAppDispatch();
  const apiKeyState: ApiKeyState = useSelector((state: any) => state.apikey);

  return apiKeyState.loading ? (
    <div className="flex flex-col items-center justify-center pt-10">
      <CircularProgress></CircularProgress>
      <div>Loading data...</div>
    </div>
  ) : apiKeyState.error ? (
    <div className="w-full flex flex-col justify-center">
      <MyText>{apiKeyState.error}</MyText>
      <div className="pb-4"></div>
      <div className="w-[40px]">
        <MyBlueButton
          onClick={() => {
            dispatch(fetchApiKey());
          }}
        >
          Retry
        </MyBlueButton>
      </div>
    </div>
  ) : (
    <div>
      <ItemRow title="Api Key" value={apiKeyState.apikey ?? "No key found"} />
      <div className="pb-4"></div>
      <div className="w-[150px]">
        <MyBlueButton
          onClick={() => {
            navigator.clipboard.writeText(apiKeyState.apikey);
            enqueueSnackbar("Api key copied!", { variant: "success" });
          }}
        >
          Copy Key
        </MyBlueButton>
      </div>
    </div>
  );
};

export default APIKeyPage;
