import { Octokit } from '@octokit/rest';
import { createOAuthAppAuth } from '@octokit/auth-oauth-app';

export interface GitHubAuthConfig {
  clientId: string;
  clientSecret: string;
}

export interface GitHubTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  tokenType: string;
}

/**
 * Generate GitHub OAuth authorization URL
 */
export function getAuthorizationUrl(clientId: string, redirectUri: string, state?: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'user repo read:org',
  });

  if (state) {
    params.append('state', state);
  }

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(
  code: string,
  config: GitHubAuthConfig
): Promise<GitHubTokens> {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to exchange code for token: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(`GitHub OAuth error: ${data.error_description || data.error}`);
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000).toISOString() : undefined,
    tokenType: data.token_type || 'bearer',
  };
}

/**
 * Create authenticated Octokit instance
 */
export function createAuthenticatedOctokit(accessToken: string): Octokit {
  return new Octokit({
    auth: accessToken,
  });
}

/**
 * Get authenticated user information
 */
export async function getAuthenticatedUser(accessToken: string) {
  const octokit = createAuthenticatedOctokit(accessToken);
  const { data } = await octokit.rest.users.getAuthenticated();
  return data;
}

/**
 * Get user repositories
 */
export async function getUserRepositories(accessToken: string, options?: {
  sort?: 'created' | 'updated' | 'pushed' | 'full_name';
  direction?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}) {
  const octokit = createAuthenticatedOctokit(accessToken);
  const { data } = await octokit.rest.repos.listForAuthenticatedUser({
    sort: options?.sort || 'updated',
    direction: options?.direction || 'desc',
    per_page: options?.per_page || 10,
    page: options?.page || 1,
  });
  return data;
}

/**
 * Get user organizations
 */
export async function getUserOrganizations(accessToken: string) {
  const octokit = createAuthenticatedOctokit(accessToken);
  const { data } = await octokit.rest.orgs.listForAuthenticatedUser();
  return data;
}

/**
 * Validate access token
 */
export async function validateToken(accessToken: string): Promise<boolean> {
  try {
    await getAuthenticatedUser(accessToken);
    return true;
  } catch (error) {
    return false;
  }
}
