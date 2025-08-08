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
      name: "Product Details",
      path: `/configuration/products/${parseInt((params.id as string) || "0")}`,
    },
    // {name: "Onboarding Config", path: `/configuration/products/${parseInt((params.id as string) || "0")}/onboardingConfig`},
    {
      name: "Funds Availability",
      path: `/configuration/products/${parseInt(
        (params.id as string) || "0"
      )}/fundsAvailability`,
    },
    {
      name: "ACH Config",
      path: `/configuration/products/${parseInt(
        (params.id as string) || "0"
      )}/cfg`,
    },
    {
      name: "Counterparties",
      path: `/configuration/products/${parseInt(
        (params.id as string) || "0"
      )}/counterparties`,
    },
    {
      name: "Limits",
      path: `/configuration/products/${parseInt(
        (params.id as string) || "0"
      )}/limits?productId=${parseInt((params.id as string) || "0")}`,
    },
    {
      name: "Fees",
      path: `/configuration/products/${parseInt(
        (params.id as string) || "0"
      )}/fees`,
    },
  ];

  if (userType != ADMIN_ROLE && userType != ADMIN_OPS_ROLE) {
    tabs.splice(1, 2);
    tabs.splice(2, 1);
  }

  useEffect(() => {
    // if (pathname.includes("onboardingConfig")) {
    //   setCurrentTab(1);
    // }
    // else
    if (pathname.includes("fundsAvailability")) {
      setCurrentTab(
        tabs.findIndex((tab) => tab.path.includes("fundsAvailability"))
      );
    } else if (pathname.includes("counterparties")) {
      setCurrentTab(
        tabs.findIndex((tab) => tab.path.includes("counterparties"))
      );
    } else if (pathname.includes("cfg")) {
      setCurrentTab(tabs.findIndex((tab) => tab.path.includes("cfg")));
    } else if (pathname.includes("limits")) {
      setCurrentTab(tabs.findIndex((tab) => tab.path.includes("limits")));
    } else if (pathname.includes("fees")) {
      setCurrentTab(tabs.findIndex((tab) => tab.path.includes("fees")));
    } else {
      setCurrentTab(0);
    }
  }, [pathname, userType]);

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
            label="Product Details"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/configuration/products/${parseInt((params.id as string) || "0")}`
              );
            }}
          /> */}
          {/* <Tab
            label="Onboarding Config"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/configuration/products/${parseInt(
                  (params.id as string) || "0"
                )}/onboardingConfig`
              );
            }}
          /> */}
          {/* <Tab
            label="Funds Availability"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/configuration/products/${parseInt(
                  (params.id as string) || "0"
                )}/fundsAvailability`
              );
            }}
          />
          <Tab
            label="ACH Config"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/configuration/products/${parseInt(
                  (params.id as string) || "0"
                )}/cfg`
              );
            }}
          />
          <Tab
            label="Counterparties"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/configuration/products/${parseInt(
                  (params.id as string) || "0"
                )}/counterparties`
              );
            }}
          />
          {userType == ADMIN_ROLE || userType == ADMIN_OPS_ROLE && (
            <Tab
              label="Limits"
              style={{ textTransform: "none" }}
              onClick={() => {
                router.replace(
                  `/configuration/products/${parseInt(
                    (params.id as string) || "0"
                  )}/limits`
                );
              }}
            />
          )}
          <Tab
            label="Fees"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/configuration/products/${parseInt(
                  (params.id as string) || "0"
                )}/fees`
              );
            }}
          /> */}
        </Tabs>
      </Box>
      {props.children}
    </div>
  );
};

export default TabsProvider;
