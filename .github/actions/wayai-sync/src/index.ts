import * as core from '@actions/core';
import { getChangedHubs } from './changed-hubs';
import { parseHubFolder } from './parser';
import { createApiClient } from './api-client';

const DIFF_COMMENT_MARKER = '<!-- wayai-diff -->';

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
      core.info('No hub changes detected. Nothing to do.');
      return;
    }

    const previewHubs = changedHubs.filter((h) => h.hubEnvironment === 'preview');
    const productionHubs = changedHubs.filter((h) => h.hubEnvironment === 'production');

    core.info(`Found ${changedHubs.length} changed hub(s): ${previewHubs.length} preview, ${productionHubs.length} production`);

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
      const diffSummaries: Array<{ hubId: string; summary: string }> = [];

      // Preview hubs: push config directly (same as CLI push)
      for (const hub of previewHubs) {
        core.info(`Pushing preview hub ${hub.hubId} from ${hub.hubFolder}...`);

        const config = parseHubFolder(hub.hubFolder);

        try {
          const diffResult = await client.diff({
            hub_id: hub.hubId,
            config,
          });

          if (diffResult.has_changes) {
            diffSummaries.push({ hubId: hub.hubId, summary: diffResult.summary });
          }
        } catch (err) {
          core.warning(`Could not compute diff for hub ${hub.hubId}: ${err instanceof Error ? err.message : String(err)}`);
        }

        await client.push({
          hub_id: hub.hubId,
          config,
        });

        core.info(`Preview hub ${hub.hubId} pushed successfully.`);
      }

      // Production hubs: read-only in git (for agent reference). CI does not push to them —
      // all config changes flow through preview hubs. Edit the linked preview hub instead.
      for (const hub of productionHubs) {
        core.warning(`Skipping production hub ${hub.hubId} — production hubs are read-only. Edit the linked preview hub to make changes.`);
      }

      // Post diff summary as PR comment
      const prNumber = getPrNumber();
      if (prNumber && diffSummaries.length > 0) {
        await postDiffComment(prNumber, diffSummaries, 'synced');
      }
    } else if (action === 'publish') {
      // Preview hubs: push final state + sync to production (if linked)
      for (const hub of previewHubs) {
        const config = parseHubFolder(hub.hubFolder);

        core.info(`Pushing preview hub ${hub.hubId} (final state)...`);
        await client.push({
          hub_id: hub.hubId,
          config,
        });

        core.info(`Publishing preview hub ${hub.hubId} to production...`);
        const result = await client.publishPreview({
          hub_id: hub.hubId,
        });

        if (result.synced) {
          core.info(`Preview hub ${hub.hubId} synced to production ${result.production_hub_id}.`);
        } else {
          core.warning(`Preview hub ${hub.hubId} has no linked production hub — nothing published. Run publish_hub() first to link it.`);
        }
      }

      // Production hubs: publish is handled via preview hub → sync. Nothing to do here.
      for (const hub of productionHubs) {
        core.warning(`Skipping production hub ${hub.hubId} — publish flows through the linked preview hub.`);
      }
    } else if (action === 'cleanup') {
      // Preview hubs: skip (permanent hubs, no ephemeral branch preview to clean up)
      for (const hub of previewHubs) {
        core.info(`Skipping cleanup for preview hub ${hub.hubId} (permanent hub).`);
      }

      // Production hubs: no branch previews are created, nothing to clean up.
      for (const hub of productionHubs) {
        core.warning(`Skipping cleanup for production hub ${hub.hubId} — no branch previews created.`);
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

function getPrNumber(): number | null {
  // GitHub event payload for pull_request events
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) return null;

  try {
    const fs = require('fs');
    const event = JSON.parse(fs.readFileSync(eventPath, 'utf-8'));
    return event?.pull_request?.number || null;
  } catch {
    return null;
  }
}

async function postDiffComment(
  prNumber: number,
  summaries: Array<{ hubId: string; summary: string }>,
  status: 'synced' | 'failed'
): Promise<void> {
  const githubToken = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;

  if (!githubToken || !repo) {
    core.info('Skipping PR comment — GITHUB_TOKEN or GITHUB_REPOSITORY not set.');
    return;
  }

  const statusEmoji = status === 'synced' ? '\u2705' : '\u274c';
  const statusText = status === 'synced' ? 'Synced to preview' : 'Sync failed';

  let body = `${DIFF_COMMENT_MARKER}\n## WayAI Hub Sync — ${statusEmoji} ${statusText}\n\n`;

  for (const { hubId, summary } of summaries) {
    body += `### Hub: \`${hubId}\`\n\n`;
    body += `\`\`\`\n${summary}\n\`\`\`\n\n`;
  }

  body += `---\n*Generated by WayAI Hub Sync*`;

  try {
    // Find existing comment to update (upsert)
    const listResponse = await fetch(
      `https://api.github.com/repos/${repo}/issues/${prNumber}/comments?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (listResponse.ok) {
      const comments = (await listResponse.json()) as Array<{ id: number; body: string }>;
      const existing = comments.find((c) => c.body.includes(DIFF_COMMENT_MARKER));

      if (existing) {
        // Update existing comment
        await fetch(
          `https://api.github.com/repos/${repo}/issues/comments/${existing.id}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${githubToken}`,
              'Content-Type': 'application/json',
              Accept: 'application/vnd.github.v3+json',
            },
            body: JSON.stringify({ body }),
          }
        );
        core.info('Updated existing diff comment on PR.');
        return;
      }
    }

    // Create new comment
    await fetch(
      `https://api.github.com/repos/${repo}/issues/${prNumber}/comments`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${githubToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({ body }),
      }
    );
    core.info('Posted diff comment on PR.');
  } catch (err) {
    core.warning(`Failed to post PR comment: ${err instanceof Error ? err.message : String(err)}`);
  }
}

run();
