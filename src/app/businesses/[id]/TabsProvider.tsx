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

  useEffect(() => {
    if (pathname.includes("externalAccount")) {
      setCurrentTab(1);
    } else if (pathname.includes("ubo")) {
      setCurrentTab(2);
    } else if (pathname.includes("businessAccounts")) {
      setCurrentTab(3);
    }
    // else if (pathname.includes("cards")) {
    //   setCurrentTab(5);
    // }
    else if (pathname.includes("counterparties")) {
      setCurrentTab(4);
    } else if (pathname.includes("documents")) {
      setCurrentTab(5);
    } else if (pathname.includes("application")) {
      setCurrentTab(6);
    } else if (pathname.includes("limits")) {
      setCurrentTab(7);
    } else if (pathname.includes("fees")) {
      setCurrentTab(8);
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
            label="Business Details"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(`/businesses/${parseInt(params.id.toString())}`);
            }}
          />
          <Tab
            label="External Account"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/businesses/${parseInt(params.id.toString())}/externalAccount`
              );
            }}
          />
          <Tab
            label="UBO Details"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/businesses/${parseInt(params.id.toString())}/ubo`
              );
            }}
          />
          <Tab
            label="Accounts"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/businesses/${parseInt(params.id.toString())}/businessAccounts`
              );
            }}
          />
          {/* <Tab
            label="Cards"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/businesses/${parseInt(params.id.toString())}/cards`
              );
            }}
          /> */}
          <Tab
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
          />
          <Tab
            label="Application"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/businesses/${parseInt(params.id.toString())}/application`
              );
            }}
          />
          <Tab
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
          />
        </Tabs>
      </Box>
      <div className="pb-6"></div>
      {props.children}
    </div>
  );
};

export default TabsProvider;
