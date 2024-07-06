"use client";

import RulesIdView from "@/core/components/views/rules/RulesIdView";
import { useParams } from "next/navigation";

const RulesPage = () => {
  const params = useParams();
  return <RulesIdView id={params.ruleId.toString()} />;
};

export default RulesPage;
