# Markdown File Format

Conventions for exporting WayAI configurations to Markdown files.

## Table of Contents
- [Directory Structure](#directory-structure)
- [Slugification Rules](#slugification-rules)
- [System Fields](#system-fields)
- [Hub File Template](#hub-file-template-hubmd)
- [Agent Instructions File](#agent-instructions-file-agent-slugmd)
- [Custom Tool Definition](#custom-tool-definition)
- [Export Workflow](#export-workflow)
- [Import Workflow](#import-workflow)

## Directory Structure

```
workspace/                                # Workspace folder (from download_workspace)
├── workspace.md                          # Workspace overview (orgs/projects/hubs index)
├── last-sync.md                          # Sync metadata
└── {org-slug}/                           # Organization folder
    └── {project-slug}/                   # Project folder
        └── {hub-slug}/                   # Hub folder
            ├── hub.md                    # Hub settings + agents config + connections table
            └── {agent-slug}-instructions.md  # Agent instructions only
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

Hub file contains all settings in YAML frontmatter, including full agents configuration with tools.

```markdown
---
name: {name}
description: {description}
hub_type: user
ai_mode: Pilot+Copilot
followup_message: {followup_message}
inactivity_interval: {minutes}
connections:
  - connector_name: WhatsApp
    connector_id: "uuid-from-database"
    connector_type: Channel
  - connector_name: OpenAI
    connector_id: "uuid-from-database"
    connector_type: Agent
agents:
  - agent_name: "Support Agent"
    agent_role: Pilot
    model: gpt-4o
    temperature: 0.7
    instructions_file: support-agent-instructions.md
    tools:
      native:
        - connector_name: Wayai Conversation
          connector_id: "uuid-from-database"
          tools:
            - tool_name: Close Conversation
              tool_native_id: "uuid-from-database"
      custom:
        - tool_id: {tool_id}
          tool_name: check_order
          tool_description: "Check order status"
          method: GET
  - agent_name: "Escalation Agent"
    agent_role: Specialist for Pilot
    model: gpt-4o
    temperature: 0.5
    instructions_file: escalation-agent-instructions.md
---

# {name}

{description}
```

## Agent Instructions File ({agent-slug}-instructions.md)

Agent instructions in a separate file for easier editing. The agent configuration (model, temperature, tools) is in hub.md.

```markdown
---
agent_name: "Support Agent"
---

You are a helpful support agent...

{full instructions here}
```

## Custom Tool Definition

In hub.md under agent's `tools.custom`:

```yaml
agents:
  - agent_name: "Order Agent"
    tools:
      custom:
        - tool_id: {tool_id}
          tool_name: create_order
          tool_description: "Creates a new order"
          method: POST
        - tool_id: {tool_id}
          tool_name: get_menu
          tool_description: "Retrieves menu items"
          method: GET
```

| Field | Type | Description |
|-------|------|-------------|
| `tool_name` | string | Tool name (snake_case recommended) |
| `tool_description` | string | What the tool does (for AI) |
| `method` | enum | HTTP method: GET, POST, PUT, DELETE, PATCH |
| `endpoint` | string | Full endpoint URL template |
| `tool_instructions` | string | Usage instructions for the AI |

## Download Workflow

### Using download_workspace (Recommended)

```
1. download_workspace() → download URL
2. Download and extract zip
3. Replace local org folders
4. git diff to review
5. git commit
```

### Downloading Agent Instructions

```
1. download_agent_instructions(hub_id, agent_id) → download URL
2. curl -L "{url}" -o workspace/{org}/{project}/{hub}/{agentname}-instructions.md
3. Read the workspace file when needed
```

## Import Workflow

```
1. Read Markdown files (parse YAML frontmatter)
2. get_hub(hub_id) → current state
3. Compare fields → identify changes
4. Apply via MCP:
   - update_hub() for hub changes
   - update_agent() for agent settings changes
   - upload_agent_instructions() for instruction changes
   - add_native_tool() / remove_tool() for tool changes
```

## Key Principle

**Database is the source of truth.** Markdown files are working copies for version control and editing. Always sync from database before making changes.
