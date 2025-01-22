"use client";

import {
  Product,
  Business,
  Individual,
  Account,
  Counterparty,
} from "@/core/api/ApiTypes";
import ItemRow from "@/core/components/Text/ItemRow";
import MyText from "@/core/components/Text/Text";
import timestampToDate from "@/core/utils/timestampToDate";
import { setTitle } from "@/redux/slices/AppSlice";
import {
  fetchCounterParty,
  updateCounterparty,
} from "@/redux/slices/CounterpartySlice";
import { fetchProduct } from "@/redux/slices/ProductSlice";
import { useAppDispatch } from "@/redux/store/store";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import CounterpartyDetailsView from "./counterparty_details_view";
import CounterpartyBraidDetailsView from "./counterparty_braid_details_view";
import CounterpartyACHDetailsView from "./counterparty_ach_details_view";
import CounterpartyWireDetailsView from "./counterparty_wire_details_view";
import { enqueueSnackbar } from "notistack";
import ErrorPage from "../../error_page";

interface CounterPartyViewProps {
  id: string;
  editable?: boolean;
}

const CounterPartyView: React.FC<CounterPartyViewProps> = ({
  id,
  editable = true,
}) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [counterparty, setCounterparty] = useState<Counterparty | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [individual, setIndividual] = useState<Individual | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isEditingAch, setIsEditingAch] = useState(false);
  const [isEditingWire, setIsEditingWire] = useState(false);
  const [isEditingBraid, setIsEditingBraid] = useState(false);

  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
    reset,
  } = useForm<Counterparty>({
    defaultValues: {
      ...counterparty,
    },
  });

  useEffect(() => {
    if (refresh) {
      setLoading(true);
      dispatch(setTitle("Counterparty"));
      dispatch(fetchCounterParty(parseInt(id))).then((data: any) => {
        if (data.payload) {
          reset({ ...data.payload });
          setCounterparty(data.payload);
          dispatch(setTitle(data.payload.name));
        }
        setLoading(false);
        setRefresh(false);
      });
    }
  }, [dispatch, id, refresh, reset]);

  const onSubmit: SubmitHandler<Counterparty> = (data: Counterparty) => {
    setSubmitting(true);

    if (counterparty) {
      let ach = data.ach == null && counterparty.ach == null ? null : {};
      if (ach != null) {
        ach = {
          id: isEditingAch ? data?.ach?.id : counterparty?.ach?.id,
          custId: isEditingAch ? data?.ach?.custId : counterparty?.ach?.custId,
          contactId: isEditingAch
            ? data?.ach?.contactId
            : counterparty?.ach?.contactId,
          bankAccountType: isEditingAch
            ? data?.ach?.bankAccountType
            : counterparty?.ach?.bankAccountType,
          routingNumber: isEditingAch
            ? data?.ach?.routingNumber
            : counterparty?.ach?.routingNumber,
          accountNumber: isEditingAch
            ? data?.ach?.accountNumber
            : counterparty?.ach?.accountNumber,
          bankName: isEditingAch
            ? data?.ach?.bankName
            : counterparty?.ach?.bankName,
          type: isEditingAch ? data?.ach?.type : counterparty?.ach?.type,
          instrumentType: isEditingAch
            ? data?.ach?.instrumentType
            : counterparty?.ach?.instrumentType,
          status: isEditingAch ? data?.ach?.status : counterparty?.ach?.status,
          blockedResults: isEditingAch
            ? data?.ach?.blockedResults
            : counterparty?.ach?.blockedResults,
          createdAt: isEditingAch
            ? data?.ach?.createdAt
            : counterparty?.ach?.createdAt,
          updatedAt: isEditingAch
            ? data?.ach?.updatedAt
            : counterparty?.ach?.updatedAt,
          rdfiNumberQualifier: isEditingAch
            ? data?.ach?.rdfiNumberQualifier
            : counterparty?.ach?.rdfiNumberQualifier,
          gatewayRoutingNumber: isEditingAch
            ? data?.ach?.gatewayRoutingNumber
            : counterparty?.ach?.gatewayRoutingNumber,
          address: {
            countryCode: isEditingAch
              ? data?.ach?.countryCode
              : counterparty?.ach?.countryCode,
            city: isEditingAch
              ? data?.ach?.receiverCity
              : counterparty?.ach?.receiverCity,
            line1: isEditingAch
              ? data?.ach?.receiverStreetAddress
              : counterparty?.ach?.receiverStreetAddress,
            postalCode: isEditingAch
              ? data?.ach?.receiverPostalCode
              : counterparty?.ach?.receiverPostalCode,
            state: isEditingAch
              ? data?.ach?.receiverState
              : counterparty?.ach?.receiverState,
          },
        };
      }

      let wire = data.wire == null && counterparty.wire == null ? null : {};
      if (wire != null) {
        wire = {
          id: isEditingWire ? data?.wire?.id : counterparty?.wire?.id,
          custId: isEditingWire
            ? data?.wire?.custId
            : counterparty?.wire?.custId,
          contactId: isEditingWire
            ? data?.wire?.contactId
            : counterparty?.wire?.contactId,
          name: isEditingWire ? data?.wire?.name : counterparty?.wire?.name,
          receiverShortName: isEditingWire
            ? data?.wire?.receiverShortName
            : counterparty?.wire?.receiverShortName,
          receiverRoutingNumber: isEditingWire
            ? data?.wire?.receiverRoutingNumber
            : counterparty?.wire?.receiverRoutingNumber,
          intermediaryFIIdType: isEditingWire
            ? data?.wire?.intermediaryFIIdType
            : counterparty?.wire?.intermediaryFIIdType,
          intermediaryFIIdNumber: isEditingWire
            ? data?.wire?.intermediaryFIIdNumber
            : counterparty?.wire?.intermediaryFIIdNumber,
          intermediaryFIName: isEditingWire
            ? data?.wire?.intermediaryFIName
            : counterparty?.wire?.intermediaryFIName,
          beneficiaryFIIdType: isEditingWire
            ? data?.wire?.beneficiaryFIIdType
            : counterparty?.wire?.beneficiaryFIIdType,
          beneficiaryIdNumber: isEditingWire
            ? data?.wire?.beneficiaryIdNumber
            : counterparty?.wire?.beneficiaryIdNumber,
          beneficiaryFIName: isEditingWire
            ? data?.wire?.beneficiaryFIName
            : counterparty?.wire?.beneficiaryFIName,
          beneficiaryAccountNumber: isEditingWire
            ? data?.wire?.beneficiaryAccountNumber
            : counterparty?.wire?.beneficiaryAccountNumber,
          beneficiaryFIAddress: {
            line1: isEditingWire
              ? (data?.wire as any).address?.line1
              : counterparty?.wire?.line1,
            line2: isEditingWire
              ? (data?.wire as any).address?.line2
              : counterparty?.wire?.line2,
            city: isEditingWire
              ? (data?.wire as any).address?.city
              : counterparty?.wire?.city,
            state: isEditingWire
              ? (data?.wire as any).address?.state
              : counterparty?.wire?.state,
            postalCode: isEditingWire
              ? (data?.wire as any).address?.postalCode
              : counterparty?.wire?.postalCode,
            countryCode: isEditingWire
              ? (data?.wire as any).address?.countryCode
              : counterparty?.wire?.countryCode,
            type: isEditingWire
              ? (data?.wire as any).address?.type
              : counterparty?.wire?.type,
          },
          intermediaryFIAddress: {
            line1: isEditingWire
              ? (data?.wire as any).address?.line1
              : counterparty?.wire?.line1,
            line2: isEditingWire
              ? (data?.wire as any).address?.line2
              : counterparty?.wire?.line2,
            city: isEditingWire
              ? (data?.wire as any).address?.city
              : counterparty?.wire?.city,
            state: isEditingWire
              ? (data?.wire as any).address?.state
              : counterparty?.wire?.state,
            postalCode: isEditingWire
              ? (data?.wire as any).address?.postalCode
              : counterparty?.wire?.postalCode,
            countryCode: isEditingWire
              ? (data?.wire as any).address?.countryCode
              : counterparty?.wire?.countryCode,
            type: isEditingWire
              ? (data?.wire as any).address?.type
              : counterparty?.wire?.type,
          },
          address: {
            line1: isEditingWire
              ? (data?.wire as any).address?.line1
              : counterparty?.wire?.line1,
            line2: isEditingWire
              ? (data?.wire as any).address?.line2
              : counterparty?.wire?.line2,
            city: isEditingWire
              ? (data?.wire as any).address?.city
              : counterparty?.wire?.city,
            state: isEditingWire
              ? (data?.wire as any).address?.state
              : counterparty?.wire?.state,
            postalCode: isEditingWire
              ? (data?.wire as any).address?.postalCode
              : counterparty?.wire?.postalCode,
            countryCode: isEditingWire
              ? (data?.wire as any).address?.countryCode
              : counterparty?.wire?.countryCode,
            type: isEditingWire
              ? (data?.wire as any).address?.type
              : counterparty?.wire?.type,
          },
          instrumentType: isEditingWire
            ? data?.wire?.instrumentType
            : counterparty?.wire?.instrumentType,
          status: isEditingWire
            ? data?.wire?.status
            : counterparty?.wire?.status,
          phone: isEditingWire ? data?.wire?.phone : counterparty?.wire?.phone,
          email: isEditingWire ? data?.wire?.email : counterparty?.wire?.email,
          blockedResults: isEditingWire
            ? data?.wire?.blockedResults
            : counterparty?.wire?.blockedResults,
          createdAt: isEditingWire
            ? data?.wire?.createdAt
            : counterparty?.wire?.createdAt,
          updatedAt: isEditingWire
            ? data?.wire?.updatedAt
            : counterparty?.wire?.updatedAt,
        };
      }

      let braid = data.braid == null && counterparty.braid == null ? null : {};
      if (braid != null) {
        braid = {
          id: isEditingBraid ? data?.braid?.id : counterparty?.braid?.id,
          custId: isEditingBraid
            ? data?.braid?.custId
            : counterparty?.braid?.custId,
          contactId: isEditingBraid
            ? data?.braid?.contactId
            : counterparty?.braid?.contactId,
          accountNumber: isEditingBraid
            ? data?.braid?.accountNumber
            : counterparty?.braid?.accountNumber,
          instrumentType: isEditingBraid
            ? data?.braid?.instrumentType
            : counterparty?.braid?.instrumentType,
          status: isEditingBraid
            ? data?.braid?.status
            : counterparty?.braid?.status,
          blockedResults: isEditingBraid
            ? data?.braid?.blockedResults
            : counterparty?.braid?.blockedResults,
          createdAt: isEditingBraid
            ? data?.braid?.createdAt
            : counterparty?.braid?.createdAt,
          updatedAt: isEditingBraid
            ? data?.braid?.updatedAt
            : counterparty?.braid?.updatedAt,
        };
      }

      const blockedResults = counterparty?.blockedResults;

      const updatedCounterparty = {
        id: isEditingDetails ? data.id : counterparty.id,
        name: isEditingDetails ? data.name : counterparty.name,
        type: isEditingDetails ? data.type : counterparty.type,
        email: isEditingDetails ? data.email : counterparty.email,
        phone: isEditingDetails ? data.phone : counterparty.phone,
        createDate: isEditingDetails
          ? data.createDate
          : counterparty.createDate,
        createdBy: isEditingDetails ? data.createdBy : counterparty.createdBy,
        updateDate: isEditingDetails
          ? data.updateDate
          : counterparty.updateDate,
        updatedBy: isEditingDetails ? data.updatedBy : counterparty.updatedBy,
        createdAt: isEditingDetails ? data.createdAt : counterparty.createdAt,
        updatedAt: isEditingDetails ? data.updatedAt : counterparty.updatedAt,
        individualId: isEditingDetails
          ? data.individualId
          : counterparty.individualId,
        businessId: isEditingDetails
          ? data.businessId
          : counterparty.businessId,
        productId: isEditingDetails ? data.productId : counterparty.productId,
        accountId: isEditingDetails ? data.accountId : counterparty.accountId,
        accountNumber: isEditingDetails
          ? data.accountNumber
          : counterparty.accountNumber,
        status: isEditingDetails ? data.status : counterparty.status,
        blockedResults: blockedResults,
        ach: ach,
        wire: wire,
        braid: braid,
        ofacId: counterparty.ofacId,
      };

      console.log("data:", updatedCounterparty);

      dispatch(
        updateCounterparty({
          id: parseInt(id),
          counterparty: updatedCounterparty as any,
        })
      ).then((p: any) => {
        if (typeof p.payload === "string") {
          enqueueSnackbar(p.payload, { variant: "error", persist: true });
        } else {
          setIsEditingDetails(false);
          setIsEditingAch(false);
          setIsEditingBraid(false);
          setIsEditingWire(false);
        }
        setRefresh(true);
        setSubmitting(false);
      });
    }
  };

  return (
    <div className="pb-10">
      {loading ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading Counterparty Details...</div>
        </div>
      ) : counterparty == null ? (
        <ErrorPage
          error="Error loading counterparty"
          recoveryButtonOnClick={() => {
            setLoading(true);
            dispatch(setTitle("Counterparty"));
            dispatch(fetchCounterParty(parseInt(id))).then((data: any) => {
              if (data.payload) {
                reset({ ...data.payload });
                setTitle(data.payload.firstName + " " + data.payload.lastName);
                setCounterparty(data.payload);
                dispatch(
                  setTitle(data.payload.firstName + " " + data.payload.lastName)
                );
              }
              setLoading(false);
            });
          }}
          recoveryButtonTitle="Retry"
        />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className={`${
              editable ? "w-[650px]" : "w-[680px]"
            } flex flex-row justify-between`}
          >
            <div className="flex flex-col w-[300px]">
              <CounterpartyDetailsView
                counterparty={counterparty}
                control={control}
                errors={errors}
                submitting={submitting}
                isEditing={isEditingDetails}
                setIsEditing={setIsEditingDetails}
                setRefresh={setRefresh}
                editable={editable}
              />
            </div>
            <div className="flex flex-col w-[300px]">
              <CounterpartyBraidDetailsView
                counterparty={counterparty}
                control={control}
                errors={errors}
                submitting={submitting}
                isEditing={isEditingBraid}
                setIsEditing={setIsEditingBraid}
                editable={editable}
              />
              <CounterpartyACHDetailsView
                counterparty={counterparty}
                control={control}
                errors={errors}
                submitting={submitting}
                isEditing={isEditingAch}
                setIsEditing={setIsEditingAch}
                editable={editable}
              />
              <CounterpartyWireDetailsView
                counterparty={counterparty}
                control={control}
                errors={errors}
                submitting={submitting}
                isEditing={isEditingWire}
                setIsEditing={setIsEditingWire}
                editable={editable}
              />
            </div>
          </div>
          {editable && (
            <div className="max-w-md">
              <Box className="pb-8"></Box>
              <Box className="w-fit">
                <MyBlueButton type="submit" submitting={submitting}>
                  Update Counterparty
                </MyBlueButton>
              </Box>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default CounterPartyView;
