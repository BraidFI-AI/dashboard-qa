"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import url from "../../url.json";

type CDNContextType = {
  clientLogo: string | null;
};

const CDNContext = createContext<CDNContextType | undefined>(undefined);

type CDNProviderProps = {
  children: any;
};

export const CDNProvider: React.FC<CDNProviderProps> = ({ children }) => {
  const [clientLogo, setClientLogo] = useState<string | null>(null);

  useEffect(() => {
    const checkCDN = async () => {
      try {
        const hostname = window.location.hostname;
        const logoUrl = `https://${url.url_cdn}/logos/${hostname}.png`;
        const response = await axios.head(logoUrl);
        if (response.status === 200) {
          setClientLogo(logoUrl);
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

  return (
    <CDNContext.Provider value={{ clientLogo }}>{children}</CDNContext.Provider>
  );
};

export const useCDN = () => {
  const context = useContext(CDNContext);
  if (context === undefined) {
    throw new Error("useCDN must be used within a CDNProvider");
  }
  return context;
};
