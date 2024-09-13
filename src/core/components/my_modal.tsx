"use client";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import MyText from "@/core/components/Text/Text";
import ItemRow from "@/core/components/Text/ItemRow";
import { useState } from "react";
import { SCROLLBAR_STYLE } from "../constants";

interface MyModalProps {
  modalOpen: boolean;
  handleModalClose: any;
  children: any;
  width?: string;
  height?: string;
}

const MyModal: React.FC<MyModalProps> = ({
  children,
  modalOpen,
  handleModalClose,
  width,
  height = "500px",
}) => {
  const ModalBoxstyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: height,
    maxHeight: height,
    width: width ?? "500px",
    overflow: "auto",
  };

  return (
    <Modal
      open={modalOpen}
      onClose={handleModalClose}
      className={`overflow-auto`}
    >
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        className={`h-[500px] ${
          width ? `w-[${width}px` : "w-[500px]"
        } overflow-clip rounded-lg bg-white`}
      >
        <Box
          sx={ModalBoxstyle}
          id="myBox"
          className={`bg-white p-10 pb-4 rounded-lg ${SCROLLBAR_STYLE} scrollbar-track-rounded-full`}
        >
          {children}
        </Box>
      </div>
    </Modal>
  );
};

export default MyModal;
