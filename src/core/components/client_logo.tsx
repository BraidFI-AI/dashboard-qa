"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
// import url from "../../url.json";
import { useSelector } from "react-redux";
import { useCDN } from "../providers/cdn_provider";

type ClientLogoProps = {
  width: number;
};

const ClientLogo: React.FC<ClientLogoProps> = ({ width }) => {
  const { clientLogo } = useCDN();

  return clientLogo == null ? (
    <Image
      alt="Braidfi"
      src={"/images/braid_logo_black.png"}
      height={width * 0.5625}
      width={width}
    ></Image>
  ) : (
    <>
      <Image
        alt="Braidfi"
        src={clientLogo}
        height={width * 0.5625}
        width={width}
      ></Image>
    </>
  );
};

export default ClientLogo;
