"use client";

import { Card, Product } from "@/core/api/ApiTypes";
import { useAppDispatch } from "@/redux/store/store";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { setTitle } from "@/redux/slices/AppSlice";
import MyText from "@/core/components/Text/Text";
import timestampToDate from "@/core/utils/timestampToDate";
import { fetchCard } from "@/redux/slices/CardManagementSlice";
import Link from "next/link";
import ItemRow from "@/core/components/Text/ItemRow";
import { fetchProduct } from "@/redux/slices/ProductSlice";
import { useParams } from "next/navigation";

export default function CardPage() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<Card | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const params = useParams();
  useEffect(() => {
    dispatch(setTitle("Card"));
    dispatch(fetchCard(parseInt((params.id as string) || "0"))).then(
      (data: any) => {
        if (data.payload) {
          setCard(data.payload);
          dispatch(setTitle(data.payload.name));

          dispatch(fetchProduct(data.payload.productId)).then((prd: any) => {
            if (prd.payload) {
              setProduct(prd.payload);
            }
          });
        }
        setLoading(false);
      }
    );
  }, [dispatch, params.id]);

  return (
    <Box className="pb-10">
      {!loading && card != null ? (
        <div className="flex flex-row">
          <div className="w-[300px]">
            <ItemRow title="ID" value={card.id}></ItemRow>
            <ItemRow
              title="Product"
              value={{
                value: product
                  ? product.productName
                  : card.productId.toString(),
                link: `/configuration/products/${card.productId}`,
              }}
            ></ItemRow>
            <ItemRow title="Name" value={card.name}></ItemRow>
            <ItemRow
              title="Card Number Length"
              value={card.cardNumberLength}
            ></ItemRow>
            <ItemRow
              title="Random Card Number"
              value={card.randomCardNumber.toString()}
            ></ItemRow>
            <ItemRow
              title="Default for Product"
              value={card.defaultForProduct.toString()}
            ></ItemRow>
            <ItemRow
              title="Allow Cards"
              value={card.allowCards.toString()}
            ></ItemRow>
            <ItemRow
              title="Anonymous"
              value={card.anonymous.toString()}
            ></ItemRow>
            <ItemRow title="Bin" value={card.bin}></ItemRow>
            <ItemRow
              title="Allow ATM"
              value={card.allowAtm.toString()}
            ></ItemRow>
          </div>
          <div className="w-[300px]">
            <ItemRow
              title="Allow Ecommerce"
              value={card.allowEcommerce.toString()}
            ></ItemRow>
            <ItemRow
              title="Allow Moto"
              value={card.allowMoto.toString()}
            ></ItemRow>
            <ItemRow
              title="Allow POS"
              value={card.allowPos.toString()}
            ></ItemRow>
            <ItemRow
              title="Allow Tips"
              value={card.allowTips.toString()}
            ></ItemRow>
            <ItemRow title="Smart" value={card.smart.toString()}></ItemRow>
            <ItemRow
              title="Start Date"
              value={`${card.startDate[0]}-${card.startDate[1]}-${card.startDate[2]}`}
            ></ItemRow>
            <ItemRow
              title="End Date"
              value={`${card.endDate[0]}-${card.endDate[1]}-${card.endDate[2]}`}
            ></ItemRow>
            <ItemRow title="Active" value={card.active.toString()}></ItemRow>
            <ItemRow
              title="CreatedAt"
              value={timestampToDate(card.createdAt)}
            ></ItemRow>
            <ItemRow
              title="UpdatedAt"
              value={timestampToDate(card.updatedAt)}
            ></ItemRow>
          </div>
        </div>
      ) : !loading && card == null ? (
        <div className="w-full flex justify-center">Card Not Found</div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <CircularProgress></CircularProgress>
          <div>Loading card...</div>
        </div>
      )}
    </Box>
  );
}
