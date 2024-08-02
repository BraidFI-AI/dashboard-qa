"use client";

import { Account, Business, Individual, Product } from "@/core/api/ApiTypes";
import {
  fetchAccount,
  fetchAccountBalance,
  fetchIndividualOrBusiness,
  updateAccount,
  updateAccountStatusDev,
} from "@/redux/slices/AccountSlice";
import { useAppDispatch } from "@/redux/store/store";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import MyText from "@/core/components/Text/Text";
import ItemRow from "@/core/components/Text/ItemRow";
import timestampToDate from "@/core/utils/timestampToDate";
import { fetchProduct } from "@/redux/slices/ProductSlice";
import MyEditableTextField from "@/core/components/TextField/MyEditableTextField";
import { SubmitHandler, useForm } from "react-hook-form";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import { enqueueSnackbar } from "notistack";
import toDollarFormat from "@/core/utils/toDollarFormat";
import { setTitle } from "@/redux/slices/AppSlice";
import { useSelector } from "react-redux";
import {
  ADMIN_OPS_ROLE,
  ADMIN_ROLE,
  DEVELOPER_OPS_ROLE,
  DEVELOPER_ROLE,
} from "@/core/constants";

const AccountPage = () => {
  const params = useParams();

  const dispatch = useAppDispatch();

  const [account, setAccount] = useState<Account | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [customer, setCustomer] = useState<Business | Individual | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);

  const [balance, setBalance] = useState<{
    accountBalance: string;
    availableBalance: string;
  } | null>(null);

  const userType = useSelector((state: any) => state.app.userType);

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    getValues,
    handleSubmit,
    reset,
  } = useForm<{
    status: string;
    accountName?: string;
    canAcceptSweep?: string;
    fundingAccountNumber?: string;
    sweepAccountNumber?: string;
  }>();
  const onSubmit: SubmitHandler<{
    status: string;
    accountName?: string;
    canAcceptSweep?: string;
    fundingAccountNumber?: string;
    sweepAccountNumber?: string;
  }> = (data: {
    status: string;
    accountName?: string;
    canAcceptSweep?: string;
    fundingAccountNumber?: string;
    sweepAccountNumber?: string;
  }) => {
    console.log("data:", data);

    setSubmitting(true);

    if (userType == DEVELOPER_ROLE || userType == DEVELOPER_OPS_ROLE) {
      dispatch(
        updateAccountStatusDev({
          id: params.id.toString(),
          status: data.status,
        })
      ).then((acc: any) => {
        if (acc.payload) {
          enqueueSnackbar("Account status updated", { variant: "success" });
          setAccount(acc.payload);
          setEditing(false);
        }
        setSubmitting(false);
      });
    } else {
      if (data.canAcceptSweep == null || data.canAcceptSweep == "") {
        data.canAcceptSweep = undefined;
      }
      if (data.sweepAccountNumber == null || data.sweepAccountNumber == "") {
        data.sweepAccountNumber = undefined;
      }
      if (
        data.fundingAccountNumber == null ||
        data.fundingAccountNumber == ""
      ) {
        data.fundingAccountNumber = undefined;
      }

      dispatch(updateAccount({ id: params.id.toString(), ...data })).then(
        (acc: any) => {
          if (acc.payload) {
            enqueueSnackbar("Account status updated", { variant: "success" });
            setAccount(acc.payload);
            setEditing(false);
          }
          setSubmitting(false);
        }
      );
    }
  };

  useEffect(() => {
    dispatch(setTitle("Account"));

    dispatch(fetchAccount(params.id.toString())).then((data: any) => {
      if (data.payload) {
        reset({ status: data.payload.status });

        dispatch(fetchAccountBalance(data.payload.accountNumber)).then(
          (bal: any) => {
            setBalance(bal.payload);
          }
        );

        dispatch(fetchProduct(data.payload.productId)).then((prod: any) => {
          setProduct(prod.payload);
        });

        dispatch(fetchIndividualOrBusiness(data.payload.customerId)).then(
          (cust: any) => {
            setCustomer(cust.payload);
          }
        );
      }
      setAccount(data.payload);

      if (data.payload?.accountName != null) {
        dispatch(setTitle(data.payload.accountName));
      }

      setLoading(false);
    });
  }, [dispatch, params.id, reset]);

  return loading ? (
    <div className="flex flex-col items-center justify-center pt-10">
      <CircularProgress></CircularProgress>
      <div>Loading account...</div>
    </div>
  ) : account == null ? (
    <MyText>Account data not found</MyText>
  ) : (
    <div className="flex flex-row w-[650px] justify-between">
      <div className="w-[300px]">
        <ItemRow title="ID" value={account.id ?? ""}></ItemRow>
        <ItemRow
          title="Account number"
          value={account.accountNumber ?? ""}
        ></ItemRow>
        {userType == ADMIN_ROLE || userType == ADMIN_OPS_ROLE ? (
          <MyEditableTextField
            editing={editing}
            setEditing={setEditing}
            name="accountName"
            displayName="Account Name"
            control={control}
            errors={errors}
            rules={
              submitting
                ? { required: false }
                : {
                    required: true,
                  }
            }
            value={account.accountName ?? ""}
            submitting={false}
          />
        ) : (
          <ItemRow
            title="Account Name"
            value={account.accountName ?? ""}
          ></ItemRow>
        )}
        {userType == ADMIN_ROLE || userType == ADMIN_OPS_ROLE ? (
          <MyEditableTextField
            editing={editing}
            setEditing={setEditing}
            name="canAcceptSweep"
            displayName="Can Accept Sweep"
            control={control}
            errors={errors}
            rules={
              submitting
                ? { required: false }
                : {
                    required: false,
                  }
            }
            value={account.canAcceptSweep ?? ""}
            submitting={false}
            options={["true", "false"]}
          />
        ) : (
          <ItemRow
            title="Can Accept Sweep"
            value={account.canAcceptSweep ?? ""}
          ></ItemRow>
        )}
        {userType == ADMIN_ROLE || userType == ADMIN_OPS_ROLE ? (
          <MyEditableTextField
            editing={editing}
            setEditing={setEditing}
            name="fundingAccountNumber"
            displayName="Funding Account Number"
            control={control}
            errors={errors}
            rules={
              submitting
                ? { required: false }
                : {
                    required: false,
                  }
            }
            value={account.fundingAccountNumber ?? ""}
            submitting={false}
          />
        ) : (
          <ItemRow
            title="Funding Account Number"
            value={account.fundingAccountNumber ?? ""}
          ></ItemRow>
        )}
        {userType == ADMIN_ROLE || userType == ADMIN_OPS_ROLE ? (
          <MyEditableTextField
            editing={editing}
            setEditing={setEditing}
            name="sweepAccountNumber"
            displayName="Sweep Account Number"
            control={control}
            errors={errors}
            rules={
              submitting
                ? { required: false }
                : {
                    required: false,
                  }
            }
            value={account.sweepAccountNumber ?? ""}
            submitting={false}
          />
        ) : (
          <ItemRow
            title="Sweep Account Number"
            value={account.sweepAccountNumber ?? ""}
          ></ItemRow>
        )}

        {/* <ItemRow
          title="Account Name"
          value={account.accountName ?? ""}
        ></ItemRow> */}
        <MyEditableTextField
          editing={editing}
          setEditing={setEditing}
          name="status"
          displayName="Status"
          control={control}
          errors={errors}
          rules={
            submitting
              ? { required: false }
              : {
                  required: true,
                }
          }
          value={
            editing &&
            (userType == DEVELOPER_ROLE || userType == DEVELOPER_OPS_ROLE) &&
            account.status == "INACTIVE"
              ? "ACTIVE"
              : account.status ?? ""
          }
          submitting={false}
          options={
            userType == DEVELOPER_ROLE || userType == DEVELOPER_OPS_ROLE
              ? ["INACTIVE", "BLOCKED"]
              : ["INACTIVE", "BLOCKED", "ACTIVE"]
          }
        />
        <div className="w-fit">
          <MyBlueButton
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
            submitting={submitting}
          >
            Update Status
          </MyBlueButton>
        </div>
        <div className="h-10"></div>
      </div>
      <div className="w-[300px]">
        <ItemRow
          title="Customer ID"
          value={
            customer
              ? {
                  value:
                    customer.type == "BUSINESS"
                      ? (customer as Business).name
                      : (customer as Individual).firstName +
                        " " +
                        (customer as Individual).middleName +
                        " " +
                        (customer as Individual).lastName,
                  link: `${
                    customer
                      ? customer.type == "BUSINESS"
                        ? "/businesses/"
                        : "/individuals/"
                      : ""
                  }/${account.customerId}`,
                }
              : account.customerId?.toString() ?? ""
          }
        ></ItemRow>
        <ItemRow
          title="Product ID"
          value={
            product
              ? {
                  value: product.productName ?? "",
                  link: `/configuration/products/${account.productId}`,
                }
              : account.productId?.toString() ?? ""
          }
        ></ItemRow>
        <ItemRow
          title="Account Balance"
          value={toDollarFormat(balance?.accountBalance ?? "")}
        ></ItemRow>
        <ItemRow
          title="Available Balance"
          value={toDollarFormat(balance?.availableBalance ?? "")}
        ></ItemRow>
        <ItemRow
          title="Created Date"
          value={account.createdAt ? timestampToDate(account.createdAt) : ""}
        ></ItemRow>
        <ItemRow
          title="Updated Date"
          value={account.updatedAt ? timestampToDate(account.updatedAt) : ""}
        ></ItemRow>
      </div>
    </div>
  );
};

export default AccountPage;
