"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { GridEventListener } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { Program } from "@/core/api/ApiTypes";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchPrograms } from "@/redux/slices/ProgramSlice";
import MyTable from "@/core/components/Table/MyTable";
import { useRouter } from "next/navigation";
import MyText from "@/core/components/Text/Text";

const ProgramsTable = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const programs: Program[] | null = useSelector(
    (state: any) => state.program.programs
  );

  useEffect(() => {
    dispatch(fetchPrograms()).then(() => {
      setLoading(false);
    });
  }, [dispatch]);

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    router.push(`/configuration/programs/${params.row.id}`);
  };

  return loading ? (
    <div className="flex flex-col items-center justify-center">
      <CircularProgress></CircularProgress>
      <div>Loading programs...</div>
    </div>
  ) : programs == null || programs.length == 0 ? (
    <MyText>No programs found</MyText>
  ) : (
    <MyTable
      handleRowClick={handleRowClick}
      columns={[
        { field: "id", headerName: "Program ID", width: 120 },
        {
          field: "name",
          headerName: "Name",
          flex: 1,
          minWidth: 120,
        },
        {
          field: "achOdfi",
          headerName: "ACH ODFI",
          flex: 1,
          minWidth: 120,
        },
        {
          field: "type",
          headerName: "Program Type",
          flex: 1,
          minWidth: 120,
        },
        {
          field: "operatingModel",
          headerName: "Operating Model",
          flex: 1,
          minWidth: 120,
        },
        {
          field: "isActive",
          headerName: "Status",
          flex: 1,
          minWidth: 120,
          valueFormatter: (params: any) => {
            if (params == null) {
              return "";
            }
            return (
              params.toString()[0].toUpperCase()[0] + params.toString().slice(1)
            );
          },
        },
      ]}
      rows={programs}
    />
  );
};

export default ProgramsTable;
