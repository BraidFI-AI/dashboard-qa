"use client";

import RulesIdView from "@/core/components/views/rules/RulesIdView";
import { useParams } from "next/navigation";

const RulesPage = () => {
  const params = useParams();
  return (
    <div className="pt-6">
      <RulesIdView id={(params.ruleId as string) || "0"} />
    </div>
  );
};

export default RulesPage;
