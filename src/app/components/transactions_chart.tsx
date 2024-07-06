"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Developer, Product } from "@/core/api/ApiTypes";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  fetchProductIdsList,
  fetchProductsNew,
  fetchProductsTransactionVolume,
} from "@/redux/slices/ProductSlice";
import { useAppDispatch } from "@/redux/store/store";
import { fetchDevelopersNew } from "@/redux/slices/DeveloperSlice";
import MyText from "@/core/components/Text/Text";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import DivergingStackChart from "@/core/components/charts/diverging_stack_chart";
import { SCROLLBAR_STYLE } from "@/core/constants";

const TransactionsChart = () => {
  const dispatch = useAppDispatch();

  const [developers, setDevelopers] = useState<
    "loading" | string | Developer[]
  >("loading");
  const [developerName, setDevelopeName] = useState("All");
  const [developerId, setDeveloperId] = useState("All");

  const [products, setProducts] = useState<
    "loading" | string | (string | { id: string; name: string })[]
  >("loading");
  const [productId, setProductId] = useState("All");

  const [duration, setDuration] = useState<"Week" | "Month" | "Year">("Week");

  const [chartData, setChartData] = useState<
    | "loading"
    | string
    | { date: string; type: string; volume: number; isDebit: boolean }[]
  >("loading");

  const topNumber = 5;

  const {
    formState: { errors },
    control,
    handleSubmit,
    getValues,
  } = useForm();
  const onSubmit: SubmitHandler<{
    tenantId: string;
  }> = (data: { tenantId: string }) => {};

  const fetchDevelopersCallback = useCallback(() => {
    setDevelopers("loading");
    dispatch(fetchDevelopersNew()).then((d: any) => {
      if (typeof d.payload != "string") {
        setDevelopers(["All", ...d.payload]);
        setDevelopeName("All");
        setDeveloperId("All");
      } else {
        setDevelopers(d.payload);
      }
    });
  }, [dispatch]);

  const fetchProductsCallback = useCallback(() => {
    setProducts("loading");
    dispatch(fetchProductsNew()).then((d: any) => {
      if (typeof d.payload != "string") {
        let prods: Product[] = [];

        if (developerId != "All") {
          prods = d.payload.filter((p: Product) => p.tenantId == developerId);
        } else {
          prods = [...d.payload];
        }

        const prodIds: (string | { id: string; name: string })[] = [];

        console.log("PRODS:", prods);

        prods.map((product: Product) => {
          prodIds.push({
            id: product.id?.toString() ?? "",
            name: product.productName ?? "",
          });
        });

        setProducts(["All", ...prodIds]);
        setProductId("All");
      } else {
        setProducts(d.payload);
      }
    });
  }, [dispatch, developerId]);

  const fetchChartDataCallback = useCallback(() => {
    if (typeof products != "string") {
      setChartData("loading");
      dispatch(
        fetchProductsTransactionVolume({
          product: productId,
          duration: duration.toLowerCase() as "week" | "month" | "year",
        })
      ).then((d: any) => {
        setChartData(d.payload);
      });
    }
  }, [dispatch, productId, products, duration]);

  useEffect(() => {
    fetchDevelopersCallback();
  }, [dispatch, fetchDevelopersCallback]);

  useEffect(() => {
    fetchProductsCallback();
  }, [dispatch, fetchProductsCallback]);

  useEffect(() => {
    fetchChartDataCallback();
  }, [dispatch, fetchChartDataCallback]);

  return (
    <>
      <MyText size="md">Transactions volume</MyText>
      <div className="pb-4"></div>
      <div className="">
        <>
          <div className="flex flex-row">
            <div>
              <MyText>Developers</MyText>
              <div className="pb-1"></div>
              {developers == "loading" ? (
                <MyCircularProgressIndicator />
              ) : typeof developers == "string" ? (
                <ErrorPage
                  error={developers}
                  recoveryButtonOnClick={() => {
                    fetchDevelopersCallback();
                  }}
                  recoveryButtonTitle="Retry"
                />
              ) : (
                <div className="w-[300px]">
                  <MyControlledAutocomplete
                    clearable={false}
                    value={`All`}
                    displayName="Developer ID"
                    name={"developerId"}
                    control={control}
                    errors={errors}
                    rules={{ required: true }}
                    options={developers?.map((dev) => {
                      return typeof dev == "string"
                        ? dev
                        : `${dev.tenantId} - ${dev.name}`;
                    })}
                    customOnChange={(val: string) => {
                      const id = val?.split(" - ")[0];
                      const name = val?.split(" - ")[1];
                      if (val == "All") {
                        setDevelopeName("All");
                        setDeveloperId("All");
                      }
                      if (id) {
                        setDevelopeName(name);
                        setDeveloperId(id);
                      }
                    }}
                  />
                </div>
              )}
            </div>
            <div className="w-4"></div>
            {typeof developers != "string" && (
              <div>
                <MyText>Products</MyText>
                <div className="pb-1"></div>
                {products == "loading" ? (
                  <MyCircularProgressIndicator />
                ) : typeof products == "string" ? (
                  <ErrorPage
                    error={products}
                    recoveryButtonOnClick={() => {
                      fetchProductsCallback();
                    }}
                    recoveryButtonTitle="Retry"
                  />
                ) : (
                  <>
                    <div className="w-[300px]">
                      <MyControlledAutocomplete
                        clearable={false}
                        value={`All`}
                        displayName="Product ID"
                        name={"productId"}
                        control={control}
                        errors={errors}
                        rules={{ required: true }}
                        options={products?.map((prod) => {
                          return typeof prod == "string"
                            ? prod
                            : `${prod.id} - ${prod.name}`;
                        })}
                        customOnChange={(val: string) => {
                          const id = val?.split(" - ")[0];
                          const name = val?.split(" - ")[1];
                          if (val == "All") {
                            setProductId("-1");
                          }
                          if (id) {
                            setProductId(id);
                          }
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
            <div className="w-4"></div>
            {typeof developers != "string" && typeof products != "string" && (
              <div>
                <MyText>Duration</MyText>
                <div className="pb-1"></div>

                <div className="w-[300px]">
                  <MyControlledAutocomplete
                    clearable={false}
                    value={duration}
                    displayName="Duration"
                    name={"duration"}
                    control={control}
                    errors={errors}
                    rules={{ required: true }}
                    options={["Week", "Month", "Year"]}
                    customOnChange={(val: "Week" | "Month" | "Year") => {
                      setDuration(val);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="pb-6"></div>
          {typeof developers != "string" && typeof products != "string" && (
            <>
              {chartData == "loading" ? (
                <MyCircularProgressIndicator />
              ) : typeof chartData == "string" ? (
                <ErrorPage
                  error={chartData}
                  recoveryButtonOnClick={() => {
                    fetchChartDataCallback();
                  }}
                  recoveryButtonTitle="Retry"
                />
              ) : chartData.length == 0 ? (
                <MyText>No data found!</MyText>
              ) : (
                <div className={`w-[1000px] overflow-auto ${SCROLLBAR_STYLE}`}>
                  <DivergingStackChart
                    data={chartData}
                    length={
                      duration == "Week" ? 7 : duration == "Month" ? 31 : 12
                    }
                  />
                </div>
              )}
            </>
          )}
        </>
      </div>
    </>
  );
};

export default TransactionsChart;
