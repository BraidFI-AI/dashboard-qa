"use client";

import ReviewTransactionModal from "@/app/transactions/transactionReview/review_transaction_modal";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import ItemRow from "@/core/components/Text/ItemRow";
import MyText from "@/core/components/Text/Text";
import timestampToDate from "@/core/utils/timestampToDate";
import { setTitle } from "@/redux/slices/AppSlice";
import { fetchCase } from "@/redux/slices/cases_slice";
import { useAppDispatch } from "@/redux/store/store";
import { GridCellParams, MuiEvent } from "@mui/x-data-grid";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AlertsTable from "../../alerts/alerts_table";
import { Case } from "@/core/api/ApiTypes";

const CasesPage = () => {
  const dispatch = useAppDispatch();
  const params = useParams();

  const c: "loading" | string | Case = useSelector(
    (state: any) => state.cases.case
  );

  useEffect(() => {
    dispatch(setTitle("Case"));
    dispatch(fetchCase(params.id.toString())).then((data: any) => {
      if (typeof data.payload != "string") {
        dispatch(setTitle(data.payload.name));
      }
    });
  }, [dispatch, params.id]);

  return c == "loading" ? (
    <MyCircularProgressIndicator />
  ) : typeof c == "string" ? (
    <ErrorPage
      error={c}
      recoveryButtonTitle="Retry"
      recoveryButtonOnClick={() => {
        dispatch(fetchCase(params.id.toString())).then((data: any) => {
          if (typeof data.payload != "string") {
            dispatch(setTitle(data.payload.name));
          }
        });
      }}
    />
  ) : (
    <>
      <div className="flex flex-row w-[700px] justify-between">
        <div className="flex flex-col w-[300px]">
          <ItemRow title="Case ID" value={c.id ?? ""} />
          <ItemRow title="Tenant ID" value={c.tenantId ?? ""} />
        </div>
        <div className="flex flex-col w-[300px]">
          <ItemRow title="Name" value={c.name ?? ""} />
          <ItemRow title="Description" value={c.description ?? ""} />
        </div>
        <div>
          <ItemRow
            status={c.status == "CLOSED" ? true : false}
            title="Status"
            value={c.status ?? ""}
          />
        </div>
      </div>
      <MyText size="md">Linked Alerts</MyText>
      <div className="h-1" />
      <div style={{ height: "50vh" }}>
        <AlertsTable
          isPaginated={false}
          alerts={c.alerts}
          hideHeaders={true}
          filters={{}}
        />
      </div>
    </>
  );
};

export default CasesPage;
