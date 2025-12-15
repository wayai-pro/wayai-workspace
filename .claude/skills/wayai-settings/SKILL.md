---
name: wayai-settings
description: |
  Configure WayAI hubs, agents, and tools via MCP. WayAI is a SaaS platform for
  AI-powered omnichannel communication hubs that integrate AI agents with human
  teams across WhatsApp, Email, Instagram, and native App channels.

  Use this skill when:
  - Learning about WayAI platform concepts (hubs, agents, tools, connections)
  - Managing hub configurations via MCP tools (create, update, delete agents/tools)
  - Navigating the WayAI web app (platform.wayai.pro) structure
  - Using Playwright MCP to provide visual feedback after operations
  - Syncing local markdown files with the WayAI database
  - Using templates to create pre-configured hubs for common use cases
---

<!-- v3.2.0 -->

# WayAI Settings Skill

## Agent Guidelines

- Only provide information from this skill, MCP tool descriptions, or MCP resources
- Do not invent URLs, paths, or steps

## Tool Usage Priority

1. **WayAI MCP Server** - Use for ALL settings operations (CRUD on hubs, agents, tools, connections)
2. **UI (platform.wayai.pro)** - Use when MCP doesn't support the operation (OAuth, delete hub, user management)
3. **Playwright MCP** - Use ONLY for:
   - Visual feedback after MCP operations (OPTIONAL - ask user first)
   - Guiding users through UI-only operations

**Important:** Always ask the user before using Playwright for visual feedback:
> "Would you like me to show you the result in the browser?"

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
| `templates://{lang}/{type}/{category}/{variant}/{file}` | Read specific template file |

See [references/mcp-operations.md](references/mcp-operations.md) for detailed usage.

## Visual Feedback (Optional)

After completing MCP operations, **ask the user** if they want visual confirmation:

> "The agent was created successfully. Would you like me to show you the result in the browser?"

If user says yes:
1. Use Playwright to navigate to platform.wayai.pro
2. Navigate to the relevant section
3. Show the result on screen

**Setup:** `claude mcp add playwright npx @playwright/mcp@latest`

See [workflows/visual-feedback.md](workflows/visual-feedback.md) for patterns.

## Using Templates

Templates are available via MCP resources:

1. **List templates:** Read `templates://index` resource
2. **Get template:** Read `templates://{lang}/{type}/{category}/{variant}/{file}`

```
User: "Preciso de um hub para pizzaria"

Claude:
1. Read resource: templates://index → list available templates
2. Find matching template (pt/vertical/pizzaria/pedidos)
3. Read resource: templates://pt/vertical/pizzaria/pedidos/hub.md
4. Read resource: templates://pt/vertical/pizzaria/pedidos/atendente.md
5. Customize placeholders ({NOME_EMPRESA}, etc.)
6. Create hub and agent via MCP tools
```

**Example URIs:**
- `templates://index` - Template catalog
- `templates://pt/horizontal/sdr/simples/hub.md` - SDR hub config
- `templates://pt/vertical/odonto/agendamento/recepcionista.md` - Dental receptionist agent

## Reference Documentation

| Reference | When to Read |
|-----------|--------------|
| [platform-overview.md](references/platform-overview.md) | Understanding WayAI concepts, entity types, AI modes |
| [ui-navigation.md](references/ui-navigation.md) | Navigating the app with Playwright, app structure |
| [mcp-operations.md](references/mcp-operations.md) | MCP tool details, parameters, examples |
| [markdown-format.md](references/markdown-format.md) | File format conventions, export/import workflows |

## Workflow Guides

| Workflow | When to Use |
|----------|-------------|
| [visual-feedback.md](workflows/visual-feedback.md) | Showing users results after MCP operations |
| [syncing.md](workflows/syncing.md) | Git sync with upstream template repository |

## Syncing Updates

```bash
# First-time: add upstream
git remote add upstream https://github.com/wayai-resources/wayai-settings-template.git

# Sync skill & templates
git fetch upstream && git merge upstream/main --no-edit
```

See [workflows/syncing.md](workflows/syncing.md) for conflict resolution.
