"use client";

import IconButton from "@mui/material/IconButton";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const BackButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const path = pathname.endsWith("/")
      ? pathname.slice(0, pathname.length - 1)
      : pathname;
    let depth = path == "" ? 1 : path.split("/").length;

    depth =
      pathname.includes("/settings/") ||
      pathname.includes("/configuration/") ||
      pathname.includes("/settlement/")
        ? depth - 1
        : depth;

    if (depth > 2) {
      if (!showButton) {
        setShowButton(true);
      }
    } else {
      if (showButton) {
        setShowButton(false);
      }
    }
  }, [pathname, showButton]);

  return (
    <>
      {showButton ? (
        <IconButton
          className="flex justify-center items-center rounded-xl  w-12 h-10 bg-slate-200 text-black"
          onClick={() => {
            router.back();
          }}
        >
          <ArrowBackRoundedIcon />
        </IconButton>
      ) : (
        <></>
      )}
    </>
  );
};

export default BackButton;
