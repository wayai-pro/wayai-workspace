import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as yaml from 'js-yaml';

/** Slugify a string: lowercase, normalize accents, replace non-alphanumeric with hyphens.
 *  Keep in sync with cli/src/lib/utils.ts slugify — cannot import due to separate deployment bundle. */
function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
}

const BINARY_EXTENSIONS = new Set([
  'pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico',
  'mp3', 'mp4', 'wav', 'zip', 'tar', 'gz',
  'woff', 'woff2', 'ttf', 'eot',
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function isBinaryFile(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return BINARY_EXTENSIONS.has(ext);
}

function guessMimeType(filename: string): string | undefined {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const mimeMap: Record<string, string> = {
    md: 'text/markdown', txt: 'text/plain', json: 'application/json',
    yaml: 'text/yaml', yml: 'text/yaml', html: 'text/html', css: 'text/css',
    js: 'text/javascript', ts: 'text/typescript', xml: 'text/xml', csv: 'text/csv',
    pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
    gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml', ico: 'image/x-icon',
    mp3: 'audio/mpeg', mp4: 'video/mp4', wav: 'audio/wav',
    zip: 'application/zip', tar: 'application/x-tar', gz: 'application/gzip',
    woff: 'font/woff', woff2: 'font/woff2', ttf: 'font/ttf', eot: 'application/vnd.ms-fontobject',
  };
  return mimeMap[ext];
}

function computeHash(data: Buffer): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

interface HubAsCodeResourceFile {
  id?: string;
  path: string;
  title?: string;
  content?: string;
  content_base64?: string;
  mime_type?: string;
  file_size?: number;
  hash?: string;
}

interface HubAsCodeResource {
  id?: string;
  name: string;
  type?: string;
  description?: string;
  enabled?: boolean;
  user_browsable?: boolean;
  skill_name?: string;
  files?: HubAsCodeResourceFile[];
}

interface HubAsCodeAgentResource {
  name: string;
  resource_id?: string;
  priority?: number;
  enabled?: boolean;
  include_structure_in_prompt?: boolean;
  use_native_integration?: boolean;
}

/** Keep in sync with workers/backend/src/routes/api/ci/types.ts HubAsCodeEval — cannot import due to separate deployment bundle. */
interface HubAsCodeEval {
  id?: string;
  name: string;
  path?: string | null;
  agent: string;
  agent_id?: string;
  runs?: number;
  enabled?: boolean;
  history?: Array<{ role: string; content?: string | null; tool_calls?: unknown }>;
  input: { role: string; content?: string | null; tool_calls?: unknown };
  expected: { role: string; content?: string | null; tool_calls?: unknown };
  evaluator_instructions?: string;
}

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
    id?: string;
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
        id?: string;
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
    resources?: HubAsCodeAgentResource[];
  }>;
  resources?: HubAsCodeResource[];
  evals?: HubAsCodeEval[];
  states?: Array<{
    id?: string;
    name: string;
    scope: string;
    description?: string;
    enabled?: boolean;
    json_schema?: Record<string, unknown>;
    initial_value?: Record<string, unknown>;
  }>;
  connections?: Array<{
    name: string;
    type: string;
    service?: string;
    credential?: string;
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
  resources?: Array<Record<string, unknown>>;
  states?: Array<Record<string, unknown>>;
  connections?: Array<{ name: string; type: string; service?: string; credential?: string }>;
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
      // Explicit path: "agents/pilot.md" or "pilot.md" (legacy)
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
    } else if (resolved.instructions === undefined && typeof agent.name === 'string') {
      // Convention-based: derive path from agent name slug
      const conventionPath = path.join(hubFolder, 'agents', `${slugify(agent.name)}.md`);
      if (fs.existsSync(conventionPath)) {
        resolved.instructions = fs.readFileSync(conventionPath, 'utf-8');
      }
    }

    return resolved;
  });

  // Resolve resource files from disk
  const resources = parseResources(hubFolder, (config.resources || []) as Array<Record<string, unknown>>);

  // Resolve eval files from evals/ directory
  const evals = parseEvals(hubFolder);

  const payload: HubAsCodePayload = {
    version: config.version || 1,
    hub_id: config.hub_id,
    hub_environment: config.hub_environment,
    hub: config.hub as HubAsCodePayload['hub'],
  };

  if (agents && agents.length > 0) {
    payload.agents = agents as HubAsCodePayload['agents'];
  }

  if (resources.length > 0) {
    payload.resources = resources;
  }

  if (evals.length > 0) {
    payload.evals = evals;
  }

  if (config.states && config.states.length > 0) {
    payload.states = config.states as HubAsCodePayload['states'];
  }

  if (config.connections && config.connections.length > 0) {
    payload.connections = config.connections;
  }

  return payload;
}

/**
 * Scan resource directories and populate file entries with content and hashes.
 * Synced with cli/src/lib/parser.ts
 */
function parseResources(
  hubFolder: string,
  configResources: Array<Record<string, unknown>>
): HubAsCodeResource[] {
  const resourcesDir = path.join(hubFolder, 'resources');
  const results: HubAsCodeResource[] = [];

  for (const res of configResources) {
    const resource: HubAsCodeResource = {
      name: res.name as string,
    };
    if (res.id) resource.id = res.id as string;
    if (res.type) resource.type = res.type as string;
    if (res.description) resource.description = res.description as string;
    if (res.enabled === false) resource.enabled = false;
    if (res.user_browsable) resource.user_browsable = res.user_browsable as boolean;
    if (res.skill_name) resource.skill_name = res.skill_name as string;

    // Scan filesystem for files
    const resSlug = slugify(resource.name);
    const resDir = path.join(resourcesDir, resSlug);

    if (fs.existsSync(resDir)) {
      const files = scanResourceFiles(resDir, '');
      if (files.length > 0) {
        resource.files = files;
      }
    }

    results.push(resource);
  }

  return results;
}

/**
 * Recursively scan a resource directory for files.
 * Synced with cli/src/lib/parser.ts
 */
function scanResourceFiles(dir: string, prefix: string): HubAsCodeResourceFile[] {
  const files: HubAsCodeResourceFile[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      files.push(...scanResourceFiles(path.join(dir, entry.name), relPath));
    } else if (entry.isFile()) {
      const fullPath = path.join(dir, entry.name);
      const stat = fs.statSync(fullPath);

      if (stat.size > MAX_FILE_SIZE) {
        console.warn(`  Warning: skipping ${relPath} (${(stat.size / 1024 / 1024).toFixed(1)}MB exceeds 10MB limit)`);
        continue;
      }

      const fileEntry: HubAsCodeResourceFile = {
        path: relPath,
        mime_type: guessMimeType(entry.name),
        file_size: stat.size,
      };

      const data = fs.readFileSync(fullPath);
      fileEntry.hash = computeHash(data);

      if (isBinaryFile(entry.name)) {
        fileEntry.content_base64 = data.toString('base64');
      } else {
        fileEntry.content = data.toString('utf-8');
      }

      files.push(fileEntry);
    }
  }

  return files;
}

/**
 * Recursively scan the evals/ directory for YAML eval files.
 * Each .yaml file becomes one eval entry. Subfolder paths map to eval_path.
 *
 * Examples:
 *   evals/greeting.yaml               → name="greeting", path=null
 *   evals/order-issues/cancellation.yaml → name="cancellation", path="order-issues"
 *   evals/a/b/c/test.yaml             → name="test", path="a/b/c"
 */
function parseEvals(hubFolder: string): HubAsCodeEval[] {
  const evalsDir = path.join(hubFolder, 'evals');
  if (!fs.existsSync(evalsDir)) return [];

  return scanEvalFiles(evalsDir, '');
}

function scanEvalFiles(dir: string, prefix: string): HubAsCodeEval[] {
  const results: HubAsCodeEval[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const subPrefix = prefix ? `${prefix}/${entry.name}` : entry.name;
      results.push(...scanEvalFiles(path.join(dir, entry.name), subPrefix));
    } else if (entry.isFile() && (entry.name.endsWith('.yaml') || entry.name.endsWith('.yml'))) {
      const fullPath = path.join(dir, entry.name);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const parsed = yaml.load(content) as Record<string, unknown> | null;

      if (!parsed || typeof parsed !== 'object') {
        console.warn(`  Warning: skipping invalid eval file ${fullPath}`);
        continue;
      }

      // Validate required fields
      if (!parsed.agent || !parsed.input || !parsed.expected) {
        console.warn(`  Warning: skipping eval file ${fullPath} — missing required fields (agent, input, expected)`);
        continue;
      }

      // Prefer explicit name field (preserves original casing); fall back to filename
      const filenameName = entry.name.replace(/\.(yaml|yml)$/, '');
      const evalName = (typeof parsed.name === 'string' && parsed.name) ? parsed.name : filenameName;

      const evalEntry: HubAsCodeEval = {
        name: evalName,
        agent: parsed.agent as string,
        input: parsed.input as HubAsCodeEval['input'],
        expected: parsed.expected as HubAsCodeEval['expected'],
      };

      if (parsed.id) evalEntry.id = parsed.id as string;
      if (parsed.agent_id) evalEntry.agent_id = parsed.agent_id as string;
      if (prefix) evalEntry.path = prefix;
      if (parsed.runs !== undefined) evalEntry.runs = parsed.runs as number;
      if (parsed.enabled === false) evalEntry.enabled = false;
      if (Array.isArray(parsed.history) && parsed.history.length > 0) {
        evalEntry.history = parsed.history as HubAsCodeEval['history'];
      }
      if (parsed.evaluator_instructions) {
        evalEntry.evaluator_instructions = parsed.evaluator_instructions as string;
      }

      results.push(evalEntry);
    }
  }

  return results;
}
