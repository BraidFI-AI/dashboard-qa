"use client";

import { Alert, RulesAndLimits } from "@/core/api/ApiTypes";
import ItemRowHorizontal from "@/core/components/Text/ItemRowHorizontal";
import MyText from "@/core/components/Text/Text";
import { boxStyle } from "@/core/constants";
import { timestampToDate } from "@/core/utils/date_time_util";
import toDollarFormat from "@/core/utils/toDollarFormat";

type EntityTypeVelocityLimitComponentProps = {
  alert: Alert;
  context: RulesAndLimits;
};

const EntityTypeVelocityLimitComponent: React.FC<
  EntityTypeVelocityLimitComponentProps
> = ({ alert, context }) => {
  return (
    <div
      className={`flex flex-col min-w-[700px] min-h-fit rounded-[10px] justify-center items-start ${boxStyle}`}
    >
      <div className="pb-4 w-full px-6">
        <div className="pt-6 pb-2">
          <MyText variant="label" size="lg" weight="semibold">
            {context.limitName}
          </MyText>
        </div>
        <div className="py-2 flex flex-row justify-start w-full">
          <div className="w-[300px] flex flex-col justify-start">
            <ItemRowHorizontal
              title="Limit ID"
              value={context.id?.toString() ?? ""}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="Status"
              value={context.status?.toString() ?? ""}
            />
            <div className="h-3" />
            {context.programId && (
              <ItemRowHorizontal
                title="Program"
                value={context.programId?.toString() ?? ""}
              />
            )}
            {context.productId && (
              <ItemRowHorizontal
                title="Product"
                value={context.productId?.toString() ?? ""}
              />
            )}
            {context.accountNumber && (
              <ItemRowHorizontal
                title="Account"
                value={context.accountNumber?.toString() ?? ""}
              />
            )}
            {context.counterpartyId && (
              <ItemRowHorizontal
                title="Counterparty"
                value={context.counterpartyId?.toString() ?? ""}
              />
            )}
            <div className="h-3" />
            <ItemRowHorizontal
              title="Type"
              value={context.limitType?.toString() ?? ""}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="Duration (Days)"
              value={context.durationDays?.toString() ?? ""}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="Created"
              value={timestampToDate(context.createdAt ?? 0)}
            />
          </div>
          <div className="w-[80px]" />
          <div className="w-[300px] flex flex-col justify-start">
            <ItemRowHorizontal
              title="Name"
              value={context.limitName?.toString() ?? ""}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="Transaction type"
              value={context.transactionType?.toString() ?? ""}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="Updated"
              value={timestampToDate(context.updatedAt ?? 0)}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="Frequency"
              value={context.frequencyMax?.toString() ?? ""}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="Amount"
              value={toDollarFormat(context.amount?.toString() ?? "")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityTypeVelocityLimitComponent;
