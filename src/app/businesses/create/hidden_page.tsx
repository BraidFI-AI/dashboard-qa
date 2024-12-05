"use client";

import { Business, BusinessAddress } from "@/core/api/ApiTypes";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyControlledDatePicker from "@/core/components/DateTimePicker/MyControlledDateTimePicker";
import MyText from "@/core/components/Text/Text";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import { States } from "@/core/constants";
import { createBusiness } from "@/redux/slices/BusinessSlice";
import { fetchProductIdsList } from "@/redux/slices/ProductSlice";
import { useAppDispatch } from "@/redux/store/store";
import { on } from "events";
import { create, set } from "lodash";
import moment from "moment";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

function mapToBusinessType(value: string) {
  if (value === "Sole Proprietor") {
    return "SOLE_PROPRIETOR";
  } else if (value === "Limited Liability Company (LLC)") {
    return "LIMITED_LIABILITY_COMPANY";
  } else if (value === "S or C Corporation") {
    return "CORPORATION";
  } else if (value === "General Partnership") {
    return "GENERAL_PARTNERSHIP";
  } else if (value === "Limited Liability Partnership") {
    return "LIMITED_LIABILITY_PARTNERSHIP";
  } else if (value === "Non-Profit Corporation") {
    return "NON_PROFIT";
  } else if (value === "Government Organization") {
    return "GOVERNMENT_ORGANIZATION";
  } else if (value === "Publicly Traded Company") {
    return "PUBLICLY_TRADED_COMPANY";
  } else if (value === "Trusts") {
    return "PUBLICALLY_TRADED_COMPANY";
  } else {
    return "";
  }
}

const CreateBusinessPage = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const [productIdsList, setProductIdsList] = useState<
    "loading" | string | { id: string; name: string }[]
  >("loading");

  const [productId, setProductId] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
  } = useForm<Business>();
  const onSubmit: SubmitHandler<Business> = (data: any) => {
    if (!productId) {
      enqueueSnackbar("Please select a product", { variant: "error" });
      return;
    }

    const businessType = mapToBusinessType(data.businessEntityType);

    const addr: BusinessAddress = {
      type: "MAILING",
      line1: data.line1,
      line2: data.line2,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      countryCode: data.countryCode,
    };

    data.businessEntityType = businessType;
    data.productId = parseInt(productId);
    data.address = addr;
    data.formationDate = moment(data.formationDate).format("YYYY-MM-DD");
    data.submittedBy = {
      contactPersonEmail: data.contactPersonEmail,
      contactPersonFirstName: data.contactPersonFirstName,
      contactPersonLastName: data.contactPersonLastName,
      contactPersonPhone: data.contactPersonPhone,
    };

    // data.ach = {
    //   accountNumber: data.accountNumber,
    //   bankAccountType: data.bankAccountType,
    //   bankName: data.bankName,
    //   routingNumber: data.routingNumber,
    // };

    data.line1 = undefined;
    data.line2 = undefined;
    data.city = undefined;
    data.state = undefined;
    data.postalCode = undefined;
    data.countryCode = undefined;
    data.contactPersonFirstName = undefined;
    data.contactPersonLastName = undefined;
    data.contactPersonEmail = undefined;
    data.contactPersonPhone = undefined;
    data.accountNumber = undefined;
    data.bankAccountType = undefined;
    data.bankName = undefined;
    data.routingNumber = undefined;

    console.log("data:", data);
    setSubmitting(true);
    dispatch(createBusiness(data)).then((res: any) => {
      if (res.payload) {
        if (typeof res.payload == "string") {
          enqueueSnackbar(res.payload, { variant: "error", persist: true });
        } else {
          enqueueSnackbar("Business created successfully", {
            variant: "success",
          });
          router.back();
        }
      }
      setSubmitting(false);
    });
  };

  useEffect(() => {
    dispatch(fetchProductIdsList()).then((prds: any) => {
      setProductIdsList(prds.payload);
      if (prds.payload?.length > 0) {
        setProductId(prds.payload[0]?.id);
      }
    });
  }, [dispatch]);

  return (
    (<div className="w-[750px] flex flex-row justify-between">
      <div className="w-[350px]">
        <>
          {productIdsList === "loading" ? (
            <MyCircularProgressIndicator />
          ) : typeof productIdsList === "string" ? (
            <ErrorPage
              error={productIdsList}
              recoveryButtonTitle="Retry"
              recoveryButtonOnClick={() => {
                setProductIdsList("loading");
                dispatch(fetchProductIdsList()).then((prds: any) => {
                  setProductIdsList(prds.payload);
                  if (prds.payload?.length > 0) {
                    setProductId(prds.payload[0]?.id);
                  }
                });
              }}
            />
          ) : productIdsList.length == 0 ? (
            <MyText>No products found</MyText>
          ) : (
            <>
              <MyText>Product ID</MyText>
              <MyControlledAutocomplete
                value={`${productIdsList[0].id} - ${productIdsList[0].name}`}
                displayName="Product"
                name={"productId"}
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                options={productIdsList?.map((prd) => {
                  return `${prd.id} - ${prd.name}`;
                })}
                customOnChange={(val: string) => {
                  const id = val?.split(" - ")[0];
                  if (id) {
                    setProductId(id);
                  }
                }}
              />
            </>
          )}
        </>
        <div className="h-4"></div>
        <MyText>Business name</MyText>
        <MyControlledTextField
          name="name"
          displayName="Business name"
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
        <MyText>DBA</MyText>
        <MyControlledTextField
          name="dba"
          displayName="DBA"
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
        <MyText>Incorporation state</MyText>
        <MyControlledAutocomplete
          value={States[0]}
          displayName="Incorporation state"
          name={"incorporationState"}
          control={control}
          errors={errors}
          rules={
            submitting
              ? { required: false }
              : {
                  required: true,
                }
          }
          options={States}
        />
        <div className="h-4"></div>
        <MyText>Company type</MyText>
        <MyControlledAutocomplete
          value={"Sole Proprietor"}
          displayName="Company type"
          name={"businessEntityType"}
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
            "Sole Proprietor",
            "Limited Liability Company (LLC)",
            "S or C Corporation",
            "General Partnership",
            "Limited Liability Partnership",
            "Non-Profit Corporation",
            "Trusts",
            "Government Organization",
            "Publicly Traded Company",
          ]}
        />
        <div className="h-4"></div>
        <div className="flex flex-row">
          <div>
            <MyText>ID Number type</MyText>
            <MyControlledAutocomplete
              value={"EIN"}
              displayName="ID Number type"
              name={"businessIdType"}
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: true,
                    }
              }
              options={["EIN", "SSN", "OTHER_ID"]}
            />
          </div>
          <div className="w-2" />
          <div>
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
          </div>
        </div>
        <div className="h-4"></div>
        <MyText>Formation date</MyText>
        <MyControlledDatePicker
          name="formationDate"
          displayName="Formation date"
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
        />
        <div className="h-4"></div>
        <MyText>ACH Company ID</MyText>
        <MyControlledTextField
          name="achCompanyId"
          displayName="ACH Company ID"
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
        <MyText>Company website</MyText>
        <MyControlledTextField
          name="website"
          displayName="Website"
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
        <div className="h-6"></div>
        <div className="w-fit">
          <MyBlueButton
            submitting={submitting}
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
          >
            Create Business
          </MyBlueButton>
        </div>
        <div className="h-10"></div>
      </div>
      <div className="w-[350px]">
        <MyText size="lg">Business contact information</MyText>
        <div className="h-4"></div>
        <MyText>Street address</MyText>
        <MyControlledTextField
          name="line1"
          displayName="Street address"
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
          name="line2"
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
        <MyText>City</MyText>
        <MyControlledTextField
          name="city"
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
        <div className="flex flex-row">
          <div>
            <MyText>State</MyText>
            <MyControlledAutocomplete
              value={States[0]}
              displayName="State"
              name={"state"}
              control={control}
              errors={errors}
              rules={
                submitting
                  ? { required: false }
                  : {
                      required: true,
                    }
              }
              options={States}
            />
          </div>
          <div className="w-2" />
          <div>
            <MyText>Postal Code</MyText>
            <MyControlledTextField
              name="postalCode"
              displayName="Postal Code"
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
        <MyText>Country Code</MyText>
        <MyControlledTextField
          name="countryCode"
          displayName="Country Code"
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
        <MyText>Phone number</MyText>
        <MyControlledTextField
          name="mobilePhone"
          displayName="Phone number"
          control={control}
          errors={errors}
          rules={
            submitting
              ? { required: false }
              : {
                  required: false,
                  pattern:
                    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
                }
          }
          value=""
        />
        <div className="h-4"></div>
        <MyText size="lg">Contact Person information</MyText>
        <div className="h-4"></div>
        <div className="flex flex-row">
          <div>
            <MyText>First name</MyText>
            <MyControlledTextField
              name="contactPersonFirstName"
              displayName="Contact person first name"
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
          <div className="w-2" />
          <div>
            <MyText>Last name</MyText>
            <MyControlledTextField
              name="contactPersonLastName"
              displayName="Contact person last name"
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
          name="contactPersonEmail"
          displayName="Contact person email"
          control={control}
          errors={errors}
          rules={
            submitting
              ? { required: false }
              : {
                  required: true,
                  validate: (value: any, formValues: any) => {
                    const chars = value.split("");
                    if (
                      !(
                        chars.filter((c: any) => c == "@").length == 1 &&
                        chars.filter((c: any) => c == ".").length >= 1
                      )
                    ) {
                      return "Invalid Email";
                    }
                  },
                }
          }
          value=""
        />
        <div className="h-4"></div>
        <MyText>Phone number</MyText>
        <MyControlledTextField
          name="contactPersonPhone"
          displayName="Contact person phone number"
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
        <div className="h-10"></div>
      </div>
    </div>)
  );
};

export default CreateBusinessPage;
