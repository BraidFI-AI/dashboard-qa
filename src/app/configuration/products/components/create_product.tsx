"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyControlledTextField from "@/core/components/TextField/MyControlledTextField";
import { fetchProductIdsList } from "@/redux/slices/ach_return_slice";
import {
  createBusiness,
  fetchBusinesses,
  setRefresh,
} from "@/redux/slices/BusinessSlice";
import { SubmitHandler, useForm } from "react-hook-form";
import { Business, BusinessAddress, CreateProduct } from "@/core/api/ApiTypes";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch } from "@/redux/store/store";
import moment from "moment";
import MyText from "@/core/components/Text/Text";
import { ADMIN_OPS_ROLE, ADMIN_ROLE, States } from "@/core/constants";
import MyControlledAutocomplete from "@/core/components/Autocomplete/MyControlledAutocomplete";
import MyControlledDatePicker from "@/core/components/DateTimePicker/MyControlledDateTimePicker";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import { fetchTenetIdsListNew } from "@/redux/slices/DeveloperSlice";
import { fetchProgramIdsListWithNames } from "@/redux/slices/ProgramSlice";
import {
  createProduct,
  setRefreshProductsTable,
} from "@/redux/slices/ProductSlice";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { IconButton } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import MyTextField from "@/core/components/TextField/MyTextField";

const CreateProductPage = () => {
  const dispatch = useAppDispatch();

  const userType = useSelector((state: any) => state.app.userType);

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [submitting, setSubmitting] = useState(false);
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

  const [programIdsList, setProgramIdsList] = useState<
    "loading" | string | { name: string; id: string }[]
  >("loading");
  const [programId, setProgramId] = useState<string | null>(null);

  const [tenetIdsList, setTenetIdsList] = useState<
    "loading" | string | string[]
  >("loading");

  const [newEmail, setNewEmail] = useState<string>("");
  const [emails, setEmails] = useState<{ settlementEmail: string }[]>([]);

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
  } = useForm<CreateProduct>();
  const onSubmit: SubmitHandler<CreateProduct> = (data: any) => {
    if (programId == null) {
      enqueueSnackbar(`Please select Program first`, {
        variant: "error",
        persist: true,
      });
      return;
    }

    data = { ...data, programId: programId, productSettlementEmails: emails };

    setSubmitting(true);

    console.log(data);

    dispatch(createProduct(data)).then((d: any) => {
      if (d.payload != null) {
        enqueueSnackbar("Product Created Successfully", {
          variant: "success",
        });
        setDrawerOpen(false);
        dispatch(setRefreshProductsTable(true));
      }
      setSubmitting(false);
    });
  };

  useEffect(() => {
    if (!drawerOpen) {
      setEmails([]);
      setNewEmail("");
    }
  }, [drawerOpen]);

  useEffect(() => {
    dispatch(fetchProgramIdsListWithNames()).then((data: any) => {
      setProgramIdsList(data.payload);
      if (data.payload?.length > 0) {
        setProgramId(data.payload[0]?.id);
      }
    });

    dispatch(fetchTenetIdsListNew()).then((data: any) => {
      setTenetIdsList(data.payload);
    });
  }, [dispatch]);

  useEffect(() => {
    if (isSubmitted && !isValid) {
      console.log(errors);
      enqueueSnackbar("Invalid Fields", { variant: "error" });
    }
  }, [submitCount, errors, isSubmitted, isValid]);

  return !(userType == ADMIN_ROLE || userType == ADMIN_OPS_ROLE) ? (
    <></>
  ) : (
    <React.Fragment key="right">
      <Box className="w-auto">
        {!drawerOpen && (
          <div>
            <MyBlueButton onClick={toggleDrawer(true)}>
              Create Product
            </MyBlueButton>
          </div>
        )}
      </Box>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          className: "w-[780px]",
        }}
      >
        <Box className="flex flex-col px-4 pt-10 max-w-full">
          <div className="flex flex-row items-center">
            <div className="w-[5px] h-[40px] bg-[#12A7FF] mr-[10px]" />
            <MyText size="lg">Create Product</MyText>
          </div>
          <div className="flex flex-row w-[650px] justify-between pt-4">
            <Box className="flex flex-col w-[300px]">
              <MyText>Product Name</MyText>
              <MyControlledTextField
                name="productName"
                displayName="Program Name"
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
              <MyText>Developer Name</MyText>
              {tenetIdsList == "loading" ? (
                <MyCircularProgressIndicator />
              ) : typeof tenetIdsList == "string" ? (
                <ErrorPage
                  error={tenetIdsList}
                  recoveryButtonTitle="Retry"
                  recoveryButtonOnClick={() => {
                    dispatch(fetchTenetIdsListNew()).then((data: any) => {
                      setTenetIdsList(data.payload);
                    });
                  }}
                />
              ) : tenetIdsList.length == 0 ? (
                <MyText>No tenant found</MyText>
              ) : (
                <MyControlledAutocomplete
                  value={tenetIdsList[0]}
                  displayName="Developer Name"
                  name={"tenantId"}
                  control={control}
                  errors={errors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: true,
                        }
                  }
                  options={tenetIdsList}
                />
              )}
              <Box className="pb-4"></Box>
              <MyText>Program ID</MyText>
              {programIdsList == "loading" ? (
                <MyCircularProgressIndicator />
              ) : typeof programIdsList == "string" ? (
                <ErrorPage
                  error={programIdsList}
                  recoveryButtonTitle="Retry"
                  recoveryButtonOnClick={() => {
                    dispatch(fetchProgramIdsListWithNames()).then(
                      (data: any) => {
                        setProgramIdsList(data.payload);
                        if (data.payload?.length > 0) {
                          setProgramId(data.payload[0]?.id);
                        }
                      }
                    );
                  }}
                />
              ) : programIdsList.length == 0 ? (
                <MyText>No Program found</MyText>
              ) : (
                <MyControlledAutocomplete
                  value={`${programIdsList[0].id} - ${programIdsList[0].name}`}
                  displayName="Program Name"
                  name={"programId"}
                  control={control}
                  errors={errors}
                  rules={
                    submitting
                      ? { required: false }
                      : {
                          required: true,
                        }
                  }
                  options={programIdsList?.map((prg) => {
                    return `${prg.id} - ${prg.name}`;
                  })}
                  customOnChange={(val: string) => {
                    const id = val?.split(" - ")[0];
                    if (id) {
                      setProgramId(id);
                    }
                  }}
                />
              )}
              <Box className="pb-4"></Box>
              <MyText>Interest Rate</MyText>
              <MyControlledTextField
                name="interestRate"
                displayName="Interest Rate"
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
              <Box className="pb-4"></Box>
              <MyText>Is Active</MyText>
              <MyControlledAutocomplete
                name="isActive"
                displayName="isActive"
                control={control}
                errors={errors}
                options={["true", "false"]}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                value={"false"}
              />
              <Box className="pb-4"></Box>
              <MyText>Length</MyText>
              <MyControlledTextField
                name="length"
                displayName="Length"
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false, pattern: "" }
                    : {
                        required: true,
                        pattern: /^[0-9]+$/,
                      }
                }
                value=""
              />
              <Box className="pb-4"></Box>
              <MyText>Prefix</MyText>
              <MyControlledTextField
                name="prefix"
                displayName="Prefix"
                control={control}
                errors={errors}
                rules={{}}
                value=""
              />
              <Box className="pb-4"></Box>
              <MyText>Suffix</MyText>
              <MyControlledTextField
                name="suffix"
                displayName="Suffix"
                control={control}
                errors={errors}
                rules={{}}
                value=""
              />
              <Box className="pb-8"></Box>
            </Box>
            <Box className="flex flex-col w-[300px]">
              <MyText>Settlement Emails</MyText>
              {emails?.map((email, index) => (
                <div
                  key={index}
                  className="flex flex-row justify-between items-center"
                >
                  <MyText size="md">{email.settlementEmail ?? ""}</MyText>
                  <IconButton
                    onClick={() => {
                      emails?.splice(index, 1);
                      setEmails([...emails]);
                    }}
                  >
                    <DeleteOutlineRoundedIcon className="text-red-500" />
                  </IconButton>
                </div>
              ))}
              <MyTextField value={newEmail} setValue={setNewEmail} />
              <div className="w-fit pt-2">
                <MyBlueButton
                  onClick={() => {
                    if (newEmail == "") {
                      enqueueSnackbar("Email cannot be empty", {
                        variant: "error",
                      });
                      return;
                    }
                    const chars = newEmail.split("");
                    if (
                      !(
                        chars.filter((c) => c == "@").length == 1 &&
                        chars.filter((c) => c == ".").length >= 1
                      )
                    ) {
                      enqueueSnackbar("Invalid Email", {
                        variant: "error",
                      });
                      return;
                    }

                    if (
                      emails.find((e) => e.settlementEmail == newEmail) !=
                      undefined
                    ) {
                      enqueueSnackbar("Email already added", {
                        variant: "error",
                      });
                      return;
                    }

                    let newEmails = [...emails, { settlementEmail: newEmail }];

                    setEmails(newEmails);

                    setNewEmail("");
                  }}
                >
                  Add Email
                </MyBlueButton>
              </div>
              <Box className="pb-4"></Box>
              <MyText>Settlement Phone Number</MyText>
              <MyControlledTextField
                name="settlementPhoneNumber"
                displayName="Settlement Phone Number"
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
              <Box className="pb-4"></Box>
              <MyText>Bank Name</MyText>
              <MyControlledTextField
                name="bankName"
                displayName="Bank Name"
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
              <MyText>Account Type</MyText>
              <MyControlledAutocomplete
                value={"CHECKING"}
                displayName="Account Type"
                name={"accountType"}
                control={control}
                errors={errors}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                options={["CHECKING", "SAVINGS", "BOTH"]}
              />
              <Box className="pb-4"></Box>
              <MyText>Duplicate Payment Days</MyText>
              <MyControlledTextField
                name="duplicatePaymentDays"
                displayName="Duplicate Payment Days"
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
              <MyText>Interest Pay Day of Month</MyText>
              <MyControlledTextField
                name="interestPayDayOfMonth"
                displayName="Interest Pay Day of Month"
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
              <Box className="pb-4"></Box>
              <MyText>Customer Account Type</MyText>
              <MyControlledAutocomplete
                name="customerAccountType"
                displayName="Customer Account Type"
                control={control}
                errors={errors}
                options={["BUSINESS", "INDIVIDUAL", "BOTH"]}
                rules={
                  submitting
                    ? { required: false }
                    : {
                        required: true,
                      }
                }
                value={"BUSINESS"}
              />
              <Box className="pb-8"></Box>
              <Box className="w-40">
                <MyBlueButton
                  submitting={submitting}
                  onClick={() => {
                    handleSubmit(onSubmit)();
                  }}
                >
                  Create Product
                </MyBlueButton>
              </Box>
              <div className="pb-4" />
            </Box>
          </div>
        </Box>
      </Drawer>
    </React.Fragment>
  );
};

export default CreateProductPage;
