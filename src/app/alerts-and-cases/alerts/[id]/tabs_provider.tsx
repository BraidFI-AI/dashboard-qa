"use client";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TabsProvider = (props: any) => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState(0);
  const params = useParams();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes("alertNotes")) {
      setCurrentTab(1);
    } else if (pathname.includes("alertTimeline")) {
      setCurrentTab(2);
    } else if (pathname.includes("documents")) {
      setCurrentTab(3);
    } else {
      setCurrentTab(0);
    }
  }, [pathname]);

  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={currentTab}
          // onChange={(event, tab) => {
          //   setCurrentTab(tab);
          // }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            label="Alert Details"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/alerts-and-cases/alerts/${params.id.toString()}`
              );
            }}
          />
          <Tab
            label="Alert Notes"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/alerts-and-cases/alerts/${params.id.toString()}/alertNotes`
              );
            }}
          />
          <Tab
            label="Alert Timelines"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/alerts-and-cases/alerts/${params.id.toString()}/alertTimeline`
              );
            }}
          />
          <Tab
            label="Documents"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/alerts-and-cases/alerts/${params.id.toString()}/documents`
              );
            }}
          />
        </Tabs>
      </Box>
      <div className="pb-6"></div>
      {props.children}
    </div>
  );
};

export default TabsProvider;
