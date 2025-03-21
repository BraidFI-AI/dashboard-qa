"use client";

import MyBlueButton from "@/core/components/Button/MyBlueButton";
import MyRedButton from "@/core/components/Button/MyRedButton";
import MyModal from "@/core/components/my_modal";
import MyText from "@/core/components/Text/Text";
import toDollarFormat from "@/core/utils/toDollarFormat";
import { useState } from "react";

type ConfirmTransactionProps = {
  data: { key: string; value: string }[];
  onConfirm: () => void;
  modalOpen: boolean;
  handleModalClose: () => void;
  height?: string;
  submitting?: boolean;
};

export default function ConfirmTransaction({
  data,
  onConfirm,
  modalOpen,
  handleModalClose,
  height = "335px",
  submitting = false,
}: ConfirmTransactionProps) {
  return (
    <MyModal
      modalOpen={modalOpen}
      handleModalClose={handleModalClose}
      height={height}
    >
      <div>
        <MyText size="lg">Confirm Transaction</MyText>
        <div className="pb-6" />
        <div className="flex flex-col gap-2">
          {data.map((item) => (
            <div
              key={item.key}
              className="flex flex-row gap-2 w-[300px] justify-between"
            >
              <MyText size="sm">{`${item.key}:`}</MyText>
              <MyText size="sm">{`${
                item.key.toLowerCase() == "amount"
                  ? toDollarFormat(item.value)
                  : item.value
              }`}</MyText>
            </div>
          ))}
        </div>
        <div className="pb-8" />
        <div className="flex justify-end gap-2">
          <div className="w-fit">
            <MyRedButton onClick={handleModalClose} submitting={submitting}>
              Edit
            </MyRedButton>
          </div>
          <div className="w-fit">
            <MyBlueButton onClick={onConfirm} submitting={submitting}>
              Confirm
            </MyBlueButton>
          </div>
        </div>
      </div>
    </MyModal>
  );
}
