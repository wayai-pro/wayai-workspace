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

| Field | Type | Required | Editable | Description |
|-------|------|----------|----------|-------------|
| `_wayai_id` | string | - | NO | System ID - DO NOT EDIT |
| `name` | string | **Yes** | Yes | Agent display name |
| `role` | enum | **Yes** | Yes | Agent role (see roles below) |
| `connection_id` | string | **Yes** | No | LLM connection ID (auto-selected if not provided) |
| `instructions` | markdown | **Yes** | Yes | System instructions (in body) |
| `model` | string | No | Yes | LLM model (e.g., gpt-4o, gpt-4o-mini) |
| `temperature` | number | No | Yes | Model temperature (0-2) |
| `tools.native` | array | No | Yes | Native tool IDs assigned to agent |
| `tools.custom` | array | No | Yes | Custom tool definitions |

## Agent Roles

| Role | Description |
|------|-------------|
| `Pilot` | Main AI agent that handles conversations autonomously |
| `Copilot` | AI assistant that helps human operators |
| `Specialist for Pilot` | Expert agent called by Pilot for specific tasks |
| `Specialist for Copilot` | Expert agent called by Copilot for specific tasks |
| `Consultant for Pilot` | Advisory agent for Pilot decisions |
| `Consultant for Copilot` | Advisory agent for Copilot decisions |
| `Monitor` | Observes conversations without participating |
| `Evaluator of Conversations` | Evaluates full conversations |
| `Evaluator of Messages` | Evaluates individual messages |

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

**Prerequisite:** The hub must have an **Agent connection** (OpenAI or OpenRouter) configured before creating agents. Add connections via UI: wayai.pro → Hub → Connections.

```
create_agent(
  hub_id,        # Required
  agent_name,    # Required
  agent_role,    # Required: Pilot, Copilot, Specialist for Pilot, etc.
  instructions,  # Required: system instructions for the agent
  connection_id, # Optional: LLM connection ID (auto-selects if not provided)
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

Agent files live directly in the hub folder:

```
{org-slug}/
└── {project-slug}/
    └── {hub-slug}/
        ├── hub.md                  # Hub settings + connections + agents index
        └── {agent-slug}.md         # Agent file
```

The `hub.md` file contains an agents index table linking to each agent file.

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
     agent_role="Specialist for Pilot",
     instructions="You are a helpful support agent...",
     model="gpt-4o",
     temperature=0.7
   )
2. Save to {org}/{project}/{hub}/refund-support.md
3. Update hub.md agents table with new entry
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
3. Remove agent file from {org}/{project}/{hub}/
4. Update hub.md agents table to remove entry
```

**Adding tools to an agent:**
See [tools.md](tools.md) for tool management operations.
