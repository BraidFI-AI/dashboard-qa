"use client";

import {
  LimitType,
  deactivateLimit,
  fetchLimit,
} from "@/redux/slices/RulesAndLimitsSlice";
import { useAppDispatch } from "@/redux/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MyCircularProgressIndicator from "../../circular_progress_indicator";
import MyText from "../../Text/Text";
import ItemRow from "../../Text/ItemRow";
import toDollarFormat from "@/core/utils/toDollarFormat";
import { timestampToDate } from "@/core/utils/date_time_util";
import { Account, Counterparty, Product, Program } from "@/core/api/ApiTypes";
import { fetchProduct } from "@/redux/slices/ProductSlice";
import { fetchAccount } from "@/redux/slices/AccountSlice";
import { fetchCounterParty } from "@/redux/slices/CounterpartySlice";
import linkToCounterparty from "@/core/utils/link_to_counterparty";
import MyRedButton from "../../Button/MyRedButton";
import { enqueueSnackbar } from "notistack";
import MyBlueButton from "../../Button/MyBlueButton";
import { fetchProgramV2 } from "@/redux/slices/ProgramSlice";

type LimitsViewProps = {
  id: string;
};

const LimitsView: React.FC<LimitsViewProps> = ({ id }) => {
  const dispatch = useAppDispatch();

  const limit: LimitType = useSelector((state: any) => state.limits.limit);

  const [product, setProduct] = useState<Product | null>(null);
  const [program, setProgram] = useState<Program | null>(null);

  const [account, setAccount] = useState<"loading" | string | Account>(
    "loading"
  );
  const [counterparty, setCounterparty] = useState<Counterparty | null>(null);

  const [deactivating, setDeactivating] = useState(false);

  useEffect(() => {
    dispatch(fetchLimit(id)).then((d: any) => {
      if (typeof d.payload != "string") {
        if (d.payload.productId != null) {
          dispatch(fetchProduct(d.payload.productId)).then((prod: any) => {
            setProduct(prod.payload);
          });
        }
        if (d.payload.programId != null) {
          dispatch(fetchProgramV2(d.payload.programId)).then((prog: any) => {
            if (typeof prog.payload != "string") {
              setProgram(prog.payload);
            }
          });
        }

        if (d.payload.accountNumber != null) {
          setAccount("loading");
          dispatch(fetchAccount(d.payload.accountNumber)).then((acc: any) => {
            setAccount(acc.payload);
          });
        }

        if (d.payload.counterpartyId != null) {
          dispatch(fetchCounterParty(d.payload.counterpartyId)).then(
            (cpt: any) => {
              setCounterparty(cpt.payload);
            }
          );
        }
      }
    });
  }, [dispatch, id]);

  return limit == "loading" ? (
    <MyCircularProgressIndicator />
  ) : typeof limit == "string" ? (
    <MyText>{limit}</MyText>
  ) : (
    <div className="flex flex-row w-[750px] justify-between">
      <div className="w-[300px]">
        <ItemRow title="ID" value={limit.id?.toString() ?? ""} />
        <ItemRow title="Name" value={limit.limitName ?? ""} />
        <ItemRow title="Transaction type" value={limit.transactionType ?? ""} />
        <ItemRow title="Limit type" value={limit.limitType ?? ""} />
        <ItemRow title="Amount" value={toDollarFormat(limit.amount)} />
        <ItemRow title="Duration (days)" value={limit.durationDays ?? "-"} />
        <ItemRow title="Frequency" value={limit.frequencyMax ?? "-"} />
      </div>
      <div className="w-[400px]">
        {limit.programId && (
          <ItemRow
            title="Program"
            value={{
              value: program ? program.name : limit.programId.toString(),
              link: `/configuration/programs/${limit.programId}`,
            }}
          />
        )}
        {limit.productId && (
          <ItemRow
            title="Product"
            value={{
              value: product ? product.productName : limit.productId.toString(),
              link: `/configuration/products/${limit.productId}`,
            }}
          />
        )}
        {limit.accountNumber && (
          <>
            {account == "loading" ? (
              <ItemRow title="Account" value={limit.accountNumber ?? ""} />
            ) : typeof account == "string" ? (
              <div className="flex flex-row ">
                <ItemRow title="Account" value={limit.accountNumber ?? ""} />
                <div className="pl-4 w-fit">
                  <MyBlueButton
                    onClick={() => {
                      if (limit.accountNumber == null) return;
                      setAccount("loading");
                      dispatch(fetchAccount(limit.accountNumber)).then(
                        (acc: any) => {
                          setAccount(acc.payload);
                        }
                      );
                    }}
                  >
                    Retry fetching account details
                  </MyBlueButton>
                </div>
              </div>
            ) : (
              <ItemRow
                title="Account"
                value={{
                  value: account.id,
                  link: `/accounts/${account.accountNumber}`,
                }}
              />
            )}
          </>
        )}
        {limit.counterpartyId && (
          <ItemRow
            title="Counterparty"
            value={{
              value: counterparty
                ? `${counterparty.name}`
                : limit.counterpartyId.toString(),
              link: linkToCounterparty(counterparty) ?? "",
            }}
          />
        )}
        <ItemRow title="Action" value={limit.action ?? ""} />
        <ItemRow title="Status" value={limit.status ?? ""} />
        <ItemRow title="Created at" value={timestampToDate(limit.createdAt)} />
        <ItemRow title="Updated at" value={timestampToDate(limit.updatedAt)} />
        {limit.status == "ACTIVE" && (
          <div className="w-fit">
            <MyRedButton
              submitting={deactivating}
              onClick={() => {
                setDeactivating(true);
                dispatch(deactivateLimit(id)).then((lmt: any) => {
                  if (typeof lmt.payload != "string") {
                    enqueueSnackbar("Limit deactivated successfully", {
                      variant: "success",
                    });
                  } else {
                    enqueueSnackbar(lmt.payload, {
                      variant: "error",
                      persist: true,
                    });
                  }
                  setDeactivating(false);
                });
              }}
            >
              Deactivate Rule
            </MyRedButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default LimitsView;
