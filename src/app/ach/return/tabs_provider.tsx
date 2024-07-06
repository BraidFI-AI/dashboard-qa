"use client";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ACHReturnTabsProvider = (props: any) => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState(0);
  // const params = useParams();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes("unauthorised_returns")) {
      setCurrentTab(1);
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
            label="Return Rate"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(`/ach/return`);
            }}
          />
          <Tab
            label="Unauthorised Returns"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(`/ach/return/unauthorised_returns`);
            }}
          />
        </Tabs>
      </Box>
      <div className="pb-6"></div>
      {props.children}
    </div>
  );
};

export default ACHReturnTabsProvider;
