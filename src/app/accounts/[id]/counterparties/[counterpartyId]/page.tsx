"use client";

import { useParams } from "next/navigation";
import CounterPartyView from "@/core/components/views/counterparty/counterparty_view";

const ProductDetails = () => {
  const params = useParams();

  return <CounterPartyView id={(params.counterpartyId as string) || "0"} />;
};

export default ProductDetails;
