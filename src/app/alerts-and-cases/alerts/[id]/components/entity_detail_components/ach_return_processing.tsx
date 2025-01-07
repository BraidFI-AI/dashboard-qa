"use client";

import { Alert, WireFireRecord } from "@/core/api/ApiTypes";
import MyModal from "@/core/components/my_modal";
import ItemRow from "@/core/components/Text/ItemRow";
import ItemRowHorizontal from "@/core/components/Text/ItemRowHorizontal";
import MyLinkText from "@/core/components/Text/LinkText";
import MyText from "@/core/components/Text/Text";
import { boxStyle } from "@/core/constants";
import timestampToDate from "@/core/utils/timestampToDate";
import toDollarFormat from "@/core/utils/toDollarFormat";
import { useState } from "react";

type ACHReturnProcessingComponentProps = {
  alert: Alert;
  context: any;
};

const ACHReturnProcessingComponent: React.FC<
  ACHReturnProcessingComponentProps
> = ({ alert, context }) => {

    const [rawTransactionModalOpen, setRawTransactionModalOpen] = useState<boolean>(false);

    const formatTitle = (key: any) => {
        return (
          key
            ?.split(/(?=[A-Z])/)
            ?.map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
            ?.join(" ") ?? ""
        );
      };

    const renderObject = (obj: any, prefix: string = ""): any => {
        return Object.entries(obj).flatMap(([key, value]): any => {
          const fullKey = prefix ? `${prefix} ${key}` : key;
          if (typeof value === "object" && value !== null) {
            if (Array.isArray(value)) {
              if (value.every((item) => typeof item === "number" && !isNaN(item))) {
                return (
                  <ItemRow
                    title={formatTitle(fullKey.replaceAll("_", " "))}
                    value={value.join("-")}
                  />
                );
              } else if (value.every((item) => typeof item === "string")) {
                return (
                  <ItemRow
                    title={formatTitle(fullKey.replaceAll("_", " "))}
                    value={value.join(", ")}
                  />
                );
              }
            }
            return renderObject(value, fullKey);
          }
          return fullKey == "linkedPaymentId" ? (
            <>
              <MyText size="table">Linked Payment ID</MyText>
              <MyLinkText
                link={`/transactions/transactionHistory?paymentId=${value}`}
              >
                {value as any}
              </MyLinkText>
              <div className="pb-4" />
            </>
          ) : (
            <ItemRow
              title={formatTitle(fullKey.replaceAll("_", " "))}
              value={
                fullKey.includes("At") || fullKey.toLowerCase().includes("Date")
                  ? timestampToDate(value as any, false, true)
                  : fullKey.toLowerCase().includes("amount")
                  ? toDollarFormat(value as any)
                  : (value as any)
              }
            />
          );
        });
      };

  return (
    <div
      className={`flex flex-col min-w-[700px] min-h-fit rounded-[10px] justify-center items-start ${boxStyle}`}
    >
      <div className="pb-4 w-full px-6">
        <div className="pt-6 pb-2">
          <MyText variant="label" size="lg" weight="semibold">
            {alert.contextId ?? ""}
          </MyText>
        </div>
        <div className="py-2 flex flex-col justify-start w-full"> 
            {context.rawTransaction != null && 
            <>
            <div onClick={() => setRawTransactionModalOpen(true)} className="cursor-pointer">
            <MyText size="md" primary>Raw Transaction</MyText>
            </div> 
            {rawTransactionModalOpen && <MyModal modalOpen={rawTransactionModalOpen} handleModalClose={() => setRawTransactionModalOpen(false)}>
            {renderObject(context.rawTransaction?? {})}
        </MyModal>}
        <div className="pb-2" />
            </>}
            {context.finalTransaction != null && 
            <>
            <div onClick={() => setRawTransactionModalOpen(true)} className="cursor-pointer">
            <MyText size="md" primary>Final Transaction</MyText>
            </div> 
            {rawTransactionModalOpen && <MyModal modalOpen={rawTransactionModalOpen} handleModalClose={() => setRawTransactionModalOpen(false)}>
            {renderObject(context.finalTransaction?? {})}
        </MyModal>}
        <div className="pb-2" />
            </>}
            {context.errors != null && 
            <>
            <div onClick={() => setRawTransactionModalOpen(true)} className="cursor-pointer">
            <MyText size="md" primary>Errors</MyText>
            </div> 
            {rawTransactionModalOpen && <MyModal modalOpen={rawTransactionModalOpen} handleModalClose={() => setRawTransactionModalOpen(false)}>
            {renderObject(context.errors?? [])}
        </MyModal>}
        <div className="pb-2" />
            </>}
            {context.transactionBeingReturned != null && 
            <>
            <div onClick={() => setRawTransactionModalOpen(true)} className="cursor-pointer">
            <MyText size="md" primary>Transaction Being Returned</MyText>
            </div> 
            {rawTransactionModalOpen && <MyModal modalOpen={rawTransactionModalOpen} handleModalClose={() => setRawTransactionModalOpen(false)}>
            {renderObject(context.transactionBeingReturned?? {})}
        </MyModal>}
        <div className="pb-2" />
            </>}

            
        </div>
      </div>
    </div>
  );
};

export default ACHReturnProcessingComponent;
