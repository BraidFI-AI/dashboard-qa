"use client";

import { Product, Program, Statement } from "@/core/api/ApiTypes";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import MyControlledDatePicker from "@/core/components/DateTimePicker/MyControlledDateTimePicker";
import { v4 as uuidv4 } from "uuid";

import ErrorPage from "@/core/components/error_page";
import MyTable from "@/core/components/Table/MyTable";
import ItemRowHorizontal from "@/core/components/Text/ItemRowHorizontal";
import MyText from "@/core/components/Text/Text";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import { fetchProductIdsList } from "@/redux/slices/ProductSlice";
import { fetchProgramIdsListWithNames } from "@/redux/slices/ProgramSlice";
import {
  fetchAccountStatement,
  fetchProductStatement,
  fetchProgramStatement,
  fetchRootStatement,
} from "@/redux/slices/statement_slice";
import { useAppDispatch } from "@/redux/store/store";
import moment from "moment";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import { ADMIN_OPS_ROLE, ADMIN_ROLE, StatementType } from "@/core/constants";
import toDollarFormat from "@/core/utils/toDollarFormat";
import { useSelector } from "react-redux";
import {
  StatementView,
  toast,
  generateStatementCSV,
  downloadCSV,
} from "braid-ui";
// import { setShowAppBar } from "@/redux/slices/AppSlice";
import GenerateStatement from "./components/generate_monthly_statement";

import "braid-ui/styles";

const StatementsPage = () => {
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   dispatch(setShowAppBar(false));
  // }, [dispatch]);

  const [programsLoading, setProgramsLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const [statementType, setStatementType] = useState<string>("root");
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [statementGenerated, setStatementGenerated] = useState(false);

  const [programs, setPrograms] = useState<{ value: string; label: string }[]>(
    []
  );
  const [products, setProducts] = useState<{ value: string; label: string }[]>(
    []
  );

  useEffect(() => {
    setProgramsLoading(true);
    setProductsLoading(true);
    dispatch(fetchProgramIdsListWithNames()).then((programs: any) => {
      setProgramsLoading(false);
      if (typeof programs.payload == "string") {
        enqueueSnackbar(programs.payload, { variant: "error" });
        setPrograms(programs.payload);
        return;
      }
      const pgs = programs.payload.map((program: Program) => {
        return {
          value: program.id.toString(),
          label: `${program.id ?? ""} - ${program.name ?? ""}`,
        };
      });
      setPrograms(pgs);
      if (typeof programs.payload != "string") {
        setSelectedProgram(programs.payload?.[0]?.id?.toString() ?? "");
      }
    });

    dispatch(fetchProductIdsList()).then((products: any) => {
      setProductsLoading(false);
      if (typeof products.payload == "string") {
        enqueueSnackbar(products.payload, { variant: "error" });
        setProducts(products.payload);
        return;
      }
      const prds = products.payload.map((product: any) => {
        return {
          value: product.id.toString(),
          label: `${product.id ?? ""} - ${product.name ?? ""}`,
        };
      });
      setProducts(prds);
      if (typeof products.payload != "string") {
        setSelectedProduct(products.payload?.[0]?.id?.toString() ?? "");
      }
    });
  }, [dispatch]);

  // todo export the type from braid-ui
  interface StatementHeader {
    account: string;
    productId: string;
    programId: string;
    startDate: string;
    endDate: string;
    startingBalance: string;
    endingBalance: string;
  }

  interface StatementTransaction {
    transactionType: string;
    direction: "CREDIT" | "DEBIT";
    amount: number;
    count: number;
  }

  const [statementHeader, setStatementHeader] =
    useState<StatementHeader | null>(null);
  const [statementTransactions, setStatementTransactions] = useState<
    StatementTransaction[]
  >([]);

  // Handlers
  const handleStatementTypeChange = (value: string) => {
    console.log("changing statement type:", value);
    setStatementType(value);
    // Reset secondary selection when type changes
    setSelectedProgram("");
    setSelectedProduct("");
    setAccountNumber("");
  };

  const handleGenerateStatement = () => {
    if (!statementType || !startDate || !endDate) return;

    // Validate secondary selection based on type
    if (statementType === "program" && !selectedProgram) return;
    if (statementType === "product" && !selectedProduct) return;
    if (statementType === "account" && !accountNumber) return;

    if (statementType == "root") {
      setSubmitting(true);

      dispatch(
        fetchRootStatement({
          start: moment(startDate).toString(),
          end: moment(endDate).toString(),
        })
      ).then((statement: any) => {
        setSubmitting(false);

        if (typeof statement.payload == "string") {
          enqueueSnackbar(statement.payload, { variant: "error" });
          return;
        }
        setStatementHeader({
          account: statement.payload.accountName?.toString() ?? "",
          productId: statement.payload.productId?.toString() ?? "",
          programId: statement.payload.programId?.toString() ?? "",
          startDate: statement.payload.starting?.toString() ?? "",
          endDate: statement.payload.ending?.toString() ?? "",
          startingBalance: toDollarFormat(
            statement.payload.startingBalance ?? 0
          ).toString(),
          endingBalance: toDollarFormat(
            statement.payload.endingBalance ?? 0
          ).toString(),
        });

        const transactions = statement.payload.transactionSummary.map(
          (transaction: any) => {
            return {
              transactionType: transaction.type ?? "",
              direction: transaction.polarity ?? "",
              amount: transaction.amount,
              count: transaction.count ?? 0,
            };
          }
        );
        setStatementTransactions(transactions);
        setStatementGenerated(true);
      });
    } else if (statementType == "program") {
      setSubmitting(true);
      dispatch(
        fetchProgramStatement({
          start: moment(startDate).toString(),
          end: moment(endDate).toString(),
          programId: selectedProgram,
        })
      ).then((statement: any) => {
        setSubmitting(false);

        if (typeof statement.payload == "string") {
          enqueueSnackbar(statement.payload, { variant: "error" });
          return;
        }
        setStatementHeader({
          account: statement.payload.accountName?.toString() ?? "",
          productId: statement.payload.productId?.toString() ?? "",
          programId: statement.payload.programId?.toString() ?? "",
          startDate: statement.payload.starting?.toString() ?? "",
          endDate: statement.payload.ending?.toString() ?? "",
          startingBalance: toDollarFormat(
            statement.payload.startingBalance ?? 0
          ).toString(),
          endingBalance: toDollarFormat(
            statement.payload.endingBalance ?? 0
          ).toString(),
        });

        const transactions = statement.payload.transactionSummary.map(
          (transaction: any) => {
            return {
              transactionType: transaction.type ?? "",
              direction: transaction.polarity ?? "",
              amount: transaction.amount,
              count: transaction.count ?? 0,
            };
          }
        );
        setStatementTransactions(transactions);
        setStatementGenerated(true);
      });
    } else if (statementType == "product") {
      setSubmitting(true);
      dispatch(
        fetchProductStatement({
          start: moment(startDate).toString(),
          end: moment(endDate).toString(),
          productId: selectedProduct,
        })
      ).then((statement: any) => {
        setSubmitting(false);

        if (typeof statement.payload == "string") {
          enqueueSnackbar(statement.payload, { variant: "error" });
          return;
        }
        setStatementHeader({
          account: statement.payload.accountName?.toString() ?? "",
          productId: statement.payload.productId?.toString() ?? "",
          programId: statement.payload.programId?.toString() ?? "",
          startDate: statement.payload.starting?.toString() ?? "",
          endDate: statement.payload.ending?.toString() ?? "",
          startingBalance: toDollarFormat(
            statement.payload.startingBalance ?? 0
          ).toString(),
          endingBalance: toDollarFormat(
            statement.payload.endingBalance ?? 0
          ).toString(),
        });

        const transactions = statement.payload.transactionSummary.map(
          (transaction: any) => {
            return {
              transactionType: transaction.type ?? "",
              direction: transaction.polarity ?? "",
              amount: transaction.amount,
              count: transaction.count ?? 0,
            };
          }
        );
        setStatementTransactions(transactions);
        setStatementGenerated(true);
      });
    } else if (statementType == "account") {
      setSubmitting(true);
      dispatch(
        fetchAccountStatement({
          start: moment(startDate).toString(),
          end: moment(endDate).toString(),
          accountId: accountNumber,
        })
      ).then((statement: any) => {
        setSubmitting(false);
        if (typeof statement.payload == "string") {
          enqueueSnackbar(statement.payload, { variant: "error" });
          return;
        }
        setStatementHeader({
          account: statement.payload.accountName?.toString() ?? "",
          productId: statement.payload.productId?.toString() ?? "",
          programId: statement.payload.programId?.toString() ?? "",
          startDate: statement.payload.starting?.toString() ?? "",
          endDate: statement.payload.ending?.toString() ?? "",
          startingBalance: toDollarFormat(
            statement.payload.startingBalance ?? 0
          ).toString(),
          endingBalance: toDollarFormat(
            statement.payload.endingBalance ?? 0
          ).toString(),
        });

        const transactions = statement.payload.transactionSummary.map(
          (transaction: any) => {
            return {
              transactionType: transaction.type ?? "",
              direction: transaction.polarity ?? "",
              amount: transaction.amount,
              count: transaction.count ?? 0,
            };
          }
        );
        setStatementTransactions(transactions);
        setStatementGenerated(true);
      });
    } else {
      enqueueSnackbar("Invalid statement type", { variant: "error" });
    }
  };

  const isGenerateDisabled = () => {
    if (!statementType || !startDate || !endDate) return true;
    if (statementType === "program" && !selectedProgram) return true;
    if (statementType === "product" && !selectedProduct) return true;
    if (statementType === "account" && !accountNumber) return true;
    return false;
  };

  const handleDownloadCSV = () => {
    if (!statementHeader || !statementTransactions.length) {
      toast({
        title: "No statement data",
        description: "Please generate a statement before downloading",
        variant: "destructive",
      });
      return;
    }

    try {
      const csvContent = generateStatementCSV(
        statementHeader,
        statementTransactions
      );

      // Generate filename based on statement type and date
      const dateStr = new Date().toISOString().split("T")[0];
      let filenamePart = statementType;
      if (statementType === "program" && selectedProgram) {
        filenamePart = `program_${selectedProgram}`;
      } else if (statementType === "product" && selectedProduct) {
        filenamePart = `product_${selectedProduct}`;
      } else if (statementType === "account" && accountNumber) {
        filenamePart = `account_${accountNumber}`;
      }

      const filename = `statement_${filenamePart}_${dateStr}.csv`;
      downloadCSV(csvContent, filename);

      toast({
        title: "Download started",
        description: "Your statement CSV is being downloaded",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description:
          error instanceof Error ? error.message : "Failed to download CSV",
        variant: "destructive",
      });
    }
  };

  const handlePrintPDF = () => {
    setShowPrintModal(true);
  };

  const handleEdit = () => {
    setStatementGenerated(false);
  };

  const handleRetryFetch = () => {
    if (statementType === "program" && typeof programs == "string") {
      setProgramsLoading(true);
      dispatch(fetchProgramIdsListWithNames()).then((programs: any) => {
        setProgramsLoading(false);
        if (typeof programs.payload == "string") {
          enqueueSnackbar(programs.payload, { variant: "error" });
          setPrograms(programs.payload);
          return;
        }
        const pgs = programs.payload.map((program: Program) => {
          return {
            value: program.id.toString(),
            label: `${program.id ?? ""} - ${program.name ?? ""}`,
          };
        });
        setPrograms(pgs);
        if (typeof programs.payload != "string") {
          setSelectedProgram(programs.payload?.[0]?.id?.toString() ?? "");
        }
      });
    } else if (statementType === "product" && typeof products == "string") {
      setProductsLoading(true);
      dispatch(fetchProductIdsList()).then((products: any) => {
        setProductsLoading(false);
        if (typeof products.payload == "string") {
          enqueueSnackbar(products.payload, { variant: "error" });
          setProducts(products.payload);
          return;
        }
        const prds = products.payload.map((product: any) => {
          return {
            value: product.id.toString(),
            label: `${product.id ?? ""} - ${product.name ?? ""}`,
          };
        });
        setProducts(prds);
        if (typeof products.payload != "string") {
          setSelectedProduct(products.payload?.[0]?.id?.toString() ?? "");
        }
      });
    }
  };

  return (
    <div className="">
      {showPrintModal && (
        <GenerateStatement
          showPrintModal={showPrintModal}
          setShowPrintModal={setShowPrintModal}
        />
      )}
      <StatementView
        statementType={statementType}
        selectedProgram={selectedProgram}
        selectedProduct={selectedProduct}
        accountNumber={accountNumber}
        startDate={startDate}
        endDate={endDate}
        statementGenerated={statementGenerated}
        programs={typeof programs == "string" ? [] : programs}
        products={typeof products == "string" ? [] : products}
        statementHeader={statementHeader}
        statementTransactions={statementTransactions}
        onStatementTypeChange={handleStatementTypeChange}
        onProgramChange={setSelectedProgram}
        onProductChange={setSelectedProduct}
        onAccountNumberChange={setAccountNumber}
        onStartDateChange={(date: Date | undefined) => {
          if (date) {
            setStartDate(date);
          }
        }}
        onEndDateChange={(date: Date | undefined) => {
          if (date) {
            setEndDate(date);
          }
        }}
        onGenerateStatement={handleGenerateStatement}
        onEdit={handleEdit}
        onDownloadCSV={handleDownloadCSV}
        onPrintPDF={handlePrintPDF}
        isGenerateDisabled={isGenerateDisabled()}
        isLoading={submitting}
        programsLoading={programsLoading}
        productsLoading={productsLoading}
        programsError={typeof programs == "string" ? programs : null}
        productsError={typeof products == "string" ? products : null}
        onRetryFetch={handleRetryFetch}
        shouldShowRetry={false}
      />
    </div>
  );
};

export default StatementsPage;
