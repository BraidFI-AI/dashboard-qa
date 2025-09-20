"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import MyText from "@/core/components/Text/Text";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { searchAccount } from "@/redux/slices/AccountSlice";
import {
  fetchCounterparties,
  fetchCounterpartiesPaginated,
} from "@/redux/slices/CounterpartySlice";
import PaginatedSearchField from "@/core/components/TextField/paginated_search_field";
import { SearchCounterparty } from "@/core/api/ApiTypes";
import { createWireTransaction } from "@/redux/slices/new_transaction_slice";
import { enqueueSnackbar } from "notistack";
import MyRedButton from "@/core/components/Button/MyRedButton";
import MyTextButton from "@/core/components/Button/MyTextButton";

const WireTransaction = () => {
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [counterpartyId, setCounterpartyId] = useState("");
  const [counterpartyName, setCounterpartyName] = useState("");
  const [selectedCounterparty, setSelectedCounterparty] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Account Number, 2: Transaction Details
  const [accountData, setAccountData] = useState<any>(null);
  const [loadingAccount, setLoadingAccount] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      accountNumber: "",
      amount: "",
      description: "",
    },
  });

  // Watch account number for validation
  const accountNumber = watch("accountNumber");

  // Function to validate account number and fetch account data
  const validateAccountAndProceed = async () => {
    if (!accountNumber || accountNumber.trim() === "") {
      enqueueSnackbar("Please enter an account number", { variant: "error" });
      return;
    }

    setLoadingAccount(true);
    try {
      // Search for the account
      const result = await dispatch(searchAccount(accountNumber.trim()));

      if (typeof result.payload === "string") {
        enqueueSnackbar(result.payload, { variant: "error" });
        return;
      }

      const accounts = (result.payload as any)?.accounts;
      if (!accounts || accounts.length === 0) {
        enqueueSnackbar("Account not found", { variant: "error" });
        return;
      }

      const account = accounts[0];
      setAccountData(account);

      // Move to next step
      setCurrentStep(2);
      enqueueSnackbar(
        `Account found: ${account.accountName || account.accountNumber}`,
        {
          variant: "success",
        }
      );
    } catch (error) {
      console.error("Error validating account:", error);
      enqueueSnackbar("Error validating account", { variant: "error" });
    } finally {
      setLoadingAccount(false);
    }
  };

  // Handle API call for counterparty search with filtering based on account data
  const handleApiCall = async (query: string, pageNumber: number) => {
    try {
      if (!accountData) {
        return {
          data: [],
          totalPages: 0,
          hasMore: false,
        };
      }

      const searchCriteria: SearchCounterparty = {
        name: query,
      };

      // Create a custom API call that supports pagination
      const pageSize = 100;
      const result = await dispatch(
        fetchCounterpartiesPaginated({
          searchCriteria,
          pageSize,
          pageNumber,
        })
      );

      if (typeof result.payload === "string") {
        // Handle error case
        throw new Error(result.payload);
      }

      // Transform the API response to match our expected format
      const counterparties = (result.payload as any)?.content || [];
      const totalElements = (result.payload as any)?.totalElements || 0;
      const totalPages = Math.ceil(totalElements / pageSize);

      // Filter counterparties based on account's productId OR customerId
      let filteredCounterparties = counterparties;
      console.log("Account data for filtering:", {
        productId: accountData.productId,
        customerId: accountData.customerId,
        customerType: accountData.customerType,
      });

      // Filter counterparties that match EITHER productId OR customerId criteria
      filteredCounterparties = counterparties.filter((cp: any) => {
        let matchesProductId = false;
        let matchesCustomerId = false;

        // Check productId match
        if (accountData.productId && cp.productId === accountData.productId) {
          matchesProductId = true;
          console.log("Counterparty matches productId:", cp.id, cp.name);
        }

        // Check customerId match
        if (accountData.customerId) {
          if (accountData.customerType === "BUSINESS") {
            // Match by businessId
            if (cp.businessId === accountData.customerId) {
              matchesCustomerId = true;
              console.log("Counterparty matches businessId:", cp.id, cp.name);
            }
          } else {
            // Match by individualId (when customerType is not BUSINESS)
            if (cp.individualId === accountData.customerId) {
              matchesCustomerId = true;
              console.log("Counterparty matches individualId:", cp.id, cp.name);
            }
          }
        }

        // Return true if matches EITHER productId OR customerId
        return matchesProductId || matchesCustomerId;
      });

      console.log(
        `Filtered ${filteredCounterparties.length} counterparties from ${counterparties.length} total`
      );

      // Filter out counterparties without wire information
      const validCounterparties = filteredCounterparties.filter(
        (cp: any) => cp.wire !== null && cp.wire.id !== null
      );

      return {
        data: validCounterparties.map((cp: any) => ({
          id: cp.id,
          name: cp.name,
          description: cp.description,
          email: cp.email,
          type: cp.wire?.type ?? "",
          wire: cp.wire,
          displayText: `${cp.name} (ID: ${cp.id})`,
        })),
        totalPages,
        hasMore: pageNumber < totalPages - 1,
      };
    } catch (error) {
      console.error("Counterparty search failed:", error);
      return {
        data: [],
        totalPages: 0,
        hasMore: false,
      };
    }
  };

  // Handle counterparty selection
  const setSelectedItem = (result: any) => {
    console.log("Selected counterparty:", result);
    setSelectedCounterparty(result);
    setCounterpartyId(result.id?.toString() || "");
    setCounterpartyName(result.name || "");

    // Log the wire information for verification
    console.log("Counterparty wire info:", result.wire);
  };

  const onSubmit: SubmitHandler<{
    accountNumber: string;
    amount: string;
    description: string;
  }> = async (data: {
    accountNumber: string;
    amount: string;
    description: string;
  }) => {
    console.log("Form Data:", data);
    console.log("Counterparty ID:", counterpartyId);
    console.log("Counterparty Name:", counterpartyName);
    console.log("Selected Counterparty:", selectedCounterparty);

    if (
      selectedCounterparty == null ||
      selectedCounterparty.wire == null ||
      selectedCounterparty.wire.type == null ||
      selectedCounterparty.wire.type == ""
    ) {
      enqueueSnackbar("Counterparty type is required", { variant: "error" });
      return;
    }

    setSubmitting(true);
    try {
      const result = await dispatch(
        createWireTransaction({
          amount: parseFloat(data.amount),
          description: data.description,
          accountNumber: data.accountNumber,
          counterpartyId: selectedCounterparty.id,
          counterpartyType: selectedCounterparty.wire.type,
        })
      );

      if (typeof result.payload != "string") {
        enqueueSnackbar("Wire transaction created!", { variant: "success" });
        // Reset form after successful submission
        goBackToAccountStep();
      } else {
        enqueueSnackbar(result.payload, { variant: "error", persist: true });
      }
    } catch (error) {
      console.error("Error creating wire transaction:", error);
      enqueueSnackbar("Error creating wire transaction", { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  // Function to go back to step 1
  const goBackToAccountStep = () => {
    setCurrentStep(1);
    setAccountData(null);
    setSelectedCounterparty(null);
    setCounterpartyId("");
    setCounterpartyName("");
    reset({
      accountNumber: "",
      amount: "",
      description: "",
    });
  };

  return (
    <div className="w-[500px]">
      <div className="flex flex-col gap-4">
        {/* Step 1: Account Number Input */}
        {currentStep === 1 && (
          <>
            <div className="flex flex-row gap-2 justify-between items-center">
              <MyText>Account Number</MyText>
              <div className="w-[300px]">
                <MyControlledTextField
                  name="accountNumber"
                  displayName="Account Number"
                  control={control}
                  errors={errors}
                  rules={{ required: true }}
                  value={getValues("accountNumber")}
                />
              </div>
            </div>
            <div className="pt-5 w-fit self-end">
              <MyBlueButton
                submitting={loadingAccount}
                onClick={validateAccountAndProceed}
              >
                {loadingAccount ? "Validating..." : "Continue"}
              </MyBlueButton>
            </div>
          </>
        )}

        {/* Step 2: Transaction Details */}
        {currentStep === 2 && (
          <>
            {/* Account Info Display */}
            {accountData && (
              <div className="bg-gray-50 p-3 rounded-md">
                <MyText size="sm">
                  {`Account: ${accountData.accountName}`}
                </MyText>
                <MyText size="sm">
                  {`Account Number: ${accountData.accountNumber}`}
                </MyText>
                {accountData.productId && (
                  <MyText size="sm">
                    {`Product ID: ${accountData.productId}`}
                  </MyText>
                )}
                {accountData.customerName && accountData.customerId && (
                  <MyText size="sm">
                    {`Customer: ${accountData.customerName} (ID: ${
                      accountData.customerId
                    }, Type: ${accountData.customerType || "Unknown"})`}
                  </MyText>
                )}
              </div>
            )}

            {/* Counterparty Info Display */}
            {selectedCounterparty && (
              <div className="bg-gray-50 p-3 rounded-md">
                <MyText size="sm">
                  {`Counterparty: ${selectedCounterparty.name}`}
                </MyText>
                <MyText size="sm">{`ID: ${selectedCounterparty.id}`}</MyText>
                {selectedCounterparty.description && (
                  <MyText size="sm">
                    {`Description: ${selectedCounterparty.description}`}
                  </MyText>
                )}
                {selectedCounterparty.email && (
                  <MyText size="sm">
                    {`Email: ${selectedCounterparty.email}`}
                  </MyText>
                )}
                {selectedCounterparty.type && (
                  <MyText size="sm">
                    {`Wire Type: ${selectedCounterparty.type}`}
                  </MyText>
                )}
              </div>
            )}

            <div className="flex flex-row gap-2 justify-between items-center">
              <MyText>Counterparty</MyText>
              <div className="w-[300px]">
                <PaginatedSearchField
                  debounceMs={400}
                  placeholder="Search counterparties..."
                  onApiCall={handleApiCall}
                  onResultSelect={(result) => setSelectedItem(result)}
                  resultDisplayKey="displayText"
                  showResults={true}
                />
              </div>
            </div>

            <div className="flex flex-row gap-2 justify-between items-center">
              <MyText>Amount</MyText>
              <div className="w-[300px] flex flex-row items-center gap-1">
                <MyText size="md">$</MyText>
                <MyControlledTextField
                  name="amount"
                  displayName="Amount"
                  control={control}
                  errors={errors}
                  rules={{ required: true }}
                  value={getValues("amount")}
                />
              </div>
            </div>

            <div className="flex flex-row gap-2 justify-between items-center">
              <MyText>Description</MyText>
              <div className="w-[300px]">
                <MyControlledTextField
                  name="description"
                  displayName="Description"
                  control={control}
                  errors={errors}
                  rules={{ required: true }}
                  value={getValues("description")}
                />
              </div>
            </div>

            <div className="flex flex-row gap-2 pt-5">
              <div className="w-fit">
                <MyTextButton onClick={goBackToAccountStep}>Back</MyTextButton>
              </div>
              <div className="w-fit ml-auto">
                <MyBlueButton
                  submitting={submitting}
                  onClick={() => {
                    handleSubmit(onSubmit)();
                  }}
                >
                  {submitting ? "Submitting..." : "Submit Transaction"}
                </MyBlueButton>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WireTransaction;
