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
import { timestampToDate } from "@/core/utils/date_time_util";
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
import CounterpartyDetailsView from "./counterparty_details_view";
import CounterpartyBraidDetailsView from "./counterparty_braid_details_view";
import CounterpartyACHDetailsView from "./counterparty_ach_details_view";
import CounterpartyWireDetailsView from "./counterparty_wire_details_view";
import { enqueueSnackbar } from "notistack";
import ErrorPage from "../../error_page";
import Tabs from "@mui/material/Tabs";
import { Tab } from "@mui/material";
import { boxStyle } from "@/core/constants";
import MyCircularProgressIndicator from "../../circular_progress_indicator";

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
  const [submitting, setSubmitting] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [isEditingAch, setIsEditingAch] = useState(false);
  const [isEditingWire, setIsEditingWire] = useState(false);
  const [isEditingBraid, setIsEditingBraid] = useState(false);

  const [tabIndex, setTabIndex] = useState(0);
  const {
    formState: { errors, submitCount, isSubmitted, isValid },
    control,
    handleSubmit,
    reset,
    setValue,
  } = useForm<Counterparty>({
    defaultValues: {
      ...counterparty,
    },
  });

  useEffect(() => {
    if (!isEditingBraid) {
      setValue("braid", counterparty?.braid);
    }
  }, [isEditingBraid, counterparty?.braid, setValue]);

  useEffect(() => {
    if (!isEditingWire) {
      setValue("wire", counterparty?.wire);
    }
  }, [isEditingWire, counterparty?.wire, setValue]);

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
      // TODO -- make null or empty strings undefined for all fields. Make this a generic utility function

      dispatch(
        updateCounterparty({
          id: parseInt(id),
          counterparty: data as any,
        })
      ).then((p: any) => {
        if (typeof p.payload === "string") {
          enqueueSnackbar(p.payload, { variant: "error", persist: true });
        } else {
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
    <div>
      {loading ? (
        <div className="flex flex-col items-center justify-center pt-10 w-full h-full">
          <MyCircularProgressIndicator />
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
        <div className="flex flex-row w-full justify-between">
          <div className="w-full">
            {!editable && (
              // TODO -- make this clickable and go to the counterparty details page
              <div className="pt-6">
                <MyText variant="label" size="lg" weight="semibold">
                  {counterparty.name}
                </MyText>
              </div>
            )}
            <div className="pt-6 pb-6 pr-6 w-full" hidden={tabIndex !== 0}>
              {
                <div className={`w-full ${boxStyle} p-4 rounded-[10px]`}>
                  <CounterpartyDetailsView
                    counterparty={counterparty}
                    setRefresh={setRefresh}
                    editable={editable}
                    counterpartyId={id}
                  />
                </div>
              }
            </div>
            <div className="pt-6 pb-6 pr-6 w-full" hidden={tabIndex !== 1}>
              {
                <div className={`w-full ${boxStyle} p-4 rounded-[10px]`}>
                  <CounterpartyACHDetailsView
                    setRefresh={setRefresh}
                    counterparty={counterparty}
                    editable={editable}
                    counterpartyId={id}
                  />
                </div>
              }
            </div>
            <div className="pt-6 pb-6 pr-6 w-full" hidden={tabIndex !== 2}>
              {
                <div className={`w-full ${boxStyle} p-4 rounded-[10px]`}>
                  <CounterpartyWireDetailsView
                    counterparty={counterparty}
                    editable={editable}
                    counterpartyId={id}
                    setRefresh={setRefresh}
                  />
                </div>
              }
            </div>
          </div>
          <div
            className={`w-[220px] bg-[#f4f5f7] ${
              editable ? `h-[calc(100vh-137px)]` : "h-dvh rounded-r-[9px]"
            }`}
          >
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={tabIndex}
              onChange={(event, newValue) => {
                setTabIndex(newValue);
              }}
              // sx={{ borderRight: 1, borderColor: "divider" }}
            >
              <Tab label="Details" />
              <Tab label="ACH" />
              <Tab label="Wire" />
              <Tab label="Braid" />
            </Tabs>
          </div>
        </div>

        // {/* <form onSubmit={handleSubmit(onSubmit)}>
        //           <div
        //             className={`${
        //               counterparty.idNumber != null ||
        //               counterparty.idType != null ||
        //               counterparty.dateOfBirth != null
        //                 ? editable
        //                   ? "w-[950px]"
        //                   : "w-[980px]"
        //                 : editable
        //                 ? "w-[650px]"
        //                 : "w-[680px]"
        //             } flex flex-row justify-between`}
        //           >
        //             <div className="flex flex-col w-[300px]">
        // <CounterpartyDetailsView
        //   counterparty={counterparty}
        //   control={control}
        //   errors={errors}
        //   submitting={submitting}
        //   isEditing={isEditingDetails}
        //   setIsEditing={setIsEditingDetails}
        //   setRefresh={setRefresh}
        //   editable={editable}
        // />
        //             </div>
        // {(counterparty.idNumber != null ||
        //   counterparty.idType != null ||
        //   counterparty.dateOfBirth != null) && (
        //   <div className="flex flex-col w-[300px]">
        //     <IndividualCounterpartyDetails counterparty={counterparty} />
        //   </div>
        // )}
        //             <div className="flex flex-col w-[300px]">
        //               <CounterpartyBraidDetailsView
        //                 counterparty={counterparty}
        //                 control={control}
        //                 errors={errors}
        //                 submitting={submitting}
        //                 isEditing={isEditingBraid}
        //                 setIsEditing={setIsEditingBraid}
        //                 editable={editable}
        //               />
        //               <CounterpartyACHDetailsView
        //                 counterparty={counterparty}
        //                 control={control}
        //                 errors={errors}
        //                 submitting={submitting}
        //                 isEditing={isEditingAch}
        //                 setIsEditing={setIsEditingAch}
        //                 editable={editable}
        //               />
        // <CounterpartyWireDetailsView
        //   counterparty={counterparty}
        //   control={control}
        //   errors={errors}
        //   submitting={submitting}
        //   isEditing={isEditingWire}
        //   setIsEditing={setIsEditingWire}
        //   editable={editable}
        // />
        //             </div>
        //           </div>
        //           {editable && (
        //             <div className="max-w-md">
        //               <Box className="pb-8"></Box>
        //               <Box className="w-fit">
        //                 <MyBlueButton type="submit" submitting={submitting}>
        //                   Update Counterparty
        //                 </MyBlueButton>
        //               </Box>
        //             </div>
        //           )}
        //         </form> */
      )}
    </div>
  );
};

export default CounterPartyView;
