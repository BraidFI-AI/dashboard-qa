"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { DataGrid, GridEventListener, GridToolbar } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { CustomizableForm } from "@/core/api/ApiTypes";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchForms } from "@/redux/slices/CustomizableFormSlice";
import MyText from "@/core/components/Text/Text";
import MyTable from "@/core/components/Table/MyTable";
import { useRouter } from "next/navigation";

const FormsTable = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const forms: CustomizableForm[] | null = useSelector(
    (state: any) => state.customizableForm.forms
  );

  useEffect(() => {
    dispatch(fetchForms()).then(() => {
      setLoading(false);
    });
  }, [dispatch]);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    router.push(`/configuration/forms/${params.row.questionSetId}`);
  };

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading Forms...</div>
        </div>
      ) : forms == null || forms.length == 0 ? (
        <MyText size="md">No Form found</MyText>
      ) : (
        <MyTable
          customId={(row: CustomizableForm) => row.questionSetId + row.version}
          handleRowClick={handleRowClick}
          columns={[
            {
              field: "questionSetId",
              headerName: "Form ID",
              flex: 1,
              minWidth: 150,
            },
            {
              field: "version",
              headerName: "Version",
              flex: 1,
              minWidth: 150,
            },
            {
              field: "programId",
              headerName: "Program ID",
              flex: 1,
              minWidth: 150,
            },
            {
              field: "productId",
              headerName: "Product ID",
              flex: 1,
              minWidth: 150,
            },
          ]}
          rows={forms}
        ></MyTable>
      )}
    </>
  );
};

export default FormsTable;
