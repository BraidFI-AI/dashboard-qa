"use client";

const WrapItem = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex-1 min-h-[25px] min-w-[300px]">{children}</div>;
};

export default WrapItem;
