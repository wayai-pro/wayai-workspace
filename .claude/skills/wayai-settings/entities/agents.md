# Agents

## Overview

Agents are AI personalities within a hub. Each agent has a role, instructions, LLM configuration, and a set of tools it can use.

```
Organization
└── Project
    └── Hub
        ├── Connections
        └── Agents (you are here) → Tools
```

## MCP vs UI

| Operation | MCP | UI | Details |
|-----------|-----|----|---------|
| List agents | `get_hub(hub_id)` | - | Included in hub schema |
| View agent | `get_agent(hub_id, agent_id)` | wayai.pro | Full details with instructions |
| Create agent | `create_agent(hub_id, ...)` | wayai.pro | Full MCP support |
| Update agent | `update_agent(hub_id, agent_id, ...)` | wayai.pro | Full MCP support |
| Delete agent | `delete_agent(hub_id, agent_id, confirm=true)` | wayai.pro | Requires confirmation |

## Fields

| Field | Type | Editable | Description |
|-------|------|----------|-------------|
| `_wayai_id` | string | NO | System ID - DO NOT EDIT |
| `name` | string | Yes | Agent display name |
| `role` | string | Yes | Brief description of agent's function |
| `model` | string | Yes | LLM model (e.g., gpt-4o, gpt-4o-mini) |
| `temperature` | number | Yes | Model temperature (0-2) |
| `tools.native` | array | Yes | Native tool IDs assigned to agent |
| `tools.custom` | array | Yes | Custom tool definitions |
| `instructions` | markdown | Yes | System instructions (in body) |

## MCP Tools

### get_agent
Get agent details including tools and optionally instructions.
```
get_agent(
  hub_id,                    # Required
  agent_id,                  # Required
  include_instructions=false # Optional: include full instructions (more tokens)
)
```

### create_agent
Create a new agent in the hub.
```
create_agent(
  hub_id,        # Required
  agent_name,    # Required
  agent_role,    # Optional
  instructions,  # Optional
  model,         # Optional: default varies by plan
  temperature    # Optional: default 0.7
)
```

### update_agent
Update an existing agent.
```
update_agent(
  hub_id,        # Required
  agent_id,      # Required
  agent_name,    # Optional
  agent_role,    # Optional
  instructions,  # Optional
  model,         # Optional
  temperature    # Optional
)
```

### delete_agent
Remove an agent from the hub.
```
delete_agent(
  hub_id,        # Required
  agent_id,      # Required
  confirm=true   # Required: must be true to confirm deletion
)
```

## Markdown Template

```markdown
---
_wayai_id: {agent_id}
name: {name}
role: {role}
model: {model}
temperature: {temperature}
tools:
  native:
    - web_search
    - send_whatsapp_message
  custom:
    - name: create_order
      description: Creates a new order
      method: POST
      endpoint: /orders
---

{instructions}
```

## File Location

```
organizations/
└── {org-name-slugified}/
    └── projects/
        └── {project-name-slugified}/
            └── hubs/
                └── {hub-name-slugified}/
                    └── agents/
                        └── {agent-name-slugified}.md
```

## Examples

**Viewing an agent:**
```
User: "Show me the Order Taker agent"

Claude:
1. get_workspace() → find hub_id
2. get_agent(hub_id, agent_id, include_instructions=true)
3. Convert to Markdown and display
```

**Creating a new agent:**
```
User: "Create a support agent for handling refunds"

Claude:
1. create_agent(
     hub_id,
     agent_name="Refund Support",
     agent_role="Handles customer refund requests",
     instructions="You are a helpful support agent...",
     model="gpt-4o",
     temperature=0.7
   )
2. Save to agents/refund-support.md
```

**Updating agent instructions:**
```
User: "Update the Order Taker to be more friendly"

Claude:
1. get_agent(hub_id, agent_id, include_instructions=true) → get current
2. Modify instructions to add friendly tone
3. update_agent(hub_id, agent_id, instructions="...")
4. Update local Markdown file
```

**Deleting an agent:**
```
User: "Delete the old Test Agent"

Claude:
1. Confirm with user: "Are you sure you want to delete Test Agent?"
2. If yes: delete_agent(hub_id, agent_id, confirm=true)
3. Remove local Markdown file
```

**Adding tools to an agent:**
See [tools.md](tools.md) for tool management operations.
