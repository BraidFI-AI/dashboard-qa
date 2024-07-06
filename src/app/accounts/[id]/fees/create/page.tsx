"use client";

import CreateFeeView from "@/core/components/views/fees/CreateFeeView";
import { useParams } from "next/navigation";

const CreateFee = () => {
  const params = useParams();
  return (
    <CreateFeeView
      ids={[params.id.toString()]}
      replaceTo={`/accounts/${params.id}/fees`}
      level="Account"
    />
  );
};

export default CreateFee;
