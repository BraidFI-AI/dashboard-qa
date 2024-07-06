import IconButton from "@mui/material/IconButton";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Box from "@mui/material/Box";

type MyEditButtonProps = {
  editing: boolean;
  setEditing?: any;
  customSetEditing?: any;
  editable?: boolean;
};

const MyEditButton: React.FC<MyEditButtonProps> = ({
  editing,
  setEditing,
  customSetEditing,
  editable = true,
}) => {
  return editable ? (
    <Box className="pl-2">
      <IconButton
        className="p-1 text-slate-400"
        onClick={() => {
          if (customSetEditing != null) {
            customSetEditing();
            return;
          }
          if (setEditing != null) {
            setEditing(editing ? false : true);
            return;
          }
        }}
      >
        <EditRoundedIcon />
      </IconButton>
    </Box>
  ) : (
    <Box className="w-1 h-[20px]"></Box>
  );
};

export default MyEditButton;
