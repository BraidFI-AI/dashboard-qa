"use client";

import MyLinkText from "./LinkText";
import MyText from "./Text";

const ItemRowHorizontal: React.FC<{
  title: string;
  value: string;
  colon?: boolean;
  link?: string;
}> = ({ title, value, colon = false, link = null }) => {
  return (
    <div className="flex flex-row w-full justify-between">
      <div className="pr-1">
        <MyText size="sm" color="text-[#677990]">
          {`${title}${colon ? ":" : ""}`}
        </MyText>
      </div>
      <div className="break-all">
        {link != null ? (
          <MyLinkText textProps={{ size: "sm" }} link={link}>
            {value}
          </MyLinkText>
        ) : (
          <MyText size="sm">{value}</MyText>
        )}
      </div>
    </div>
  );
};

export default ItemRowHorizontal;
