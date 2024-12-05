"use client";

import { Case } from "@/core/api/ApiTypes";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import ItemRowHorizontal from "@/core/components/Text/ItemRowHorizontal";
import MyText from "@/core/components/Text/Text";
import { boxStyle } from "@/core/constants";
import { enumTextToReadableText } from "@/core/utils/formatting_util";

type CaseDetailsComponentProps = {
  c: Case;
};

const CaseDetailsComponent: React.FC<CaseDetailsComponentProps> = ({ c }) => {
  return (
    <div
      className={`flex flex-col min-w-[700px] h-[200px] rounded-[10px] justify-center items-start ${boxStyle}`}
    >
      <div className="pt-6 pb-2 px-6">
        <MyText variant="label" size="lg" weight="semibold">
          Details
        </MyText>
      </div>
      <div className="w-full pt-2 px-6 flex flex-row justify-start">
        <div className="flex flex-col justify-start w-[300px]">
          <ItemRowHorizontal title="Alert ID" value={c.id?.toString() ?? ""} />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Status"
            value={enumTextToReadableText(c.status?.toString() ?? "")}
          />
        </div>
        <div className="w-[80px]" />
        <div className="flex flex-col justify-start w-[300px]">
          <ItemRowHorizontal title="Name" value={c.name ?? ""} />
          <div className="h-3" />
          <ItemRowHorizontal title="Tenant ID" value={c.tenantId ?? ""} />
        </div>
      </div>
      <div className="h-3" />
      <div className="flex flex-col pb-6 px-6">
        <MyText size="sm" color="text-[#677990]">
          Description
        </MyText>
        <div className="break-all">
          <MyText size="sm">{c.description?.toString() ?? ""}</MyText>
        </div>
      </div>
    </div>
  );
};

export default CaseDetailsComponent;
