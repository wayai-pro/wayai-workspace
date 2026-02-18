import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

/**
 * HubAsCodePayload - the JSON representation of a hub folder's configuration.
 * Parsed from wayai.yaml + agents/*.md files.
 */
export interface HubAsCodePayload {
  version: number;
  hub_id: string;
  hub_environment: string;
  hub: {
    name: string;
    description?: string;
    hub_type?: string;
    ai_mode?: string;
    timezone?: string;
    app_permission?: string;
    non_app_permission?: string;
    mcp_access?: string;
    file_handling_mode?: string;
    max_file_size_for_attachment?: number;
    inactivity_interval?: number;
    followup_message?: string;
    hub_sla?: Record<string, number>;
    kanban_statuses?: Array<{ name: string }>;
  };
  agents?: Array<{
    name: string;
    role: string;
    connection: string;
    instructions?: string;
    enabled?: boolean;
    include_message_timestamps?: boolean;
    settings?: Record<string, unknown>;
    response_format?: { type: string; schema_name: string; schema_json: Record<string, unknown> };
    tools?: {
      native?: string[];
      delegation?: Array<{ type: string; tool: string; target: string }>;
      custom?: Array<{
        name: string;
        description?: string;
        method?: string;
        path?: string;
        body_format?: string;
        connection?: string;
        headers?: Record<string, unknown>;
        query_params?: Record<string, unknown>;
        body_params?: Record<string, unknown>;
        instructions?: string;
        enabled?: boolean;
      }>;
    };
  }>;
  states?: Array<{
    name: string;
    scope: string;
    description?: string;
    enabled?: boolean;
    json_schema?: Record<string, unknown>;
    initial_value?: Record<string, unknown>;
  }>;
}

/**
 * Raw YAML structure from wayai.yaml
 */
interface WayaiYaml {
  version?: number;
  hub_id: string;
  hub_environment: string;
  hub: Record<string, unknown>;
  agents?: Array<Record<string, unknown>>;
  states?: Array<Record<string, unknown>>;
}

/**
 * Parse a hub folder into a HubAsCodePayload.
 *
 * Reads wayai.yaml and resolves any agent `instructions` fields that reference
 * .md files (relative paths under agents/) by inlining the file content.
 */
export function parseHubFolder(hubFolder: string): HubAsCodePayload {
  const yamlPath = path.join(hubFolder, 'wayai.yaml');

  if (!fs.existsSync(yamlPath)) {
    throw new Error(`wayai.yaml not found in ${hubFolder}`);
  }

  const yamlContent = fs.readFileSync(yamlPath, 'utf-8');
  const config = yaml.load(yamlContent) as WayaiYaml;

  if (!config || typeof config !== 'object') {
    throw new Error(`Invalid YAML in ${yamlPath}`);
  }

  if (!config.hub_id) {
    throw new Error(`Missing hub_id in ${yamlPath}`);
  }

  if (!config.hub_environment) {
    throw new Error(`Missing hub_environment in ${yamlPath}`);
  }

  // Resolve agent instructions from .md files
  // Synced with cli/src/lib/parser.ts
  const agents = config.agents?.map((agent) => {
    const resolved = { ...agent };

    if (typeof resolved.instructions === 'string' && resolved.instructions.endsWith('.md')) {
      // Instructions can be either:
      //   "agents/pilot.md" (relative to hubFolder — standard format per workspace-format.md)
      //   "pilot.md" (legacy — just filename, looked up under agents/)
      const instrValue = resolved.instructions as string;
      const instructionsPath = instrValue.startsWith('agents/')
        ? path.join(hubFolder, instrValue)
        : path.join(hubFolder, 'agents', instrValue);

      if (fs.existsSync(instructionsPath)) {
        resolved.instructions = fs.readFileSync(instructionsPath, 'utf-8');
      } else {
        throw new Error(
          `Agent instructions file not found: ${instructionsPath} (referenced by agent "${agent.name}")`
        );
      }
    }

    return resolved;
  });

  const payload: HubAsCodePayload = {
    version: config.version || 1,
    hub_id: config.hub_id,
    hub_environment: config.hub_environment,
    hub: config.hub as HubAsCodePayload['hub'],
  };

  if (agents && agents.length > 0) {
    payload.agents = agents as HubAsCodePayload['agents'];
  }

  if (config.states && config.states.length > 0) {
    payload.states = config.states as HubAsCodePayload['states'];
  }

  return payload;
}
