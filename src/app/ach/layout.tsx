import React from "react";
import VoiceFlowChat from "./voice_flow_chat";

export default function BusinessTabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VoiceFlowChat>{children}</VoiceFlowChat>;
}
