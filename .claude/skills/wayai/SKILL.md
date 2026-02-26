---
name: wayai
description: |
  Configure WayAI hubs, agents, and tools via MCP. Use when: (1) Creating or configuring WayAI hubs,
  (2) Managing AI agents and their tools, (3) Working with MCP operations for WayAI platform,
  (4) Syncing workspace settings with Git, (5) Using hub templates for new deployments.
---

<!-- v3.5.0 -->

# WayAI Skill

## Table of Contents
- [Agent Guidelines](#agent-guidelines)
- [Write Path Priority](#write-path-priority)
- [Quick Decision: Files, MCP, or UI?](#quick-decision-files-mcp-or-ui)
- [Entity Hierarchy](#entity-hierarchy)
- [Connection Prerequisites](#️-connection-prerequisites)
- [Hub Environments](#hub-environments)
- [Core Workflow](#core-workflow)
- [MCP Tools Quick Reference](#mcp-tools-quick-reference)
- [Editing Agent Instructions](#editing-agent-instructions)
- [Using Templates](#using-templates)
- [Reference Documentation](#reference-documentation)

## Agent Guidelines

- Only provide information from this skill, MCP tool descriptions, or MCP resources
- Do not invent URLs, paths, or steps
- **Edit local files + `wayai push` for config changes** — use MCP only for operations without file equivalents
- **Never use MCP to write hub config** (agents, tools, hub settings, instructions) when the CLI is available. MCP config writes require `read_write` MCP access and are only for clients without CLI (e.g., Claude.ai, ChatGPT).
- When editing agent instructions, see [Editing Agent Instructions](#editing-agent-instructions)

## Write Path Priority

1. **Files + CLI (`wayai push`)** — for ALL config: hub settings, agents, tools, states, instructions, connections
2. **MCP reads** — for discovery and inspection: `get_workspace`, `get_hub`, `get_agent`, analytics, evals (read)
3. **MCP writes** — **only** when CLI is not available AND hub has `read_write` access (non-repo clients)
4. **UI** — OAuth connections, MCP access mode, delete hubs, publish/sync to production, user management

## Quick Decision: Files, MCP, or UI?

| Entity | CLI (`wayai push`) | MCP (read) | MCP (write — `read_write` only, no CLI) | UI Only |
|--------|-------------------|------------|----------------------------------------|---------|
| **Hub settings** | Edit `wayai.yaml` → push | `get_hub` | `create_hub`, `update_hub` | Delete, MCP access mode |
| **Agents** | Edit `wayai.yaml` → push | `get_agent` | `create_agent`, `update_agent` | — |
| **Agent instructions** | Edit `agents/*.md` → push | `download_agent_instructions` | `upload_agent_instructions` | — |
| **Tools** | Edit `wayai.yaml` → push | `get_tool` | `add_native_tool`, `add_custom_tool` | — |
| **States** | Edit `wayai.yaml` → push | — | — | — |
| **Connections** | Edit `wayai.yaml` → push | `get_hub` | `add_connection` | OAuth setup, delete |
| **Publish/Sync** | — | — | — | Platform UI |
| **Analytics** | — | Full read access | — | — |
| **Evals** | — | Read results | Write (create, run) | — |
| **Skills** | — | Read | Write (create, link) | — |
| **Organization** | — | Read (`get_workspace`) | — | Create, update, delete, users |
| **Org Credential** | — | List | — | Create, update, delete |

## Entity Hierarchy

```
Organization          ← UI only
├── Org Credentials   ← UI to create; MCP to list
└── Project           ← MCP to create
    └── Hub           ← Files + CLI for config; publish/sync via UI
        ├── Connections   ← Files + CLI (non-OAuth); OAuth via UI
        └── Agents        ← Files + CLI (wayai.yaml + agents/*.md)
            └── Tools     ← Files + CLI (wayai.yaml)
```

Setup order: Organization (signup) → Org Credentials (UI) → Project → Hub → Connections (MCP for non-OAuth, UI for OAuth) → Agents + Tools (files + push)

**Notes:**
- **Wayai connection** (native tools) is auto-created when a hub is created — no setup needed
- Non-OAuth connections (Agent, STT, TTS, Custom Tool) can be created via MCP using organization credentials
- OAuth connections (WhatsApp, Instagram, Gmail, Google Calendar) require UI setup

### Connection Prerequisites

**Organization credentials (one-time setup in UI):**
- Store API keys at the organization level: UI → Settings → Organization → Credentials tab
- Reusable across hubs — no need to re-enter keys per connection
- Supported auth types: API Key, Bearer Token, Basic Auth

**For creating agents → Agent connection required:**
- OpenAI, OpenRouter, Anthropic, or Google AI Studio
- **Via MCP:** `list_organization_credentials(org_id)` → `add_connection(hub_id, connector_id, organization_credential_id)`
- **Via UI:** Settings → Hub → Connections → Agent group

**For enabling/creating tools → Tool connection required:**
- **Wayai (auto-created):** Native tools automatically available when hub is created
- **Tool - Native (OAuth):** Google Calendar — UI only
- **Tool - Native (API Key):** External Resources — MCP with org credential or UI
- **Tool - Custom:** Custom API tools — MCP with org credential or UI
- **Tool - MCP:** MCP Server (Token) — MCP with org credential or UI; MCP Server (OAuth) — UI only

## Hub Environments

Hubs use a **preview/production branching** model:

- **New hubs** start as `preview` — fully editable
- **Publish** — first-time promotion to production (clones all config) — via platform UI
- **Sync** — pushes subsequent preview changes to production — via platform UI
- **Replicate Preview** — creates a new preview from production for experimentation — via platform UI
- **Production hubs are read-only** — all config changes must flow through preview → sync

When `get_hub` returns hub info, check the `Environment` field (`[PREVIEW]` or `[PRODUCTION]`) and available operations. See [platform-overview.md](references/platform-overview.md) for details.

### MCP Access Modes

Each hub has an `mcp_access` setting (managed in the platform UI only):

| Mode | Behavior | Default |
|------|----------|---------|
| `read_only` | MCP can read hub config. All writes blocked. | Default |
| `read_write` | MCP can read and write. For non-repo clients without CLI. | — |
| `disabled` | MCP access blocked entirely. | — |

**Important:**
- `mcp_access` can only be changed in the platform UI (not via MCP or CLI)
- Repo users (Claude Code, Cursor): keep `read_only` — use files + `wayai push` for all changes
- Non-repo clients (Claude.ai, ChatGPT): set `read_write` to allow MCP as the write path

## Core Workflow

```
PREREQUISITES (resolve automatically):
0. Check .wayai.yaml at repo root — if hub_id is set, use it.
   If missing, call get_workspace() via MCP to discover hubs,
   then run `wayai init --hub <hub-id>` to scope the repo.

BEFORE changes:
1. wayai pull -y                 → sync local files from platform
2. Read workspace/<hub>/CONTEXT.md → understand hub context (create if missing)

MAKING changes (edit + push = single action):
3. Edit wayai.yaml and/or agents/*.md
4. wayai push -y                 → apply changes to preview hub immediately
   Editing and pushing are a single action — always complete both together.
   If the task requires MCP-only operations (connections, analytics, evals):
   → Use MCP tools, then wayai pull -y to sync back to local files

AFTER changes:
5. Update CONTEXT.md if decisions or context changed
6. Commit and push to main — CI syncs changes to the preview hub automatically
7. If ready for production: sync to production via the platform UI
```

**Hub scope:** Each repo is scoped to a single hub via `.wayai.yaml`. The `hub_id` is set during `wayai init`. All CLI commands operate on that hub only.

### CLI Commands

```bash
wayai init                       # Interactive — pick org/project/hub
wayai init --hub <uuid>          # Direct — set hub_id (for agents/scripting)
wayai pull                       # Pull hub config from platform to local files
wayai push                       # Push local changes to the platform
wayai status                     # Show workspace status (org, project, hub)

# Flags:
#   --yes, -y    Skip confirmation prompts (useful for scripting/CI)
```

Both `pull` and `push` show a diff before applying changes and wait for confirmation. Use `-y` to skip prompts.

Install: `npm install -g @wayai/cli` — authenticate: `wayai login` — scope to hub: `wayai init`

## MCP Tools Quick Reference

### Read operations (work in `read_only` and `read_write`)

| Category | Tools |
|----------|-------|
| **Workspace** | `get_workspace`, `download_workspace`, `download_skill` |
| **Hub** | `get_hub` |
| **Agent** | `get_agent`, `download_agent_instructions` |
| **Tool** | `get_tool` |
| **Connection** | `list_organization_credentials` |
| **Analytics** | `get_analytics_variables`, `get_analytics_data`, `get_conversations_list`, `get_conversation_messages` |
| **Evals** | `get_evals`, `get_eval_session_details`, `get_eval_session_runs`, `get_eval_analytics` |
| **Skills** | `list_skills`, `get_skill` |

### Write operations (require `read_write` access — only for clients without CLI)

| Category | Tools |
|----------|-------|
| **Hub** | `create_hub`, `update_hub` |
| **Agent** | `create_agent`, `update_agent`, `upload_agent_instructions`, `delete_agent` |
| **Tool** | `add_native_tool`, `add_mcp_tool`, `add_custom_tool`, `update_custom_tool`, `enable_tool`, `disable_tool`, `remove_tool`, `remove_custom_tool` |
| **Connection** | `add_connection`, `update_connection`, `enable_connection`, `disable_connection`, `sync_mcp_connection` |
| **Analytics** | `pin_analytics_variable` |
| **Evals** | `create_eval`, `update_eval`, `delete_eval`, `create_eval_session`, `run_eval_session` |
| **Skills** | `create_skill`, `update_skill`, `delete_skill`, `link_skill_to_agent`, `unlink_skill_from_agent`, `update_skill_agent_link` |

See [references/mcp-operations.md](references/mcp-operations.md) for detailed usage.

## Editing Agent Instructions

Agent instructions live as `.md` files in `agents/` — edit them directly and push.

### Default: Edit + Push

```
1. Read the current file: workspace/{project}/{hub}/agents/{agent-name}.md
2. Edit the file with proposed changes
3. Show diff to user, wait for approval
4. wayai push → applies instructions (and any other changes) to the preview hub
```

### Syncing from platform (if instructions were changed outside the repo)

```
# Recommended: pull hub
wayai pull

# Alternative: download a single agent's instructions via MCP
1. download_agent_instructions(hub_id, agent_id) → signed URL
2. curl -L "{url}" -o workspace/{project}/{hub}/agents/{agent-name}.md
```

**File naming convention:**
- Pattern: `agents/{slugified-agent-name}.md`
- Slugify: lowercase, spaces→hyphens, remove special chars
- Examples:
  - Agent "Atendente" → `agents/atendente.md`
  - Agent "Order Taker" → `agents/order-taker.md`
  - Agent "Suporte Nível 2" → `agents/suporte-nvel-2.md`

**Important:**
- Always save instruction files in `workspace/` under `agents/` (never `/tmp` or other locations)
- Instructions support dynamic placeholders like `{{now()}}`, `{{user_name()}}`, `{{state()}}`, etc. — see [agent-placeholders.md](references/agent-placeholders.md)
- `get_agent` excludes instructions to save context — use file reads or `download_agent_instructions`
- Always fetch current instructions before editing to avoid overwriting changes made outside the repo

**Example:**
```
User: "Update the Pilot agent instructions to be more friendly"

Agent:
1. Read workspace/{project}/{hub}/agents/pilot.md
2. Edit the file with proposed changes
3. wayai push -y → applies to preview hub immediately (edit + push = single action)
```

## Using Templates

Templates are bundled in this skill. See [templates.md](references/templates.md) for the full list with paths to hub and agent instruction files.

```
User: "Preciso de um hub para pizzaria"

Agent:
1. Find matching template in references/templates.md
2. Read the hub config and agent instructions from template paths
3. create_hub(project_id, hub_name, hub_type) → get hub_id (MCP — only way to create hubs)
4. list_organization_credentials(org_id) → check for matching credential
5a. If org credential exists: add_connection(hub_id, connector_id, org_credential_id) via MCP
5b. If no org credential: STOP — direct user to UI to create one, then retry
6. Copy template files to workspace/{project}/{hub}/, set hub_id in wayai.yaml
7. Customize placeholders ({NOME_EMPRESA}, etc.)
8. wayai push → creates agents, tools, states on the hub from the files
```

## Reference Documentation

| Reference | When to Read |
|-----------|--------------|
| [platform-overview.md](references/platform-overview.md) | Understanding WayAI concepts, entity types, AI modes |
| [mcp-operations.md](references/mcp-operations.md) | MCP tool details, parameters, examples |
| [analytics.md](references/analytics.md) | Conversation analytics, metrics, and performance analysis |
| [connections.md](references/connections.md) | Setting up hub connections (OAuth, API keys, channels) |
| [native-tools.md](references/native-tools.md) | Native tool parameters and usage by connector |
| [user-tools.md](references/user-tools.md) | Creating custom API tools with placeholders |
| [agent-placeholders.md](references/agent-placeholders.md) | Dynamic placeholders for agent instructions (`{{now()}}`, `{{state()}}`, etc.) |
| [templates.md](references/templates.md) | Available hub templates catalog |
| [template-structure.md](references/template-structure.md) | Template file formats, placeholders, structure |
| [workspace-format.md](references/workspace-format.md) | HubAsCode YAML format, workspace structure, sync workflows |
| [ui-navigation.md](references/ui-navigation.md) | WebMCP tools for navigating the WayAI UI (guided tours, teaching) |
