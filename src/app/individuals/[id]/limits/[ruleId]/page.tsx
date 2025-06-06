"use client";

import RulesIdView from "@/core/components/views/rules/RulesIdView";
import { useParams } from "next/navigation";

const RulesPage = () => {
  const params = useParams();
  return <RulesIdView id={(params.ruleId as string) || "0"} />;
};

export default RulesPage;
