/**
 * Represents the configuration for OAuth authentication.
 */
export class OAuthConfig {
    /**
     * The client ID.
     */
    protected client_id: string;
  
    /**
     * The client secret.
     */
    protected client_secret: string;
  
    /**
     * The redirect URL.
     */
    protected redirect_url: string;
  
    /**
     * The array of scopes.
     */
    protected scopes: string[] = [];
  
    /**
     * OAuthConfig constructor.
     *
     * @param client_id The client ID.
     * @param client_secret The client secret.
     * @param redirect_url The redirect URL.
     * @param scopes The array of scopes.
     */
    constructor(
      client_id: string,
      client_secret: string,
      redirect_url = '',
      scopes: string[] = []
    ) {
      this.client_id = client_id;
      this.client_secret = client_secret;
      this.redirect_url = redirect_url;
      this.scopes = scopes;
    }
  
    /**
     * Get the OAuth configuration as an object.
     */
    getConfig(): any {
      return {
        client_id: this.getClientId(),
        client_secret: this.getClientSecret(),
        redirect_uri: this.getRedirectURL(),
        scope: this.getScopesString(),
        state: this.generateToken(),
      };
    }
  
    /**
     * Get the client ID.
     */
    getClientId(): string {
      return this.client_id;
    }
  
    /**
     * Get the client secret.
     */
    getClientSecret(): string {
      return this.client_secret;
    }
  
    /**
     * Get the redirect URL.
     */
    getRedirectURL(): string {
      return this.redirect_url;
    }
  
    /**
     * Get the array of scopes.
     */
    getScopes(): string[] {
      return this.scopes;
    }
  
    /**
     * Get a specific scope by name.
     *
     * @param name The name of the scope.
     */
    getScope(name: string): string {
      return this.scopes[name];
    }
  
    /**
     * Get the scopes as a string.
     *
     * @param separator The separator to use between scopes. Defaults to a space.
     */
    getScopesString(separator: string | string[] = ' '): string {
      return this.scopes.join(Array.isArray(separator) ? separator[0] : separator);
    }
  
    /**
     * Set a new client ID and return a new instance of OAuthConfig.
     *
     * @param client_id The new client ID.
     */
    withClientId(client_id: string): OAuthConfig {
      const clone = Object.create(this);
      clone.client_id = client_id;
      return clone;
    }
  
    /**
     * Set a new client secret and return a new instance of OAuthConfig.
     *
     * @param client_secret The new client secret.
     */
    withClientSecret(client_secret: string): OAuthConfig {
      const clone = Object.create(this);
      clone.client_secret = client_secret;
      return clone;
    }
  
    /**
     * Set a new redirect URL and return a new instance of OAuthConfig.
     *
     * @param redirect_url The new redirect URL.
     */
    withRedirectURL(redirect_url: string): OAuthConfig {
        const clone = Object.create(this);
        clone.redirect_url = redirect_url.replace(/^\/+|\/+$/g, ''); // Remove leading and trailing slashes
        return clone;
    }
  
    /**
     * Set new scopes and return a new instance of OAuthConfig.
     *
     * @param scopes The new array of scopes.
     */
    withScopes(scopes: string[]): OAuthConfig {
      const clone = Object.create(this);
      clone.scopes = scopes;
      return clone;
    }
  
    /**
     * Get a new configuration without specified keys.
     *
     * @param key The key(s) to exclude from the configuration.
     */
    withoutConfig(key: string | string[]): Record<string, any> {
      const keys = Array.isArray(key) ? key : [key];
      const config: Record<string, any> = {};
      for (const [config_key, config_value] of Object.entries(this.getConfig())) {
        if (!keys.includes(config_key)) {
          config[config_key] = config_value;
        }
      }
      return config;
    }
  
    /**
     * Get a new configuration with only specified keys.
     *
     * @param key The key(s) to include in the configuration.
     */
    onlyConfig(key: string | string[]): Record<string, any> {
      const keys = Array.isArray(key) ? key : [key];
      const config: Record<string, any> = {};
      for (const [config_key, config_value] of Object.entries(this.getConfig())) {
        if (keys.includes(config_key)) {
          config[config_key] = config_value;
        }
      }
      return config;
    }
  
    /**
     * Build a URL with the base and query parameters.
     *
     * @param base The base URL.
     * @param params The query parameters.
     */
    buildUrl(base: string, params: Record<string, any>): string {
      return `${base}?${new URLSearchParams(params)}`;
    }
  
    /**
     * Generate a random token.
     *
     * @param length The length of the token. Defaults to 10.
     */
    generateToken(length = 10): string {
      const buffer = new Uint8Array(length / 2);
      crypto.getRandomValues(buffer);
      return Array.from(buffer, (byte) => byte.toString(16).padStart(2, '0')).join('');
    }
  }
  