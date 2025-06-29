"use client";

import {
  CustomizableForm,
  CustomizableFormQuestion,
  Product,
  Program,
} from "@/core/api/ApiTypes";
import { fetchForm } from "@/redux/slices/CustomizableFormSlice";
import { useAppDispatch } from "@/redux/store/store";
import { Suspense, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import MyText from "@/core/components/Text/Text";
import ItemRow from "@/core/components/Text/ItemRow";
import { useParams, useSearchParams } from "next/navigation";
import { timestampToDate } from "@/core/utils/date_time_util";
import { fetchProgram } from "@/redux/slices/ProgramSlice";
import { fetchProduct } from "@/redux/slices/ProductSlice";

const Form = () => {
  const searchParams = useSearchParams();
  const [version, setVersion] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<CustomizableForm | null>(null);
  const params = useParams();
  const [program, setProgram] = useState<Program | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const current = new URLSearchParams(searchParams.toString());

    const v = current.get("version");
    if (v != null && v != "") {
      setVersion(parseInt(v));
    }

    let ver = undefined;
    if (version) {
      ver = version;
    }
    dispatch(
      fetchForm({
        id: parseInt((params.id as string) || "0"),
        version: ver,
      })
    ).then((data: any) => {
      setForm(data.payload);
      setLoading(false);

      if (data.payload) {
        dispatch(fetchProgram(data.payload.programId)).then((prg: any) => {
          setProgram(prg.payload);
        });

        dispatch(fetchProduct(data.payload.productId)).then((prd: any) => {
          setProduct(prd.payload);
        });
      }
    });
  }, [dispatch, params.id, version, searchParams]);

  return (
    <Suspense>
      {loading ? (
        <div className="flex flex-col items-center justify-center pt-10">
          <CircularProgress></CircularProgress>
          <div>Loading Forms...</div>
        </div>
      ) : form == null ? (
        <MyText size="md">Form Not found</MyText>
      ) : (
        <>
          <ItemRow title="Form ID" value={form.questionSetId}></ItemRow>
          <ItemRow title="Form Version" value={form.version}></ItemRow>
          <ItemRow
            title="Program"
            value={{
              value: program ? program.name : form.programId.toString(),
              link: `/configuration/programs/${form.programId}`,
            }}
          ></ItemRow>
          <ItemRow
            title="Product"
            value={{
              value: product ? product.productName : form.productId.toString(),
              link: `/configuration/products/${form.productId}`,
            }}
          ></ItemRow>
          <ItemRow
            title="Created At"
            value={timestampToDate(form.createdAt)}
          ></ItemRow>
          <ItemRow
            title="Updated At"
            value={timestampToDate(form.updatedAt)}
          ></ItemRow>
          <div className="pb-4"></div>
        </>
      )}
    </Suspense>
  );
};

export default Form;
