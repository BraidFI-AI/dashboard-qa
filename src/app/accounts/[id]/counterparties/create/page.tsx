"use client";

import { useAppDispatch } from "@/redux/store/store";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import MyText from "@/core/components/Text/Text";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { enqueueSnackbar } from "notistack";
import { useParams, useRouter } from "next/navigation";
import {
  CreateCounterPartyWire,
  CreateCounterparty,
  CreateCounterpartyACH,
  CreateCounterpartyBraid,
} from "@/core/api/ApiTypes";
import RadioButton from "@/core/components/Button/RadioButton";
import { fetchBusinessIdsList } from "@/redux/slices/BusinessSlice";
import { fetchIndividualIdsList } from "@/redux/slices/IndividualSlice";
import AddIcon from "@mui/icons-material/Add";
import MyTextButton from "@/core/components/Button/MyTextButton";
import ItemRow from "@/core/components/Text/ItemRow";
import { createCounterparty } from "@/redux/slices/CounterpartySlice";

const CreateCounterpartyPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);

  const [counterpartyType, setCounterpartyType] = useState("BUSINESS");

  const [addPaymentInfo, setAddPaymentInfo] = useState(false);
  const [paymentInfoType, setPaymentInfoType] = useState("ACH");
  const [achAdded, setACHAdded] = useState(false);
  const [braidAdded, setBraidAdded] = useState(false);
  const [wireAdded, setWireAdded] = useState(false);

  const [wireType, setWireType] = useState("DOMESTIC");

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
  } = useForm<CreateCounterparty>();
  const onSubmit: SubmitHandler<CreateCounterparty> = (
    data: CreateCounterparty
  ) => {
    if (counterpartyType == null) {
      enqueueSnackbar("Counterparty type is required", { variant: "error" });
      return;
    }
    data.type = counterpartyType;
    if (achAdded) {
      const achInfo: CreateCounterpartyACH = {
        accountNumber: achGetValues("accountNumber"),
        bankName: achGetValues("bankName"),
        bankAccountType: achGetValues("bankAccountType"),
        routingNumber: achGetValues("routingNumber"),
        gatewayRoutingNumber: achGetValues("gatewayRoutingNumber"),
        rdfiNumberQualifier: achGetValues("rdfiNumberQualifier"),
        address: {
          city: achGetValues("address.city"),
          line1: achGetValues("address.line1"),
          line2: achGetValues("address.line2"),
          state: achGetValues("address.state"),
          type: "MAILING",
          postalCode: achGetValues("address.postalCode"),
          countryCode: achGetValues("address.countryCode"),
        },
      };

      data.ach = achInfo;
    }

    if (braidAdded) {
      data.braid = { accountNumber: braidGetValues("accountNumber") };
    }

    if (wireAdded) {
      data.wire = {
        address: {
          city: wireGetValues("address.city"),
          countryCode: wireGetValues("address.countryCode"),
          line1: wireGetValues("address.line1"),
          line2: wireGetValues("address.line2"),
          postalCode: wireGetValues("address.postalCode"),
          state: wireGetValues("address.state"),
        },
        beneficiaryAccountNumber: wireGetValues("beneficiaryAccountNumber"),
        beneficiaryFIIdType: wireGetValues("beneficiaryFIIdType"),
        beneficiaryFIAddress: {
          city: wireGetValues("beneficiaryFIAddress.city"),
          countryCode: wireGetValues("beneficiaryFIAddress.countryCode"),
          line1: wireGetValues("beneficiaryFIAddress.line1"),
          line2: wireGetValues("beneficiaryFIAddress.line2"),
          postalCode: wireGetValues("beneficiaryFIAddress.postalCode"),
          state: wireGetValues("beneficiaryFIAddress.state"),
        },
        beneficiaryFIName: wireGetValues("beneficiaryFIName"),
        beneficiaryIdNumber: wireGetValues("beneficiaryIdNumber"),
        intermediaryFIAddress: {
          city: wireGetValues("intermediaryFIAddress.city"),
          countryCode: wireGetValues("intermediaryFIAddress.countryCode"),
          line1: wireGetValues("intermediaryFIAddress.line1"),
          line2: wireGetValues("intermediaryFIAddress.line2"),
          postalCode: wireGetValues("intermediaryFIAddress.postalCode"),
          state: wireGetValues("intermediaryFIAddress.state"),
        },
        intermediaryFIIdNumber: wireGetValues("intermediaryFIIdNumber"),
        intermediaryFIIdType: wireGetValues("intermediaryFIIdType"),
        intermediaryFIName: wireGetValues("intermediaryFIName"),
        receiverShortName: wireGetValues("receiverShortName"),
        receiverRoutingNumber: wireGetValues("receiverRoutingNumber"),
        type: wireType,
      };

      if (
        wireGetValues("intermediaryFIAddress.city") == "" &&
        wireGetValues("intermediaryFIAddress.countryCode") == "" &&
        wireGetValues("intermediaryFIAddress.line1") == "" &&
        wireGetValues("intermediaryFIAddress.line2") == "" &&
        wireGetValues("intermediaryFIAddress.postalCode") == "" &&
        wireGetValues("intermediaryFIAddress.state") == "" &&
        wireGetValues("intermediaryFIAddress.type") == ""
      ) {
        data.wire.intermediaryFIAddress = undefined;
      }
    }

    try {
      data.businessId = undefined;
      data.productId = undefined;
      data.accountNumber = params.id.toString();
      data.individualId = undefined;
    } catch (e) {
      enqueueSnackbar("Invalid Account number", { variant: "error" });
      return;
    }

    console.log(data);

    setSubmitting(true);
    dispatch(createCounterparty(data)).then((data: any) => {
      if (typeof data.payload != "string") {
        enqueueSnackbar("Counterparty created!", { variant: "success" });
        router.replace(`/accounts/${params.id}/counterparties`);
      } else {
        enqueueSnackbar(data.payload, { variant: "error", persist: true });
      }
      setSubmitting(false);
    });
  };

  const {
    formState: {
      errors: achErrors,
      submitCount: achSubmitCount,
      isSubmitted: achIsSubmitted,
      isValid: achIsValid,
    },
    getValues: achGetValues,
    control: achControl,
    handleSubmit: achHandleSubmit,
  } = useForm<CreateCounterpartyACH>();
  const achOnSubmit: SubmitHandler<CreateCounterpartyACH> = (
    data: CreateCounterpartyACH
  ) => {
    console.log("ach:", data);
    if (braidAdded == false) {
      setPaymentInfoType("Braid");
    } else if (wireAdded == false) {
      setPaymentInfoType("Wire");
    } else {
      setPaymentInfoType("");
    }

    setACHAdded(true);
    setAddPaymentInfo(false);
  };

  const {
    formState: {
      errors: braidErrors,
      submitCount: braidSubmitCount,
      isSubmitted: braidIsSubmitted,
      isValid: braidIsValid,
    },
    getValues: braidGetValues,
    control: braidControl,
    handleSubmit: braidHandleSubmit,
  } = useForm<CreateCounterpartyBraid>();
  const braidOnSubmit: SubmitHandler<CreateCounterpartyBraid> = (
    data: CreateCounterpartyBraid
  ) => {
    console.log("braid:", data);
    if (achAdded == false) {
      setPaymentInfoType("ACH");
    } else if (wireAdded == false) {
      setPaymentInfoType("Wire");
    } else {
      setPaymentInfoType("");
    }

    setBraidAdded(true);
    setAddPaymentInfo(false);
  };

  const {
    formState: {
      errors: wireErrors,
      submitCount: wireSubmitCount,
      isSubmitted: wireIsSubmitted,
      isValid: wireIsValid,
    },
    getValues: wireGetValues,
    control: wireControl,
    handleSubmit: wireHandleSubmit,
  } = useForm<CreateCounterPartyWire>();
  const wireOnSubmit: SubmitHandler<CreateCounterPartyWire> = (
    data: CreateCounterPartyWire
  ) => {
    console.log("wire:", data);
    if (achAdded == false) {
      setPaymentInfoType("ACH");
    } else if (braidAdded == false) {
      setPaymentInfoType("Braid");
    } else {
      setPaymentInfoType("");
    }

    setWireAdded(true);
    setAddPaymentInfo(false);
  };

  useEffect(() => {
    if (isSubmitted && !isValid) {
      enqueueSnackbar("Invalid Fields", { variant: "error" });
    }
  }, [submitCount, isValid, isSubmitted]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-6">
      <Box className="flex flex-col w-1/3">
        <MyText>Counterparty Name</MyText>
        <MyControlledTextField
          name="name"
          displayName="Counterparty Name"
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
        <Box className="pb-4"></Box>
        <RadioButton
          title="Counterparty Type"
          value={counterpartyType}
          setValue={setCounterpartyType}
          options={["BUSINESS", "INDIVIDUAL"]}
          layout="horizontal"
        />
        <Box className="pb-4"></Box>
        <MyText>Email</MyText>
        <MyControlledTextField
          name="email"
          displayName={"Email"}
          control={control}
          errors={errors}
          rules={
            submitting
              ? { required: false, pattern: false, validate: null }
              : {
                  required: false,
                  validate: (value: string, _: any) => {
                    if (value == "") return;
                    const chars = value.split("");
                    if (
                      !(
                        chars.filter((c) => c == "@").length == 1 &&
                        chars.filter((c) => c == ".").length >= 1
                      )
                    ) {
                      return "Invalid Email";
                    }
                  },
                }
          }
          value=""
        />
        <Box className="pb-4"></Box>
        <MyText>Phone number</MyText>
        <MyControlledTextField
          name="phone"
          displayName={"Phone number"}
          control={control}
          errors={errors}
          rules={
            submitting
              ? { required: false, pattern: false, validate: null }
              : {
                  required: false,
                }
          }
          value=""
        />
        <Box className="pb-4"></Box>
        <ItemRow title="Account ID" value={params.id.toString()} />
        {/* <RadioButton
          title="Association"
          value={association}
          setValue={setAssociation}
          options={["Product", "Business", "Individual", "Account"]}
          layout="horizontal"
        />
        <Box className="pb-4"></Box>
        {association == "Product" && (
          <>
            <MyText>Product ID</MyText>
            {loadingProductIdsList ? (
              <CircularProgress size="25px" />
            ) : productIdsList == null || productIdsList.length == 0 ? (
              <MyText>No product id found</MyText>
            ) : (
              <MyControlledAutocomplete
                value={productIdsList[0]}
                displayName="Product ID"
                name={"productId"}
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: association == "Product" ? true : false,
                      }
                }
                options={productIdsList}
              />
            )}
          </>
        )}
        {association == "Business" && (
          <>
            <MyText>Business ID</MyText>
            {loadingBusinessIdsList ? (
              <CircularProgress size="25px" />
            ) : businessIdsList == null || businessIdsList.length == 0 ? (
              <MyText>No business id found</MyText>
            ) : (
              <MyControlledAutocomplete
                value={businessIdsList[0]}
                displayName="Business ID"
                name={"businessId"}
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: association == "Business" ? true : false,
                      }
                }
                options={businessIdsList}
              />
            )}
          </>
        )}
        {association == "Individual" && (
          <>
            <MyText>Individual ID</MyText>
            {loadingIndividualIdsList ? (
              <CircularProgress size="25px" />
            ) : individualIdsList == null || individualIdsList.length == 0 ? (
              <MyText>No individual id found</MyText>
            ) : (
              <MyControlledAutocomplete
                value={individualIdsList[0]}
                displayName="Individual ID"
                name={"individualId"}
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: association == "Individual" ? true : false,
                      }
                }
                options={individualIdsList}
              />
            )}
          </>
        )}
        {association == "Account" && (
          <>
            <MyText>Account ID</MyText>
            {loadingAccountIdsList ? (
              <CircularProgress size="25px" />
            ) : accountIdsList == null || accountIdsList.length == 0 ? (
              <MyText>No account id found</MyText>
            ) : (
              <MyControlledAutocomplete
                value={accountIdsList[0]}
                displayName="Account ID"
                name={"accountId"}
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: association == "Account" ? true : false,
                      }
                }
                options={accountIdsList}
              />
            )}
          </>
        )} */}
        <Box className="pb-4"></Box>
        <MyText>Payment Information</MyText>
        {achAdded && (
          <>
            <Box className="pb-2"></Box>
            <Divider className="w-1/2" />
            <Box className="pb-2"></Box>
            <Box className="flex flex-row items-center">
              <MyText>ACH payment information</MyText>
              <IconButton
                style={{
                  padding: 0,
                  margin: 0,
                  color: "red",
                }}
                edge="end"
                onClick={() => {
                  setACHAdded(false);
                }}
              >
                <DeleteOutlineRoundedIcon />
              </IconButton>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Bank Account Type</MyText>
              <Box className="pr-2" />
              <MyText primary>{achGetValues("bankAccountType")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Account number</MyText>
              <Box className="pr-2" />
              <MyText primary>{achGetValues("accountNumber")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Routing number</MyText>
              <Box className="pr-2" />
              <MyText primary>{achGetValues("routingNumber")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Bank Name</MyText>
              <Box className="pr-2" />
              <MyText primary>{achGetValues("bankName")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Gateway Routing Number</MyText>
              <Box className="pr-2" />
              <MyText primary>{achGetValues("gatewayRoutingNumber")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>RDFI Number Qualifier</MyText>
              <Box className="pr-2" />
              <MyText primary>{achGetValues("rdfiNumberQualifier")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Country Code</MyText>
              <Box className="pr-2" />
              <MyText primary>{achGetValues("address.countryCode")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>State</MyText>
              <Box className="pr-2" />
              <MyText primary>{achGetValues("address.state")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>City</MyText>
              <Box className="pr-2" />
              <MyText primary>{achGetValues("address.city")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Street Address</MyText>
              <Box className="pr-2" />
              <MyText primary>{achGetValues("address.line1")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Postal Code</MyText>
              <Box className="pr-2" />
              <MyText primary>{achGetValues("address.postalCode")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Divider className="w-1/2" />
            <Box className="pb-2"></Box>
          </>
        )}
        {braidAdded && (
          <>
            {!achAdded && (
              <>
                <Box className="pb-2"></Box>
                <Divider className="w-1/2" />
                <Box className="pb-2"></Box>
              </>
            )}
            <Box className="flex flex-row items-center">
              <MyText>Braid payment information</MyText>
              <IconButton
                style={{
                  padding: 0,
                  margin: 0,
                  color: "red",
                }}
                edge="end"
                onClick={() => {
                  setBraidAdded(false);
                }}
              >
                <DeleteOutlineRoundedIcon />
              </IconButton>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Account number</MyText>
              <Box className="pr-2" />
              <MyText primary>{braidGetValues("accountNumber")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Divider className="w-1/2" />
            <Box className="pb-2"></Box>
          </>
        )}
        {wireAdded && (
          <>
            {!braidAdded && (
              <>
                <Box className="pb-2"></Box>
                <Divider className="w-1/2" />
                <Box className="pb-2"></Box>
              </>
            )}
            <Box className="flex flex-row items-center">
              <MyText>Wire payment information</MyText>
              <IconButton
                style={{
                  padding: 0,
                  margin: 0,
                  color: "red",
                }}
                edge="end"
                onClick={() => {
                  setWireAdded(false);
                }}
              >
                <DeleteOutlineRoundedIcon />
              </IconButton>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Type</MyText>
              <Box className="pr-2" />
              <MyText primary>{wireGetValues("type")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Receiver Short Name</MyText>
              <Box className="pr-2" />
              <MyText primary>{wireGetValues("receiverShortName")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Receiver Routing Number</MyText>
              <Box className="pr-2" />
              <MyText primary>{wireGetValues("receiverRoutingNumber")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Intermediary FI Id Type</MyText>
              <Box className="pr-2" />
              <MyText primary>{wireGetValues("intermediaryFIIdType")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Intermediary FI Id Number</MyText>
              <Box className="pr-2" />
              <MyText primary>{wireGetValues("intermediaryFIIdNumber")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Intermediary FI Name</MyText>
              <Box className="pr-2" />
              <MyText primary>{wireGetValues("intermediaryFIName")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Intermediary FI Name</MyText>
              <Box className="pr-2" />
              <MyText primary>{wireGetValues("intermediaryFIName")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Intermediary FI State</MyText>
              <Box className="pr-2" />
              <MyText primary>
                {wireGetValues("intermediaryFIAddress.state")}
              </MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Intermediary FI City</MyText>
              <Box className="pr-2" />
              <MyText primary>
                {wireGetValues("intermediaryFIAddress.city")}
              </MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Intermediary FI Address line 1</MyText>
              <Box className="pr-2" />
              <MyText primary>
                {wireGetValues("intermediaryFIAddress.line1")}
              </MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Intermediary FI Address line 2</MyText>
              <Box className="pr-2" />
              <MyText primary>
                {wireGetValues("intermediaryFIAddress.line2")}
              </MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Intermediary FI Postal Code</MyText>
              <Box className="pr-2" />
              <MyText primary>
                {wireGetValues("intermediaryFIAddress.postalCode")}
              </MyText>
            </Box>
            <Box className="flex flex-row">
              <MyText>Intermediary FI Country Code</MyText>
              <Box className="pr-2" />
              <MyText primary>
                {wireGetValues("intermediaryFIAddress.countryCode")}
              </MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Beneficiary FI Id Type</MyText>
              <Box className="pr-2" />
              <MyText primary>{wireGetValues("beneficiaryFIIdType")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Beneficiary FI Id Number</MyText>
              <Box className="pr-2" />
              <MyText primary>{wireGetValues("beneficiaryIdNumber")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Beneficiary FI Name</MyText>
              <Box className="pr-2" />
              <MyText primary>{wireGetValues("beneficiaryFIName")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Beneficiary Account Number</MyText>
              <Box className="pr-2" />
              <MyText primary>
                {wireGetValues("beneficiaryAccountNumber")}
              </MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Beneficiary FI State</MyText>
              <Box className="pr-2" />
              <MyText primary>
                {wireGetValues("beneficiaryFIAddress.state")}
              </MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Beneficiary FI City</MyText>
              <Box className="pr-2" />
              <MyText primary>
                {wireGetValues("beneficiaryFIAddress.city")}
              </MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Beneficiary FI Address line 1</MyText>
              <Box className="pr-2" />
              <MyText primary>
                {wireGetValues("beneficiaryFIAddress.line1")}
              </MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Beneficiary FI Address line 2</MyText>
              <Box className="pr-2" />
              <MyText primary>
                {wireGetValues("beneficiaryFIAddress.line2")}
              </MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Beneficiary FI Postal Code</MyText>
              <Box className="pr-2" />
              <MyText primary>
                {wireGetValues("beneficiaryFIAddress.postalCode")}
              </MyText>
            </Box>
            <Box className="flex flex-row">
              <MyText>Beneficiary FI Country Code</MyText>
              <Box className="pr-2" />
              <MyText primary>
                {wireGetValues("beneficiaryFIAddress.countryCode")}
              </MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Country Code</MyText>
              <Box className="pr-2" />
              <MyText primary>{achGetValues("address.countryCode")}</MyText>
            </Box>
            <Box className="flex flex-row">
              <MyText>State</MyText>
              <Box className="pr-2" />
              <MyText primary>{wireGetValues("address.state")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>City</MyText>
              <Box className="pr-2" />
              <MyText primary>{wireGetValues("address.city")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Address line 1</MyText>
              <Box className="pr-2" />
              <MyText primary>{wireGetValues("address.line1")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Address line 2</MyText>
              <Box className="pr-2" />
              <MyText primary>{wireGetValues("address.line2")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Box className="flex flex-row">
              <MyText>Postal Code</MyText>
              <Box className="pr-2" />
              <MyText primary>{wireGetValues("address.postalCode")}</MyText>
            </Box>
            <Box className="flex flex-row">
              <MyText>Country Code</MyText>
              <Box className="pr-2" />
              <MyText primary>{wireGetValues("address.countryCode")}</MyText>
            </Box>
            <Box className="pb-2"></Box>
            <Divider className="w-1/2" />
            <Box className="pb-2"></Box>
          </>
        )}
        <Box className="pb-4"></Box>
        {submitting || (achAdded && braidAdded && wireAdded) ? (
          <></>
        ) : !addPaymentInfo ? (
          <Box className="w-fit">
            <MyTextButton
              icon={<AddIcon />}
              onClick={() => {
                setAddPaymentInfo(true);
              }}
            >
              Add Payment Information
            </MyTextButton>
          </Box>
        ) : (
          <>
            <RadioButton
              title="Payment Information Type"
              value={paymentInfoType}
              setValue={setPaymentInfoType}
              options={[
                !achAdded ? "ACH" : "",
                !braidAdded ? "Braid" : "",
                !wireAdded ? "Wire" : "",
              ]}
              layout="horizontal"
            />
            <Box className="pb-4"></Box>
            {paymentInfoType == "ACH" && (
              <>
                <MyText>Bank Account Type</MyText>
                <MyControlledTextField
                  name="bankAccountType"
                  displayName="Bank Account Type"
                  control={achControl}
                  errors={achErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: true,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Account number</MyText>
                <MyControlledTextField
                  name="accountNumber"
                  displayName="Account Number"
                  control={achControl}
                  errors={achErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: true,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Routing number</MyText>
                <MyControlledTextField
                  name="routingNumber"
                  displayName="Routing Number"
                  control={achControl}
                  errors={achErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: true,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Bank name</MyText>
                <MyControlledTextField
                  name="bankName"
                  displayName="Bank Name"
                  control={achControl}
                  errors={achErrors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: false,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Gateway Routing Number</MyText>
                <MyControlledTextField
                  name="gatewayRoutingNumber"
                  displayName="Gateway Routing Number"
                  control={achControl}
                  errors={achErrors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: false,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>RDFI Number Qualifier</MyText>
                <MyControlledAutocomplete
                  name="rdfiNumberQualifier"
                  displayName="RDFI Number Qualifier"
                  control={achControl}
                  errors={achErrors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: false,
                        }
                  }
                  value="NATIONAL_CLEARING_SYSTEM"
                  options={["NATIONAL_CLEARING_SYSTEM", "IBAN", "BIC"]}
                />
                <Box className="pb-4"></Box>
                <MyText>Address details</MyText>
                <Box className="pb-2"></Box>
                <MyText>Country Code</MyText>
                <MyControlledTextField
                  value={""}
                  displayName="Country Code"
                  name={"address.countryCode"}
                  control={achControl}
                  errors={achErrors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: false,
                        }
                  }
                />
                <Box className="pb-4"></Box>
                <MyText>State</MyText>
                <MyControlledTextField
                  value={""}
                  displayName="State"
                  name={"address.state"}
                  control={achControl}
                  errors={achErrors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: false,
                        }
                  }
                />
                <Box className="pb-4"></Box>
                <MyText>City</MyText>
                <MyControlledTextField
                  name="address.city"
                  displayName="City"
                  control={achControl}
                  errors={achErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: false,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Street Address</MyText>
                <MyControlledTextField
                  name="address.line1"
                  displayName="Account line 1"
                  control={achControl}
                  errors={achErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: false,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Postal Code</MyText>
                <MyControlledTextField
                  name="address.postalCode"
                  displayName="Postal Code"
                  control={achControl}
                  errors={achErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: false,
                        }
                  }
                  value=""
                />
              </>
            )}
            {paymentInfoType == "Braid" && (
              <>
                <MyText>Account number</MyText>
                <MyControlledTextField
                  name="accountNumber"
                  displayName="Account Number"
                  control={braidControl}
                  errors={braidErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: true,
                        }
                  }
                  value=""
                />
              </>
            )}
            {paymentInfoType == "Wire" && (
              <>
                <MyText>Wire Type</MyText>
                <MyControlledAutocomplete
                  value={wireType}
                  displayName="Wire Type"
                  name={"type"}
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: true,
                        }
                  }
                  customOnChange={(value: string) => {
                    setWireType(value);
                  }}
                  options={["DOMESTIC", "INTERNATIONAL"]}
                />
                <Box className="pb-4"></Box>
                <MyText>Beneficiary Address details</MyText>
                <Box className="pb-2"></Box>
                <MyText>State</MyText>
                <MyControlledTextField
                  value={""}
                  displayName="State"
                  name={"address.state"}
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: false,
                        }
                  }
                />
                <Box className="pb-4"></Box>
                <MyText>City</MyText>
                <MyControlledTextField
                  name="address.city"
                  displayName="City"
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: true,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Address line 1</MyText>
                <MyControlledTextField
                  name="address.line1"
                  displayName="Account line 1"
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: true,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Address line 2</MyText>
                <MyControlledTextField
                  name="address.line2"
                  displayName="Account line 2"
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: false,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Postal Code</MyText>
                <MyControlledTextField
                  name="address.postalCode"
                  displayName="Postal Code"
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: true,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Country Code</MyText>
                <MyControlledTextField
                  name="address.countryCode"
                  displayName="Country Code"
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: true,
                          validate: (value: string, _: any) => {
                            const countryCodeRegex = /^[A-Z]{2}$/;
                            if (!countryCodeRegex.test(value) || value == "") {
                              return "Country code must be 2 uppercase letters";
                            }
                          },
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Receiver Routing Number</MyText>
                <MyControlledTextField
                  name="receiverRoutingNumber"
                  displayName="Receiver Routing Number"
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: true,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Receiver Bank Short Name</MyText>
                <MyControlledTextField
                  name="receiverShortName"
                  displayName="Receiver Bank Short Name"
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: false,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Beneficiary FI Account Number</MyText>
                <MyControlledTextField
                  name="beneficiaryAccountNumber"
                  displayName="Beneficiary FI Account Number"
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: wireType == "INTERNATIONAL" ? true : false,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Beneficiary FI Name</MyText>
                <MyControlledTextField
                  name="beneficiaryFIName"
                  displayName="Beneficiary FI Name"
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: wireType == "INTERNATIONAL" ? true : false,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Beneficiary FI ID Type</MyText>
                <MyControlledAutocomplete
                  name="beneficiaryFIIdType"
                  displayName="Beneficiary FI ID Type"
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: wireType == "INTERNATIONAL" ? true : false,
                        }
                  }
                  options={["ABA", "BIC"]}
                  value="ABA"
                />
                <Box className="pb-4"></Box>
                <MyText>Beneficiary FI ID Number</MyText>
                <MyControlledTextField
                  name="beneficiaryIdNumber"
                  displayName="Beneficiary FI ID Number"
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: true,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Beneficiary FI Address</MyText>
                <Box className="pb-2"></Box>
                <MyText>State</MyText>
                <MyControlledTextField
                  value={""}
                  displayName="State"
                  name={"beneficiaryFIAddress.state"}
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: false,
                        }
                  }
                />
                <Box className="pb-4"></Box>
                <MyText>City</MyText>
                <MyControlledTextField
                  name="beneficiaryFIAddress.city"
                  displayName="City"
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: wireType == "INTERNATIONAL" ? true : false,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Address line 1</MyText>
                <MyControlledTextField
                  name="beneficiaryFIAddress.line1"
                  displayName="Account line 1"
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: wireType == "INTERNATIONAL" ? true : false,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Address line 2</MyText>
                <MyControlledTextField
                  name="beneficiaryFIAddress.line2"
                  displayName="Account line 2"
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: false,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Postal Code</MyText>
                <MyControlledTextField
                  name="beneficiaryFIAddress.postalCode"
                  displayName="Postal Code"
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: wireType == "INTERNATIONAL" ? true : false,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Country Code</MyText>
                <MyControlledTextField
                  name="beneficiaryFIAddress.countryCode"
                  displayName="Country Code"
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: wireType == "INTERNATIONAL" ? true : false,
                          validate: (value: string, _: any) => {
                            if (wireType == "INTERNATIONAL") {
                              const countryCodeRegex = /^[A-Z]{2}$/;
                              if (
                                !countryCodeRegex.test(value) ||
                                value == ""
                              ) {
                                return "Country code must be 2 uppercase letters";
                              }
                            }
                          },
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Address Type</MyText>
                <MyControlledAutocomplete
                  name="beneficiaryFIAddress.type"
                  displayName="Address Type"
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: wireType == "INTERNATIONAL" ? true : false,
                        }
                  }
                  value="OTHER"
                  options={["BUSINESS", "RESIDENCE", "MAILING", "OTHER"]}
                />
                <Box className="pb-4"></Box>
                <MyText>Intermediary FI Name</MyText>
                <MyControlledTextField
                  name="intermediaryFIName"
                  displayName="Intermediary FI Name"
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: false,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Intermediary FI ID Type</MyText>
                <MyControlledAutocomplete
                  name="intermediaryFIIdType"
                  displayName="Intermediary FI ID Type"
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: false,
                        }
                  }
                  options={["ABA", "BIC"]}
                  value="ABA"
                />
                <Box className="pb-4"></Box>
                <MyText>Intermediary FI ID Number</MyText>
                <MyControlledTextField
                  name="intermediaryFIIdNumber"
                  displayName="Intermediary FI ID Number"
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: false,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Intermediary FI Address</MyText>
                <Box className="pb-2"></Box>
                <MyText>State</MyText>
                <MyControlledTextField
                  value={""}
                  displayName="State"
                  name={"intermediaryFIAddress.state"}
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: false,
                        }
                  }
                />
                <Box className="pb-4"></Box>
                <MyText>City</MyText>
                <MyControlledTextField
                  name="intermediaryFIAddress.city"
                  displayName="City"
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: false,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Address line 1</MyText>
                <MyControlledTextField
                  name="intermediaryFIAddress.line1"
                  displayName="Account line 1"
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: false,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Address line 2</MyText>
                <MyControlledTextField
                  name="intermediaryFIAddress.line2"
                  displayName="Account line 2"
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: false,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Postal Code</MyText>
                <MyControlledTextField
                  name="intermediaryFIAddress.postalCode"
                  displayName="Postal Code"
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: false,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Country Code</MyText>
                <MyControlledTextField
                  name="intermediaryFIAddress.countryCode"
                  displayName="Country Code"
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: false,
                        }
                  }
                  value=""
                />
                <Box className="pb-4"></Box>
                <MyText>Address Type</MyText>
                <MyControlledAutocomplete
                  name="intermediaryFIAddress.type"
                  displayName="Address Type"
                  control={wireControl}
                  errors={wireErrors}
                  rules={
                    submitting
                      ? { required: false, pattern: null }
                      : {
                          required: false,
                        }
                  }
                  value=""
                  options={["BUSINESS", "RESIDENCE", "MAILING", "OTHER"]}
                />
                <Box className="pb-4"></Box>
              </>
            )}
            <Box className="pb-6"></Box>
            <Box className="flex flex-row">
              <MyTextButton
                onClick={() => {
                  setAddPaymentInfo(false);
                }}
                isCancel={true}
              >
                Cancel
              </MyTextButton>
              <div className="w-2"></div>
              <Box className="w-fit">
                <MyBlueButton
                  onClick={() => {
                    if (paymentInfoType == "ACH") {
                      achHandleSubmit(achOnSubmit)();
                    } else if (paymentInfoType == "Braid") {
                      braidHandleSubmit(braidOnSubmit)();
                    } else if (paymentInfoType == "Wire") {
                      wireHandleSubmit(wireOnSubmit)();
                    } else {
                      enqueueSnackbar("Invalid payment information type", {
                        variant: "error",
                      });
                    }
                  }}
                >
                  Add
                </MyBlueButton>
              </Box>
            </Box>
          </>
        )}
        <Box className="pb-10"></Box>
        <Box className="w-fit">
          <MyBlueButton
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
            submitting={submitting}
          >
            Create Counterparty
          </MyBlueButton>
        </Box>
      </Box>
    </form>
  );
};

export default CreateCounterpartyPage;
