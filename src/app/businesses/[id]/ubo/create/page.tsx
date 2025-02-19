"use client";

import { Business, CreateUBO } from "@/core/api/ApiTypes";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyControlledDatePicker from "@/core/components/DateTimePicker/MyControlledDateTimePicker";
import MyText from "@/core/components/Text/Text";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import {
  createUBO,
  fetchBusiness,
  fetchUBOs,
} from "@/redux/slices/BusinessSlice";
import { useAppDispatch } from "@/redux/store/store";
import moment from "moment";
import { useParams, useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const CreateUBOPage = () => {
  const router = useRouter();
  const params = useParams();

  const dispatch = useAppDispatch();

  const [business, setBusiness] = useState<"loading" | string | Business>(
    "loading"
  );

  const [UBOs, setUBOs] = useState<"loading" | string | CreateUBO[]>([]);

  const [submitting, setSubmitting] = useState(false);

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
  } = useForm<CreateUBO>();
  const onSubmit: SubmitHandler<CreateUBO> = (data: CreateUBO) => {
    if (typeof business == "string" || typeof UBOs == "string") {
      enqueueSnackbar("Loading data, please try again in a second", {
        variant: "info",
      });
      return;
    }
    console.log("data:", data);

    setSubmitting(true);
    dispatch(
      createUBO({
        ubo: data,
        productId: business.productId ?? -1,
        businessId: business.id ?? -1,
      })
    ).then((resp: any) => {
      if (typeof resp.payload == "string") {
        enqueueSnackbar(resp.payload, { variant: "error", persist: true });
      } else {
        enqueueSnackbar("UBO created successfully", { variant: "success" });
        router.replace(`/businesses/${parseInt(params.id.toString())}/ubo`);
      }
      setSubmitting(false);
    });
  };

  useEffect(() => {
    dispatch(fetchBusiness(parseInt(params.id.toString()))).then(
      (business: any) => {
        setBusiness(business.payload);
      }
    );

    dispatch(fetchUBOs(params.id.toString())).then((ubos: any) => {
      setUBOs(ubos.payload);
    });
  }, [dispatch, params.id]);

  return business == "loading" || UBOs == "loading" ? (
    <MyCircularProgressIndicator />
  ) : typeof business == "string" ? (
    <ErrorPage
      error={business}
      recoveryButtonOnClick={() => {
        dispatch(fetchBusiness(parseInt(params.id.toString()))).then(
          (business: any) => {
            setBusiness(business.payload);
          }
        );
      }}
      recoveryButtonTitle="Retry"
    />
  ) : typeof UBOs == "string" ? (
    <ErrorPage
      error={UBOs}
      recoveryButtonOnClick={() => {
        dispatch(fetchUBOs(params.id.toString())).then((ubos: any) => {
          setUBOs(ubos.payload);
        });
      }}
      recoveryButtonTitle="Retry"
    />
  ) : (
    <div className="w-[400px]">
      <div className="flex flex-row">
        <div className="w-full">
          <MyText>Legal first name</MyText>
          <MyControlledTextField
            name="firstName"
            displayName="First name"
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
        <div className="w-4" />
        <div className="w-full">
          <MyText>Legal last name</MyText>
          <MyControlledTextField
            name="lastName"
            displayName="Last name"
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
      </div>
      <div className="h-4"></div>
      <MyText>Email</MyText>
      <MyControlledTextField
        name="email"
        displayName="Email"
        control={control}
        errors={errors}
        rules={
          submitting
            ? { required: false }
            : {
                required: true,
                validate: (value: any, formValues: any) => {
                  const chars = value?.split("");
                  if (
                    !(
                      chars?.filter((c: any) => c == "@").length == 1 &&
                      chars?.filter((c: any) => c == ".").length >= 1
                    )
                  ) {
                    return "Invalid Email";
                  }
                  let emailExists = false;
                  UBOs.forEach((ubo) => {
                    if (ubo.email === value) {
                      emailExists = true;
                      return;
                    }
                  });
                  if (emailExists) {
                    return "Email already entered for another business owner";
                  }
                },
              }
        }
        value=""
      />
      <div className="h-4"></div>
      <MyText>Title</MyText>
      <MyControlledAutocomplete
        value={"CEO"}
        displayName="Title"
        name={"title"}
        control={control}
        errors={errors}
        rules={
          submitting
            ? { required: false }
            : {
                required: true,
              }
        }
        options={[
          "CEO",
          "CTO",
          "CFO",
          "COO",
          "Founder",
          "President",
          "General Partner",
          "Other",
        ]}
      />
      <div className="h-4"></div>
      <MyText>Ownership %</MyText>
      <MyControlledTextField
        name="ownership"
        displayName="Ownership percentage"
        control={control}
        errors={errors}
        rules={
          submitting
            ? { required: false }
            : {
                required: true,
                pattern: /^[0-9]+$/,
              }
        }
        value=""
      />
      <div className="h-4"></div>
      <MyText>ID Number</MyText>
      <MyControlledTextField
        name="idNumber"
        displayName="ID Number"
        control={control}
        errors={errors}
        rules={
          submitting
            ? { required: false }
            : {
                required: true,
                pattern: /^[0-9]+$/,
              }
        }
        value=""
      />
      <div className="h-4"></div>
      <MyText>SSN</MyText>
      <MyControlledTextField
        name="ssn"
        displayName="SSN"
        control={control}
        errors={errors}
        rules={
          submitting
            ? { required: false }
            : {
                required: true,
                pattern: /^[0-9]+$/,
              }
        }
        value=""
      />
      <div className="h-4"></div>
      <MyText>Date of birth</MyText>
      <MyControlledDatePicker
        name="dateOfBirth"
        displayName="Date of birth"
        control={control}
        errors={errors}
        rules={{
          required: true,
          validate: (value: any) => {
            const dateObject = moment(value.toString());
            if (dateObject.toString() === "Invalid Date") {
              return "Invalid Date";
            }
            return true;
          },
        }}
        value=""
      />
      <div className="h-4"></div>
      <MyText size="sm">Address Details</MyText>
      <div className="h-2"></div>
      <MyText>City</MyText>
      <MyControlledTextField
        name="address.city"
        displayName="City"
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
      <div className="h-4"></div>
      <MyText>State</MyText>
      <MyControlledTextField
        name="address.state"
        displayName="State"
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
      <div className="h-4"></div>
      <MyText>Street Address</MyText>
      <MyControlledTextField
        name="address.line1"
        displayName="Street Address"
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
      <div className="h-4"></div>
      <MyText>Apartment, suite, or floor</MyText>
      <MyControlledTextField
        name="address.line2"
        displayName="Apartment, suite, or floor"
        control={control}
        errors={errors}
        rules={
          submitting
            ? { required: false }
            : {
                required: false,
              }
        }
        value=""
      />
      <div className="h-4"></div>
      <MyText>Postal Code</MyText>
      <MyControlledTextField
        name="address.postalCode"
        displayName="Postal Code"
        control={control}
        errors={errors}
        rules={submitting ? { required: false } : { required: false }}
        value=""
      />
      <div className="h-4"></div>
      <MyText>Country Code</MyText>
      <MyControlledTextField
        name="address.countryCode"
        displayName="Country Code"
        control={control}
        errors={errors}
        rules={submitting ? { required: false } : { required: true }}
        value=""
      />
      <div className="h-4"></div>
      <div className="w-fit">
        <MyBlueButton
          submitting={submitting}
          onClick={() => {
            handleSubmit(onSubmit)();
          }}
        >
          Create UBO
        </MyBlueButton>
      </div>
      <div className="h-10"></div>
    </div>
  );
};

export default CreateUBOPage;
