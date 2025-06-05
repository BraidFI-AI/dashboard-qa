"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CounterPartyView from "@/core/components/views/counterparty/counterparty_view";

const CounterPartyPage = () => {
  const params = useParams();

  return <CounterPartyView id={(params.counterpartyId as string) || "0"} />;
};

export default CounterPartyPage;
