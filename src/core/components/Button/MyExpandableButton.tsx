import Button from "@mui/material/Button";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import MyText from "../Text/Text";
import React from "react";

type MyExpandableButtonProps = {
  title: string;
  expand: boolean;
  toggleExpand: any;
};

const MyExpandableButton: React.FC<MyExpandableButtonProps> = ({
  title,
  expand,
  toggleExpand,
}) => {
  return (
    <Button
      className="flex flex-row justify-between w-full hover:bg-transparent text-black"
      onClick={() => {
        toggleExpand(expand ? false : true);
      }}
      style={{ textTransform: "none" }}
    >
      <MyText size="lg">{title}</MyText>
      <div className="text-slate-500">
        {expand ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
      </div>
    </Button>
  );
};

export default MyExpandableButton;
