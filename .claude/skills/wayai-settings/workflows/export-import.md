# Export & Import

## Overview

Export WayAI configurations to Markdown for version control. Import from Markdown to update the platform.

**Key principle:** The database is the source of truth. Markdown files are working copies for version control and editing.

## Export Workflow (MCP → Markdown)

### Step 1: Fetch Current State

```
get_workspace() → discover all orgs, projects, hubs
get_hub(hub_id) → full hub schema with agents and tools
get_agent(hub_id, agent_id, include_instructions=true) → full agent details
```

### Step 2: Convert to Markdown

Use templates from [entities/](../entities/) to convert JSON to Markdown:

**Hub → hub.md**
```markdown
---
_wayai_id: abc-123
name: Support Hub
description: Customer support automation
ai_mode: Pilot+Copilot
followup_message: Need anything else?
inactivity_interval: 10
---

# Support Hub

Customer support automation
```

**Agent → agents/{name}.md**
```markdown
---
_wayai_id: def-456
name: Support Agent
role: Handles customer inquiries
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

You are a helpful support agent...
```

### Step 3: Save to Repository

```
organizations/
└── acme-corp/
    ├── org.md
    └── projects/
        └── customer-support/
            ├── project.md
            └── hubs/
                └── support-hub/
                    ├── hub.md
                    └── agents/
                        └── support-agent.md
```

## Import Workflow (Markdown → MCP)

### Step 1: Read Markdown Files

```
Read hub.md → parse YAML frontmatter + body
Read agents/*.md → parse each agent
```

### Step 2: Compare with Current State

```
get_hub(hub_id) → current state
Compare fields → identify changes
```

### Step 3: Apply Changes via MCP

**Hub changes:**
```
update_hub(hub_id, name="...", description="...", ai_mode="...")
```

**Agent changes:**
```
update_agent(hub_id, agent_id, name="...", instructions="...")
```

**Tool changes:**
```
add_native_tool(hub_id, agent_id, tool_id)
remove_tool(hub_id, agent_id, tool_id)
add_custom_tool(hub_id, agent_id, tool_name="...", ...)
```

## File Structure Convention

### Directory Layout

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

### Slugification Rules

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

### System Fields

Fields prefixed with `_wayai_` are system-managed:

| Field | Description |
|-------|-------------|
| `_wayai_id` | Database primary key - NEVER edit |
| `_wayai_created_at` | Creation timestamp |
| `_wayai_updated_at` | Last update timestamp |

Claude uses `_wayai_id` to match files to database records.

## Full Export Example

```
User: "Export my workspace to Markdown"

Claude:
1. get_workspace() → discover hierarchy

Found:
- Organization: Acme Corp
  - Project: Customer Support
    - Hub: Support Hub (MCP enabled)
    - Hub: Sales Hub (MCP disabled - skipping)

2. For Support Hub:
   get_hub(hub_id) → full schema
   get_agent(hub_id, agent_1, include_instructions=true)
   get_agent(hub_id, agent_2, include_instructions=true)

3. Convert and save:
   organizations/acme-corp/org.md
   organizations/acme-corp/projects/customer-support/project.md
   organizations/acme-corp/projects/customer-support/hubs/support-hub/hub.md
   organizations/acme-corp/projects/customer-support/hubs/support-hub/agents/support-agent.md
   organizations/acme-corp/projects/customer-support/hubs/support-hub/agents/escalation-agent.md

"Exported 1 organization, 1 project, 1 hub, 2 agents to Markdown."
```

## Full Import Example

```
User: "I updated the support agent instructions, sync to platform"

Claude:
1. Read agents/support-agent.md → parse changes
2. get_agent(hub_id, agent_id) → current state
3. Compare → instructions changed

4. update_agent(hub_id, agent_id, instructions="...")

"Updated Support Agent instructions in platform."
```
