"use client";

import { Case } from "@/core/api/ApiTypes";
import MyCircularProgressIndicator from "@/core/components/circular_progress_indicator";
import ErrorPage from "@/core/components/error_page";
import MyTable from "@/core/components/Table/MyTable";
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

const CaseTimelinesPage = () => {
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
      {c.caseTimelines.length == 0 ? (
        <MyText>No timeline</MyText>
      ) : (
        <div className="h-full">
          <div className="h-full">
            <MyTable
              handleRowClick={(params: any) => {}}
              handleCellClick={(
                params: GridCellParams,
                event: MuiEvent<React.MouseEvent>
              ) => {}}
              columns={[
                {
                  field: "id",
                  headerName: "Timeline ID",
                  flex: 1,
                  minWidth: 120,
                },
                {
                  field: "username",
                  headerName: "Username",
                  flex: 1,
                  minWidth: 120,
                },
                {
                  field: "actionDateTime",
                  headerName: "Action Time",
                  flex: 1,
                  minWidth: 140,
                  display: "flex",
                  renderCell: (params: any) => (
                    <div>{timestampToDate(params.row.actionDateTime)}</div>
                  ),
                  valueGetter: (value: any, row: any) =>
                    timestampToDate(row.actionDateTime),
                },
                {
                  field: "action",
                  headerName: "Action",
                  flex: 1,
                  minWidth: 160,
                },
              ]}
              rows={c.caseTimelines}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CaseTimelinesPage;
