import React from "react";
import TabsProvider from "./TabsProvider";

export default function BusinessTabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <TabsProvider>{children}</TabsProvider>
    </div>
  );
}
