"use client";

import CreateFeeView from "@/core/components/views/fees/CreateFeeView";
import { useParams } from "next/navigation";

const CreateFee = () => {
  const params = useParams();
  return (
    <CreateFeeView
      ids={[(params.id as string) || "0"]}
      replaceTo={`/accounts/${(params.id as string) || "0"}/fees`}
      level="Account"
    />
  );
};

export default CreateFee;
