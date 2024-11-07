"use client";
import BraidLogoBlue from "../svgs/braid_logo_blue";
import MyText from "./Text/Text";

const PoweredByBraid = () => {
  return (
    <div className="flex flex-row pt-4 items-end">
      <MyText size={"sm"}>Powered by</MyText>
      <div className="pr-[2px]" />
      <div
        className="cursor-pointer"
        onClick={() => window.open("https://braidfi.com")}
      >
        <BraidLogoBlue />
      </div>
    </div>
  );
};

export default PoweredByBraid;
