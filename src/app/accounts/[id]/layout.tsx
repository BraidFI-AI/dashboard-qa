import React from "react";
import TabsProvider from "./TabsProvider";

export default function AccountsTabsLayout({
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
