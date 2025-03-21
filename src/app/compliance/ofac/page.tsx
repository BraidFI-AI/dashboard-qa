"use client";

import Box from "@mui/material/Box";
import OFACHitsTable from "./OFACTable";
import { DEVELOPER_ROUTE } from "@/core/constants";
import RequireRole from "@/core/components/RequireRole";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { OFACSearch } from "@/core/api/ApiTypes";
import { setTitle } from "@/redux/slices/AppSlice";
import { useAppDispatch } from "@/redux/store/store";
import OFACFilters from "./ofac_filters";
import { fetchOFACHits } from "@/redux/slices/OFACSlice";

const OFAC = () => {
  const qParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState<OFACSearch | null>(null);

  useEffect(() => {
    dispatch(setTitle("OFAC"));

    const params: { [anyProp: string]: string | string[] } = {};

    qParams.forEach((value, key) => {
      if (value.includes(",")) {
        params[key] = value.split(",");
      } else {
        params[key] = value;
      }
    });

    console.log("ofoaccc params:", params);

    setFilters(params as OFACSearch);

    console.log("params:", params);

    const fetchAlertsHelper = () => {
      console.log("filters:", params);
      dispatch(fetchOFACHits({ refresh: true, filters: params }));
    };

    fetchAlertsHelper();
  }, [dispatch, qParams]);

  return (
    <Box className="flex flex-col h-full">
      <div className="pb-2 w-fit">
        <OFACFilters />
      </div>
      <OFACHitsTable filters={filters ?? {}} />
    </Box>
  );
};

export default RequireRole(OFAC, DEVELOPER_ROUTE);
