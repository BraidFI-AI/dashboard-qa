"use client";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ADMIN_OPS_ROLE, ADMIN_ROLE } from "@/core/constants";
import { useSelector } from "react-redux";

const TabsProvider = (props: any) => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState(0);
  const params = useParams();
  const pathname = usePathname();

  const userType = useSelector((state: any) => state.app.userType);

  const tabs = [
    {
      name: "Individual Details",
      path: `/individuals/${parseInt((params.id as string) || "0")}`,
    },
    {
      name: "CIP",
      path: `/individuals/${parseInt((params.id as string) || "0")}/cip`,
    },
    {
      name: "External Account",
      path: `/individuals/${parseInt(
        (params.id as string) || "0"
      )}/externalAccount`,
    },
    {
      name: "Accounts",
      path: `/individuals/${parseInt(
        (params.id as string) || "0"
      )}/individualAccounts`,
    },
    {
      name: "Counterparties",
      path: `/individuals/${parseInt(
        (params.id as string) || "0"
      )}/counterparties`,
    },
    {
      name: "Documents",
      path: `/individuals/${parseInt((params.id as string) || "0")}/documents`,
    },
    // {
    //   name: "Limits",
    //   path: `/individuals/${parseInt((params.id as string) || "0")}/limits`,
    // },
    {
      name: "Fees",
      path: `/individuals/${parseInt((params.id as string) || "0")}/fees`,
    },
  ];

  if (userType != ADMIN_ROLE && userType != ADMIN_OPS_ROLE) {
    tabs.splice(5, 1);
  }

  useEffect(() => {
    if (pathname.includes("externalAccount")) {
      setCurrentTab(
        tabs.findIndex((tab) => tab.path.includes("externalAccount"))
      );
    } else if (pathname.includes("cip")) {
      setCurrentTab(tabs.findIndex((tab) => tab.path.includes("cip")));
    } else if (pathname.includes("individualAccounts")) {
      setCurrentTab(
        tabs.findIndex((tab) => tab.path.includes("individualAccounts"))
      );
    } else if (pathname.includes("counterparties")) {
      setCurrentTab(
        tabs.findIndex((tab) => tab.path.includes("counterparties"))
      );
    } else if (pathname.includes("documents")) {
      setCurrentTab(tabs.findIndex((tab) => tab.path.includes("documents")));
    }
    // else if (pathname.includes("limits")) {
    //   setCurrentTab(tabs.findIndex((tab) => tab.path.includes("limits")));
    // }
    else if (pathname.includes("fees")) {
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
        </Tabs>
      </Box>
      <div className="pb-6"></div>
      {props.children}
    </div>
  );
};

export default TabsProvider;
