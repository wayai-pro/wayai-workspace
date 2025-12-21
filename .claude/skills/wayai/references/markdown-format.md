# Markdown File Format

Conventions for exporting WayAI configurations to Markdown files.

## Table of Contents
- [Directory Structure](#directory-structure)
- [Slugification Rules](#slugification-rules)
- [System Fields](#system-fields)
- [Hub File Template](#hub-file-template-hubmd)
- [Agent Config File](#agent-config-file-agent-slugmd)
- [Agent Instructions File](#agent-instructions-file-agent-slug-instructionsmd)
- [Custom Tool Definition](#custom-tool-definition)
- [Export Workflow](#export-workflow)
- [Import Workflow](#import-workflow)

## Directory Structure

```
workspace.md                              # Workspace overview (orgs/projects/hubs index)
{org-slug}/                               # Organization folder
└── {project-slug}/                       # Project folder
    └── {hub-slug}/                       # Hub folder
        ├── hub.md                        # Hub settings + connections table
        ├── {agent-slug}.md               # Agent config (metadata + tools)
        └── {agent-slug}-instructions.md  # Agent instructions
```

## Slugification Rules

Convert names to URL-safe slugs:

| Original | Slug |
|----------|------|
| `Mario's Pizza` | `marios-pizza` |
| `Order Taker Agent` | `order-taker-agent` |
| `Suporte Nível 2` | `suporte-nivel-2` |
| `Support Hub 2.0` | `support-hub-20` |

Rules:
1. Lowercase
2. Normalize accents (NFD + strip diacritics)
3. Replace non-alphanumeric with hyphens
4. Remove leading/trailing hyphens
5. Limit to 50 characters

## System Fields

Fields prefixed with `_wayai_` are system-managed - **NEVER edit**:

| Field | Description |
|-------|-------------|
| `_wayai_id` | Database primary key |
| `_wayai_created_at` | Creation timestamp |
| `_wayai_updated_at` | Last update timestamp |

Claude uses `_wayai_id` to match files to database records.

## Hub File Template (hub.md)

```markdown
---
_wayai_id: {hub_id}
name: {name}
description: {description}
hub_type: user
ai_mode: Pilot+Copilot
followup_message: {followup_message}
inactivity_interval: {minutes}
---

# {name}

{description}

## Connections

| Name | Type | Status |
|------|------|--------|
| WhatsApp Business | whatsapp | enabled |
| OpenAI | agent | enabled |
| Order System | webhook | disabled |

## Agents

| Agent | Role | Config | Instructions |
|-------|------|--------|--------------|
| Support Agent | Pilot | `support-agent.md` | `support-agent-instructions.md` |
| Escalation Agent | Specialist for Pilot | `escalation-agent.md` | `escalation-agent-instructions.md` |
```

## Agent Config File ({agent-slug}.md)

Agent configuration with metadata and tools (no instructions body).

```markdown
---
agent_id: {agent_id}
name: {name}
role: Pilot
model: gpt-4o
temperature: 0.7
tools:
  native:
    - tool_id: {tool_id}
      tool_name: web_search
  custom:
    - tool_id: {tool_id}
      tool_name: check_order
      tool_description_ai: "Check order status"
      tool_method: GET
---
```

## Agent Instructions File ({agent-slug}-instructions.md)

Agent instructions in a separate file for easier editing.

```markdown
---
agent_id: {agent_id}
---

You are a helpful support agent...

{full instructions here}
```

## Custom Tool Definition

In agent frontmatter under `tools.custom`:

```yaml
tools:
  custom:
    - name: "create_order"
      description: "Creates a new order"
      method: POST
      connection_type: webhook
      endpoint_path: "/orders"
    - name: "get_menu"
      description: "Retrieves menu items"
      method: GET
      connection_type: webhook
      endpoint_path: "/menu"
```

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Tool name (snake_case recommended) |
| `description` | string | What the tool does (for AI) |
| `method` | enum | HTTP method: GET, POST, PUT, DELETE, PATCH |
| `connection_type` | string | Connection to use (e.g., "webhook") |
| `endpoint_path` | string | API path appended to connection base URL |

## Export Workflow

### Using export_workspace (Recommended)

```
1. export_workspace() → download URL
2. Download and extract zip
3. Replace local org folders
4. git diff to review
5. git commit
```

### Manual Export

```
1. get_workspace() → discover hubs
2. get_hub(hub_id) → full schema
3. get_agent(hub_id, agent_id, include_instructions=true) → each agent
4. Convert to Markdown using templates above
5. Save to appropriate folder structure
```

## Import Workflow

```
1. Read Markdown files (parse YAML frontmatter)
2. get_hub(hub_id) → current state
3. Compare fields → identify changes
4. Apply via MCP:
   - update_hub() for hub changes
   - update_agent() for agent changes
   - add_native_tool() / remove_tool() for tool changes
```

## Key Principle

**Database is the source of truth.** Markdown files are working copies for version control and editing. Always sync from database before making changes.
