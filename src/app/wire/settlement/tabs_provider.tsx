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
      name: "Settlement",
      path: `/wire/settlement`,
    },
    {
      name: "Return Files",
      path: `/wire/settlement/returnFiles`,
    },
  ];

  useEffect(() => {
    if (pathname.includes("wire/settlement/returnFiles")) {
      setCurrentTab(
        tabs.findIndex((tab) =>
          tab.path.includes("wire/settlement/returnFiles")
        )
      );
    } else if (pathname.includes("wire/settlement")) {
      setCurrentTab(
        tabs.findIndex((tab) => tab.path.includes("wire/settlement"))
      );
    } else {
      setCurrentTab(0);
    }
  }, [pathname, tabs]);

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
