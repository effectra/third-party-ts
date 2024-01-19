/**
 * Interface OAuthServiceInterface
 *
 * This interface defines the contract for an OAuth service.
 */
interface OAuthServiceInterface  {
    /**
     * Get the configuration object for the OAuth service.
     */
    getConfig(): Record<string, any>;
  
    /**
     * Get the authorization URL for the OAuth service.
     */
    getAuthURL(): string;
  
    /**
     * Get the access token for the OAuth service using the authorization code.
     *
     * @param code The authorization code.
     */
    getAccessToken(code: string): Promise<string>;
  
    /**
     * Get the user data from the OAuth service using the access token.
     *
     * @param token The access token.
     */
    getUser(token: string): Promise<Record<string, any> | null>;
  }
  