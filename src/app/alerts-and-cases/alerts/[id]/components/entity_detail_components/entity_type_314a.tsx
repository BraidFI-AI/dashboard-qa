"use client";

import { Alert, Compliance314A, Counterparty } from "@/core/api/ApiTypes";
import ItemRowHorizontal from "@/core/components/Text/ItemRowHorizontal";
import MyText from "@/core/components/Text/Text";
import { boxStyle } from "@/core/constants";
import { enumTextToReadableText } from "@/core/utils/formatting_util";
import linkToCounterparty from "@/core/utils/link_to_counterparty";
import timestampToDate from "@/core/utils/timestampToDate";
import { fetchCounterParty } from "@/redux/slices/CounterpartySlice";
import { useAppDispatch } from "@/redux/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type EntityType314AComponentProps = {
  alert: Alert;
  context: Compliance314A;
};

const EntityType314AComponent: React.FC<EntityType314AComponentProps> = ({
  alert,
  context,
}) => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const [counterparty, setCounterparty] = useState<Counterparty | null>(null);

  const navigateToEntity = async (row: Compliance314A) => {
    if (row.transactionPaymentId) {
      router.push(
        `/transactions/transactionHistory?paymentId=${row.transactionPaymentId}`
      );
    }
    if (row.uboId) {
      router.push(`/individuals/${row.individualId}`);
    } else if (row.businessName) {
      router.push(`/businesses/${row.businessId}`);
    } else if (row.individualName) {
      router.push(`/individuals/${row.individualId}`);
    } else if (row.counterpartyName) {
      dispatch(fetchCounterParty(parseInt(row.counterpartyId ?? "0"))).then(
        (cp: any) => {
          if (cp.payload) {
            const link = linkToCounterparty(cp.payload);
            if (link) {
              router.push(link);
            }
          }
        }
      );
    }
  };

  useEffect(() => {
    if (context.counterpartyId) {
      dispatch(fetchCounterParty(parseInt(context.counterpartyId ?? 0))).then(
        (cp: any) => {
          setCounterparty(cp.payload);
        }
      );
    }
  }, [dispatch, alert.contextId]);

  return (
    <div
      className={`flex flex-col min-w-[700px] min-h-fit rounded-[10px] justify-center items-start ${boxStyle}`}
    >
      <div className="pb-4 w-full px-6">
        <div className="pt-6 pb-2">
          <MyText variant="label" size="lg" weight="semibold">
            {context.individualName ??
              context.businessName ??
              context.counterpartyName ??
              context.transactionPaymentId}
          </MyText>
        </div>
        <div className="py-2 flex flex-row justify-start w-full">
          <div className="w-[300px] flex flex-col justify-start">
            <ItemRowHorizontal
              title="ID"
              value={context.list314aId?.toString() ?? ""}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="Entity Type"
              value={
                context.uboId
                  ? "UBO"
                  : context.businessName
                  ? "Business"
                  : context.individualName
                  ? "Individual"
                  : context.counterpartyName
                  ? "Counterparty"
                  : context.transactionPaymentId
                  ? "Transaction"
                  : "Unknown"
              }
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="Updated"
              value={timestampToDate(context.updatedAt ?? 0)}
            />
            <div className="h-3" />
            <ItemRowHorizontal
              title="Updated By"
              value={context.updatedBy ?? ""}
            />
          </div>
          <div className="w-[80px]" />
          <div className="flex flex-col justify-start pr-10 w-[300px]">
            <ItemRowHorizontal
              title="Status"
              value={enumTextToReadableText(context.status?.toString() ?? "")}
            />
            <div className="h-3" />
            <div
              className="cursor-pointer"
              onClick={() => {
                navigateToEntity(context);
              }}
            >
              <div className="pointer-events-none">
                <div className="flex flex-row w-full justify-between">
                  <div className="pr-1">
                    <MyText size="sm" color="text-[#939DA6]">
                      Entity
                    </MyText>
                  </div>
                  <div className="break-all">
                    <MyText size="sm" primary underline>
                      {context.businessName ??
                        context.individualName ??
                        context.counterpartyName ??
                        context.transactionPaymentId ??
                        "Unknown"}
                    </MyText>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-3" />
            <ItemRowHorizontal
              title="Created"
              value={timestampToDate(context.updatedAt ?? 0)}
            />
          </div>
        </div>
        {context.rawResults && (
          <ItemRowHorizontal
            title="Raw Results"
            value={context.rawResults ?? ""}
          ></ItemRowHorizontal>
        )}
      </div>
    </div>
  );
};

export default EntityType314AComponent;
