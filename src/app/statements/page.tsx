"use client";

import { Product, Program } from "@/core/api/ApiTypes";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import MyControlledDatePicker from "@/core/components/DateTimePicker/MyControlledDateTimePicker";
import MyControlledTimePicker from "@/core/components/DateTimePicker/MyControlledTimePicker";
import ErrorPage from "@/core/components/error_page";
import MyText from "@/core/components/Text/Text";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import { fetchProductIdsList } from "@/redux/slices/ProductSlice";
import { fetchProgramIdsListWithNames } from "@/redux/slices/ProgramSlice";
import { useAppDispatch } from "@/redux/store/store";
import moment from "moment";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export enum StatementType {
  root = "Root",
  program = "Program",
  product = "Product",
  accountNumber = "Account Number",
}

const StatementsPage = () => {
  const dispatch = useAppDispatch();

  const [submitting, setSubmitting] = useState(false);
  const [statementType, setStatementType] = useState(StatementType.root);

  const [productId, setProductId] = useState<string | null>(null);
  const [productIds, setProductIds] = useState<
    "loading" | string | { id: string; name: string }[]
  >("loading");

  const [programId, setProgramId] = useState<string | null>(null);
  const [programIds, setProgramIds] = useState<
    "loading" | string | { id: string; name: string }[]
  >("loading");

  useEffect(() => {
    dispatch(fetchProgramIdsListWithNames()).then((programs: any) => {
      setProgramIds(programs.payload);
      if (typeof programs.payload != "string") {
        setProgramId(programs.payload?.[0]?.id ?? null);
      }
    });

    dispatch(fetchProductIdsList()).then((products: any) => {
      setProductIds(products.payload);
      if (typeof products.payload != "string") {
        setProductId(products.payload?.[0]?.id ?? null);
      }
    });
  }, []);

  const {
    formState: { errors },
    getValues,
    control,
    handleSubmit,
  } = useForm<{ type: string }>({
    defaultValues: {
      type: statementType,
    },
  });
  const onSubmit: SubmitHandler<{ type: string }> = (data: {
    type: string;
  }) => {
    console.log("data:", data);
  };

  return (
    <div>
      <div className="flex flex-row pb-4">
        <div className="w-[300px] pr-2">
          <MyText>Statement Type</MyText>
          <MyControlledAutocomplete
            name="type"
            displayName="Statement Type"
            control={control}
            clearable={false}
            errors={errors}
            rules={
              submitting
                ? { required: false }
                : {
                    required: true,
                  }
            }
            value={getValues("type")}
            customOnChange={(val: any) => {
              setStatementType(val);
            }}
            options={Object.values(StatementType)}
          />
        </div>
        {statementType == StatementType.program && (
          <div className="w-[300px]">
            <MyText>{statementType}</MyText>
            {programIds == "loading" ? (
              <MyCircularProgressIndicator />
            ) : typeof programIds == "string" ? (
              <ErrorPage
                error={programIds}
                recoveryButtonOnClick={() => {
                  dispatch(fetchProgramIdsListWithNames()).then(
                    (programs: any) => {
                      setProgramIds(programs.payload);
                      if (typeof programs.payload != "string") {
                        setProgramId(programs.payload?.[0]?.id ?? null);
                      }
                    }
                  );
                }}
                recoveryButtonTitle="Retry"
              />
            ) : (
              <MyControlledAutocomplete
                name="programId"
                displayName="Program"
                control={control}
                clearable={false}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                customOnChange={(val: any) => {
                  const id = val?.split(" - ")[0];
                  if (id) {
                    setProgramId(id);
                  }
                }}
                value={`${programIds?.[0]?.id} - ${programIds?.[0]?.name}`}
                options={programIds.map((prg) => {
                  return `${prg.id} - ${prg.name}`;
                })}
              />
            )}
          </div>
        )}
        {statementType == StatementType.product && (
          <div className="w-[300px]">
            <MyText>{statementType}</MyText>
            {productIds == "loading" ? (
              <MyCircularProgressIndicator />
            ) : typeof productIds == "string" ? (
              <ErrorPage
                error={productIds}
                recoveryButtonOnClick={() => {
                  dispatch(fetchProductIdsList()).then((products: any) => {
                    setProductIds(products.payload);
                    if (typeof products.payload != "string") {
                      setProductId(products.payload?.[0]?.id ?? null);
                    }
                  });
                }}
                recoveryButtonTitle="Retry"
              />
            ) : (
              <MyControlledAutocomplete
                name="productId"
                displayName="Product"
                control={control}
                errors={errors}
                clearable={false}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                customOnChange={(val: any) => {
                  const id = val?.split(" - ")[0];
                  if (id) {
                    setProductId(id);
                  }
                }}
                value={`${productIds?.[0]?.id} - ${productIds?.[0]?.name}`}
                options={productIds.map((prg) => {
                  return `${prg.id} - ${prg.name}`;
                })}
              />
            )}
          </div>
        )}
        {statementType == StatementType.accountNumber && (
          <div className="w-[300px]">
            <MyText>{statementType}</MyText>
            <MyControlledTextField
              name="accountNumber"
              displayName="Account Number"
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: true,
                    }
              }
              value=""
            />
          </div>
        )}
      </div>
      <div className="flex flex-row items-center pb-4">
        <div className="pr-2">
          <MyText size="sm">Start Date</MyText>
          <MyControlledDatePicker
            name="startDate"
            displayName="Start Date"
            control={control}
            errors={errors}
            rules={{
              required: true,
              validate: (value: any) => {
                const dateObject = moment(value.toString());
                if (dateObject.toString() === "Invalid Date") {
                  return "Invalid Date";
                } else {
                }
                return true;
              },
            }}
            value={""}
          />
        </div>
        <div className="pr-2">
          <MyText size="sm">Start Time</MyText>
          <MyControlledTimePicker
            name="startTime"
            displayName="Start Time"
            control={control}
            errors={errors}
            rules={{
              required: true,
              validate: (value: any) => {
                const timeObject = moment(value.toString());
                if (timeObject.toString() === "Invalid date") {
                  return "Invalid Time";
                }
                return true;
              },
            }}
            value={"00:00"}
          />
        </div>
        <div className="pr-6">
          <div className="invisible">
            <MyText size="sm">PST</MyText>
          </div>
          <MyText size="sm">PST</MyText>
        </div>
        <div className="pr-2">
          <MyText size="sm">End Date</MyText>
          <MyControlledDatePicker
            name="endDate"
            displayName="End Date"
            control={control}
            errors={errors}
            rules={{
              required: true,
              validate: (value: any) => {
                const dateObject = moment(value.toString());
                if (dateObject.toString() === "Invalid Date") {
                  return "Invalid Date";
                } else {
                }
                return true;
              },
            }}
            value={""}
          />
        </div>
        <div className="pr-2">
          <MyText size="sm">End Time</MyText>
          <MyControlledTimePicker
            name="endTime"
            displayName="End Time"
            control={control}
            errors={errors}
            rules={{
              required: true,
              validate: (value: any) => {
                const timeObject = moment(value.toString());
                if (timeObject.toString() === "Invalid date") {
                  return "Invalid Time";
                }
                return true;
              },
            }}
            value={""}
          />
        </div>
        <div>
          <div className="invisible">
            <MyText size="sm">PST</MyText>
          </div>
          <MyText size="sm">PST</MyText>
        </div>
      </div>
      <div className="w-fit">
        <MyBlueButton submitting={submitting} onClick={() => {}}>
          Get Statement
        </MyBlueButton>
      </div>
    </div>
  );
};

export default StatementsPage;
