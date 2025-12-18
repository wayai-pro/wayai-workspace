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
- [Core Workflow](#core-workflow)
- [MCP Tools Quick Reference](#mcp-tools-quick-reference)
- [Using Templates](#using-templates)
- [Reference Documentation](#reference-documentation)

## Agent Guidelines

- Only provide information from this skill, MCP tool descriptions, or MCP resources
- Do not invent URLs, paths, or steps
- When editing agent instructions: show proposed changes (before/after), wait for user approval, then update

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
| **Agent** | `get_agent`, `create_agent`, `update_agent`, `delete_agent` |
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
6. Create hub and agent via MCP tools
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
