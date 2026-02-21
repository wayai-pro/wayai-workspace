import * as core from '@actions/core';
import { getChangedHubs } from './changed-hubs';
import { parseHubFolder } from './parser';
import { createApiClient } from './api-client';

async function run(): Promise<void> {
  try {
    const apiUrl = core.getInput('api-url', { required: true });
    const apiToken = core.getInput('api-token', { required: true });

    const client = await createApiClient(apiUrl, apiToken);
    const changedHubs = getChangedHubs();

    if (changedHubs.length === 0) {
      core.info('No hub changes detected. Nothing to do.');
      return;
    }

    core.info(`Found ${changedHubs.length} changed hub(s).`);

    for (const hub of changedHubs) {
      core.info(`Pushing hub ${hub.hubId} from ${hub.hubFolder}...`);

      const config = parseHubFolder(hub.hubFolder);

      await client.push({
        hub_id: hub.hubId,
        config,
      });

      core.info(`Hub ${hub.hubId} pushed successfully.`);
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
