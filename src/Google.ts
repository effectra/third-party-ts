import { OAuthConfig } from './OAuthConfig'; // Replace with the actual path to your OAuthConfig class
import axios, { AxiosError } from 'axios'; // Assuming you use axios or another HTTP library

/**
 * Represents Google OAuth configuration and functionality.
 */
export class Google extends OAuthConfig {
  /**
   * The HTTP client.
   */
  protected client: any; // Assuming you use a similar HTTP library in TypeScript

  /**
   * The authorization URL for Google OAuth.
   */
  private static AUTH_URL = 'https://accounts.google.com/o/oauth2/auth';

  /**
   * The token URL for Google OAuth.
   */
  private static TOKEN_URL = 'https://www.googleapis.com/oauth2/v4/token';

  /**
   * The user info URL for Google OAuth.
   */
  private static USER_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

  /**
   * The default scopes for Google OAuth.
   */
  protected scopes: string[] = [
    'openid',
    'profile',
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
   * Get the Google OAuth configuration as an object.
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
   * Get the Google OAuth authorization URL.
   */
  getAuthURL(): string {
    const params = this.onlyConfig([
      'response_type',
      'client_id',
      'redirect_uri',
      'scope',
      'state',
    ]);

    return this.buildUrl(Google.AUTH_URL, params);
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

      const response = await this.client.post(Google.TOKEN_URL, new URLSearchParams(params));

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
      const response = await this.client.get(this.buildUrl(Google.USER_URL, { access_token: encodeURIComponent(token) }));

      return response.data;
    } catch (error) {
      const e = error as AxiosError;
      return null;
    }
  }
}
