import { Account, Product, Program, Statement } from "@/core/api/ApiTypes";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyTextButton from "@/core/components/Button/MyTextButton";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ClientLogo from "@/core/components/client_logo";
import ErrorPage from "@/core/components/error_page";
import MyModal from "@/core/components/my_modal";
import MyText from "@/core/components/Text/Text";
import { enumTextToReadableText } from "@/core/utils/formatting_util";
import toDollarFormat from "@/core/utils/toDollarFormat";
import { fetchAccount } from "@/redux/slices/AccountSlice";
import { fetchProductNew } from "@/redux/slices/ProductSlice";
import { fetchProgramV2 } from "@/redux/slices/ProgramSlice";
import { useAppDispatch } from "@/redux/store/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export default function GenerateStatement() {
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);

  const statementData: Statement = useSelector(
    (state: any) => state.statement.statement
  );
  const statementType = useSelector(
    (state: any) => state.statement.statementType
  );

  const accountNumber = useSelector(
    (state: any) => state.statement.accountNumber
  );

  const [product, setProduct] = useState<Product | string | null>("loading");
  const [program, setProgram] = useState<Program | string | null>("loading");
  const [account, setAccount] = useState<Account | string | null>("loading");

  const [bankName, setBankName] = useState<string>("Braidfi");
  const [bankPhone, setBankPhone] = useState<string>("123456789");

  useEffect(() => {
    if (statementType == "PRODUCT" && statementData.productId) {
      dispatch(fetchProductNew(parseInt(statementData.productId ?? 0))).then(
        (p: any) => {
          setProduct(p.payload);
        }
      );
    } else {
      setProduct(null);
    }

    if (statementType == "PROGRAM" && statementData.programId) {
      dispatch(fetchProgramV2(parseInt(statementData.programId ?? 0))).then(
        (p: any) => {
          setProgram(p.payload);
        }
      );
    } else {
      setProgram(null);
    }

    if (statementType == "ACCOUNT" && accountNumber) {
      dispatch(fetchAccount(accountNumber)).then((a: any) => {
        setAccount(a.payload);
      });
    } else {
      setAccount(null);
    }
  }, [statementData, dispatch, statementType, accountNumber]);

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
            @page {
              margin: 20px;
              @bottom-left {
                content: "Page "counter(page) " of " counter(pages);
                font-family: Arial, sans-serif;
                font-size: 12px;
                color: #666;
              }
            }
            @page :first {
              margin-top: 20px;
            }
            @page :not(:first) {
              margin-top: 32px;
            }
            @media print {
              body { 
                font-family: Arial, sans-serif; 
                margin: 0;
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
              .statement-header {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                text-align: center !important;
                width: 100% !important;
                gap: 0.25rem !important;
                margin-bottom: 0 !important;
                padding-bottom: 0 !important;
                height: 100% !important;
              }
              .statement-title {
                font-size: 2rem !important;
                font-weight: 800 !important;
                text-align: right !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                margin-bottom: -4px !important;
                font-family: Arial, sans-serif !important;
              }
              .statement-date {
                font-size: 13px !important;
                color: #666 !important;
                font-weight: 700 !important;
                text-align: right !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                margin-top: -4px !important;
              }
              .grid { 
                display: grid !important; 
                width: 100% !important;
                max-width: 800px !important;
                margin: 0 auto !important;
              }
              .grid-cols-2 { 
                grid-template-columns: 250px 1fr !important;
                gap: 2rem !important;
              }
              .header-container {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                max-width: 800px !important;
                margin: 0 auto !important;
                padding: 0 !important;
                width: 100% !important;
              }
              .logo-container {
                width: 250px !important;
                flex-shrink: 0 !important;
              }
              .title-container {
                width: 400px !important;
                flex-shrink: 0 !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: flex-end !important;
                gap: 0 !important;
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
            .grid { display: grid !important; }
            .grid-cols-2 { 
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 1rem !important;
            }
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
            /* Remove the old page number styles */
            .page-number, .page-number-container {
              display: none;
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
            .replace(/class="pl-1"/g, 'class="transaction-list"')
            .replace(
              /class="flex flex-col items-end justify-end"/g,
              'class="statement-header"'
            )
            .replace(
              /<div class="font-avenir-regular text-\[25px\]">Bank Statement<\/div>/g,
              '<div class="statement-title" style="font-size: 25px !important; font-weight: 400 !important; text-align: center !important; width: 100% !important; margin: 0 !important; padding: 0 !important; margin-bottom: -4px !important; font-family: Arial, sans-serif !important;">Monthly Bank Statement</div>'
            )
            .replace(/<MyText>/g, '<div class="statement-date">')
            .replace(/<\/MyText>/g, "</div>")
            .replace(/class="flex justify-center"/g, 'class="flex-center"')
            .replace(
              /<div style="max-width: 800px; margin: 0 auto; display: flex; justify-content: space-between; align-items: flex-start; padding: 0 20px">/g,
              '<div class="header-container">'
            )
            .replace(
              /<div style="width: 250px; flex-shrink: 0">/g,
              '<div class="logo-container">'
            )
            .replace(
              /<div style="width: 400px; flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 4px">/g,
              '<div class="title-container">'
            )}
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
              style={{
                maxWidth: "800px",
                margin: "0 auto",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0",
              }}
            >
              <div style={{ width: "250px", flexShrink: 0 }}>
                <ClientLogo width={183} />
              </div>
              <div
                style={{
                  width: "400px",
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "0",
                }}
              >
                <div
                  style={{
                    fontSize: "25px",
                    textAlign: "right",
                    width: "100%",
                    fontFamily: "Arial, sans-serif",
                    lineHeight: "1.2",
                  }}
                >
                  Bank Statement
                </div>
                <div style={{ textAlign: "right", width: "100%" }}>
                  <MyText>{`${formatDate(
                    statementData.starting
                  )} through ${formatDate(statementData.ending)}`}</MyText>
                </div>
              </div>
            </div>
            <div className="h-10" />
            <div
              className="flex"
              style={{ maxWidth: "650px", margin: "0 auto", gap: "20px" }}
            >
              <div style={{ width: "250px" }}>
                {statementType != "ROOT" && (
                  <>
                    <MyText weight="bold">Customer Information</MyText>
                  </>
                )}
                {statementType == "PRODUCT" && (
                  <MyText>{`${
                    typeof product == "string" || product == null
                      ? statementData.productId ?? ""
                      : product.productName
                  }`}</MyText>
                )}
                {statementType == "PROGRAM" && (
                  <MyText>{`${
                    typeof program == "string" || program == null
                      ? statementData.programId ?? ""
                      : program.name
                  }`}</MyText>
                )}
                {statementType == "ACCOUNT" &&
                  account != null &&
                  typeof account != "string" && (
                    <MyText>{(account as any)?.customerName ?? ""}</MyText>
                  )}
              </div>
              <div style={{ width: "200px" }} className="text-right">
                {statementType == "ACCOUNT" && accountNumber && (
                  <>
                    <MyText weight="bold">Account Number</MyText>
                    <MyText>{accountNumber}</MyText>
                  </>
                )}
              </div>
              <div style={{ width: "160px" }} className="text-center">
                {/* Empty column for alignment */}
              </div>
            </div>
            {statementType != "ROOT" && <div className="h-6" />}
            <div className="flex justify-center">
              <MyText size="md">Statement Period Activity Summary</MyText>
            </div>
            <div className="w-full h-[1px] bg-gray-300 mt-1 mb-2"></div>
            <div
              className="flex mb-6"
              style={{ maxWidth: "650px", margin: "0 auto", gap: "20px" }}
            >
              <div style={{ width: "250px" }}>
                <MyText weight="bold">{`Balance on ${formatDate(
                  statementData.starting
                )}`}</MyText>
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
              <div style={{ width: "200px" }} className="text-right">
                <MyText weight="bold">
                  {toDollarFormat(statementData.startingBalance)}
                </MyText>
                <div className="h-1" />
                {statementData.transactionSummary.map(
                  (item: any, index: any) => (
                    <div key={index}>
                      <MyText>{`${
                        item.polarity == "DEBIT" ? "-" : "+"
                      }${toDollarFormat(item.amount)}`}</MyText>
                    </div>
                  )
                )}
              </div>
              <div style={{ width: "160px" }} className="text-center">
                <MyText weight="bold">Transaction Count</MyText>
                <div className="h-1" />
                {statementData.transactionSummary.map(
                  (item: any, index: any) => (
                    <div key={index}>
                      <MyText>{item.count || 0}</MyText>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="w-full h-[1px] bg-gray-300 mt-1 mb-2"></div>
            <div
              className="flex mb-6"
              style={{ maxWidth: "650px", margin: "0 auto", gap: "20px" }}
            >
              <div style={{ width: "250px" }}>
                <MyText weight="bold">{`Balance on ${formatDate(
                  statementData.ending
                )}`}</MyText>
              </div>
              <div style={{ width: "200px" }} className="text-right">
                <MyText weight="bold">
                  {toDollarFormat(statementData.endingBalance)}
                </MyText>
              </div>
              <div style={{ width: "160px" }} className="text-center">
                <MyText weight="bold">
                  {statementData.transactionSummary.reduce(
                    (total: number, item: any) => total + (item.count || 0),
                    0
                  )}
                </MyText>
              </div>
            </div>
          </div>
        </>
      )}
    </MyModal>
  );
}
