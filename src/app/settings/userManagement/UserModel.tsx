"use client";

import { User } from "@/core/api/ApiTypes";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import MyText from "@/core/components/Text/Text";
import ItemRow from "@/core/components/Text/ItemRow";

type UserDetailsModalProps = {
  modalOpen: boolean;
  handleModalClose: any;
  user: User;
};

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
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
          <MyText size="lg">User Details</MyText>
          <div className="h-4"></div>
          <ItemRow title="Username" value={user.Username ?? ""}></ItemRow>
          <ItemRow title="Enabled" value={user.Enabled ?? ""}></ItemRow>
          <ItemRow title="Status" value={user.UserStatus ?? ""}></ItemRow>
          <ItemRow
            title="Tenant ID"
            value={
              user.Attributes?.filter((attr: any) => {
                return attr?.Name == "custom:tenantId";
              })?.[0]?.Value ?? ""
            }
          ></ItemRow>
          <ItemRow
            title="Email"
            value={
              user.Attributes?.filter((attr: any) => {
                return attr?.Name == "email";
              })?.[0]?.Value ?? ""
            }
          ></ItemRow>
          <ItemRow
            title="Created at"
            value={user.UserCreateDate ?? ""}
          ></ItemRow>
          <ItemRow
            title="Last updated"
            value={user.UserLastModifiedDate ?? ""}
          ></ItemRow>
        </Box>
      </Modal>
    </div>
  );
};

export default UserDetailsModal;
