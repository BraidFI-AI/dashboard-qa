import { method } from "lodash";
import ApiClient, { Method } from "../api/ApiClient";
import {
  ACH,
  ACHSettlementHistory,
  ACHTransactionStatus,
  ReturnRate,
} from "../api/ApiTypes";
import { v4 as uuidv4 } from "uuid";

class ACHRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async fetchACHSettlementHistory(
    productId?: string,
    startDate?: string,
    endDate?: string
  ) {
    var url = `/ach/settlement?`;

    if (productId != undefined) {
      url += `productId=${productId}&`;
    }
    if (startDate != undefined) {
      url += `startDate=${startDate}&`;
    }
    if (endDate != undefined) {
      url += `endDate=${endDate}&`;
    }

    const response = await this.apiClient.http<any[]>(Method.GET, url);
    console.log(response);
    return response;
  }

  public async approveSettlement(productId: number, filename: string) {
    const response = await this.apiClient.http<any[]>(
      Method.POST,
      `/ach/settlement/file/${filename}/approve?productId=${productId}`
    );
    return response;
  }

  public async downloadACHFile(productId: number, filename: string) {
    try {
      const response = await this.apiClient.downloadACHFile(
        productId,
        filename
      );
      // console.log(response);

      return response;
    } catch (e: any) {
      throw e;
    }
  }

  public async uploadInboundFile(data: string) {
    console.log(data);
    const response = await this.apiClient.http(
      Method.POST,
      "/ach/load/inbound",
      data,
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );

    return response;
  }

  public async uploadOutboundFile(data: string) {
    const response = await this.apiClient.http(
      Method.POST,
      "/ach/load/outbound",
      data,
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );

    return response;
  }

  public async fetchUnauthorizedReturns(pageSize: number, pageNumber: number) {
    const response = await this.apiClient.http<{
      content: ACH[];
      totalElements: number;
      number: number;
    }>(
      Method.POST,
      `/transaction/ach/search?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      {
        status: "RETURNED",
      }
    );

    return response;
  }

  public async fetchReturnRate(
    startDate: string,
    endDate: string,
    method: string
  ): Promise<ReturnRate[]> {
    const response = await this.apiClient.http<ReturnRate[]>(
      Method.GET,
      `/metric/ach/return/${
        method == "Method 1" ? "method1" : "method2"
      }?start=${startDate}&end=${endDate}`
    );

    // add uuidv4 to each object
    response.forEach((ret) => {
      ret.id = uuidv4();
    });

    return response;
  }

  public async fetchACHTransactionStatus() {
    const response = await this.apiClient.http<ACHTransactionStatus[]>(
      Method.GET,
      `/ach/file/status`
    );

    return response;
  }

  public async fetchACHFileErrors(
    filename: String,
    pageSize: number,
    pageNumber: number
  ) {
    const response = await this.apiClient.http<any>(
      Method.GET,
      `/product/globalErrors/achfile/${filename}?pageSize=${pageSize}&pageNumber=${pageNumber}`
    );

    return response;
  }
}

export default ACHRepo;
