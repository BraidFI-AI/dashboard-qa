"use client";

import Image from "next/image";
import { useState } from "react";
import { useCDN } from "../providers/cdn_provider";

type ClientLogoProps = {
  width: number;
};

const ClientLogo: React.FC<ClientLogoProps> = ({ width }) => {
  const { clientLogo } = useCDN();
  const [isLoaded, setIsLoaded] = useState(false);

  return clientLogo == null ? (
    <Image
      alt="Braidfi"
      src={"/images/braid_logo_black.png"}
      height={width * 0.5625}
      width={width}
    />
  ) : (
    <Image
      alt="Braidfi"
      src={clientLogo}
      height={width * 0.5625}
      width={width}
      onLoad={() => setIsLoaded(true)}
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 300ms ease-in-out",
      }}
    />
  );
};

export default ClientLogo;
