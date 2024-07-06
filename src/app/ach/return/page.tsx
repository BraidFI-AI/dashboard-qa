"use client";

import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import {
  fetchProductIdsList,
  fetchReturnRate,
  fetchUnauthorizedReturns,
  productIdsType,
} from "@/redux/slices/ach_return_slice";
import { useAppDispatch } from "@/redux/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UnauthorizedReturnsTable from "./unauthorised_returns/unauthorised_returns_table";
import { setTitle } from "@/redux/slices/AppSlice";
import ReturnRatesTable from "./return_rates_table";
import MyText from "@/core/components/Text/Text";
import Box from "@mui/material/Box";
import MyControlledDatePicker from "@/core/components/DateTimePicker/MyControlledDateTimePicker";
import moment, { Moment } from "moment";
import { SubmitHandler, useForm } from "react-hook-form";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import RadioButton from "@/core/components/Button/RadioButton";
import { set } from "nprogress";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";

const ReturnPage = () => {
  const dispatch = useAppDispatch();
  const returnRates = useSelector((state: any) => state.return.returnRates);
  const products: productIdsType = useSelector(
    (state: any) => state.return.productIds
  );

  const [method, setMethod] = useState<"Method 1" | "Method 2">("Method 1");

  const [submitting, setSubmitting] = useState(false);

  const [expand, setExpand] = useState(false);

  const [productId, setProductId] = useState<string | null>(null);

  const {
    formState: { errors },
    control,
    handleSubmit,
    getValues,
  } = useForm<{
    startDate: Moment;
    endDate: Moment;
  }>();
  const onSubmit: SubmitHandler<{
    startDate: Moment;
    endDate: Moment;
  }> = (data: { startDate: Moment; endDate: Moment }) => {
    setSubmitting(true);

    console.log("data:", data);
    console.log("method:", method);
    console.log("productId:", productId);

    dispatch(
      fetchReturnRate({
        startDate: data.startDate,
        endDate: data.endDate,
        method: method,
        productId: productId,
      })
    ).then((d: any) => {
      setSubmitting(false);
    });
  };

  useEffect(() => {
    setTitle("Return Rates");
    dispatch(fetchProductIdsList()).then((data: any) => {
      setProductId(null);
    });
  }, [dispatch]);

  return (
    <div className="flex flex-col h-full">
      {!expand && (
        <div className="flex flex-row items-end">
          <Box>
            <MyText>Start Date</MyText>
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
                    // const now = moment();
                    // dateObject.setHours(0, 0, 0, 0);
                    // today.setHours(0, 0, 0, 0);
                    // if (dateObject > today) {
                    //   return "Date cannot be greater the today's date";
                    // }
                  }
                  return true;
                },
              }}
              value=""
            ></MyControlledDatePicker>
          </Box>
          <div className="w-4"></div>
          <Box>
            <MyText>End Date</MyText>
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
                    // const now = moment();
                    // // dateObject.setHours(0, 0, 0, 0);
                    // // today.setHours(0, 0, 0, 0);
                    // const startDate = moment(
                    //   getValues("startDate").toString()
                    // )
                    // if (dateObject < startDate && dateObject != startDate) {
                    //   return "End date cannot be before start date";
                    // }
                    // if (dateObject > today) {
                    //   return "Date cannot be greater the today's date";
                    // }
                  }
                  return true;
                },
              }}
              value=""
            ></MyControlledDatePicker>
          </Box>
          <div className="w-4"></div>
          <Box>
            <MyText>Product</MyText>
            {products == "loading" ? (
              <MyCircularProgressIndicator />
            ) : typeof products == "string" ? (
              <ErrorPage
                error={products}
                recoveryButtonOnClick={() => {
                  dispatch(fetchProductIdsList()).then((data: any) => {
                    setProductId(null);
                  });
                }}
                recoveryButtonTitle="Retry"
              />
            ) : products.length == 0 ? (
              <MyText>No products found</MyText>
            ) : (
              <div className="w-[220px]">
                <MyControlledAutocomplete
                  clearable={false}
                  value={"All"}
                  displayName="Product ID"
                  name={"productId"}
                  control={control}
                  errors={errors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: false,
                        }
                  }
                  options={[
                    "All",
                    ...products?.map((prd) => {
                      return `${prd.id} - ${prd.name}`;
                    }),
                  ]}
                  customOnChange={(val: string) => {
                    if (val == "All") {
                      setProductId(null);
                      return;
                    }
                    const id = val?.split(" - ")[0];
                    if (id) {
                      setProductId(id);
                    }
                  }}
                />
              </div>
            )}
          </Box>
          <div className="w-4"></div>
          <RadioButton
            title="Method type"
            value={method}
            setValue={setMethod}
            options={["Method 1", "Method 2"]}
            layout="horizontal"
          />
          <div className="w-6"></div>
          <div className="w-fit">
            <MyBlueButton
              submitting={submitting}
              onClick={() => {
                handleSubmit(onSubmit)();
              }}
            >
              Fetch return rate
            </MyBlueButton>
          </div>
        </div>
      )}
      {!expand && <div className="h-10"></div>}
      {returnRates == "idle" ? (
        <MyText>Select dates to search</MyText>
      ) : returnRates == "loading" ? (
        <MyCircularProgressIndicator />
      ) : typeof returnRates == "string" ? (
        <ErrorPage
          error={returnRates}
          recoveryButtonOnClick={() => {
            handleSubmit(onSubmit)();
          }}
          recoveryButtonTitle="Retry"
        />
      ) : returnRates.length == 0 ? (
        <MyText>No returns found</MyText>
      ) : (
        <div style={{ height: expand ? "75vh" : "63vh" }}>
          <ReturnRatesTable
            expand={expand}
            setExpand={setExpand}
            returns={returnRates}
          />
        </div>
      )}
    </div>
  );
};

export default ReturnPage;
