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
      name: "Account Details",
      path: `/accounts/${(params.id as string) || "0"}`,
    },
    {
      name: "Transactions",
      path: `/accounts/${(params.id as string) || "0"}/accountTrans`,
    },
    {
      name: "Counterparties",
      path: `/accounts/${(params.id as string) || "0"}/counterparties`,
    },
    {
      name: "Limits",
      path: `/accounts/${(params.id as string) || "0"}/limits?accountNumber=${
        (params.id as string) || "0"
      }`,
    },
    {
      name: "Fees",
      path: `/accounts/${(params.id as string) || "0"}/fees`,
    },
  ];

  if (userType != ADMIN_ROLE && userType != ADMIN_OPS_ROLE) {
    tabs.splice(3, 1);
  }

  useEffect(() => {
    if (pathname.includes("accountTrans")) {
      setCurrentTab(tabs.findIndex((tab) => tab.path.includes("accountTrans")));
    } else if (pathname.includes("counterparties")) {
      setCurrentTab(
        tabs.findIndex((tab) => tab.path.includes("counterparties"))
      );
    } else if (pathname.includes("limits")) {
      setCurrentTab(tabs.findIndex((tab) => tab.path.includes("limits")));
    } else if (pathname.includes("fee")) {
      setCurrentTab(tabs.findIndex((tab) => tab.path.includes("fee")));
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
