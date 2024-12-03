"use client";

import MyText from "./Text";

const ItemRowHorizontal: React.FC<{
  title: string;
  value: string;
}> = ({ title, value }) => {
  return (
    <div className="flex flex-row w-full justify-between">
      <div className="pr-1">
        <MyText size="sm" color="text-[#939DA6]">
          {`${title}:`}
        </MyText>
      </div>
      <div className="break-all">
        <MyText size="sm">{value}</MyText>
      </div>
    </div>
  );
};

export default ItemRowHorizontal;
