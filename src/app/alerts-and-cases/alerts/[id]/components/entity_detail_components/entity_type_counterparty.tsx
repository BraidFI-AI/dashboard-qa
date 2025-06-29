"use client";

import { Alert, Counterparty } from "@/core/api/ApiTypes";
import ItemRowHorizontal from "@/core/components/Text/ItemRowHorizontal";
import MyText from "@/core/components/Text/Text";
import CounterPartyView from "@/core/components/views/counterparty/counterparty_view";
import { boxStyle } from "@/core/constants";
import { timestampToDate } from "@/core/utils/date_time_util";
type EntityTypeCounterpartyComponentProps = {
  alert: Alert;
  context: Counterparty;
};

const EntityTypeCounterpartyComponent: React.FC<
  EntityTypeCounterpartyComponentProps
> = ({ alert, context }) => {
  return (
    <div
      className={`flex flex-col min-w-[700px] min-h-fit rounded-[10px] justify-start items-start ${boxStyle}`}
    >
      <div className="pt-6 px-6 pb-3">
        <MyText variant="label" size="lg" weight="semibold">
          {context.name}
        </MyText>
      </div>
      <div className="flex justify-start px-6">
        <CounterPartyView id={context.id?.toString() ?? "0"} editable={false} />
      </div>
    </div>
  );
};

export default EntityTypeCounterpartyComponent;
