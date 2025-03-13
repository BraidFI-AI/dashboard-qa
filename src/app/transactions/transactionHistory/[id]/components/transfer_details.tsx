"use client";

import { Transaction } from "@/core/api/ApiTypes";
import ItemRowHorizontal from "@/core/components/Text/ItemRowHorizontal";
import MyText from "@/core/components/Text/Text";
import { boxStyle } from "@/core/constants";

export default function TransferDetails({
  transaction,
}: {
  transaction: Transaction;
}) {
  return (transaction as any).transfer == null ? (
    <></>
  ) : (
    <div
      className={`flex flex-col min-w-[820px] min-h-fit rounded-[10px] justify-center items-start ${boxStyle}`}
    >
      <div className="pt-6 pb-2 px-6">
        <MyText variant="label" size="lg" weight="semibold">
          Transfer Details
        </MyText>
      </div>
      <div className="w-full pt-2 px-6 flex flex-row justify-start">
        <div className="flex flex-col justify-start min-w-[340px] w-full">
          {(transaction as any)?.transfer?.recipientAccountNumber ==
          undefined ? (
            <>
              <ItemRowHorizontal
                title="Sender Name"
                link={`${
                  (transaction as any).transfer?.senderCustomerType ==
                  "BUSINESS"
                    ? `/businesses/${
                        (transaction as any).transfer?.senderCustomerId
                      }`
                    : `/individuals/${
                        (transaction as any).transfer?.senderCustomerId
                      }`
                }`}
                value={(transaction as any).transfer?.senderCustomerName ?? ""}
              />
              <div className="h-3" />
            </>
          ) : (
            <>
              <ItemRowHorizontal
                title="Receiver Name"
                link={`${
                  (transaction as any).transfer?.recipientCustomerType ==
                  "BUSINESS"
                    ? `/businesses/${
                        (transaction as any).transfer?.recipientCustomerId
                      }`
                    : `/individuals/${
                        (transaction as any).transfer?.recipientCustomerId
                      }`
                }`}
                value={
                  (transaction as any).transfer?.recipientCustomerName ?? ""
                }
              />
              <div className="h-3" />
            </>
          )}
        </div>
        <div className="min-w-[60px]" />
        <div className="flex flex-col justify-start min-w-[340px] w-full">
          {(transaction as any)?.transfer?.recipientAccountNumber ==
          undefined ? (
            <>
              <ItemRowHorizontal
                title="Sender Account Number"
                link={`/accounts/${
                  (transaction as any).transfer?.senderAccountNumber
                }`}
                value={(transaction as any).transfer?.senderAccountNumber ?? ""}
              />
              <div className="h-3" />
            </>
          ) : (
            <>
              <ItemRowHorizontal
                title="Receiver Account Number"
                link={`/accounts/${
                  (transaction as any).transfer?.recipientAccountNumber
                }`}
                value={
                  (transaction as any).transfer?.recipientAccountNumber ?? ""
                }
              />
              <div className="h-3" />
            </>
          )}
          <div className="h-3" />
        </div>
      </div>
    </div>
  );
}
