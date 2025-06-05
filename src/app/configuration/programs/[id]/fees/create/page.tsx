"use client";

import CreateFeeView from "@/core/components/views/fees/CreateFeeView";
import { useParams } from "next/navigation";

const CreateFee = () => {
  const params = useParams();
  return (
    <CreateFeeView
      ids={[(params.id as string) || "0"]}
      replaceTo={`/configuration/programs/${(params.id as string) || "0"}/fees`}
      level="Program"
    />
  );
};

export default CreateFee;
