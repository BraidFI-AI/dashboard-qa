"use client";

import CounterPartyView from "@/core/components/views/counterparty/counterparty_view";
import { useParams } from "next/navigation";

const ProductDetails = () => {
  const params = useParams();

  return <CounterPartyView id={(params.counterpartyId as string) || "0"} />;
};

export default ProductDetails;
