"use client";

import { Alert, WireFireRecord } from "@/core/api/ApiTypes";
import ItemRowHorizontal from "@/core/components/Text/ItemRowHorizontal";
import MyText from "@/core/components/Text/Text";
import { boxStyle } from "@/core/constants";

type EntityTypeFileRecordComponentProps = {
  alert: Alert;
  context: WireFireRecord;
};

const EntityTypeFileRecordComponent: React.FC<
  EntityTypeFileRecordComponentProps
> = ({ alert, context }) => {
  return (
    <div
      className={`flex flex-col min-w-[700px] min-h-fit rounded-[10px] justify-center items-start ${boxStyle}`}
    >
      <div className="pb-4 w-full px-6">
        <div className="pt-6 pb-2">
          <MyText variant="label" size="lg" weight="semibold">
            {context.fileHandle ?? ""}
          </MyText>
        </div>
        <div className="py-2 flex flex-row justify-start w-full">
          <div className="w-1/2 flex flex-col justify-start">
            <ItemRowHorizontal
              title="File ID"
              value={context.fileId?.toString() ?? ""}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="Line Number"
              value={context.lineNumber?.toString() ?? ""}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="Import Status"
              value={context.importStatus ?? ""}
            />
            <div className="h-3" />
            <ItemRowHorizontal title="Tag 1510" value={context.tag1510 ?? ""} />
            <div className="h-3" />
            <ItemRowHorizontal title="Tag 1520" value={context.tag1520 ?? ""} />
            <div className="h-3" />
            <ItemRowHorizontal title="Tag 2000" value={context.tag2000 ?? ""} />
            <div className="h-3" />
            <ItemRowHorizontal title="Tag 3100" value={context.tag3100 ?? ""} />
            <div className="h-3" />
            <ItemRowHorizontal title="Tag 3400" value={context.tag3400 ?? ""} />
            <div className="h-3" />
            <ItemRowHorizontal title="Tag 4100" value={context.tag4100 ?? ""} />
            <div className="h-3" />
            <ItemRowHorizontal title="Tag 4200" value={context.tag4200 ?? ""} />
          </div>
          <div className="w-[80px]" />
          <div className="w-1/2 flex flex-col justify-start">
            <ItemRowHorizontal title="Text" value={context.text ?? ""} />
            <div className="h-3" />
            <MyText>Errors</MyText>
            <div className="h-1" />
            {context.errors.map((e, index) => (
              <ItemRowHorizontal
                key={index}
                title={e.level ?? ""}
                value={e.message ?? ""}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityTypeFileRecordComponent;
