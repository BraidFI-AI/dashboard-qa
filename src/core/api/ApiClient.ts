import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import AxiosConfig from "./AxiosConfig";
import { Auth } from "aws-amplify";
import { InactivityTracker } from "../inactivity_tracker/InactivityTracker";

export enum Method {
  GET,
  POST,
  PATCH,
  PUT,
  DELETE,
}

class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create(AxiosConfig.getConfig());

    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // const authToken = Cookies.get("token");
        InactivityTracker.reset();
        const session = await Auth.currentSession();

        const authToken = session.getAccessToken().getJwtToken();

        // console.log("TOKEN:", session);

        if (authToken) {
          config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  public async http<T>(
    method: Method,
    endpoint: string,
    ...args: any
  ): Promise<T> {
    const axiosFunc = (function (client) {
      switch (method) {
        case Method.GET:
          return client.get;
        case Method.POST:
          return client.post;
        case Method.PATCH:
          return client.patch;
        case Method.PUT:
          return client.put;
        case Method.DELETE:
          return client.delete;
      }
    })(this.axiosInstance);

    try {
      const response = await axiosFunc<T>(endpoint, ...args);
      // console.log("data: " + response.data);
      return response.data;
    } catch (e: any) {
      console.log(e);
      throw e;
    }
  }

  public async logout(token: string) {
    try {
      const response = await this.axiosInstance.delete("/authentication", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  public async downloadBusinessPdf(url: string, filename: string) {
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}_details.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  public async downloadACHFile(productId: number, filename: string) {
    try {
      await this.axiosInstance({
        url: `/ach/settlement/file/${filename}?productId=${productId}`,
        method: "GET",
        responseType: "blob",
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${filename}`);
        document.body.appendChild(link);
        link.click();
      });
    } catch (e: any) {
      throw e;
    }
  }

  public async downloadWireSettlementFile(filename: string) {
    try {
      await this.axiosInstance({
        url: `/wire/settlement/${filename}`,
        method: "GET",
        responseType: "blob",
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${filename}`);
        document.body.appendChild(link);
        link.click();
      });
    } catch (e: any) {
      throw e;
    }
  }

  public async uploadFile(endpoint: string, fileData: any) {
    try {
      const response = await this.axiosInstance.put(endpoint, fileData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}

export default ApiClient;
