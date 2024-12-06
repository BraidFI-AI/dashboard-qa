"use client";

import { Counterparty } from "@/core/api/ApiTypes";
import MyBlueButton from "@/core/components/Button/MyBlueButton";
import ItemRow from "@/core/components/Text/ItemRow";
import MyText from "@/core/components/Text/Text";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import MyModal from "@/core/components/my_modal";
import {
  fetchCounterParty,
  updateCounterparty,
} from "@/redux/slices/CounterpartySlice";
import { useAppDispatch } from "@/redux/store/store";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

type NOCChangeModalParams = {
  handleModalClose: any;
  modalOpen: boolean;
  noc: any;
};

const parseCorrectedData = (correctedData: string) => {
  const split = correctedData.split(" ");
  return split.filter((s) => s != "");
};

const NOCChangeModal: React.FC<NOCChangeModalParams> = ({
  handleModalClose,
  modalOpen,
  noc,
}) => {
  const dispatch = useAppDispatch();
  const [counterparty, setCounterparty] = useState<
    "loading" | null | Counterparty
  >("loading");

  const [accountNumber, setAccountNumber] = useState<string | null>(null);
  const [rtn, setRTN] = useState<string | null>(null);
  const [transCode, setTransCode] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (noc.ach?.changeCode == "C01") {
      setAccountNumber(noc.ach?.correctedData);
    }
    if (noc.ach?.changeCode == "C02") {
      setRTN(noc.ach?.correctedData);
    }
    if (noc.ach?.changeCode == "C03") {
      setRTN(parseCorrectedData(noc.ach?.correctedData)?.[0]);
      setAccountNumber(parseCorrectedData(noc.ach?.correctedData)?.[1]);
    }
    if (noc.ach?.changeCode == "C05") {
      setTransCode(noc.ach?.correctedData);
    }
    if (noc.ach?.changeCode == "C06") {
      setAccountNumber(parseCorrectedData(noc.ach?.correctedData)?.[0]);
      setTransCode(parseCorrectedData(noc.ach?.correctedData)?.[1]);
    }
    if (noc.ach?.changeCode == "C07") {
      setRTN(parseCorrectedData(noc.ach?.correctedData)?.[0]);
      setAccountNumber(parseCorrectedData(noc.ach?.correctedData)?.[1]);
      setTransCode(parseCorrectedData(noc.ach?.correctedData)?.[2]);
    }
  }, [noc]);

  useEffect(() => {
    dispatch(fetchCounterParty(noc.counterpartyId)).then((data: any) => {
      setCounterparty(data.payload);
    });
  }, [dispatch, noc.counterpartyId]);

  return (
    <MyModal modalOpen={modalOpen} handleModalClose={handleModalClose}>
      <MyText size="lg">Change Invalid Data</MyText>
      <div className="pb-6" />
      <ItemRow title="Change code" value={noc.ach?.changeCode ?? ""} />
      <ItemRow title="Change reason" value={noc.ach?.changeReason ?? ""} />
      {counterparty == "loading" ? (
        <MyCircularProgressIndicator />
      ) : counterparty == null ? (
        <ErrorPage
          error="Error fetching counterparty"
          recoveryButtonTitle="Retry"
          recoveryButtonOnClick={() => {
            setCounterparty("loading");
            dispatch(fetchCounterParty(noc.counterpartyId)).then(
              (data: any) => {
                setCounterparty(data.payload);
              }
            );
          }}
        />
      ) : (
        <div className="flex flex-row justify-between">
          <div>
            <MyText size="lg">Counterparty data</MyText>
            <div className="pb-1" />
            <MyText>Account number</MyText>
            <MyText size="md">{counterparty.ach?.accountNumber ?? ""}</MyText>
            <div className="pb-4" />
            <MyText>Routing number</MyText>
            <MyText size="md">{counterparty.ach?.routingNumber ?? ""}</MyText>
            <div className="pb-4" />
            <MyText>Account type</MyText>
            <MyText size="md">{counterparty.ach?.bankAccountType ?? ""}</MyText>
            <div className="pb-6" />
            {(accountNumber != null &&
              accountNumber != counterparty.ach?.accountNumber) ||
            (rtn != null && rtn != counterparty.ach?.routingNumber) ||
            (transCode != null &&
              transCode != counterparty.ach?.bankAccountType) ? (
              <div className="w-[120px]">
                <MyBlueButton
                  submitting={submitting}
                  onClick={() => {
                    if (!counterparty.ach) {
                      enqueueSnackbar("Invalid data, please reload", {
                        variant: "error",
                        persist: true,
                      });
                      return;
                    }

                    setSubmitting(true);

                    const updatedCounterparty = structuredClone(counterparty);

                    if (noc.ach?.changeCode == "C01") {
                      updatedCounterparty.ach.accountNumber = accountNumber;
                    }
                    if (noc.ach?.changeCode == "C02") {
                      updatedCounterparty.ach.routingNumber = rtn;
                    }
                    if (noc.ach?.changeCode == "C03") {
                      updatedCounterparty.ach.routingNumber = rtn;
                      updatedCounterparty.ach.accountNumber = accountNumber;
                    }
                    if (noc.ach?.changeCode == "C05") {
                      updatedCounterparty.ach.bankAccountType = transCode;
                    }
                    if (noc.ach?.changeCode == "C06") {
                      updatedCounterparty.ach.accountNumber = accountNumber;
                      updatedCounterparty.ach.bankAccountType = transCode;
                    }
                    if (noc.ach?.changeCode == "C07") {
                      updatedCounterparty.ach.routingNumber = rtn;
                      updatedCounterparty.ach.accountNumber = accountNumber;
                      updatedCounterparty.ach.bankAccountType = transCode;
                    }

                    dispatch(
                      updateCounterparty({
                        id: noc.counterpartyId,
                        counterparty: updatedCounterparty,
                      })
                    ).then((upd: any) => {
                      if (typeof upd.payload == "string") {
                        enqueueSnackbar(upd.payload, {
                          variant: "error",
                          persist: true,
                        });
                      } else {
                        enqueueSnackbar("Counterparty updated successfully", {
                          variant: "success",
                        });
                      }
                      setSubmitting(false);

                      setCounterparty("loading");
                      dispatch(fetchCounterParty(noc.counterpartyId)).then(
                        (data: any) => {
                          setCounterparty(data.payload);
                        }
                      );
                    });
                  }}
                >
                  Change
                </MyBlueButton>
              </div>
            ) : (
              <MyText>Data already corrected</MyText>
            )}
          </div>
          <div>
            <MyText size="lg">Corrected data</MyText>
            <div className="pb-1" />
            {accountNumber && (
              <>
                <MyText>Account number</MyText>
                <MyText size="md">{accountNumber}</MyText>
                <div className="pb-4" />
              </>
            )}
            {rtn && (
              <>
                <MyText>Routing number</MyText>
                <MyText size="md">{rtn}</MyText>
                <div className="pb-4" />
              </>
            )}
            {transCode && (
              <>
                <MyText>Transaction code</MyText>
                <MyText size="md">{transCode}</MyText>
              </>
            )}
          </div>
        </div>
      )}
      <div className="pb-4" />
    </MyModal>
  );
};

export default NOCChangeModal;
