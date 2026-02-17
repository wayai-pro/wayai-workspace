import * as core from '@actions/core';
import type { HubAsCodePayload } from './parser';

interface SyncParams {
  hub_id: string;
  branch_name: string;
  config: HubAsCodePayload;
  commit_sha: string;
}

interface PublishParams {
  hub_id: string;
  branch_name: string;
}

interface CleanupParams {
  hub_id: string;
  branch_name: string;
}

interface ApiClient {
  sync(params: SyncParams): Promise<void>;
  publish(params: PublishParams): Promise<void>;
  cleanup(params: CleanupParams): Promise<void>;
}

/**
 * Exchange an MCP token for a JWT, then return an API client
 * that uses the JWT for subsequent CI endpoint calls.
 */
export async function createApiClient(apiUrl: string, apiToken: string): Promise<ApiClient> {
  // Step 1: Exchange MCP token for JWT
  const exchangeUrl = `${apiUrl}/auth/mcp/exchange`;

  core.info('Exchanging MCP token for JWT...');

  const exchangeResponse = await fetch(exchangeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: apiToken }),
  });

  if (!exchangeResponse.ok) {
    const errorBody = await exchangeResponse.text();
    throw new Error(
      `Token exchange failed (${exchangeResponse.status}): ${errorBody}`
    );
  }

  const exchangeData = (await exchangeResponse.json()) as {
    access_token: string;
    token_type: string;
    expires_in: number;
  };

  const jwt = exchangeData.access_token;
  core.info('Token exchange successful.');

  // Step 2: Build authenticated request helper
  async function apiRequest(
    method: string,
    path: string,
    body?: Record<string, unknown>
  ): Promise<unknown> {
    const url = `${apiUrl}${path}`;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `API request failed: ${method} ${path} (${response.status}): ${errorBody}`
      );
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    return null;
  }

  // Step 3: Return client with typed methods
  return {
    async sync(params: SyncParams): Promise<void> {
      await apiRequest('POST', '/api/ci/sync', {
        hub_id: params.hub_id,
        branch_name: params.branch_name,
        config: params.config,
        commit_sha: params.commit_sha,
      });
    },

    async publish(params: PublishParams): Promise<void> {
      await apiRequest('POST', '/api/ci/publish', {
        hub_id: params.hub_id,
        branch_name: params.branch_name,
      });
    },

    async cleanup(params: CleanupParams): Promise<void> {
      const query = `hub_id=${encodeURIComponent(params.hub_id)}`;
      const branchEncoded = encodeURIComponent(params.branch_name);
      await apiRequest('DELETE', `/api/ci/branches/${branchEncoded}?${query}`);
    },
  };
}
