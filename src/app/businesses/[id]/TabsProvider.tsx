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
      name: "Business Details",
      path: `/businesses/${parseInt(params.id.toString())}`,
    },
    {
      name: "CIP",
      path: `/businesses/${parseInt(params.id.toString())}/cip`,
    },
    {
      name: "External Account",
      path: `/businesses/${parseInt(params.id.toString())}/externalAccount`,
    },
    {
      name: "UBO Details",
      path: `/businesses/${parseInt(params.id.toString())}/ubo`,
    },
    {
      name: "Accounts",
      path: `/businesses/${parseInt(params.id.toString())}/businessAccounts`,
    },
    {
      name: "Counterparties",
      path: `/businesses/${parseInt(params.id.toString())}/counterparties`,
    },
    {
      name: "Documents",
      path: `/businesses/${parseInt(params.id.toString())}/documents`,
    },
    {
      name: "Application",
      path: `/businesses/${parseInt(params.id.toString())}/application`,
    },
    // {
    //   name: "Limits",
    //   path: `/businesses/${parseInt(params.id.toString())}/limits`,
    // },
    {
      name: "Fees",
      path: `/businesses/${parseInt(params.id.toString())}/fees`,
    },
  ];

  if (userType != ADMIN_ROLE && userType != ADMIN_OPS_ROLE) {
    tabs.splice(7, 1);
  }

  useEffect(() => {
    if (pathname.includes("externalAccount")) {
      setCurrentTab(
        tabs.findIndex((tab) => tab.path.includes("externalAccount"))
      );
    } else if (pathname.includes("cip")) {
      setCurrentTab(tabs.findIndex((tab) => tab.path.includes("cip")));
    } else if (pathname.includes("ubo")) {
      setCurrentTab(tabs.findIndex((tab) => tab.path.includes("ubo")));
    } else if (pathname.includes("businessAccounts")) {
      setCurrentTab(
        tabs.findIndex((tab) => tab.path.includes("businessAccounts"))
      );
    } else if (pathname.includes("counterparties")) {
      setCurrentTab(
        tabs.findIndex((tab) => tab.path.includes("counterparties"))
      );
    } else if (pathname.includes("documents")) {
      setCurrentTab(tabs.findIndex((tab) => tab.path.includes("documents")));
    } else if (pathname.includes("application")) {
      setCurrentTab(tabs.findIndex((tab) => tab.path.includes("application")));
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
          {/* <Tab
            label="Business Details"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(`/businesses/${parseInt(params.id.toString())}`);
            }}
          /> */}
          {/* <Tab
            label="External Account"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/businesses/${parseInt(params.id.toString())}/externalAccount`
              );
            }}
          /> */}
          {/* <Tab
            label="UBO Details"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/businesses/${parseInt(params.id.toString())}/ubo`
              );
            }}
          /> */}
          {/* <Tab
            label="Accounts"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/businesses/${parseInt(params.id.toString())}/businessAccounts`
              );
            }}
          /> */}
          {/* <Tab
            label="Cards"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/businesses/${parseInt(params.id.toString())}/cards`
              );
            }}
          /> */}
          {/* <Tab
            label="Counterparties"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/businesses/${parseInt(params.id.toString())}/counterparties`
              );
            }}
          />
          <Tab
            label="Documents"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/businesses/${parseInt(params.id.toString())}/documents`
              );
            }}
          /> */}
          {/* <Tab
            label="Application"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/businesses/${parseInt(params.id.toString())}/application`
              );
            }}
          /> */}
          {/* <Tab
            label="Limits"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/businesses/${parseInt(params.id.toString())}/limits`
              );
            }}
          />
          <Tab
            label="Fees"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/businesses/${parseInt(params.id.toString())}/fees`
              );
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
