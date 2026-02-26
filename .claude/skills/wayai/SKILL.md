---
name: wayai
description: |
  Configure WayAI hubs, agents, and tools via files + CLI. Use when: (1) Creating or configuring WayAI hubs,
  (2) Managing AI agents and their tools, (3) Using MCP for analytics and evals,
  (4) Syncing workspace settings with Git, (5) Using hub templates for new deployments.
---

<!-- v3.5.0 -->

# WayAI Skill

## Table of Contents
- [Agent Guidelines](#agent-guidelines)
- [Quick Decision: CLI or UI?](#quick-decision-cli-or-ui)
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
- **Edit local files + `wayai push` for all config changes** — MCP is for reads, analytics, and evals only
- When editing agent instructions, see [Editing Agent Instructions](#editing-agent-instructions)

## Quick Decision: CLI or UI?

| Entity | CLI (`wayai push`) | MCP (read-only) | UI Only |
|--------|-------------------|-----------------|---------|
| **Hub settings** | Edit `wayai.yaml` → push | `get_hub` | Delete, MCP access mode |
| **Agents** | Edit `wayai.yaml` → push | `get_agent` | — |
| **Agent instructions** | Edit `agents/*.md` → push | `download_agent_instructions` | — |
| **Tools** | Edit `wayai.yaml` → push | `get_tool` | — |
| **States** | Edit `wayai.yaml` → push | — | — |
| **Connections** | Edit `wayai.yaml` → push (auto-created from org credentials) | `get_hub` | OAuth setup, delete |
| **Publish/Sync** | — | — | Platform UI |
| **Analytics** | — | Full read access | — |
| **Evals** | — | Read + write (create, run) | — |
| **Skills** | — | Read + write (create, link) | — |
| **Organization** | — | Read (`get_workspace`) | Create, update, delete, users |
| **Org Credential** | — | — | Create, update, delete |

## Entity Hierarchy

```
Organization          ← UI only (signup)
├── Org Credentials   ← UI only (store API keys once, reuse across hubs)
└── Project           ← UI or MCP to create
    └── Hub           ← UI to create; files + CLI for config; publish/sync via UI
        ├── Connections   ← Auto-created by `wayai push` (non-OAuth); OAuth via UI
        └── Agents        ← Files + CLI (wayai.yaml + agents/*.md)
            └── Tools     ← Files + CLI (wayai.yaml)
```

Setup order: Organization (signup) → Org Credentials (UI) → Project (UI) → Hub (UI) → `wayai init` → `wayai pull` → edit files → `wayai push` (auto-creates connections from org credentials)

**Notes:**
- **Wayai connection** (native tools) is auto-created when a hub is created — no setup needed
- Non-OAuth connections (Agent, STT, TTS, Custom Tool) are auto-created by `wayai push` using matching organization credentials
- OAuth connections (WhatsApp, Instagram, Gmail, Google Calendar) require UI setup

### Connection Prerequisites

**Organization credentials (one-time setup in UI):**
- Store API keys at the organization level: UI → Settings → Organization → Credentials tab
- Reusable across hubs — no need to re-enter keys per connection
- Supported auth types: API Key, Bearer Token, Basic Auth

**For creating agents → Agent connection required:**
- OpenAI, OpenRouter, Anthropic, or Google AI Studio
- **How:** Add connection to `wayai.yaml` → `wayai push` auto-creates it from matching org credential
- **Or via UI:** Settings → Hub → Connections → Agent group

**For enabling/creating tools → Tool connection required:**
- **Wayai (auto-created):** Native tools automatically available when hub is created
- **Tool - Native (OAuth):** Google Calendar — UI only
- **Tool - Native (API Key):** External Resources — via `wayai.yaml` + push, or UI
- **Tool - Custom:** Custom API tools — via `wayai.yaml` + push, or UI
- **Tool - MCP:** MCP Server (Token) — via `wayai.yaml` + push, or UI; MCP Server (OAuth) — UI only

## Hub Environments

Hubs use a **preview/production branching** model:

- **New hubs** start as `preview` — fully editable
- **Publish** — first-time promotion to production (clones all config) — via platform UI
- **Sync** — pushes subsequent preview changes to production — via platform UI
- **Replicate Preview** — creates a new preview from production for experimentation — via platform UI
- **Production hubs are read-only** — all config changes must flow through preview → sync

When `get_hub` returns hub info, check the `Environment` field (`[PREVIEW]` or `[PRODUCTION]`) and available operations. See [platform-overview.md](references/platform-overview.md) for details.

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
   For analytics and evals, use MCP tools directly (no file equivalent).

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

### Read operations

| Category | Tools |
|----------|-------|
| **Workspace** | `get_workspace`, `download_workspace`, `download_skill` |
| **Hub** | `get_hub` |
| **Agent** | `get_agent`, `download_agent_instructions` |
| **Tool** | `get_tool` |
| **Analytics** | `get_analytics_variables`, `get_analytics_data`, `get_conversations_list`, `get_conversation_messages` |
| **Evals** | `get_evals`, `get_eval_session_details`, `get_eval_session_runs`, `get_eval_analytics` |
| **Skills** | `list_skills`, `get_skill` |

### Write operations (runtime — not config)

| Category | Tools |
|----------|-------|
| **Analytics** | `pin_analytics_variable` |
| **Evals** | `create_eval`, `update_eval`, `delete_eval`, `create_eval_session`, `run_eval_session` |
| **Skills** | `create_skill`, `update_skill`, `delete_skill`, `link_skill_to_agent`, `unlink_skill_from_agent`, `update_skill_agent_link` |
| **Connection** | `sync_mcp_connection` (refresh tools from MCP server) |

Hub config (agents, tools, connections, states, instructions) is managed via files + `wayai push` — not MCP.

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
3. User creates hub in the platform UI (or it already exists)
4. wayai init --hub <hub-id>  → scope the repo to the hub
5. wayai pull -y              → sync local files
6. Copy template files to workspace/{project}/{hub}/, set hub_id in wayai.yaml
7. Add connections to wayai.yaml (type + service — auto-created from org credentials)
8. Customize placeholders ({NOME_EMPRESA}, etc.)
9. wayai push → creates agents, tools, states, and connections on the hub
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
