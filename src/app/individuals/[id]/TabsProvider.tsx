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
    } else if (pathname.includes("individualAccounts")) {
      setCurrentTab(2);
    } else if (pathname.includes("counterparties")) {
      setCurrentTab(3);
    } else if (pathname.includes("documents")) {
      setCurrentTab(4);
    } else if (pathname.includes("limits")) {
      setCurrentTab(5);
    } else if (pathname.includes("fees")) {
      setCurrentTab(6);
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
            label="Individual Details"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(`/individuals/${parseInt(params.id.toString())}`);
            }}
          />
          <Tab
            label="External Account"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/individuals/${parseInt(params.id.toString())}/externalAccount`
              );
            }}
          />
          <Tab
            label="Accounts"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/individuals/${parseInt(
                  params.id.toString()
                )}/individualAccounts`
              );
            }}
          />
          <Tab
            label="Counterparties"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/individuals/${parseInt(params.id.toString())}/counterparties`
              );
            }}
          />
          <Tab
            label="Documents"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/individuals/${parseInt(params.id.toString())}/documents`
              );
            }}
          />
          <Tab
            label="Limits"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/individuals/${parseInt(params.id.toString())}/limits`
              );
            }}
          />
          <Tab
            label="Fees"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/individuals/${parseInt(params.id.toString())}/fees`
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
