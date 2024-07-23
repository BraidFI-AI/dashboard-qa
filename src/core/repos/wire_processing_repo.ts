import ApiClient, { Method } from "../api/ApiClient";
import { WireInbound } from "../api/ApiTypes";

class WireProcessingRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async processInboundWire(inbound: WireInbound) {
    const response = await this.apiClient.http(
      Method.POST,
      `/transaction/wire/inbound`,
      inbound
    );
    return response;
  }

  public async uploadInboundWireFile(data: string) {
    console.log(data);
    const response = await this.apiClient.http(
      Method.POST,
      "/wire/load/inbound?continueWithErrors=true",
      data,
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );

    return response;
  }
}

export default WireProcessingRepo;
