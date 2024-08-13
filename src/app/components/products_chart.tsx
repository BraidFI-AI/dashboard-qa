"use client";

import { Product } from "@/core/api/ApiTypes";
import DonutChart from "@/core/components/charts/donut_chart";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import { fetchAllProductBalance } from "@/redux/slices/ProductSlice";
import { useAppDispatch } from "@/redux/store/store";
import React, { useCallback, useEffect, useState } from "react";
import Products from "../configuration/products/page";
import MyText from "@/core/components/Text/Text";
import { fetchDevelopersNew } from "@/redux/slices/DeveloperSlice";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { ADMIN_OPS_ROLE, ADMIN_ROLE } from "@/core/constants";

const ProductsChart = () => {
  const dispatch = useAppDispatch();

  const [developers, setDevelopers] = useState<
    "loading" | string | { tenantId: string; name: string }[]
  >("loading");

  const [developer, setDeveloper] = useState("All");
  const [developerId, setDeveloperId] = useState("All");

  const [chartData, setChartData] = useState<
    "loading" | string | { name: string; value: string; hover: string }[]
  >("loading");

  const userType = useSelector((state: any) => state.app.userType);

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
        setDeveloper("All");
        setDeveloperId("All");
      } else {
        setDevelopers(d.payload);
      }
    });
  }, [dispatch]);

  const fetchChartDataCallback = useCallback(() => {
    setChartData("loading");
    dispatch(
      fetchAllProductBalance(developerId == "All" ? undefined : developerId)
    ).then((d: any) => {
      if (typeof d.payload != "string") {
        d.payload.sort(function (
          a: { name: string; value: string },
          b: { name: string; value: string }
        ) {
          return parseFloat(b.value) - parseFloat(a.value);
        });

        const cData: {
          name: string;
          value: string;
          hover: string;
        }[] = [];
        let total = 0;

        d.payload.forEach(
          (p: { name: string; value: string }, index: number) => {
            total += parseFloat(p.value);
          }
        );

        console.log("total:", total);

        let first5Sum = 0;
        for (var i = 0; i < d.payload.length; i++) {
          if (i < topNumber) {
            cData.push({
              name: d.payload[i].name,
              hover: d.payload[i].value,
              value: `${
                total == 0
                  ? 0
                  : ((parseFloat(d.payload[i].value) / total) * 100).toFixed(2)
              }`,
            });

            first5Sum += parseFloat(d.payload[i].value);
          } else if (i == topNumber) {
            cData.push({
              name: "Others",
              hover: parseFloat(`${total - first5Sum}`).toFixed(2),
              value: `${
                total == 0
                  ? 0
                  : (((total - first5Sum) / total) * 100).toFixed(2)
              }`,
            });
            break;
          }
        }

        console.log("charts data:", cData);
        setChartData(cData);
      } else {
        setChartData(d.payload);
      }
    });
  }, [dispatch, developerId]);

  useEffect(() => {
    console.log("userType:", userType);
    if (userType == ADMIN_ROLE || userType == ADMIN_OPS_ROLE) {
      console.log("userType 2222:", userType);
      fetchDevelopersCallback();
    }
  }, [dispatch, fetchDevelopersCallback, userType]);

  useEffect(() => {
    fetchChartDataCallback();
  }, [dispatch, developerId, fetchChartDataCallback, userType]);

  return userType == ADMIN_ROLE || userType == ADMIN_OPS_ROLE ? (
    <>
      <MyText size="md">Products balance</MyText>
      <div className="pb-4"></div>
      <MyText>Developers</MyText>
      <div className="pb-1"></div>
      <div className="">
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
          <div>
            <div className="w-[300px]">
              <MyControlledAutocomplete
                clearable={false}
                value={`All`}
                displayName="Product ID"
                name={"productId"}
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
                    setDeveloper("All");
                    setDeveloperId("-1");
                  }
                  if (id) {
                    setDeveloper(name);
                    setDeveloperId(id);
                  }
                }}
              />
            </div>
            <div className="pb-6"></div>
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
              <DonutChart data={chartData} />
            )}
          </div>
        )}
      </div>
    </>
  ) : chartData == "loading" ? (
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
    <DonutChart data={chartData} />
  );
};

export default ProductsChart;
