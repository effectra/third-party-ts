import { OAuthConfig } from './OAuthConfig'; // Replace with the actual path to your OAuthConfig class
import axios from 'axios'; // Assuming you use axios or another HTTP library

export class Gmail extends OAuthConfig {
  protected client: any; // Assuming you use a similar HTTP library in TypeScript

  // The authorization URL for Google OAuth.
  private static AUTH_URL = 'https://accounts.google.com/o/oauth2/auth';

  // The token URL for Google OAuth.
  private static TOKEN_URL = 'https://www.googleapis.com/oauth2/v4/token';

  // The user info URL for Google OAuth.
  private static USER_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

  protected scopes: string[] = [
    'https://www.googleapis.com/auth/gmail.compose',
  ];

  constructor(
    client_id: string,
    client_secret: string,
    redirect_url = '',
    scopes: string[] = [],
  ) {
    if (scopes.length === 0) {
      scopes = this.scopes;
    }
    super(client_id, client_secret, redirect_url, scopes);
    this.client = axios.create(); // Replace with the actual initialization for your HTTP library
  }

  getConfig(): any {
    return {
      client_id: this.getClientId(),
      client_secret: this.getClientSecret(),
      redirect_uri: this.getRedirectURL(),
      scope: this.withScopes(this.scopes).getScopesString(),
      state: this.generateToken(15),
      response_type: 'code',
      grant_type: 'authorization_code',
      access_type: 'offline',
    };
  }

  getAuthURL(): string {
    const params = this.onlyConfig([
      'response_type',
      'client_id',
      'redirect_uri',
      'scope',
      'access_type',
    ]);
    return this.buildUrl(Gmail.AUTH_URL, params);
  }

  async getAccessToken(code: string): Promise<string> {
    const response = await this.client.post(Gmail.TOKEN_URL, {
      client_id: this.getClientId(),
      client_secret: this.getClientSecret(),
      refresh_token: code,
      grant_type: 'refresh_token',
    });

    const data = response.data;
    return data.access_token;
  }

  message(): string {
    const to = 'jeeloria@gmail.com';
    const subject = 'Test Email';
    const message = 'This is a test email.';

    let email = `From: Mohammed Taha <bmt.mohammedtaha@gmail.com>\r\n`;
    email += `To: ${to}\r\n`;
    email += `Subject: ${subject}\r\n`;
    email += `Content-Type: text/plain; charset=utf-8\r\n`;
    email += `\r\n`;
    email += message;
    return email;
  }

  async send(accessToken: string): Promise<void> {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'message/rfc822',
    };

    const response = await this.client.post(
      'https://www.googleapis.com/upload/gmail/v1/users/me/messages/send',
      {
        headers,
        body: this.message(),
      },
    );

    if (response.status === 200) {
      console.log('Email sent successfully.');
    } else {
      console.log('Failed to send email.');
    }
  }
}
