"use client";

import { Business } from "@/core/api/ApiTypes";
import ItemRow from "@/core/components/Text/ItemRow";
import MyText from "@/core/components/Text/Text";
import { fetchBusiness } from "@/redux/slices/BusinessSlice";
import { useAppDispatch } from "@/redux/store/store";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { setTitle } from "@/redux/slices/AppSlice";

const ContactInformation = ({ params }: { params: { id: string } }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    dispatch(setTitle("Business Customer"));
    dispatch(fetchBusiness(parseInt(params.id))).then((data: any) => {
      if (data.payload) {
        setBusiness(data.payload);
        dispatch(setTitle(data.payload.name));
      }
      setLoading(false);
    });
  }, [dispatch, params.id]);

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading Business data...</div>
        </div>
      ) : business == null ? (
        <MyText size="md">Business not found</MyText>
      ) : (
        <>
          <ItemRow title="Business ID" value={business.id ?? ""}></ItemRow>
          <ItemRow
            title="Incorporation State"
            value={business.incorporationState ?? ""}
          ></ItemRow>
          <ItemRow title="Email" value={business.email ?? ""}></ItemRow>
          <ItemRow
            title="Email Verified"
            value={business.emailVerified?.toString() ?? ""}
          ></ItemRow>
          <ItemRow
            title="Phone number"
            value={business.mobilePhone ?? ""}
          ></ItemRow>
          <ItemRow
            title="Phone Number Verified"
            value={business.mobilePhoneVerified?.toString() ?? ""}
          ></ItemRow>
        </>
      )}
    </>
  );
};

export default ContactInformation;
