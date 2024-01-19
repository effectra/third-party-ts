import { OAuthConfig } from './OAuthConfig'; // Replace with the actual path to your OAuthConfig class
import axios, { AxiosError } from 'axios'; // Assuming you use axios or another HTTP library

/**
 * Represents Facebook OAuth configuration and functionality.
 */
export class Facebook extends OAuthConfig {
  /**
   * The HTTP client.
   */
  protected client: any; // Assuming you use a similar HTTP library in TypeScript

  /**
   * The authorization URL for Facebook OAuth.
   */
  private static AUTH_URL = 'https://www.facebook.com/v12.0/dialog/oauth';

  /**
   * The token URL for Facebook OAuth.
   */
  private static TOKEN_URL = 'https://graph.facebook.com/v12.0/oauth/access_token';

  /**
   * The user info URL for Facebook OAuth.
   */
  private static USER_URL = 'https://graph.facebook.com/me?fields=id,name,email';

  /**
   * The default scopes for Facebook OAuth.
   */
  public scopes: string[] = [
    'email',
  ];

  constructor(
    client_id: string,
    client_secret: string,
    redirect_url = '',
    scopes: string[] = [],
  ) {
    super(client_id, client_secret, redirect_url, scopes);

    if (scopes.length === 0) {
      scopes = this.scopes;
    }
    this.client = axios.create();
  }

  /**
   * Get the Facebook OAuth configuration as an object.
   */
  getConfig(): any {
    return {
      client_id: this.getClientId(),
      client_secret: this.getClientSecret(),
      redirect_uri: this.getRedirectURL(),
      scope: this.withScopes(this.scopes).getScopesString(),
      state: this.generateToken(15),
      response_type: 'code',
      grant_type: 'authorization_code',
    };
  }

  /**
   * Get the Facebook OAuth authorization URL.
   */
  getAuthURL(): string {
    const params = this.onlyConfig([
      'response_type',
      'client_id',
      'redirect_uri',
      'scope',
      'state',
    ]);

    return this.buildUrl(Facebook.AUTH_URL, params);
  }

  /**
   * Get the access token using the authorization code.
   */
  async getAccessToken(code: string): Promise<string> {
    try {
      const params = {
        code,
        ...this.onlyConfig([
          'client_id',
          'client_secret',
          'redirect_uri',
          'grant_type',
        ]),
      };

      const response = await this.client.post(Facebook.TOKEN_URL, new URLSearchParams(params));

      const data = response.data;
      return data.access_token || '';
    } catch (error) {
      const e = error as AxiosError;
      return '';
    }
  }

  /**
   * Get the user information using the access token.
   */
  async getUser(token: string): Promise<any | null> {
    try {
      const decodedToken = encodeURIComponent(token);
      const url = `${Facebook.USER_URL}&access_token=${decodedToken}`;

      const response = await this.client.get(url);

      return response.data;
    } catch (error) {
      const e = error as AxiosError;
      return null;
    }
  }
}
