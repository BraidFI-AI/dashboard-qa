"use client";

import { JSONTree } from "react-json-tree";
import MyTable from "../Table/MyTable";
import ItemRowHorizontal from "../Text/ItemRowHorizontal";
import { timestampToDate } from "@/core/utils/date_time_util";
import MyText from "../Text/Text";
import MyModal from "../my_modal";
import { useState } from "react";
import toDollarFormat from "@/core/utils/toDollarFormat";
import ItemRow from "../Text/ItemRow";
import MyLinkText from "../Text/LinkText";

interface MasterDetailViewProps {
  table: any;
  details: any;
}

export default function MasterDetailView({
  table,
  details,
}: MasterDetailViewProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const [modalData, setModalData] = useState<any>(null);
  const [modalDataType, setModalDataType] = useState<"any" | "typed">("any");

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const formatTitle = (key: any) => {
    return (
      key
        ?.split(/(?=[A-Z])/)
        ?.map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
        ?.join(" ") ?? ""
    );
  };

  const renderObject = (obj: any, prefix: string = ""): any => {
    if (obj == null) return null;
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
    <>
      <MyModal
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
        height="500px"
      >
        {modalDataType == "typed" ? modalData : renderObject(modalData)}
      </MyModal>
      <div className="flex flex-row h-full">
        <div className="w-full">{table}</div>
        {details == null ? (
          <div className="w-[400px] px-4 h-full flex items-center justify-center">
            <MyText>Please select a record to see details</MyText>
          </div>
        ) : (
          <div className="w-[400px] max-w-[400px] px-4">
            <ItemRowHorizontal title="File Name" value={details.fileName} />
            <ItemRowHorizontal
              title="Original File Name"
              value={details.originalFileName}
            />
            <ItemRowHorizontal title="Status" value={details.status} />
            <ItemRowHorizontal
              title="Processing Date"
              value={timestampToDate(details.processingDate, false, true)}
            />
            <ItemRowHorizontal
              title="Requester Username"
              value={details.requesterUsername}
            />
            <ItemRowHorizontal
              title="Requester IP Address"
              value={details.requesterIpAddress}
            />
            <ItemRowHorizontal
              title="Total Transactions"
              value={details.totalTransactions}
            />
            <ItemRowHorizontal
              title="Total Error Count"
              value={details.totalErrorCount}
            />
            <ItemRowHorizontal title="File Error" value={details.fileError} />
            <ItemRowHorizontal
              title="Error Transactions Count"
              value={details.errorTransactionsCount}
            />
            <ItemRowHorizontal
              title="File Error Count"
              value={details.fileErrorCount}
            />
            <ItemRowHorizontal
              title="Original Count"
              value={details.originalCount}
            />
            <ItemRowHorizontal
              title="Original Credit Count"
              value={details.originalCreditCount}
            />
            <ItemRowHorizontal
              title="Original Debit Count"
              value={details.originalDebitCount}
            />
            <ItemRowHorizontal
              title="Original Correction Count"
              value={details.originalCorrectionCount}
            />
            <ItemRowHorizontal
              title="Original Returns Count"
              value={details.originalReturnsCount}
            />
            <ItemRowHorizontal
              title="Original Dishonor Count"
              value={details.originalDishonorCount}
            />
            <ItemRowHorizontal
              title="Pending Transactions Count"
              value={details.pendingTransactionsCount}
            />
            <ItemRowHorizontal
              title="Offset Transactions Count"
              value={details.offsetTransactionsCount}
            />
            <ItemRowHorizontal
              title="Posted Transactions Count"
              value={details.postedTransactionsCount}
            />
            <ItemRowHorizontal
              title="Rejected Transactions Count"
              value={details.rejectedTransactionsCount}
            />
            <ItemRowHorizontal
              title="Manual Review Transactions Count"
              value={details.manualReviewTransactionsCount}
            />
            <ItemRowHorizontal
              title="Duplicate Transactions Count"
              value={details.duplicateTransactionsCount}
            />
            <ItemRowHorizontal
              title="Successful Returns Count"
              value={details.successfulReturnsCount}
            />
            <ItemRowHorizontal
              title="Notification of Change Count"
              value={details.notificationOfChangeCount}
            />
            <ItemRowHorizontal
              title="Returns Dishonored"
              value={details.returnsDishonored}
            />
            {details.errorTransactions != null &&
              details.errorTransactions.length > 0 && (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setModalDataType("typed");
                    setModalData(
                      <div>
                        <MyText size="md">Error Transactions</MyText>
                        <div className="pb-4" />
                        <JSONTree
                          data={details.errorTransactions}
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
                      </div>
                    );
                    setModalOpen(true);
                  }}
                >
                  <MyText primary>Error Transactions</MyText>
                </div>
              )}
            {details.rejectedTransactions != null &&
              details.rejectedTransactions.length > 0 && (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setModalDataType("typed");
                    setModalData(
                      <div>
                        <MyText size="md">Rejected Transactions</MyText>
                        <div className="pb-4" />
                        <JSONTree
                          data={details.rejectedTransactions}
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
                      </div>
                    );
                    setModalOpen(true);
                  }}
                >
                  <MyText primary>Rejected Transactions</MyText>
                </div>
              )}
            {details.fileErrors != null && details.fileErrors.length > 0 && (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setModalDataType("typed");
                  setModalData(
                    <div>
                      <MyText size="md">File Errors</MyText>
                      <div className="pb-4" />
                      <JSONTree
                        data={details.fileErrors}
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
                    </div>
                  );
                  setModalOpen(true);
                }}
              >
                <MyText primary>File Errors</MyText>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
