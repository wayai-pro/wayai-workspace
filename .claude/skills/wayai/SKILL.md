---
name: wayai
description: |
  Configure WayAI hubs, agents, and tools via MCP. Use when: (1) Creating or configuring WayAI hubs,
  (2) Managing AI agents and their tools, (3) Working with MCP operations for WayAI platform,
  (4) Syncing workspace settings with Git, (5) Using hub templates for new deployments.
---

<!-- v3.2.0 -->

# WayAI Skill

## Table of Contents
- [Agent Guidelines](#agent-guidelines)
- [Tool Usage Priority](#tool-usage-priority)
- [Quick Decision: MCP or UI?](#quick-decision-mcp-or-ui)
- [Entity Hierarchy](#entity-hierarchy)
- [Connection Prerequisites](#️-connection-prerequisites)
- [Core Workflow](#core-workflow)
- [MCP Tools Quick Reference](#mcp-tools-quick-reference)
- [Editing Agent Instructions](#editing-agent-instructions)
- [Using Templates](#using-templates)
- [Reference Documentation](#reference-documentation)

## Agent Guidelines

- Only provide information from this skill, MCP tool descriptions, or MCP resources
- Do not invent URLs, paths, or steps
- When editing agent instructions, follow the [Editing Agent Instructions](#editing-agent-instructions) workflow

## Tool Usage Priority

1. **WayAI MCP Server** - Use for ALL settings operations (CRUD on hubs, agents, tools, connections)
2. **UI (platform.wayai.pro)** - Use when MCP doesn't support the operation (OAuth, delete hub, user management)

## Quick Decision: MCP or UI?

| Entity | MCP | UI Only |
|--------|-----|---------|
| **Organization** | Read (`get_workspace`) | Create, update, delete, users |
| **Project** | Read, Create | Update, delete |
| **Hub** | Create, Read, Update | Delete |
| **Connection** | Enable, disable, sync MCP | Create, delete, OAuth setup |
| **Agent** | Full CRUD | - |
| **Tool** | Full CRUD | - |

## Entity Hierarchy

```
Organization          ← UI only
└── Project           ← MCP to create
    └── Hub           ← Full MCP control
        ├── Connections   ← UI to create, MCP to manage
        └── Agents        ← Full MCP control
            └── Tools     ← Full MCP control
```

Setup order: Organization (signup) → Project → Hub → Connections (UI) → Agents → Tools

### ⚠️ Connection Prerequisites

**For creating agents → Agent connection required:**
- OpenAI or OpenRouter → UI: Settings → Hub → Connections → Agent group

**For enabling/creating tools → Tool connection required:**
- **Auto-enabled (no connection):** Wayai Conversation, Wayai Meta Tools, Wayai Knowledge
- **Tool - Native (OAuth):** Google Calendar, Drive, YouTube
- **Tool - Native (API Key):** Wayai External Storage
- **Tool - User:** Custom API tools (API Key or Basic Auth)
- **MCP - External:** MCP Server tools (Token or OAuth)

## Core Workflow

```
BEFORE changes:
1. get_workspace()     → discover hub_id
2. get_hub(hub_id)     → current state (JSON)

MAKING changes:
3. Use MCP tools OR edit local Markdown files
4. Apply changes via MCP tools

AFTER changes:
5. Update local Markdown files from JSON
6. Commit to Git
```

## MCP Tools Quick Reference

| Category | Tools |
|----------|-------|
| **Workspace** | `get_workspace`, `export_workspace`, `export_skill` |
| **Hub** | `get_hub`, `create_hub`, `update_hub` |
| **Agent** | `get_agent`, `get_agent_instructions`, `create_agent`, `update_agent`, `update_agent_instructions`, `delete_agent` |
| **Tool** | `get_tool`, `add_native_tool`, `add_mcp_tool`, `add_custom_tool`, `update_custom_tool`, `enable_tool`, `disable_tool`, `remove_tool`, `remove_custom_tool` |
| **Connection** | `enable_connection`, `disable_connection`, `sync_mcp_connection` |

**MCP Resources:**
| Resource | Description |
|----------|-------------|
| `templates://index` | List all available hub templates |

**Template Tool:**
| Tool | Description |
|------|-------------|
| `get_template(path)` | Fetch a specific template file content |

See [references/mcp-operations.md](references/mcp-operations.md) for detailed usage.

## Editing Agent Instructions

When working with agent instructions, always follow this workflow to keep files in sync:

```
1. GET: get_agent_instructions(hub_id, agent_id)
   → Returns signed URL (valid 1 hour)

2. FETCH: WebFetch the signed URL
   → Downloads current instructions as markdown

3. EDIT: Write to local file using naming convention:
   → {agentname}-instructions.md (e.g., atendente-instructions.md)
   → User reviews and edits in their editor

4. REVIEW: Show proposed changes (before/after)
   → Wait for user approval before updating

5. UPDATE: update_agent_instructions(hub_id, agent_id, instructions)
   → Uploads new instructions, syncs to database
```

**File Naming Convention:**
- Pattern: `{agentname}-instructions.md`
- Slugify agent name: lowercase, spaces→hyphens, remove special chars
- Examples:
  - Agent "Atendente" → `atendente-instructions.md`
  - Agent "Order Taker" → `order-taker-instructions.md`
  - Agent "Suporte Nível 2" → `suporte-nvel-2-instructions.md`

**Important:**
- `get_agent` excludes instructions (use `get_agent_instructions` instead)
- `update_agent` cannot modify instructions (use `update_agent_instructions` instead)
- Always fetch current instructions before editing to avoid overwriting changes

**Example:**
```
User: "Update the Pilot agent instructions to be more friendly"

Claude:
1. get_agent_instructions(hub_id, agent_id) → signed_url
2. WebFetch(signed_url) → current instructions content
3. Write to local file: atendente-instructions.md
4. Show user: "Here are the current instructions. I'll make them more friendly..."
5. Edit the file with proposed changes
6. Show diff to user, wait for approval
7. update_agent_instructions(hub_id, agent_id, new_instructions)
```

## Using Templates

1. **List templates:** Read `templates://index` resource
2. **Get template:** Use `get_template(path)` tool

```
User: "Preciso de um hub para pizzaria"

Claude:
1. Read resource: templates://index → list available templates
2. Find matching template (pt/vertical/pizzaria/pedidos)
3. get_template("pt/vertical/pizzaria/pedidos/hub.md")
4. get_template("pt/vertical/pizzaria/pedidos/atendente.md")
5. Customize placeholders ({NOME_EMPRESA}, etc.)
6. Create hub via MCP: create_hub(...)
7. ⚠️ STOP: Direct user to UI to create Agent connection (OpenAI/OpenRouter)
8. After connection confirmed, create agent via MCP: create_agent(...)
9. Add tools to agent as needed
```

**Example paths for get_template:**
- `pt/horizontal/sdr/simples/hub.md` - SDR hub config
- `pt/vertical/odonto/agendamento/recepcionista.md` - Dental receptionist agent

## Reference Documentation

| Reference | When to Read |
|-----------|--------------|
| [platform-overview.md](references/platform-overview.md) | Understanding WayAI concepts, entity types, AI modes |
| [mcp-operations.md](references/mcp-operations.md) | MCP tool details, parameters, examples |
| [connections.md](references/connections.md) | Setting up hub connections (OAuth, API keys, channels) |
| [native-tools.md](references/native-tools.md) | Native tool parameters and usage by connector |
| [user-tools.md](references/user-tools.md) | Creating custom API tools with placeholders |
| [templates.md](references/templates.md) | Template format, placeholders, available templates |
| [markdown-format.md](references/markdown-format.md) | File format conventions, export/import workflows |
