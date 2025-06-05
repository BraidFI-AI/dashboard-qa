"use client";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const TabsProvider = (props: any) => {
  const searchParams = useSearchParams();
  const [version, setVersion] = useState<number | null>(null);
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState(0);
  const params = useParams();
  const pathname = usePathname();

  useEffect(() => {
    const current = new URLSearchParams(searchParams.toString());

    const v = current.get("version");
    if (v != null && v != "") {
      setVersion(parseInt(v));
    }

    if (pathname.includes("questions")) {
      setCurrentTab(1);
    } else {
      setCurrentTab(0);
    }
  }, [pathname, searchParams]);

  return (
    <div>
      <Suspense>
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
              label="Form Details"
              style={{ textTransform: "none" }}
              onClick={() => {
                if (version) {
                  router.replace(
                    `/configuration/forms/${
                      (params.id as string) || "0"
                    }?version=${version}`
                  );
                } else {
                  router.replace(
                    `/configuration/forms/${(params.id as string) || "0"}`
                  );
                }
              }}
            />
            <Tab
              label="Questions"
              style={{ textTransform: "none" }}
              onClick={() => {
                if (version) {
                  router.replace(
                    `/configuration/forms/${
                      (params.id as string) || "0"
                    }/questions?version=${version}`
                  );
                } else {
                  router.replace(
                    `/configuration/forms/${
                      (params.id as string) || "0"
                    }/questions`
                  );
                }
              }}
            />
          </Tabs>
        </Box>
        <div className="pb-6"></div>
        {props.children}
      </Suspense>
    </div>
  );
};

export default TabsProvider;
