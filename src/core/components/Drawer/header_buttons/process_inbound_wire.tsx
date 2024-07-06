"use client";

import { useState } from "react";
import MyBlueButton from "../../Button/MyBlueButton";
import InboundWireForm from "@/app/wire/processing/inbound_form";

const ProcessInboundWire = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div className="w-fit">
      <MyBlueButton
        submitting={submitting}
        onClick={() => {
          setModalOpen(true);
        }}
      >
        Incoming Transaction
      </MyBlueButton>
      <InboundWireForm
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
        submitting={submitting}
        setSubmitting={setSubmitting}
      ></InboundWireForm>
    </div>
  );
};

export default ProcessInboundWire;
