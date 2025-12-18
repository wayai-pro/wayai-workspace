# Markdown File Format

Conventions for exporting WayAI configurations to Markdown files.

## Table of Contents
- [Directory Structure](#directory-structure)
- [Slugification Rules](#slugification-rules)
- [System Fields](#system-fields)
- [Hub File Template](#hub-file-template-hubmd)
- [Agent File Template](#agent-file-template-agent-slugmd)
- [Custom Tool Definition](#custom-tool-definition)
- [Export Workflow](#export-workflow)
- [Import Workflow](#import-workflow)

## Directory Structure

```
workspace.md                        # Workspace overview (orgs/projects/hubs index)
{org-slug}/                         # Organization folder
└── {project-slug}/                 # Project folder
    └── {hub-slug}/                 # Hub folder
        ├── hub.md                  # Hub settings + connections table
        └── {agent-slug}.md         # Agent files (one per agent)
```

## Slugification Rules

Convert names to URL-safe slugs:

| Original | Slug |
|----------|------|
| `Mario's Pizza` | `marios-pizza` |
| `Order Taker Agent` | `order-taker-agent` |
| `Support Hub 2.0` | `support-hub-20` |

Rules:
1. Lowercase
2. Replace spaces with hyphens
3. Remove special characters (except hyphens)
4. Remove consecutive hyphens

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

| Agent | Role | File |
|-------|------|------|
| Support Agent | Pilot | `support-agent.md` |
| Escalation Agent | Specialist for Pilot | `escalation-agent.md` |
```

## Agent File Template ({agent-slug}.md)

```markdown
---
_wayai_id: {agent_id}
name: {name}
role: Pilot
model: gpt-4o
temperature: 0.7
tools:
  native:
    - web_search
    - send_email
  custom:
    - name: check_order
      description: Check order status
      method: GET
      endpoint: /orders/{id}
---

{instructions go here as the body}

You are a helpful support agent...
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
