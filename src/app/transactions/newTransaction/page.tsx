"use client";

import { setTitle } from "@/redux/slices/AppSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import MyText from "@/core/components/Text/Text";
import TransferTransaction from "./components/transfer_transaction";
import AdjustmentTransaction from "./components/adjustment_transaction";
import { ADMIN_OPS_ROLE, ADMIN_ROLE } from "@/core/constants";
import WireTransaction from "./components/wire_transaction";
import {
  NewTransactionFormValues,
  newTransactionSchema,
  NewTransactionView,
  toast,
} from "braid-ui";
import { enqueueSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/redux/store/store";
import { searchAccount } from "@/redux/slices/AccountSlice";
import { fetchBusinessAccountBalance } from "@/redux/slices/BusinessSlice";
import { debounce } from "lodash";
import { fetchIndividualAccountBalance } from "@/redux/slices/IndividualSlice";
import { transferTransaction } from "@/redux/slices/new_transaction_slice";

enum TransactionTypes {
  ADJUSTMENT = "Adjustment",
  TRANSFER = "Transfer",
  WIRE = "Wire",
  ACH = "ACH",
}

export default function NewTransaction() {
  const dispatch = useAppDispatch();

  const [accountLookedUp, setAccountLookedUp] = useState(false);
  const [accountData, setAccountData] = useState<any | null>(null);
  const [counterpartyLookedUp, setCounterpartyLookedUp] = useState(false);
  const [counterpartyData, setCounterpartyData] = useState<any | null>(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    "success" | "error" | null
  >(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const [isAccountLoading, setIsAccountLoading] = useState(false);
  const [isCounterpartyLoading, setIsCounterpartyLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [receiverAccountLookedUp, setReceiverAccountLookedUp] = useState(false);
  const [receiverAccountData, setReceiverAccountData] = useState<any | null>(
    null
  );
  const [isReceiverAccountLoading, setIsReceiverAccountLoading] =
    useState(false);

  const [counterpartySearchResults, setCounterpartySearchResults] = useState<
    {
      id: string;
      name: string;
      type: string;
      paymentInstrumentType: string;
    }[]
  >([]);
  const [isCounterpartySearching, setIsCounterpartySearching] = useState(false);
  const [showCounterpartyDropdown, setShowCounterpartyDropdown] =
    useState(false);

  const form = useForm<NewTransactionFormValues>({
    // resolver: zodResolver(newTransactionSchema),
    defaultValues: {
      transactionType: "",
      accountNumber: "",
      counterpartyName: "",
      amount: "",
      description: "",
      certifyInformation: false,
      adjustmentDirection: "",
      adjustmentType: "",
      receiverAccountNumber: "",
    },
  });

  const isCounterpartyCompatible = (
    instrumentType: string,
    transactionType: string
  ): boolean => {
    if (instrumentType === "both") return true;
    if (transactionType === "ach" && instrumentType === "ach") return true;
    if (transactionType === "wire" && instrumentType === "wire") return true;
    return false;
  };

  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string, txType: string) => {
        if (query.length < 2) {
          setCounterpartySearchResults([]);
          setShowCounterpartyDropdown(false);
          return;
        }

        setIsCounterpartySearching(true);
        try {
          // Simulate API call delay
          await new Promise((resolve) => setTimeout(resolve, 350));

          // Filter by name and compatibility with current transaction type
          let results: any = [];
          // mockSearchResults.filter((cp: any) =>
          //   cp.name.toLowerCase().includes(query.toLowerCase())
          // )

          // Filter by instrument type for ACH/Wire
          if (txType === "ach") {
            results = results.filter(
              (cp: any) =>
                cp.paymentInstrumentType === "ach" ||
                cp.paymentInstrumentType === "both"
            );
          } else if (txType === "wire") {
            results = results.filter(
              (cp: any) =>
                cp.paymentInstrumentType === "wire" ||
                cp.paymentInstrumentType === "both"
            );
          }

          setCounterpartySearchResults(results);
          setShowCounterpartyDropdown(true);
        } finally {
          setIsCounterpartySearching(false);
        }
      }, 350),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Callbacks
  const handleAccountLookup = () => {
    setIsAccountLoading(true);
    dispatch(searchAccount(form.getValues("accountNumber"))).then(
      (result: any) => {
        if (typeof result.payload === "string") {
          enqueueSnackbar(result.payload, { variant: "error" });
          setIsAccountLoading(false);
          return;
        }
        const acc = result.payload.accounts[0];

        if (acc.customerType == "BUSINESS") {
          dispatch(
            fetchBusinessAccountBalance({
              businessId: acc.customerId,
              accountNumber: acc.accountNumber,
            })
          ).then((result: any) => {
            if (typeof result.payload === "string") {
              enqueueSnackbar(result.payload, { variant: "error" });
              setIsAccountLoading(false);
              return;
            }
            setAccountData({
              accountNumber: acc.accountNumber ?? "",
              accountName: acc.accountName ?? "",
              accountType: acc.accountType ?? "",
              balance: result.payload.balance ?? "",
              customerName: acc.customerName ?? "",
              customerId: acc.customerId ?? "",
              customerType: acc.customerType ?? "",
            });
            setAccountLookedUp(true);
            enqueueSnackbar("Account found", { variant: "success" });
            setIsAccountLoading(false);
          });
        } else {
          dispatch(
            fetchIndividualAccountBalance({
              individualId: acc.customerId,
              accountNumber: acc.accountNumber,
            })
          ).then((result: any) => {
            if (typeof result.payload === "string") {
              enqueueSnackbar(result.payload, { variant: "error" });
              setIsAccountLoading(false);
              return;
            }
            setAccountData({
              accountNumber: acc.accountNumber ?? "",
              accountName: acc.accountName ?? "",
              accountType: acc.accountType ?? "",
              balance: result.payload.balance ?? "",
              customerName: acc.customerName ?? "",
              customerId: acc.customerId ?? "",
              customerType: acc.customerType ?? "",
            });
            setAccountLookedUp(true);
            enqueueSnackbar("Account found", { variant: "success" });
            setIsAccountLoading(false);
          });
        }
      }
    );
  };

  const handleCounterpartyLookup = () => {
    const cpName = form.getValues("counterpartyName");
    if (!cpName) {
      enqueueSnackbar("Please enter a counterparty name", { variant: "error" });
      return;
    }
    setCounterpartyData({
      counterpartyName: "Global Tech Solutions Inc.",
      counterpartyId: "CP-5678",
      counterpartyType: "Business",
      status: "Active",
      taxId: "98-7654321",
      primaryContact: "Sarah Johnson",
      contactEmail: "sarah.johnson@globaltech.com",
      contactPhone: "+1 (555) 987-6543",
      address: "456 Innovation Drive, San Francisco, CA 94105",
    });
    setCounterpartyLookedUp(true);
    enqueueSnackbar("Counterparty found", { variant: "success" });
  };

  const handleEditAccount = () => {
    setAccountLookedUp(false);
    setAccountData(null);
    form.setValue("transactionType", "");
    setCounterpartyLookedUp(false);
    setCounterpartyData(null);
    form.setValue("counterpartyName", "");
    form.setValue("amount", "");
    form.setValue("description", "");
  };

  const handleEditCounterparty = () => {
    setCounterpartyLookedUp(false);
    setCounterpartyData(null);
    form.setValue("amount", "");
    form.setValue("description", "");
  };

  const handleSubmit = () => {
    const data = form.getValues();
    console.log("transactiop  data:", data);

    if (data.transactionType.toLowerCase() == "transfer") {
      setIsSubmitting(true);
      dispatch(
        transferTransaction({
          amount: parseFloat(data.amount),
          description: data.description ?? "",
          recipientAccountNumber: data.receiverAccountNumber ?? "",
          senderAccountNumber: data.accountNumber ?? "",
        })
      ).then((res: any) => {
        console.log("res:", res);
        setIsSubmitting(false);
        if (typeof res.payload != "string") {
          enqueueSnackbar("Transfer successful", { variant: "success" });
          setSubmissionStatus("success");
        } else {
          enqueueSnackbar(res.payload, { variant: "error" });
          setSubmissionStatus("error");
        }
      });
    }
  };

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
    if (submissionStatus === "success") {
      // navigate("/transactions/history")
    }
  };

  const handleCancel = () => {
    // navigate("/dashboard")
  };

  const handleReceiverAccountLookup = async () => {
    const receiverNum = form.getValues("receiverAccountNumber");
    if (!receiverNum) {
      enqueueSnackbar("Please enter a receiver account number", {
        variant: "error",
      });
      return;
    }
    setIsReceiverAccountLoading(true);
    dispatch(searchAccount(receiverNum)).then((result: any) => {
      if (typeof result.payload === "string") {
        enqueueSnackbar(result.payload, { variant: "error" });
        setIsReceiverAccountLoading(false);
        return;
      }
      const acc = result.payload.accounts[0];

      if (acc.customerType == "BUSINESS") {
        dispatch(
          fetchBusinessAccountBalance({
            businessId: acc.customerId,
            accountNumber: acc.accountNumber,
          })
        ).then((result: any) => {
          if (typeof result.payload === "string") {
            enqueueSnackbar(result.payload, { variant: "error" });
            setIsReceiverAccountLoading(false);
            return;
          }
          setReceiverAccountData({
            accountNumber: acc.accountNumber ?? "",
            accountName: acc.accountName ?? "",
            accountType: acc.accountType ?? "",
            balance: result.payload.balance ?? "",
            customerName: acc.customerName ?? "",
            customerId: acc.customerId ?? "",
            customerType: acc.customerType ?? "",
          });
          setReceiverAccountLookedUp(true);
          enqueueSnackbar("Account found", { variant: "success" });
          setIsReceiverAccountLoading(false);
        });
      } else {
        dispatch(
          fetchIndividualAccountBalance({
            individualId: acc.customerId,
            accountNumber: acc.accountNumber,
          })
        ).then((result: any) => {
          if (typeof result.payload === "string") {
            enqueueSnackbar(result.payload, { variant: "error" });
            setIsReceiverAccountLoading(false);
            return;
          }
          setReceiverAccountData({
            accountNumber: acc.accountNumber ?? "",
            accountName: acc.accountName ?? "",
            accountType: acc.accountType ?? "",
            balance: result.payload.balance ?? "",
            customerName: acc.customerName ?? "",
            customerId: acc.customerId ?? "",
            customerType: acc.customerType ?? "",
          });
          setReceiverAccountLookedUp(true);
          enqueueSnackbar("Account found", { variant: "success" });
          setIsReceiverAccountLoading(false);
        });
      }
    });
  };

  const handleEditReceiverAccount = () => {
    setReceiverAccountLookedUp(false);
    setReceiverAccountData(null);
    form.setValue("receiverAccountNumber", "");
  };

  const handleCounterpartySearchChange = (value: string) => {
    form.setValue("counterpartyName", value);
    if (counterpartyLookedUp) {
      setCounterpartyLookedUp(false);
      setCounterpartyData(null);
    }
    debouncedSearch(value, form.getValues("transactionType"));
  };

  const handleCounterpartySelect = (result: {
    id: string;
    name: string;
    type: string;
    paymentInstrumentType: string;
  }) => {
    form.setValue("counterpartyName", result.name);
    setShowCounterpartyDropdown(false);
    setCounterpartySearchResults([]);

    // Fetch full counterparty details
    setIsCounterpartyLoading(true);
    setTimeout(() => {
      setCounterpartyData({
        counterpartyName: result.name,
        counterpartyId: result.id,
        counterpartyType: result.type,
        status: "Active",
        taxId: "XX-XXXXXXX",
        primaryContact: "Contact Name",
        contactEmail: "contact@example.com",
        contactPhone: "+1 (555) 123-4567",
        address: "123 Business Ave, City, ST 12345",
        paymentInstrumentType: result.paymentInstrumentType,
      });
      setCounterpartyLookedUp(true);
      setIsCounterpartyLoading(false);
      enqueueSnackbar("Counterparty selected", { variant: "success" });
    }, 500);
  };

  const handleTransactionTypeChange = (newType: string) => {
    form.setValue("transactionType", newType);

    // Check if counterparty needs to be cleared
    if (counterpartyData && counterpartyLookedUp) {
      const requiresCounterparty = ["ach", "wire"].includes(newType);

      if (requiresCounterparty) {
        const isCompatible = isCounterpartyCompatible(
          counterpartyData.paymentInstrumentType,
          newType
        );

        if (!isCompatible) {
          // Clear counterparty and notify user
          setCounterpartyLookedUp(false);
          setCounterpartyData(null);
          setCounterpartySearchResults([]);
          form.setValue("counterpartyName", "");

          const typeLabel = newType === "ach" ? "ACH" : "Wire";
          enqueueSnackbar(
            `${counterpartyData.counterpartyName} doesn't support ${typeLabel} transactions. Please select a different counterparty.`,
            { variant: "warning" }
          );
        }
      }
    }
  };

  return (
    <div className="-mx-6">
      <NewTransactionView
        form={form}
        accountLookedUp={accountLookedUp}
        accountData={accountData}
        counterpartyLookedUp={counterpartyLookedUp}
        counterpartyData={counterpartyData}
        confirmationOpen={confirmationOpen}
        submissionStatus={submissionStatus}
        errorMessage={errorMessage}
        transactionId={transactionId}
        isAccountLoading={isAccountLoading}
        isCounterpartyLoading={isCounterpartyLoading}
        isSubmitting={isSubmitting}
        onAccountLookup={handleAccountLookup}
        onEditAccount={handleEditAccount}
        counterpartySearchResults={counterpartySearchResults}
        isCounterpartySearching={isCounterpartySearching}
        showCounterpartyDropdown={showCounterpartyDropdown}
        onCounterpartySearchChange={handleCounterpartySearchChange}
        onCounterpartySelect={handleCounterpartySelect}
        onCounterpartyDropdownClose={() => setShowCounterpartyDropdown(false)}
        onEditCounterparty={handleEditCounterparty}
        onTransactionTypeChange={handleTransactionTypeChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onConfirmationClose={handleConfirmationClose}
        onConfirmationOpenChange={setConfirmationOpen}
        // Transfer-specific props
        receiverAccountLookedUp={receiverAccountLookedUp}
        receiverAccountData={receiverAccountData}
        isReceiverAccountLoading={isReceiverAccountLoading}
        onReceiverAccountLookup={handleReceiverAccountLookup}
        onEditReceiverAccount={handleEditReceiverAccount}
      />
    </div>
  );

  // const dispatch = useDispatch();
  // const [transactionType, setTransactionType] = useState(TransactionTypes.WIRE);
  // const searchParams = useSearchParams();

  // const userType = useSelector((state: any) => state.app.userType);

  // useEffect(() => {
  //   dispatch(setTitle("New Transaction"));
  // }, [dispatch]);

  // return (
  //   <div className="p-4">
  //     <div className="pb-8">
  //       <MyText>Select Transaction Type</MyText>
  //       <div className="flex flex-row gap-4 pt-2">
  //         {(userType == ADMIN_ROLE || userType == ADMIN_OPS_ROLE) && (
  //           <div
  //             className={`cursor-pointer p-2 border rounded-md ${
  //               transactionType === TransactionTypes.ADJUSTMENT
  //                 ? "border-[#12A7FF] bg-blue-50"
  //                 : "border-gray-300"
  //             }`}
  //             onClick={() => setTransactionType(TransactionTypes.ADJUSTMENT)}
  //           >
  //             <MyText>Adjustment</MyText>
  //           </div>
  //         )}
  //         <div
  //           className={`cursor-pointer p-2 border rounded-md ${
  //             transactionType === TransactionTypes.TRANSFER
  //               ? "border-[#12A7FF] bg-blue-50"
  //               : "border-gray-300"
  //           }`}
  //           onClick={() => setTransactionType(TransactionTypes.TRANSFER)}
  //         >
  //           <MyText>Transfer</MyText>
  //         </div>
  //         <div
  //           className={`cursor-default p-2 border rounded-md ${
  //             transactionType === TransactionTypes.WIRE
  //               ? "border-[#12A7FF] bg-blue-50"
  //               : "border-gray-400"
  //           }`}
  //           onClick={() => setTransactionType(TransactionTypes.WIRE)}
  //         >
  //           <MyText>Wire</MyText>
  //         </div>
  //         <div
  //           className={`cursor-default p-2 border rounded-md ${
  //             transactionType === TransactionTypes.ACH
  //               ? "border-[#12A7FF] bg-blue-50"
  //               : "border-gray-400 bg-gray-300"
  //           }`}
  //           // onClick={() => setTransactionType(TransactionTypes.ACH)}
  //         >
  //           <MyText>ACH</MyText>
  //         </div>
  //       </div>
  //     </div>
  //     {transactionType === TransactionTypes.ADJUSTMENT && (
  //       <AdjustmentTransaction />
  //     )}
  //     {transactionType === TransactionTypes.TRANSFER && <TransferTransaction />}
  //     {transactionType === TransactionTypes.WIRE && (
  //       <WireTransaction accountNumber={searchParams.get("accountNumber")} />
  //     )}
  //   </div>
  // );
}
