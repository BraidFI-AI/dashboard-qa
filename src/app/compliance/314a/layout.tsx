import React from "react";
import TabsProvider from "./tabs_provider";

export default function Compliance314aTabsLayout({
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
