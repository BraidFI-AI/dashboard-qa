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

  const tabs = [
    {
      name: "Record Details",
      path: `/compliance/314a/${parseInt(params.id.toString())}`,
    },
    {
      name: "Check Log",
      path: `/compliance/314a/${parseInt(params.id.toString())}/checkLog`,
    },
  ];

  useEffect(() => {
    if (pathname.includes("checkLog")) {
      setCurrentTab(tabs.findIndex((tab) => tab.path.includes("checkLog")));
    } else {
      setCurrentTab(0);
    }
  }, [pathname]);

  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={currentTab} variant="scrollable" scrollButtons="auto">
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.name}
              style={{ textTransform: "none" }}
              onClick={() => {
                router.replace(tab.path);
              }}
            />
          ))}
        </Tabs>
      </Box>
      <div className="pb-6"></div>
      {props.children}
    </div>
  );
};

export default TabsProvider;
