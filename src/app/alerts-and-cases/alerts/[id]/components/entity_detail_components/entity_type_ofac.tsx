"use client";

import { Alert, Counterparty, OFAC } from "@/core/api/ApiTypes";
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
import { JSONTree } from "react-json-tree";

type EntityTypeOFACComponentProps = {
  alert: Alert;
  context: OFAC;
};

const EntityTypeOFACComponent: React.FC<EntityTypeOFACComponentProps> = ({
  alert,
  context,
}) => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const [counterparty, setCounterparty] = useState<Counterparty | null>(null);

  const navigateToEntity = async (row: OFAC) => {
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
              title="OFAC ID"
              value={context.ofacId?.toString() ?? ""}
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
          <>
            <MyText size="sm" color="text-[#939DA6]">
              Results
            </MyText>
            <JSONTree
              data={JSON.parse(context.rawResults)}
              hideRoot
              theme={{
                base00: "#ffffff",
                base01: "#000000",
                base02: "#000000",
                base03: "#000000",
                base04: "#000000",
                base05: "#000000",
                base06: "#000000",
                base07: "#000000",
                base08: "#000000",
                base09: "#000000",
                base0A: "#000000",
                base0B: "#000000",
                base0C: "#000000",
                base0D: "#000000",
                base0E: "#000000",
                base0F: "#000000",
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default EntityTypeOFACComponent;
