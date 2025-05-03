"use client";

import CreateFeeView from "@/core/components/views/fees/CreateFeeView";
import { useParams } from "next/navigation";

const CreateFee = () => {
  const params = useParams();
  return (
    <CreateFeeView
      ids={[params.id.toString()]}
      replaceTo={`/configuration/programs/${params.id}/fees`}
      level="Program"
    />
  );
};

export default CreateFee;
