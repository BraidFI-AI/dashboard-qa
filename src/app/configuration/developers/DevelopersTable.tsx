"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { GridEventListener, GridValueFormatterParams } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { Developer } from "@/core/api/ApiTypes";
import CircularProgress from "@mui/material/CircularProgress";
import MyTable from "@/core/components/Table/MyTable";
import { useRouter } from "next/navigation";
import { fetchDevelopers } from "@/redux/slices/DeveloperSlice";
import MyText from "@/core/components/Text/Text";

const DevelopersTable = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const developers: Developer[] | null = useSelector(
    (state: any) => state.developer.developers
  );

  useEffect(() => {
    dispatch(fetchDevelopers()).then(() => {
      setLoading(false);
    });
  }, [dispatch]);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    router.push(`/configuration/developers/${params.row.tenantId}`);
  };

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <CircularProgress></CircularProgress>
          <div>Loading developers...</div>
        </div>
      ) : developers == null || developers.length == 0 ? (
        <MyText>No developer found</MyText>
      ) : (
        <MyTable
          handleRowClick={handleRowClick}
          customId={(row: Developer) => row.tenantId}
          columns={[
            {
              field: "tenantId",
              headerName: "Developer ID",
              minWidth: 160,
              maxWidth: 200,
            },
            {
              field: "name",
              headerName: "Name",
              flex: 1,
              minWidth: 160,
              maxWidth: 200,
            },
          ]}
          rows={developers}
        />
      )}
    </>
  );
};

export default DevelopersTable;
