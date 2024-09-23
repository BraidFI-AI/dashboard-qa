import axios from "axios";
import ApiClient, { Method } from "../api/ApiClient";
import { CreateUser, User, UserResponse } from "../api/ApiTypes";
import { Auth } from "aws-amplify";

class UserMangementRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async createUser(user: CreateUser) {
    const response = await this.apiClient.http<CreateUser>(
      Method.POST,
      "/user",
      user
    );
    return response;
  }

  public async fetchUsers(token: string) {
    // const response = await this.apiClient.http<UserResponse>(
    //   Method.GET,
    //   `${token ? token : "/user"}`
    // );

    // axios call to fetch data without using apiclient
    const session = await Auth.currentSession();

    const authToken = session.getAccessToken().getJwtToken();
    const response = await axios.get(
      `https://apiapi.development.braid.zone/user`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    return response.data;
  }

  public async disableUser(username: string) {
    console.log(username);
    const response = await this.apiClient.http(
      Method.PUT,
      `/user/${username}/disable`
    );
    return response;
  }

  public async enableUser(username: string) {
    console.log(username);
    const response = await this.apiClient.http(
      Method.PUT,
      `/user/${username}/enable`
    );
    return response;
  }

  public async deleteUser(username: string) {
    console.log(username);
    const response = await this.apiClient.http(
      Method.DELETE,
      `/user/${username}`
    );
    return response;
  }

  public async resetPassword(username: string) {
    console.log(username);
    const response = await this.apiClient.http(
      Method.PUT,
      `/user/${username}/reset-password`,
      {}
    );
    return response;
  }
}

export default UserMangementRepo;
