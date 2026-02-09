"use client";

import FeeIdView from "@/core/components/views/fees/FeeIdView";
import { useParams } from "next/navigation";

const FeePage = () => {
  const params = useParams();

  return (
    <div className="pt-6">
      <FeeIdView replaceTo={`/configuration/products/${params.id}/fees`} />
    </div>
  );
};

export default FeePage;
