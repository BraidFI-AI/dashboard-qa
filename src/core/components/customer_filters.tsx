"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import MyText from "@/core/components/Text/Text";
import { CustomerSearch } from "@/core/api/ApiTypes";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch } from "@/redux/store/store";
import MyTextButton from "@/core/components/Button/MyTextButton";
import { useRouter, useSearchParams } from "next/navigation";
import MyControlledDatePicker from "@/core/components/DateTimePicker/MyControlledDateTimePicker";
import moment from "moment";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import { fetchProductIdsList } from "@/redux/slices/ach_return_slice";

type CustomerFilterProps = {
  type: "businesses" | "individuals";
};

const CustomerFilters: React.FC<CustomerFilterProps> = ({ type }) => {
  const router = useRouter();
  const qParams = useSearchParams();
  const dispatch = useAppDispatch();

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const [productIdsList, setProductIdsList] = useState<
    "loading" | string | { id: string; name: string }[]
  >("loading");
  const [productId, setProductId] = useState<string | undefined>(undefined);

  const {
    formState: { errors },
    control,
    handleSubmit,
    getValues,
    reset,
  } = useForm<CustomerSearch>();
  const onSubmit: SubmitHandler<CustomerSearch> = (data: any) => {
    console.log("data:", data);

    data.productName = productId;

    if (data.name == null || data.name == "") {
      data.name = undefined;
    }

    if (data.productName == null || data.productName == "") {
      data.productName = undefined;
    }

    if (data.status == null || data.status == "") {
      data.status = undefined;
    }

    if (data.createdAtStart == null || data.createdAtStart == "") {
      data.createdAtStart = undefined;
    }

    if (data.createdAtEnd == null || data.createdAtEnd == "") {
      data.createdAtEnd = undefined;
    }

    let params: string = "?";

    for (const key in data) {
      if (data[key] !== undefined) {
        params += `${key}=${data[key]}&`;
      }
    }

    // remove the last &
    params = params.slice(0, -1);
    setDrawerOpen(false);

    router.replace(`/${type}${params}`);
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  useEffect(() => {
    reset({
      name: qParams.get("name") ?? "",
      productName: qParams.get("productName") ?? "",
      createdAtStart: qParams.get("createdAtStart") ?? "",
      createdAtEnd: qParams.get("createdAtEnd") ?? "",
      status: qParams.get("status") ?? "",
    });
    setProductId(qParams.get("productId") ?? undefined);
  }, [qParams]);

  useEffect(() => {
    dispatch(fetchProductIdsList()).then((data: any) => {
      setProductIdsList(data.payload);
    });
  }, [dispatch]);

  return (
    <React.Fragment key="right">
      <Box className="w-auto">
        <MyBlueButton onClick={toggleDrawer(true)}>Filters</MyBlueButton>
      </Box>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          className: "w-2/5",
        }}
      >
        <Box className="flex flex-col px-4 pt-10 max-w-full">
          <div className="h-[50px]" />
          <MyText size="lg">Business Filters</MyText>
          <Box className="pb-4 w-full">
            <MyText>Name</MyText>
            <MyControlledTextField
              name="name"
              displayName="Name"
              control={control}
              errors={errors}
              rules={{}}
              value={getValues("name")}
            />
          </Box>
          <Box className="pb-4 w-full">
            <MyText>Product Name</MyText>
            {productIdsList == "loading" ? (
              <MyCircularProgressIndicator />
            ) : typeof productIdsList == "string" ? (
              <ErrorPage
                error={productIdsList}
                recoveryButtonOnClick={() => {
                  dispatch(fetchProductIdsList()).then((data: any) => {
                    setProductIdsList(data.payload);
                  });
                }}
                recoveryButtonTitle="Retry"
              />
            ) : (
              <MyControlledAutocomplete
                value={getValues("productName") ?? ""}
                displayName="Product Name"
                name={"productName"}
                control={control}
                errors={errors}
                rules={{}}
                options={productIdsList?.map((prd) => {
                  return `${prd.id} - ${prd.name}`;
                })}
                customOnChange={(val: string) => {
                  const name = val?.split(" - ")[1];
                  if (name) {
                    setProductId(name.trim());
                  }
                }}
              />
            )}
          </Box>
          <Box className="pb-4 w-full">
            <MyText>Status</MyText>
            <MyControlledAutocomplete
              value={getValues("status") ?? ""}
              displayName="Status"
              name={"status"}
              control={control}
              errors={errors}
              rules={{}}
              options={[
                "ACTIVE",
                "BLOCKED",
                "INACTIVE",
                "PENDING_APPROVAL",
                "PENDING",
                "INITIALIZED",
                "PENDING_UNBLOCKED",
              ]}
            />
          </Box>
          <Box className="pb-4 w-full">
            <MyText>Created Date Start</MyText>
            <MyControlledDatePicker
              noDefault={true}
              name="createdAtStart"
              displayName="Created Date Start"
              control={control}
              errors={errors}
              rules={{
                validate: (value: any) => {
                  if (value == null) {
                    return;
                  }
                  const dateObject = moment(value.toString());
                  if (dateObject.toString() === "Invalid Date") {
                    return "Invalid Date";
                  } else {
                  }
                  return true;
                },
              }}
              value={getValues("createdAtStart") ?? ""}
            />
          </Box>
          <Box className="pb-4 w-full">
            <MyText>Created Date End</MyText>
            <MyControlledDatePicker
              noDefault={true}
              name="createdAtEnd"
              displayName="Created Date End"
              control={control}
              errors={errors}
              rules={{
                validate: (value: any) => {
                  if (value == null) {
                    return;
                  }
                  const dateObject = moment(value.toString());
                  if (dateObject.toString() === "Invalid Date") {
                    return "Invalid Date";
                  } else {
                  }
                  return true;
                },
              }}
              value={getValues("createdAtEnd") ?? ""}
            />
          </Box>
        </Box>
        <Box className="flex flex-row justify-between pb-10">
          <Box className="w-32 pt-6 pl-4">
            <MyTextButton
              onClick={() => {
                reset({
                  name: "",
                  productName: "",
                  status: "",
                  createdAtStart: undefined,
                  createdAtEnd: undefined,
                });
                setProductId(undefined);
                setDrawerOpen(false);

                router.replace(`/${type}`);
              }}
            >
              Reset Filters
            </MyTextButton>
          </Box>
          <Box className="w-38 pt-6 px-4">
            <MyBlueButton onClick={handleSubmit(onSubmit)}>
              Apply Filters
            </MyBlueButton>
          </Box>
        </Box>
      </Drawer>
    </React.Fragment>
  );
};

export default CustomerFilters;
