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
      path: `/accounts/${params.id.toString()}`,
    },
    {
      name: "Transactions",
      path: `/accounts/${params.id.toString()}/accountTrans`,
    },
    {
      name: "Counterparties",
      path: `/accounts/${params.id.toString()}/counterparties`,
    },
    {
      name: "Limits",
      path: `/accounts/${params.id.toString()}/limits`,
    },
    {
      name: "Fees",
      path: `/accounts/${params.id.toString()}/fees`,
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
    } else if (pathname.includes("fees")) {
      setCurrentTab(tabs.findIndex((tab) => tab.path.includes("fees")));
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
          {/* <Tab
            label="Account Details"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(`/accounts/${params.id.toString()}`);
            }}
          /> */}
          {/* <Tab
            label="Transactions"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(`/accounts/${params.id.toString()}/accountTrans`);
            }}
          /> */}
          {/* <Tab
            label="Counterparties"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/accounts/${params.id.toString()}/counterparties`
              );
            }}
          /> */}
          {/* <Tab
            label="Limits"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(`/accounts/${params.id.toString()}/limits`);
            }}
          /> */}
          {/* <Tab
            label="Fees"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(`/accounts/${params.id.toString()}/fees`);
            }}
          /> */}
        </Tabs>
      </Box>
      <div className="pb-6"></div>
      {props.children}
    </div>
  );
};

export default TabsProvider;
