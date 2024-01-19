import { OAuthConfig } from "./OAuthConfig"; // Replace with the actual path to your OAuthConfig class
import axios, { AxiosError } from "axios"; // Assuming you use axios or another HTTP library

/**
 * Represents GitHub OAuth configuration and functionality.
 */
export class GitHub extends OAuthConfig {
  /**
   * The HTTP client.
   */
  protected client: any; // Assuming you use a similar HTTP library in TypeScript

  /**
   * The authorization URL for GitHub OAuth.
   */
  private static AUTH_URL = "https://github.com/login/oauth/authorize";

  /**
   * The token URL for GitHub OAuth.
   */
  private static TOKEN_URL = "https://github.com/login/oauth/access_token";

  /**
   * The user info URL for GitHub OAuth.
   */
  private static USER_URL = "https://api.github.com/user";

  /**
   * The default scopes for GitHub OAuth.
   */
  public scopes: string[] = ["user"];

  constructor(
    client_id: string,
    client_secret: string,
    redirect_url = "",
    scopes: string[] = []
  ) {
    super(client_id, client_secret, redirect_url, scopes);
    if (scopes.length === 0) {
      scopes = this.scopes;
    }
    this.client = axios.create(); // Replace with the actual initialization for your HTTP library
  }

  /**
   * Get the GitHub OAuth configuration as an object.
   */
  getConfig(): any {
    return {
      client_id: this.getClientId(),
      client_secret: this.getClientSecret(),
      redirect_uri: this.getRedirectURL(),
      scope: this.withScopes(this.scopes).getScopesString(),
      state: this.generateToken(15),
      response_type: "code",
    };
  }

  /**
   * Get the GitHub OAuth authorization URL.
   */
  getAuthURL(): string {
    const params = this.onlyConfig([
      "response_type",
      "client_id",
      "redirect_uri",
      "scope",
      "state",
    ]);

    return this.buildUrl(GitHub.AUTH_URL, params);
  }

  /**
   * Get the access token using the authorization code.
   */
  async getAccessToken(code: string): Promise<string> {
    try {
      const params = {
        code,
        ...this.onlyConfig([
          "client_id",
          "client_secret",
          "redirect_uri",
          "state",
        ]),
      };

      const response = await this.client.post(GitHub.TOKEN_URL, params, {
        headers: {
          Accept: "application/json",
        },
      });

      const data = response.data;
      return data.access_token || "";
    } catch (error) {
      const e = error as AxiosError;
      return "";
    }
  }

  /**
   * Get the user information using the access token.
   */
  async getUser(token: string): Promise<any | null> {
    try {
      const response = await this.client.get(GitHub.USER_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent": "MyGitHubApp",
        },
      });

      return response.data;
    } catch (error) {
      const e = error as AxiosError;
      return null;
    }
  }
}
