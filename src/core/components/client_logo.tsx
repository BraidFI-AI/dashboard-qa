"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import MyText from "./Text/Text";

type ClientLogoProps = {
  drawerOpen: boolean;
  auth?: boolean;
};

const ClientLogo: React.FC<ClientLogoProps> = ({
  drawerOpen,
  auth = false,
}) => {
  const [clientLogo, setClientLogo] = useState<string | null>(null);

  useEffect(() => {
    const checkCDN = async () => {
      try {
        const response = await axios.head(
          `https://${process.env.NEXT_PUBLIC_CDN_URL}/logo.png`
        );
        if (response.status === 200) {
          setClientLogo(`https://${process.env.NEXT_PUBLIC_CDN_URL}/logo.png`);
        } else {
          setClientLogo(null);
        }
      } catch (error) {
        console.error("Error checking CDN URL:", error);
        setClientLogo(null);
      }
    };

    checkCDN();
  }, []);

  return clientLogo == null ? (
    <Image
      alt="Braidfi"
      src={"/images/braid_logo_black.png"}
      height={45}
      width={107}
    ></Image>
  ) : (
    <>
      <Image alt="Braidfi" src={clientLogo} height={45} width={107}></Image>
      {drawerOpen && (
        <div className="flex flex-row items-center">
          <MyText size={auth == true ? "xs" : "sm"}>Powered by</MyText>
          <div className="pr-[1px]" />
          <Image
            alt="Braidfi"
            src="/images/braid_logo_black.png"
            height={auth == true ? 20 : 25}
            width={auth == true ? 30 : 55}
          />
        </div>
      )}
    </>
  );
};

export default ClientLogo;
