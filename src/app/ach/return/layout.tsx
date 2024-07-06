import React from "react";
import ACHReturnTabsProvider from "./tabs_provider";

export default function AccountsTabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ACHReturnTabsProvider>{children}</ACHReturnTabsProvider>
    </div>
  );
}
