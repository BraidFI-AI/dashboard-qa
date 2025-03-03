"use client";

import { Transaction } from "@/core/api/ApiTypes";
import ItemRowHorizontal from "@/core/components/Text/ItemRowHorizontal";
import MyLinkText from "@/core/components/Text/LinkText";
import MyText from "@/core/components/Text/Text";
import { boxStyle } from "@/core/constants";
import { enumTextToReadableText } from "@/core/utils/formatting_util";

export default function TransactionDetails({
  transaction,
}: {
  transaction: Transaction;
}) {
  return (
    <div
      className={`flex flex-col min-w-[820px] min-h-fit rounded-[10px] justify-center items-start ${boxStyle}`}
    >
      <div className="pt-6 pb-2 px-6">
        <MyText variant="label" size="lg" weight="semibold">
          Details
        </MyText>
      </div>
      <div className="w-full pt-2 px-6 flex flex-row justify-start">
        <div className="flex flex-col justify-start min-w-[380px]">
          <ItemRowHorizontal
            title="Transaction Type"
            value={enumTextToReadableText(transaction.transactionType ?? "")}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Processing Status"
            value={enumTextToReadableText(
              (transaction as any).processingStatus ?? ""
            )}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Payment ID"
            value={transaction.paymentId ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Linked Payment ID"
            link={`/transactions/transactionHistory/${
              (transaction as any).linkedPaymentId
            }`}
            value={(transaction as any).linkedPaymentId ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Is Inbound"
            value={(transaction as any).isInbound ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Settlement Filename"
            value={(transaction as any).settlementFileName ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="OFAC ID"
            link={`/compliance/ofac/${(transaction as any).ofacId}`}
            value={(transaction as any).ofacId ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Pending until Date"
            value={(transaction as any).pendingUntilDate ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Customer Type"
            value={(transaction as any).customerType ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Counterparty Name"
            value={(transaction as any).settlementFileName ?? ""}
          />
          <div className="h-3" />
          <div className="flex flex-row justify-between">
            <MyText size="sm" color="text-[#677990]">
              Alerts
            </MyText>
            <div>
              {(transaction as any).alerts.length != null &&
              (transaction as any).alerts.length > 0 ? (
                (transaction as any).alerts.map((alert: any, index: number) => (
                  <MyLinkText
                    key={index}
                    textProps={{ size: "sm" }}
                    link={`/alerts-and-cases/alerts/${alert.id}`}
                  >
                    {alert.id}
                  </MyLinkText>
                ))
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="h-3" />
          <ItemRowHorizontal
            title="Recipient Account Number"
            value={(transaction as any).recipientAccountNumber ?? ""}
          />
          <div className="h-3" />
        </div>
        <div className="min-w-[60px]" />
        <div className="flex flex-col justify-start min-w-[300px]">
          <ItemRowHorizontal
            title="Status"
            value={enumTextToReadableText(
              (transaction as any).status?.toString() ?? ""
            )}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Amount"
            value={(transaction as any).amount ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Description"
            value={(transaction as any).description ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Charge Same Day Fee"
            value={(transaction as any).chargeSameDayFee ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Loaded From File"
            value={(transaction as any).loadedFromFile ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Direction"
            value={(transaction as any).direction ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Duplicate of Payment ID"
            value={(transaction as any).duplicateOfPaymentId ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Prohibited Entity ID"
            value={(transaction as any).prohibitedEntityId ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Num Attempts"
            value={(transaction as any).numAttempts ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Customer Name"
            link={
              transaction.customerType == "BUSINESS"
                ? `/businesses/${(transaction as any).customerId}`
                : `/individuals/${(transaction as any).customerId}`
            }
            value={(transaction as any).customerName ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Product ID"
            link={`/configuration/products/${(transaction as any).productId}`}
            value={(transaction as any).productId ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Returned In File"
            value={(transaction as any).returnedInFile ?? ""}
          />
          <div className="h-3" />
        </div>
      </div>
    </div>
  );
}
