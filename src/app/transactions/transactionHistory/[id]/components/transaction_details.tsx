"use client";

import { Transaction } from "@/core/api/ApiTypes";
import LabelBox from "@/core/components/label_box";
import ItemRowHorizontal from "@/core/components/Text/ItemRowHorizontal";
import MyLinkText from "@/core/components/Text/LinkText";
import MyText from "@/core/components/Text/Text";
import { boxStyle } from "@/core/constants";
import { enumTextToReadableText } from "@/core/utils/formatting_util";
import linkToCounterparty from "@/core/utils/link_to_counterparty";
import { timestampToDate } from "@/core/utils/date_time_util";
import toDollarFormat from "@/core/utils/toDollarFormat";

export default function TransactionDetails({
  transaction,
}: {
  transaction: Transaction;
}) {
  return (
    <div
      className={`flex flex-col w-full min-w-[820px] min-h-fit rounded-[10px] justify-center items-start ${boxStyle}`}
    >
      <div className="pt-6 pb-2 px-6">
        <MyText variant="label" size="lg" weight="semibold">
          Details
        </MyText>
      </div>
      <div className="w-full pt-2 px-6 flex flex-row justify-start">
        <div className="flex flex-col justify-start min-w-[340px] w-full">
          <div className="flex flex-row justify-between">
            <MyText size="sm" color="text-[#677990]">
              Transaction Type
            </MyText>
            <LabelBox color="gray" border>
              {enumTextToReadableText(transaction.transactionType ?? "")}
            </LabelBox>
          </div>
          <div className="h-3" />
          <ItemRowHorizontal
            title="Amount"
            value={toDollarFormat((transaction as any).amount ?? 0)}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Direction"
            value={(transaction as any).direction ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Description"
            value={(transaction as any).description ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Counterparty Name"
            link={
              linkToCounterparty(
                (transaction as any).counterpartyAssociatedEntityType ==
                  "PRODUCT"
                  ? ({
                      id: (transaction as any).counterpartyId,
                      productId: (transaction as any)
                        .counterpartyAssociatedEntityId,
                    } as any)
                  : (transaction as any).counterpartyAssociatedEntityType ==
                    "BUSINESS"
                  ? ({
                      id: (transaction as any).counterpartyId,
                      businessId: (transaction as any)
                        .counterpartyAssociatedEntityId,
                    } as any)
                  : (transaction as any).counterpartyAssociatedEntityType ==
                    "INDIVIDUAL"
                  ? ({
                      id: (transaction as any).counterpartyId,
                      individualId: (transaction as any)
                        .counterpartyAssociatedEntityId,
                    } as any)
                  : ({
                      id: (transaction as any).counterpartyId,
                      accountId: (transaction as any)
                        .counterpartyAssociatedEntityId,
                    } as any)
              ) ?? ""
            }
            value={(transaction as any).counterpartyName ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Post Date"
            value={timestampToDate((transaction as any).postDate ?? "") ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="OFAC ID"
            link={`/compliance/ofac/${(transaction as any).ofacId}`}
            value={(transaction as any).ofacId ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Original Filename"
            value={(transaction as any).originalFileName ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Loaded From File"
            value={(transaction as any).loadedFromFile ?? ""}
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
            title="Pending until Date"
            value={
              timestampToDate(
                (transaction as any).pendingUntilDate ?? "",
                true
              ) ?? ""
            }
          />
          <div className="h-3" />
        </div>
        <div className="min-w-[60px]" />
        <div className="flex flex-col justify-start min-w-[340px] w-full">
          <div className="flex flex-row justify-between">
            <MyText size="sm" color="text-[#677990]">
              Status
            </MyText>
            <LabelBox
              color={
                (transaction as any).status?.toString() == "POSTED"
                  ? "green"
                  : (transaction as any).status?.toString() == "PENDING"
                  ? "orange"
                  : "gray"
              }
              fill
            >
              {enumTextToReadableText(
                (transaction as any).status?.toString() ?? ""
              )}
            </LabelBox>
          </div>
          <div className="h-3" />
          <div className="flex flex-row justify-between">
            <MyText size="sm" color="text-[#677990]">
              Processing Status
            </MyText>
            <LabelBox
              color={
                (transaction as any).processingStatus == "POSTED"
                  ? "green"
                  : (transaction as any).processingStatus == "PENDING"
                  ? "orange"
                  : "gray"
              }
              fill
            >
              {enumTextToReadableText(
                (transaction as any).processingStatus ?? ""
              )}
            </LabelBox>
          </div>
          <div className="h-3" />
          <ItemRowHorizontal
            title="Account Number"
            link={`/accounts/${(transaction as any).accountNumber}`}
            value={(transaction as any).accountNumber ?? ""}
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
            title="Further Credit To"
            link={
              (transaction as any).furtherCreditToCustomerType == "BUSINESS"
                ? `/businesses/${
                    (transaction as any).furtherCreditToCustomerId
                  }`
                : `/individuals/${
                    (transaction as any).furtherCreditToCustomerId
                  }`
            }
            value={(transaction as any).furtherCreditToCustomerName ?? ""}
          />

          <div className="h-3" />
          <ItemRowHorizontal
            title="Balance Available Date"
            value={
              timestampToDate((transaction as any).availableDate ?? "") ?? ""
            }
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Requester Username"
            value={(transaction as any).requesterUsername ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Requester IP Address"
            value={(transaction as any).requesterIpAddress ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Settlement Filename"
            value={(transaction as any).settlementFileName ?? ""}
          />
          <div className="h-3" />
          <ItemRowHorizontal
            title="Duplicate of Payment ID"
            value={(transaction as any).duplicateOfPaymentId ?? ""}
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
          <div className="flex flex-row justify-between">
            <MyText size="sm" color="text-[#677990]">
              Alerts
            </MyText>
            <div>
              {(transaction as any).alertIds != null &&
              (transaction as any).alertIds.length > 0 ? (
                (transaction as any).alertIds.map(
                  (alertId: any, index: number) => (
                    <MyLinkText
                      key={index}
                      textProps={{ size: "sm" }}
                      link={`/alerts-and-cases/alerts/${alertId}`}
                    >
                      {alertId}
                    </MyLinkText>
                  )
                )
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="h-3" />
        </div>
      </div>
    </div>
  );
}
