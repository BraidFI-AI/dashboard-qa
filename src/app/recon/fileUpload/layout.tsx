import React from "react";
import TabsProvider from "./tabs_provider";

export default function ReconFileUploadLayout({
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
