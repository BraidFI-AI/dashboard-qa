"use client";

import { Transaction } from "@/core/api/ApiTypes";
import ItemRowHorizontal from "@/core/components/Text/ItemRowHorizontal";
import MyText from "@/core/components/Text/Text";
import { boxStyle } from "@/core/constants";
import { enumTextToReadableText } from "@/core/utils/formatting_util";
import { timestampToDate } from "@/core/utils/date_time_util";
import MyModal from "@/core/components/my_modal";
import { useState } from "react";
import { JSONTree } from "react-json-tree";
export default function AchDetails({
  transaction,
}: {
  transaction: Transaction;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return transaction.ach == null ? (
    <></>
  ) : (
    <div
      className={`flex flex-col min-w-[820px] min-h-fit rounded-[10px] justify-center items-start ${boxStyle}`}
    >
      <div className="pt-6 pb-2 px-6">
        <MyText variant="label" size="lg" weight="semibold">
          ACH Details
        </MyText>
      </div>
      <div className="w-full pt-2 px-6 flex flex-row justify-start">
        <div className="flex flex-col justify-start min-w-[340px] w-full">
          <ItemRowHorizontal
            title="Originator Name"
            value={(transaction as any).ach?.originatorName ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Originator ID"
            value={(transaction as any).ach?.originatorId ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Receiver Name"
            value={(transaction as any).ach?.receiverName ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Addenda"
            value={(transaction as any).ach?.addenda?.toString() ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Effective Date"
            value={(transaction as any).ach?.effectiveDate ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Sec Code"
            value={(transaction as any).ach?.secCode ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Service"
            value={(transaction as any).ach?.service ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="External ID"
            value={(transaction as any).ach?.externalId ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Trace Number"
            value={(transaction as any).ach?.traceNumber ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Corrected In File"
            value={(transaction as any).ach?.correctedInFile ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Linked ACH ID"
            value={(transaction as any).ach?.linkedAchId ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Returned At"
            value={timestampToDate(
              (transaction as any).ach?.returnedAt ?? "",
              false,
              true
            )}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="NOC Received At"
            value={timestampToDate(
              (transaction as any).ach?.nocReceivedAt ?? "",
              false,
              true
            )}
          />
          <div className="h-3" />
        </div>
        <div className="min-w-[60px]" />
        <div className="flex flex-col justify-start min-w-[340px] w-full">
          <ItemRowHorizontal
            title="ODFI"
            value={(transaction as any).ach?.odfi ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="RDFI"
            value={(transaction as any).ach?.rdfi ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Receiving Account"
            value={(transaction as any).ach?.receivingAccount ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Return Code"
            value={enumTextToReadableText(transaction?.ach?.returnCode ?? "")}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Return Reason"
            value={(transaction as any).ach?.returnReason ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Change Code"
            value={transaction.ach?.changeCode ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Change Reason"
            value={(transaction as any).ach?.changeReason ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Corrected Data"
            value={(transaction as any).ach?.correctedData ?? ""}
          />
          <div className="h-3" />
          {
            <>
              <div
                onClick={() =>
                  (transaction as any).ach?.iatAddenda != null
                    ? setModalOpen(true)
                    : null
                }
                className={
                  (transaction as any).ach?.iatAddenda != null
                    ? `cursor-pointer`
                    : ""
                }
              >
                <MyText
                  size="sm"
                  color="text-[#677990]"
                  primary={(transaction as any).ach?.iatAddenda != null}
                >
                  IAT Addenda
                </MyText>
              </div>
              <MyModal
                modalOpen={modalOpen}
                handleModalClose={handleModalClose}
                height="500px"
              >
                <MyText size="lg">IAT Addenda</MyText>
                <JSONTree
                  data={(transaction as any).ach?.iatAddenda ?? {}}
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
              </MyModal>
            </>
          }
          <div className="h-3" />
          <ItemRowHorizontal
            title="NOC Received At"
            value={timestampToDate(
              (transaction as any).ach?.nocReceivedAt ?? "",
              false,
              true
            )}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Account Type"
            value={(transaction as any).ach?.accountType ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Settlement Request By"
            value={(transaction as any).ach?.settlementRequestBy ?? ""}
          />
          <div className="h-3" />
        </div>
      </div>
    </div>
  );
}
