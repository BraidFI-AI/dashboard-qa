import { AxiosRequestConfig } from "axios";
// import url from "../../url.json";
const url = "https://api.prod.braid.zone";

// https://api.prod.braid.zone
// https://api.dev.braid.zone
// http://localhost:8080
class AxiosConfig {
  static getConfig(): AxiosRequestConfig {
    const config: AxiosRequestConfig = {
      baseURL: "https://api.development.braid.zone",
    };

    return config;
  }
}

export default AxiosConfig;
