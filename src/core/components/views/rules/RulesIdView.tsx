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
import timestampToDate from "@/core/utils/timestampToDate";
import { Account, Counterparty, Product } from "@/core/api/ApiTypes";
import { fetchProduct } from "@/redux/slices/ProductSlice";
import { fetchAccount } from "@/redux/slices/AccountSlice";
import { fetchCounterParty } from "@/redux/slices/CounterpartySlice";
import linkToCounterparty from "@/core/utils/link_to_counterparty";
import MyRedButton from "../../Button/MyRedButton";
import { enqueueSnackbar } from "notistack";

type LimitsViewProps = {
  id: string;
};

const LimitsView: React.FC<LimitsViewProps> = ({ id }) => {
  const dispatch = useAppDispatch();

  const limit: LimitType = useSelector((state: any) => state.limits.limit);

  const [product, setProduct] = useState<Product | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [counterparty, setCounterparty] = useState<Counterparty | null>(null);

  const [deactivating, setDeactivating] = useState(false);

  useEffect(() => {
    dispatch(fetchLimit(id)).then((d: any) => {
      if (typeof d.payload != "string") {
        if (d.payload.productId != null) {
          dispatch(fetchProduct(d.payload.productId)).then((prod: any) => {
            setProduct(prod.payload);
          });
        } else {
        }

        if (d.payload.accountId != null) {
          dispatch(fetchAccount(d.payload.accountId)).then((acc: any) => {
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
    <div className="flex flex-row w-[650px] justify-between">
      <div className="w-[300px]">
        <ItemRow title="ID" value={limit.id?.toString() ?? ""} />
        <ItemRow title="Name" value={limit.limitName ?? ""} />
        <ItemRow title="Transaction type" value={limit.transactionType ?? ""} />
        <ItemRow title="Limit type" value={limit.limitType ?? ""} />
        <ItemRow title="Amount" value={toDollarFormat(limit.amount)} />
        <ItemRow title="Duration (days)" value={limit.durationDays ?? "-"} />
        <ItemRow title="Frequency" value={limit.frequencyMax ?? "-"} />
      </div>
      <div className="w-[300px]">
        {limit.productId && (
          <ItemRow
            title="Product"
            value={{
              value: product ? product.productName : limit.productId.toString(),
              link: `/configuration/products/${limit.productId}`,
            }}
          />
        )}
        {limit.accountId && (
          <>
            {account != null ? (
              <ItemRow
                title="Account"
                value={{
                  value: account.id,
                  link: `/accounts/${account.accountNumber}`,
                }}
              />
            ) : (
              <ItemRow title="Account" value={limit.accountId ?? ""} />
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
