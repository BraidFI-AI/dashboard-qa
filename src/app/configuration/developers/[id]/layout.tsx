import React from "react";
import TabsProvider from "./TabsProvider";

export default function DevelopersTabsLayout({
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
