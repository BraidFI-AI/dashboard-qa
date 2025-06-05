"use client";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RequireRole from "@/core/components/RequireRole";
import { ADMIN_ROUTE } from "@/core/constants";

const TabsProvider = (props: any) => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState(0);
  const params = useParams();
  const pathname = usePathname();

  const tabs = [
    {
      name: "Program Details",
      path: `/configuration/programs/${parseInt((params.id as string) || "0")}`,
    },
    {
      name: "Limits",
      path: `/configuration/programs/${parseInt(
        (params.id as string) || "0"
      )}/limits?programId=${parseInt((params.id as string) || "0")}`,
    },
    {
      name: "Fees",
      path: `/configuration/programs/${parseInt(
        (params.id as string) || "0"
      )}/fees`,
    },
  ];

  useEffect(() => {
    if (pathname.includes("/limits")) {
      setCurrentTab(tabs.findIndex((tab) => tab.path.includes("/limits")));
    } else if (pathname.includes("/fees")) {
      setCurrentTab(tabs.findIndex((tab) => tab.path.includes("/fees")));
    } else {
      setCurrentTab(0);
    }
  }, [pathname, params.id]);

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

export default RequireRole(TabsProvider, ADMIN_ROUTE);
