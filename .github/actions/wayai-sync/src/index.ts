import * as core from '@actions/core';
import { getChangedHubs } from './changed-hubs';
import { parseHubFolder } from './parser';
import { createApiClient } from './api-client';

async function run(): Promise<void> {
  try {
    const apiUrl = core.getInput('api-url', { required: true });
    const apiToken = core.getInput('api-token', { required: true });
    const action = core.getInput('action', { required: true });

    if (!['sync', 'publish', 'cleanup'].includes(action)) {
      core.setFailed(`Invalid action: ${action}. Must be one of: sync, publish, cleanup`);
      return;
    }

    const client = await createApiClient(apiUrl, apiToken);
    const changedHubs = getChangedHubs();

    if (changedHubs.length === 0) {
      core.info('No production hub changes detected. Nothing to do.');
      return;
    }

    core.info(`Found ${changedHubs.length} changed hub(s): ${changedHubs.map((h) => h.hubId).join(', ')}`);

    const commitSha = process.env.GITHUB_SHA;
    if (!commitSha) {
      core.setFailed('GITHUB_SHA is not set. This action must run in a GitHub Actions environment.');
      return;
    }

    const branchName =
      process.env.GITHUB_HEAD_REF || // PR source branch
      (process.env.GITHUB_REF || '').replace('refs/heads/', ''); // Push branch

    if (!branchName) {
      core.setFailed('Could not determine branch name from GITHUB_HEAD_REF or GITHUB_REF.');
      return;
    }

    if (action === 'sync') {
      for (const hub of changedHubs) {
        core.info(`Syncing hub ${hub.hubId} from ${hub.hubFolder}...`);

        const config = parseHubFolder(hub.hubFolder);

        await client.sync({
          hub_id: hub.hubId,
          branch_name: branchName,
          config,
          commit_sha: commitSha,
        });

        core.info(`Hub ${hub.hubId} synced successfully.`);
      }
    } else if (action === 'publish') {
      for (const hub of changedHubs) {
        core.info(`Publishing hub ${hub.hubId}...`);

        await client.publish({
          hub_id: hub.hubId,
          branch_name: branchName,
        });

        core.info(`Hub ${hub.hubId} published successfully.`);
      }
    } else if (action === 'cleanup') {
      for (const hub of changedHubs) {
        core.info(`Cleaning up branch preview for hub ${hub.hubId}...`);

        await client.cleanup({
          hub_id: hub.hubId,
          branch_name: branchName,
        });

        core.info(`Branch preview for hub ${hub.hubId} cleaned up.`);
      }
    }

    core.setOutput('synced-hubs', changedHubs.map((h) => h.hubId).join(','));
    core.setOutput('hub-count', changedHubs.length.toString());
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed(String(error));
    }
  }
}

run();
