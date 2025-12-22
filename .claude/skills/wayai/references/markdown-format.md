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
workspace.md                              # Workspace overview (orgs/projects/hubs index)
{org-slug}/                               # Organization folder
└── {project-slug}/                       # Project folder
    └── {hub-slug}/                       # Hub folder
        ├── hub.md                        # Hub settings + agents config + connections table
        └── {agent-slug}.md               # Agent instructions only
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
hub_id: {hub_id}
name: {name}
description: {description}
hub_type: user
ai_mode: Pilot+Copilot
followup_message: {followup_message}
inactivity_interval: {minutes}
agents:
  - agent_id: {agent_id}
    name: "Support Agent"
    role: Pilot
    model: gpt-4o
    temperature: 0.7
    instructions_file: support-agent.md
    tools:
      native:
        - tool_id: {tool_id}
          tool_name: web_search
      custom:
        - tool_id: {tool_id}
          tool_name: check_order
          tool_description_ai: "Check order status"
          tool_method: GET
  - agent_id: {agent_id}
    name: "Escalation Agent"
    role: Specialist for Pilot
    model: gpt-4o
    temperature: 0.5
    instructions_file: escalation-agent.md
---

# {name}

{description}

## Connections

| Name | Type | Status |
|------|------|--------|
| WhatsApp Business | whatsapp | enabled |
| OpenAI | agent | enabled |
| Order System | webhook | disabled |
```

## Agent Instructions File ({agent-slug}.md)

Agent instructions in a separate file for easier editing. The agent configuration (model, temperature, tools) is in hub.md.

```markdown
---
agent_id: {agent_id}
agent_name: "Support Agent"
---

You are a helpful support agent...

{full instructions here}
```

## Custom Tool Definition

In hub.md under agent's `tools.custom`:

```yaml
agents:
  - agent_id: {agent_id}
    name: "Order Agent"
    tools:
      custom:
        - tool_id: {tool_id}
          tool_name: create_order
          tool_description_ai: "Creates a new order"
          tool_method: POST
        - tool_id: {tool_id}
          tool_name: get_menu
          tool_description_ai: "Retrieves menu items"
          tool_method: GET
```

| Field | Type | Description |
|-------|------|-------------|
| `tool_name` | string | Tool name (snake_case recommended) |
| `tool_description_ai` | string | What the tool does (for AI) |
| `tool_method` | enum | HTTP method: GET, POST, PUT, DELETE, PATCH |
| `tool_url` | string | Full endpoint URL template |
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
2. curl -L "{url}" -o {agentname}.md  # Save to disk (avoids context bloat)
3. Read("{agentname}.md") when needed
```

## Import Workflow

```
1. Read Markdown files (parse YAML frontmatter)
2. get_hub(hub_id) → current state
3. Compare fields → identify changes
4. Apply via MCP:
   - update_hub() for hub changes
   - update_agent() for agent settings changes
   - get_agent_instructions_upload_url() + curl for instruction changes
   - add_native_tool() / remove_tool() for tool changes
```

## Key Principle

**Database is the source of truth.** Markdown files are working copies for version control and editing. Always sync from database before making changes.
