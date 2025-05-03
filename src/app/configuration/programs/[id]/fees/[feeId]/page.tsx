"use client";

import FeeIdView from "@/core/components/views/fees/FeeIdView";
import { useParams } from "next/navigation";

const FeePage = () => {
  const params = useParams();

  return <FeeIdView replaceTo={`/configuration/programs/${params.id}/fees`} />;
};

export default FeePage;
