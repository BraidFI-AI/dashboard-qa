"use client";

import { Alert, Transaction } from "@/core/api/ApiTypes";
import MyText from "@/core/components/Text/Text";
import TransactionTableView from "@/core/components/views/transactions/transactions_table_view";
import { boxStyle } from "@/core/constants";

type EntityTypeTransactionComponentProps = {
  alert: Alert;
  context: Transaction[];
};

const EntityTypeTransactionComponent: React.FC<
  EntityTypeTransactionComponentProps
> = ({ alert, context }) => {
  return (
    <div
      className={`flex flex-col min-w-[700px] h-full rounded-[10px] justify-center items-start ${boxStyle}`}
    >
      <div className="pb-6 w-full px-6">
        <div className="pt-6 pb-3">
          <MyText variant="label" size="lg" weight="semibold">
            {alert.contextId}
          </MyText>
        </div>
        <div className="h-[350px] w-full">
          <TransactionTableView transactions={context} />
        </div>
      </div>
    </div>
  );
};

export default EntityTypeTransactionComponent;
