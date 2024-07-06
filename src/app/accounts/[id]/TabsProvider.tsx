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
    if (pathname.includes("accountTrans")) {
      setCurrentTab(1);
    } else if (pathname.includes("counterparties")) {
      setCurrentTab(2);
    } else if (pathname.includes("limits")) {
      setCurrentTab(3);
    } else if (pathname.includes("fees")) {
      setCurrentTab(4);
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
            label="Account Details"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(`/accounts/${params.id.toString()}`);
            }}
          />
          <Tab
            label="Transactions"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(`/accounts/${params.id.toString()}/accountTrans`);
            }}
          />
          <Tab
            label="Counterparties"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(
                `/accounts/${params.id.toString()}/counterparties`
              );
            }}
          />
          <Tab
            label="Limits"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(`/accounts/${params.id.toString()}/limits`);
            }}
          />
          <Tab
            label="Fees"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(`/accounts/${params.id.toString()}/fees`);
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
