"use client";

import { Compliance314A } from "@/core/api/ApiTypes";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import ItemRow from "@/core/components/Text/ItemRow";
import linkToCounterparty from "@/core/utils/link_to_counterparty";
import { timestampToDate } from "@/core/utils/date_time_util";
import { fetch314ARecord } from "@/redux/slices/314a_slice";
import { setTitle } from "@/redux/slices/AppSlice";
import { fetchCounterParty } from "@/redux/slices/CounterpartySlice";
import { useAppDispatch } from "@/redux/store/store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Compliance314aDetailsPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useParams();

  const [navigating, setNavigating] = useState(false);

  const [data, setData] = useState<"loading" | string | Compliance314A>(
    "loading"
  );

  const navigateToEntity = async (row: any) => {
    if (row.transactionPaymentId) {
      router.push(
        `/transactions/transactionHistory?paymentId=${row.transactionPaymentId}`
      );
    }
    if (row.uboId) {
      router.push(`/individuals/${row.individualId}`);
    } else if (row.businessName) {
      router.push(`/businesses/${row.businessId}`);
    } else if (row.individualName) {
      router.push(`/individuals/${row.individualId}`);
    } else if (row.counterpartyName) {
      setNavigating(true);
      dispatch(fetchCounterParty(row.counterpartyId)).then((cp: any) => {
        if (cp.payload) {
          const link = linkToCounterparty(cp.payload);
          if (link) {
            router.push(link);
          }
        }
        setNavigating(false);
      });
    }
  };

  useEffect(() => {
    dispatch(setTitle("314A Details"));
    dispatch(fetch314ARecord((params.id as string) || "0")).then(
      (response: any) => {
        setData(response.payload);
      }
    );
  }, [params]);

  return data == "loading" ? (
    <MyCircularProgressIndicator />
  ) : typeof data == "string" ? (
    <ErrorPage
      error={data}
      recoveryButtonTitle="Retry"
      recoveryButtonOnClick={() => {
        setData("loading");
        dispatch(fetch314ARecord((params.id as string) || "0")).then(
          (response: any) => {
            setData(response.payload);
          }
        );
      }}
    />
  ) : (
    <div
      style={navigating ? { pointerEvents: "none" } : {}}
      className="flex flex-row w-[700px] justify-between"
    >
      <div className="w-[350px]">
        <ItemRow title="314A ID" value={data.list314aId ?? ""}></ItemRow>
        <ItemRow
          title="Created"
          value={timestampToDate(data.createdAt ?? 0)}
        ></ItemRow>
        <div
          className="cursor-pointer"
          onClick={() => {
            navigateToEntity(data);
          }}
        >
          <div className="pointer-events-none">
            <ItemRow
              title="Entity"
              value={{
                value:
                  data.businessName ??
                  data.individualName ??
                  data.counterpartyName ??
                  data.transactionPaymentId ??
                  "Unknown",
                link: "asd",
              }}
            ></ItemRow>
          </div>
        </div>
        <ItemRow
          title="Entity Type"
          value={
            data.uboId
              ? "UBO"
              : data.businessName
              ? "Business"
              : data.individualName
              ? "Individual"
              : data.counterpartyName
              ? "Counterparty"
              : data.transactionPaymentId
              ? "Transaction"
              : "Unknown"
          }
        ></ItemRow>
        <ItemRow
          title="Alert ID"
          value={{
            value: data.alertId ?? "",
            link: `/alerts-and-cases/alerts/${data.alertId}`,
          }}
        ></ItemRow>
        <ItemRow title="Status" value={data.status ?? ""}></ItemRow>
        <ItemRow
          title="Updated"
          value={timestampToDate(data.updatedAt ?? 0)}
        ></ItemRow>
        <ItemRow title="Updated By" value={data.updatedBy ?? ""}></ItemRow>
        <div className="pb-4" />
      </div>
      <div className="w-[500px]">
        <ItemRow title="Note" value={data.note ?? ""}></ItemRow>
        {data.rawResults && (
          <ItemRow title="Raw Results" value={data.rawResults ?? ""}></ItemRow>
        )}
      </div>
      <div className="pb-4"></div>
    </div>
  );
};

export default Compliance314aDetailsPage;
