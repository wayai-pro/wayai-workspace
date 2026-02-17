import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export interface ChangedHub {
  hubFolder: string;
  hubId: string;
  hubEnvironment: string;
}

/**
 * Detect which hub folders have changed by comparing git diffs.
 *
 * - For pull requests: diffs against origin/main
 * - For push events: diffs against the previous commit (HEAD~1)
 *
 * Filters to files matching workspace/** /wayai.yaml and workspace/** /agents/*.md,
 * extracts unique hub folder paths, reads each wayai.yaml to get hub_id and
 * hub_environment, and skips any hubs where hub_environment is not 'production'
 * (GitOps only operates on production hubs).
 */
export function getChangedHubs(): ChangedHub[] {
  const isPullRequest = !!process.env.GITHUB_HEAD_REF;

  let diffOutput: string;
  try {
    if (isPullRequest) {
      // PR: compare against the base branch
      diffOutput = execSync('git diff --name-only origin/main...HEAD', {
        encoding: 'utf-8',
      }).trim();
    } else {
      // Push to main: compare against previous commit
      diffOutput = execSync('git diff --name-only HEAD~1..HEAD', {
        encoding: 'utf-8',
      }).trim();
    }
  } catch {
    // If diff fails (e.g., first commit), return empty
    return [];
  }

  if (!diffOutput) {
    return [];
  }

  const changedFiles = diffOutput.split('\n').filter(Boolean);

  // Filter to workspace hub config files
  const hubFiles = changedFiles.filter((file) => {
    if (!file.startsWith('workspace/')) return false;
    // Match wayai.yaml or agents/*.md within a hub folder
    return file.endsWith('/wayai.yaml') || /\/agents\/[^/]+\.md$/.test(file);
  });

  if (hubFiles.length === 0) {
    return [];
  }

  // Extract unique hub folder paths
  // Hub folder is the directory containing wayai.yaml
  // For agents/*.md files, the hub folder is the parent of agents/
  const hubFolders = new Set<string>();

  for (const file of hubFiles) {
    if (file.endsWith('/wayai.yaml')) {
      hubFolders.add(path.dirname(file));
    } else if (file.includes('/agents/')) {
      // Go up from agents/ to the hub folder
      const agentsIndex = file.lastIndexOf('/agents/');
      hubFolders.add(file.substring(0, agentsIndex));
    }
  }

  // Read each hub folder's wayai.yaml and filter to production hubs
  const changedHubs: ChangedHub[] = [];

  for (const hubFolder of hubFolders) {
    const yamlPath = path.join(hubFolder, 'wayai.yaml');

    if (!fs.existsSync(yamlPath)) {
      continue;
    }

    try {
      const yamlContent = fs.readFileSync(yamlPath, 'utf-8');
      const config = yaml.load(yamlContent) as {
        hub_id?: string;
        hub_environment?: string;
      };

      if (!config || !config.hub_id || !config.hub_environment) {
        continue;
      }

      // GitOps only for production hubs
      if (config.hub_environment !== 'production') {
        continue;
      }

      changedHubs.push({
        hubFolder,
        hubId: config.hub_id,
        hubEnvironment: config.hub_environment,
      });
    } catch {
      // Skip hubs with invalid YAML
      continue;
    }
  }

  return changedHubs;
}
