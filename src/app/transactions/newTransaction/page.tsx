"use client";

import { setTitle } from "@/redux/slices/AppSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  adjustmentTransaction,
  createWireTransaction,
  transferTransaction,
} from "@/redux/slices/new_transaction_slice";
import { fetchCounterpartiesPaginated } from "@/redux/slices/CounterpartySlice";
import { SearchCounterparty } from "@/core/api/ApiTypes";
import { ArrowLeftRight, Settings, Building2, Zap } from "lucide-react";

enum TransactionTypes {
  ADJUSTMENT = "Adjustment",
  TRANSFER = "Transfer",
  WIRE = "Wire",
  ACH = "ACH",
}

const mapSubTypeStringToEnum = (value: string) => {
  if (value.toLowerCase() == "collection") return "COLLECTION";
  if (value.toLowerCase() == "transaction_reversal")
    return "TRANSACTION_REVERSAL";
  if (value.toLowerCase() == "transaction_adjustment")
    return "TRANSACTION_ADJUSTMENT";

  return value;
};

export default function NewTransaction() {
  const router = useRouter();

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

  const [transactionStatus, setTransactionStatus] = useState("");

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

  // Pagination state for counterparty search
  const [counterpartySearchPage, setCounterpartySearchPage] = useState(0);
  const [counterpartyHasMore, setCounterpartyHasMore] = useState(false);
  const [counterpartyTotalResults, setCounterpartyTotalResults] = useState(0);
  const [isLoadingMoreCounterparties, setIsLoadingMoreCounterparties] =
    useState(false);
  const [currentSearchQuery, setCurrentSearchQuery] = useState("");

  const form = useForm<NewTransactionFormValues>({
    // resolver: zodResolver(newTransactionSchema),
    defaultValues: {
      transactionType: "",
      accountNumber: "",
      counterpartyName: "",
      amount: "",
      description: "",
      certifyInformation: false,
      adjustmentDirection: "debit",
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

  const PAGE_SIZE = 100;

  // Filter results based on transaction type
  const filterByTransactionType = (results: any, txType: string) => {
    console.log("filtering counterparties:", txType);
    if (txType === "ach") {
      return results.filter((cp: any) => cp.ach != null);
    } else if (txType === "wire") {
      return results.filter((cp: any) => {
        console.log("filtering counterparties:", cp.wire, cp.wire.id);
        return cp.wire != null && cp.wire.id != null;
      });
    }
    return results;
  };

  // Debounced search function with pagination
  const debouncedSearch = useMemo(
    () =>
      debounce(
        async (
          query: string,
          txType: string,
          page: number = 0,
          currentAccountData: any
        ) => {
          if (query.length < 2) {
            setCounterpartySearchResults([]);
            setShowCounterpartyDropdown(false);
            setCounterpartyHasMore(false);
            setCounterpartyTotalResults(0);
            return;
          }

          if (page === 0) {
            setIsCounterpartySearching(true);
          }

          const result = await dispatch(
            fetchCounterpartiesPaginated({
              searchCriteria: {
                name: query,
              },
              pageSize: PAGE_SIZE,
              pageNumber: page,
            })
          );

          setIsCounterpartySearching(false);

          if (typeof result.payload === "string") {
            enqueueSnackbar(result.payload, { variant: "error" });
            setCounterpartySearchResults([]);
            setShowCounterpartyDropdown(false);
            setCounterpartyHasMore(false);
            setCounterpartyTotalResults(0);
            return;
          }

          const counterparties = (result.payload as any)?.content || [];
          const totalElements = (result.payload as any)?.totalElements || 0;
          const hasMore = (result.payload as any).nextPage;

          let filteredResults: any = [];
          console.log(
            "filtering counterparties Account data:",
            currentAccountData
          );

          filteredResults = counterparties.filter((cp: any) => {
            let matchesProductId = false;
            let matchesCustomerId = false;

            console.log(
              "filtering counterparties productId check:",
              cp.productId,
              currentAccountData?.productId,
              cp.productId === currentAccountData?.productId
            );
            console.log(
              "filtering counterparties customerId check:",
              cp.customerId,
              currentAccountData?.customerId,
              cp.customerId === currentAccountData?.customerId
            );
            console.log(
              "filtering counterparties businessId check:",
              cp.businessId,
              currentAccountData?.customerId,
              cp.businessId === currentAccountData?.customerId
            );
            console.log(
              "filtering counterparties individualId check:",
              cp.individualId,
              currentAccountData?.customerId,
              cp.individualId === currentAccountData?.customerId
            );

            // Check productId match
            if (
              currentAccountData?.productId &&
              cp.productId === currentAccountData.productId
            ) {
              matchesProductId = true;
              console.log(
                "filtering counterparties matches productId:",
                cp.id,
                cp.name
              );
            }

            // Check customerId match
            if (currentAccountData?.customerId) {
              if (currentAccountData.customerType === "BUSINESS") {
                // Match by businessId
                if (cp.businessId === currentAccountData.customerId) {
                  matchesCustomerId = true;
                  console.log(
                    "Counterparty matches businessId:",
                    cp.id,
                    cp.name
                  );
                }
              } else {
                // Match by individualId (when customerType is not BUSINESS)
                if (cp.individualId === currentAccountData.customerId) {
                  matchesCustomerId = true;
                  console.log(
                    "Counterparty matches individualId:",
                    cp.id,
                    cp.name
                  );
                }
              }
            }

            // Return true if matches EITHER productId OR customerId
            return matchesProductId || matchesCustomerId;
          });
          filteredResults = filterByTransactionType(filteredResults, txType);

          if (page === 0) {
            setCounterpartySearchResults(filteredResults);
          } else {
            setCounterpartySearchResults((prev) => [
              ...prev,
              ...filteredResults,
            ]);
          }

          setCounterpartyTotalResults(totalElements);
          setCounterpartyHasMore(hasMore);
          setCounterpartySearchPage(page);
          setShowCounterpartyDropdown(true);
        },
        350
      ),
    [dispatch]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Callbacks
  const handleAccountLookup = () => {
    setIsAccountLoading(true);
    dispatch(searchAccount(form.getValues("accountNumber"))).then((r: any) => {
      if (typeof r.payload === "string") {
        enqueueSnackbar(r.payload, { variant: "error" });
        setIsAccountLoading(false);
        return;
      }
      const acc = r.payload.accounts[0];
      console.log("aaacac:", acc);

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

          console.log("handleAccountLookup account data:", acc, result.payload);

          setAccountData({
            accountNumber: acc.accountNumber ?? "",
            accountName: acc.accountName ?? "",
            accountType: acc.accountType ?? "",
            balance: result.payload.balance ?? "",
            customerName: acc.customerName ?? "",
            customerId: acc.customerId ?? "",
            customerType: acc.customerType ?? "",
            productId: acc.productId ?? "",
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
          console.log("handleAccountLookup account data:", acc, result.payload);

          setAccountData({
            accountNumber: acc.accountNumber ?? "",
            accountName: acc.accountName ?? "",
            accountType: acc.accountType ?? "",
            balance: result.payload.balance ?? "",
            customerName: acc.customerName ?? "",
            customerId: acc.customerId ?? "",
            customerType: acc.customerType ?? "",
            productId: acc.productId ?? "",
          });
          setAccountLookedUp(true);
          enqueueSnackbar("Account found", { variant: "success" });
          setIsAccountLoading(false);
        });
      }
    });
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
    console.log("transactiop  data: 1", counterpartyData);

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
          setSubmissionStatus("success");
          setTransactionId(res.payload.paymentId);
          setTransactionStatus(res.payload.transactionProcessingStatus);
        } else {
          setSubmissionStatus("error");
          setErrorMessage(res.payload);
        }
        setConfirmationOpen(true);
      });
    }

    if (data.transactionType.toLowerCase() == "adjustment") {
      setIsSubmitting(true);
      dispatch(
        adjustmentTransaction({
          accountNumber: data.accountNumber,
          amount: parseFloat(data.amount),
          direction: data.adjustmentDirection ?? "",
          subType: mapSubTypeStringToEnum(data.adjustmentType ?? ""),
          description: data.description ?? "",
        })
      ).then((res: any) => {
        console.log("res:", res);
        setIsSubmitting(false);
        if (typeof res.payload != "string") {
          setSubmissionStatus("success");
          setTransactionId(res.payload.paymentId);
          setTransactionStatus(res.payload.transactionProcessingStatus);
        } else {
          setSubmissionStatus("error");
          setErrorMessage(res.payload);
        }
        setConfirmationOpen(true);
      });
    }

    if (data.transactionType.toLowerCase() == "wire") {
      setIsSubmitting(true);
      dispatch(
        createWireTransaction({
          amount: parseFloat(data.amount),
          description: data.description ?? "",
          accountNumber: data.accountNumber,
          counterpartyId: counterpartyData?.counterpartyId ?? "",
          counterpartyType: counterpartyData.paymentInstrumentType ?? "",
        })
      ).then((res: any) => {
        console.log("res:", res);
        setIsSubmitting(false);
        if (typeof res.payload != "string") {
          setSubmissionStatus("success");
          setTransactionId(res.payload.paymentId);
          setTransactionStatus(res.payload.transactionProcessingStatus);
        } else {
          setSubmissionStatus("error");
          setErrorMessage(res.payload);
        }
        setConfirmationOpen(true);
      });
    }
  };

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
    if (submissionStatus === "success") {
      router.push(
        `/transactions/transactionHistory?paymentId=${transactionId}`
      );
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
        setReceiverAccountData({
          accountNumber: receiverNum ?? "",
          accountName: "",
          accountType: "",
          customerName: "",
          customerId: "",
          customerType: "",
        });
        setIsReceiverAccountLoading(false);
        setReceiverAccountLookedUp(true);
        return;
      }
      const acc = result.payload.accounts[0];
      setReceiverAccountData({
        accountNumber: acc.accountNumber ?? "",
        accountName: acc.accountName ?? "",
        accountType: acc.accountType ?? "",
        customerName: acc.customerName ?? "",
        customerId: acc.customerId ?? "",
        customerType: acc.customerType ?? "",
      });
      setReceiverAccountLookedUp(true);
      enqueueSnackbar("Receiver account found", { variant: "success" });
      setIsReceiverAccountLoading(false);
    });
  };

  const handleEditReceiverAccount = () => {
    setReceiverAccountLookedUp(false);
    setReceiverAccountData(null);
    form.setValue("receiverAccountNumber", "");
  };

  const handleCounterpartySearchChange = (value: string) => {
    form.setValue("counterpartyName", value);
    setCurrentSearchQuery(value);
    setCounterpartySearchPage(0);
    if (counterpartyLookedUp) {
      setCounterpartyLookedUp(false);
      setCounterpartyData(null);
    }
    debouncedSearch(value, form.getValues("transactionType"), 0, accountData);
  };

  const handleLoadMoreCounterparties = async () => {
    setIsLoadingMoreCounterparties(true);
    const txType = form.getValues("transactionType");
    await debouncedSearch(
      currentSearchQuery,
      txType,
      counterpartySearchPage + 1,
      accountData
    );
    setIsLoadingMoreCounterparties(false);
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
    console.log("result cpppp:", result);
    setTimeout(() => {
      setCounterpartyData({
        counterpartyName: result.name,
        counterpartyId: result.id,
        counterpartyType: result.type,
        paymentInstrumentType: (result as any).wire.type,
        contactEmail: (result as any).email,
        contactPhone: (result as any).phone,
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

  const isReviewReady = useMemo(() => {
    const data = form.watch();
    const requiresCounterparty = ["ach", "wire"].includes(data.transactionType);

    if (!data.transactionType || !data.accountNumber || !data.amount)
      return false;
    if (
      requiresCounterparty &&
      (!data.counterpartyName || !counterpartyLookedUp)
    )
      return false;
    if (!accountLookedUp) return false;

    // Adjustment validation
    if (data.transactionType === "adjustment") {
      if (!data.adjustmentDirection || !data.adjustmentType) return false;
    }

    // Transfer validation
    if (data.transactionType === "transfer") {
      if (!data.receiverAccountNumber || !receiverAccountLookedUp) return false;
    }

    return true;
  }, [
    form.watch(),
    accountLookedUp,
    counterpartyLookedUp,
    receiverAccountLookedUp,
  ]);

  const resetForm = () => {
    form.reset({
      transactionType: "",
      accountNumber: "",
      counterpartyName: "",
      amount: "",
      description: "",
      certifyInformation: false,
      adjustmentDirection: "",
      adjustmentType: "",
      receiverAccountNumber: "",
    });
    setAccountLookedUp(false);
    setAccountData(null);
    setCounterpartyLookedUp(false);
    setCounterpartyData(null);
    setCounterpartySearchResults([]);
    setShowCounterpartyDropdown(false);
    setReceiverAccountLookedUp(false);
    setReceiverAccountData(null);
    setSubmissionStatus(null);
    setErrorMessage("");
    setTransactionId("");
  };

  const handleNewTransaction = () => {
    setConfirmationOpen(false);
    resetForm();
  };

  // Direction-based adjustment type options
  const adjustmentDirection = form.watch("adjustmentDirection");

  const adjustmentTypeOptions = useMemo(() => {
    if (adjustmentDirection?.toLowerCase() === "credit") {
      return [
        {
          value: "NEGATIVE_BALANCE_CLEARING",
          label: "Negative Balance Clearing",
        },
        { value: "PROVISIONAL_CREDIT", label: "Provisional Credit" },
        { value: "FEE_REFUND", label: "Fee Refund" },
        { value: "TRANSACTION_REVERSAL", label: "Transaction Reversal" },
        { value: "TRANSACTION_ADJUSTMENT", label: "Transaction Adjustment" },
      ];
    }
    // Default: debit options
    return [
      { value: "collection", label: "Collection" },
      { value: "transaction_reversal", label: "Transaction Reversal" },
      { value: "transaction_adjustment", label: "Transaction Adjustment" },
    ];
  }, [adjustmentDirection]);

  // Clear adjustment type when direction changes
  useEffect(() => {
    form.setValue("adjustmentType", "");
  }, [adjustmentDirection, form]);

  const transactionTypeOptions = useMemo<any>(
    () => [
      {
        value: "transfer",
        label: "Transfer",
        icon: ArrowLeftRight,
        disabled: false,
      },
      {
        value: "adjustment",
        label: "Adjustment",
        icon: Settings,
        disabled: false,
      },
      { value: "ach", label: "ACH", icon: Building2, disabled: true },
      { value: "wire", label: "Wire", icon: Zap, disabled: false },
    ],
    []
  );

  return (
    <div className="-mx-6">
      <NewTransactionView
        transactionTypeOptions={transactionTypeOptions}
        adjustmentTypeOptions={adjustmentTypeOptions}
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
        onNewTransaction={handleNewTransaction}
        // Transfer-specific props
        receiverAccountLookedUp={receiverAccountLookedUp}
        receiverAccountData={receiverAccountData}
        isReceiverAccountLoading={isReceiverAccountLoading}
        onReceiverAccountLookup={handleReceiverAccountLookup}
        onEditReceiverAccount={handleEditReceiverAccount}
        isReviewReady={isReviewReady}
        counterpartyHasMore={counterpartyHasMore}
        counterpartyTotalResults={counterpartyTotalResults}
        isLoadingMoreCounterparties={isLoadingMoreCounterparties}
        onLoadMoreCounterparties={handleLoadMoreCounterparties}
        showSuccessInfoBox={transactionStatus.toLowerCase().includes("manual")}
        successInfoMessage="The transaction is being manually reviewed"
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
