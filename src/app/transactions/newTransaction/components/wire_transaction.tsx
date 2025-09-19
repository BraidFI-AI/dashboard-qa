"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import MyText from "@/core/components/Text/Text";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import RadioButton from "@/core/components/Button/RadioButton";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import { useState } from "react";
import SearchTextField from "@/core/components/TextField/search_textfield";
import { useAppDispatch } from "@/redux/store/store";
import { fetchCounterparties } from "@/redux/slices/CounterpartySlice";
import PaginatedSearchField from "@/core/components/TextField/paginated_search_field";
import { SearchCounterparty } from "@/core/api/ApiTypes";
import { createWireTransaction } from "@/redux/slices/new_transaction_slice";
import { enqueueSnackbar } from "notistack";

const WireTransaction = () => {
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [counterpartyId, setCounterpartyId] = useState("");
  const [counterpartyName, setCounterpartyName] = useState("");
  const [selectedCounterparty, setSelectedCounterparty] = useState<any>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      accountNumber: "",
      amount: "",
      description: "",
    },
  });

  // Handle API call for counterparty search
  const handleApiCall = async (query: string, pageNumber: number) => {
    try {
      const searchCriteria: SearchCounterparty = {
        name: query,
        // Add other search criteria as needed
      };

      const result = await dispatch(fetchCounterparties(searchCriteria));

      if (typeof result.payload === "string") {
        // Handle error case
        throw new Error(result.payload);
      }

      // Transform the API response to match our expected format
      const counterparties = (result.payload as any)?.content || [];
      const totalElements = (result.payload as any)?.totalElements || 0;
      const pageSize = 10; // You can make this configurable
      const totalPages = Math.ceil(totalElements / pageSize);

      return {
        data: counterparties
          .filter((cp: any) => cp.wire !== null && cp.wire.id !== null) // Filter out counterparties with null wire or null wire.id
          .map((cp: any) => ({
            id: cp.id,
            name: cp.name,
            description: cp.description,
            email: cp.email,
            displayText: `${cp.name} (ID: ${cp.id})`, // Display both name and ID
            // Add any other properties you want to display
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
  }> = (data: {
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

    dispatch(
      createWireTransaction({
        amount: parseFloat(data.amount),
        description: data.description,
        accountNumber: data.accountNumber,
        counterpartyId: selectedCounterparty.id,
        counterpartyType: selectedCounterparty.wire.type,
      })
    );
  };

  return (
    <div className="w-[500px]">
      <div className="flex flex-col gap-4">
        {/* <div className="flex flex-row gap-2 justify-between items-center">
          <MyText>Counterparty</MyText>
          <div className="w-[300px]">
            <PaginatedSearchField
              debounceMs={800}
              placeholder="Search counterparties..."
              onApiCall={handleApiCall}
              onResultSelect={(result) => setSelectedItem(result)}
              resultDisplayKey="displayText"
              showResults={true}
            />
          </div>
        </div> */}
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
        {/* <div className="flex flex-row gap-2 justify-between items-center">
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
        </div> */}
        {/* <div className="flex flex-row gap-2 justify-between items-center">
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
        </div> */}
        <MyText>Please select account to proceed</MyText>
        <div className="pt-5 w-fit self-end">
          <MyBlueButton
            submitting={submitting}
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
          >
            Continue
          </MyBlueButton>
        </div>
      </div>
    </div>
  );
};

export default WireTransaction;
