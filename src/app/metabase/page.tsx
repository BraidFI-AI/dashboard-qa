"use client";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyText from "@/core/components/Text/Text";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import { setTitle } from "@/redux/slices/AppSlice";
import { useAppDispatch } from "@/redux/store/store";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form";

const MetabasePage = () => {
  const dispatch = useAppDispatch();

  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  const {
    formState: { errors: achErrors },
    control: control,
    handleSubmit,
    getValues,
  } = useForm<{
    url: string;
  }>();
  const onSubmit: SubmitHandler<{ url: string }> = (data: { url: string }) => {
    setIframeUrl(null);
    setIframeUrl(data.url);
  };

  useEffect(() => {
    dispatch(setTitle("Metabase Embedding"));
  }, [dispatch]);

  return (
    <>
      <div className="w-[500px] flex flex-row">
        <MyControlledTextField
          name="url"
          displayName="URL"
          control={control}
          errors={achErrors}
          rules={{}}
          value={getValues("url")}
        />
        <div className="w-4" />
        <div className="w-fit">
          <MyBlueButton onClick={handleSubmit(onSubmit)}>Submit</MyBlueButton>
        </div>
      </div>
      <div className="h-4" />
      {iframeUrl != null && (
        <iframe src={iframeUrl} width={800} height={600} allowTransparency />
      )}
    </>
  );
};

export default MetabasePage;
