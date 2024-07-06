import ApiClient, { Method } from "../api/ApiClient";
import { Card } from "../api/ApiTypes";

class CardManagementRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async fetchCards() {
    const response = await this.apiClient.http<Card[]>(
      Method.GET,
      "/cardmanagement"
    );
    return response;
  }

  public async fetchCardIds(id: any) {
    const response = await this.apiClient.http<Card[]>(
      Method.GET,
      "/cardmanagement"
    );
    const cardIds: string[] = [];
    response.map((card: any) => {
      if (card.productId == id) {
        cardIds.push(card.id.toString());
      }
    });
    return cardIds;
  }

  public async fetchCard(id: number) {
    const response = await this.apiClient.http<Card[]>(
      Method.GET,
      `/cardmanagement/${id}`
    );
    return response;
  }
}

export default CardManagementRepo;
