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

**Hub → hub.md** (includes connections table)
```markdown
---
_wayai_id: abc-123
name: Support Hub
description: Customer support automation
hub_type: user
ai_mode: Pilot+Copilot
followup_message: Need anything else?
inactivity_interval: 10
---

# Support Hub

Customer support automation

## Connections

| Name | Type | Status |
|------|------|--------|
| WhatsApp Business | whatsapp | enabled |
| OpenAI | agent | enabled |

## Agents

| Agent | Role | File |
|-------|------|------|
| Support Agent | Pilot | `support-agent.md` |
| Escalation Agent | Specialist for Pilot | `escalation-agent.md` |
```

**Agent → {agent-slug}.md**
```markdown
---
_wayai_id: def-456
name: Support Agent
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

You are a helpful support agent...
```

### Step 3: Save to Repository

```
workspace.md                        # Updated with workspace overview
acme-corp/                          # Organization folder
└── customer-support/               # Project folder
    └── support-hub/                # Hub folder
        ├── hub.md                  # Hub settings + connections
        ├── support-agent.md        # Agent file
        └── escalation-agent.md     # Agent file
```

## Import Workflow (Markdown → MCP)

### Step 1: Read Markdown Files

```
Read hub.md → parse YAML frontmatter + body
Read *.md (excluding hub.md) → parse each agent
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
workspace.md                        # Workspace overview (orgs/projects/hubs)
{org-slug}/                         # Organization folder
└── {project-slug}/                 # Project folder
    └── {hub-slug}/                 # Hub folder
        ├── hub.md                  # Hub settings + connections table
        └── {agent-slug}.md         # Agent files (one per agent)
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
   workspace.md (update with current state)
   acme-corp/customer-support/support-hub/hub.md
   acme-corp/customer-support/support-hub/support-agent.md
   acme-corp/customer-support/support-hub/escalation-agent.md

"Exported 1 organization, 1 project, 1 hub, 2 agents to Markdown."
```

## Full Import Example

```
User: "I updated the support agent instructions, sync to platform"

Claude:
1. Read support-agent.md → parse changes
2. get_agent(hub_id, agent_id) → current state
3. Compare → instructions changed

4. update_agent(hub_id, agent_id, instructions="...")

"Updated Support Agent instructions in platform."
```
