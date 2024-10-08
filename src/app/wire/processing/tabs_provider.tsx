"use client";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ADMIN_OPS_ROLE, ADMIN_ROLE } from "@/core/constants";

const TabsProvider = (props: any) => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState(0);
  const params = useParams();
  const pathname = usePathname();

  const userType = useSelector((state: any) => state.app.userType);

  const tabs = [
    {
      name: "Processing",
      path: `/wire/processing`,
    },
    {
      name: "Status",
      path: `/wire/processing/wireTransStatus`,
    },
    {
      name: "Errors",
      path: `/wire/processing/wireFileErrors`,
    },
  ];

  useEffect(() => {
    if (pathname.includes("wireTransStatus")) {
      setCurrentTab(
        tabs.findIndex((tab) => tab.path.includes("wireTransStatus"))
      );
    } else if (pathname.includes("wireFileErrors")) {
      setCurrentTab(
        tabs.findIndex((tab) => tab.path.includes("wireFileErrors"))
      );
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
