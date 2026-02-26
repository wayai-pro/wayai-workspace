import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { parseHubFolder } from './parser';
import { createApiClient } from './api-client';

interface RepoConfig {
  organization_id: string;
  project_id: string;
  hub_id: string;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Read .wayai.yaml from the repo root and extract hub_id.
 */
function readRepoConfig(): RepoConfig | null {
  const configPath = path.join(process.cwd(), '.wayai.yaml');
  if (!fs.existsSync(configPath)) return null;

  try {
    const content = fs.readFileSync(configPath, 'utf-8');
    const config = yaml.load(content) as Record<string, unknown> | undefined;
    if (
      !config?.organization_id || typeof config.organization_id !== 'string' || !UUID_RE.test(config.organization_id) ||
      !config?.project_id || typeof config.project_id !== 'string' || !UUID_RE.test(config.project_id) ||
      !config?.hub_id || typeof config.hub_id !== 'string' || !UUID_RE.test(config.hub_id)
    ) {
      return null;
    }
    return {
      organization_id: config.organization_id,
      project_id: config.project_id,
      hub_id: config.hub_id,
    };
  } catch {
    return null;
  }
}

/**
 * Scan workspace/ for the hub folder matching the given hub_id.
 * Returns the hub folder path or null if not found.
 */
function findHubFolder(hubId: string): string | null {
  const workspaceDir = path.join(process.cwd(), 'workspace');
  if (!fs.existsSync(workspaceDir)) return null;

  // Scan 2 levels: workspace/<project>/<hub>/wayai.yaml
  for (const project of safeReaddir(workspaceDir)) {
    const projectDir = path.join(workspaceDir, project);
    if (!isDirectory(projectDir)) continue;

    for (const hub of safeReaddir(projectDir)) {
      const hubFolder = path.join(projectDir, hub);
      if (!isDirectory(hubFolder)) continue;

      const yamlPath = path.join(hubFolder, 'wayai.yaml');
      if (!fs.existsSync(yamlPath)) continue;

      try {
        const content = fs.readFileSync(yamlPath, 'utf-8');
        const config = yaml.load(content) as { hub_id?: string } | undefined;
        if (config?.hub_id === hubId) {
          return hubFolder;
        }
      } catch {
        continue;
      }
    }
  }

  return null;
}

function isDirectory(p: string): boolean {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function safeReaddir(dir: string): string[] {
  try {
    return fs.readdirSync(dir).filter((entry) => !entry.startsWith('.'));
  } catch {
    return [];
  }
}

async function run(): Promise<void> {
  try {
    const apiUrl = core.getInput('api-url', { required: true });
    const apiToken = core.getInput('api-token', { required: true });

    // Read hub_id from .wayai.yaml
    const repoConfig = readRepoConfig();
    if (!repoConfig) {
      core.setFailed('Missing or invalid .wayai.yaml — must contain organization_id, project_id, and hub_id.');
      return;
    }

    const { hub_id: hubId } = repoConfig;
    core.info(`Hub ID from .wayai.yaml: ${hubId}`);

    // Find the hub folder in workspace/
    const hubFolder = findHubFolder(hubId);
    if (!hubFolder) {
      core.setFailed(`Hub folder for ${hubId} not found in workspace/. Run \`wayai pull\` to create it.`);
      return;
    }

    core.info(`Found hub folder: ${hubFolder}`);

    const client = await createApiClient(apiUrl, apiToken);
    const config = parseHubFolder(hubFolder);

    core.info(`Pushing hub ${hubId}...`);
    await client.push({
      hub_id: hubId,
      config,
    });

    core.info(`Hub ${hubId} pushed successfully.`);
    core.setOutput('synced-hubs', hubId);
    core.setOutput('hub-count', '1');
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed(String(error));
    }
  }
}

run();
