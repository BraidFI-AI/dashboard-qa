"use client";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RequireRole from "@/core/components/RequireRole";
import { ADMIN_ROUTE } from "@/core/constants";

const TabsProvider = (props: any) => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState(0);
  const params = useParams();
  const pathname = usePathname();

  useEffect(() => {
    setCurrentTab(0);
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
            label="Developer Details"
            style={{ textTransform: "none" }}
            onClick={() => {
              router.replace(`/configuration/developers/${params.tenantId}`);
            }}
          />
        </Tabs>
      </Box>
      <div className="pb-6"></div>
      {props.children}
    </div>
  );
};

export default RequireRole(TabsProvider, ADMIN_ROUTE);
