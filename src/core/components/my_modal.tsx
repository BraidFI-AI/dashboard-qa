"use client";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import MyText from "@/core/components/Text/Text";
import ItemRow from "@/core/components/Text/ItemRow";
import { useState } from "react";

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
      className="overflow-auto"
    >
      <Box
        sx={ModalBoxstyle}
        className="bg-white p-10 pb-4 rounded-lg scrollbar-thin scrollbar-thumb-[#12A7FF] scrollbar-thumb-rounded-lg"
      >
        {children}
      </Box>
    </Modal>
  );
};

export default MyModal;
