import { Product, Program, Statement } from "@/core/api/ApiTypes";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyTextButton from "@/core/components/Button/MyTextButton";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ClientLogo from "@/core/components/client_logo";
import ErrorPage from "@/core/components/error_page";
import MyModal from "@/core/components/my_modal";
import MyText from "@/core/components/Text/Text";
import { enumTextToReadableText } from "@/core/utils/formatting_util";
import toDollarFormat from "@/core/utils/toDollarFormat";
import { fetchProductNew } from "@/redux/slices/ProductSlice";
import { fetchProgramV2 } from "@/redux/slices/ProgramSlice";
import { useAppDispatch } from "@/redux/store/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function GenerateStatement() {
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);

  const statementData: Statement = useSelector(
    (state: any) => state.statement.statement
  );

  const [product, setProduct] = useState<Product | string | null>("loading");
  const [program, setProgram] = useState<Program | string | null>("loading");

  useEffect(() => {
    if (statementData.productId) {
      dispatch(fetchProductNew(parseInt(statementData.productId ?? 0))).then(
        (p: any) => {
          setProduct(p.payload);
        }
      );
    } else {
      setProduct(null);
    }
    if (statementData.programId) {
      dispatch(fetchProgramV2(parseInt(statementData.programId ?? 0))).then(
        (p: any) => {
          setProgram(p.payload);
        }
      );
    } else {
      setProgram(null);
    }
  }, [statementData, dispatch]);

  const printContent = () => {
    const element = document.getElementById("printable-content");
    if (!element) return;

    const printWindow = window.open("", "Statement", "width=800,height=600");
    if (!printWindow) return;

    const printTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            @media print {
              @page {
                margin: 0;
                size: auto;
              }
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                color: black; 
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              /* Logo specific styles */
              img[alt="Braidfi"] {
                width: 183px !important;
                height: 103px !important; /* 183 * 0.5625 */
                object-fit: contain !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .divider {
                display: block !important;
                width: 100% !important;
                height: 2px !important;
                background-color: #d1d5db !important;
                margin: 0.25rem 0 0.5rem 0 !important;
                border: none !important;
                padding: 0 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .divider-thin {
                display: block !important;
                width: 100% !important;
                height: 1px !important;
                background-color: #d1d5db !important;
                margin: 0.25rem 0 0.5rem 0 !important;
                border: none !important;
                padding: 0 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              color: black; 
            }
            .flex { display: flex; }
            .flex-row { flex-direction: row; }
            .items-center { align-items: center; }
            .justify-between { justify-content: space-between; }
            .justify-end { justify-content: flex-end; }
            .justify-center { justify-content: center; }
            .gap-4 { gap: 1rem; }
            .gap-8 { gap: 2rem; }
            .w-full { width: 100%; }
            .grid { display: grid; }
            .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
            .mb-6 { margin-bottom: 1.5rem; }
            .mb-2 { margin-bottom: 0.5rem; }
            .mt-1 { margin-top: 0.25rem; }
            .h-10 { height: 2.5rem; }
            .h-1 { height: 0.25rem; }
            .h-[2px] { height: 2px; }
            .h-[1px] { height: 1px; }
            .bg-gray-300 { background-color: #d1d5db; }
            .pl-1 { padding-left: 0.25rem; }
            .pl-2 { padding-left: 0.5rem; }
            .pt-10 { padding-top: 2.5rem; }
            .no-print { display: none; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .text-lg { 
              font-size: 1.125rem; 
              line-height: 1.75rem; 
              font-weight: 500;
            }
            .text-md { 
              font-size: 1rem; 
              line-height: 1.5rem;
              font-weight: 500;
            }
            .font-bold { font-weight: 700; }
            .w-32 { width: 8rem; }
            .wi-fit { width: fit-content; }
            .p-8 { padding: 2rem; }
            
            /* Additional styles for proper spacing and alignment */
            .flex-center {
              display: flex;
              justify-content: center;
              width: 100%;
            }
            .statement-summary {
              text-align: center;
              width: 100%;
              margin: 1rem 0;
              font-weight: 500;
              font-size: 1rem;
            }
            .spacer {
              height: 2.5rem;
              display: block;
            }
            .spacer-small {
              height: 0.25rem;
              display: block;
            }
            .transaction-list {
              padding-left: 0.25rem;
            }
            .transaction-item {
              margin-bottom: 0.25rem;
            }
          </style>
        </head>
        <body>
          ${element.innerHTML
            .replace(/class="flex justify-center"/g, 'class="flex-center"')
            .replace(
              /class="w-full h-\[2px\] bg-gray-300 mt-1 mb-2"/g,
              'class="divider" style="display: block !important; width: 100% !important; height: 2px !important; background-color: #d1d5db !important; margin: 0.25rem 0 0.5rem 0 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;"'
            )
            .replace(
              /class="w-full h-\[1px\] bg-gray-300 mt-1 mb-2"/g,
              'class="divider-thin" style="display: block !important; width: 100% !important; height: 1px !important; background-color: #d1d5db !important; margin: 0.25rem 0 0.5rem 0 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;"'
            )
            .replace(/class="h-10"/g, 'class="spacer"')
            .replace(/class="h-1"/g, 'class="spacer-small"')
            .replace(/class="pl-1"/g, 'class="transaction-list"')}
        </body>
      </html>
    `;

    // Create a new document
    const doc = printWindow.document;
    doc.open();
    doc.close(); // Close the document first to ensure clean state

    // Set the content using innerHTML
    doc.documentElement.innerHTML = printTemplate;

    // Wait for resources to load
    printWindow.onload = () => {
      printWindow.print();
      // Optional: close the window after printing
      // printWindow.close();
    };
  };

  if (!showModal) {
    return (
      <div className="p-8">
        <div className="wi-fit">
          <MyBlueButton onClick={() => setShowModal(true)}>
            Download Statement
          </MyBlueButton>
        </div>
      </div>
    );
  }

  return (
    <MyModal
      modalOpen={showModal}
      handleModalClose={() => setShowModal(false)}
      width="800px"
      height="700px"
    >
      {product == "loading" || program == "loading" ? (
        <MyCircularProgressIndicator />
      ) : typeof product == "string" ? (
        <ErrorPage
          error={product}
          recoveryButtonOnClick={() => {}}
          recoveryButtonTitle="Retry"
        />
      ) : typeof program == "string" ? (
        <ErrorPage
          error={program}
          recoveryButtonOnClick={() => {}}
          recoveryButtonTitle="Retry"
        />
      ) : (
        <>
          <div className="flex flex-row justify-end mb-6 no-print w-full">
            <MyTextButton onClick={() => setShowModal(false)}>
              Close
            </MyTextButton>
            <div className="w-32 pl-2">
              <MyBlueButton onClick={printContent}>Print</MyBlueButton>
            </div>
          </div>
          <div id="printable-content">
            <div
              className="flex justify-between mb-6"
              style={{ maxWidth: "600px", margin: "0 auto" }}
            >
              <div style={{ width: "250px" }}>
                <ClientLogo width={183} />
              </div>
              <div
                style={{ width: "250px" }}
                className="flex items-center justify-end"
              >
                <MyText variant="label" size="lg">
                  Monthly Account Statement
                </MyText>
              </div>
            </div>
            <div className="h-10" />
            <div
              className="flex justify-between mb-6"
              style={{ maxWidth: "600px", margin: "0 auto" }}
            >
              <div style={{ width: "250px" }}>
                <MyText>{`Product: ${
                  typeof product == "string" || product == null
                    ? statementData.productId ?? ""
                    : product.productName
                }`}</MyText>
                <MyText>{`Program: ${
                  typeof program == "string" || program == null
                    ? statementData.programId ?? ""
                    : program.name
                }`}</MyText>
              </div>
              <div style={{ width: "250px" }} className="text-right">
                <MyText>Account</MyText>
                <MyText>{statementData.accountName}</MyText>
                <MyText>Statement Date</MyText>
                <MyText>{`${
                  statementData.starting?.split("T")[0] ?? ""
                } through ${
                  statementData.ending?.split("T")[0] ?? ""
                }`}</MyText>
              </div>
            </div>
            <div className="flex justify-center">
              <MyText size="md">Statement Period Activity Summary</MyText>
            </div>
            <div className="w-full h-[2px] bg-gray-300 mt-1 mb-2"></div>
            <div
              className="flex justify-between mb-6"
              style={{ maxWidth: "600px", margin: "0 auto" }}
            >
              <div style={{ width: "250px" }}>
                <MyText>{`Balance on ${statementData.starting
                  ?.split("T")[0]
                  .split("-")
                  .reverse()
                  .join("/")}`}</MyText>
                <div className="h-1" />
                <div className="pl-1">
                  {statementData.transactionSummary.map(
                    (item: any, index: any) => (
                      <div key={index}>
                        <MyText>{enumTextToReadableText(item.type)}</MyText>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div style={{ width: "250px" }} className="text-right">
                <MyText>{toDollarFormat(statementData.startingBalance)}</MyText>
                <div className="h-1" />
                {statementData.transactionSummary.map(
                  (item: any, index: any) => (
                    <div key={index}>
                      <MyText>{toDollarFormat(item.amount)}</MyText>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="w-full h-[1px] bg-gray-300 mt-1 mb-2"></div>
            <div
              className="flex justify-between mb-6"
              style={{ maxWidth: "600px", margin: "0 auto" }}
            >
              <div style={{ width: "250px" }}>
                <MyText>{`Balance on ${statementData.ending
                  ?.split("T")[0]
                  .split("-")
                  .reverse()
                  .join("/")}`}</MyText>
              </div>
              <div style={{ width: "250px" }} className="text-right">
                <MyText>{toDollarFormat(statementData.endingBalance)}</MyText>
              </div>
            </div>
          </div>
        </>
      )}
    </MyModal>
  );
}
