"use client";

import { ACH } from "@/core/api/ApiTypes";
import ItemRow from "@/core/components/Text/ItemRow";
import MyText from "@/core/components/Text/Text";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import toDollarFormat from "@/core/utils/toDollarFormat";
interface ACHModelProps {
  ach: ACH;
  modalOpen: boolean;
  handleModalClose: any;
}

const ACHModelView: React.FC<ACHModelProps> = ({
  ach,
  modalOpen,
  handleModalClose,
}) => {
  const ModalBoxstyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxHeight: "500px",
    width: "500px",
    overflow: "auto",
  };

  return (
    <div className="p-2 bg-white rounded-lg overflow-hidden">
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        className="overflow-auto"
      >
        <Box
          sx={ModalBoxstyle}
          className="bg-white p-10 pb-4 rounded-lg scrollbar-thin scrollbar-thumb-[#12A7FF] scrollbar-thumb-rounded-lg"
        >
          <MyText size="lg">ACH Details</MyText>
          <div className="h-4"></div>
          <ItemRow title="ID" value={ach.id ?? ""}></ItemRow>
          <ItemRow title="Product ID" value={ach.productId ?? ""}></ItemRow>
          <ItemRow title="Account ID" value={ach.accountId ?? ""}></ItemRow>
          <ItemRow title="Inbound" value={ach.inbound ?? ""}></ItemRow>
          <ItemRow
            title="Amount"
            value={toDollarFormat(ach.amount ?? "")}
          ></ItemRow>
          <ItemRow title="Description" value={ach.description ?? ""}></ItemRow>
          <ItemRow title="Direction" value={ach.direction ?? ""}></ItemRow>
          <ItemRow title="Return Code" value={ach.returnCode ?? ""}></ItemRow>
          <ItemRow
            title="Return Reason"
            value={ach.returnReason ?? ""}
          ></ItemRow>
          <ItemRow title="Change Code" value={ach.changeCode ?? ""}></ItemRow>
          <ItemRow
            title="Change Reason"
            value={ach.changeReason ?? ""}
          ></ItemRow>
          <ItemRow
            title="Corrected Data"
            value={ach.correctedData ?? ""}
          ></ItemRow>
          <ItemRow
            title="Corrected In File"
            value={ach.correctedInFile ?? ""}
          ></ItemRow>
          <ItemRow title="Sec Code" value={ach.secCode ?? ""}></ItemRow>
          <ItemRow title="Service" value={ach.service ?? ""}></ItemRow>
          <ItemRow
            title="Scheduled Settlement"
            value={ach.scheduledSettlement ?? ""}
          ></ItemRow>
          <ItemRow title="Trace Number" value={ach.traceNumber ?? ""}></ItemRow>
          <ItemRow title="Initiated At" value={ach.initiatedAt ?? ""}></ItemRow>
          <ItemRow title="Submitted At" value={ach.submittedAt ?? ""}></ItemRow>
          <ItemRow
            title="Settlement File Name"
            value={ach.settlementFileName ?? ""}
          ></ItemRow>
          <ItemRow
            title="NOC Received At"
            value={ach.nocReceivedAt ?? ""}
          ></ItemRow>
          <ItemRow title="Updated At" value={ach.updatedAt ?? ""}></ItemRow>
          <ItemRow title="Status" value={ach.status ?? ""}></ItemRow>
        </Box>
      </Modal>
    </div>
  );
};

export default ACHModelView;
