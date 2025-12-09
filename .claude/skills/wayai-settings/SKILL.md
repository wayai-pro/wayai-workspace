---
name: wayai-settings
description: Configure WayAI, a SaaS platform for AI-powered omnichannel communication hubs that integrate AI agents with human teams across WhatsApp, Email, Instagram, and native App. Use when setting up hubs, editing agents, managing tools, or exporting to version control. Distinguishes MCP-capable operations from UI-only setup.
---

<!-- v2.0.0 -->

# WayAI Settings Skill

## Quick Decision: MCP or UI?

| Entity | MCP | UI Only |
|--------|-----|---------|
| **Organization** | Read (`get_organization`, `get_workspace`) | Create, update, delete, users |
| **Project** | Read, Create (`get_project`, `create_project`) | Update, delete |
| **Hub** | Create, Read, Update (`create_hub`, `get_hub`, `update_hub`) | Delete |
| **Connection** | Enable, disable, sync MCP | Create, delete, OAuth setup |
| **Agent** | Full CRUD | - |
| **Tool** | Full CRUD | - |

See [entities/](entities/) for detailed operations per entity.

## Agent Guideline

Only provide information from this skill, MCP tool descriptions, or MCP resources. Do not invent URLs, paths, or steps.

## Core Workflow

```
BEFORE changes:
1. get_workspace()     → discover hub_id
2. get_hub(hub_id)     → current state (JSON)
3. Convert to Markdown → local files

MAKING changes:
4. Edit Markdown OR use MCP tools directly
5. MCP tools return updated JSON

AFTER changes:
6. Update local Markdown from JSON
7. Commit to Git
```

## Entity Hierarchy

```
Organization          ← UI only
└── Project           ← UI only
    └── Hub           ← UI to create, MCP to configure
        ├── Connections   ← UI to create, MCP to manage
        └── Agents        ← Full MCP control (requires Agent connection)
            └── Tools     ← Full MCP control
```

Setup order: Organization → Project → Hub → Connections → Agents → Tools

## Connection Requirements

Connections must be added via UI before using related features:

| To use... | You need... | Connection Type |
|-----------|-------------|-----------------|
| **Agents** | LLM provider | OpenAI or OpenRouter |
| **Channels** | Messaging channels | WhatsApp, Instagram, Gmail |
| **Custom tools** | External APIs | Webhook |
| **MCP tools** | MCP servers | MCP Server |

**Important:** Add an Agent connection (OpenAI or OpenRouter) before creating agents.

See [workflows/setup-flow.md](workflows/setup-flow.md) for complete guide.

## Repository Structure

```
organizations/
└── {org-slug}/
    ├── org.md
    └── projects/
        └── {project-slug}/
            ├── project.md
            └── hubs/
                └── {hub-slug}/
                    ├── hub.md
                    └── agents/
                        └── {agent-slug}.md
```

**System fields:** `_wayai_*` prefix = system-managed, DO NOT edit.

See [workflows/export-import.md](workflows/export-import.md) for file conventions.

## Using Templates

When user describes a use case, check `wayai-templates/` for matching templates:

```
User: "Set up a pizza ordering hub"

Claude:
1. Check wayai-templates/ → found "pizzeria"
2. Ask: "I found a pizzeria template. Use as starting point?"
3. If yes: Read template, customize, create via MCP
```

See [workflows/templates.md](workflows/templates.md) for template usage.

## MCP Tools Quick Reference

| Operation | Tool |
|-----------|------|
| Discover workspace | `get_workspace` |
| Get organization | `get_organization(organization_id)` |
| Get project | `get_project(project_id)` |
| Create project | `create_project(organization_id, project_name)` |
| Create hub | `create_hub(project_id, hub_name, hub_type, ...)` |
| Get hub schema | `get_hub(hub_id)` |
| Update hub | `update_hub(hub_id, ...)` |
| Get agent | `get_agent(hub_id, agent_id, include_instructions)` |
| Create agent | `create_agent(hub_id, agent_name, ...)` |
| Update agent | `update_agent(hub_id, agent_id, ...)` |
| Delete agent | `delete_agent(hub_id, agent_id, confirm=true)` |
| Add native tool | `add_native_tool(hub_id, agent_id, tool_native_id)` |
| Add custom tool | `add_custom_tool(hub_id, agent_id, tool_name, ...)` |
| Enable/disable tool | `enable_tool` / `disable_tool` |
| Enable/disable connection | `enable_connection` / `disable_connection` |
| Sync MCP server | `sync_mcp_connection(hub_id, connection_id)` |

## Entity Documentation

- [organizations.md](entities/organizations.md) - Organization management
- [projects.md](entities/projects.md) - Project management
- [hubs.md](entities/hubs.md) - Hub settings and AI modes
- [connections.md](entities/connections.md) - Channel and API connections
- [agents.md](entities/agents.md) - Agent configuration
- [tools.md](entities/tools.md) - Native, MCP, and custom tools

## Workflow Guides

- [setup-flow.md](workflows/setup-flow.md) - End-to-end setup order
- [templates.md](workflows/templates.md) - Using hub templates
- [export-import.md](workflows/export-import.md) - Markdown export/import
- [syncing.md](workflows/syncing.md) - Git sync with upstream

## Syncing Updates

```bash
# First-time: add upstream
git remote add upstream https://github.com/wayai-resources/wayai-settings-template.git

# Sync skill & templates
git fetch upstream && git merge upstream/main --no-edit
```

See [workflows/syncing.md](workflows/syncing.md) for conflict resolution.
