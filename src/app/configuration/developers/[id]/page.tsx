"use client";

import { useAppDispatch } from "@/redux/store/store";
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { setTitle } from "@/redux/slices/AppSlice";
import MyText from "@/core/components/Text/Text";
import ItemRow from "@/core/components/Text/ItemRow";
import { Developer } from "@/core/api/ApiTypes";
import { fetchDeveloper } from "@/redux/slices/DeveloperSlice";
import RequireRole from "@/core/components/RequireRole";
import { ADMIN_ROUTE } from "@/core/constants";

const DeveloperPage = ({ params }: { params: { id: string } }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [developer, setDeveloper] = useState<Developer | null>(null);

  useEffect(() => {
    dispatch(setTitle("Developer"));
    dispatch(fetchDeveloper(params.id)).then((data: any) => {
      if (data.payload) {
        setDeveloper(data.payload);
        dispatch(setTitle(data.payload.name));
      }
      setLoading(false);
    });
  }, [dispatch, params.id]);

  return loading ? (
    <div className="flex flex-col items-center justify-center">
      <CircularProgress></CircularProgress>
      <div>Fetching developer details...</div>
    </div>
  ) : developer == null ? (
    <MyText>Developer not found</MyText>
  ) : (
    <div className="">
      <ItemRow title="Tenant ID" value={developer.tenantId!}></ItemRow>
      <ItemRow title="Name" value={developer.name!}></ItemRow>
    </div>
  );
};

export default RequireRole(DeveloperPage, ADMIN_ROUTE);
